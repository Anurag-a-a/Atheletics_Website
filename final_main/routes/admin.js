import {Router} from 'express';
const router = Router();
import * as userAdminData from '../data/users.js';
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
    isValidDOB,
    isValidPostDOB
} from '../validateData.js';
import xss from 'xss';
import session from 'express-session';

router.route('/').get(middleware.landingPageMiddleware, async (req, res) => {
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});

router.route('/adminhome').get(middleware.userRestrictMiddleware,async (req, res) => {
    const theSessionUser = await userAdminData.getUserbyId(req.session.user.id);
    return res.render('adminHomePage',{title: "Gym Brat",firstName: theSessionUser.firstName, lastName: theSessionUser.lastName, partial: false});
});

router.route('/addadmin').get(middleware.userRestrictMiddleware,async (req, res) => {
    return res.render('addadmin',{title: "Gym Brat", partial: 'signUpPartial'});  
});
router.route('/addadmin').post(async (req, res) => {
    // validate inputs
    let signUpInfo = req.body;
    if(!signUpInfo){
        return res.status(400).render('addadmin', {title: "Gym Brat", error: "Fill all the fields!!",partial: 'signUpPartial'});
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
        const existingUsers = await userAdminData.getAllUser();
        for (let i=0; i<existingUsers.length; i++){
          if(existingUsers[i]['email'] == email) {accountCheck = true; throw "Error: This account already exists.";};
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
        return res.status(400).render('addadmin', {title: "Gym Brat", error: e, partial: 'signUpPartial'});
      };
    //create the user in db
    try{
      const userReturnObject = await userAdminData.createAdmin(
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
      const theSessionUser = await userAdminData.getUserbyId(req.session.user.id);
       return res.render('adminHomePage',{title: "Gym Brat",firstName: theSessionUser.firstName, lastName: theSessionUser.lastName, partial: 'addAdmin'});
    }catch(e){
      return res.status(400).render('addadmin', {title: "Gym Brat",error: e, partial: 'signUpPartial'});
    };
    //redirect to login page
});//end join now post


export default router;