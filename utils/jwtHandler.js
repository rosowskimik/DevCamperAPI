const jwt = require('jsonwebtoken');

exports.signToken = payload => {
  return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE
  });
};

exports.respondWithToken = (token, statusCode, req, res, data) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
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
