const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./controllerFactory');

// @route				GET /api/v1/user/me
// @desc				Get current logged in user
// @access			Private
exports.getMe = factory.getUser(true);

// @route				PATCH /api/v1/user/message
// @desc				Update user details !NOT PASSWORD
// @access			Private
exports.updateMe = factory.updateUser(true);
