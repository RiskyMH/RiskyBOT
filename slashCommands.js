const Client = require("discord.js").Client;
const { Intents, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const wait = require("util").promisify(setTimeout);
const deepai = require("deepai"); // OR include deepai.min.js as a script tag in your HTML
const { translate } = require("google-translate-api-browser");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

client.login(process.env.discordapi);
deepai.setApiKey(process.env.deepapi);

const guildid = "780657526034399233"; // My bot testing server id

client.once("ready", async () => {
  console.log("\x1b[92mDiscord Ready!\x1b[0m");
  ///////////////////////////////////////////////////////
  const about = new SlashCommandBuilder()
    .setName("about")
    .setDescription("Replies with information about a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Information about a differant user")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("One piece of information about a user")
        .setRequired(false)
        .addChoice("Made", "made")
        .addChoice("Avatar", "avatar")
        .addChoice("Username", "username")
        .addChoice("Discriminator", "discriminator")
        .addChoice("Joined server time", "joinedServer")
        .addChoice("Server Nickname", "serverNic")
        .addChoice("Premium Since", "premium")
    );
  const message = new SlashCommandBuilder()
    .setName("message")
    .setDescription("Uses the bot to DM someone")
    .addUserOption((option) =>
      option.setName("user").setDescription("Enter a user").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Enter a message")
        .setRequired(true)
    );
  const deepai = new SlashCommandBuilder()
    .setName("deep-ai")
    .setDescription("Uses AI to produce results")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of generation")
        .setRequired(true)
        .addChoice("Text generator", "text-generator")
    )
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The input for the AI")
        .setRequired(true)
    );
  const translate = new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Uses google translate")

    .addStringOption((option) =>
      option
        .setName("to")
        .setDescription("The language that the text is going to be translated")
        .setRequired(true)
        .addChoice("English", "en")
        .addChoice("Chinese", "zh")
        .addChoice("French", "fr")
        .addChoice("Kroean", "ko")
        .addChoice("Japanese", "ja")
        .addChoice("Hindi", "hi")
        .addChoice("Spanish (espagnol)", "es")
        .addChoice("Russian", "ru")
    )
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The input for the translator")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("from")
        .setDescription("The language that the text is from")
        .setRequired(false)
        .addChoice("English", "en")
        .addChoice("Chinese", "zh")
        .addChoice("French", "fr")
        .addChoice("Kroean", "ko")
        .addChoice("Japanese", "ja")
        .addChoice("Hindi", "hi")
        .addChoice("Spanish (espagnol)", "es")
        .addChoice("Russian", "ru")
    );
  const webhook = new SlashCommandBuilder()
    .setName("say")
    .setDescription("Send a message in a channel as yourself or someone else")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("What will be sent in the channel")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user that will be simulated")
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Where the message will be sent")
        .setRequired(false)
    );

  // .addSubcommand((subcommand) =>
  //   subcommand
  //     .setName("manual")
  //     .setDescription("Manually add the name and image")
  //     .addStringOption((option) =>
  //       option.setName("name").setDescription("The name for the message")
  //     )
  //     .addStringOption((option) =>
  //       option
  //         .setName("image")
  //         .setDescription("The URL of the image for the message")
  //     )
  // );

  const ping = new SlashCommandBuilder()
    .setName("ping")
    // .setDescription("Replies with some information related to ping")
    .setDescription("Replies with Pong!");

  const command1 = client.application?.commands.create(about);
  const command2 = client.application?.commands.create(message);
  const command3 = client.application?.commands.create(deepai);
  const command4 = client.application?.commands.create(translate);
  const command5 = client.application?.commands.create(webhook);
  const command6 = client.application?.commands.create(ping);

  await console.log(command1, "about");
  await console.log(command2, "message");
  await console.log(command3, "deepai");
  await console.log(command4, "translate");
  await console.log(command5, "say");
  await console.log(command6, "ping");

  await console.log("");
  /////////////////////////////////
  //   await wait(1000)
  // await client.destroy()
  // await console.log("OOF")
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});
client.once("disconnect", () => {
  console.log("Disconnect!");
});

function dateBetter(inputUTC) {
  let UTC = new Date(inputUTC);

  let min = ("00" + UTC.getMinutes()).slice(-2);
  let hour = ("00" + UTC.getHours()).slice(-2);
  let daynum = ("00" + UTC.getDate()).slice(-2);
  let month = ("00" + UTC.getMonth()).slice(-2);
  let year = ("0000" + UTC.getFullYear()).slice(-2);

  let date = `${hour}:${min} ${daynum}/${month}/${year}`;

  return date;
}

