// {
//   _id: '61f83110b3a1eb1911a2ead',
//   classId: '51f83110b3a1eb1911a2ead',
//   selectedTimeSlot: { Date: '26 May 2023', timing: '10:00 - 12:00' },
//   cancelledOrNot: false
// }

import {appointments} from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import {isValidId, isValidCancelledOrNot, isValidTimeSlot} from "../validateData.js";

const getAllAppointments = async () => {
  const appointmentCollection = await appointments();
  let allAppointments = await appointmentCollection.find({}).toArray();
  if (allAppointments.length === 0) return [];
  if (!allAppointments) throw 'Could not get all appointments';
  for (let i in allAppointments) {
    allAppointments[i]._id = allAppointments[i]._id.toString();
  }
  return allAppointments;
}

const getAppointmentById = async (appointmentId) => {
  appointmentId = isValidId(appointmentId);
  const appointmentCollection = await appointments();
  const appointment = await appointmentCollection.findOne({_id: new ObjectId(appointmentId)});
  if (!appointment) throw 'Error: appointment not found';
  appointment._id = appointment._id.toString();
  return appointment;
}

const addAppointment = async (classId, selectedTimeSlot, cancelledOrNot) => {
  classId = isValidId(classId);
  selectedTimeSlot = isValidTimeSlot(selectedTimeSlot);
  cancelledOrNot = isValidCancelledOrNot(cancelledOrNot);

  const appointmentCollection = await appointments();

  // Check if the time slot is available for the given class
  const existingAppointment = await appointmentCollection.findOne({
    classId: classId,
    selectedTimeSlot: selectedTimeSlot,
    cancelledOrNot: false,
  });

  if (existingAppointment) {
    throw 'This time slot has already been booked for this class';
  }

  let newAppointment = {
    classId: classId,
    selectedTimeSlot: selectedTimeSlot,
    cancelledOrNot: cancelledOrNot,
  };

  const newInsertInfo = await appointmentCollection.insertOne(newAppointment);
  if (!newInsertInfo.acknowledged || !newInsertInfo.insertedId)
    throw 'Insert failed!';

  const newId = newInsertInfo.insertedId.toString();
  const addedAppointment = await getAppointmentById(newId);
  addedAppointment._id = addedAppointment._id.toString();
  return addedAppointment;
};

const removeAppointment = async (appointmentId) => {
  appointmentId = isValidId(appointmentId);
  const deletionInfo = await appointmentCollection.findOneAndDelete({_id: new ObjectId(appointmentId)});
  if (deletionInfo.lastErrorObject.n === 0) {
    throw `Could not delete appointment with id of ${appointmentId}`;
  }
  return {...deletionInfo.value, deleted: true};
}

const updateAppointmentPut = async (appointmentId, classId, selectedTimeSlot, cancelledOrNot) => {
  appointmentId = isValidId(appointmentId);
  classId = isValidId(classId);
  selectedTimeSlot = isValidTimeSlot(selectedTimeSlot);
  cancelledOrNot = isValidCancelledOrNot(cancelledOrNot);

  // Check if there's already an appointment at the selected time slot
  const existingAppointment = await appointments().findOne({
    classId: classId,
    selectedTimeSlot: selectedTimeSlot,
    cancelledOrNot: false
  });
  if (existingAppointment && existingAppointment._id.toString() !== appointmentId) {
    throw 'Error: The selected time slot is already booked.';
  }

  const appointmentUpdateInfo = {
    classId: classId,
    selectedTimeSlot: selectedTimeSlot,
    cancelledOrNot: cancelledOrNot
  }
  const appointmentCollection = await appointments();
  const updatedInfo = await appointmentCollection.findOneAndUpdate(
    {_id: new ObjectId(appointmentId)},
    {$set: appointmentUpdateInfo},
    {returnDocument: 'after'}
  )
  if (updatedInfo.lastErrorObject.n === 0) throw [404, `Error: Update failed, could not find a appointment with id of ${appointmentId}`];
  return await updatedInfo.value;
}

export {
  getAppointmentById,
  getAllAppointments,
  addAppointment,
  removeAppointment,
  updateAppointmentPut
}