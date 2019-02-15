const users = require('./users');
const drinks = require('./drinks');
const ingredients = require('./ingredients');
const tags = require('./tags');
const events = require('./events');

module.exports = (router) => {
  users(router);
  drinks(router);
  ingredients(router);
  tags(router);
  events(router);
  return router;
};
