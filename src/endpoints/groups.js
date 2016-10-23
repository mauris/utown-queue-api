const express = require('express');
const router = express.Router();
const models = require('utown-queue-db');
const authChecker = require('../middleware/auth');
const bot = require('../bot');
const Promise = require('bluebird');

module.exports = router;

router.get('/', authChecker, (req, res, next) => {
  req.event.getGroups({ where: { datetimeStart: null }, include: [{ model: models.Ticket, as: 'tickets', include: [{ model: models.User, as: 'user' }] }] })
    .then((groups) => {
      res.json({
        status: 'ok',
        result: groups
      });
    });
  return null;
});

router.post('/:id/markpresent', authChecker, (req, res, next) => {
  let groupId = req.params.id;
  models.Group
    .update(
      { isPresent: true },
      { where: { groupId: groupId, eventId: req.event.eventId, datetimeStart: null } }
    )
    .then(() => {
      res.json({
        'status': 'ok'
      });
    });
  return null;
});

router.post('/:id/request', authChecker, (req, res, next) => {
  let groupId = req.params.id;
  models.Group
    .find({ where: { groupId: groupId, eventId: req.event.eventId, datetimeStart: null }, include: [{ model: models.Ticket, as: 'tickets', include: [{ model: models.User, as: 'user' }] }] })
    .then((group) => {
      var promises = [];
      group.tickets.forEach((ticket) => {
        promises.push(bot.sendMessage(ticket.userId, "Hi " + ticket.user.name + ", your turn to " + req.event.eventName + " will be starting soon. Reach the entrance within the next 5 minutes, or else...\u{1F608}"));
      });
      return Promise.all(promises);
    })
    .then(() => {
      res.json({
        'status': 'ok'
      });
    });
  return null;
});

router.post('/:id/start', authChecker, (req, res, next) => {
  let groupId = req.params.id;
  models.sequelize.transaction((t) => {
    return models.Group
      .update(
        { datetimeStart: models.sequelize.fn('NOW') },
        { where: { groupId: groupId, eventId: req.event.eventId, datetimeStart: null }, transaction: t }
      )
      .then(() => {
        return Promise.all([
          models.Ticket.update({ isActive: false }, { where: { groupId: groupId, eventId: req.event.eventId }, transaction: t }),
          models.Ticket.findAll({ where: { groupId: groupId, eventId: req.event.eventId }, include: [{ model: models.User, as: 'user' }], transaction: t })
            .then((tickets) => {
              return Promise.map(tickets, (ticket) => {
                return ticket.user.update({ isInQueue: false }, { transaction: t });
              });
            })
        ]);
      })
      .then(() => {
        res.json({
          'status': 'ok'
        });
      });
  });
  return null;
});
