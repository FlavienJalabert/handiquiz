const systemController = require('../controller/system.controller');

module.exports = (app) => {
  // Setting up the system api
  app.route('/server-error').get(systemController.serverError);
};
