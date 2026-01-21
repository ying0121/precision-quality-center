const express = require('express');
const router = express.Router()

const BillingCycleCategoryController = require('../../app/controllers/settings/BillingCycleCategoryController');

router.get('/', BillingCycleCategoryController.billingCycleCategoryPage);
router.post('/read', BillingCycleCategoryController.readBillingCycleCategories);
router.post('/create', BillingCycleCategoryController.createBillingCycleCategory);
router.post('/update', BillingCycleCategoryController.updateBillingCycleCategory);
router.post('/delete', BillingCycleCategoryController.deleteBillingCycleCategory);

module.exports = router;
