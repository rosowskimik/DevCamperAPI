const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

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

  const token = signToken({ id: newUser._id });

  respondWithToken(token, 201, res, {
    message: 'User created'
  });
});

// @route				POST /api/v1/auth/login
// @desc				Login user
// @access			Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new ErrorResponse('Incorrect email or password', 401));
  }

  const token = signToken({ id: user._id });

  respondWithToken(token, 200, res);
});

// @route				HEAD /api/v1/auth/logout
// @desc				Logout user (remove jwt cookie)
// @access			Public
exports.logout = (req, res, next) => {
  res
    .cookie('jwt', null, {
      expires: new Date(Date.now() + 1000 * 10),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    })
    .end();
};

// Local utils

// Sign JWT token
const signToken = payload => {
  return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE
  });
};

// Send back response with token as a cookie
const respondWithToken = (token, statusCode, res, data) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('jwt', token, cookieOptions)
    .json({
      status: 'success',
      token,
      ...data
    });
};
