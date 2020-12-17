const pogoda = require('./cityboo')
global.fetch = require("node-fetch");
const config = require("config");
const { Telegraf } = require('telegraf');
const bot = new Telegraf(config.get('token'))
bot.start( ctx => ctx.reply(`
Привет ${ctx.from.first_name}!
Узнай погоду в интересующем тебя городе.
Введи название города на английском языке и получи температуру.
`)
)
bot.help((ctx) => ctx.reply(`
Есть много городов и есть один бот
Федя, самое главное зонт не забудь
Есть вопросы вводи команду /voprosy
`)
)
bot.hears('кто такой Федя?', (ctx) => ctx.reply('Тоби забанить'))
bot.command('voprosy', (ctx) => ctx.reply(
  `
За достоверность информации не вручаюсь
Потому что бот использует сторонее aip.
Вопросы не ко мне :)
  `
))
bot.on('text', async (ctx) => {
if (ctx.message.text.toLowerCase() in pogoda){
fetch('https://api.openweathermap.org/data/2.5/weather?zip='+pogoda[ctx.message.text.toLowerCase()]+',ru&lang=ru&appid='+config.get('apitoken')+'&units=metric')
.then(Response => Response.json())
.then(data => {
ctx.reply(`
Город: ${data['name']}
Температура: ${data['main']['temp']} °C
Скорость ветра: ${data['wind']['speed']} м/c  
На небе: ${data['weather'][0]['description']}
`)
ctx.replyWithPhoto("http://openweathermap.org/img/wn/"+data['weather'][0]['icon']+"@2x.png");
})
.catch(err => ctx.reply("Не понятная ошибка LoL"))
}
else ctx.reply("Нет такого города "+ctx.message.text+" :(")
})
bot.on('sticker', (ctx) => ctx.reply('Я не понимаю что ты иммеешь ввиду :(')) 
bot.launch()