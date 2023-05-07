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
    isValidSex,
    isValidDOB
} from '../validateData.js';
import xss from 'xss';
import session from 'express-session';

/* route for landing page */
router.route('/').get(middleware.landingPageMiddleware, async (req, res) => {
    return res.render('landingPage',{title: "Gym Brat", partial: false});
});

/* route for amenities page */
router.route('/amenities').get(async (req, res) => {
    return res.render('amenities',{title: "Gym Brat", partial: false});
});

/* route for membershipPlans page */
router.route('/membershipPlans').get(async (req, res) => {
    if(!req.session.user)
    {return res.render('membershipPlans',{title: "Gym Brat", partial: false, notloogedIn: true});}
    else {
      return res.render('membershipPlans',{title: "Gym Brat", partial: false, notloogedIn: false});
    }
});

/* route for sign up page */
router.route('/joinnow').get(middleware.signUpMiddleware,async (req, res) => {
  console.log("renedered join now");
    return res.render('joinNow',{title: "Gym Brat", partial: 'signUpPartial'});
});
router.route('/joinnow').post(async (req, res) => {
    // validate inputs
    console.log("triggered post join now");
    let signUpInfo = req.body;
    if(!signUpInfo){
        return res.status(400).render('joinNow', {title: "Gym Brat", error: "Fill all the fields!!",partial: false});
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
    let plan = "";
    let accountCheck =  false;
    try {
        firstName = isValidName(signUpInfo.firstName, 'First Name');
        lastName = isValidName(signUpInfo.lastName, 'Last Name');
        password = isValidPassword(signUpInfo.passwordInput);
        sex = isValidSex(signUpInfo.sex);
        dob = isValidDOB(signUpInfo.dob);
        // console.log("checking phoneNumber in routes");
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
        // console.log("validating address in route function");
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
        // console.log("checking emergency phoneNumber in routes");
        emergencyContactPhoneNumber = isValidPhoneNumber(signUpInfo.emergencyContactPhoneNumber);
        plan = isValidMembershipPlanDetails(signUpInfo.plan);
      }catch(e){
        return res.status(400).render('joinNow', {title: "Gym Brat", error: e, partial: false});
      };
    //create the user in db
    try{
      const userReturnObject = await userData.createUser(
        xss(firstName),
        xss(lastName),
        xss(sex),
        xss(dob),
        xss(email),
        xss(phoneNumber),
        xss(address),
        xss(username),
        xss(password),
        xss(emergencyContactName),
        xss(emergencyContactPhoneNumber),
        xss(plan)
      );
      if(!userReturnObject) {return res.status(500).json({error: "Internal Server Error"});};
      return res.render('signIn',{title: "Gym Brat" , partial: 'sigInPartial'});
    }catch(e){
      return res.status(400).render('joinNow', {title: "Gym Brat",error: e, partial: false});
    };
    //redirect to login page
});//end join now post

/* route for sign in page */
router.route('/signin').get(middleware.signInMiddleware,async (req, res) => {
    return res.render('signIn',{title: "Gym Brat" , partial: 'sigInPartial'});
});
router.route('/signin').post(async (req, res) => {
    let signinInfo = req.body;
    if(!signinInfo){
        return res.status(400).render('signIn', {title: "Gym Brat", error: "Fill all the fields!!",partial: false});
    };
    let email = "";
    let password = "";
    try {
        email = isValidEmail(signinInfo.emailAddress);
        password = isValidPassword(signinInfo.passwordInput);
        // console.log("passed all the input validation");
      }catch(e){
        // console.log("input error caught");
        return res.status(400).render('signIn', {title: "Gym Brat", error: e,partial: false});
      };
      try{
        // console.log("Inside checking credentials");
        const userObject = await userData.checkUser(xss(email),xss(password));
        if(!userObject) { return res.status(500).render('signIn', {title: "Gym Brat", error: "Internal Server Error",partial: false});};
        req.session.user = {
          id: userObject.id,
          role: userObject.role
        };
        // console.log(req.session.user);
        // console.log('/login session set',req.session.user);
        if(req.session.user.role == 'admin') {res.redirect('/admin');}
        else {res.redirect('/protectedUserHomePage');};        
      }catch(e){
        return res.status(400).render('signIn', {title: "Gym Brat", error: e, partial: false});
      };
    });//end sign in post

    router.route('/protectedUserHomePage').get(middleware.userHomePageMiddleware, async (req, res) => {
        //code here for Getting the main page of the gym
        // console.log(req.session.user);
        const theSessionUser = await userData.getUserbyId(req.session.user.id);
        return res.render('protectedUserHomePage',{title: "Gym Brat", firstName: theSessionUser.firstName, lastName: theSessionUser.lastName, partial: false});
    });

    router.route('/userProfile').get(middleware.userProfilePageMiddleware, async (req, res) => {
      const theSessionUser = await userData.getUserbyId(req.session.user.id);
      return res.render('userProfile',{
        title: "Gym Brat", 
        firstName: theSessionUser.firstName, 
        lastName: theSessionUser.lastName, 
        username: theSessionUser.username,
        sex: theSessionUser.sex,
        dob: theSessionUser.dob,
        email: theSessionUser.emailAddress,
        ph: theSessionUser.phoneNumber,
        st: theSessionUser.address.streetName,
        city: theSessionUser.address.city,
        state: theSessionUser.address.state,
        zip: theSessionUser.address.zip,
        eName: theSessionUser.emergencyContactName,
        ePh: theSessionUser.emergencyContactPhoneNumber,
        plan: theSessionUser.membershipPlanDetails
       });
    });

    router.route('/updateplan').get(middleware.updatePlanMiddleware,async (req, res) => {
      try{
        const theSessionUser = await userData.getUserbyId(req.session.user.id);
        if(theSessionUser){
          return res.render('updatePlan',{title: "Gym Brat", partial: "updatePlanPartial"});
        }else{ throw "Error: Internal Server Error"};
      }catch(e){
        return res.status(500).json(e);
      };
    });
    router.route('/updateplan').post(async(req, res) => {
      let updatePlanInfo = req.body;
      if(!updatePlanInfo){
        return res.status(400).render('updatePlan', {title: "Gym Brat", error: "Fill all the fields!!",partial: false});
      };
      let plan = "";
      let password = "";
      try {
        password = isValidPassword(updatePlanInfo.passwordInput);
        plan = isValidMembershipPlanDetails(updatePlanInfo.plan);
        // console.log("passed all the input validation");
      }catch(e){
        // console.log("Route updatePlan post input error caught");
        return res.status(400).render('updatePlan', {title: "Gym Brat", error: e,partial: false});
      };
      try{
        // console.log("Inside checking credentials");
        const theuser = await userData.getUserbyId(req.session.user.id);
        if(!theuser){return res.status(500).json("Internal Server Error");};
        // console.log("Route updatePlan /post checking user");
        // console.log(theuser);
        const userObject = await userData.checkUser(xss(theuser.email),xss(password));
        if(!userObject) { return res.status(500).json("Internal Server Error");};
        const updateUser = await userData.update(theuser._id.toString(),
        theuser.firstName,
        theuser.lastName,
        theuser.sex,
        theuser.dob,
        theuser.email,
        theuser.phoneNumber,
        theuser.address,
        theuser.username,
        theuser.emergencyContactName,
        theuser.emergencyContactPhoneNumber,
        theuser.role,
        plan
        );
        if(!updateUser){return res.status(400).render('updatePlan', {title: "Gym Brat", error: "couldn't update plan. Try again",partial: false});}
        return res.redirect('/userProfile');
      }catch(e){
        return res.status(400).render('updatePlan', {title: "Gym Brat", error: e,partial: false});
      };

    });

    router.route('/logout').get(async(req, res) => {
      req.session.destroy();
      return res.redirect('/');
    });



export default router;