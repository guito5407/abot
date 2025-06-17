let a = [1, 1, 2];

module.exports = {
  nombre: 'grimorio',
  alias: ['magia', 'raza'],
  descripcion: '',
  tipo: 'aeae',
  uso: 'no se',

  async run({ message, Discord, config, args }) {
    const soso = config.cosas;
    const UD = soso[message.author.id];
    const active = UD?.activado ?? false;
    if (!active) a = [1, 1, 2];

    const rollValor = () => a[Math.floor(Math.random() * a.length)];

    const randomChoose = (probabilidades) => {
      const total = probabilidades.reduce((s, p) => s + p.probabilidad, 0);
      if (Math.abs(total - 1) > 0.0001) throw new Error("Las probabilidades deben sumar 1");
      const rand = Math.random();
      let acc = 0;
      for (const p of probabilidades) {
        acc += p.probabilidad;
        if (rand < acc) return p.valor;
      }
    };

    const crearBoton = () =>
      new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("roll")
          .setLabel("Roll")
          .setStyle(Discord.ButtonStyle.Success)
          .setEmoji("🎲")
      );

    const comando = message.content.slice(config.prefix.length).trim().split(/ +/g).shift().toLowerCase();

    if (comando === "magia") return manejarMagia();
    if (comando === "raza") return manejarRaza();
    if (comando === "grimorio") return manejarGrimorio();

    // ========================== MAGIA ==========================
    async function manejarMagia() {
      const magias = config.magias;
      const jajas = [
        { txt: 'has nacido con una magia de 1 Estrella.', gif: 'https://cdn.discordapp.com/attachments/1120951809926778920/1236750408861618218/magia1.gif?ex=66392513&is=6637d393&hm=792d18db05f8eba68b81c1d59c2be72ca62284e5e1b07fce300480d1e9ef8a0b&' },
        { txt: 'has nacido con una magia poco común siendo de 2 Estrellas.', gif: 'https://cdn.discordapp.com/attachments/1120951809926778920/1236750409305952337/magia2.gif?ex=66392513&is=6637d393&hm=eaf2d2183d37a52d0ed3a4be18b4b7be429e3aed9113e5dd674b2fe593cb69ee&' },
        { txt: 'has nacido con una magia super rara siendo de 3 Estrellas.', gif: 'https://cdn.discordapp.com/attachments/1120951809926778920/1236754267772293181/magia3.gif?ex=663928ab&is=6637d72b&hm=7ca4f0e8a58aecb439cc9f995f6ed6bc41e9d76b4c16a53c4d3e926275448974&' },
        { txt: 'has nacido con una magia poco conocida siendo de 4 Estrellas.', gif: 'https://cdn.discordapp.com/attachments/1120951809926778920/1236770912754466849/magia4.gif?ex=6639382b&is=6637e6ab&hm=4bd94cb4aad22a3fc90d05870829a22e459feda2d2f97012481f779da8a2b1f7&' },
      ];
      const resultados = [
        { valor: 1, probabilidad: 0.49 },
        { valor: 2, probabilidad: 0.34 },
        { valor: 3, probabilidad: 0.13 },
        { valor: 4, probabilidad: 0.04 }
      ];

      const filtro = parseInt(args[0]);
      const filtroValido = filtro >= 1 && filtro <= 4;
      const filtroTag = filtroValido ? '-# ||*(filtro)*||' : '';

      let resultado = filtroValido ? filtro : randomChoose(resultados);
      let roll = rollValor();

      if (active && UD.magia) {
        if (roll === 1) a.shift();
        if (roll === 2) {
          resultado = UD.magia.grado;
          a = [1, 1, 2];
        }
      }

      const row = crearBoton();
      const msg = await message.channel.send({
        content: `***¡Felicidades ${message.author}!, ${jajas[resultado - 1].txt}***\n\n- *Presiona el botón en el mensaje para saber qué magia te ha tocado.*\n\n${jajas[resultado - 1].gif}`,
        components: [row]
      });

      const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 60000 });

      let rollRealizado = false;

      collector.on("collect", (i) => {
        if (i.user.id !== message.author.id) {
          return i.reply({ content: "¡Este botón no es tuyo!", ephemeral: true });
        }

        rollRealizado = true;

        let opcion = magias[resultado - 1][Math.floor(Math.random() * magias[resultado - 1].length)];

        if (active && UD.magia && resultado === UD.magia.grado && roll === 2) {
          opcion = magias[resultado - 1][UD.magia.indice];
          UD.activado = false;
        }

        msg.edit({
          content: `***¡Felicidades ${message.author}!, ${opcion.txt}***\n\n[${resultado} estrella${resultado === 1? '':'s'}]( ${opcion.gif})\n\n${filtroTag}`,
          components: []
        });
      });

      collector.on("end", () => {
        if (rollRealizado) return;

        let opcion = magias[resultado - 1][Math.floor(Math.random() * magias[resultado - 1].length)];
        msg.edit({
          content: `***¡Felicidades ${message.author}!, ${opcion.txt}***\n\n[${resultado} estrella${resultado === 1? '':'s'}]( ${opcion.gif} )\n\n${filtroTag}`,
          components: []
        });
      });
    }

    // ========================== RAZA ==========================
    async function manejarRaza() {
      const razas = config.razas;
      const jajas = [
        { txt: `***¡Felicidades ${message.author}!, has nacido como un miembro de la raza… ¡Humana!***\n\n- *Presiona el botón en el mensaje para saber la clase social de tu personaje.*`, gif: 'https://media.discordapp.net/attachments/573386324409581578/1236200928332218418/image0.gif?ex=66391f94&is=6637ce14&hm=ac13b10a51d794e0ff79776fa546977185ede2375f8161e694b6691c8c52ef5f&=&width=400&height=225' },
        { txt: `***¡Felicidades ${message.author}!, has nacido como un miembro de la raza… ¡Enano!***\n\n- *Presiona el botón en el mensaje para saber la clase social de tu personaje.*`, gif: 'https://cdn.discordapp.com/attachments/1236144999632998480/1236445471531335751/940744356376248320.gif' },
        { txt: `***¡Felicidades ${message.author}!, has nacido como un miembro de la raza… ¡Bruja!***\n\n- *Presiona el botón en el mensaje para saber la clase social de tu personaje.*`, gif: 'https://cdn.discordapp.com/attachments/1236144999632998480/1236446736235630714/940744356376248320.gif' },
        { txt: `***Vaya… al parecer ${message.author} ha nacido como… un miembro de la raza antigua de los Elfos.***`, gif: 'https://media.discordapp.net/attachments/573386324409581578/1236199200874696735/image0.gif?ex=663723b8&is=6635d238&hm=0303de7cd3af6e57eba2cc2c1e2a3b01d415b3fc31f5b8ff3f6412981584813c&' },
      ];

      const resultados = [
        { valor: 1, probabilidad: 0.45 },
        { valor: 2, probabilidad: 0.27 },
        { valor: 3, probabilidad: 0.27 },
        { valor: 4, probabilidad: 0.01 },
      ];


      const filtro = parseInt(args[0]);
      const filtroValido = filtro >= 1 && filtro <= 4;
      const filtroTag = filtroValido ? '-# ||*(filtro)*||' : '';

      let resultado = filtroValido ? filtro : randomChoose(resultados);
      let roll = rollValor();

      if (active && UD.raza) {
        if (roll === 1) a.shift();
        if (roll === 2) {
          resultado = UD.raza.indice + 1;
          UD.activado = false;
          a = [1, 1, 2];
        }
      }

      if (resultado < 4) {
        const row = crearBoton();
        const msg = await message.channel.send({
          content: `${jajas[resultado - 1].txt}\n\n${jajas[resultado - 1].gif}`,
          components: [row]
        });

        const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 60000 });

        let respondido = false;

        collector.on("collect", (i) => {
          if (i.user.id !== message.author.id) return i.reply({ content: "¡Este botón no es tuyo!", ephemeral: true });
          respondido = true;

          const opciones = Array(resultado * 2 + 1).fill("plebeyo");
          opciones[0] = "noble";

          const clase = opciones[Math.floor(Math.random() * opciones.length)];
          msg.edit({
            content: `***¡Felicidades ${message.author}!, tu personaje ${razas[resultado - 1]} ha nacido como ${clase}.***\n\n${filtroTag}`,
            components: []
          });
        });

        collector.on("end", () => {
          if (respondido) return;
          const opciones = Array(resultado * 2 + 1).fill("plebeyo");
          opciones[0] = "noble";
          const clase = opciones[Math.floor(Math.random() * opciones.length)];
          msg.edit({
            content: `***¡Felicidades ${message.author}!, tu personaje ${razas[resultado - 1]} ha nacido como ${clase}.***`,
            components: []
          });
        });

      } else {
        message.channel.send(`${jajas[resultado - 1].txt}\n\n${jajas[resultado - 1].gif}`);
      }
    }

    // ========================== GRIMORIO ==========================
    async function manejarGrimorio() {
      const resultados = [
        { valor: 1, probabilidad: 0.96 },
        { valor: 2, probabilidad: 0.04 },
      ];
      let resultado = randomChoose(resultados);
      let roll = rollValor();

      if (active && UD.grimorio) {
        if (roll === 1) a.shift();
        if (roll === 2) {
          resultado = UD.grimorio.indice + 1;
          UD.activado = false;
          a = [1, 1, 2];
        }
      }

      if (resultado === 1) {
        message.channel.send(`***${message.author} Has sido elegido por el Grimorio… Ordinario.***\n\nhttps://cdn.discordapp.com/attachments/1120951809926778920/1236750409826304102/grimorio_ordinario.gif?ex=66392513&is=6637d393&hm=3c921c7e524234261c3cbf9fae3f4ad5340eb8aadafa6e5e1683aae7bcfe5f41&`);
      } else {
        message.channel.send(`***${message.author} es uno de los pocos elegidos por el legendario Grimorio Dorado.***\n\nhttps://cdn.discordapp.com/attachments/1120951540463706212/1239363674444005376/yuno.gif`);
      }
    }
  }
}
