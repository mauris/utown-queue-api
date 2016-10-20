const express = require('express');
const router = express.Router();
const models = require('utown-queue-db');
const authChecker = require('../middleware/auth');

module.exports = router;

router.get('/', authChecker, (req, res, next) => {
  req.event.getGroups()
    .then((groups) => {
      res.json({
        status: 'ok',
        result: groups
      });
    })
});
