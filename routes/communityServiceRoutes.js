const express = require('express');
const router = express.Router()
const CommunityServiceController = require('../app/controllers/CommunityServiceController');

router.get('/', CommunityServiceController.servicePage);
router.post('/readCategories', CommunityServiceController.readCategories);
router.post('/readOneCategory', CommunityServiceController.readOneCategory);
router.post('/createCategory', CommunityServiceController.createCategory);
router.post('/updateCategory', CommunityServiceController.updateCategory);
router.post('/deleteCategory', CommunityServiceController.deleteCategory);

router.post('/readServices', CommunityServiceController.readServices);
router.post('/readOneService', CommunityServiceController.readOneService);
router.post('/createService', CommunityServiceController.createService);
router.post('/updateService', CommunityServiceController.updateService);
router.post('/deleteService', CommunityServiceController.deleteService);
router.post('/uploadServiceImage', CommunityServiceController.uploadServiceImage);
router.post('/updateClinic', CommunityServiceController.updateClinic);
module.exports = router;