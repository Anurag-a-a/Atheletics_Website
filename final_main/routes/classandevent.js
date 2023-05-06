import { Router } from "express";
const router = Router();
import { classData } from "../data/index.js";
import { appointmentData } from "../data/index.js";
import { ensureAuthenticated } from '../middleware.js';
import { userData } from '../data/index.js';


router
    .route('/')
    .get(ensureAuthenticated, async (req, res) => {
        try {
            const allClasses = await classData.getAllClass();
            res.render('classandevent', { classes: allClasses });
        } catch (e) {
            res.status(500).json({ error: error });
        }
    })
    .post(ensureAuthenticated, async (req, res) => {
        try {
            console.log('User in the request:', req.user);
            const { classId, selectedTimeSlot } = req.body;

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
            const newAppointment = await appointmentData.addAppointment(classId, selectedTimeSlotObj, cancelledOrNot);
            await userData.updateAppointment(req.user.id, newAppointment._id.toString(), 'add');
            req.session.forceReload = true;
            // res.redirect('/appointments/success');
            res.redirect('/myAppointments');
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });

// router.get('/add', ensureAuthenticated, (req, res) => {

// }).post(ensureAuthenticated, async (req, res) => {
//     try {
//         const addAppointment = 
//     } catch (e) {

//     }
// });

// router
//     .route('/register')
//     .get(async (req, res) => {
//         if (req.session.class.slots) {
//             return res.redirect('/confirm');
//         } else {
//             return res.redirect('/');
//         }
//     }).post(async (req, res) => {

//     });

export default router;