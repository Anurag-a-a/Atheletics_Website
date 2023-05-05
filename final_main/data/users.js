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
import * as bcrypt from 'bcrypt';
const saltRounds = 16;

import {isValidName,
        isValidEmail,
        isValidPhoneNumber,
        isValidAddress,
        isValidUsername,
        isValidPassword,
        isValidMembershipPlanDetails,
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
    firstName = isValidName(firstName, 'firstName');
    lastName = isValidName(lastName, 'lastName');
    sex = isValidSex(sex);
    dob = isValidDOB(dob); //Format: MM/DD/YYYY
    email = isValidEmail(email);
    phoneNumber = isValidPhoneNumber(phoneNumber);
    // console.log("validating address in data function");
    address = isValidAddress(address);
    username = isValidUsername(username);
    password = isValidPassword(password);
    emergencyContactName = isValidName(emergencyContactName,'emergencyContactName');
    emergencyContactPhoneNumber = isValidPhoneNumber(emergencyContactPhoneNumber);
    role = isValidRole(role);
    membershipPlanDetails = isValidMembershipPlanDetails(membershipPlanDetails);
    let MyAppointments = [];
    let MyReviews = [];
    let newUser = {};
    let joinedPlanDate = new Date();
    const userCollection = await users();
    const existingUsers = await getAllUser();
    /*check for existing similar usernames */
    for (let i=0; i<existingUsers.length; i++){
      if(existingUsers[i]['username'] == username) {throw "Error: This username is already taken. Try another!!!";};
    };
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (role == 'admin') { 
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
            joinedPlanDate: joinedPlanDate
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
    emergencyContactName,
    emergencyContactPhoneNumber,
    role,
    membershipPlanDetails,
  ) => {
    id = isValidId(id);
    firstName = isValidName(firstName, 'firstName');
    lastName = isValidName(lastName, 'lastName');
    sex = isValidSex(sex);
    dob = isValidDOB(dob);
    // console.log("in data update user checking email");
    email = isValidEmail(email);
    phoneNumber = isValidPhoneNumber(phoneNumber);
    address = isValidAddress(address);
    username = isValidUsername(username);
//     hashedPassword = isValidpassword(hashedPassword);
/* check how to validate password here, if password is not updated then the db will have hashed password so how to validate it*/
    emergencyContactName = isValidName(emergencyContactName,'emergencyContactName');
    emergencyContactPhoneNumber = isValidPhoneNumber(emergencyContactPhoneNumber);
    role = isValidRole(role);
    membershipPlanDetails = isValidMembershipPlanDetails(membershipPlanDetails);

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

  let newAppointmentList = [];
  if (action == 'delete') {
    if (!CurrentAppointmentList.includes(MyAppointmentsId)) {
      throw `Error: No such appointment for ${theUser.firstName} ${theUser.lastName}`;
    }
    newAppointmentList = CurrentAppointmentList.filter(appointmentId => appointmentId !== MyAppointmentsId);
  } else {
    newAppointmentList = [...CurrentAppointmentList, MyAppointmentsId];
  }
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
  }
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

export const checkUser = async (emailAddress, password) => {
  let id = "";
  let firstName = "";
  let lastName = "";
  let sex = "";
  let dob = "";
  // let email = "";
  let phoneNumber = "";
  let address ={};
  let username = "";
  // let hashedPassword = "";
  let emergencyContactName = "";
  let emergencyContactPhoneNumber = "";
  let role = "";
  let membershipPlanDetails = "";
  let MyAppointments =[];
  let MyReviews = [];
  let returnObj = {};
  console.log(emailAddress);
  emailAddress = isValidEmail(emailAddress);
  password = isValidPassword(password);
  const userCollection = await users();
  const userList = await getAllUser();
  let check = false;
  let comparePassword = false;
  //iterating through the 
  for (let i=0; i<userList.length; i++){
    if(emailAddress == userList[i]['email']) { 
      check = true;
      try {
        comparePassword = await bcrypt.compare(password, userList[i]['hashedPassword']);
        console.log(comparePassword)
      }catch(e){
        throw "Internal Server Error";
      };
      if (comparePassword) {
        if(userList[i]['role'] == 'admin'){ 
          returnObj = {
          id: userList[i]['_id'].toString(),
          firstName: userList[i]['firstName'],
          lastName: userList[i]['lastName'],
          sex: userList[i]['sex'],
          dob: userList[i]['dob'],
          emailAddress: userList[i]['emailAddress'],
          phoneNumber: userList[i]['phoneNumber'],
          address: userList[i]['address'],
          username: userList[i]['username'],
          emergencyContactName: userList[i]['emergencyContactName'],
          emergencyContactPhoneNumber: userList[i]['emergencyContactPhoneNumber'],
          role: userList[i]['role']
        }
      }else {
        returnObj = {
          id: userList[i]['_id'].toString(),
          firstName: userList[i]['firstName'],
          lastName: userList[i]['lastName'],
          sex: userList[i]['sex'],
          dob: userList[i]['dob'],
          emailAddress: userList[i]['emailAddress'],
          phoneNumber: userList[i]['phoneNumber'],
          address: userList[i]['address'],
          username: userList[i]['username'],
          emergencyContactName: userList[i]['emergencyContactName'],
          emergencyContactPhoneNumber: userList[i]['emergencyContactPhoneNumber'],
          role: userList[i]['role'],
          membershipPlanDetails: userList[i]['membershipPlanDetails'],
          MyAppointments: userList[i]['MyAppointments'],
          MyReviews: userList[i]['MyReviews']
        }
      };//close if-else for role determination and assigning returnObj
      } else {
          throw "Error: Invalid Password. Try Again!!";
      };//close if--else for password match
      break;
    };//close if
  };//close for for finding user match in db
  if(!check) {throw "Error: Invalid email. Try Again!!";};
  return returnObj;
  
};

