# Helpers for Discord-js (node)

## Random
### starters
```js
client.once("ready", () => {
  console.log("Ready!");
});
client.once("reconnecting", () => {
  console.log("Reconnecting!");
});
client.once("disconnect", () => {
  console.log("Disconnect!");
});
```
## Check if message is:
### not from a bot and a webhook
```js
if (!message.author.bot & !message.webhookId) {
    // do stuff
}
```
### made by the bot
```js
if (message.author.id === client.user.id) {
    // do stuff
}
```
## messages:
### send a message in all guilds
```js 
let toSay = "messageToSend";
client.guilds.cache.each(guild => 
  client.channels.cache.get(guild.systemChannelId).send(toSay))
```
### see all message a channel
```js
  const channel = channel.messages.cache;
  console.log(channel.map((m) => m.content));
```
> **NOTE:** this only shows the new messages while the bot is running
---

## Webhook
### make a webhook
```js
channel.createWebhook(/* username */, {
	avatar: /*  the URL (optional) */,})
    // making sure everything went well
	.then(webhook => console.log(`Created webhook ${webhook}`))
	.catch(console.error);
```
### edit a webhook
```js
webhook.edit({
	name: /* username */,
	avatar: /*  the URL (optional) */,
	channel: /* channel id */,})
    // making sure everything went well
	.then(webhook => console.log(`Edited webhook ${webhook}`))
	.catch(console.error);
```

### send a message
```js
webhook.send({
     content: /* message */,
     username: /* the username (optional) */,
     avatarURL: /* the URL (optional) */,
   });
```

### find a webhook or make
```js
let webhooks = channel.fetchWebhooks();
let webhook = webhooks.find(
    (u) => (u.name === /* name of the webhook */) & (u.owner.id === client.user.id) // checks that the bot made
);

// if no webhook could be found - make one
if (!webhook) { 
channel.createWebhook(/* username */, {
	avatar: /*  the URL (optional) */,})
    // making sure everything went well
	.then(webhook => console.log(`Created webhook ${webhook}`))
	.catch(console.error);

    // runs the earler part to get the newly made webhook
    webhooks = channel.fetchWebhooks();
    webhook = webhooks.find((u) => (u.name === /* name of the webhook */) & (u.owner.id === client.user.id) // checks that the bot made
    );
}
```

## Slash commands
### make command
```js
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));

const command = client.application?.commands.create(data, /* can put the guild id for better speed */);
console.log(data); // make sure it is run
```
## embeds
### make
```js
// at the top of your file
const { MessageEmbed } = require('discord.js');

// inside a command, event listener, etc.
const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');

channel.send({ embeds: [exampleEmbed] });
```
