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
import xss from 'xss';
import session from 'express-session';

/* route for landing page */
router.route('/').get(async (req, res) => {
    return res.render('landingPage',{title: "Gym Brat"});
});

/* route for amenities page */
router.route('/amenities').get(async (req, res) => {
    return res.render('amenities',{title: "Gym Brat"});
});

/* route for membershipPlans page */
router.route('/membershipPlans').get(async (req, res) => {
    return res.render('membershipPlans',{title: "Gym Brat"});
});

/* route for sign up page */
router.route('/joinnow').get(middleware.signUpMiddleware,async (req, res) => {
    return res.render('joinNow',{title: "Gym Brat", partial: 'signUp'});
});
router.route('/joinnow').post(async (req, res) => {
    // validate inputs
    let signUpInfo = req.body;
    if(!signUpInfo){
        return res.status(400).render('joinNow', {error: "Fill all the fields!!"});
    };
    let firstName = "";
    let lastName = "";
    let sex = "";
    let dob = "";
    let email = "";
    let phoneNumber = "";
    let address ={};
    let streetName ="";
    let city = "";
    let state = "";
    let zip = "";
    let username = "";
    let password = "";
    let emergencyContactName = "";
    let emergencyContactPhoneNumber = "";
    let role = "";
    let plan = "";
    let accountCheck =  false;
    try {
        firstName = isValidName(signUpInfo.firstName, 'First Name');
        lastName = isValidName(signUpInfo.lastName, 'Last Name');
        password = isValidPassword(signUpInfo.passwordInput);
        sex = isValidSex(signUpInfo.sex);
        dob = isValidDOB(signUpInfo.dob);
        console.log("checking phoneNumber in routes");
        phoneNumber = isValidPhoneNumber(signUpInfo.ph);
        streetName = signUpInfo.streetName;
        city = signUpInfo.city;
        state = signUpInfo.state;
        zip = signUpInfo.zip;
        address = {
          streetName: streetName,
          city: city,
          state: state,
          zip: zip
        };
        console.log("validating address in route function");
        address = isValidAddress(address);
        email = isValidEmail(signUpInfo.emailAddress);
        const existingUsers = await userData.getAllUser();
        for (let i=0; i<existingUsers.length; i++){
          if(existingUsers[i]['email'] == email) {accountCheck = true; throw "Error: This account already exists. Sign In here instead or create new account";};
        };
        username = isValidUsername(signUpInfo.username);
        /*check for existing similar usernames */
        for (let i=0; i<existingUsers.length; i++){
          if(existingUsers[i]['username'] == username) {throw "Error: This username is already taken. Try another!!!";};
        };
        emergencyContactName = isValidName(signUpInfo.emergencyContactName,'Emergency Contact Name');
        console.log("checking emergency phoneNumber in routes");
        emergencyContactPhoneNumber = isValidPhoneNumber(signUpInfo.emergencyContactPhoneNumber);
        role = isValidRole(signUpInfo.role);
        plan = isValidMembershipPlanDetails(signUpInfo.plan);
      }catch(e){
        // console.log("Validating input threw errro routes")
        if(accountCheck){
          var delayInMilliseconds = 5000;
          setTimeout(function() {
            //your code to be executed after 1 second
          }, delayInMilliseconds);
          return res.render('signIn',{title: "Gym Brat" , partial: 'signIn', error: e});};
        return res.status(400).render('joinNow', {error: e});
      };
    //create the user in db
    try{
      const userReturnObject = await userData.createUser(
        firstName,
        lastName,
        sex,
        dob,
        email,
        phoneNumber,
        address,
        username,
        password,
        emergencyContactName,
        emergencyContactPhoneNumber,
        role,
        plan
      );
      if(!userReturnObject) {return res.status(500).json({error: "Internal Server Error"});};
      return res.render('signIn',{title: "Gym Brat" , partial: 'signIn'});
    }catch(e){
      return res.status(400).render('joinNow', {error: e});
    };
    //redirect to login page
});

/* route for sign in page */
router.route('/signin').get(middleware.signInMiddleware,async (req, res) => {
    return res.render('signIn',{title: "Gym Brat" , partial: 'signIn'});
});
router.route('/signin').post(async (req, res) => {
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
        req.session.user = {
          id: userObject.id,
          role: userObject.role
        };
        // console.log(req.session.user);
        // console.log('/login session set',req.session.user);
        if(req.session.user.role == 'admin') {res.redirect('/admin');}
        else {res.redirect('/protectedUserHomePage');};        
      }catch(e){
        return res.status(400).render('signIn', {error: e});
      };
      router.route('/protectedUserHomePage').get(async (req, res) => {
        //code here for Getting the main page of the gym
        // console.log(req.session.user);
        const theSessionUser = await userData.getUserbyId(req.session.user.id);
        return res.render('protectedUserHomePage',{title: "Gym Brat", firstName: theSessionUser.firstName, lastName: theSessionUser.lastName});
    });
});


export default router;