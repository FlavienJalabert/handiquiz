/**
 * Module dependencies.
 */
const _ = require('lodash');
const chalk = require('chalk');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../config');

// Load the mongoose models
module.exports.loadModels = (callback) => {
  // Globbing models files
  config.files.server.models.forEach((modelPath) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    require(path.resolve(modelPath));
  });

  if (callback) callback();
};

// Initialize Mongoose
module.exports.connect = (callback) => {
  mongoose.Promise = config.db.promise;

  const options = _.merge(config.db.options || {}, { useMongoClient: true });

  mongoose
    .connect(config.db.uri, options)
    .then((connection) => {
      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);

      // Call callback FN
      if (callback) callback(connection.db);
    })
    .catch((err) => {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
    });
};

module.exports.disconnect = (cb) => {
  mongoose.connection.db
    .close((err) => {
      console.info(chalk.yellow('Disconnected from MongoDB.'));
      return cb(err);
    });
};
