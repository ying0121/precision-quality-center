const express = require('express');
const router = express.Router()
const PatientServiceController = require('../app/controllers/PatientServiceController');

router.get('/', PatientServiceController.categoryPage);
router.post('/readCategories', PatientServiceController.readCategories);
router.post('/readOneCategory', PatientServiceController.readOneCategory);
router.post('/createCategory', PatientServiceController.createCategory);
router.post('/updateCategory', PatientServiceController.updateCategory);
router.post('/deleteCategory', PatientServiceController.deleteCategory);

router.get('/service', PatientServiceController.servicePage);
router.post('/readServices', PatientServiceController.readServices);
router.post('/readOneService', PatientServiceController.readOneService);
router.post('/createService', PatientServiceController.createService);
router.post('/updateService', PatientServiceController.updateService);
router.post('/deleteService', PatientServiceController.deleteService);
router.post('/uploadServiceImage', PatientServiceController.uploadServiceImage);
module.exports = router;