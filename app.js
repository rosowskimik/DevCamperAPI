const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const bootcampRoutes = require('./routes/bootcampRoutes');

const app = express();

// Development middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic security headers setup
app.use(helmet());

// Routes
app.use('/api/v1/bootcamps', bootcampRoutes);

module.exports = app;
