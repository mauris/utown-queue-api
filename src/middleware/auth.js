let models  = require('utown-queue-db');
let Promise = require('bluebird');
let jwt     = Promise.promisifyAll(require('jsonwebtoken'));

module.exports = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['authorization'];
  if (!token) {
    return res
      .status(403)
      .json({ "error": "Authentication Failed." });
  }
  jwt.verifyAsync(token, process.env.API_AUTH_SECRET)
    .then((decoded) => {
      return models.Event
        .find({
          attributes: { exclude: ['secret'] },
          where: {
            eventId: decoded.eventId,
            secret: decoded.secret
          }
        });
    })
    .then((event) => {
      if (!event) {
        throw new Error('Event not found');
      }
      req.event = event;
      next();
      return null;
    })
    .catch((err) => {
      res
        .status(403)
        .json({
          "error": "Authentication failed."
        });
    });
};
