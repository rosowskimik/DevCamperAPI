const express = require('express');
const rateLimit = require('express-rate-limit');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.head('/logout', authController.logout);

// Rate limiting (5 requests / hour)
const authLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many requests from this IP address. Please try again in an hour'
});

router.use(authLimit);

router.post('/register', authController.register);
router.post('/resetpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

module.exports = router;
