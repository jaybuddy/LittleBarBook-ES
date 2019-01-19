const controller = require('../controllers/drinks');
const validateToken = require('../utils').validateToken;

module.exports = (router) => {
  router.route('/drinks/view')
    .get(validateToken, controller.readAll);

  router.route('/drink/view/:slug')
    .get(validateToken, controller.read);

  router.route('/drink/delete/:id')
    .post(validateToken, controller.delete)

  router.route('/drink/edit/:slug')
    .post(validateToken, controller.update);

  router.route('/drink/add')
    .post(validateToken, controller.create);
};