const express = require('express');
const router = express.Router()
const EducationController = require('../app/controllers/EducationController');

router.get('/', EducationController.educationPage);
router.post('/readEducations', EducationController.readEducations);
router.post('/readOneEducation', EducationController.readOneEducation);
router.post('/createEducation', EducationController.createEducation);
router.post('/updateEducation', EducationController.updateEducation);
router.post('/deleteEducation', EducationController.deleteEducation);

module.exports = router;