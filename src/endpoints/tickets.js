const express = require('express');
const router = express.Router();
const models = require('utown-queue-db');
const authChecker = require('../middleware/auth');
const bot = require('../bot');

module.exports = router;

let cancelTicket = (ticket, transaction) => {
  if (!transaction) {
    return models.sequelize
      .transaction((t) => {
        return cancelTicket(ticket, user, t);
      });
  }
  return Promise.all([
    ticket.update(
      { isActive: false, groupId: null },
      { transaction: transaction }
    ),
    models.User.update(
      { isInQueue: false },
      { where: { userId: ticket.userId }, transaction: transaction }
    )
  ]);
};

let updateGroupAndCancelTicket = (group, ticket, transaction) => {
  if (!transaction) {
    return models.sequelize
      .transaction((t) => {
        return updateGroupAndCancelTicket(group, ticket, t);
      });
  }

  // if there is only one ticket left and the last ticket cancels, then we can say good bye to the group.
  if (group.totalNoOfPeople === ticket.noOfPeople) {
    return cancelTicket(ticket, transaction)
      .then(group.destroy({transaction: transaction}));
  }

  return Promise.all([
    cancelTicket(ticket, transaction),
    group.decrement("totalNoOfPeople", {by: ticket.noOfPeople})
  ])
};

router.get('/', authChecker, (req, res, next) => {
  req.event.getTickets({ where: { isActive: true, groupId: null }, include: [{ model: models.User, as: 'user' }] })
    .then((tickets) => {
      res.json({
        status: 'ok',
        result: tickets
      });
    })
});

router.delete('/:id', authChecker, (req, res, next) => {
  let ticketId = req.params.id;
  let _ticket = null;
  models.sequelize.transaction((t) => {
    return models.Ticket
      .find({
        where: { ticketId: ticketId, eventId: req.event.eventId },
        include: [
          { model: models.Group, as: 'group', required: false },
          { model: models.User, as: 'user' }
        ],
        transaction: t
      })
      .then((ticket) => {
        if (!ticket) {
          throw new Error('Ticket not found');
        }
        _ticket = ticket;
        if (ticket.group) {
          return updateGroupAndCancelTicket(ticket.group, ticket, t);
        }
        return cancelTicket(ticket, t);
      })
      .then(() => {
        bot.sendMessage(_ticket.userId, "Hi " + _ticket.user.name + ", your ticket to " + req.event.eventName + " has been cancelled by the usher because your group did not fully turn up. You will need to rejoin the queue again.");
        res.json({
          status: 'ok'
        });
        return null;
      });
  })
  .catch((err) => {
    console.log(err);
  });
});