client.on("messageCreate", async (message) => {
  if (message.mentions.users.first() === client.user) {
    message.channel.send("I just use the standed `/` commands, nothing fancy.");
  }
  // for logging
  console.log(
    `\x1b[94m@${message.author.tag}:\x1b[0m ${
      message.content
    }\x1b[36m (${dateBetter(message.createdTimestamp)})\x1b[0m`
  );
  // client.destroy();
  client.di;
});

client.on("messageUpdate", async (oldMessage, message) => {
  console.log(
    `\x1b[94m@${message.author.tag}:\x1b[31m (EDITED) \x1b[0m${
      message.content
    }\x1b[36m (${dateBetter(message.editedTimestamp)})\x1b[0m`
  );
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  switch (interaction.commandName) {
    case "about":
      let selectUser = interaction;

      if (interaction.options.getUser("user")) {
        selectUser = interaction.options.get("user");
      } else {
        selectUser = interaction;
      }
      let category = interaction.options.getString("category");
      console.log(category);
      let about = {
        desplayName: `${
          selectUser.member != null || undefined
            ? selectUser.member.displayName
            : selectUser.user.username
        }`,
        made: `${selectUser.user.createdAt}`,
        avatarURL: `${
          selectUser.user.displayAvatarURL() != undefined
            ? selectUser.user.displayAvatarURL()
            : "https://cdn.discordapp.com/embed/avatars/1.png"
        }`,
        username: `${selectUser.user.username}`,
        discriminator: `${selectUser.user.discriminator}`,
        tag: `${selectUser.user.tag}`,
      };
      if (selectUser.member != null || undefined) {
        aboutServer = {
          joinedServer: `${selectUser.member.joinedAt}`,
          serverNic: `${selectUser.member.nickname}`,
          premium: `${
            selectUser.member.premium_since
              ? selectUser.member.premium_since
              : "Not premium"
          } `,
        };
      }
      if (category == null) {
        const messageUser = interaction;
        // console.log(interaction.member.);
        const exampleEmbed = new MessageEmbed()
          .setColor(
            `${
              selectUser.member != undefined || null
                ? selectUser.member.displayHexColor
                : "#0099ff"
            }`
          )
          .setTitle(`${about.desplayName}'s info`)
          .setThumbnail(about.avatarURL)

          .addFields(
            { name: "Made:", value: `${about.made}` },
            {
              name: "AvatarURL",
              value: `${about.avatarURL}`,
            },
            {
              name: "Username",
              value: `${about.username}`,
              inline: true,
            },
            {
              name: "Discriminator",
              value: `${about.discriminator}`,
              inline: true,
            },
            {
              name: "Full",
              value: `${about.tag}`,
              inline: true,
            }
          )
          .addFields(
            selectUser.member != null || undefined
              ? [
                  {
                    name: "Joined server at ",
                    value: `${aboutServer.joinedAt}`,
                  },
                  {
                    name: "Server Nickname ",
                    value: `${aboutServer.serverNic}`,
                    inline: true,
                  },
                  {
                    name: "User ",
                    value: `${selectUser.member}`,
                    inline: true,
                  },
                  { name: "Server name ", value: `${selectUser.member.guild}` },
                  {
                    name: "Premium Since ",
                    value: `${aboutServer.premium}`,
                  },
                ]
              : {
                  name: "No server",
                  value: "Run in a server for server information",
                }
          )

          .setTimestamp()
          .setFooter(
            `${messageUser.user.tag}`,
            messageUser.user.displayAvatarURL() != undefined || null
              ? messageUser.user.displayAvatarURL()
              : "https://cdn.discordapp.com/embed/avatars/1.png"
          );
        await interaction.reply({ embeds: [exampleEmbed] });
      } else {
        let show = true;
        let msg = "str";
        if (category == "made") {
          msg = `acount Made: ${about.made}`;
        } else if (category == "avatar") {
          msg = `acount Avatar: ${about.avatarURL}`;
        } else if (category == "username") {
          msg = `acount Username: ${about.username}`;
        } else if (category == "discriminator") {
          msg = `acount Discriminator: ${about.discriminator}`;
        }
        if (selectUser.member != null || undefined) {
          if (category == "joinedServer") {
            msg = `Joined server time: ${aboutServer.joinedServer}`;
          } else if (category == "serverNic") {
            msg = `Server Nickname: ${aboutServer.serverNic}`;
          } else if (category == "premium") {
            msg = `Premium Since: ${aboutServer.premium}`;
          }
        } else {
          if (category == "joinedServer" || "serverNic" || "premium")
            interaction.reply({
              content: "These must commands only work in a server",
              ephemeral: true,
            });
          show = false;
        }
        if (show) {
          interaction.reply({ content: `> ${selectUser.member} ${msg}` });
        }
      }
      break;
    case "message":
      let suser = interaction.options.get("user");
      if (!suser.user.bot) {
        interaction.options
          .get("user")
          .user.send(interaction.options.getString("message"));
        interaction.reply({ content: "Done!", ephemeral: true });
      } else {
        interaction.reply({
          content: "You cannt message a bot...",
          ephemeral: true,
        });
      }
      break;
    case "deep-ai":
      let type = interaction.options.getString("type");
      let input = interaction.options.getString("input");

      if (type == "text-generator") {
        interaction.deferReply();

        (async function () {
          var resp = await deepai.callStandardApi("text-generator", {
            text: input,
          });

          const exampleEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Text generation")
            .setURL("https://deepai.org/machine-learning-model/text-generator")
            .setAuthor(
              "DeepAI",
              "https://deepai.org/static/images/favicon.ico",
              "https://deepai.org/"
            )
            .addField(input, resp.output.slice(0, 1024), true)
            .setTimestamp()
            .setFooter(
              `${interaction.user.tag}`,
              interaction.user.displayAvatarURL() != undefined || null
                ? interaction.user.displayAvatarURL()
                : "https://cdn.discordapp.com/embed/avatars/1.png"
            );
          await interaction.editReply({ embeds: [exampleEmbed] });
        })();
      }
      break;
    case "translate":
      let from = interaction.options.getString("from");
      let to = interaction.options.getString("to");
      let msg = interaction.options.getString("input");

      let langs = {
        en: "English",
        zh: "Chinese",
        fr: "France",
        ko: "Korean",
        ja: "Japanese",
        hi: "Hindi",
        es: "Spanish (espagnol)",
        ru: "Russian",
      };

      translate(msg, { to: to, from: from }).then((ans) => {
        let translated = ans.text;
        let fromNew = ans.from.language.iso;
        let fromBetter = langs[fromNew];
        let toBetter = langs[to];

        const exampleEmbed = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Translate")
          .setAuthor(
            "Google Translate",
            "https://translate.google.com/favicon.ico",
            "https://github.com/cjrsgu/google-translate-api-browser/"
          )
          .addField(fromBetter, msg.slice(0, 1024), true)
          .addField(toBetter, translated.slice(0, 1024), true)
          .setTimestamp()
          .setFooter(
            `${interaction.user.tag}`,
            interaction.user.displayAvatarURL() != undefined || null
              ? interaction.user.displayAvatarURL()
              : "https://cdn.discordapp.com/embed/avatars/1.png"
          );
        interaction.reply({ embeds: [exampleEmbed] });
      });
      break;
    case "say":
      if (interaction.guild.me.permissions.has("MANAGE_WEBHOOKS")) {
        if (interaction.channel != null || undefined) {
          // let suser = interaction;
          let message = interaction.options.getString("message");
          let user = interaction.options.getUser("user");
          let channel = interaction.options.getChannel("channel");

          if (!user) {
            user = interaction.user;
          }
          if (!channel) {
            channel = interaction.channel;
          }
          let webhooks = await channel.fetchWebhooks();
          let webhook = webhooks.find(
            (u) => (u.name === "RiskyBOT") & (u.owner.id === client.user.id)
          );

          if (!webhook) {
            channel
              .createWebhook("RiskyBOT", {})
              .then((webhook) => console.log(`Created webhook ${webhook}`))
              .catch(console.error);

            webhooks = await channel.fetchWebhooks();
            webhook = webhooks.find(
              (u) => (u.name === "RiskyBOT") & (u.owner.id === client.user.id)
            );
          }
          interaction.reply({ content: "Done!", ephemeral: true });
          webhook.send({
            content: message,
            username: user.username,
            avatarURL: user.displayAvatarURL(),
          });
        } else {
          interaction.reply({
            content: "This command doesn't work in DMs",
            ephemeral: true,
          });
        }
      } else {
        interaction.reply({
          content:
            "This bot doesnt have permissions to to this (`MANAGE_WEBHOOKS`)",
        });
      }

      break;
    case "ping":
      // interaction.reply({content:`🏓Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`,ephemeral: true,});
      interaction.reply({
        content: "Pong! (~ " + client.ws.ping + "ms)",
        ephemeral: true,
      });
      break;
  }
});
