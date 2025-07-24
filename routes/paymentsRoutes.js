const express = require('express');
const router = express.Router()
const PaymentsController = require('../app/controllers/PaymentsController');

router.get('/', PaymentsController.paymentsPage);
module.exports = router;