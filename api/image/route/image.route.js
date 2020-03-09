const imageController = require('../controller/image.controller');

module.exports = (app) => {
  // Setting up the user api
  app.route('/image/getAll').get(imageController.getAll);
};
