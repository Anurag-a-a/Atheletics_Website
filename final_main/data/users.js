/*
{
  _id: '641f83110b3a1eb1911a2ead',
  firstName: 'Harry',
  lastName: 'Potter',
  sex: 'Male',
  dob: 07/31/1996,
  email: 'harrypotter@gmail.com',
  phoneNumber: '551-221-5876',
  address: {
    streetName: '1234 NW Bobcat Lane',
    city: 'Hoboken',
    state: 'New Jersey',
    zipCode: '07305'
  },
  hashedPassword: '$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O',
  emergencyContactName: 'James Potter',
  emergencyContactPhoneNumber: '551-221-5875',
  MyAppointments: [
    '41f83110b3a1eb1911a2ead',
    '41f83110b3a1eb1911a2eaa',
    '41f83110b3a1eb1911a2eac'
  ],
  MyReviews: [
    '61f83110b3a1eb1911a2ead',
    '61f83110b3a1eb1911a2eaa',
    '61f83110b3a1eb1911a2eac'
  ],
  membershipPlanDetails: 'alpha',
  role: ‘user’
}
*/
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt from 'bcrypt';
const saltRounds = 16;

import {isValidname,
        isValidemail,
        isValidphoneNumber,
        isValidaddress,
        isValidUsername,
        isValidpassword,
        isValidmembershipPlanDetails,
        isValidRole,
        isValidId,
        isValidAction,
        isValidSex,
        isValidDOB
} from '../validateData.js';

//get a user provided the id.
export const getUserbyId = async (id) => {
    id = isValidId(id);
    const userCollection = await users();
    const theUser = await userCollection.findOne({_id: new ObjectId(id)});
    if (theUser === null){throw "No user with that id";};
    theUser._id = theUser._id.toString();
    return theUser;  
};

//create a new user
export const createUser = async (
    firstName,
    lastName,
    sex,
    dob,
    email,
    phoneNumber,
    address,
    username,
    password,
    emergencyContactName,
    emergencyContactPhoneNumber,
    role,
    membershipPlanDetails   
) => {
    firstName = isValidname(firstName, 'firstName');
    lastName = isValidname(lastName, 'lastName');
    sex = isValidSex(sex);
    dob = isValidDOB(dob); //Format: MM/DD/YYYY
    email = isValidemail(email);
    phoneNumber = isValidphoneNumber(phoneNumber);
    address = isValidaddress(address);
    username = isValidUsername(username);
    password = isValidpassword(password);
    emergencyContactName = isValidname(emergencyContactName,'emergencyContactName');
    emergencyContactPhoneNumber = isValidphoneNumber(emergencyContactPhoneNumber);
    role = isValidRole(role);
    membershipPlanDetails = isValidmembershipPlanDetails(membershipPlanDetails);
    let MyAppointments = [];
    let MyReviews = [];
    let newUser = {};

    const userCollection = await users();
    const existingUsers = await getAllUser();
    /*check for existing similar usernames */
    for (let i=0; i<existingUsers.length; i++){
      if(existingUsers[i]['username'] == username) {throw "Error: This username is already taken. Try another!!!";};
    };
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (role == 'management') { 
        newUser = {
            firstName: firstName,
            lastName: lastName,
            sex: sex,
            dob: dob,
            email: email,
            phoneNumber: phoneNumber,
            address: address,
            username: username,
            hashedPassword: hashedPassword,
            emergencyContactName: emergencyContactName,
            emergencyContactPhoneNumber: emergencyContactPhoneNumber,
            role: role
          };
    }else {
        newUser = {
            firstName: firstName,
            lastName: lastName,
            sex: sex,
            dob: dob,
            email: email,
            phoneNumber: phoneNumber,
            address: address,
            username: username,
            hashedPassword: hashedPassword,
            emergencyContactName: emergencyContactName,
            emergencyContactPhoneNumber: emergencyContactPhoneNumber,
            role: role,
            membershipPlanDetails: membershipPlanDetails,
            MyAppointments: MyAppointments,
            MyReviews: MyReviews,
        };
    };
    
  
      
      const insertInfo = await userCollection.insertOne(newUser);
      if(!insertInfo.acknowledged || !insertInfo.insertedId){throw 'Error: Could not create user';};
      const newId = insertInfo.insertedId.toString();
      const user = await getUserbyId(newId);
      return user;

};

//get all the users in the database

export const getAllUser = async () => {
    const userCollection = await users();
    let userList = await userCollection.find({}).toArray();
    if(userList.length == 0){return userList;};
    if (!userList){throw "Could not get all users";};
    userList = userList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return userList;
};

//delete a user
export const deleteUser = async (id) => {
    id = isValidId(id);
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });
  
    if (deletionInfo.lastErrorObject.n === 0) {
      throw `Could not delete user with id of ${id}`;
    }
    return `${deletionInfo.value.firstName} ${deletionInfo.value.lastName} has been successfully deleted!`;
};

