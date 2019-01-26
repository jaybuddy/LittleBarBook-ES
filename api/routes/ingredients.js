const controller = require('../controllers/ingredients');
const { validateToken } = require('../lib/utils');

module.exports = (router) => {
  router.route('/ingredients')
    .get(validateToken, controller.readAll)
    .delete(validateToken, controller.deleteAll);

  router.route('/ingredient')
    .get(validateToken, controller.read)
    .delete(validateToken, controller.delete)
    .patch(validateToken, controller.update)
    .post(validateToken, controller.create);
};
