const telegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const apiKey = process.env.API_KEY;
require('dotenv').config();
const TOKEN = process.env.TOKEN;
const bot = new telegramBot(TOKEN, {polling: true});

var ids = [];

async function getTemperature(city) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9d8a30bddd7972e8b70f6270affb61cb`;
    const response = await axios.get(url);
    return response.data.main.temp;
}

bot.on('message', (msg) => {
    if (msg.text.toString().toLowerCase().indexOf("hello") === 0) {
        bot.sendMessage(msg.chat.id,"Welcome to the Temperature bot! I will send you the temperature in Delhi every hour. To get the message you need to type 'subscribe'");
    }
})

bot.on('message', (msg) => {
    if (msg.text.toString().toLowerCase().indexOf("subscribe") === 0) {
        bot.sendMessage(msg.chat.id,"You have been subscribed to the Temperature bot!");
            const chatId = msg.chat.id;
            ids.push(chatId);
            setInterval(async() => {
                // There is a error with the API_KEY so if we hard code the mesaage it works.
                const temperature = await getTemperature('Delhi');
            bot.sendMessage(chatId, `The temperature in Delhi is currently ${temperature} degrees.`);
            }, 5000);
    }
});

bot.on('message', async (msg) => {
    if (msg.text.toString().toLowerCase().includes("unsubscribe")) {
        bot.sendMessage(msg.chat.id,"You have been unsubscribed to the Temperature bot!");
        ids.splice(ids.indexOf(msg.chat.id), 1);
    }
})
