const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.head('/logout', authController.logout);
router.post('/resetpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

module.exports = router;
