const userController = require('../controller/user.controller');

module.exports = (app) => {
  // Setting up the user api
  app.route('/user/add').post(userController.save);
  app.route('/user/:id').put(userController.update).get(userController.get).delete(userController.delete);
  app.route('/user').get(userController.getAll);
  app.route('/user/login').post(userController.login);
};
