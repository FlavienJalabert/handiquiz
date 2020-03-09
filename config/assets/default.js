module.exports = {
  client: {
    lib: {
      css: [],
      js: [
        'public/utils',
      ],
      tests: [],
    },
    css: [],
    less: [],
    sass: [],
    js: [],
    img: [],
    views: [],
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    uploads: ['public/uploads', 'public/uploads/meta', 'public/uploads/images'],
    js: ['api/*/server/js/*.js'],
    allJS: ['server.js', 'config/**/*.js', 'api/*/server/**/*.js'],
    models: 'api/*/model/**/*.js',
    routes: ['api/!(core)/route/**/*.js', 'api/core/route/**/*.js'],
    sockets: 'api/*/server/sockets/**/*.js',
    config: ['api/*/server/config/*.js'],
    views: ['api/*/server/views/*.html'],
  },
};
