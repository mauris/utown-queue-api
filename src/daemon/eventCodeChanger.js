const models = require('utown-queue-db');
const Promise = require('bluebird');
var randomstring = require("randomstring");

console.log('Daemon worker #' + process.pid + ' started.');

let $controller = () => {
  return models.sequelize.query("UPDATE Events SET eventCode = SUBSTRING(conv(floor(rand() * 99999999999 * eventId), 20, 36), 1, 4);")
};

$controller();
setInterval($controller, 300000);
