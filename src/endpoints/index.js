const path = require("path");

module.exports = (app) => {
  let API_PREFIX = "/v1";
  if (!process.env.CORS_CLIENT_DOMAIN) {
    console.log('[WARN] The CORS_CLIENT_DOMAIN for Cross Origin Control is not set.')
  }

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CORS_CLIENT_DOMAIN || '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    if ('OPTIONS' === req.method) {
      return res.status(200).send();
    }
    next();
  });

  app.use(API_PREFIX + '/auth', require('./auth'));
  app.use(API_PREFIX + '/groups', require('./groups'));
  app.use(API_PREFIX + '/tickets', require('./tickets'));

  app.use((req, res, next) => {
    if(req.accepts('json')) {
      return res
        .status(404)
        .json({
          "error": "The resource is not found."
        });
    }

    res
      .status(406)
      .send('Page not found');
  });
};
