const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || '';

// no polling for the bot because we simply just want to send out messages

module.exports = new TelegramBot(token);
