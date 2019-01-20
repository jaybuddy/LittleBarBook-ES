const controller = require('../controllers/drinks');
const validateToken = require('../utils').validateToken;

module.exports = (router) => {
  router.route('/drinks')
    .get(validateToken, controller.readAll);

  router.route('/drink')
    .get(validateToken, controller.read)
    .delete(validateToken, controller.delete)
    .patch(validateToken, controller.update)
    .post(validateToken, controller.create);

};