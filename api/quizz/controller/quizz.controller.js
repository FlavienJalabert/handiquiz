const mongoose = require('mongoose');
const _ = require('lodash');
// Require User model in our routes module
const Quiz = mongoose.model('Quiz');

module.exports.save = (req, res) => {
  const quiz = new Quiz(req.body);

  quiz.save()
    .then(() => {
      res.status(200).json(quiz);
    })
    .catch((e) => {
      console.log(e);
      res.status(400).send('Bad Request');
    });
};

module.exports.getAll = (req, res) => {
  Quiz.find((err, quiz) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(quiz);
  });
};
