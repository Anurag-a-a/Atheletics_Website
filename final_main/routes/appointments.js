import { Router } from 'express';
const router = Router();
import { appointmentData } from '../data/index.js';
import { classData } from '../data/index.js';
import { userData } from '../data/index.js';
import { ensureAuthenticated } from '../middleware.js';
import xss from 'xss';

router.route('/').get(ensureAuthenticated, async (req, res) => {
  try {
    const user = await userData.getUserbyId(xss(req.user.id));
    const userAppointmentsIds = user.MyAppointments;
    const userAppointments = await Promise.all(
      userAppointmentsIds.map(async appointmentId => {
        return await appointmentData.getAppointmentById(xss(appointmentId));
      })
    );

    const cancelledAppointments = [];
    const activeAppointments = [];
    const pastAppointments = [];
    const currentTime = new Date();

    for (const appointment of userAppointments) {
      const classInfo = await classData.getClassbyId(xss(appointment.classId.toString()));
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
    res.render('appointments_all', { title: 'Gym Brat', activeAppointments, cancelledAppointments, pastAppointments });

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

    const appointment = await appointmentData.getAppointmentById(xss(appointmentId));
    const updatedAppointment = await appointmentData.updateAppointmentPut(xss(appointmentId), null, null, xss(cancelledOrNot));

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
    res.render('appointments_add', { title: 'Gym Brat', classes: futureClasses });
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

    const user = await userData.getUserbyId(xss(req.user.id));
    const userAppointments = user.MyAppointments;
    for (const appointmentId of userAppointments) {
      const appointment = await appointmentData.getAppointmentById(xss(appointmentId));
      if (
        appointment.classId.toString() === classId &&
        appointment.selectedTimeSlot.Date === selectedTimeSlotObj.Date &&
        appointment.selectedTimeSlot.timing === selectedTimeSlotObj.timing &&
        !appointment.cancelledOrNot
      ) {
        return res.status(400).render('appointments_add', {title: 'Gym Brat',error: 'This time slot has already been booked' });
      }
    }
    const newAppointment = await appointmentData.addAppointment(xss(req.user.id),xss(classId), selectedTimeSlotObj, xss(cancelledOrNot));
    await userData.updateAppointment(xss(req.user.id), xss(newAppointment._id.toString()), 'add');
    await classData.updateRegisteredUsers(xss(classId), xss(req.user.id), 'add');
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
    const deletedAppointment = await appointmentData.removeAppointment(xss(req.params.id));
    await userData.updateAppointment(xss(req.user.id), xss(req.params.id), 'delete');
    await classData.updateRegisteredUsers(xss(deletedAppointment.classId.toString()), xss(req.user.id), 'delete');
    req.session.forceReload = true;
    res.redirect('/myAppointments/deleted');
  } catch (error) {
    res.status(404).json({ error: error.toString() });
  }
});

export default router;
