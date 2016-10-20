const express = require('express');
const router = express.Router();
const models = require('utown-queue-db');
const jwt = require('jsonwebtoken');

module.exports = router;

router.post('/request', (req, res, next) => {
  let eventCode = req.body.code;
  let secret = req.body.secret;

  var token = jwt.sign({code: eventCode, secret: secret}, process.env.API_AUTH_SECRET, {
    "expiresIn": '1d'
  });
  res.json({status: 'ok', token: token});
});
