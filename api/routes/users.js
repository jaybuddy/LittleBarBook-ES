const controller = require('../controllers/users');
const validateToken = require('../lib/utils').validateToken;

module.exports = (router) => {
  router.route('/user')
    .post(controller.create)
    .get(validateToken, controller.read)
    .patch(validateToken, controller.update);

  router.route('/login')
    .post(controller.login);

    router.route('/logout')
    .post(controller.logout);
};