// {
//   _id: '641f83110b3a1eb1911a2ead',
//   gymId: '441f83110b3a1eb1911a2eaa',
//   classId: '741f83110b3a1eb1911a2ead',
//   reviewText: 'The class was really good',
//   rating: 4.9
// }


import {reviews} from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import {
  isValidId, isValidRating, isValidReviewText 
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
  const review = await reviewCollection.findOne({_id: new ObjectId(id)});
  if (!review) throw 'Error: review not found';
  review._id = review._id.toString();
  return review;

}

const addReview = async (gymId, classId, reviewText, rating) => {
  if(!classId) {
    gymId = isValidId(gymId);
    classId = isValidId(classId);
    reviewText = isValidReviewText(reviewText);
    rating = isValidRating(rating);

    let newReview = {
      _id: new ObjectId(),
      gymId: gymId,
      reviewText: reviewText,
      rating: rating
    }

    const reviewCollection = await reviews();
    const newInsertInfo = await reviewCollection.insertOne(newReview);
    if (!newInsertInfo.insertedID) throw 'Insert failed!';
    const newId = newInsertInfo.insertedID.toString();
    const addedReview = await get(newId);
    addedReview._id = addedReview._id.toString();
    return addedReview;

  } else {
    gymId = isValidId(gymId);
    classId = isValidId(classId);
    reviewText = isValidReviewText(reviewText);
    rating = isValidRating(rating);

    let newReview = {
      _id: new ObjectId(),
      gymId: gymId,
      classId: classId,
      reviewText: reviewText,
      rating: rating
    }

    const reviewCollection = await reviews();
    const newInsertInfo = await reviewCollection.insertOne(newReview);
    if (!newInsertInfo.insertedID) throw 'Insert failed!';
    const newId = newInsertInfo.insertedID.toString();
    const addedReview = await get(newId);
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

export {
  getReviewById,
  getAllReviews,
  addReview,
  removeReview
}