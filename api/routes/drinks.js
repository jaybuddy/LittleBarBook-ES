const controller = require('../controllers/drinks');
const { validateToken } = require('../lib/utils');

module.exports = (router) => {
  router.route('/drink')
    .delete(validateToken, controller.delete)
    .patch(validateToken, controller.update)
    .post(validateToken, controller.create);
};
