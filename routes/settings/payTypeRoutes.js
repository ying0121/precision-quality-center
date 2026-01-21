const express = require('express');
const router = express.Router()

const PayTypeController = require('../../app/controllers/settings/PayTypeController');

router.get('/', PayTypeController.payTypePage);
router.post('/read', PayTypeController.readPayTypes);
router.post('/create', PayTypeController.createPayType);
router.post('/update', PayTypeController.updatePayType);
router.post('/delete', PayTypeController.deletePayType);

module.exports = router;
