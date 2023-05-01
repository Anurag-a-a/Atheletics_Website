import { Router } from 'express';
const router = Router();
import { appointmentData } from '../data/index.js';

router.route('/').get(async (req, res) => {
  try {
    const allAppointments = await appointmentData.getAllAppointments();
    res.render('appointments_all', { appointments: allAppointments });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.route('/add').get((req, res) => {
  res.render('appointments_add');
}).post(async (req, res) => {
  try {
    const { classId, selectedTimeSlot, cancelledOrNot } = req.body;
    const newAppointment = await appointmentData.addAppointment(classId, selectedTimeSlot, cancelledOrNot);
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.route('/update/:id').get(async (req, res) => {
  try {
    const appointment = await appointmentData.getAppointmentById(req.params.id);
    res.render('appointments_update', { appointment: appointment });
  } catch (error) {
    res.status(404).json({ error: error });
  }
}).post(async (req, res) => {
  try {
    const { classId, selectedTimeSlot, cancelledOrNot } = req.body;
    const updatedAppointment = await appointmentData.updateAppointmentPut(req.params.id, classId, selectedTimeSlot, cancelledOrNot);
    res.redirect('/');
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

router.route('/delete/:id').post(async (req, res) => {
  try {
    const deletedAppointment = await appointmentData.removeAppointment(req.params.id);
    res.redirect('/');
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

export default router;
