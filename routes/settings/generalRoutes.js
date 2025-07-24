const express = require('express');
const router = express.Router()

const GeneralController = require('../../app/controllers/settings/GeneralController');

router.get('/', GeneralController.generalPage);
router.post('/updateExpiredSurvey', GeneralController.updateExpiredSurvey);
module.exports = router;