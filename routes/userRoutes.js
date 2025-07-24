const express = require('express');
const router = express.Router()
const UserController = require('../app/controllers/UserController');

router.get('/', UserController.userPage);
router.post('/createUser', UserController.createUser);
router.post('/readUser', UserController.readUser);
router.post('/readUserNames', UserController.readUserNames);
router.post('/readOneUserById', UserController.readOneUserById);
router.post('/updateUser', UserController.updateUser);
router.post('/updatePassword', UserController.updatePassword);
router.post('/deleteUser', UserController.deleteUser);
router.post('/setAnswer', UserController.setAnswer);
router.post('/updateClinic', UserController.updateClinic);

module.exports = router;