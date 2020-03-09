

/**
 * Module dependencies.
 */
const chalk = require('chalk');
const mkpath = require('mkpath');
const config = require('../config');
const mongooseService = require('./mongoose');
const express = require('./express');
const seed = require('./mongo-seed');

function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
    seed.start();
  }
}

module.exports.init = function init(callback) {
  mongooseService.connect((db) => {
    // Initialize Models
    mongooseService.loadModels(seedDB);

    // Initialize express
    const app = express.init(db);
    if (callback) callback(app, db, config);
  });
  config.files.server.uploads.forEach((uploadDir) => {
    mkpath(uploadDir, 0o0766, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
};

module.exports.start = function start(callback) {
  this.init((app, db, config) => {
    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, () => {
      // Create server URL
      const server = `${(process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host}:${config.port}`;
      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log();
      console.log(chalk.green(`Environment:     ${process.env.NODE_ENV}`));
      console.log(chalk.green(`Server:          ${server}`));
      console.log(chalk.green(`Database:        ${config.db.uri}`));
      console.log(chalk.green(`App version:     ${config.meanjs.version}`));
      if (config.meanjs['meanjs-version']) console.log(chalk.green(`MEAN.JS version: ${config.meanjs['meanjs-version']}`));
      console.log('--');

      if (callback) callback(app, db, config);
    });
  });
};
