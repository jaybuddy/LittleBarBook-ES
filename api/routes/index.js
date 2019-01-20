const users = require('./users');
const drinks = require('./drinks');

module.exports = (router) => {
  users(router);
  drinks(router);
  return router;
};