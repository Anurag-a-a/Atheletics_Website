import { Router } from 'express';
const router = Router();
import { reviewData, userData, appointmentData, gymData, classData } from '../data/index.js';
import { ensureAuthenticated } from '../middleware.js';

router.route('/').get(ensureAuthenticated, async (req, res) => {
  try {
    const user = await userData.getUserbyId(req.user.id);
    const userReviews = user.MyReviews;
    const allReviews = await Promise.all(userReviews.map(async (reviewId) => {
      const review = await reviewData.getReviewById(reviewId);
      
      if (review.gymId) {
        const gym = await gymData.getGymById(review.gymId);
        review.branchName = gym.branchName;
      }
      
      if (review.classId) {
        const classInfo = await classData.getClassbyId(review.classId);
        review.className = classInfo.className;
      }
      
      return review;
    }));
    res.render('reviews_all', { reviews: allReviews });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});


router
  .route('/add')
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const allBranches = await gymData.getAllGyms();
      const pastAppointments = await appointmentData.getPastAppointmentsByUserId(req.user.id);
      console.log(pastAppointments);
      const pastClasses = await Promise.all(pastAppointments.map(async (appointment) => await classData.getClassbyId(appointment.classId)));
      res.render('reviews_add', { branches: allBranches, classes: pastClasses });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  })
  .post(async (req, res) => {
    try {
      const { gymId, classId, reviewText, rating } = req.body;
      const parsedRating = parseFloat(rating);
  
      if ((!gymId && !classId) || !reviewText || (gymId && (!classId && (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5)))) {
        res.status(400).json({ error: 'Missing required fields or invalid rating' });
      } else {
        const ratingNumber = classId ? null : parseFloat(rating);
  
        const newReview = await reviewData.addReview(gymId, classId, reviewText, ratingNumber);
        res.redirect('/myReviews');
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

  router
  .route('/update/:id')
  .get(async (req, res) => {
    try {
      const review = await reviewData.getReviewById(req.params.id);
      const gym = await gymData.getGymById(review.gymId);
      const branchName = gym.branchName;
      let className = null;

      if (review.classId) {
        const classInfo = await classData.getClassbyId(review.classId);
        className = classInfo.className;
      }

      res.render('reviews_update', { review: review, branchName: branchName, className: className });
    } catch (error) {
      res.status(404).json({ error: error.toString() });
    }
  })
  .post(async (req, res) => {
    try {
      const review = await reviewData.getReviewById(req.params.id);
      const { reviewText } = req.body;
      let rating = null;
  
      if (!reviewText || (review.classId === null && !req.body.rating)) {
        res.status(400).json({ error: 'Missing required fields' });
      } else {
        if (review.classId === null) {
          rating = parseFloat(req.body.rating);
          if (isNaN(rating) || rating < 1 || rating > 5) {
            res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
            return;
          }
        }
  
        const updatedReview = await reviewData.updateReview(req.params.id, review.gymId, review.classId, reviewText, rating);
        res.redirect('/myReviews');
      }
    } catch (error) {
      res.status(404).json({ error: error.toString() });
    }
  });

    // router.route('/delete/:id').post(ensureAuthenticated, async (req, res) => {
  //   try {
  //     const reviewToDelete = await reviewData.getReviewById(req.params.id);
  //     if (!reviewToDelete) {
  //       res.status(404).json({ error: 'Review not found' });
  //       return;
  //     }
  
  //     const loggedInUserId = req.user.id;
  //     await userData.removeReviewFromUser(loggedInUserId, req.params.id);
  
  //     if (reviewToDelete.classId) {
  //       await classData.removeReviewFromClass(reviewToDelete.classId, req.params.id);
  //     } else {
  //       await gymData.removeReviewFromGym(reviewToDelete.gymId, req.params.id);
  //     }
  
  //     await reviewData.removeReview(req.params.id);
  //     res.redirect('/myReviews');
  //   } catch (error) {
  //     res.status(500).json({ error: error.toString() });
  //   }
  // });

export default router;
