module.exports = {
  nombre: 'soso',
  alias: [],
  descripcion: '',
  tipo: 'md',
  uso: 'no se',

  async run({ message, Discord, config, args }) {
    const user = args[0] || message.author.id;
    const soso = config.cosas;

    function createCollector(msg) {
      const collector = msg.createMessageComponentCollector({
        componentType: Discord.ComponentType.Button,
        time: 600000
      });

      collector.on('collect', async i => {
        if (i.user.id !== message.author.id) {
          return i.reply({ content: 'No puedes usar estos botones.', ephemeral: true });
        }

        // === Botón "MAGIA" ===
        if (i.customId === 'magia') {
          await i.update({
            embeds: [
              new Discord.EmbedBuilder()
                .setTitle('¿De qué rango quiere su magia?')
                .setDescription('Seleccione un rango de magia del 1 al 4.')
                .setColor('Purple')
            ],
            components: [
              new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setCustomId('rango_1').setLabel('⭐').setStyle(1),
                new Discord.ButtonBuilder().setCustomId('rango_2').setLabel('⭐⭐').setStyle(1),
                new Discord.ButtonBuilder().setCustomId('rango_3').setLabel('⭐⭐⭐').setStyle(1),
                new Discord.ButtonBuilder().setCustomId('rango_4').setLabel('⭐⭐⭐⭐').setStyle(1),
                new Discord.ButtonBuilder().setCustomId('volver_inicio').setLabel('Volver').setStyle(4)
              )
            ]
          });
        }

        // === Botón "RAZA" ===
        if (i.customId === 'raza') {
          const razas = config.razas;
          let index = 0;

          const mostrarRaza = async interaction => {
            const raza = razas[index];
            await interaction.update({
              embeds: [
                new Discord.EmbedBuilder()
                  .setTitle(`¿Desea elegir esta raza?`)
                  .setDescription(`**${raza.charAt(0).toUpperCase() + raza.slice(1)}**\n\nUse los botones para cambiar de raza o seleccionar.`)
                  .setFooter({ text: `Raza ${index + 1} de ${razas.length}` })
                  .setColor('Orange')
              ],
              components: [
                new Discord.ActionRowBuilder().addComponents(
                  new Discord.ButtonBuilder().setCustomId('raza_anterior').setLabel('⬅️ Anterior').setStyle(2),
                  new Discord.ButtonBuilder().setCustomId('raza_siguiente').setLabel('Siguiente ➡️').setStyle(2),
                  new Discord.ButtonBuilder().setCustomId('raza_seleccionar').setLabel('Seleccionar ✅').setStyle(3),
                  new Discord.ButtonBuilder().setCustomId('raza_volver').setLabel('Volver 🔙').setStyle(4)
                )
              ]
            });
          };

          await mostrarRaza(i);

          const razaCollector = msg.createMessageComponentCollector({
            componentType: Discord.ComponentType.Button,
            time: 600000
          });

          razaCollector.on('collect', async btn => {
            if (btn.user.id !== message.author.id) {
              return btn.reply({ content: 'No puedes usar estos botones.', ephemeral: true });
            }

            switch (btn.customId) {
              case 'raza_anterior':
                index = (index - 1 + razas.length) % razas.length;
                return mostrarRaza(btn);

              case 'raza_siguiente':
                index = (index + 1) % razas.length;
                return mostrarRaza(btn);

              case 'raza_volver':
                razaCollector.stop();
                return btn.update({
                  embeds: [inicioEmbed],
                  components: [inicioRow]
                });

              case 'raza_seleccionar':
                razaCollector.stop();
                if (!soso[user]) soso[user] = {};
                soso[user]['raza'] = {
                  indice: index
                };
                return btn.update({
                  embeds: [
                    new Discord.EmbedBuilder()
                      .setTitle('✅ Raza seleccionada')
                      .setDescription(`Raza elegida: **${razas[index]}**`)
                      .setColor('Green')
                  ],
                  components: []
                });
            }
          });
        }

        // === Botón "GRIMORIO" ===
        if (i.customId === 'grimorio') {
          const grimorios = ['Grimorio Ordinario 📘', 'Grimorio Dorado 📕'];
          let index = 0;

          const mostrarGrimorio = async interaction => {
            const nombreLimpio = grimorios[index].replace(/📘|📕/, '').trim();

            await interaction.update({
              embeds: [
                new Discord.EmbedBuilder()
                  .setTitle('¿Desea elegir este grimorio?')
                  .setDescription(`**${grimorios[index]}**\n\nUse los botones para navegar o seleccionar.`)
                  .setFooter({ text: `Opción ${index + 1} de ${grimorios.length}` })
                  .setColor('DarkGold')
              ],
              components: [
                new Discord.ActionRowBuilder().addComponents(
                  new Discord.ButtonBuilder().setCustomId('grimorio_anterior').setLabel('⬅️ Anterior').setStyle(2),
                  new Discord.ButtonBuilder().setCustomId('grimorio_siguiente').setLabel('Siguiente ➡️').setStyle(2),
                  new Discord.ButtonBuilder().setCustomId('grimorio_seleccionar').setLabel('Seleccionar ✅').setStyle(3),
                  new Discord.ButtonBuilder().setCustomId('grimorio_volver').setLabel('Volver 🔙').setStyle(4)
                )
              ]
            });
          };

          await mostrarGrimorio(i);

          const grimorioCollector = msg.createMessageComponentCollector({
            componentType: Discord.ComponentType.Button,
            time: 600000
          });

          grimorioCollector.on('collect', async btn => {
            if (btn.user.id !== message.author.id) {
              return btn.reply({ content: 'No puedes usar estos botones.', ephemeral: true });
            }

            switch (btn.customId) {
              case 'grimorio_anterior':
                index = (index - 1 + grimorios.length) % grimorios.length;
                return mostrarGrimorio(btn);

              case 'grimorio_siguiente':
                index = (index + 1) % grimorios.length;
                return mostrarGrimorio(btn);

              case 'grimorio_volver':
                grimorioCollector.stop();
                return btn.update({
                  embeds: [inicioEmbed],
                  components: [inicioRow]
                });

              case 'grimorio_seleccionar':
                grimorioCollector.stop();
                if (!soso[user]) soso[user] = {};
                soso[user]['grimorio'] = {
                  indice: index
                };
                return btn.update({
                  embeds: [
                    new Discord.EmbedBuilder()
                      .setTitle('✅ Grimorio seleccionado')
                      .setDescription(`Grimorio elegido: **${grimorios[index]}**`)
                      .setColor('Green')
                  ],
                  components: []
                });
            }
          });
        }

        // === Botón "Volver al inicio" ===
        if (i.customId === 'volver_inicio') {
          await i.update({
            embeds: [inicioEmbed],
            components: [inicioRow]
          });
        }

        // === Rangos de magia ===
        if (i.customId.startsWith('rango_')) {
          const rango = parseInt(i.customId.split('_')[1]) - 1;
          const magias = config.magias[rango];
          let index = 0;

          const mostrarMagia = async (interaction) => {
            const magia = magias[index];
            await interaction.update({
              embeds: [
                new Discord.EmbedBuilder()
                  .setTitle('¿Desea elegir esta magia?')
                  .setDescription(magia.txt)
                  .setImage(magia.gif)
                  .setFooter({ text: `Magia ${index + 1} de ${magias.length}` })
                  .setColor('Gold')
              ],
              components: [
                new Discord.ActionRowBuilder().addComponents(
                  new Discord.ButtonBuilder().setCustomId('magia_anterior').setLabel('⬅️ Anterior').setStyle(2),
                  new Discord.ButtonBuilder().setCustomId('magia_siguiente').setLabel('Siguiente ➡️').setStyle(2),
                  new Discord.ButtonBuilder().setCustomId('magia_seleccionar').setLabel('Seleccionar ✅').setStyle(3),
                  new Discord.ButtonBuilder().setCustomId('magia_volver_rango').setLabel('Volver 🔙').setStyle(4)
                )
              ]
            });
          };

          await mostrarMagia(i);

          const magiaCollector = msg.createMessageComponentCollector({
            componentType: Discord.ComponentType.Button,
            time: 600000
          });

          magiaCollector.on('collect', async btn => {
            if (btn.user.id !== message.author.id) {
              return btn.reply({ content: 'No puedes usar estos botones.', ephemeral: true });
            }

            switch (btn.customId) {
              case 'magia_anterior':
                index = (index - 1 + magias.length) % magias.length;
                return mostrarMagia(btn);

              case 'magia_siguiente':
                index = (index + 1) % magias.length;
                return mostrarMagia(btn);

              case 'magia_volver_rango':
                magiaCollector.stop();
                return btn.update({
                  embeds: [
                    new Discord.EmbedBuilder()
                      .setTitle('¿De qué rango quiere su magia?')
                      .setDescription('Seleccione un rango de magia del 1 al 4.')
                      .setColor('Purple')
                  ],
                  components: [
                    new Discord.ActionRowBuilder().addComponents(
                      new Discord.ButtonBuilder().setCustomId('rango_1').setLabel('⭐').setStyle(1),
                      new Discord.ButtonBuilder().setCustomId('rango_2').setLabel('⭐⭐').setStyle(1),
                      new Discord.ButtonBuilder().setCustomId('rango_3').setLabel('⭐⭐⭐').setStyle(1),
                      new Discord.ButtonBuilder().setCustomId('rango_4').setLabel('⭐⭐⭐⭐').setStyle(1),
                      new Discord.ButtonBuilder().setCustomId('volver_inicio').setLabel('Volver').setStyle(4)
                    )
                  ]
                });

              case 'magia_seleccionar':
                magiaCollector.stop();
                if (!soso[user]) soso[user] = {};
                soso[user]['magia'] = {
                  grado: rango + 1,
                  indice: index
                };
                // Aquí puedes guardar la magia en la base de datos o lo que necesites
                return btn.update({
                  embeds: [
                    new Discord.EmbedBuilder()
                      .setTitle('✅ Magia seleccionada')
                      .setDescription(`Se ha seleccionado la siguiente magia para el usuario:\n\n${magias[index].txt}`)
                      .setImage(magias[index].gif)
                      .setColor('Green')
                  ],
                  components: []
                });
            }
          });
        }

        if (i.customId === 'toggle_activado') {
          console.log(soso)
          soso[user].activado = !soso[user].activado;
          return i.update({
            embeds: [
              new Discord.EmbedBuilder()
                .setTitle(`✅ Estado actualizado`)
                .setDescription(`El usuario ahora está **${soso[user].activado ? 'activado' : 'desactivado'}**.`)
                .setColor(soso[user].activado ? 'Green' : 'Red')
            ],
            components: [
              new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setCustomId('magia').setLabel('Cambiar Magia').setStyle(1),
                new Discord.ButtonBuilder().setCustomId('raza').setLabel('Cambiar Raza').setStyle(2),
                new Discord.ButtonBuilder().setCustomId('grimorio').setLabel('Cambiar Grimorio').setStyle(3),
                new Discord.ButtonBuilder()
                  .setCustomId('toggle_activado')
                  .setLabel(soso[user].activado ? 'Desactivar ❌' : 'Activar ✅')
                  .setStyle(soso[user].activado ? 4 : 3),
                new Discord.ButtonBuilder().setCustomId('cancelar').setLabel('Cancelar').setStyle(4)
              )
            ]
          });
        }

        // === Botón "Cancelar" ===
        if (i.customId === 'cancelar') {
          collector.stop();
          return i.update({
            embeds: [
              new Discord.EmbedBuilder()
                .setTitle('❌ Operación cancelada')
                .setDescription(`Se ha cancelado la operación para el usuario \`${user}\`.`)
                .setColor('Red')
            ],
            components: []
          });
        }
      });

      collector.on('end', (collected, reason) => {
        if (collected.size === 0) {
          msg.edit({
            embeds: [
              new Discord.EmbedBuilder()
                .setTitle('⏰ Tiempo agotado')
                .setDescription('No se recibió ninguna respuesta. Operación cancelada.')
                .setColor('Grey')
            ],
            components: []
          }).catch(() => { });
        }
      });
    }

    if (soso[user]) {
      if (soso[user].activado === undefined) {
        soso[user].activado = true;
      }
      const datos = soso[user];


      // Obtener texto de cada atributo, si no está asignado aún
      const razaTxt = datos.raza !== undefined && config.razas[datos.raza.indice]
        ? config.razas[datos.raza.indice]
        : '*No asignada*';

      const grimorioTxt = datos.grimorio !== undefined
        ? (datos.grimorio.indice === 0 ? 'Grimorio Ordinario 📘' : 'Grimorio Dorado 📕')
        : '*No asignado*';

      const magiaTxt = datos.magia !== undefined && config.magias[datos.magia.grado - 1]
        ? config.magias[datos.magia.grado - 1][datos.magia.indice].txt
        : '*No asignada*';

      const yaExisteEmbed = new Discord.EmbedBuilder()
        .setTitle(`Usuario encontrado`)
        .setDescription(
          `Este usuario ya existe en la base de datos. Puede editar sus atributos usando los botones de abajo.`
        )
        .addFields(
          { name: '🧙‍♂️ Magia', value: magiaTxt, inline: false },
          { name: '🧬 Raza', value: razaTxt, inline: true },
          { name: '📖 Grimorio', value: grimorioTxt, inline: true }
        )
        .setColor('Blue');

      if (soso[user].activado === undefined) {
        soso[user].activado = true;
      }

      const opcionesRow = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder().setCustomId('magia').setLabel('Cambiar Magia').setStyle(1),
        new Discord.ButtonBuilder().setCustomId('raza').setLabel('Cambiar Raza').setStyle(2),
        new Discord.ButtonBuilder().setCustomId('grimorio').setLabel('Cambiar Grimorio').setStyle(3),
        new Discord.ButtonBuilder()
          .setCustomId('toggle_activado')
          .setLabel(soso[user].activado ? 'Desactivar ❌' : 'Activar ✅')
          .setStyle(soso[user].activado ? 4 : 3),
        new Discord.ButtonBuilder().setCustomId('cancelar').setLabel('Cancelar').setStyle(4)
      );

      const msgg = await message.channel.send({
        embeds: [yaExisteEmbed],
        components: [opcionesRow]
      });

      createCollector(msgg)
    } else {
      const inicioEmbed = new Discord.EmbedBuilder()
        .setTitle(`Usuario no encontrado`)
        .setDescription(`El usuario de la ID \`${user}\` no está en la base de datos. ¿Desea cambiarle algo?`)
        .setColor('Blue');

      const inicioRow = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder().setCustomId('magia').setLabel('Magia').setStyle(1),
        new Discord.ButtonBuilder().setCustomId('raza').setLabel('Raza').setStyle(2),
        new Discord.ButtonBuilder().setCustomId('grimorio').setLabel('Grimorio').setStyle(3),
        new Discord.ButtonBuilder().setCustomId('cancelar').setLabel('Cancelar').setStyle(4)
      );

      const msgg = await message.channel.send({
        embeds: [inicioEmbed],
        components: [inicioRow]
      });

      createCollector(msgg)
    }
  }
};
