﻿const _ = require('lodash');
const mongoose = require('mongoose');
const chalk = require('chalk');
const config = require('../config');

function seed(collection, seedOptions) {
  // Merge options with collection options
  const options = _.merge(seedOptions || {}, collection.options || {});

  return new Promise(((resolve, reject) => {
    const Model = mongoose.model(collection.model);
    const { docs } = collection;

    const skipWhen = collection.skip ? collection.skip.when : null;

    if (!Model.seed) {
      reject(new Error(`Database Seeding: Invalid Model Configuration - ${collection.model}.seed() not implemented`));
    }

    if (!docs || !docs.length) {
      resolve();
    }

    // First check if we should skip this collection
    // based on the collection's "skip.when" option.
    // NOTE: If it exists, "skip.when" should be a qualified
    // Mongoose query that will be used with Model.find().
    skipCollection()
      .then(seedDocuments)
      .then(() => resolve())
      .catch(err => reject(err));

    function skipCollection() {
      return new Promise(((resolve, reject) => {
        if (!skipWhen) {
          return resolve(false);
        }

        Model
          .find(skipWhen)
          .exec((err, results) => {
            if (err) {
              return reject(err);
            }

            if (results && results.length) {
              return resolve(true);
            }

            return resolve(false);
          });
      }));
    }

    function seedDocuments(skipCollection) {
      return new Promise(((resolve, reject) => {
        if (skipCollection) {
          return onComplete([{ message: chalk.yellow(`Database Seeding: ${collection.model} collection skipped`) }]);
        }

        // Local Closures

        function onComplete(responses) {
          if (options.logResults) {
            responses.forEach((response) => {
              if (response.message) {
                console.log(chalk.magenta(response.message));
              }
            });
          }

          return resolve();
        }

        function onError(err) {
          return reject(err);
        }

        const workload = docs
          .filter(doc => doc.data)
          .map(doc => Model.seed(doc.data, { overwrite: doc.overwrite }));

        Promise.all(workload)
          .then(onComplete)
          .catch(onError);
      }));
    }
  }));
}

function start(seedConfig = {}) {
  return new Promise(((resolve, reject) => {
    const options = seedConfig.options
      || (config.seedDB ? _.clone(config.seedDB.options, true) : {});
    const collections = seedConfig.collections
      || (config.seedDB ? _.clone(config.seedDB.collections, true) : []);

    if (!collections.length) {
      resolve();
    }

    // Local Promise handlers

    function onSuccessComplete() {
      if (options.logResults) {
        console.log();
        console.log(chalk.bold.green('Database Seeding: Mongo Seed complete!'));
        console.log();
      }

      resolve();
    }

    function onError(err) {
      if (options.logResults) {
        console.log();
        console.log(chalk.bold.red('Database Seeding: Mongo Seed Failed!'));
        console.log(chalk.bold.red(`Database Seeding: ${err}`));
        console.log();
      }

      reject(err);
    }

    const seeds = collections
      .filter(collection => collection.model);

    // Use the reduction pattern to ensure we process seeding in desired order.
    seeds.reduce((p, item) => p.then(() => seed(item, options)), Promise.resolve())
      // start with resolved promise for initial previous (p) item
      .then(onSuccessComplete)
      .catch(onError);
  }));
}

exports.start = start;
