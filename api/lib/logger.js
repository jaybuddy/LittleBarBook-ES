const bunyan = require('bunyan');

const logger = bunyan.createLogger({ name: 'Little Bar Book' });
module.exports = logger;
