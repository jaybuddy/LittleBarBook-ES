const controller = require('../controllers/ingredients');
const { validateToken } = require('../lib/utils');

module.exports = (router) => {
  router.route('/ingredient')
    .delete(validateToken, controller.delete)
    .patch(validateToken, controller.update)
    .post(validateToken, controller.create);
};
