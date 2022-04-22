// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// //  @ts-nocheck

import { Client, PermissionOverwriteManager, PermissionsBitField } from "discord.js";
import {GatewayIntentBits, PermissionFlagsBits} from "discord-api-types/v10";

import { mini, say, meCreditsExtra } from "@riskybot/functions";
import tools from "@riskybot/tools";
import { EmbedBuilder } from "@discordjs/builders";
const config = new tools.Config("./config.yml", true);

// make bot
const client = new Client({
 intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.DirectMessageReactions,
  GatewayIntentBits.MessageContent
 ],
});

client.once("reconnecting", () => console.log("Reconnecting!"));
client.once("disconnect", () => console.log("Disconnect!"));
client.on("debug", console.log);
client.on("error", console.log);
client.on("warn", console.log);
process.on("unhandledRejection", console.log);
process.on("rejectionHandled", console.log);

// login to discord
if (process.env.discordapiExtra) client.login(process.env.discordapiExtra);
else if (process.env.discordapi) client.login(process.env.discordapi);
else console.error("\u001b[31m\u001b[1mDISCORD TOKEN REQUIRED\u001b[0m\n- put a valid discord bot token in `.env`\n- and make sure you used `npm start:extra`\n");

if (!process.env.discordapiExtra) console.warn("This is using the main discord key - make sure you aren't running both at same time");

client.once("ready", async () => {
    console.info("\x1b[92mDiscord Ready! (extra)\x1b[0m");
    console.info("Name:", client.user?.username + ", Servers:", client.guilds.cache.size);
});

client.once("reconnecting", () => console.log("Reconnecting!"));
client.once("disconnect", () => console.log("Disconnect!"));
client.on("debug", console.log);
client.on("error", console.log);
process.on("unhandledRejection", console.log);

client.on("guildCreate", async (guild) => {
    if (guild.me ? guild?.systemChannel?.permissionsFor(guild.me)?.has(PermissionFlagsBits.SendMessages) : null) {
        // make sure that the bot can sent message
        guild.systemChannel?.send("Hello, thank you for inviting me to this server. Info: https://riskymh.github.io/RiskyBOT/added/extra (btw I use `/` slash commands) ");
    }
});

async function msgWordHas(msg: string, what: string): Promise<boolean> {
    // if (msg === what) return true
    // if (msg.includes(what + " ")) return true
    // if (msg.includes(" " + what)) return true
    // Because can't substitute into regex
    msg = msg.replace(what, "TeXt_Is_VaLiD_ReTuRn_TRUE");
    if (/\b(TeXt_Is_VaLiD_ReTuRn_TRUE)\b/g.test(msg)) return true;
    else return false;
}

client.on("messageCreate", async (message) => {

    const mePerms = message.guild?.me?.permissionsIn(message.channelId);
    const serversNoMessage = (process.env.serversNoMessage ? JSON.parse(process.env.serversNoMessage) : []);

    if ((message.guild ? (serversNoMessage.length ? serversNoMessage.includes(message.guild.id) : !null) : null) ||
        !message.guild ? mePerms?.has(PermissionFlagsBits.SendMessages) : null || !message.guild ? mePerms?.has(PermissionFlagsBits.AddReactions) : null ||
        message.author.id === client.user?.id || message.author.bot || message.reactions.cache.entries.length >= 20) { return; } // we dont want these above

    const msg = message.content.toLowerCase();
    if (message.mentions.users.first() === client.user) {
        message.channel.send("I use some slash `/` commands, and some text based stuff, nothing fancy.");
    }
    if (msg === message?.guild?.me?.displayName.toLowerCase() || msg === client?.user?.username.toLowerCase()) {
        message.channel.send("Hello 👋");
    }

    // like CheemsBot
    if (await msgWordHas(msg, "hello")) await message.react("👋");
    if (await msgWordHas(msg, "bye")) await message.react("👋");
    if (await msgWordHas(msg, "bruh")) await message.react("🍔");
    if (await msgWordHas(msg, "what")) await message.react("🐳");
    if (await msgWordHas(msg, "gg")) await message.channel.send("gg");
    if (await msg === "f") await message.channel.send("F");

    const serversExtraMessage: string[] = JSON.parse(process.env.serversExtraMessage?? "") ?? [];
    if (message.guild ? (serversExtraMessage?.length ? serversExtraMessage?.includes(message?.guild?.id) : !null) : !null) {
        if (await msgWordHas(msg, "hi")) await message.react("👋");
        if (await msgWordHas(msg, "walk")) await message.react("🚶");
        if (await msgWordHas(msg, "pwease")) await message.react("🙏");
        if (await msgWordHas(msg, "umm")) await message.react("🤔");
        if (await msgWordHas(msg, "idk")) await message.react("🤷");
        if (await msgWordHas(msg, "idea")) await message.react("💡");
        if (await msgWordHas(msg, "sleep")) await message.react("💤");
        if (await msgWordHas(msg, "prince")) await message.react("🤴");
        if (await msgWordHas(msg, "princess")) await message.react("👸");
        if (await msgWordHas(msg, "queen")) await message.react("👑");
        if (await msgWordHas(msg, "brushing")) await message.react("🪥");
        if (await msgWordHas(msg, "teeth")) await message.react("🦷");
        if (await msgWordHas(msg, "quiet")) await message.react("🤐");
        if (await msgWordHas(msg, "secret")) await message.react("🤐");
        if (await msgWordHas(msg, "hope")) await message.react("🤞");
        if (await msgWordHas(msg, "sorry")) await message.react("🥺");
        if (await msgWordHas(msg, "hewwo")) await message.react("👋");
        if (await msgWordHas(msg, "sowwy")) await message.react("🥺");
        if (await msgWordHas(msg, "needle")) await message.react("💉");
        if (await msgWordHas(msg, "approve")) await message.react("✅");
        if (await msgWordHas(msg, "disapprove")) await message.react("❎");
        if (await msgWordHas(msg, "tea")) await message.react("🧋");
        if (await msgWordHas(msg, "hear")) await message.react("👂");
        if (await msgWordHas(msg, "battery")) await message.react("🔋");
        if (await msgWordHas(msg, "dead")) await message.react("😵");
        if (await msgWordHas(msg, "diamond")) await message.react("💎");
        if (await msgWordHas(msg, "yee")) await message.react("🦖");
        if (await msgWordHas(msg, "rickroll")) await message.react("<a:rick:889013459763728454>");

        if (await msg === "f") await message.channel.send(message.author.username + " has paid their respects");
        if (await msg === "good night") {
            await message.react("☁️");
            await message.react("🌙");
            await message.react("✨");
            await message.react("👑");
        }
    }

});
client.on("messageReactionAdd", (messageReaction, user) => {

    const mePerms = messageReaction?.message?.guild?.me?.permissionsIn(messageReaction.message.channelId);

    if (!JSON.parse(process.env.serversExtraMessage ?? "{}") || mePerms?.has(PermissionFlagsBits.AddReactions) ||
        messageReaction.message.reactions.cache.entries.length <= 20 ||
        (messageReaction.message.guild ? process.env.serversExtraMessage?.includes(messageReaction.message.guild.id) : null)) {
            
            messageReaction.message.react(messageReaction.emoji);
    }
});

