const express = require('express');
const router = express.Router()
const AgreementController = require('../app/controllers/AgreementController');

router.get('/', AgreementController.agreementPage);
router.post('/create', AgreementController.create);
router.post('/read', AgreementController.read);
router.post('/readOne', AgreementController.readOne);
router.post('/update', AgreementController.update);
router.post("/updateClinics", AgreementController.updateClinics);
router.post('/delete', AgreementController.delete);

module.exports = router;