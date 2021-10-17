const { Intents, Client } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

const tools = require("./tools.js")

client.once("ready", async (message) => {
  console.log("\x1b[92mDiscord Ready! (logger)\x1b[0m");
});
client.on("messageCreate", async (message) => {
  if (message.mentions.users.first() === client.user) {
  }
  // for logging
  console.log(
    `\x1b[94m@${message.author.tag}:\x1b[0m ${
      message.content
    }\x1b[36m (${tools.dateBetter(message.createdTimestamp)})\x1b[0m`
  );
  // client.destroy();
});

client.on("messageUpdate", async (oldMessage, message) => {
  console.log(
    `\x1b[94m@${message.author.tag}:\x1b[31m (EDITED) \x1b[0m${
      message.content
    }\x1b[36m (${tools.dateBetter(message.editedTimestamp)})\x1b[0m`
  );
});
