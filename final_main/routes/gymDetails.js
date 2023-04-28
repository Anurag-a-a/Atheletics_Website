import {Router} from 'express';
import { gyms } from '../config/mongoCollections';
const router = Router();

router.route('/location').get(async (req, res) => {
    //code here for Getting the main page of the gym
    gymData
    return res.render('Locations',{title: "Gym Brat"});
});
router.route('/membershipplans').get(async (req, res) => {
    //code here for Getting the main page of the gym
    return res.render('membershipPlans',{title: "Gym Brat"});
});

router.route('AddGym').post(async(req,res) => {
    let gymInfo = req.body;
    if (!gymInfo || Object.keys(gymInfo).length === 0) {
      
      return res
        .status(400)
        .json({
          error: 'There are no fields in the request body'
        });
    }

    try {
      gymInfo.branchName = isValidBranch(branchName);
      gymInfo.website = isValidWebsite(website);
      gymInfo.address = isValidAddress(address);
      gymInfo.phoneNumber = isValidPhoneNumber(phoneNumber);
      gymInfo.membershipPlanDetails = isValidMembershipPlanDetails(membershipPlanDetails);
      gymInfo.email = isValidEmail(email);
      gymInfo.role = isValidRole(role);
      gymInfo.maxCapacity = isValidCapacity(maxCapacity);
    } 
    catch (e) {
      return res
        .status(400)
        .json({
          error: e
        });
    }

    try {
      const gymCreation = await gyms.createGym(
        gymInfo.branchName,
        gymInfo.website,
        gymInfo.address,
        gymInfo.phoneNumber,
        gymInfo.membershipPlanDetails,
        gymInfo.email,
        gymInfo.role,
        gymInfo.maxCapacity,
        
      );
      
      res
      .status(200)
      .json(gymCreation);
    } 
    catch (e) {
      res.sendStatus(400);
    }

})

router.route('updateGym').post(async(req,res) => {
  let gymInfo = req.body;
    if (!gymInfo || Object.keys(gymInfo).length === 0) {
      
      return res
        .status(400)
        .json({
          error: 'There are no fields in the request body'
        });
    }

    try {
      gymInfo.branchName = isValidBranch(branchName);
      gymInfo.website = isValidWebsite(website);
      gymInfo.address = isValidAddress(address);
      gymInfo.phoneNumber = isValidPhoneNumber(phoneNumber);
      gymInfo.membershipPlanDetails = isValidMembershipPlanDetails(membershipPlanDetails);
      gymInfo.email = isValidEmail(email);
      gymInfo.role = isValidRole(role);
      gymInfo.maxCapacity = isValidCapacity(maxCapacity);
    } 
    catch (e) {
      return res
        .status(400)
        .json({
          error: e
        });
    }

  try {
    const gymCreation = await gyms.updateGym(
      gymInfo.branchName,
      gymInfo.website,
      gymInfo.address,
      gymInfo.phoneNumber,
      gymInfo.membershipPlanDetails,
      gymInfo.email,
      gymInfo.role,
      gymInfo.maxCapacity,
    );
    
    res
    .status(200)
    .json(gymCreation);
  } 
  catch (e) {
    res.sendStatus(400);
  }


})

export default router;