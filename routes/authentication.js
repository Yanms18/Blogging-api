const express = require('express');
const authController = require('../controller/authcontroller');

const router = express.Router();

// Signup Route
router.post('/signup', authController.signup);

// Signin Route
router.post('/signin', authController.signin);

module.exports = router;