client.on("messageUpdate", (oldMessage, message) => {
message.channel.send(oldMessage?.content ?? "");
console.log(message.content);

});
//////////////////////\\\\\\\\\\\\\\\\\\\\\
///////////////    COMMANDS    \\\\\\\\\\\\
//////////////////////\\\\\\\\\\\\\\\\\\\\\
client.on("interactionCreate", async (interaction) => {

    // the template embeds for `done` or `error`
    const doneEmb = new EmbedBuilder().setColor(config.getColors().good).setTitle("Done!");
    const errorEmb = new EmbedBuilder().setColor(config.getColors().error).setTitle("Error");

    // Slash Commands
    if (interaction.isChatInputCommand()) {
        try {

            /** Layout
             *  - get data
             *  - use functions
             *  - return data
             */
            switch (interaction.commandName) {
                case "message": {
                    try{
                        await interaction.user
                            .send(interaction.options.getString("message") ?? "No message specified");
                    }catch (err) {interaction.reply({
                            embeds: [errorEmb.setTitle("Error - message").setDescription("• You don't except DMs")]
                        });}

                    await interaction.reply({ embeds: [doneEmb.setDescription("Sent message to you")], ephemeral: true });
                }
                break;

            case "say": {
                const message = interaction.options.getString("message")?? "no message specified";
                let user = interaction.options.getUser("user");
                // @ts-expect-error
                const data = await say(client, config, user ?? interaction.user, message, interaction.guild?.me?? undefined, interaction?.channel );
                await interaction.reply(data);
            }
            break;

            case "ping": {
                const data = await mini.ping(client, config, interaction.createdTimestamp);
                await interaction.reply(data);
            }
            break;

            case "-aboutme-credits-": {
                const data = await meCreditsExtra(client, config);
                await interaction.reply(data);
            }
            break;
            }
        } catch (error) {
            console.log(error);
            if (!interaction.deferred) {
                interaction.reply({ embeds: [errorEmb.setDescription("A error happened")], ephemeral: true });
            } else {
                interaction.editReply({ embeds: [errorEmb.setDescription("A error happened")] });
            }
        }
    }


    if (interaction.isButton()) {
        try {
            if (!interaction?.memberPermissions?.has(PermissionFlagsBits.SendMessages)) return;
            
            switch (interaction.customId.split("-")[0]) {

                case "ping": {
                    const data = await mini.ping(client, config, interaction.createdTimestamp);
                    await interaction.update(data);
                }
                break;

            }
            
        } catch (error) {
            console.log(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ embeds: [errorEmb.setDescription("A error happened")], ephemeral: true });
            } else { await interaction.editReply({ embeds: [errorEmb.setDescription("A error happened")] }); }
        }
    }


});
