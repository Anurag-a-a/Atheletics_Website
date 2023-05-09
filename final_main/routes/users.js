import {Router} from 'express';
const router = Router();
import * as userData from '../data/users.js';
import * as middleware from '../middleware.js';
import * as gymData from '../data/gyms.js';
import {isValidName,
    isValidEmail,
    isValidPhoneNumber,
    isValidAddress,
    isValidUsername,
    isValidPassword,
    isValidMembershipPlanDetails,
    isValidRole,
    isValidSex,
    isValidDOB,
    isValidPostDOB
} from '../validateData.js';
import xss from 'xss';
import session from 'express-session';

router.route('/').get(middleware.rootMiddleware,async (req, res) => {
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});

/* route for landing page */
router.route('/landingpage').get(middleware.landingPageMiddleware, async (req, res) => {
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
    return res.render('joinNow',{title: "Gym Brat", partial: 'signUpPartial'});
});
router.route('/joinnow').post(async (req, res) => {
    // validate inputs
    let signUpInfo = req.body;
    if(!signUpInfo){
        return res.status(400).render('joinNow', {title: "Gym Brat", error: "Fill all the fields!!",partial: 'signUpPartial'});
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
        //2009-12-28

        dob = isValidPostDOB(signUpInfo.dob);
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
        emergencyContactPhoneNumber = isValidPhoneNumber(signUpInfo.emergencyContactPhoneNumber);
        plan = isValidMembershipPlanDetails(signUpInfo.plan);
      }catch(e){
        return res.status(400).render('joinNow', {title: "Gym Brat", error: e, partial: 'signUpPartial'});
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
        xss(address.streetName),
        xss(address.city),
        xss(address.state),
        xss(address.zip),
        xss(username),
        xss(password),
        xss(emergencyContactName),
        xss(emergencyContactPhoneNumber),
        xss(plan)
      );
      if(!userReturnObject) {return res.status(500).json({error: "Internal Server Error"});};
      return res.render('signIn',{title: "Gym Brat" , partial: 'sigInPartial'});
    }catch(e){
      return res.status(400).render('joinNow', {title: "Gym Brat",error: e, partial: 'signUpPartial'});
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
        return res.status(400).render('signIn', {title: "Gym Brat", error: "Fill all the fields!!",partial: 'sigInPartial'});
    };
    let email = "";
    let password = "";
    try {
        email = isValidEmail(signinInfo.emailAddress);
        password = isValidPassword(signinInfo.passwordInput);
      }catch(e){
        return res.status(400).render('signIn', {title: "Gym Brat", error: e,partial: 'sigInPartial'});
      };
      try{
        const userObject = await userData.checkUser(xss(email),xss(password));
        if(!userObject) { return res.status(500).render('signIn', {title: "Gym Brat", error: "Internal Server Error",partial: 'sigInPartial'});};
        req.session.user = {
          id: userObject.id,
          role: userObject.role
        };
       if(req.session.user.role == 'admin') {res.redirect('/admin/adminhome');}
        else {res.redirect('/user/protectedUserHomePage');};        
      }catch(e){
        return res.status(400).render('signIn', {title: "Gym Brat", error: e, partial: 'sigInPartial'});
      };
    });//end sign in post

    router.route('/protectedUserHomePage').get(middleware.userHomePageMiddleware, async (req, res) => {
        //code here for Getting the main page of the gym
        const theSessionUser = await userData.getUserbyId(req.session.user.id);
        const gyms = await gymData.getAllGyms();
        return res.render('protectedUserHomePage',{title: "Gym Brat", firstName: theSessionUser.firstName, lastName: theSessionUser.lastName, gym: gyms, partial: 'gymDensity'});
    });

    router.route('/userProfile').get(middleware.userProfilePageMiddleware, async (req, res) => {
      const theSessionUser = await userData.getUserbyId(req.session.user.id);
      var month = theSessionUser?.joinedPlanDate?.getUTCMonth() + 1; //months from 1-12
      var day = theSessionUser?.joinedPlanDate?.getUTCDate();
      var year = theSessionUser?.joinedPlanDate?.getUTCFullYear() + 1; 
      const expire = `${month}/${day}/${year}`;
      let ph = `${theSessionUser.phoneNumber.slice(0,3)}-${theSessionUser.phoneNumber.slice(3,6)}-${theSessionUser.phoneNumber.slice(6)}`;
      let eph = `${theSessionUser.emergencyContactPhoneNumber.slice(0,3)}-${theSessionUser.emergencyContactPhoneNumber.slice(3,6)}-${theSessionUser.emergencyContactPhoneNumber.slice(6)}`;
      if(req.session.user.role === 'user'){
      return res.render('userProfile',{
        title: "Gym Brat", 
        firstName: theSessionUser.firstName, 
        lastName: theSessionUser.lastName, 
        username: theSessionUser.username,
        sex: theSessionUser.sex,
        dob: theSessionUser.dob,
        email: theSessionUser.email,
        ph: ph,
        st: theSessionUser.address.streetName,
        city: theSessionUser.address.city,
        state: theSessionUser.address.state,
        zip: theSessionUser.address.zip,
        eName: theSessionUser.emergencyContactName,
        ePh: eph,
        plan: theSessionUser.membershipPlanDetails,
        expire: expire,
        user: true
       });
      }else{
        return res.render('userProfile',{
          title: "Gym Brat", 
          firstName: theSessionUser.firstName, 
          lastName: theSessionUser.lastName, 
          username: theSessionUser.username,
          sex: theSessionUser.sex,
          dob: theSessionUser.dob,
          email: theSessionUser.email,
          ph: ph,
          st: theSessionUser.address.streetName,
          city: theSessionUser.address.city,
          state: theSessionUser.address.state,
          zip: theSessionUser.address.zip,
          eName: theSessionUser.emergencyContactName,
          ePh: eph,
          user: false
         });
      };
    });

    router.route('/updateplan').get(middleware.updatePlanMiddleware,async (req, res) => {
      try{
        const theSessionUser = await userData.getUserbyId(req.session.user.id);
        const theuser = await userData.getUserbyId(req.session.user.id);
        if(!theuser){return res.status(500).json("Internal Server Error");};
        if(theSessionUser){
          let plan = theuser.membershipPlanDetails;
          if (plan == "alpha"){return res.render('updatePlan',{title: "Gym Brat", partial: "updatePlanPartial", alpha: true, beta: false, omega: false });}
          else if(plan == "beta"){return res.render('updatePlan',{title: "Gym Brat", partial: "updatePlanPartial", alpha: false, beta: true, omega: false });}
          else {return res.render('updatePlan',{title: "Gym Brat", partial: "updatePlanPartial", alpha: false, beta: false, omega: true });};
            
        }else{ throw "Error: Internal Server Error"};
      }catch(e){
        return res.status(500).json(e);
      };
    });
    router.route('/updateplan').post(async(req, res) => {
      let updatePlanInfo = req.body;
      if(!updatePlanInfo){
        return res.status(400).render('updatePlan', {title: "Gym Brat", error: "Fill all the fields!!",partial: 'updatePlanPartial'});
      };
      let plan = "";
      let password = "";
      try {
        password = isValidPassword(updatePlanInfo.passwordInput);
        plan = isValidMembershipPlanDetails(updatePlanInfo.plan);
      }catch(e){
        return res.status(400).render('updatePlan', {title: "Gym Brat", error: e,partial: 'updatePlanPartial'});
      };
      try{
        const theuser = await userData.getUserbyId(req.session.user.id);
        if(!theuser){return res.status(500).json("Internal Server Error");};
        const userObject = await userData.checkUser(xss(theuser.email),xss(password));
        if(!userObject) { return res.status(500).json("Internal Server Error");};
        if(updatePlanInfo.plan != 'renew') {
          const updateUser = await userData.updatePlan(theuser._id.toString(),plan);
          if(!updateUser){return res.status(400).render('updatePlan', {title: "Gym Brat", error: "couldn't update plan. Try again",partial: 'updatePlanPartial'});}
          return res.redirect('/user/userProfile');
        }
        else{
          const renewPlan = userData.renewPlan(theuser._id.toString());
          return res.redirect('/user/userProfile');
        };
        
      }catch(e){
        return res.status(400).render('updatePlan', {title: "Gym Brat", error: e,partial: 'updatePlanPartial'});
      };

    });

    router.route('/logout').get(async(req, res) => {
      req.session.destroy();
      return res.redirect('/user');
    });



    router.route('/updatepassword').get(middleware.updateMiddleware,async(req, res) => {
      return res.render('updatePassword',{title: "Gym Brat",partial: 'updatePassword'})

    });
    router.route('/updatepassword').post(async(req, res) => {
      let updatePasswordInfo = req.body;
      if(!updatePasswordInfo){
        return res.status(400).render('updatePassword', {title: "Gym Brat", error: "Fill all the fields!!",partial: 'updatePassword'});
      };

      // let email = "";
      let password = "";
      let npassword = "";
      let cpassword = "";
      try {
        password = isValidPassword(updatePasswordInfo.passwordInput);
        npassword = isValidPassword(updatePasswordInfo.newpasswordInput);
        cpassword = isValidPassword(updatePasswordInfo.cnewpasswordInput);
      }catch(e){
        return res.status(400).render('updatePassword', {title: "Gym Brat", error: e,partial: 'updatePassword'});
      };
      try{
        const theuser = await userData.getUserbyId(req.session.user.id);
        if(!theuser){return res.status(500).json("Internal Server Error");};
        const userObject = await userData.checkUser(xss(theuser.email),xss(password));
        if(!userObject) { return res.status(500).render('updatePassword', {title: "Gym Brat", error: "Internal Server Error",partial: 'updatePassword'});};            
      }catch(e){
        return res.status(400).render('updatePassword', {title: "Gym Brat", error: e, partial: 'updatePassword'});
      };
      try{
        const result = userData.updatePassword(req.session.user.id,npassword);
        if(result){
          req.session.destroy();
          return res.status(400).render('signIn', {title: "Gym Brat", partial: 'alertPasswordChange'});
        }else{
          throw "Error: failed to update password. Try again";
        }
      }catch(e){
        return res.status(400).render('updatePassword', {title: "Gym Brat", error: e, partial: 'updatePassword'});
      };
    });//end post updatePassword

    //updateinfo
    router.route('/updateinfo').get(middleware.updateMiddleware,async (req, res) => {
      const theSessionUser = await userData.getUserbyId(req.session.user.id);
      return res.render('updateForm',{title: "Gym Brat",
      firstName: theSessionUser.firstName,
      lastName: theSessionUser.lastName,
      sex: theSessionUser.sex,
      dob: theSessionUser.dob,
      username: theSessionUser.username,
      ph: theSessionUser.phoneNumber,
      streetName: theSessionUser.address.streetName,
      city: theSessionUser.address.city,
      state: theSessionUser.address.state,
      zip: theSessionUser.address.zip,
      en: theSessionUser.emergencyContactName,
      eph: theSessionUser.emergencyContactPhoneNumber,
      email: theSessionUser.email,
      partial: 'updateForm'});
  });
  router.route('/updateinfo').post(async (req, res) => {
    const theSessionUser = await userData.getUserbyId(req.session.user.id);
    // return res.render('updateForm',{title: "Gym Brat"});
    let updateInfo = req.body;
    if(!updateInfo){
        return res.status(400).render('updateForm', {title: "Gym Brat", error: "Fill all the fields!!",partial: 'updateForm'});
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
    let emergencyContactName = "";
    let emergencyContactPhoneNumber = "";
    try {
        firstName = isValidName(updateInfo.firstName, 'First Name');
        lastName = isValidName(updateInfo.lastName, 'Last Name');
        sex = isValidSex(updateInfo.sex);
        dob = isValidDOB(updateInfo.dob);
        phoneNumber = isValidPhoneNumber(updateInfo.ph);
        streetName = updateInfo.streetName;
        city = updateInfo.city;
        state = updateInfo.state;
        zip = updateInfo.zip;
        address = {
          streetName: streetName,
          city: city,
          state: state,
          zip: zip
        };
        address = isValidAddress(address);
        email = isValidEmail(updateInfo.emailAddress);
        username = isValidUsername(updateInfo.username);
        const existingUsers = await userData.getAllUser();
        /*check for existing similar usernames */
        for (let i=0; i<existingUsers.length; i++){
          if((existingUsers[i]['_id'].toString() != req.session.user.id)&&(existingUsers[i]['username'] == username)) {

            throw "Error: This username is already taken. Try another!!!";};
        };
        emergencyContactName = isValidName(updateInfo.emergencyContactName,'Emergency Contact Name');
        emergencyContactPhoneNumber = isValidPhoneNumber(updateInfo.emergencyContactPhoneNumber);
      }catch(e){
        return res.status(400).render('updateForm', {title: "Gym Brat", error: e, partial: 'updateForm'});
      };
    //update the user in db
    try{
      const userReturnObject = await userData.update(
        xss(req.session.user.id),
        xss(firstName),
        xss(lastName),
        xss(sex),
        xss(dob),
        xss(email),
        xss(phoneNumber),
        xss(address.streetName),
        xss(address.city),
        xss(address.state),
        xss(address.zip),
        xss(username),
        xss(emergencyContactName),
        xss(emergencyContactPhoneNumber)
      );
      if(!userReturnObject) {return res.status(500).json({error: "Internal Server Error"});};
      return res.redirect('/user/userProfile');
    }catch(e){
      return res.status(400).render('updateForm', {title: "Gym Brat", error: e, partial: 'updateForm'});
    };
});//end post updateForm

  router.route('/locations').get(async (req, res) => {
    try {
      const locations = await gymData.getAllGyms();
      return res.render('locations', { title: 'Gym Brat', locations : locations });
    } 
    catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });

  router.route('/error').get(async (req, res) => {
      return res.render('error', { title: 'Gym Brat'});
  });

  router.route('/userlist').get(middleware.userRestrictMiddleware,async (req, res) => {
    try {
      const userList = await userData.getAllUser();
      return res.render('userlist', { title: 'Gym Brat', user : userList });
    } 
    catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });

  router.route('/gymdensity').post(async (req, res) => {
    try{
    if(req.body.location == 'choose'){return res.json(' ');}
    const gym = await gymData.getGymByBranch(req.body.location);
    const density = gym.currentCapacity;
    res.json(density.toString());
  }catch(e){
    res.status(500).send('Failed to retrieve gym capacity');
  };
  });
  

export default router;