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
        isValidStreetName,
        isValidCity,
        isValidState,
        isValidZip,
        isValidUsername,
        isValidPassword,
        isValidMembershipPlanDetails,
        isValidRole,
        isValidId,
        isValidAction,
        isValidSex,
        isValidDOB,
        isValidPostDOB
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
    streetName,
    city,
    state,
    zip,
    username,
    password,
    emergencyContactName,
    emergencyContactPhoneNumber,
    membershipPlanDetails   
) => {
    firstName = isValidName(firstName, 'firstName');
    lastName = isValidName(lastName, 'lastName');
    sex = isValidSex(sex);
    dob = isValidDOB(dob); //Format: MM/DD/YYYY
    email = isValidEmail(email);
    phoneNumber = isValidPhoneNumber(phoneNumber);
    streetName = isValidStreetName(streetName);
    city = isValidCity(city);
    state =  isValidState(state);
    zip = isValidZip(zip);
    let address = {
      streetName: streetName,
      city: city,
      state: state,
      zip: zip
    };
    username = isValidUsername(username);
    password = isValidPassword(password);
    emergencyContactName = isValidName(emergencyContactName,'emergencyContactName');
    emergencyContactPhoneNumber = isValidPhoneNumber(emergencyContactPhoneNumber);
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
        role: 'user',
        membershipPlanDetails: membershipPlanDetails,
        MyAppointments: MyAppointments,
        MyReviews: MyReviews,
        joinedPlanDate: joinedPlanDate
    }; 
      const insertInfo = await userCollection.insertOne(newUser);
      if(!insertInfo.acknowledged || !insertInfo.insertedId){throw 'Error: Could not create user';};
      const newId = insertInfo.insertedId.toString();
      const user = await getUserbyId(newId);
      return user;

};

export const createAdmin = async (
  firstName,
  lastName,
  sex,
  dob,
  email,
  phoneNumber,
  streetName,
  city,
  state,
  zip,
  username,
  password,
  emergencyContactName,
  emergencyContactPhoneNumber,
  membershipPlanDetails 
) => {
  firstName = isValidName(firstName, 'firstName');
  lastName = isValidName(lastName, 'lastName');
  sex = isValidSex(sex);
  dob = isValidDOB(dob); //Format: MM/DD/YYYY
  email = isValidEmail(email);
  phoneNumber = isValidPhoneNumber(phoneNumber);
  // console.log("validating address in data function");
  state =  isValidState(state);
  zip = isValidZip(zip);
  let address = {
      streetName: streetName,
      city: city,
      state: state,
      zip: zip
  };
  username = isValidUsername(username);
  password = isValidPassword(password);
  emergencyContactName = isValidName(emergencyContactName,'emergencyContactName');
  emergencyContactPhoneNumber = isValidPhoneNumber(emergencyContactPhoneNumber);
  let newAdmin = {};
  const userCollection = await users();
  const existingUsers = await getAllUser();
  /*check for existing similar usernames */
  for (let i=0; i<existingUsers.length; i++){
    if(existingUsers[i]['username'] == username) {throw "Error: This username is already taken. Try another!!!";};
  };
  
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  newAdmin = {
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
      role: 'admin',
      membershipPlanDetails: 'na'
  }; 
    const insertInfo = await userCollection.insertOne(newAdmin);
    if(!insertInfo.acknowledged || !insertInfo.insertedId){throw 'Error: Could not create admin';};
    const newId = insertInfo.insertedId.toString();
    const adminUser = await getUserbyId(newId);
    return adminUser;

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
    st,
    city,
    state,
    zip,
    username,
    emergencyContactName,
    emergencyContactPhoneNumber,
  ) => {
    id = isValidId(id);
    firstName = isValidName(firstName, 'firstName');
    lastName = isValidName(lastName, 'lastName');
    sex = isValidSex(sex);
    dob = isValidDOB(dob);
    // console.log("in data update user checking email");
    email = isValidEmail(email);
    phoneNumber = isValidPhoneNumber(phoneNumber);
    let address = {
      streetName: st,
      city: city,
      state: state,
      zip: zip
    };
    address = isValidAddress(address);
    username = isValidUsername(username);
    emergencyContactName = isValidName(emergencyContactName,'emergencyContactName');
    emergencyContactPhoneNumber = isValidPhoneNumber(emergencyContactPhoneNumber);

    const userCollection = await users();
        
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
export const updateReview = async (id, MyReviewId, action) => {
  id = isValidId(id);
  MyReviewId = isValidId(MyReviewId);
  action = isValidAction(action);

  const userCollection = await users();
  const theUser = await getUserbyId(id);

  let currentReviewList = theUser.MyReviews;
  let newReviewList = [];

  if (action === "add") {
    if (!currentReviewList.includes(MyReviewId)) {
      newReviewList = [...currentReviewList, MyReviewId];
    } else {
      newReviewList = currentReviewList;
    }
  } else if (action === "delete") {
    if (currentReviewList.includes(MyReviewId)) {
      newReviewList = currentReviewList.filter(
        (reviewId) => reviewId !== MyReviewId
      );
    } else {
      throw `Error: No such review for ${theUser.firstName} ${theUser.lastName}`;
    }
  }

  let updateUser = {
    MyReviews: newReviewList,
  };

  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateUser },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw "Failed to update Reviews";
  }

  updatedInfo.value._id = updatedInfo.value._id.toString();
  return updatedInfo.value;
};

export const checkUser = async (emailAddress, password) => {
  let returnObj = {};
  // console.log(emailAddress);
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
        // console.log(comparePassword)
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

export const renewPlan = async (id) => {
  
  id = isValidId(id);
  const userCollection = await users();
  const theuser = await getUserbyId(id);
  if(!theuser){throw "Internal Server Error";};
  let joinedPlanDate = new Date();
  const updateUser ={
    joinedPlanDate: joinedPlanDate
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


export const addReviewId = async (userId, reviewId) => {
  userId = isValidId(userId);
  reviewId = isValidId(reviewId);

  const userCollection = await users();
  console.log('userCollection:', userCollection);
  
  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    // { $addToSet: { MyReviews: new ObjectId(reviewId) } },
    { $addToSet: { MyReviews: reviewId } },
    { returnDocument: 'after' }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw 'Failed to update MyReviews';
  }

  updatedInfo.value._id = updatedInfo.value._id.toString();
  return updatedInfo.value;
};

export const updatePassword = async (cpassword, npassword) => {
  cpassword = isValidPassword(cpassword);
  npassword = isValidPassword(npassword);
  const userCollection = await users();
  const userList = await getAllUser();
  let comparePassword = false;
  let id = "";
  for(let i=0; i<userList.length; i++){
    try {
      comparePassword = await bcrypt.compare(cpassword, userList[i]['hashedPassword']);
      // console.log(comparePassword)
    }catch(e){
      throw "Internal Server Error";
    };
    if(comparePassword){ id = userList[i]._id.toString(); break;};
};//close for
  if(!comparePassword){throw "Error: Current Password entered is wrong. Try Again";};
  const hashedPassword = await bcrypt.hash(npassword, saltRounds);
  const updatePasswordUser = {
  hashedPassword: hashedPassword
  };
  const updatedInfo = await userCollection.findOneAndUpdate(
  {_id: new ObjectId(id)},
  {$set: updatePasswordUser},
  {returnDocument: 'after'}
  );
  if (updatedInfo.lastErrorObject.n === 0) {
    throw 'Failed to update password';
  };
  updatedInfo.value._id = updatedInfo.value._id.toString();
  return true;
  
};