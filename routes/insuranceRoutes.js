const express = require('express');
const router = express.Router()
const InsuranceController = require('../app/controllers/InsuranceController');

router.get('/', InsuranceController.insurancePage);
router.post('/readInsurances', InsuranceController.readInsurances);
router.post('/readOneInsurance', InsuranceController.readOneInsurance);
router.post('/readOnlyNames', InsuranceController.readOnlyNames);
router.post('/readByClinic', InsuranceController.readByClinic);

router.post('/createInsurance', InsuranceController.createInsurance);
router.post('/updateInsurance', InsuranceController.updateInsurance);
router.post('/deleteInsurance', InsuranceController.deleteInsurance);
router.post('/uploadInsuranceImage', InsuranceController.uploadInsuranceImage);

module.exports = router;