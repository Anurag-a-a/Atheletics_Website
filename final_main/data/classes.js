// {
//   _id: '61f83110b3a1eb1911a2ead',
//   className: 'Yoga',
//   slots: [
//     { Date: '26 May 2023', timings: [Array] },
//     { Date: '27 May 2023', timings: [Array] }
//   ],
//   instructor: 'John Hill',
//   description: 'Rewind, revive with this yoga session.',
//   registeredUsers: [
//     '61f83110b3a1eb1911a2ead',
//     '61f83110b3a1eb1911a2eaa',
//     '61f83110b3a1eb1911a2eac'
//   ],
//   reviews: [
//     '41f83110b3a1eb1911a2ead',
//     '41f83110b3a1eb1911a2eaa',
//     '41f83110b3a1eb1911a2eac'
//   ],
//   classCapacity: 20
// }

import { classes } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import {
    isValidAction,
    isValidClassCapacity,
    isValidClassName,
    isValidDescription,
    isValidId,
    isValidTimeSlot,
    isValidName,
} from '../validateData.js';

//get a class provided the id
export const getClassbyId = async (id) => {
    id = isValidId(id);
    const classCollection = await classes();
    const theClass = await classCollection.findOne({ _id: new ObjectId(id) });
    if (theClass === null) { throw "No Class"; };
    theClass._id = theClass._id.toString();
    return theClass;
}

export const createClass = async (
    className,
    slots,
    instructor,
    description,
    classCapacity
) => {
    className = isValidName(className);
    slots = isValidTimeSlot(slots);
    instructor = isValidName(instructor);
    description = isValidDescription(description);
    classCapacity = isValidClassCapacity(classCapacity);
    let registeredUsers = [];
    let reviewIds = [];

    const classCollection = await classes();
    const existingClass = await getAllClass();

    // for (let i = 0; i < existingClass.length; i++) {

    // }

    let newUser = {
        className: className,
        slots: slots,
        instructor: instructor,
        description: description,
        classCapacity: classCapacity,
        registeredUsers: [],
        reviewIds: [],
    }

    const insertInfo = await classCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) { throw 'Error: Could not create user'; };
    const newId = insertInfo.insertedId.toString();
    const newClass = await getClassbyId(newId);
    return newClass;
}

//get all the classes in the database
export const getAllClass = async () => {
    const classCollection = await classes();
    let classList = await classCollection.find({}).toArray();
    if (classList.length == 0) { return classList; };
    if (!classList) { throw "Could not get all classes"; };
    classList = classList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return classList;
}

//delete a class
export const deleteUser = async (id) => {
    id = isValidId(id);
    const classCollection = await classes();
    const deletionInfo = await classCollection.findOneAndDelete({
        _id: new ObjectId(id)
    });

    if (deletionInfo.lastErrorObject.n === 0) {
        throw `Could not delete band with id of ${id}`;
    }
    return `${deletionInfo.value.firstName} ${deletionInfo.value.lastName} has been successfully deleted!`;
};


export const update = async (
    id,
    className,
    slots,
    instructor,
    description,
    classCapacity
) => {
    id = isValidId(id);
    className = isValidClassName(className);
    slots = isValidTimeSlot(slots);
    instructor = isValidName(instructor);
    description = isValidDescription(description);
    classCapacity = isValidClassCapacity(classCapacity);

    const classCollection = await classes();
    const existingClass = await getClassbyId(id);

    const updateClass = {
        className: className,
        slots: slots,
        instructor: instructor,
        description: description,
        registeredUsers: existingClass.registeredUsers,
        reviews: existingClass.reviews,
    }

    const updatedInfo = await classCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateClass },
        { returnDocument: 'after' }
    )

    if (updatedInfo.lastErrorObject.n === 0) {
        throw 'Failed to update class';
    }

    updatedInfo.value._id = updatedInfo.value._id.toString();
    return updatedInfo.value;
}

export const updateRegisteredUsers = async (
    id,
    RegisteredUsersId,
    action
) => {
    id = isValidId(id);
    RegisteredUsersId = isValidId(RegisteredUsersId);
    action = isValidAction(action);

    const classCollection = await classes();
    const theClass = await getClassbyId(id);

    let currentRegisteredList = theClass.registeredUsers; // Change this line
    if (!currentRegisteredList.includes(RegisteredUsersId)) { throw `Error: No such registered for ${theClass.className} ` };
    let newRegisterList = [];
    if (action == 'delete') {
        for (let i = 0; i < currentRegisteredList.length; i++) {
            if (currentRegisteredList[i] != RegisteredUsersId) {
                newRegisterList.push(currentRegisteredList[i]);
            };
        };
    } else {
        newRegisterList = currentRegisteredList;
        newRegisterList.push(RegisteredUsersId);
    };
    let registrations = newRegisterList;
    let updateClass = {
        registrations: registrations
    };

    const updatedInfo = await classCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateClass },
        { returnDocument: 'after' }
    );

    if (updatedInfo.lastErrorObject.n === 0) {
        throw 'Failed to update registrations';
    };
    updatedInfo.value._id = updatedInfo.value._id.toString();
    return updatedInfo.value;
};


export const updateReview = async (
    id,
    reviewId,
    action
) => {
    id = isValidId(id);
    reviewId = isValidId(reviewId);
    action = isValidAction(action);

    const classCollection = await classes();
    const theClass = await getClassbyId(id);

    let CurrentReviewList = theClass.reviewIds;

    if (action === 'delete' && !CurrentReviewList.includes(reviewId)) {
        throw `Error: No such review for ${theClass.className}`;
    }

    let newReviewList = [...CurrentReviewList];

    if (action === 'delete') {
        newReviewList = newReviewList.filter(rId => rId !== reviewId);
    } else if (!CurrentReviewList.includes(reviewId)) {
        newReviewList.push(reviewId);
    }

    let updateUser = {
        reviewIds: newReviewList,
    };

    const updatedInfo = await classCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateUser },
        { returnDocument: 'after' }
    );

    if (updatedInfo.lastErrorObject.n === 0) {
        throw 'Failed to update reviews';
    }
    updatedInfo.value._id = updatedInfo.value._id.toString();
    return updatedInfo.value;
};