const defaultEnvConfig = require('./default');

module.exports = {
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost'}/api-test`,
    options: {},
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false,
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    // format: 'dev'
    // fileLogger: {
    //   directoryPath: process.cwd(),
    //   fileName: 'app.log',
    //   maxsize: 10485760,
    //   maxFiles: 2,
    //   json: false
    // }
  },
  port: process.env.PORT || 3001,
  app: {
    title: `${defaultEnvConfig.app.title} - Test Environment`,
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD',
      },
    },
  },
  seedDB: {
    seed: process.env.MONGO_SEED === 'false',
    options: {
      // Default to not log results for tests
      logResults: process.env.MONGO_SEED_LOG_RESULTS === 'true',
    },
    collections: [],
  },
};
