import * as userData from '../data/users.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import * as gymData from '../data/gyms.js';
import * as reviewData from '../data/reviews.js';
import * as classData from '../data/classes.js';
import * as appointmentData from '../data/appointments.js';

async function main() {
    const db = await dbConnection();
    //await db.dropDatabase();

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
        user1 = await userData.createUser(firstName,lastName,sex,dob,email,phoneNumber,address,username,hashedPassword,emergencyContactName,emergencyContactPhoneNumber,role,membershipPlanDetails);
        console.log(user1)
    }catch(e){
        console.log(e);
    };
    
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
    
        let user2 = await userData.createUser(firstName,lastName,sex,dob,email,phoneNumber,address,username,hashedPassword,emergencyContactName,emergencyContactPhoneNumber,role,membershipPlanDetails);
        console.log(user2)
    }catch(e){
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
    
        let user3 = await userData.createUser(firstName,lastName,sex,dob,email,phoneNumber,address,username,hashedPassword,emergencyContactName,emergencyContactPhoneNumber,role,membershipPlanDetails);
        console.log(user3)
    }catch(e){
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
    
        let user4 = await userData.createUser(firstName,lastName,sex,dob,email,phoneNumber,address,username,hashedPassword,emergencyContactName,emergencyContactPhoneNumber,role,membershipPlanDetails);
        console.log(user4)
    }catch(e){
        console.log(e);
    };
    
let gym = undefined;
try{
  gym = await gymData.createGym( 'Hoboken', 'https://www.google.com',{ streetName: '815 E Hudson st',    city: 'Hoboken',    state: 'New Jersey',    zip: '07305'}, '5513445955', 'anu14298@gmail.com', 70, "alpha", 'admin' ) ;
  console.log(`${gym.name} successfully created \n`,gym);   
}
catch(e){
   console.log("Sort and filter should not give errorfor any of the three test cases: ",e)
}

let class1 = undefined;
try{
  class1 = await classData.createClass('swim1', {Date: '06/13/2023', timing: '10:00 - 12:00'}, 'John','this is siwm class', 30) ;
  console.log(class1);   
}
catch(e){
   console.log(e)
}

let class2 = undefined;
try{
  class2 = await classData.createClass('Yoga1', {Date: '07/18/2023', timing: '13:00 - 15:00'}, 'hill','Rewind, revive with this yoga session.', 30) ;
  console.log(class2);   
}
catch(e){
   console.log(e)
}

let class3 = undefined;
try{
  class3 = await classData.createClass('Yoga2', {Date: '07/18/2023', timing: '16:00 - 18:00'}, 'hill','Rewind, revive with this yoga session.', 30) ;
  console.log(class3);   
}
catch(e){
   console.log(e)
}

let class4 = undefined;
try{
  class4 = await classData.createClass('Yoga0', {Date: '04/19/2023', timing: '15:00 - 17:00'}, 'hill','Rewind, revive with this yoga session.', 30) ;
  console.log(class3);   
}
catch(e){
   console.log(e)
}

let appointment1 = undefined;
try{
  appointment1 = await appointmentData.addAppointment(class1._id.toString(), {Date: '06/13/2023', timing: '10:00 - 12:00'}, false);   
  console.log(`an appointment for ${appointment1.classId} successfully created`);  
}
catch(e){
   console.log(e)
}
console.log('appointment1:', appointment1);

let appointment2 = undefined;
try{
  appointment2 = await appointmentData.addAppointment(class2._id.toString(), {Date: '07/18/2023', timing: '13:00 - 15:00'}, false);   
  console.log(`an appointment for ${appointment2.classId} successfully created`);  
}
catch(e){
   console.log(e)
}
console.log('appointment2:', appointment2);

let appointment3 = undefined;
try{
  appointment3 = await appointmentData.addAppointment(class4._id.toString(), {Date: '04/19/2023', timing: '15:00 - 17:00'}, false);   
  console.log(`an appointment for ${appointment3.classId} successfully created`);  
}
catch(e){
   console.log(e)
}

await userData.updateAppointment(user1._id.toString(), appointment1._id.toString(), 'add').catch((error) => {
	console.log('Error adding appointment1:', error);
      });
await userData.updateAppointment(user1._id.toString(), appointment2._id.toString(), 'add').catch((error) => {
	console.log('Error adding appointment2:', error);
      });
await userData.updateAppointment(user1._id.toString(), appointment3._id.toString(), 'add').catch((error) => {
	console.log('Error adding appointment1:', error);
  });

let gymreview = undefined;
try{
  gymreview = await reviewData.addReview(gym._id.toString(), null,'The gym is good', 4);   
  console.log(`a review for ${gymreview.gymId} successfully created`);  
  let updateReview = await reviewData.updateReview(gymreview._id.toString(), gym._id.toString(),null,'The gym is not good', 4)
  console.log(`a review for ${updateReview._id} successfully updated`);
}
catch(e){
   console.log(e)
}

let classreview = undefined;
try{
  classreview = await reviewData.addReview(gym._id.toString(), class1._id.toString(),'The class is good', 5);   
  console.log(`a review for ${classreview.classId} successfully created`);  
}
catch(e){
   console.log(e)
}

let classreview2 = undefined;
try{
  classreview2 = await reviewData.addReview(gym._id.toString(), class2._id.toString(),'The class is good', 4.5);   
  console.log(`a review for ${classreview.classId} successfully created`);  
}
catch(e){
   console.log(e)
}

    await closeConnection();

};//end of main

main();

    
    