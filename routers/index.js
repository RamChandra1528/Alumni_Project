// routes/index.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Other routes...

// Route for forgot password page
router.get('/forgot-password', authController.forgotPasswordPage);
router.post('/forgot-password', authController.handleForgotPassword);

module.exports = router;
