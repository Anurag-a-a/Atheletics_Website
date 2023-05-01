import { Router } from 'express';
const router = Router();
import { reviewData } from '../data/index.js';

router
  .route('/')
  .get(async (req, res) => {
    try {
      const allReviews = await reviewData.getAllReviews();
      res.render('reviews_all', { reviews: allReviews });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

router
  .route('/add')
  .get((req, res) => {
    res.render('reviews_add');
  })
  .post(async (req, res) => {
    try {
      const { gymId, classId, reviewText, rating } = req.body;
      if (!gymId || !reviewText || !rating) {
        res.status(400).json({ error: 'Missing required fields' });
      } else {
        const newReview = await reviewData.addReview(gymId, classId, reviewText, rating);
        res.redirect('/');
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
      res.render('reviews_update', { review: review });
    } catch (error) {
      res.status(404).json({ error: error });
    }
  })
  .post(async (req, res) => {
    try {
      const { gymId, classId, reviewText, rating } = req.body;
      if (!gymId || !reviewText || !rating) {
        res.status(400).json({ error: 'Missing required fields' });
      } else {
        const updatedReview = await reviewData.updateReview(req.params.id, gymId, classId, reviewText, rating);
        res.redirect('/');
      }
    } catch (error) {
      res.status(404).json({ error: error });
    }
  });

router
  .route('/delete/:id')
  .post(async (req, res) => {
    try {
      const deletedReview = await reviewData.removeReview(req.params.id);
      res.redirect('/');
    } catch (error) {
      res.status(404).json({ error: error });
    }
  });

export default router;