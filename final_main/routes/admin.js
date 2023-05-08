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

router.route('/adminhome').get(middleware.adminHomePageMiddleware,async (req, res) => {
    const theSessionUser = await userAdminData.getUserbyId(req.session.user.id);
    return res.render('adminHomePage',{title: "Gym Brat",firstName: theSessionUser.firstName, lastName: theSessionUser.lastName, partial: false});
});


export default router;