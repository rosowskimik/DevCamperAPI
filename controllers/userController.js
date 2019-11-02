const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./controllerFactory');

// @route				GET /api/v1/user/me
// @desc				Get current logged in user
// @access			Private
exports.getMe = factory.getUser(true);
