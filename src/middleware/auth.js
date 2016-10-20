let models  = require('utown-queue-db');
let Promise = require('bluebird');
let jwt     = Promise.promisifyAll(require('jsonwebtoken'));

module.exports = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    return res
      .status(403)
      .json({ "error": "Authentication Failed." });
  }
  jwt.verifyAsync(token, process.env.API_AUTH_SECRET)
    .then((decoded) => {
      return models.Event
        .find({
          where: {
            eventCode: decoded.code,
            secret: decoded.secret
          }
        });
    })
    .then((event) => {
      if (!event) {
        throw new Error();
      }
      req.event = event;
      next();
    })
    .catch((err) => {
      res
        .status(403)
        .json({
          "error": "Authentication failed."
        });
    });
};
