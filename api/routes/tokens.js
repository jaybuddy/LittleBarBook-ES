const controller = require('../controllers/tokens');
const { validateToken } = require('../lib/utils');

module.exports = (router) => {
  router.route('/expire-token')
    .post(validateToken, controller.create);
};
