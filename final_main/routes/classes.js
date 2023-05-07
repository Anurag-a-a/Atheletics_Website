// Render the Handlebar form page when the user navigates to the /create-event route
import {Router} from 'express';
const router = Router();
import * as classes from '../data/classes.js';
import {
  isValidClassCapacity,
  isValidClassName,
  isValidDescription,
  isValidTimeSlot,
  isValidName,
  isValidId
} from '../validateData.js';

router.route('/createClass').get(async (req, res) => {
  try {
    return res.render('classDetailsInputForm', { title: 'Create Class'});
  } 
  catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

  // Handle the form submission when the user submits the form
  router.route('/classCreation').post(async (req, res) => {
    let classData = req.body;
    if (!classData || Object.keys(classData).length === 0) {
      return res
        .status(400)
        .json({
          error: 'There are no fields in the request body'
        });
    }
  
    try {
      classData.className = isValidClassName(classData.className);
      classData.slots = isValidTimeSlot(classData.slots);
      classData.instructor = isValidName(classData.instructor);
      classData.description = isValidDescription(classData.description);
      classData.classCapacity = isValidClassCapacity(classData.classCapacity);
    } catch (e) {
      return res
        .status(400)
        .json({
          error: e
        });
    }
    
    let ID_gen = "0";
    try {
      const classCreation = await classes.createClass(
        classData.className,
        classData.slots,
        classData.instructor,
        classData.description,
        classData.classCapacity
      );

      return res
      .status(200)
      .redirect('/class/classDetails');
  
    }   
    catch (e) {
      return res.status(400);
    }
  });
  
router.route('/classDetails').get(async (req, res) => {
  try {
    let classDetails = await classes.getAllClass();
    return res.render('classDetails', { title: 'UpdateClass',classes: classDetails});
  } 
  catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


router.route('/updateClass/:id').get(async (req, res) => {
  try {
    const {id} = req.params;
    let classDetails = await classes.getClassbyId(id);
    return res.render('classUpdateForm', { title: 'UpdateClass',classDetails: classDetails});
  } 
  catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.route('/classUpdation/:id').post(async (req, res) => {
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
  let classDetails = await classes.getClassbyId(req.params.id);
  let  classData= req.body;
  try{
      if (classDetails === null)
      {
        throw "no Class Found"
      }


      if (!classData || Object.keys(classData).length === 0) {
        throw 'There are no fields in the request body';
      }
    }
  catch(e)  {
    return res
    .status(400)
    .json({
      error: e
    });
  }

  try{
    classData.className = isValidClassName(classData.className);
    classData.slots = isValidTimeSlot(classData.slots);
    classData.instructor = isValidName(classData.instructor);
    classData.description = isValidDescription(classData.description);
    classData.classCapacity = isValidClassCapacity(classData.classCapacity);

    if(classData.className === classDetails.className && classData.slots === classDetails.slots && classData.instructor === classDetails.instructor && classData.description === classDetails.description && classData.classCapacity === classDetails.classCapacity)
      {  throw `no fields to update`
    }
  } 
  catch (e) {
    return res
      .status(400)
      .json({
        error: e
      });
  }  

  try {
    const classUpdation = await classes.update(
      req.params.id,
      classData.className,
      classData.slots,
      classData.instructor,
      classData.description,
      classData.classCapacity
    );
    
    return res
    .status(200)
    .redirect('/class/classDetails');
  } 
  catch (e) {
    res.sendStatus(400);
  }
  });
  
  export default router;  