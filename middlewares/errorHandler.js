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

// Error handler middleware
module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let errCp = { ...err };

    if (errCp.name === 'CastError') errCp = handleCastError(errCp);

    sendErrorProd(errCp, req, res);
  }
};
