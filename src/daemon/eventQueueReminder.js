const models = require('utown-queue-db');
const Promise = require('bluebird');
const bot = require('../bot');

console.log('Daemon worker #' + process.pid + ' started.');

let $controller = () => {
  return models.Event
    .findAll({})
    .then((events) => {
      return Promise.map(events, (event) => {
        return event.getGroups({ where: { isPresent: false, datetimeStart: null }, include: [{ model: models.Ticket, as: 'tickets' }] })
          .then((groups) => {
            var promises = [];
            var count = 0;
            groups.forEach((group) => {
              if (!group.tickets) {
                return;
              }
              group.tickets.forEach((ticket) => {
                if (count < 3) {
                  promises.push(bot.sendMessage(ticket.userId, "Your turn in the queue at " + event.eventName +" should be coming up real soon. The usher will message you to make your way to the entrance. The current estimated waiting time is " + Math.ceil(event.averageWaitingTime / 60) + " mins."));
                  return;
                }
                promises.push(bot.sendMessage(ticket.userId, "There are about " + count + " groups before yours in the queue at " + event.eventName +". The current estimated waiting time is " + Math.ceil(event.averageWaitingTime / 60) + " mins."));
              })
              ++count;
            });
            return Promise.all(promises);
          });
      });
    });
};

$controller();
setInterval($controller, 600000);
