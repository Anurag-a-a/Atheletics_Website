import { Router } from 'express';
const router = Router();
import { appointmentData } from '../data/index.js';
import { classData } from '../data/index.js';
import { userData } from '../data/index.js';
import { ensureAuthenticated } from '../middleware.js';

router.route('/').get(ensureAuthenticated, async (req, res) => {
  try {
    const user = await userData.getUserbyId(req.user.id);
    const userAppointmentsIds = user.MyAppointments;
    const userAppointments = await Promise.all(
      userAppointmentsIds.map(async appointmentId => {
        return await appointmentData.getAppointmentById(appointmentId);
      })
    );

    const cancelledAppointments = [];
    const activeAppointments = [];
    const pastAppointments = [];
    const currentTime = new Date();

    for (const appointment of userAppointments) {
      const classInfo = await classData.getClassbyId(appointment.classId.toString());
      appointment.className = classInfo.className;

      appointment.selectedTimeSlotString = `${appointment.selectedTimeSlot.Date} ${appointment.selectedTimeSlot.timing}`;

      const appointmentTime = new Date(appointment.selectedTimeSlot.Date + ' ' + appointment.selectedTimeSlot.timing.split(' - ')[1]);

      if (appointment.cancelledOrNot) {
        cancelledAppointments.push(appointment);
      } else if (appointmentTime < currentTime) {
        pastAppointments.push(appointment);
      } else {
        activeAppointments.push(appointment);
      }
    }
    res.render('appointments_all', { activeAppointments, cancelledAppointments, pastAppointments });

  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.route('/update/:id/cancellation').post(async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const cancelledOrNot = req.body.cancelledOrNot;

    if (!appointmentId) {
      throw 'Error: no id provided';
    }

    const appointment = await appointmentData.getAppointmentById(appointmentId);
    const updatedAppointment = await appointmentData.updateAppointmentPut(appointmentId, null, null, cancelledOrNot);

    res.redirect('/myAppointments');
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.get('/success', ensureAuthenticated, (req, res) => {
  if (req.session.forceReload) {
    req.session.forceReload = false;
    res.redirect('/myAppointments');
  } else {
    res.status(404).json({ error: error.toString() });
  }
});

function isFutureClass(classInfo) {
  const currentTime = new Date();
  const classDate = new Date(classInfo.slots.Date);
  return classDate >= currentTime;
}

router.route('/add').get(ensureAuthenticated, async (req, res) => {
  try {
    const allClasses = await classData.getAllClass();
    const futureClasses = allClasses.filter(isFutureClass);
    res.render('appointments_add', { classes: futureClasses });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}).post(ensureAuthenticated, async (req, res) => {
  try {
    const { classId, selectedTimeSlot, cancelledOrNot } = req.body;

    const regex = /^(\d{2}\/\d{2}\/\d{4}) (\d{2}:\d{2}) - (\d{2}:\d{2})$/;
    const match = selectedTimeSlot.match(regex);

    if (!match) {
      throw new Error("Invalid selectedTimeSlot format");
    }

    const date = match[1];
    const startTime = match[2];
    const endTime = match[3];
    const timing = `${startTime} - ${endTime}`;

    const selectedTimeSlotObj = {
      Date: date,
      timing: timing
    };

    const user = await userData.getUserbyId(req.user.id);
    const userAppointments = user.MyAppointments;
    for (const appointmentId of userAppointments) {
      const appointment = await appointmentData.getAppointmentById(appointmentId);
      if (
        appointment.classId.toString() === classId &&
        appointment.selectedTimeSlot.Date === selectedTimeSlotObj.Date &&
        appointment.selectedTimeSlot.timing === selectedTimeSlotObj.timing &&
        !appointment.cancelledOrNot
      ) {
        throw new Error('This time slot has already been booked for this class by the user');
      }
    }
    const newAppointment = await appointmentData.addAppointment(req.user.id,classId, selectedTimeSlotObj, cancelledOrNot);
    await userData.updateAppointment(req.user.id, newAppointment._id.toString(), 'add');
    await classData.updateRegisteredUsers(classId, req.user.id, 'add');
    req.session.forceReload = true;
    // res.redirect('/appointments/success');
    res.redirect('/myAppointments');
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.get('/deleted', ensureAuthenticated, (req, res) => {
  if (req.session.forceReload) {
    req.session.forceReload = false;
    res.redirect('/myAppointments');
  } else {
    res.status(404).json({ error: error.toString() });
  }
});

router.route('/delete/:id').post(ensureAuthenticated, async (req, res) => {
  try {
    const deletedAppointment = await appointmentData.removeAppointment(req.params.id);
    await userData.updateAppointment(req.user.id, req.params.id, 'delete');
    await classData.updateRegisteredUsers(deletedAppointment.classId.toString(), req.user.id, 'delete');
    req.session.forceReload = true;
    res.redirect('/myAppointments/deleted');
  } catch (error) {
    res.status(404).json({ error: error.toString() });
  }
});

export default router;
