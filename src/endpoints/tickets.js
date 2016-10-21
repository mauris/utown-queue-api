const express = require('express');
const router = express.Router();
const models = require('utown-queue-db');
const authChecker = require('../middleware/auth');

module.exports = router;

router.get('/', authChecker, (req, res, next) => {
  req.event.getTickets({ where: { datetimeStart: null } })
    .then((tickets) => {
      res.json({
        status: 'ok',
        result: tickets
      });
    })
});
