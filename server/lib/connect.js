// Create the database connection
const mongoose = require('mongoose');
const connUri = require('../lib/database');
const logger = require('../lib/logger').getLogger();

mongoose.connect(connUri, { useNewUrlParser: true });

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  logger.info('Mongoose default connection open');
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  logger.info(`Mongoose default connection error, ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
