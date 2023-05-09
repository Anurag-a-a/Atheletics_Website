import {attendance} from '../config/mongoCollections.js';
import {gyms}from '../config/mongoCollections.js';
import {users}from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import {isValidBranch,
        isValidEmail,
        isValidPhoneNumber,
        isValidAddress,
        isValidWebsite,
        isValidRole,
        isValidId,
        isValidCapacity,
        isValidUsername
} from '../validateData.js';


export const createGym = async(
    branchName,
    website,
    address,
    phoneNumber,
    email,
    maxCapacity,
    role )=>  {
      try {
        role = isValidRole(role);
        if (role !== "admin")
          throw `Only admin can instert a new Gym`
        branchName = isValidBranch(branchName);
     
        const gymList = await getAllGyms();
        for (let gym of gymList) {
          if (gym.branchName === branchName) {
            throw new Error(`Gym with Branch Name ${branchName} already exists`);
          }
        }
        website = isValidWebsite(website);
        address = isValidAddress(address);
        phoneNumber = isValidPhoneNumber(phoneNumber);
        email = isValidEmail(email);
        maxCapacity = isValidCapacity(maxCapacity);
        let currentCapacity = 0;
        if(currentCapacity > maxCapacity)
        {
          throw 'Current capacity cannot be greater than MaxCapacity'
        }
        let classIds = [];
        let reviewIds = [];
        let overallRating = 5;

        const gymsCollection = await gyms();
        const newGym = {
          branchName,
          website,
          address,
          phoneNumber,
          email,
          maxCapacity,
          currentCapacity,
          role,
          classIds,
          reviewIds,
          overallRating
        };
        const insertInfo = await gymsCollection.insertOne(newGym);

        if (! insertInfo.acknowledged) {
          throw new Error('Could not add gym');
        }
      return await getGymById(insertInfo.insertedId.toString());
    } 
    catch (err) {
      throw err; 
    }
};

export const getAllGyms = async () => {
  const gymsCollection = await gyms();
  let gymsList = await gymsCollection.find({}).toArray();
  if(gymsList.length == 0){return gymsList;};
  if (!gymsList){throw "Could not get all users";};
  gymsList = gymsList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return gymsList;
};

export const getGymById = async(id) => {
  try {
    
    const gymsCollection = await gyms();
    const gym = await gymsCollection.findOne({ _id: new ObjectId(id) });

    if (!gym) {
      throw new Error('Gym not found');
    }

    return gym;
  } catch (err) {
    throw err;
  }
};

export const updateGym = async(
    _id,
  branchName,
  website,
  address,
  phoneNumber,
  email,
  maxCapacity,
  role
  )=> {

  try {
    _id = isValidId(_id);
    branchName = isValidBranch(branchName);
    website = isValidWebsite(website);
    address = isValidAddress(address);
    phoneNumber = isValidPhoneNumber(phoneNumber);
    email = isValidEmail(email);
    maxCapacity = isValidCapacity(maxCapacity);
    role = isValidRole(role);
    
    const gymsCollection = await gyms();
    const gym = await gymsCollection.findOne({ _id: new ObjectId(_id) });

    if (!gym) {
      throw new Error('Gym not found');
    }

    // Update gym's properties
    gym.branchName = branchName;
    gym.website = website;
    gym.address = address;
    gym.phoneNumber = phoneNumber;
    gym.email = email;
    gym.maxCapacity = maxCapacity;
    gym.role = role;
    gym.classIds = gym.classIds;
    gym.reviewIds = gym.reviewIds;
    gym.overallRating = gym.overallRating;
    gym.currentCapacity = gym.currentCapacity;
    const updatedInfo = await gymsCollection.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: gym },
      { returnDocument: 'after' }
    )

    if (updatedInfo.lastErrorObject.n === 0) {
      throw 'Failed to update class';
    }

    updatedInfo.value._id = updatedInfo.value._id.toString();


    return updatedInfo.value;
  } catch (err) {
    throw err;
  }
};


