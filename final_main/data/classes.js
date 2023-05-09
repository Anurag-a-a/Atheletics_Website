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
    isValidRole,
} from '../validateData.js';
import { getUserbyId,updateAppointment } from './users.js';
import { getAppointmentId,removeAppointment } from './appointments.js';

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
    let active = true;

    const classCollection = await classes();
    const existingClass = await getAllClass();

    // for (let i = 0; i < existingClass.length; i++) {

    // }

    let registeredUsers = []
    let reviewIds = []
    let newClass = {
        className: className,
        slots: slots,
        instructor: instructor,
        description: description,
        classCapacity: classCapacity,
        registeredUsers: registeredUsers,
        reviewIds: reviewIds,
        active : active,
    }

    const insertInfo = await classCollection.insertOne(newClass);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) { throw 'Error: Could not create user'; };
    const newId = insertInfo.insertedId.toString();
    newClass = await getClassbyId(newId);
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
    let datefor = new Date(slots.Date);
    datefor = datefor.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    slots.Date = datefor;
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

    let currentRegisteredList = theClass.registeredUsers;
    let newRegisterList = [];
    if (action == 'delete') {
        if (!currentRegisteredList.includes(RegisteredUsersId)) { throw `Error: No such registered for ${theClass.className} ` };

        for (let i = 0; i < currentRegisteredList.length; i++) {
            if (currentRegisteredList[i] != RegisteredUsersId) {
                newRegisterList.push(currentRegisteredList[i]);
            };
        };
    } else {
        newRegisterList = currentRegisteredList;
        newRegisterList.push(RegisteredUsersId);
    };

    let updateClass = {
        registeredUsers: newRegisterList // Change this line
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

export const addReviewId = async (userId, reviewId) => {
    userId = isValidId(userId);
    reviewId = isValidId(reviewId);
  
    const classCollection = await classes();
    const updatedInfo = await classCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $addToSet: { reviewIds: reviewId } },
      { returnDocument: 'after' }
    );
  
    if (updatedInfo.lastErrorObject.n === 0) {
      throw 'Failed to update MyReviews';
    }
  
    updatedInfo.value._id = updatedInfo.value._id.toString();
    return updatedInfo.value;
  };

export const deleteClassById = async (id,role) => {
    id = isValidId(id);
    role = isValidRole(role);
    if( role !== 'admin')
    {
        throw 'Deletion not allowed for this role'
    }
    const theClass = await getClassbyId(id);
    if(!theClass)
    {
        throw 'no Class found with this Id'
    }

    let users = theClass.registeredUsers;
    for (let user of users)
    {
        
        let appointmentId = await getAppointmentId(id,user)

        let action = "delete";
        let deleteStatus = updateAppointment(  user,
            appointmentId._id,
            action);
        if(!deleteStatus)
        {
            throw 'appointment Deletion from user not successful'
        }

        deleteStatus = removeAppointment(appointmentId._id);
        if(!deleteStatus.deleted)
        {
            throw 'appointment Deletion from user not successful'
        }

    }
    let classCollection = await classes()
    const deletionInfo = await classCollection.findOneAndDelete({
        _id: new ObjectId(id)
      });
    
      if (deletionInfo.lastErrorObject.n === 0) {
        throw `Could not delete user with id of ${id}`;
      }
    let classDetails = getAllClass(); 
    return classDetails;
};

