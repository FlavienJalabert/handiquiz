const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
// Require User model in our routes module
const User = mongoose.model('User');

module.exports.save = (req, res) => {
  const user = new User(req.body);

  user.save()
    .then(() => {
      res.status(200).json(user);
    })
    .catch((e) => {
      console.log(e);
      res.status(400).send('Bad Request');
    });
};

module.exports.getAll = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.json(err);
    }
    return res.json(users);
  });
};

module.exports.get = (req, res) => {
  const { id } = req.params;

  User.findById(id, (err, user) => {
    if (err) {
      res.json(err);
    }
    res.json(user);
  });
};

module.exports.update = (req, res) => {
  const { id } = req.params;
  User.findById(id, (err, user) => {
    if (!user) res.status(404).send('no user with id %s has been discovered', id);
    else {
      const newUser = _.merge(user, req.body);
      newUser.save().then(() => {
        res.json('Update complete');
      })
        .catch(() => {
          res.status(400).send('unable to update the database');
        });
    }
  });
};

module.exports.delete = (req, res) => {
  User.findByIdAndRemove({ _id: req.params.id }, (err) => {
    if (err) res.json(err);
    else res.json('Successfully removed');
  });
};

module.exports.login = (req, res) => {
  User.find({ email: req.body.email }, (err, users) => {
    const user = users[0];
    if (err || !user) return res.status(401).send(`No user with email ${req.body.email} has been found.`);
    if (user.password === req.body.password) {
    // if (users[0].authenticate(req.body.password)) {
      const token = jwt.sign({
        roles: user.roles,
        typ: 'Bearer',
        // eslint-disable-next-line no-underscore-dangle
        userId: user._id,
        mail: user.email,
        displayName: user.displayName,
        exp: Date.now() + 1000 * 60 * 60 * 2, // 2h
      },
      process.env.JWT_PASS_PHRASE,
      {
        algorithm: 'HS256',
        subject: 'userToken',
        issuer: 'handiquiz.com',
        notBefore: '1',
        audience: user.provider,
        header: {
          typ: 'JWT',
          alg: 'HS256',
        },
      });
      return res.json({ access_token: token });
    }
    return res.status(401).send('Wrong Password');
  });
};
