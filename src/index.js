const dotenv = require("dotenv");
const { Intents, Client, MessageEmbed } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const fetch = require("node-fetch");

// get functions
const button = require("./functions/button.js");
const mini = require("./functions/mini.js");
const about = require("./functions/about.js");
const deepai = require("./functions/deepai.js");
const say = require("./functions/say.js");
const translate = require("./functions/translate.js");
const meCredits = require("./functions/me+credits.js");
const random = require("./functions/random.js");
const fun = require("./functions/fun.js");

// make bot
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

// put .env data into process
dotenv.config();

// login to discord
client.login(process.env.discordapi);



client.once("ready", async () => {
  console.log("\x1b[92mDiscord Ready! (slash commands)\x1b[0m");

  let rawdata = fs.readFileSync("src/commands.json");
  let data = JSON.parse(rawdata.toString());

  const rest = new REST({ version: "9" }).setToken(process.env.discordapi);

  try {
    console.log("Started refreshing application (/) commands.");
    
    // await rest.put(Routes.applicationCommands(client.user.id), {body: data,});

    console.log("Successfully reloaded application (/) commands.\n");
  } catch (error) {
    console.error(error);
  }
});

client.once("reconnecting", () => {console.log("Reconnecting!");});
client.once("disconnect", () => {console.log("Disconnect!");});

client.on("guildCreate", async (guild)=>{
    if (guild.me?guild.systemChannel.permissionsFor(client.user).has("SEND_MESSAGES"): null) { // make sure that the bot can sent message
     guild.systemChannel.send("Hello, thank you for inviting me to this server. Info: https://riskymh.github.io/RiskyBOT/added (btw I use `/` slash commands) ")
}})

client.on("messageCreate", async (message) => {
  if (message.member?message.member.permissions.has("SEND_MESSAGES"): null) { // make sure that the bot can sent message
    if (message.mentions.users.first() === client.user) { // tell user if request that the bot uses slash commands
      message.channel.send(
        "I just use the standard `/` commands, nothing fancy."
      );
    }
  }
});


//////////////////////\\\\\\\\\\\\\\\\\\\\\
///////////////    COMMANDS    \\\\\\\\\\\\
//////////////////////\\\\\\\\\\\\\\\\\\\\\
client.on("interactionCreate", async (interaction) => {  
  /** @type object{require("discord.js").HexColorString}*/
  let colors = {
    ok: `#${"5865F2"}`,
    error: `#${"ED4245"}`,
    good: `#${"57F287"}`,
    warning: `#${"FEE75C"}`,
  };

  // the template embeds for `done` or `error`
  let doneEmb = new MessageEmbed().setColor(colors.good).setTitle("Done!")
  let errorEmb = new MessageEmbed().setColor(colors.error).setTitle("Error")

  // Buttons
  if (interaction.isButton()){
    try{
    switch (await interaction.customId) {
      case "random-again-cat":{ // random cat button
        await interaction.deferReply()
        // @ts-ignore
        let data = await button.random(client, "cat", interaction.message.embeds[0]);
        await interaction.editReply(await data);
      break} 
      case "random-again-number": {// random number button
      // @ts-ignore
      let data = await button.random(client,"number" , interaction.message.embeds[0]);
      await interaction.reply(await data)
      break
    }}
  }catch{
    interaction.reply({ embeds: [errorEmb.setDescription("A error happened")], ephemeral: true })

  }}
  // Slash Commands
  else if (interaction.isCommand()) {
    try{
  /** Layout
   *  - get data
   *  - use functions
   *  - return data
   */
  switch (interaction.commandName) {
    case "about":
      {
        let option = interaction.options.get("input");
        let advanced = interaction.options.getString("extra");

        let data = await about(client, option,colors.ok, colors.error,advanced);
        await interaction.reply(data);
      }
      break;
    case "message":
      {
        await interaction.user
          .send(interaction.options.getString("message"))
          .catch(() => interaction.reply({embeds: [errorEmb.setTitle("Error - message").setDescription("• You don't except DMs")]}))
        
         await interaction.reply({ embeds: [doneEmb.setDescription("Sent message to you")], ephemeral: true });
      }
      break;

    case "deep-ai":
      {
        let type = interaction.options.getString("type");
        let input = interaction.options.getString("input");

        await interaction.deferReply();
        let data = await deepai(client, input, type,colors.ok, process.env.deepapi);
        await interaction.editReply(data);
      }
      break;

    case "translate":
      {
        let from = interaction.options.getString("from");
        let to = interaction.options.getString("to");
        let msg = interaction.options.getString("input");

        await interaction.deferReply();
        let data = await translate(client, msg, to, from, colors.ok);
        await interaction.editReply(data);
      }
      break;

    case "say":
      {
        let message = interaction.options.getString("message");
        let user = interaction.options.getUser("user");

        if (!user) {user = interaction.user;}
        let channel = interaction.channel;
        // @ts-ignore
        let data = await say(client,message,colors.good, colors.error,user,interaction.guild?interaction.guild.me.permissions:null,channel);
        await interaction.reply(data);
      }
      break;

    case "ping":
      {
        let data = await mini.ping(client, colors.ok, interaction.createdTimestamp);
        interaction.reply(data);
    }
    break;

    case "-aboutme-credits-" :
      {
      let data = await meCredits(client, colors.ok);
      interaction.reply(data)
    }
    break

    case "random":
      {
      let type = interaction.options.getString("type");
      let num1 = interaction.options.getInteger("num1");
      let num2 = interaction.options.getInteger("num2");

      if (type == "cat"){
        interaction.deferReply()
        let data = await random(client, colors.ok, colors.error, type, num1, num2);
        interaction.editReply(data);
      } else{

      let data = await random(client, colors.ok, colors.error, type, num1, num2);
      interaction.reply(data);
      }
    }
    break
    
    case "fun":
      {
      let type = interaction.options.getString("type");
      let user1 = interaction.options.getUser("user1");
      let user2 = interaction.options.getUser("user2");
      let text = interaction.options.getString("text");

      await interaction.deferReply()
      let data = await fun(client, type, user1,user2, text, colors.ok, colors.error)
      await interaction.editReply(data)
    }
    break

  }
}catch{
    interaction.reply({ embeds: [errorEmb.setDescription("A error happened")], ephemeral: true })

}}
});
