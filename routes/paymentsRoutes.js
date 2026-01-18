const express = require('express');
const router = express.Router()

const PaymentsController = require('../app/controllers/PaymentsController');

router.get('/', PaymentsController.paymentsPage);

router.post('/read', PaymentsController.readPayments);
router.post('/delete-all', PaymentsController.deleteAllPayments);
router.post('/delete', PaymentsController.deletePayment);

module.exports = router;
