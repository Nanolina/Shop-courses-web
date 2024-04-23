import * as dotenv from 'dotenv';
dotenv.config();

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      inline_keyboard: [[{ text: 'Open courses', url: process.env.APP_URL }]],
    },
  };

  bot.sendMessage(chatId, 'Click the button below to open the app:', options);
});
