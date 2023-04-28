import * as gymData from '../data/gyms.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';

const db = await dbConnection();

try{
  let gym = await gymData.createGym( 'Hoboken', 'https://www.google.com',{ streetName: '815 E Hudson st',    city: 'Hoboken',    state: 'New Jersey',    zipCode: '07305'}, '5513445955', 'anu14298@gmail.com', 70, "alpha", 'admin' ) ;
  console.log(`${gym.name} successfully created \n`,gym);   
}
catch(e){
   console.log("Sort and filter should not give errorfor any of the three test cases: ",e)
}
