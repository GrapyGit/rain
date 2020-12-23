global.fetch = require("node-fetch");
const config = require("config");
const { Telegraf } = require('telegraf');
const bot = new Telegraf(config.get('token'))
bot.start(ctx => ctx.reply(`
Привет ${ctx.from.first_name}!
Узнай погоду в интересующем тебя городе.
Введи название города  и получи температуру.
`)
)
bot.help((ctx) => ctx.reply(`
Есть много городов и есть один бот
Федя, самое главное зонт не забудь
Есть вопросы вводи команду /voprosy
`)
)
bot.hears('мотивируй меня', ctx => {
  ctx.replyWithPhoto(
    'https://cs8.pikabu.ru/post_img/2017/03/21/6/og_og_1490083518283917583.jpg',
    {
      caption: ctx.reply('ну тип будь сильным')
    }
  )
})
bot.hears('кто такой Федя?', (ctx) => ctx.reply('Тоби забанить'))
bot.command('voprosy', (ctx) => ctx.reply(
  `
За достоверность информации не ручаюсь
Потому что бот использует стороннее aip.
Вопросы не ко мне :)
  `
))
bot.on('text', async (ctx) => {
  fetch(encodeURI('https://api.openweathermap.org/data/2.5/weather?q=' + ctx.message.text.toLowerCase() + '&lang=ru&appid=' + config.get('apitoken') + '&units=metric'))
    .then(Response => Response.json())
    .then(data => {
      ctx.replyWithPhoto("http://openweathermap.org/img/wn/" + data['weather'][0]['icon'] + "@4x.png",
        {
          caption: `
Город:${data['name']}
        
Температура: ${data['main']['temp']} °C
Скорость ветра: ${data['wind']['speed']} м/c  
На небе: ${data['weather'][0]['description']}
Влажность: ${data['main']['humidity']} %`
        }
      )
    }
    )
    .catch(err => ctx.reply("Не найден город {" + ctx.message.text.toLowerCase() + "}"))
})
bot.on('sticker', (ctx) => ctx.reply('Я не понимаю что ты имеешь ввиду :('))
bot.launch()

