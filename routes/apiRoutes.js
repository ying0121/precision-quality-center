const express = require('express');
const router = express.Router()
const APIController = require('../app/controllers/APIController');

router.post('/sendContact', APIController.createAPI);
router.post('/readContactTracks', APIController.readAPI);
router.post('/viewContactTrack', APIController.readOneAPI);
router.post('/updateContactTrack', APIController.updateAPI);
router.post('/updateContactTrackByCase', APIController.updateByCaseNumber);
router.post('/deleteContactTrack', APIController.deleteAPI);
router.post('/deleteContactTrackByCase', APIController.deleteByCaseNumber);
router.post('/readInsuranceByClinic', APIController.readInsuranceByClinicAPI);

router.post('/terms_of_use', APIController.getTermsOfUse);
router.post('/privacy_policy', APIController.getPrivacyPolicy);

router.post('/test', (req, res, next) => {
    res.send(req.body);
});
module.exports = router;