const crypto = require('crypto');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const sendMail = require('../utils/sendMail');
const respondWithToken = require('../utils/tokenResponse');

// @route				POST /api/v1/auth/register
// @desc				Register new user
// @access			Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const role = req.body.role === 'admin' ? 'user' : req.body.role;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role
  });

  respondWithToken({ id: newUser._id }, 201, res, {
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

  respondWithToken({ id: user._id }, 200, res);
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

// @route				POST /api/v1/auth/resetpassword
// @desc				Request a password reset
// @access			Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse('User with this email does not exist', 404));
  }

  const resetToken = user.generateResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  try {
    await sendMail({
      to: req.body.email,
      subject: 'Password Reset',
      message: `You are receiving this message because you (or someone else) have requested the reset of your password. Please make a PATCH request to: \n\n ${resetUrl}`
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorResponse('Email could not be sent. Please try again later', 500)
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Email sent'
  });
});

// @route				PATCH	/api/v1/auth/resetpassword
// @desc				Reset user's password
// @access			Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  respondWithToken({ id: user._id }, 200, res, { message: 'Password changed' });
});
