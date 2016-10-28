const models = require('utown-queue-db');
const Promise = require('bluebird');
const bot = require('../bot');

return models.User
  .findAll({})
  .then((users) => {
    return Promise.map(users, (user) => {
      return bot.sendMessage(user.userId, "The UTown Residential Colleges thank you for joining us this evening. We hope you have enjoyed the evening.\n\nIf you would like to provide any feedback to the events, feel free to fill a 2-min form at https://tinyurl.com/UTHalloween16\n\nHope you don't bump into me again hehehe.\n\nPeace,\nUTown Toyol", { parse_mode: 'Markdown', disable_web_page_preview: true });
    });
  });
