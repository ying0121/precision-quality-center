const express = require('express');
const router = express.Router()
const LanguageController = require('../app/controllers/LanguageController');

router.post('/read', LanguageController.read);
router.post('/readOneById', LanguageController.readOneById);
router.post('/readOneByCode', LanguageController.readOneByCode);

module.exports = router;
