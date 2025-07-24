const express = require('express');
const router = express.Router()
const DashboardController = require('../app/controllers/DashboardController');

router.get('/', DashboardController.dashboardPage);
router.post('/read', DashboardController.read);
router.post('/readOne', DashboardController.readOne);
router.post('/delete', DashboardController.delete);

module.exports = router;