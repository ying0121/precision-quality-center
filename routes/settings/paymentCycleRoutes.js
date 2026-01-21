const express = require('express');
const router = express.Router()

const PaymentCycleController = require('../../app/controllers/settings/PaymentCycleController');

router.get('/', PaymentCycleController.paymentCyclePage);
router.post('/read', PaymentCycleController.readPaymentCycles);
router.post('/read-categories', PaymentCycleController.readBillingCycleCategories);
router.post('/create', PaymentCycleController.createPaymentCycle);
router.post('/update', PaymentCycleController.updatePaymentCycle);
router.post('/delete', PaymentCycleController.deletePaymentCycle);

module.exports = router;
