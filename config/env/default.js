module.exports = {
  app: {
    title: 'HANDIQUIZ',
    description: 'Full-Stack JavaScript with MongoDB, Express, VueJS, and Node.js',
    keywords: 'mongodb, express, vuejs, node.js, mongoose',
  },
  db: {
    promise: global.Promise,
  },
  port: process.env.PORT || 4000,
  host: process.env.HOST || 'localhost',
  // DOMAIN config should be set to the fully qualified application accessible
  // URL. For example: https://www.myapp.com (including port if required).
  domain: process.env.DOMAIN,
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false,
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'kqndiqbfsdbf',
  // pass phrase is the common passphrase for signature
  passPhrase: process.env.JWT_PASS_PHRASE,
  // sessionKey is the cookie session name
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true,
  },
  logo: 'public/img/brand/logo.png',
  favicon: 'public/img/favicon.ico',
  illegalUsernames: ['administrator', 'password', 'admin', 'user',
    'unknown', 'anonymous', 'null', 'undefined', 'api',
  ],
};
