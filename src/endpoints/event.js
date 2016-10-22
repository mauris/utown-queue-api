const express = require('express');
const router = express.Router();
const models = require('utown-queue-db');
const authChecker = require('../middleware/auth');
const bot = require('../bot');
const Promise = require('bluebird');

module.exports = router;

router.get('/', authChecker, (req, res, next) => {
  res.json({
    status: 'ok',
    result: req.event
  });
});
