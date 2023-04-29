// {
//   _id: '641f83110b3a1eb1911a2ead',
//   gymId: '441f83110b3a1eb1911a2eaa',
//   classId: '741f83110b3a1eb1911a2ead',
//   reviewText: 'The class was really good',
//   rating: 4.9
// }


import {reviews} from "../config/mongoCollections.js";
import {classes} from "../config/mongoCollections.js";
import {gyms} from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import {
  isValidId, isValidRating, isValidreviewText
} from '../validateData.js';

const getAllReviews = async () => {
  const reviewCollection = await reviews();
  const allReviews = await reviewCollection.find({}).toArray();
  if (allReviews.length === 0) return [];
  if (!allReviews) throw 'Could not get all reviews';
  for (let i in allReviews) {
    allReviews[i]._id = allReviews[i]._id.toString();
  }
  return allReviews;
}

const getReviewById = async (reviewId) => {
  reviewId = isValidId(reviewId);
  const reviewCollection = await reviews();
  const review = await reviewCollection.findOne({_id: new ObjectId(reviewId)});
  if (!review) throw 'Error: review not found';
  review._id = review._id.toString();
  return review;
}

const addReview = async (gymId, classId, reviewText, rating) => {
  gymId = isValidId(gymId);
  reviewText = isValidreviewText(reviewText);
  rating = isValidRating(rating);
  const reviewCollection = await reviews();
  const gymCollection = await gyms();
  const classCollection = await classes();

  let query = { gymId: gymId };

  if (classId !== null) {
    classId = isValidId(classId);
    query.classId = classId;
  }

  // Check if user has already reviewed the gym or class
  let existingReview = await reviewCollection.findOne(query);
  
  if (existingReview !== null) {
    throw 'You have already reviewed this ' + (classId ? 'class' : 'gym');
  } else {
    let newReview = {
      gymId: gymId,
      classId: classId,
      reviewText: reviewText,
      rating: rating
    }

    const newInsertInfo = await reviewCollection.insertOne(newReview);
    if (!newInsertInfo.acknowledged || !newInsertInfo.insertedId) throw 'Insert failed!';
    const newId = newInsertInfo.insertedId.toString();

    // Update the gym or class with the new review ID and overallRating
    if (classId) {
      const classToUpdate = await classCollection.findOne({ _id: new ObjectId(classId) });
      const updatedReviewIds = [...classToUpdate.reviewIds, newId];

      const classReviews = await reviewCollection.find({ _id: { $in: updatedReviewIds.map(id => new ObjectId(id)) } }).toArray();
      const averageRating = classReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviewIds.length;

      await classCollection.updateOne(
        { _id: new ObjectId(classId) },
        {
          $set: { reviewIds: updatedReviewIds, overallRating: averageRating }
        }
      );
    } else {
      const gymToUpdate = await gymCollection.findOne({ _id: new ObjectId(gymId) });
      const updatedReviewIds = [...gymToUpdate.reviewIds, newId];

      const gymReviews = await reviewCollection.find({ _id: { $in: updatedReviewIds.map(id => new ObjectId(id)) } }).toArray();
      const averageRating = gymReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviewIds.length;

      await gymCollection.updateOne(
        { _id: new ObjectId(gymId) },
        {
          $set: { reviewIds: updatedReviewIds, overallRating: averageRating }
        }
      );
    }

    const addedReview = await getReviewById(newId);
    addedReview._id = addedReview._id.toString();
    return addedReview;
  }
}

const removeReview = async (reviewId) => {
  reviewId = isValidId(reviewId);
  const deletionInfo = await appointmentCollection.findOneAndDelete({_id: new ObjectId(reviewId)});
  if (deletionInfo.lastErrorObject.n === 0) {
    throw `Could not delete appointment with id of ${reviewId}`;
  }
  return {...deletionInfo.value, deleted: true};;

}

const updateReview = async (reviewId, gymId, classId, reviewText, rating) => {
  reviewId = isValidId(reviewId);
  gymId = isValidId(gymId);
  reviewText = isValidreviewText(reviewText);
  rating = isValidRating(rating);

  const reviewUpdateInfo = {
    gymId: gymId,
    reviewText: reviewText,
    rating: rating
  };

  if (classId !== null) {
    classId = isValidId(classId);
    reviewUpdateInfo.classId = classId;
  }

  const reviewCollection = await reviews();
  const gymCollection = await gyms();
  const classCollection = await classes();

  const updatedInfo = await reviewCollection.findOneAndUpdate(
    { _id: new ObjectId(reviewId) },
    { $set: reviewUpdateInfo },
    { returnDocument: 'after' }
  );

  if (updatedInfo.lastErrorObject.n === 0)
    throw `Error: Update failed, could not find a review with id of ${reviewId}`;

  // Update the gym or class overallRating
  if (classId) {
    const classToUpdate = await classCollection.findOne({ _id: new ObjectId(classId) });
    const classReviews = await reviewCollection.find({ classId: classId }).toArray();
    const averageRating = classReviews.reduce((sum, review) => sum + review.rating, 0) / classReviews.length;

    await classCollection.updateOne(
      { _id: new ObjectId(classId) },
      {
        $set: { overallRating: averageRating }
      }
    );
  } else {
    const gymToUpdate = await gymCollection.findOne({ _id: new ObjectId(gymId) });
    const gymReviews = await reviewCollection.find({ gymId: gymId }).toArray();
    const averageRating = gymReviews.reduce((sum, review) => sum + review.rating, 0) / gymReviews.length;

    await gymCollection.updateOne(
      { _id: new ObjectId(gymId) },
      {
        $set: { overallRating: averageRating }
      }
    );
  }

  const updatedReview = updatedInfo.value;
  updatedReview._id = updatedReview._id.toString();
  return updatedReview;
};

const getReviewByGymIdAndClassId = async (gymId, classId) => {
  const reviewCollection = await reviews();
  let query = {};

  if (gymId && !classId) {
    gymId = isValidId(gymId);
    query.gymId = gymId;
  } else if (!gymId && classId) {
    classId = isValidId(classId);
    query.classId = classId;
  } else {
    throw 'Error: Please provide either gymId or classId';
  }

  const reviewList = await reviewCollection.find(query).toArray();

  return reviewList.map((review) => ({
    ...review,
    _id: review._id.toString()
  }));
};

export {
  getReviewById,
  getAllReviews,
  addReview,
  removeReview,
  updateReview,
  getReviewByGymIdAndClassId
}