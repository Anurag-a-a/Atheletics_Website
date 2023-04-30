import * as userData from '../data/users.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';

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
        zipCode: '07305'
	};
	let username = "harryPotter"
	let hashedPassword = "Harry@12345";
    let emergencyContactName = "James Potter";
    let emergencyContactPhoneNumber = "1231231234";
    let role = "User";
    let membershipPlanDetails = "Alpha";
    
    try {
        let user1 = await userData.createUser(firstName,lastName,sex,dob,email,phoneNumber,address,username,hashedPassword,emergencyContactName,emergencyContactPhoneNumber,role,membershipPlanDetails);
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
        	zipCode: '07305'
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
        	zipCode: '07305'
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
        	zipCode: '07305'
		};
		username = "mcg",
		hashedPassword = "Minerva@12345";
    	emergencyContactName = "John Mcgonagall";
    	emergencyContactPhoneNumber = "1231231234";
    	role = "admin";
    	membershipPlanDetails = "N/A";
    
        let user4 = await userData.createUser(firstName,lastName,sex,dob,email,phoneNumber,address,username,hashedPassword,emergencyContactName,emergencyContactPhoneNumber,role,membershipPlanDetails);
        console.log(user4)
    }catch(e){
        console.log(e);
    };
    
    await closeConnection();

};//end of main

main();

    
    