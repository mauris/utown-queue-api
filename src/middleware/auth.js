let models = require('utown-queue-db');
let Promise = require('bluebird');
let jwt = Promise.promisifyAll(require('jsonwebtoken'));
let bcrypt = Promise.promisifyAll(require('bcryptjs'));

module.exports = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['authorization'];
  if (!token) {
    return res
      .status(403)
      .json({ "status": "error", "msg": "Authentication Failed" });
  }
  let secret = null;
  jwt.verifyAsync(token, process.env.API_AUTH_SECRET)
    .then((decoded) => {
      secret = decoded.secret;
      return models.Event
        .findOne({
          where: {
            eventId: decoded.eventId
          },
          raw: true
        });
    })
    .then((event) => {
      if (!event) {
        throw new Error('Event not found');
      }
      if (!bcrypt.compareSync(secret, event.secret)) {
        throw new Error('Secret is wrong');
      }
      delete event.secret;
      req.event = event;
      next();
      return null;
    })
    .catch((err) => {
      return res
        .status(403)
        .json({ "status": "error", "msg": "Authentication Failed" });
    });
};
