const express = require('express');

const userController = require('../controllers/userController');

const auth = require('../middlewares/auth');

const router = express.Router();

router.use(auth.protect);
router
  .route('/me')
  .get(userController.getMe)
  .patch(userController.updateMe);

router.patch('/changemypassword', userController.changePassword);

module.exports = router;
