const { Client } = require('discord.js-selfbot-v13');
const cron = require("node-cron");
const keep_alive = require('./keep_alive.js');

const client = new Client({
    checkUpdate: false
});

client.on('ready', async () => {
    console.log(`Ejecutando ${client.user.username}`);

    cron.schedule("30 13 * * *", () => {
        const channel = client.channels.cache.get("1393563681740296262");
        if (!channel) return;

        channel.send("-work");
        setTimeout(() => channel.send("-slut"), 1000);
        setTimeout(() => channel.send("-crime"), 2000);
        setTimeout(() => channel.send("-dep all"), 3000);

    }, {
        timezone: "America/Montevideo"
    });

});

client.login(process.env.TOKEN)