const express = require('express');
const router = express.Router()
const SettingController = require('../app/controllers/SettingController');

router.post('/read', SettingController.read);
router.post('/readByCodes', SettingController.readByCodes);
router.post('/readOne', SettingController.readOne);
router.post('/create', SettingController.create);
router.post('/update', SettingController.update);
router.post('/updateFileForImage', SettingController.updateFileForImage);
router.post('/updateFileForVideo', SettingController.updateFileForVideo);
router.post("/updateBgStatus", SettingController.updateBgStatus);
router.post("/updateTextStatus", SettingController.updateTextStatus);
router.post('/delete', SettingController.delete);
router.post('/setBackgroundFooter', SettingController.setBackgroundFooter);

module.exports = router;
