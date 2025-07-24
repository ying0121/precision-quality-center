const express = require('express');
const router = express.Router()
const LandingController = require("../../app/controllers/dashboard/LandingController");

router.get('/', LandingController.landingPage);
router.post('/sendmail', LandingController.sendMail);

module.exports = router;