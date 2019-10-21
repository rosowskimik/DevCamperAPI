const dotenv = require('dotenv');
const mongoose = require('mongoose');
const colors = require('colors');

// Setting up dev environment
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './config/.env' });
}

// Setting up database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(conn =>
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    )
  );

// Main app module
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Process handlers
process.on('unhandledRejection', err => {
  console.log(`Unhandled Rejection: ${err.message} Shutting down...`.red);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM. Shutting down...'.blue.underline.bold);
  server.close(() => console.log('Server closed.'.blue.underline));
});
