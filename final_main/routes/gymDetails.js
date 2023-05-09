import {Router} from 'express';
const router = Router();
import * as userData from '../data/users.js';
import * as gymData from '../data/gyms.js';
import {isValidBranch,
  isValidEmail,
  isValidPhoneNumber,
  isValidAddress,
  isValidWebsite,
  isValidId,
  isValidRole,
  isValidCapacity,
  isValidName,
  isValidUsername
} from '../validateData.js';

router.route('/gymDetails').get(async (req, res) => {
  try {
    const gymDetails = await gymData.getAllGyms();
    return res.render('allGyms', { title: 'Gym Brat', gyms : gymDetails });
  } 
  catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.route('/addGym').get(async (req, res) => {
  try {
    return res.render('gymCreateForm', { title: 'Gym Brat'});
  } 
  catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.route('/checkIn').get(async (req, res) => {
  try {
    let branchName = "Hoboken"
    let gymDetails = await gymData.getGymByBranch(branchName);
    return res.render('gymCheckIn', { title: 'Gym Brat', currentCapacity : gymDetails.currentCapacity});
  } 
  catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.route('/checkIn').post(async (req, res) => {
  let userName = req.body.username;

  try {
    if (!userName || Object.keys(userName).length === 0) {
        
      return res
        .status(400)
        .json({
          error: 'There are no fields in the request body'
        });
    }
  } 
  catch (e) {
    return res.status(500).json({ error: e.message });
  }

  try {
    userName = isValidUsername(userName);
  } 
  catch (e) {
    return res
      .status(400)
      .json({
        error: e
      });
  }
  try {
    const gymCheckIn = await gymData.checkIn(userName)

      if(!gymCheckIn)
    {
      throw 'username is not valid'
    }
      return res
      .status(200)
      .json(gymCheckIn);
    } 
    catch (e) {
      return res.status(400).json({ error: e });
    }


});


router.route('/addGym').post(async(req,res) => {
  let gymInfo = req.body;
  if (!gymInfo || Object.keys(gymInfo).length === 0) {
      
    return res
      .status(400)
      .json({
        error: 'There are no fields in the request body'
      });
  }

  try {
      gymInfo.address = {streetName: gymInfo.streetName, city: gymInfo.city, state: gymInfo.state, zip:gymInfo.zipCode}
      gymInfo.branchName = isValidBranch(gymInfo.branchName);
      gymInfo.website = isValidWebsite(gymInfo.website);
      gymInfo.address = isValidAddress(gymInfo.address);
      gymInfo.phoneNumber = isValidPhoneNumber(gymInfo.phoneNumber);
      gymInfo.email = isValidEmail(gymInfo.email);
      gymInfo.maxCapacity = isValidCapacity(gymInfo.maxCapacity);
      gymInfo.role= 'admin';
    } 
    catch (e) {
      return res
        .status(400)
        .json({
          error: e
        });
    }

  try {
    const gymCreation = await gymData.createGym(
      gymInfo.branchName,
      gymInfo.website,
      gymInfo.address,
      gymInfo.phoneNumber,
      gymInfo.email,
      gymInfo.maxCapacity,
      gymInfo.role,        
    );
      
    return res
      .status(200)
      .redirect('/gym/gymDetails');
    } 
    catch (e) {
      return res.sendStatus(400);
    }

})

router.route('/updateGym/:id').get(async (req, res) => {
  try {
    const {id} = req.params;
    let gymDetails = await gymData.getGymById(id);
    return res.render('gymUpdateForm', { title: 'UpdateGym',gym: gymDetails});
  } 
  catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.route('/updateGym/:id').post(async(req,res) => {
  try {
    req.params.id = isValidId( req.params.id )
  } 
  
  catch (e) {
    res
      .status(400)
      .json({
        error: e
      });
  }

  let gymInfo = req.body;
    if (!gymInfo || Object.keys(gymInfo).length === 0) {
      
      return res
        .status(400)
        .json({
          error: 'There are no fields in the request body'
        });
    }

    try {
      req.params.id = req.params.id
      gymInfo.address = {streetName: gymInfo.streetName, city: gymInfo.city, state: gymInfo.state, zip:gymInfo.zipCode}
      gymInfo.branchName = isValidBranch(gymInfo.branchName);
      gymInfo.website = isValidWebsite(gymInfo.website);
      gymInfo.address = isValidAddress(gymInfo.address);
      gymInfo.phoneNumber = isValidPhoneNumber(gymInfo.phoneNumber);
      gymInfo.email = isValidEmail(gymInfo.email);
      gymInfo.maxCapacity = isValidCapacity(gymInfo.maxCapacity);
      gymInfo.role = 'admin';
    } 
    catch (e) {
      return res
        .status(400)
        .json({
          error: e
        });
    }

  try {
    const gymUpdation = await gymData.updateGym(
      req.params.id,
      gymInfo.branchName,
      gymInfo.website,
      gymInfo.address,
      gymInfo.phoneNumber,
      gymInfo.email,
      gymInfo.maxCapacity,
      gymInfo.role,      
    );
    
  return res
    .status(200)
    .redirect('/gym/gymDetails');
  } 
  catch (e) {
    return res.sendStatus(400);
  }


})

export default router;