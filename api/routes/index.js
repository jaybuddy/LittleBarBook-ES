const users = require('./users');
const drinks = require('./drinks');
const ingredients = require('./ingredients');
const tokens = require('./tokens');

module.exports = (router) => {
  users(router);
  drinks(router);
  ingredients(router);
  tokens(router);
  return router;
};