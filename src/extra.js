import { Intents, Client, MessageEmbed, Permissions } from "discord.js";

import { mini, say, meCreditsExtra } from "./functions/defaults.mjs";

// make bot
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

// login to discord
if (process.env.discordapi2) client.login(process.env.discordapi2);
else if (process.env.discordapi) client.login(process.env.discordapi);
else console.error("\u001b[31m\u001b[1mDISCORD TOKEN REQUIRED\u001b[0m\n- put a valid discord bot token in `.env`\n- and make sure you used `npm start:extra`\n");

if (!process.env.discordapi2) console.warn("This is using the main discord key - make sure you aren't running both at same time");

client.once("ready", async () => {
    console.info("\x1b[92mDiscord Ready! (extra)\x1b[0m");
    console.info("Name:", client.user.username + ", Servers:", client.guilds.cache.size);
});

client.once("reconnecting", () => console.log("Reconnecting!"));
client.once("disconnect", () => console.log("Disconnect!"));

client.on("guildCreate", async (guild) => {
    if (guild.me ? new Permissions(guild.me.permissionsIn(guild.systemChannelId)).has("SEND_MESSAGES") : null) {
        // make sure that the bot can sent message
        guild.systemChannel.send("Hello, thank you for inviting me to this server. Info: https://riskymh.github.io/RiskyBOT/added/extra (btw I use `/` slash commands) ");
    }
});
/** 
 * @param {string} msg
 * @param {string} what 
 * @returns {Promise<boolean>}
 */
async function msgWordHas(msg, what) {
    // if (msg === what) return true
    // if (msg.includes(what + " ")) return true
    // if (msg.includes(" " + what)) return true
    // Because can't substitute into regex
    msg = msg.replace(what, "TeXt_Is_VaLiD_ReTuRn_TRUE");
    if (/\b(TeXt_Is_VaLiD_ReTuRn_TRUE)\b/g.test(msg)) return true;
    else return false;
}

client.on("messageCreate", async (message) => {

    try {

        let mePerms = new Permissions(message.guild.me.permissionsIn(message.channelId));
        let serversNoMessage = (process.env.serversNoMessage ? JSON.parse(process.env.serversNoMessage) : []);

        if ((message.guild ? (serversNoMessage.length ? serversNoMessage.includes(message.guild.id) : !null) : null) ||
            !message.guild ? mePerms.has("SEND_MESSAGES") : null || !message.guild ? mePerms.has("ADD_REACTIONS") : null ||
            message.author.id === client.user.id || message.author.bot || message.reactions.cache.entries.length >= 20) { return; } // we dont want these above

        let msg = message.content.toLowerCase();
        if (message.mentions.users.first() === client.user) {
            message.channel.send("I use some slash `/` commands, and some text based stuff, nothing fancy.");
        }
        if (msg === (await message.guild.members.fetch(client.user)).displayName.toLowerCase() || msg === client.user.username.toLowerCase()) {
            message.channel.send("Hello 👋");
        }

        // like CheemsBot
        if (await msgWordHas(msg, "hello")) await message.react("👋");
        if (await msgWordHas(msg, "bye")) await message.react("👋");
        if (await msgWordHas(msg, "bruh")) await message.react("🍔");
        if (await msgWordHas(msg, "what")) await message.react("🐳");
        if (await msgWordHas(msg, "gg")) await message.channel.send("gg");
        if (await msg === "f") await message.channel.send("F");

        let serversExtraMessage = JSON.parse(process.env.serversExtraMessage) ? process.env.serversExtraMessage : [];
        if (message.guild ? (serversExtraMessage.length ? serversExtraMessage.includes(message.guild.id) : !null) : !null) {
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
    } catch { console.error("error"); }

});
client.on("messageReactionAdd", (messageReaction, user) => {

    try {
        let mePerms = new Permissions(messageReaction.message.guild.me.permissionsIn(messageReaction.message.channelId));

        if (!JSON.parse(process.env.serversExtraMessage) || mePerms.has("ADD_REACTIONS") ||
            messageReaction.message.reactions.cache.entries.length <= 20 ||
            (messageReaction.message.guild ? process.env.serversExtraMessage.includes(messageReaction.message.guild.id) : null)) {
            messageReaction.message.react(messageReaction.emoji);
        }
    } catch { console.error("error"); }
});
//////////////////////\\\\\\\\\\\\\\\\\\\\\
///////////////    COMMANDS    \\\\\\\\\\\\
//////////////////////\\\\\\\\\\\\\\\\\\\\\
client.on("interactionCreate", async (interaction) => {
    /** @typedef {import("discord.js").HexColorString} colorType */
    /** @type   {{ ok: colorType, error: colorType, good: colorType, warning: colorType }} */
    let colors = { ok: "#5865F2", error: "#ED4245", good: "#57F287", warning: "#FEE75C" };

    // the template embeds for `done` or `error`
    let doneEmb = new MessageEmbed().setColor(colors.good).setTitle("Done!");
    let errorEmb = new MessageEmbed().setColor(colors.error).setTitle("Error");

    // Slash Commands
    if (interaction.isCommand()) {
        try {

            /** Layout
             *  - get data
             *  - use functions
             *  - return data
             */
            switch (interaction.commandName) {
                case "message": {
                    await interaction.user
                        .send(interaction.options.getString("message"))
                        .catch(() => interaction.reply({
                            embeds: [errorEmb.setTitle("Error - message").setDescription("• You don't except DMs")]
                        }));

                    await interaction.reply({ embeds: [doneEmb.setDescription("Sent message to you")], ephemeral: true });
                }
                break;

            case "say": {
                let message = interaction.options.getString("message");
                let user = interaction.options.getUser("user");

                if (!user) user = interaction.user;
                let channel = interaction.channel;
                // @ts-expect-error doesn't like channel
                let data = await say(client, message, colors.good, colors.error, user, interaction.guild ? interaction.guild.me.permissions : null, channel);
                await interaction.reply(data);
            }
            break;

            case "ping": {
                let data = await mini.ping(client, colors.ok, interaction.createdTimestamp);
                await interaction.reply(data);
            }
            break;

            case "-aboutme-credits-": {
                let data = await meCreditsExtra(client, colors.ok);
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
});
