import { codeBlock } from "@discordjs/builders";
import { Client, MessageEmbed } from "discord.js";
import { readFileSync } from "fs";

import { mini, about, deepai, translate, meCredits, random, fun, search, searchAutoComplete, reddit, randomAutoComplete, aboutAutoComplete, toolsCmd, randomButton } from "./functions/defaults.mjs";
import  * as tools from "./tools.mjs";
import "dotenv/config";

/** @type {import("./types").ConfigJSON} */
const config = JSON.parse(readFileSync("./config.json").toString());

// make bot
const client = new Client({ intents: 0 }); // doesn't need any intents

// login to discord
if (process.env.discordapi) client.login(process.env.discordapi);
else console.error("\u001b[31m\u001b[1mDISCORD TOKEN REQUIRED\u001b[0m\n- put a valid discord bot token in `.env`\n- and make sure you used `npm start`\n");

client.once("ready", async () => {
    console.info("\x1b[92mDiscord Ready!\x1b[0m");
    console.info("Name:", client.user.username);
});

client.once("reconnecting", () => console.log("Reconnecting!"));
client.once("disconnect", () => console.log("Disconnect!"));
// client.on("debug", console.log)

//////////////////////\\\\\\\\\\\\\\\\\\\\\
///////////////    COMMANDS    \\\\\\\\\\\\
//////////////////////\\\\\\\\\\\\\\\\\\\\\
client.on("interactionCreate", async (interaction) => {

    let colors = config.colors;

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
                case "about": {
                    let option = interaction.options.get("input");
                    option ||= interaction.options.get("user");
                    option ||= interaction.options.get("role");
                    option ||= interaction.options.get("channel");
                    option ||= interaction.options.get("sub-reddit");
                    option ||= interaction.options.get("id");

                    let advanced = interaction.options.getString("extra");
                    let data = await about(client, config, option, advanced, process.env.topggapi);
                    await interaction.reply(data);
 
                }
                break;

                case "deep-ai": {
                    let type = interaction.options.getString("type");
                    let input = interaction.options.getString("input");

                    await interaction.deferReply();
                    let data = await deepai(client, input, type, colors.ok, process.env.deepapi);
                    await interaction.editReply(data);
                }
                break;

                case "translate": {
                    let from = interaction.options.getString("from");
                    let to = interaction.options.getString("to");
                    let msg = interaction.options.getString("input");

                    await interaction.deferReply();
                    let data = await translate(client, msg, to, from, colors.ok);
                    await interaction.editReply(data);
                }
                break;

                case "ping": {
                    let data = await mini.ping(client, colors.ok, interaction.createdTimestamp);
                    await interaction.reply(data);
                }
                break;

                case "-aboutme-credits-": {
                    let data = await meCredits(client, colors.ok);
                    await interaction.reply(data);
                }
                break;
                case "random": {
                    let type = interaction.options.getSubcommand();
                    let num1 = interaction.options.getInteger("num1");
                    let num2 = interaction.options.getInteger("num2");
                    num1 ||= interaction.options.getInteger("min");
                    num2 ||= interaction.options.getInteger("max");
                    let text1 = interaction.options.getString("sub-reddit");

                    if (["cat", "random-post"].includes(type)) await interaction.deferReply();

                    let data = await random(client, colors.ok, colors.error, type, num1, num2, text1);
                    if (interaction?.deferred) await interaction.editReply(data);
                    else await interaction.reply(data);
                }
                break;

                case "fun": {
                    // let type = interaction.options.getString("type");
                    let type = interaction.options.getSubcommand();
                    let user1 = interaction.options.getUser("user1");
                    user1 ||= interaction.options.getUser("user");
                    let member1 = interaction.options.getMember("user1");
                    member1 ||=  interaction.options.getMember("user");
                    let user2 = interaction.options.getUser("user2");
                    let text = interaction.options.getString("message");

                    await interaction.deferReply();
                    let data = await fun(client, type, user1, member1, user2, text, colors.ok, colors.error);
                    await interaction.editReply(data);
                }
                break;
                
                case "search": {
                    let type = interaction.options.getSubcommand();
                    let input = interaction.options.getString("input");
                    input ||= interaction.options.getString("song-name");

                    await interaction.deferReply();

                    let data = await search(client, type, input, colors.ok, colors.error);

                    await interaction.editReply(data);
                }
                break;
                
                case "meme":{
                    await interaction.deferReply();
                    let otherSubreddit = interaction.options.getString("other-subreddit") || "dankmemes";

                    let data = await reddit(client, "random-post", otherSubreddit, colors.ok, colors.error);
                    await interaction.editReply(data);

                }
                break;

                case "tools":{
                    let type = interaction.options.getSubcommand();
                    let input2 = interaction.options.getString("language");
                    let input = interaction.options.getString("input");
                    input ||= interaction.options.getString("word");
                    input ||= interaction.options.getString("question");
                    input ||= interaction.options.getString("choices");

                    let data = await toolsCmd(client, type, input, input2, colors.ok, colors.error);
                    await interaction.reply(data);
                }
                break;
            }

        } catch (error) {
            console.log(error);
            if (!interaction.deferred) {
                await interaction.reply({ embeds: [errorEmb.setDescription("A error happened")], ephemeral: true }).catch(console.log);
            } else { await interaction.editReply({ embeds: [errorEmb.setDescription("A error happened")] }); }
        }
    }
    // Buttons
    if (interaction.isButton()) {
        try {
            if (interaction.memberPermissions.has("SEND_MESSAGES")){
                switch (interaction.customId.split("-")[0]) {
                    case "random": {
                        if (["cat", "randomPost"].includes(interaction.customId.split("-")[2])) await interaction.deferReply({fetchReply: true});
                        let data = await randomButton(client, config, interaction.customId);
                        if (interaction?.deferred) await interaction.editReply({content: interaction.user.toString(), embeds:data.embeds, components: data.components, allowedMentions: {repliedUser: true, users: [interaction.user.id]}});
                        else await interaction.reply({content: interaction.user.toString(), embeds:data.embeds, components: data.components, allowedMentions: {repliedUser: true, users: [interaction.user.id]}});
                    }
                    break;

                    case "ping": {
                        let data = await mini.ping(client, colors.ok, interaction.createdTimestamp);
                        await interaction.update(data);
                    }
                    break;

                }
            }
        } catch (error) {
            console.log(error);
            if (!interaction.deferred) {
                await interaction.reply({ embeds: [errorEmb.setDescription("A error happened")], ephemeral: true });
            } else { await interaction.editReply({ embeds: [errorEmb.setDescription("A error happened")] }); }
        }
    }

    // User/message menu
    else if (interaction.isContextMenu()) {
        try {
            switch (interaction.targetType) {
                case "USER": {
                    switch (interaction.commandName) {
                        case "About user": {
                            let option = interaction.options.get("user");
                            let advanced = "";

                            let data = await about(client, config, option, advanced, process.env.topggapi);
                            await interaction.reply(data);
                        }
                    }
                }
                break;
            case "MESSAGE": {
                // for messages menu
                switch (interaction.commandName) {
                    case "Translate message":{
                        let from = "";
                        let to = "en"; 
                        let msg = codeBlock("md", await tools.stringFromEmbed(interaction.options.getMessage("message")));

                        await interaction.deferReply();
                        let data = await translate(client, msg, to, from, colors.ok);
                        await interaction.editReply(data);

                    }
                    break;

                    case "Continue message (deep ai)":{
                        let type = "text-generator";
                        let input = codeBlock("md", await tools.stringFromEmbed(interaction.options.getMessage("message")));

                        await interaction.deferReply();
                        let data = await deepai(client, input, type, colors.ok, process.env.deepapi);
                        await interaction.editReply(data);

                    }
                    break;

                    case "Save message (pastebin)":{

                    let type = "pastebin";
                    let input2 = "md";
                    let input = await tools.stringFromEmbed(interaction.options.getMessage("message"));

                    let data = await toolsCmd(client, type, input, input2, colors.ok, colors.error);
                    await interaction.reply(data);

                    }
                    break;
                }
            }
            }
        } catch (error) {
            console.log(error);
            if (!interaction.deferred) {
                await interaction.reply({ embeds: [errorEmb.setDescription("A error happened")], ephemeral: true });
            } else { await interaction.editReply({ embeds: [errorEmb.setDescription("A error happened")] }); }
        }
    } else if (interaction.isAutocomplete()) {
        try {

            switch (interaction.commandName) {
                case "search": {
                    let type = interaction.options.getSubcommand();
                    let input = interaction.options.getString("input");

                    let data = await searchAutoComplete(client, type, input);

                    await interaction.respond(data);
                }
                break;
                case "random": {
                    let type = interaction.options.getSubcommand();
                    let input = interaction.options.getString("sub-reddit");

                    let data = await randomAutoComplete(client, type, input);

                    await interaction.respond(data);
                }
                break;
                case "about": {
                    let type = interaction.options.getSubcommand();
                    let input = interaction.options.getString("sub-reddit");

                    let data = await aboutAutoComplete(client, type, input);

                    await interaction.respond(data);
                }
                break;
            }
        } catch {console.log;}

    }
});