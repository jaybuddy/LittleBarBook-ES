const controller = require('../controllers/events');
const { validateToken } = require('../lib/utils');

module.exports = (router) => {
  router.route('/drink')
    .get(validateToken, controller.read)
    .post(validateToken, controller.create);
};
