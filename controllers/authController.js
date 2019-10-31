const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const jwtHandler = require('../utils/jwtHandler');

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
    role
  });

  const token = jwtHandler.signToken({ id: newUser._id });

  jwtHandler.respondWithToken(token, 201, req, res, {
    message: 'User created'
  });
});

// @route				POST /api/v1/auth/login
// @desc				Login user
// @access			public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new ErrorResponse('Incorrect email or password', 401));
  }

  const token = jwtHandler.signToken({ id: user._id });

  jwtHandler.respondWithToken(token, 201, req, res);
});
