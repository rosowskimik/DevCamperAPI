const AppError = require('../utils/appError');

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

  return new AppError(message, 400);
};

const handleDuplicateKey = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate key value: ${value}. Please enter a different value.`;

  return new AppError(message, 400);
};

const handleMulterSizeError = err => {
  const message = 'Only images up to 2 MB are supported.';

  return new AppError(message, 413);
};

const handleValidationError = ({ errors }) => {
  const messages = Object.keys(errors).map(
    key => `${errors[key].path}: ${errors[key].message}`
  );

  return new AppError(messages, 400);
};

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

    sendErrorProd(errCp, req, res);
  }
};
