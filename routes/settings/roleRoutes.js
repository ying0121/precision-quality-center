const express = require('express');
const router = express.Router()

const RoleController = require('../../app/controllers/settings/RoleController');

router.get('/', RoleController.rolePage);

router.post('/addRole', RoleController.addRole)
router.post('/readRole', RoleController.readRole)
router.post('/readOneRole', RoleController.readOneRole)
router.post('/updateRole', RoleController.updateRole)
router.post('/deleteRole', RoleController.deleteRole)

module.exports = router;