//modify/update user info

export const update = async (
    id,
    firstName,
    lastName,
    sex,
    dob,
    email,
    phoneNumber,
    address,
    username,
    hashedPassword,
    emergencyContactName,
    emergencyContactPhoneNumber,
    role,
    membershipPlanDetails,
  ) => {
    id = isValidId(id);
    firstName = isValidname(firstName, 'firstName');
    lastName = isValidname(lastName, 'lastName');
    sex = isValidSex(sex);
    dob = isValidDOB(dob);
    email = isValidemail(email);
    phoneNumber = isValidphoneNumber(phoneNumber);
    address = isValidaddress(address);
    username = isValidUsername(username);
//     hashedPassword = isValidpassword(hashedPassword);
/* check how to validate password here, if password is not updated then the db will have hashed password so how to validate it*/
    emergencyContactName = isValidname(emergencyContactName,'emergencyContactName');
    emergencyContactPhoneNumber = isValidphoneNumber(emergencyContactPhoneNumber);
    role = isValidRole(role);
    membershipPlanDetails = isValidmembershipPlanDetails(membershipPlanDetails);

    const userCollection = await users();
    const existingUser = await getUserbyId(id);
    
    
    const updateUser = {
        firstName: firstName,
        lastName: lastName,
        sex: sex,
        dob: dob,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        username: username,
        hashedPassword: hashedPassword,
        emergencyContactName: emergencyContactName,
        emergencyContactPhoneNumber: emergencyContactPhoneNumber,
        role: role,
        membershipPlanDetails: membershipPlanDetails,
        MyAppointments: existingUser.MyAppointments,
        MyReviews: existingUser.MyReviews,
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      {$set: updateUser},
      {returnDocument: 'after'}
    );
    if (updatedInfo.lastErrorObject.n === 0) {
      throw 'Failed to update user';
    };
    updatedInfo.value._id = updatedInfo.value._id.toString();
    return updatedInfo.value;
    };//end update function
  
//update appointment list in user
export const updateAppointment = async (
    id,
    MyAppointmentsId,
    action //'Delete' or 'Add'
) => {
    id = isValidId(id);
    MyAppointmentsId = isValidId(MyAppointmentsId);
    action = isValidAction(action);

    const userCollection = await users();
    const theUser = await getUserbyId(id);

    let CurrentAppointmentList = theUser.MyAppointments;
    if(!CurrentAppointmentList.includes(MyAppointmentsId)) {throw `Error: No such appointment for ${theUser.firstName} ${theUser.lastName}`};
    let newAppointmentList = [];
    if(action == 'delete'){
        for (let i=0; i<CurrentAppointmentList.length; i++){
            if(CurrentAppointmentList[i] != MyAppointmentsId){ newAppointmentList.push(CurrentAppointmentList[i]);};
        };

    }else{
        newAppointmentList = CurrentAppointmentList;
        newAppointmentList.push(MyAppointmentsId);
    };
    let MyAppointments = newAppointmentList;
    let updateUser = {
        MyAppointments: MyAppointments
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
        {_id: new ObjectId(id)},
        {$set: updateUser},
        {returnDocument: 'after'}
      );
      if (updatedInfo.lastErrorObject.n === 0) {
        throw 'Failed to update Appointments';
      };
      updatedInfo.value._id = updatedInfo.value._id.toString();
      return updatedInfo.value;
};


//update review list in user
export const updateReview = async (
    id,
    MyReviewId,
    action //'Delete' or 'Add'
) => {
    id = isValidId(id);
    MyReviewId = isValidId(MyReviewId);
    action = isValidAction(action);

    const userCollection = await users();
    const theUser = await getUserbyId(id);

    let CurrentReviewList = theUser.MyReviews;
    if(!CurrentReviewList.includes(MyReviewId)) {throw `Error: No such appointment for ${theUser.firstName} ${theUser.lastName}`};
    let newReviewList = [];
    if(action == 'delete'){
        for (let i=0; i<CurrentReviewList.length; i++){
            if(CurrentReviewList[i] != MyReviewId){ newReviewList.push(CurrentReviewList[i]);};
        };

    }else{
        newReviewList = CurrentReviewList;
        newReviewList.push(MyReviewId);
    };
    let MyReviews = newReviewList;
    let updateUser = {
        MyReviews: MyReviews
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
        {_id: new ObjectId(id)},
        {$set: updateUser},
        {returnDocument: 'after'}
      );
      if (updatedInfo.lastErrorObject.n === 0) {
        throw 'Failed to update Reviews';
      };
      updatedInfo.value._id = updatedInfo.value._id.toString();
      return updatedInfo.value;
};
