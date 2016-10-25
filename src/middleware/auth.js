let models = require('utown-queue-db');
let Promise = require('bluebird');
let jwt = Promise.promisifyAll(require('jsonwebtoken'));
let bcrypt = Promise.promisifyAll(require('bcryptjs'));

module.exports = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['authorization'];
  if (!token) {
    return res
      .status(403)
      .json({ "error": "Authentication Failed." });
  }
  let secret = null;
  jwt.verifyAsync(token, process.env.API_AUTH_SECRET)
    .then((decoded) => {
      secret = decoded.secret;
      return models.Event
        .find({
          attributes: { exclude: ['secret'] },
          where: {
            eventId: decoded.eventId
          }
        });
    })
    .then((event) => {
      if (!event) {
        throw new Error('Event not found');
      }
      if (!bcrypt.compareSync(secret, event.secret)) {
        throw new Error('Secret is wrong');
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
