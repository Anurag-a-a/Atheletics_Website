import { Router } from 'express';
const router = Router();
import { reviewData, userData, gymData} from '../data/index.js';

router.get('/', async (req, res) => {
  try {
    const allReviews = await reviewData.getAllReviews();
    const allUsers = await userData.getAllUser();

    const users = allUsers.filter(user => user.role === 'user');

    const allUserReviewIds = [];
    users.forEach(user => {
      user.MyReviews.forEach(reviewId => {
        allUserReviewIds.push(reviewId);
      });
    });

    const gymReviews = allReviews.filter(review => review.classId === null && allUserReviewIds.includes(review._id));

    const reviewDataWithUsernames = gymReviews.map(review => {
      const user = users.find(u => u.MyReviews.includes(review._id));
      return {
        ...review,
        username: user ? user.username : 'Unknown User'
      };
    });

    res.render('gymreviews', { title: "Gym Brat", reviews: reviewDataWithUsernames });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

export default router;