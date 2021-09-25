const Client = require("discord.js").Client;
const { Intents, MessageEmbed, WebhookClient } = require("discord.js");
const wait = require("util").promisify(setTimeout);

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

client.on("messageCreate", async (message) => {

let webhooks = await message.channel.fetchWebhooks();
let webhook = webhooks.find(u => u.name === "RiskyBOT" & u.owner.id === client.user.id);
if (!webhook){
    message.channel.createWebhook('RiskyBOT', {
  })
  	.then(webhook => console.log(`Created webhook ${webhook}`))
  	.catch(console.error)

  webhooks = await message.channel.fetchWebhooks();
  webhook = webhooks.find(
    (u) => (u.name === "RiskyBOT") & (u.owner.id === client.user.id)
  );
}

console.log(webhook)

  if (!message.author.bot & !message.webhookId) {
    webhook.send({
     content: message.content,
     username: message.member.displayName,
     avatarURL: message.author.displayAvatarURL(),
   });
    message.delete();

  }
});

client.login(process.env.discordapi);
