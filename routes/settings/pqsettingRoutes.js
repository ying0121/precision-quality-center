const express = require('express');
const router = express.Router()
const PQSettingController = require('../../app/controllers/settings/PQSettingController');

router.get('/', PQSettingController.pqsettingPage);
router.post('/readpqsettings', PQSettingController.readpqsettings);
router.post('/readOnepqsetting', PQSettingController.readOnepqsetting);
router.post('/createpqsetting', PQSettingController.createpqsetting);
router.post('/updatepqsetting', PQSettingController.updatepqsetting);
router.post('/deletepqsetting', PQSettingController.deletepqsetting);
router.post('/updatealltextcolor', PQSettingController.updatealltextcolor);

module.exports = router;