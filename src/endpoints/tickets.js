const express = require('express');
const router = express.Router();
const models = require('utown-queue-db');
const authChecker = require('../middleware/auth');

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
      { isActive: false },
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
  req.event.getTickets({ where: { datetimeStart: null } })
    .then((tickets) => {
      res.json({
        status: 'ok',
        result: tickets
      });
    })
});
