const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

// @route				POST /api/v1/auth/register
// @desc				Register new user
// @access			Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
    confirmed: false
  });

  res.status(201).json({
    status: 'success',
    message:
      'Account successfully created. Please check your email for account activation email.'
  });
});
