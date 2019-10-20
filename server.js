const dotenv = require('dotenv');

// Setting up dev environment
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './config/.env' });
}

// Main app module
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Process handlers
process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection. Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM. Shutting down...');
  server.close(() => {
    console.log('Server closed.');
  });
});
