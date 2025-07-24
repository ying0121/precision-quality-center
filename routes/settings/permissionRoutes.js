const express = require('express');
const router = express.Router()

const PermissionController = require('../../app/controllers/settings/PermissionController');

router.get('/', PermissionController.permissionPage);
router.post('/addPermission', PermissionController.addPermission)
router.post('/readPermission', PermissionController.readPermission)
router.post('/readOnePermission', PermissionController.readOnePermission)
router.post('/updatePermission', PermissionController.updatePermission)
router.post('/deletePermission', PermissionController.deletePermission)

module.exports = router;