const addClassId = async (gymId, classId) => {
  try {
    const gym = await gyms.findOne({_id : new ObjectId(gymId)});
    if (!gym) {
      throw new Error(`Gym with ID ${gymId} not found`);
    }
    if (gym.classIds.includes(classId)) {
      return gym;
    }
    const updatedGym = await gyms.findOneAndUpdate(
      { _id: new ObjectId(gymId) }, // find the gym with the specified ID and ensure that the class ID is not already in the classIds array
      { $push: { classIds: classId } }, // add the class ID to the classIds array
      { new: true } // return the updated gym object
    );
    if (!updatedGym) {
      throw new Error(`Gym with ID ${gymId} not found`);
    }
    return updatedGym;
  } 
  catch (error) {
    throw new Error('Failed to add class ID to gym');
  }
};


const addReviewId = async(gymId,reviewId) => {

  try {
    const gym = await gyms.findOne({_id : new ObjectId(gymId)});
    if (!gym) {
      throw new Error(`Gym with ID ${gymId} not found`);
    }
    if (gym.reviewIds.includes(reviewId)) {
      return gym;
    }
    const updatedGym = await gyms.findOneAndUpdate(
      { _id: new ObjectId(gymId) }, // find the gym with the specified ID and ensure that the class ID is not already in the classIds array
      { $push: { reviewIds: reviewId } }, // add the review ID to the classIds array
      { new: true } // return the updated gym object
    );
    if (!updatedGym) {
      throw new Error(`Gym with ID ${gymId} not found`);
    }
    return updatedGym;
  } 
  catch (error) {
    throw new Error('Failed to add class ID to gym');
  }

}

const removeClassId = async (gymId, classId) => {
  classId = isValidId(classId); // validate the format of the class ID

  let gymCollection = db.collection('gyms'); // get the gym collection from the database
  const classRemoval = await gymCollection.findOneAndUpdate(
    { _id: new ObjectId(gymId) },
    { $pull: { classIds: classId } },
    { returnOriginal: false }
  ); // remove the class ID from the gym's classIds array

  if (!classRemoval.value) {
    throw `Could not delete class with id of ${classId} from gym with id of ${gymId}`;
  }
  
  return { ...classRemoval.value, deleted: true };
}

const removeReviewdid = async (gymId,reviewId) => {
    let reviewRemoval = await gymCollection.findOneAndUpdate(
      { _id: new ObjectId(gymId) },
      { $pull: { reviewIds: reviewId } },
      { returnOriginal: false }
    ); // remove the review ID from the gym's classIds array
  
    if (!reviewRemoval.value) {
      throw `Could not delete review with id of ${reviewId} from gym with id of ${gymId}`;
    }
    
    return { ...reviewRemoval.value, deleted: true };
  }

  export const getGymByBranch = async (branchName) => {
    if (!branchName) throw "You must provide a branch name.";
  
    const gymCollection = await gyms();
    const gym = await gymCollection.findOne({ branchName: branchName });
  
    if (!gym) throw `Gym with branch name "${branchName}" not found.`;
  
    gym._id = gym._id.toString();
    return gym;
  };

  export const checkIn = async (username) => {
    username = isValidUsername(username);
    const userCollection = await users();
    const theUser = await userCollection.findOne({username: username});
    if (theUser === null){throw "No user with that id";};
    let gymname = theUser.gym;

    let userInsertion = await createattendance(username)
    if(!userInsertion)
    {
      throw 'user already present in gym'
    }
    let gymCollection = await gyms();
    let gymdetails = await getGymByBranch(gymname);

    let currentCapacity = parseInt(gymdetails.currentCapacity)+1;
    currentCapacity = currentCapacity.toString();
    const updatedInfo = await gymCollection.findOneAndUpdate(
      { _id: new ObjectId(gymdetails._id) },
      { $set: { currentCapacity: currentCapacity } },
    );
    if (!updatedInfo) {
      throw 'Failed to update gym';
    }
    return updatedInfo;
  };
  
export const createattendance = async(userName)=>  {
      try {
        userName = isValidUsername(userName);
     
        const userList = await getAllUserName();
        for (let user of userList) {
          if (user.userName === userName) {
            throw new Error(`UserName ${userName} already exists in attendance`);
          }
        }
        
        const attendanceCollection = await attendance();
        
        const newUser = {
          userName}
        const insertInfo = await attendanceCollection.insertOne(newUser);

        if (! insertInfo.acknowledged) {
          throw new Error('Could not add User');
        }
      return true;
    } 
    catch (err) {
      throw err; 
    }
};

export const getAllUserName = async () => {
  const attendanceCollection = await attendance();
  let userList = await attendanceCollection.find({}).toArray();
  if(userList.length == 0){return userList;};
  userList = userList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return userList;
};
