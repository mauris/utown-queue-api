const express = require('express');
const router = express.Router();
const models = require('utown-queue-db');
const authChecker = require('../middleware/auth');
const bot = require('../bot');
const Promise = require('bluebird');

module.exports = router;

router.get('/', authChecker, (req, res, next) => {
  models.Group
    .findAll({
      where: { datetimeStart: null, eventId: req.event.eventId },
      include: [
        { model: models.Ticket, as: 'tickets', include: [{ model: models.User, as: 'user' }] }
      ]
    })
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

router.post('/:id/call', authChecker, (req, res, next) => {
  let groupId = req.params.id;
  models.Group
    .find({ where: { groupId: groupId, eventId: req.event.eventId, datetimeStart: null }, include: [{ model: models.Ticket, as: 'tickets', include: [{ model: models.User, as: 'user' }] }] })
    .then((group) => {
      var promises = [];
      promises.push(group.update({ datetimeLastCalled: models.sequelize.fn('NOW'), callCount: models.sequelize.literal('callCount + 1') }));
      group.tickets.forEach((ticket) => {
        promises.push(bot.sendMessage(ticket.userId, "Hi " + ticket.user.name + ", your turn to " + req.event.eventName + " will be starting soon.\n\nReach the entrance within the next 5 minutes, or else...\u{1F608}\n\nWhen your group arrives at the entrance, show the usher your group number #" + group.groupId));
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
        ]);
      })
      .spread((updateResult, tickets) => {
        var promises = [];
        tickets.forEach((ticket) => {
          promises.push(bot.sendMessage(ticket.userId, "Thanks for waiting patiently for your turn to " + req.event.eventName + ".\n\nI hope you enjoy the experience.\n\nIf you would like to thank the volunteers or there are ways we can improve, feel free to let me know using the form at https://tinyurl.com/UTHalloween16", { parse_mode: 'Markdown', disable_web_page_preview: true }));
          promises.push(ticket.user.update({ isInQueue: false }, { transaction: t }));
        });

        return Promise.all(promises);
      })
      .then(() => {
        res.json({
          'status': 'ok'
        });
      });
  });
  return null;
});
