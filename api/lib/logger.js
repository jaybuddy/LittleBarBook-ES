const bunyan = require('bunyan');

let logger;

function getLogger() {
  // Bail early if we already have a logger.
  if (logger) {
    return logger;
  }

  logger = bunyan.createLogger({
    name: 'Little Bar Book',
  });

  return logger;
}

module.exports = { getLogger };
