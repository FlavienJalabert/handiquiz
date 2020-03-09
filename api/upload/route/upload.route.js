const uploadController = require('../controller/upload.controller');

module.exports = (app) => {
  // Setting up the user api
  app.route('/upload/add').post(uploadController.save);
  // app.route('/user/:name').put(uploadController.update).get(uploadController.get).delete(uploadController.delete); TODO
};
