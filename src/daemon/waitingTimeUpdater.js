const models = require('utown-queue-db');

console.log('Daemon worker #' + process.pid + ' started.');

let $controller = () => {
  models.sequelize.query('UPDATE Events RIGHT JOIN (SELECT AVG(TIMESTAMPDIFF(SECOND, datetimeFormed, datetimeStart)) AS AverageWaitingTime, eventId FROM Groups WHERE datetimeStart IS NOT NULL GROUP BY eventId) groupwt ON groupwt.eventId = Events.eventId RIGHT JOIN (SELECT AVG(TIMESTAMPDIFF(SECOND, datetimeRequested, datetimeStart)) AS AverageFormingTime, eventId FROM Tickets WHERE datetimeStart IS NOT NULL GROUP BY eventId) AS ticketwt ON ticketwt.eventId = Events.eventId SET Events.AverageWaitingTime = groupwt.AverageWaitingTime + ticketwt.AverageFormingTime', { type: models.sequelize.QueryTypes.UPDATE });
};

$controller();
setInterval($controller, 60000);
