const { promisify } = require('util');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log(req.cookies);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // Check if token was provided
  if (!token) {
    return next(
      new ErrorResponse('You need to login to access this resource', 401)
    );
  }

  // Validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select('+passwordChangedAt');

  // Check if user this token belongs to still exists
  if (!user) {
    return next(
      new ErrorResponse(
        'The user this token was issued for no longer exists',
        404
      )
    );
  }

  // Check if user changed password after token was issued
  if (user.wasPasswordChanged(decoded.iat)) {
    return next(
      new ErrorResponse(
        'User recently changed password. Please login again',
        401
      )
    );
  }
  delete user.passwordChangedAt;
  req.user = user;
  next();
});

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User with role ${req.user.role} cannot access the resource`,
        403
      )
    );
  }
  next();
};
