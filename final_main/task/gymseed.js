import * as gymData from '../data/gyms.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import * as reviewData from '../data/reviews.js';
const db = await dbConnection();

let gym1 = undefined;
let gym2 = undefined;
try{
  gym1 = await gymData.createGym( 'Union City', 'https://www.union.com',{ streetName: '815 E Hudson st',    city: 'Union City',    state: 'New Jersey',    zip: '07305'}, '5513445955', 'anu14298@gmail.com', 70, 'admin' ) ;
  console.log(`${gym.name} successfully created \n`,gym);   
}
catch(e){
   console.log("Sort and filter should not give errorfor any of the three test cases: ",e)
}
try{
  gym2 = await gymData.createGym( 'Hoboken', 'https://www.union.com',{ streetName: '815 E Hudson st',    city: 'Union City',    state: 'New Jersey',    zip: '07305'}, '5513445955', 'anu14298@gmail.com', 70, 'admin' ) ;
  console.log(`${gym.name} successfully created \n`,gym);   
}
catch(e){
   console.log("Sort and filter should not give errorfor any of the three test cases: ",e)
}

try{
  let gymreview = await reviewData.addReview(gym._id.toString(), null,'The gym is good', 4);   
  console.log(`a review for ${gymreview.gymId} successfully created`);  
  let updateReview = await reviewData.updateReview(gymreview._id.toString(), gym._id.toString(),null,'The gym is not good', 4)
  console.log(`a review for ${updateReview._id} successfully updated`);
}
catch(e){
   console.log(e)
}