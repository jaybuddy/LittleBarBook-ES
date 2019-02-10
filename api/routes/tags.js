const controller = require('../controllers/tags.js');
const { validateToken } = require('../lib/utils');

module.exports = (router) => {
  router.route('/tags')
    .get(validateToken, controller.readAll);

  router.route('/tag')
    .get(validateToken, controller.read)
    .delete(validateToken, controller.delete)
    .patch(validateToken, controller.update)
    .post(validateToken, controller.create);
};
