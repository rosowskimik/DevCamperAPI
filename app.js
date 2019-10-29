const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const bootcampRoutes = require('./routes/bootcampRoutes');
const courseRoutes = require('./routes/courseRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Development middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic security headers setup
app.use(helmet());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1/bootcamps', bootcampRoutes);
app.use('/api/v1/courses', courseRoutes);

// Global error handler middleware
app.use(errorHandler);

module.exports = app;
