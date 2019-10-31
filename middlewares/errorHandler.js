const ErrorResponse = require('../utils/errorResponse');

// Response handlers
const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational)
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

  console.log(err);

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong.'
  });
};

// Error modifier functions
const handleCastError = err => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new ErrorResponse(message, 400);
};

const handleDuplicateKey = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate key value: ${value}. Please enter a different value.`;

  return new ErrorResponse(message, 400);
};

const handleMulterSizeError = err => {
  const message = 'Only images up to 2 MB are supported.';

  return new ErrorResponse(message, 413);
};

const handleValidationError = ({ errors }) => {
  const messages = Object.keys(errors).map(
    key => `${errors[key].path}: ${errors[key].message}`
  );

  return new ErrorResponse(messages, 400);
};

const handleInvalidToken = () =>
  new ErrorResponse('Invalid token. Please login again', 401);

const handleExpiredToken = () =>
  new ErrorResponse('Your token has expired. please login again', 401);

// Error handler middleware
module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let errCp = { ...err };
    errCp.message = err.message;

    if (errCp.name === 'CastError') errCp = handleCastError(errCp);
    if (errCp.code === 11000) errCp = handleDuplicateKey(errCp);
    if (errCp.code === 'LIMIT_FILE_SIZE') errCp = handleMulterSizeError(errCp);
    if (errCp.name === 'ValidationError') errCp = handleValidationError(errCp);
    if (errCp.name === 'JsonWebTokenError') errCp = handleInvalidToken();
    if (errCp.name === 'TokenExpiredError') errCp = handleExpiredToken();

    sendErrorProd(errCp, req, res);
  }
};
