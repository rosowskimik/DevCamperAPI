const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const APIFeatures = require('../utils/apiFeatures');
const respondWithToken = require('../utils/tokenResponse');
const factory = require('./controllerFactory');

// @route				GET /api/v1/users/me
// @desc				Get logged in user details
// @access			Private
exports.getMe = factory.getUser(true);

// @route				PATCH /api/v1/users/me
// @desc				Update logged in user details !NOT PASSWORD
// @access			Private
exports.updateMe = factory.updateUser(true);

// @route				PATCH /api/v1/users/changemypassword
// @desc				Update logged in user password
// @access			Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.isPasswordCorrect(req.body.oldPassword))) {
    return next(new ErrorResponse('Incorrect password', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  respondWithToken({ id: user._id }, 200, res, { message: 'Password changed' });
});

// @route				DELETE /api/v1/users/me
// @desc				Delete logged in user
// @access			Private
exports.deleteMe = factory.deleteUser(true);
