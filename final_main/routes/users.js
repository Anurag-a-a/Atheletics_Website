import {Router} from 'express';
const router = Router();



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
    return res.render('membershipPlan',{title: "Gym Brat"});
});
router.route('/joinnow').get(async (req, res) => {
    //code here for Getting the main page of the gym
    return res.render('membershipPlan',{title: "Gym Brat"});
});


export default router;