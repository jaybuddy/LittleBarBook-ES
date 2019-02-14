const controller = require('../controllers/tags.js');
const { validateToken } = require('../lib/utils');

module.exports = (router) => {
  router.route('/tag')
    .delete(validateToken, controller.delete)
    .patch(validateToken, controller.update)
    .post(validateToken, controller.create);
};
