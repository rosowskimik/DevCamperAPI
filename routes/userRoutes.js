const express = require('express');

const userController = require('../controllers/userController');

const auth = require('../middlewares/auth');

const router = express.Router();

router.use(auth.protect);
router.route('/me').get(userController.getMe);

module.exports = router;
