const users = require('./users');
const drinks = require('./drinks');
const ingredients = require('./ingredients');

module.exports = (router) => {
  users(router);
  drinks(router);
  ingredients(router);
  return router;
};
