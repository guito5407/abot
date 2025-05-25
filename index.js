const Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
  intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [
    Partials.GuildMember,
    Partials.User,
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

const { DiscordTogether } = require('discord-together');
client.discordTogether = new DiscordTogether(client);

const config = require('./config.js');

const fs = require('fs');
const path = require('path');
const keep_alive = require('./keep_alive.js');

var LNM = 0
var LIV = true

client.on("ready", () => {
    console.log(`¡Bot encendido!`);

    const Lchannel = client.channels.cache.get("1103166487117713558");
    var LNM = 0

    function Main(delay) {
        setInterval(() => {
            LNM += 10;
            const tiempoTranscurrido = LNM;
            const dias = Math.floor(tiempoTranscurrido / (60 * 60 * 24));
            const horas = Math.floor((tiempoTranscurrido % (60 * 60 * 24)) / (60 * 60));
            const minutos = Math.floor((tiempoTranscurrido % (60 * 60)) / 60);
            const segundos = tiempoTranscurrido % 60;
            let mensaje = '';
            if (dias > 0) mensaje += `${dias} día${dias !== 1 ? 's' : ''}, `;
            if (horas > 0 || dias > 0) mensaje += `${horas} hora${horas !== 1 ? 's' : ''}, `;
            if (minutos > 0 || horas > 0 || dias > 0) mensaje += `${minutos} minuto${minutos !== 1 ? 's' : ''}, `;
            if (segundos > 0 || horas > 0 || dias > 0 || minutos > 0) mensaje += `${segundos} segundo${segundos !== 1 ? 's' : ''}`;
            Lchannel.send(mensaje);
        }, delay);
    }
    Lchannel.send(`Iniciando el conteo, el bot acaba de ser encendido. || <@940744356376248320> ||`);
    Main(10000);
});

client.Pcommands = new Discord.Collection();
client.aliases = new Discord.Collection();
const pcommandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

for (const file of pcommandFiles) {
  const command = require(`./comandos/${file}`)
  client.Pcommands.set(command.nombre, command)
  for (let i = 0; i < command.alias.length; i++) {
    client.aliases.set(command.alias[i], command.nombre);
  }
}

client.on("messageCreate", async (message) => {
  if(
    message.author.id === '940744356376248320' && 
     message.content.startsWith('-soso') &&
  message.guild === null){
    let args = message.content.trim().split(/ +/g);
    args.shift();
    if(!args[0]) return;
    config.soso = args[0];
    message.channel.send('soso cambiado a: '+config.soso);
  };
  if(message.author.bot) return;
  if(message.guild === null) return; 
  var prefix = "-"

  /*let yuta = await message.guild.members.fetch('789614838132375562');
  let nick = 'yuta (fan del pene)';
  if(yuta && yuta.nickname && yuta.nickname !== nick) yuta.setNickname(nick);*/

  if(!message.content.startsWith(prefix)) return;

  let args = message.content.slice(prefix.length).trim().split(/ +/g)
 
  let command = args.shift().toLowerCase();


  let cmd = client.Pcommands.get(command);
  if(!cmd) cmd = client.Pcommands.get(client.aliases.get(command));

  if(cmd){
    if(cmd.tipo.toLowerCase() === 'developer'){
      if(!config.developers.includes(message.author.id)) return;
    }
    cmd.run({client, message, args, Discord, config}).catch(error => {
        console.error(error);
        return null;
      });;
  }
  
});

client.login(config.token)
