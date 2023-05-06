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

const addReview = async (gymId, classId, reviewText, rating = null) => {
  gymId = isValidId(gymId);
  reviewText = isValidreviewText(reviewText);

  const reviewCollection = await reviews();
  const gymCollection = await gyms();
  const classCollection = await classes();

  let query = { gymId: gymId };

  if (classId !== null) {
    classId = isValidId(classId);
    query.classId = classId;
  } else {
    rating = isValidRating(rating);
  }

  // let existingReview = await reviewCollection.findOne(query);

  // if (existingReview !== null) {
  //   throw 'You have already reviewed this ' + (classId ? 'class' : 'gym');
  // } else {
    let newReview = {
      gymId: gymId,
      classId: classId,
      reviewText: reviewText
    };

    if (!classId) {
      newReview.rating = rating;
    }

    const newInsertInfo = await reviewCollection.insertOne(newReview);
    if (!newInsertInfo.acknowledged || !newInsertInfo.insertedId) throw 'Insert failed!';
    const newId = newInsertInfo.insertedId.toString();

    if (classId) {
      const classToUpdate = await classCollection.findOne({ _id: new ObjectId(classId) });
      const updatedReviewIds = [...classToUpdate.reviewIds, newId];

      await classCollection.updateOne(
        { _id: new ObjectId(classId) },
        {
          $set: { reviewIds: updatedReviewIds }
        }
      );
    } else {
      const gymToUpdate = await gymCollection.findOne({ _id: new ObjectId(gymId) });
      const updatedReviewIds = [...gymToUpdate.reviewIds, newId];

      const gymReviews = await reviewCollection.find({ gymId: gymId, classId: null }).toArray();
      const totalRating = gymReviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) + parseFloat(rating);
      const averageRating = totalRating / (gymReviews.length + 1);

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
// }

const removeReview = async (reviewId) => {
  reviewId = isValidId(reviewId);
  const deletionInfo = await appointmentCollection.findOneAndDelete({_id: new ObjectId(reviewId)});
  if (deletionInfo.lastErrorObject.n === 0) {
    throw `Could not delete appointment with id of ${reviewId}`;
  }
  return {...deletionInfo.value, deleted: true};;

}

const updateReview = async (reviewId, gymId, classId, reviewText, rating = null) => {
  reviewId = isValidId(reviewId);
  reviewText = isValidreviewText(reviewText);

  const reviewUpdateInfo = {
    reviewText: reviewText
  };

  if (gymId) {
    gymId = isValidId(gymId);
    reviewUpdateInfo.gymId = gymId;

    if (rating !== null) {
      rating = isValidRating(rating);
      reviewUpdateInfo.rating = rating;
    }
  }

  if (classId) {
    classId = isValidId(classId);
    reviewUpdateInfo.classId = classId;
  }

  const reviewCollection = await reviews();
  const gymCollection = await gyms();
  const classCollection = await classes();

  const currentReview = await reviewCollection.findOne({ _id: new ObjectId(reviewId) });
  const previousRating = parseFloat(currentReview.rating);

  const updatedInfo = await reviewCollection.findOneAndUpdate(
    { _id: new ObjectId(reviewId) },
    { $set: reviewUpdateInfo },
    { returnDocument: 'after' }
  );

  if (updatedInfo.lastErrorObject.n === 0)
    throw `Error: Update failed, could not find a review with id of ${reviewId}`;

  // Update the gym overallRating only if the rating is provided for the gym
  if (gymId && rating) {
    const gymToUpdate = await gymCollection.findOne({ _id: new ObjectId(gymId) });
    const gymReviews = await reviewCollection.find({ gymId: gymId }).toArray();
    const totalRating = gymReviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) - previousRating + parseFloat(rating);
    const averageRating = totalRating / gymReviews.length;

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

const getReviewsByIds = async (ids) => {
  const reviewCollection = await reviews();
  const objectIdList = ids.map(id => new ObjectId(id));
  const foundReviews = await reviewCollection.find({ _id: { $in: objectIdList }, classId: null }).toArray();
  return foundReviews;
};

export {
  getReviewById,
  getAllReviews,
  addReview,
  removeReview,
  updateReview,
  getReviewByGymIdAndClassId,
  getReviewsByIds
}