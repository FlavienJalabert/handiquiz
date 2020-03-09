const quizzController = require('../controller/quizz.controller');

module.exports = (app) => {
  // Setting up the user api
  app.route('/quiz/create').post(quizzController.save);
  app.route('/quiz/getAll').get(quizzController.getAll);
};
