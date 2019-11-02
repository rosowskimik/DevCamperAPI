const express = require('express');

const userController = require('../controllers/userController');

const auth = require('../middlewares/auth');

const router = express.Router();

router.use(auth.protect);
router
  .route('/me')
  .get(userController.getMe)
  .patch(userController.updateMe)
  .delete(userController.deleteMe);

router.patch('/changemypassword', userController.changePassword);

// Admin only routes
router.use(auth.authorize('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
