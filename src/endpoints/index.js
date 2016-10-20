const path = require("path");

module.exports = (app) => {
  let API_PREFIX = "/v1";

  app.use(API_PREFIX + '/auth', require('./auth'));
  app.use(API_PREFIX + '/groups', require('./groups'));

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
