import { Router } from 'express';
const router = Router();
import { reviewData, userData, appointmentData, gymData, classData } from '../data/index.js';
import * as middleware from '../middleware.js';
import xss from 'xss';

router.route('/').get(middleware.ensureAuthenticated, async (req, res) => {
  try {
    const user = await userData.getUserbyId(xss(req.user.id));
    const userReviews = user.MyReviews;
    const allReviews = await Promise.all(userReviews.map(async (reviewId) => {
      const review = await reviewData.getReviewById(xss(reviewId));
      
      if (review.gymId) {
        const gym = await gymData.getGymById(xss(review.gymId));
        review.branchName = gym.branchName;
      }
      
      if (review.classId) {
        const classInfo = await classData.getClassbyId(xss(review.classId));
        review.className = classInfo.className;
      }
      
      return review;
    }));
    res.render('reviews_all', { title: 'Gym Brat', reviews: allReviews });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});


router
  .route('/add')
  .get(middleware.reviewMiddleware, async (req, res) => {
    try {
      const allBranches = await gymData.getAllGyms();

      // Get the user's reviews
      const user = await userData.getUserbyId(xss(req.user.id));
      const userReviews = user.MyReviews;
      const reviewedGymIds = new Set();

      for (const reviewId of userReviews) {
        const review = await reviewData.getReviewById(reviewId.toString());
        if (review.classId === null) {
          reviewedGymIds.add(review.gymId.toString());
        }
      }

      res.render('reviews_add', { title: 'Gym Brat',branches: allBranches, reviewedGymIds: Array.from(reviewedGymIds) });
    } catch (error) {
      res.status(400).render('reviews_add', {title: 'Gym Brat', error: error});
    }
  })
  .post(middleware.reviewMiddleware, async (req, res) => {
    try {
      const { gymId, reviewText, rating } = req.body;
      let parsedRating = parseFloat(rating);
  
      const user = await userData.getUserbyId(xss(req.user.id));
      const userReviews = user.MyReviews;
      let hasReviewedGym = false;
  
      for (const reviewId of userReviews) {
        const review = await reviewData.getReviewById(xss(reviewId.toString()));
        if (review.gymId.toString() === gymId && review.classId === null) {
          hasReviewedGym = true;
          break;
        }
      }
  
      if ((!gymId) || !reviewText || (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5)) {
        res.status(400).render('reviews_add', {title: 'Gym Brat', error: 'Missing required fields or invalid rating'});
      } else if (hasReviewedGym) {
        res.status(400).render('reviews_add', {title: 'Gym Brat', error: 'You have already reviewed this gym' });
      } else {
        let ratingNumber = parseFloat(rating);
  
        const newReview = await reviewData.addReview(xss(gymId), null, xss(reviewText), xss(ratingNumber));
        await userData.addReviewId(xss(user._id.toString()), xss(newReview._id.toString()));
        res.redirect('/myReviews');
      }
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  });

  router
  .route('/update/:id')
  .get(middleware.reviewMiddleware,async (req, res) => {
    try {
      const review = await reviewData.getReviewById(xss(req.params.id));
      const gym = await gymData.getGymById(xss(review.gymId));
      const branchName = gym.branchName;
      let className = null;

      if (review.classId) {
        const classInfo = await classData.getClassbyId(xss(review.classId));
        className = classInfo.className;
      }

      res.render('reviews_update', { title: 'Gym Brat', review: review, branchName: branchName, className: className });
    } catch (error) {
      res.status(404).json({ error: error.toString() });
    }
  })
  .post(async (req, res) => {
    try {
      const review = await reviewData.getReviewById(xss(req.params.id));
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
  
        const updatedReview = await reviewData.updateReview(xss(req.params.id), xss(review.gymId), xss(review.classId), xss(reviewText), xss(rating));
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
