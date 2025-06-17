module.exports = {
  nombre: 'pausar',
  alias: [],
  descripcion: 'Pausa el bot',
  tipo: 'developer',
  uso: 'admin',

  async run({message, config}) {
    config.pausado = !config.pausado;
    message.channel.send(`**Pausa cambiada a:** \`${config.pausado}\``);
  }
}
