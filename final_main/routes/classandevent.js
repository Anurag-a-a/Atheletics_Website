import { Router } from "express";
const router = Router();
import { classData } from "../data/index.js";
import { appointmentData, reviewData, gymData } from "../data/index.js";
import { ensureAuthenticated } from '../middleware.js';
import { userData } from '../data/index.js';
import xss from 'xss';

router
    .route('/')
    .get(ensureAuthenticated, async (req, res) => {
        try {
            const Classes = await classData.getAllClass();
            
            let allClass = Classes.map(c=>{
                if (c.slots.Date){
                    const currentDate = new Date(); 
                    let formattedDate = currentDate.toLocaleDateString('en-US');
                    if (c.slots.Date<=formattedDate){
                        return c;
                    }
                }
            })
            //get all reviewText from review data
            let result = null;
            let data = null;
            async function processData() {
              data = await Promise.all(allClass.map(async item => {
                item.reviewsText = [];
                let reviews = item.reviewIds;
                if (reviews.length !== 0) {
                  await Promise.all(reviews.map(async i => {
                    const text = await reviewData.getReviewById(xss(i));
                    item.reviewsText.push(text.reviewText);
                  }))
                }
                return item;
              }));
            }
            data = await processData();
            res.render('classandevent', { classes: allClass });
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    })
    .post(ensureAuthenticated, async (req, res) => {
        try {
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
                    throw new Error('This time slot has already been booked for this class by the user');
                }
            }
            const newAppointment = await appointmentData.addAppointment(xss(classId), xss(selectedTimeSlotObj), xss(cancelledOrNot));
            await userData.updateAppointment(xss(req.user.id), xss(newAppointment._id.toString()), 'add');
            req.session.forceReload = true;
            res.redirect('/myAppointments');
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });
    router.route('/reviews_add').post(ensureAuthenticated, async (req, res) => {
      try {
          const branchName = 'Union City';
          const gym = await gymData.getGymByBranch(xss(branchName));
          const gymId = gym._id.toString();

          const { classId, reviewText, rating } = req.body;
          console.log(classId)
          console.log(reviewText)
          console.log(rating)
          if (!reviewText) {
              throw "You must provide review information";
          }

          const user = await userData.getUserbyId(xss(req.user.id));
          const userReviews = user.MyReviews;
          console.log(userReviews);
  
          let hasReviewed = false;
          for (const reviewId of userReviews) {
              const review = await reviewData.getReviewById(xss(reviewId.toString()));
              console.log(review)
              if (review.gymId.toString() === gymId && review.classId !== null && review.classId.toString() === classId) {
                  hasReviewed = true;
                  break;
              }
          }
  
          if (hasReviewed === true) {
            return res.json({ success: false, message: 'You have already reviewed this class' });
          }
  
          const newReview = await reviewData.addReview(xss(gymId), xss(classId), xss(reviewText));
          if (!newReview) {
              console.error('Error: newReview is null');
              throw 'Failed to create a new review';
          }
          console.log(newReview);
          await userData.addReviewId(xss(user._id.toString()), xss(newReview._id.toString()));
        req.session.forceReload = true;
        res.status(200).json({ success: true, redirect: '/classandevent' });

      } catch (error) {
        res.status(500).json({ success: false, message: error.toString() });
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