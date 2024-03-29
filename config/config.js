/**
 * Module dependencies.
 */
require('env2')('.env');
const _ = require('lodash');
const chalk = require('chalk');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

/**
 * Get files by glob patterns
 */
const getGlobbedPaths = (globPatterns, excludes) => {
  // URL paths regex
  // eslint-disable-next-line no-useless-escape
  const urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  let output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach((globPattern) => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map((file) => {
          if (_.isArray(excludes)) {
            // eslint-disable-next-line no-restricted-syntax
            for (const i in excludes) {
              // eslint-disable-next-line no-prototype-builtins
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '');
              }
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};

/**
 * Validate NODE_ENV existence
 */
const validateEnvironmentletiable = function () {
  const environmentFiles = glob.sync(`./config/env/${process.env.NODE_ENV}.js`);
  console.log();
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red(`+ Error: No configuration file found for "${process.env.NODE_ENV}" environment using development instead`));
    } else {
      console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
    }
    process.env.NODE_ENV = 'development';
  }
  // Reset console color
  console.log(chalk.white(''));
};

/** Validate config.domain is set
 */
const validateDomainIsSet = function (config) {
  if (!config.domain) {
    console.log(chalk.red('+ Important warning: config.domain is empty. It should be set to the fully qualified domain of the app.'));
  }
};

const validatePassPhraseIsSet = function (config) {
  if (!config.passPhrase) {
    throw new Error('PASS PHRASE MUST BE SET !');
  }
};

/**
 * Validate Secure=true parameter can actually be turned on
 * because it requires certs and key files to be available
 */
const validateSecureMode = function (config) {
  if (!config.secure || config.secure.ssl !== true) {
    return true;
  }

  const privateKey = fs.existsSync(path.resolve(config.secure.privateKey));
  const certificate = fs.existsSync(path.resolve(config.secure.certificate));

  if (!privateKey || !certificate) {
    console.log(chalk.red('+ Error: Certificate file or key file is missing, falling back to non-SSL mode'));
    console.log(chalk.red('  To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh'));
    console.log();
    config.secure.ssl = false;
  }
};

/**
 * Validate Session Secret parameter is not set to default in production
 */
const validateSessionSecret = function (config, testing) {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  if (config.sessionSecret === 'MEAN') {
    if (!testing) {
      console.log(chalk.red('+ WARNING: It is strongly recommended that you change sessionSecret config while running in production!'));
      console.log(chalk.red('  Please add `sessionSecret: process.env.SESSION_SECRET || \'super amazing secret\'` to '));
      console.log(chalk.red('  `config/env/production.js` or `config/env/local.js`'));
      console.log();
    }
    return false;
  }
  return true;
};

/**
 * Initialize global configuration files
 */
const initGlobalConfigFolders = function (config, assets) {
  // Appending files
  config.folders = {
    server: {},
    client: {},
  };

  // Setting globbed client paths
  config.folders.client = getGlobbedPaths(path.join(process.cwd(), 'modules/*/client/'), process.cwd().replace(new RegExp(/\\/g), '/'));
};

/**
 * Initialize global configuration files
 */
const initGlobalConfigFiles = function (config, assets) {
  // Appending files
  config.files = {
    server: {},
    client: {},
  };

  // Setting Globbed models files
  config.files.server.models = getGlobbedPaths(assets.server.models);

  // Setting Globbed route files
  config.files.server.routes = getGlobbedPaths(assets.server.routes);

  // Setting Globbed config files
  config.files.server.configs = getGlobbedPaths(assets.server.config);

  // Setting Globbed uploads files
  config.files.server.uploads = assets.server.uploads;

  // Setting Globbed socket files
  config.files.server.sockets = getGlobbedPaths(assets.server.sockets);

  // Setting Globbed policies files
  config.files.server.policies = getGlobbedPaths(assets.server.policies);

  // Setting Globbed js files
  config.files.client.js = getGlobbedPaths(assets.client.lib.js, 'public/').concat(getGlobbedPaths(assets.client.js, ['public/']));

  // Setting Globbed important js files
  config.files.client.importantJs = getGlobbedPaths(assets.client.importantJs || [], 'public/');

  config.files.client.js = _.difference(config.files.client.js, config.files.client.importantJs);

  // Setting Globbed css files
  config.files.client.css = getGlobbedPaths(assets.client.lib.css, 'public/').concat(getGlobbedPaths(assets.client.css, ['public/']));

  // Setting Globbed js files
  config.files.server.js = getGlobbedPaths(assets.client.lib.js, 'public/').concat(getGlobbedPaths(assets.server.js, ['public/']));

  // Setting Globbed css files
  config.files.server.css = getGlobbedPaths(assets.client.lib.css, 'public/').concat(getGlobbedPaths(assets.server.css, ['public/']));

  // Setting Globbed test files
  config.files.client.tests = getGlobbedPaths(assets.client.tests);
};

/**
 * Initialize global configuration
 */
const initGlobalConfig = function () {
  // Validate NODE_ENV existence
  validateEnvironmentletiable();

  // Get the default assets
  const defaultAssets = require(path.join(process.cwd(), 'config/assets/default'));

  // Get the current assets
  const environmentAssets = require(path.join(process.cwd(), 'config/assets/', process.env.NODE_ENV)) || {};

  // Merge assets
  const assets = _.merge(defaultAssets, environmentAssets);

  // Get the default config
  const defaultConfig = require(path.join(process.cwd(), 'config/env/default'));

  // Get the current config
  const environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};

  // Merge config files
  let config = _.merge(defaultConfig, environmentConfig);

  // read package.json for MEAN.JS project information
  config.meanjs = require(path.resolve('./package.json'));

  // Extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings present in the local configuration.
  config = _.merge(config, (fs.existsSync(path.join(process.cwd(), `config/env/local-${process.env.NODE_ENV}.js`)) && require(path.join(process.cwd(), `config/env/local-${process.env.NODE_ENV}.js`))) || {});

  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);

  // Initialize global globbed folders
  initGlobalConfigFolders(config, assets);

  // Validate Secure SSL mode can be used
  validateSecureMode(config);

  // Validate session secret
  validateSessionSecret(config);

  // Print a warning if config.domain is not set
  validateDomainIsSet(config);

  // Stop the process if pass phrase is not set
  validatePassPhraseIsSet(config);

  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths,
    validateSessionSecret,
  };

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
