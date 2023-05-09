import * as userData from '../data/users.js';
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import * as gymData from '../data/gyms.js';
import * as reviewData from '../data/reviews.js';
import * as classData from '../data/classes.js';
import * as appointmentData from '../data/appointments.js';

async function main() {
  const db = await dbConnection();
  //await db.dropDatabase();
 
   
  /* create users and admin */

  let firstName = "Harry";
  let lastName = "Potter";
  let sex = 'Male';
  let dob = '07/31/1996';
  let email = "harrypotter@gmail.com";
  let phoneNumber = "1231231234";
  let address = {
    streetName: '1234 NW Bobcat Lane',
    city: 'Hoboken',
    state: 'New Jersey',
    zip: '07305'
  };
  let username = "harryPotter"
  let hashedPassword = "Harry@12345";
  let emergencyContactName = "James Potter";
  let emergencyContactPhoneNumber = "1231231234";
  let role = "User";
  let membershipPlanDetails = "Alpha";
  let user1 = undefined
  try {
    user1 = await userData.createUser(firstName, lastName, sex, dob, email, phoneNumber, address.streetName, address.city, address.state, address.zip, username, hashedPassword, emergencyContactName, emergencyContactPhoneNumber, membershipPlanDetails);
    console.log(user1)
  } catch (e) {
    console.log(e);
  };
  let user2 = undefined;
  try {
    firstName = "Ron";
    lastName = "Weasly";
    sex = "Male";
    dob = "04/19/1996";
    email = "ronweasly@gmail.com";
    phoneNumber = "1231231234";
    address = {
      streetName: '1234 NW Bobcat Lane',
      city: 'Hoboken',
      state: 'New Jersey',
      zip: '07305'
    };
    username = "ron",
      hashedPassword = "Ron@12345";
    emergencyContactName = "Arthur Weasly";
    emergencyContactPhoneNumber = "1231231234";
    role = "User";
    membershipPlanDetails = "Beta";

    user2 = await userData.createUser(firstName, lastName, sex, dob, email, phoneNumber, address.streetName, address.city, address.state, address.zip, username, hashedPassword, emergencyContactName, emergencyContactPhoneNumber, membershipPlanDetails);
    console.log(user2)
  } catch (e) {
    console.log(e);
  };

  try {
    firstName = "Hermoine";
    lastName = "Granger";
    sex = "Female";
    dob = "07/25/1996";
    email = "hermoinegranger@gmail.com";
    phoneNumber = "1231231234";
    address = {
      streetName: '1234 NW Bobcat Lane',
      city: 'Hoboken',
      state: 'New Jersey',
      zip: '07305'
    };
    username = "hermoine",
      hashedPassword = "Hermoine@12345";
    emergencyContactName = "Peter Granger";
    emergencyContactPhoneNumber = "1231231234";
    role = "User";
    membershipPlanDetails = "Omega";

    let user3 = await userData.createUser(firstName, lastName, sex, dob, email, phoneNumber, address.streetName, address.city, address.state, address.zip, username, hashedPassword, emergencyContactName, emergencyContactPhoneNumber, membershipPlanDetails);
    console.log(user3)
  } catch (e) {
    console.log(e);
  };

  try {
    firstName = "Minerva";
    lastName = "Mcgonagall";
    sex = "Female";
    dob = "01/20/1980";
    email = "minerva@gmail.com";
    phoneNumber = "1231231234";
    address = {
      streetName: '1234 NW Bobcat Lane',
      city: 'Hoboken',
      state: 'New Jersey',
      zip: '07305'
    };
    username = "mcg",
      hashedPassword = "Minerva@12345";
    emergencyContactName = "John Mcgonagall";
    emergencyContactPhoneNumber = "1231231234";
    role = "admin";
    membershipPlanDetails = "NA";

    let user4 = await userData.createAdmin(firstName, lastName, sex, dob, email, phoneNumber, address.streetName, address.city, address.state, address.zip, username, hashedPassword, emergencyContactName, emergencyContactPhoneNumber, membershipPlanDetails);
    console.log(user4)
  } catch (e) {
    console.log(e);
  };

  //admin user
  try {
    firstName = "Admin";
    lastName = "Admin";
    sex = "Female";
    dob = "01/20/1980";
    email = "admin@gmail.com";
    phoneNumber = "1231231234";
    address = {
      streetName: '1234 NW Bobcat Lane',
      city: 'Hoboken',
      state: 'New Jersey',
      zip: '07305'
    };
    username = "admin",
      hashedPassword = "Admin@12345";
    emergencyContactName = "Admin";
    emergencyContactPhoneNumber = "1231231234";
    role = "admin";
    membershipPlanDetails = "NA";

    let user5 = await userData.createAdmin(firstName, lastName, sex, dob, email, phoneNumber, address.streetName, address.city, address.state, address.zip, username, hashedPassword, emergencyContactName, emergencyContactPhoneNumber, membershipPlanDetails);
    // console.log(user4)
  } catch (e) {
    console.log(e);
  };

  /* create gyms */

  let gym = undefined;
  try {
    gym = await gymData.createGym('Union City', 'https://www.gymbrat.com', { streetName: '815 E Hudson st', city: 'Union City', state: 'New Jersey', zip: '07305' }, '5513445955', 'gymbrat@gmail.com', 70, 'admin');
    console.log(`${gym.name} successfully created \n`, gym);
  }
  catch (e) {
    console.log("Gym creation had error mighgt be gym is already present in the database: ", e)
  };

  try {
    gym = await gymData.createGym('Hoboken', 'https://www.gymbrat.com', { streetName: 'Washington st', city: 'Hoboken', state: 'New Jersey', zip: '07306' }, '5513445956', 'gymbrat@gmail.com', 80, 'admin');
    console.log(`${gym.name} successfully created \n`, gym);
  }
  catch (e) {
    console.log("Gym creation had error mighgt be gym is already present in the database: ", e)
  };

  try {
    gym = await gymData.createGym('Jersy Heights', 'https://www.gymbrat.com', { streetName: '1207 Allen st', city: 'Jersy Heights', state: 'New Jersey', zip: '07307' }, '5513445957', 'gymbrat@gmail.com', 50, 'admin');
    console.log(`${gym.name} successfully created \n`, gym);
  }
  catch (e) {
    console.log("Gym creation had error mighgt be gym is already present in the database: ", e)
  };
  try {
    gym = await gymData.createGym('Journal Square', 'https://www.gymbrat.com', { streetName: '897 Ferry st', city: 'Journal Square', state: 'New Jersey', zip: '07308' }, '5513445958', 'gymbrat@gmail.com', 50, 'admin');
    console.log(`${gym.name} successfully created \n`, gym);
  }
  catch (e) {
    console.log("Gym creation had error mighgt be gym is already present in the database: ", e)
  };

  /* create classes */

  let class1 = undefined;
  try {
    class1 = await classData.createClass('Zumba', { Date: '05/09/2023', timing: '10:00 - 12:00' }, 'Mariam Shudon ', 'this is a class for Zumba Enthusiasts', 40);
    console.log(class1);
  }
  catch (e) {
    console.log(e)
  };

  let class2 = undefined;
  try {
    class2 = await classData.createClass('Yoga', { Date: '05/18/2023', timing: '13:00 - 15:00' }, 'Mark Hill', 'Taking you all to vitness the power of yoga registrations fill out soon', 30);
    console.log(class2);
  }
  catch (e) {
    console.log(e)
  };

  let class3 = undefined;
  try {
    class3 = await classData.createClass('Gymnastics', { Date: '06/18/2023', timing: '16:00 - 18:00' }, 'Harry Grande', 'Basics for becoming a profesional Gymnast', 20);
    console.log(class3);
  }
  catch (e) {
    console.log(e)
  };

  let class4 = undefined;
  try {
    class4 = await classData.createClass('Rock Climbing', { Date: '06/19/2023', timing: '15:00 - 17:00' }, 'Zar hill', 'Teaching you to rock climb as a pro', 50);
    console.log(class4);
  }
  catch (e) {
    console.log(e)
  };

  let class5 = undefined;
  try {
    class5 = await classData.createClass('Swimming', { Date: '07/21/2023', timing: '11:00 - 12:00' }, 'Lily hill', 'Teaching you to swimming as a pro', 40);
    console.log(class5);
  }
  catch (e) {
    console.log(e)
  };

  let class6 = undefined;
  try {
    class6 = await classData.createClass('Tennis', { Date: '08/12/2023', timing: '07:00 - 09:00' }, 'Kit hill', 'Teaching you to tennis as a pro', 50);
    console.log(class6);
  }
  catch (e) {
    console.log(e)
  };

  /* create appointments */
  const existingUsers = await userData.getAllUser();
  const existingClasses = await classData.getAllClass();
  let appointment1 = undefined;
  try {
    
    let user1Id =  existingUsers[0]._id.toString();
    let class1Id = existingClasses[0]._id.toString();
    appointment1 = await appointmentData.addAppointment(user1Id, class1Id,{ Date: '05/09/2023', timing: '10:00 - 12:00' }, false);
    console.log(`an appointment for ${appointment1.classId} successfully created`);
  }
  catch (e) {
    console.log(e)
  }
  console.log('appointment1:', appointment1);

  let appointment2 = undefined;
  try {
    appointment2 = await appointmentData.addAppointment(class2._id.toString(), { Date: '05/18/2023', timing: '13:00 - 15:00' }, false);
    console.log(`an appointment for ${appointment2.classId} successfully created`);
  }
  catch (e) {
    console.log(e)
  }

  let appointment3 = undefined;
  try {
    appointment3 = await appointmentData.addAppointment(class4._id.toString(), { Date: '06/19/2023', timing: '15:00 - 17:00' }, false);
    console.log(`an appointment for ${appointment3.classId} successfully created`);
  }
  catch (e) {
    console.log(e)
  }

  const gyms = await gymData.getAllGyms();  
  let gymreview1 = undefined;
  try {
    gymreview1 = await reviewData.addReview(gyms[0]._id.toString(), null, 'The gym is not good', 4);
    console.log(`a review for ${gymreview.gymId} successfully created`);
    let updateReview = await reviewData.updateReview(gymreview._id.toString(), gym._id.toString(), null, 'The gym is good', 4.6)
    console.log(`a review for ${updateReview._id} successfully updated`);
  }
  catch (e) {
    console.log(e)
  };
  
  let gymreview2 = undefined;
  try {
    gymreview2 = await reviewData.addReview(gyms[1]._id.toString(), null, 'The gym is good', 4.8);
    console.log(`a review for ${gymreview2.gymId} successfully created`);
  }
  catch (e) {
    console.log(e)
  };
  try {
    gymreview2 = await reviewData.addReview(gyms[1]._id.toString(), null, 'Facility are good. Nice staff', 4.5);
    console.log(`a review for ${gymreview2.gymId} successfully created`);
  }
  catch (e) {
    console.log(e)
  };
  try {
    gymreview2 = await reviewData.addReview(gyms[1]._id.toString(), null, 'It is a pleasant place to burn fat', 4.0);
    console.log(`a review for ${gymreview2.gymId} successfully created`);
  }
  catch (e) {
    console.log(e)
  };
  try {
    gymreview2 = await reviewData.addReview(gyms[2]._id.toString(), null, 'Good', 4.0);
    console.log(`a review for ${gymreview2.gymId} successfully created`);
  }
  catch (e) {
    console.log(e)
  };
  try {
    gymreview2 = await reviewData.addReview(gyms[3]._id.toString(), null, 'Okay. Can be better', 3.5);
    console.log(`a review for ${gymreview2.gymId} successfully created`);
  }
  catch (e) {
    console.log(e)
  };
  try {
    gymreview2 = await reviewData.addReview(gyms[3]._id.toString(), null, 'Broken equipments', 3.0);
    console.log(`a review for ${gymreview2.gymId} successfully created`);
  }
  catch (e) {
    console.log(e)
  };
  


  let classreview = undefined;
  try {
    classreview = await reviewData.addReview(gyms[0]._id.toString(), existingClasses[0]._id.toString(), 'The class is good');
    console.log(`a review for ${classreview.classId} successfully created`);
  }
  catch (e) {
    console.log(e)
  };
  try {
    classreview = await reviewData.addReview(gyms[1]._id.toString(), existingClasses[1]._id.toString(), 'The class is good');
    console.log(`a review for ${classreview.classId} successfully created`);
  }
  catch (e) {
    console.log(e)
  };

 

  await closeConnection();

};//end of main

main();    