const express = require('express');
const router = express.Router()

const SecurityQuestionController = require('../../app/controllers/settings/SecurityQuestionController');

router.get('/', SecurityQuestionController.security_questionPage);

router.post('/add', SecurityQuestionController.add)
router.post('/read', SecurityQuestionController.read)
router.post('/readOne', SecurityQuestionController.readOne)
router.post('/update', SecurityQuestionController.update)
router.post('/delete', SecurityQuestionController.delete)

module.exports = router;