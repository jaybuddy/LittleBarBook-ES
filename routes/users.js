const controller = require('../controllers/users');
const validateToken = require('../utils').validateToken;

module.exports = (router) => {
  router.route('/user')
    .post(controller.create)
    .get(validateToken, controller.read);

  router.route('/login')
    .post(controller.login);
};