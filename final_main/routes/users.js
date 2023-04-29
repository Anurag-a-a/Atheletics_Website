import {Router} from 'express';
const router = Router();
import * as userData from '../data/users.js';
import * as middleware from '../middleware.js';
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


router.route('/').get(async (req, res) => {
    //code here for Getting the main page of the gym
    return res.render('landingPage',{title: "Gym Brat"});
});
router.route('/amenities').get(async (req, res) => {
    //code here for Getting the main page of the gym
    return res.render('amenities',{title: "Gym Brat"});
});
router.route('/membershipdetails').get(async (req, res) => {
    //code here for Getting the main page of the gym
    return res.render('membershipDetails',{title: "Gym Brat"});
});
router.route('/joinnow').get(async (req, res) => {
    //code here for Getting the main page of the gym
    return res.render('joinNow',{title: "Gym Brat"});
});
router.route('/signin').get(async (req, res) => {
    //code here for Getting the main page of the gym
    return res.render('signIn',{title: "Gym Brat" , partial: 'signIn'});
});
router.route('/signin').post(middleware.signInMiddleware,async (req, res) => {
    //code here for Getting the main page of the gym
    // return res.status(200).json("here in user page. not yet written");
    let signinInfo = req.body;
    if(!signinInfo){
        return res.status(400).render('signIn', {error: "Fill all the fields!!"});
    };
    let email = "";
    let password = "";
    try {
        email = isValidEmail(signinInfo.emailAddress);
        password = isValidPassword(signinInfo.passwordInput);
        // console.log("passed all the input validation");
      }catch(e){
        // console.log("input error caught");
        return res.status(400).render('signIn', {error: e});
      };
      try{
        // console.log("Inside checking credentials");
        const userObject = await userData.checkUser(email,password);
        if(!userObject) { return res.status(500).render('signIn', {error: "Internal Server Error"});};
        req.session.user = userObject;
        // console.log("Ready to redirect");
        // console.log('/login session set',req.session.user);
        if(req.session.user.role == 'admin') {res.redirect('/admin');}
        else {res.redirect('/protectedUserHomePage');};        
      }catch(e){
        return res.status(400).render('signIn', {error: e});
      };
});


export default router;