const express = require('express');
const router = express.Router()
const ClinicInsuranceController = require('../app/controllers/ClinicInsuranceController');

router.post('/readClinicsInsurance', ClinicInsuranceController.readClinicsInsurance);
router.post('/readOneClinicInsurance', ClinicInsuranceController.readOneClinicInsurance);
router.post('/readInsuranceOfClinic', ClinicInsuranceController.readInsuranceOfClinic);
router.post('/readClinicOfInsurance', ClinicInsuranceController.readClinicOfInsurance);

router.post('/createClinicInsurance', ClinicInsuranceController.createClinicInsurance);
router.post('/createByClinic', ClinicInsuranceController.createByClinic);
router.post('/createByInsurance', ClinicInsuranceController.createByInsurance);

router.post('/updateClinicInsurance', ClinicInsuranceController.updateClinicInsurance);

router.post('/deleteClinicInsurance', ClinicInsuranceController.deleteClinicInsurance);
router.post('/deleteByClinic', ClinicInsuranceController.deleteByClinic);
router.post('/deleteByInsurance', ClinicInsuranceController.deleteByInsurance);
router.post('/deleteByInsuranceAndClinic', ClinicInsuranceController.deleteByInsuranceAndClinic);

module.exports = router;