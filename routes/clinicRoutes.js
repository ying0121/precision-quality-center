const express = require('express');
const router = express.Router()
const ClinicController = require('../app/controllers/ClinicController');

router.get('/', ClinicController.clinicPage);
router.post('/read', ClinicController.read);
router.post('/readClinics', ClinicController.readClinics);
router.post('/readOnlyNames', ClinicController.readOnlyNames);
router.post('/readOneClinic', ClinicController.readOneClinic);
router.post('/createClinic', ClinicController.createClinic);
router.post('/updateClinic', ClinicController.updateClinic);
router.post('/deleteClinic', ClinicController.deleteClinic);

module.exports = router;