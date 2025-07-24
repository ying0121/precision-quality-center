const express = require('express');
const router = express.Router()
const EducationCategoryController = require('../../app/controllers/settings/EducationCategoryController');

router.get('/', EducationCategoryController.educationCategoryPage);
router.post('/readEducationCategories', EducationCategoryController.readEducationCategories);
router.post('/readOneEducationCategory', EducationCategoryController.readOneEducationCategory);
router.post('/createEducationCategory', EducationCategoryController.createEducationCategory);
router.post('/updateEducationCategory', EducationCategoryController.updateEducationCategory);
router.post('/deleteEducationCategory', EducationCategoryController.deleteEducationCategory);

module.exports = router;