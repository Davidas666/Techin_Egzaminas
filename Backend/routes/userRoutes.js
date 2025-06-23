const express = require('express');
const { signup, login, protect, logout } = require('../controller/authController.js');
const { getMyTours, getUsers, deleteUser, updateUserRole, updateUserUsername } = require('../controller/userController.js');
const validate = require('../validator/validate.js');
const validateNewUser = require('../validator/signup.js');
const validateLogin = require('../validator/login.js');
const { allowAccessTo } = require('../controller/authController.js');

const router = express.Router();

router.route('/signup').post(validateNewUser, validate, signup);
router.route('/login').post(validateLogin, login);
router.route('/logout').get(protect, logout);
router.route('/me/tours').get(protect, getMyTours);
router.route('/').get(protect, allowAccessTo('admin'), getUsers);
router.route('/:id').delete(protect, allowAccessTo('admin'), deleteUser).patch(protect, allowAccessTo('admin'), updateUserRole);
router.route('/:id/username').patch(protect, allowAccessTo('admin'), updateUserUsername);

module.exports = router;

