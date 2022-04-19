// eslint-disable-next-line @typescript-eslint/ban-ts-comment
@ts-nocheck

import { codeBlock } from "@discordjs/builders";
import { Client, EmbedBuilder, Util } from "discord.js";

import { mini, about, deepai, translate, meCredits, random, fun, search, searchAutoComplete, reddit, randomAutoComplete, aboutAutoComplete, toolsCmd, randomButton, evalShowModal, evalResult } from "@riskybot/functions";
import  * as tools from "@riskybot/tools";
tools.stringFromEmbed;

import "dotenv/config";
import { PermissionFlagsBits } from "discord-api-types/v10";
const wait = (await import("util")).promisify(setTimeout);

const config = new tools.Config("./config.yml", true);
config.getColors();
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
client.on("debug", console.log);
client.on("error", console.log);
process.on("unhandledRejection", console.log);

//////////////////////\\\\\\\\\\\\\\\\\\\\\
///////////////    COMMANDS    \\\\\\\\\\\\
//////////////////////\\\\\\\\\\\\\\\\\\\\\
client.on("interactionCreate", async (interaction) => {
// console.log(interaction)
    // const colors = config.colors;

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
                case "about": {
                    let option = interaction.options.get("input");
                    option ||= interaction.options.get("user");
                    option ||= interaction.options.get("role");
                    option ||= interaction.options.get("channel");
                    option ||= interaction.options.get("sub-reddit");
                    option ||= interaction.options.get("id");

                    const advanced = interaction.options.getString("extra");
                    const data = await about(client, config, option, advanced, process.env.topggapi);
                    await interaction.reply(data);
 
                }
                break;

                case "deep-ai": {
                    const type = interaction.options.getString("type");
                    const input = interaction.options.getString("input");

                    await interaction.deferReply();
                    const data = await deepai(client, input, type, colors.ok, process.env.deepapi);
                    await interaction.editReply(data);
                }
                break;

                case "translate": {
                    const from = interaction.options.getString("from");
                    const to = interaction.options.getString("to");
                    const msg = interaction.options.getString("input");

                    await interaction.deferReply();
                    const data = await translate(client, msg, to, from, colors.ok);
                    await interaction.editReply(data);
                }
                break;

                case "ping": {
                    const data = await mini.ping(client, colors.ok, interaction.createdTimestamp);
                    await interaction.reply(data);
                }
                break;

                case "-aboutme-credits-": {
                    const data = await meCredits(client, colors.ok);
                    await interaction.reply(data);
                }
                break;
                case "random": {
                    const type = interaction.options.getSubcommand();
                    let num1 = interaction.options.getInteger("num1");
                    let num2 = interaction.options.getInteger("num2");
                    num1 ||= interaction.options.getInteger("min");
                    num2 ||= interaction.options.getInteger("max");
                    let text1 = interaction.options.getString("sub-reddit");
                    text1 ||= interaction.options.getString("category");

                    if (["cat", "random-post"].includes(type)) await interaction.deferReply();

                    const data = await random(client, colors.ok, colors.error, type, num1, num2, text1);
                    if (interaction?.deferred) await interaction.editReply(data);
                    else await interaction.reply(data);
                }
                break;

                case "fun": {
                    // let type = interaction.options.getString("type");
                    const type = interaction.options.getSubcommand();
                    let user1 = interaction.options.getUser("user1");
                    user1 ||= interaction.options.getUser("user");
                    let member1 = interaction.options.getMember("user1");
                    member1 ||=  interaction.options.getMember("user");
                    const user2 = interaction.options.getUser("user2");
                    const text = interaction.options.getString("message");

                    if (type === "hack"){
                        await interaction.deferReply(); 
                        for (let i=0;i<17;i++){
                            const data = await fun(client, type, user1, member1, user2, i.toString(), colors.ok);
                            await interaction.editReply(data);
                            await wait(Math.random() * (2700 - 2300) + 2300);
                        } break;
                    }

                    await interaction.deferReply();
                    const data = await fun(client, type, user1, member1, user2, text, colors.ok);
                    await interaction.editReply(data);
                }
                break;
                
                case "search": {
                    const type = interaction.options.getSubcommand();
                    let input = interaction.options.getString("input");
                    input ||= interaction.options.getString("song-name");

                    await interaction.deferReply();

                    const data = await search(client, type, input, colors.ok, colors.error);

                    await interaction.editReply(data);
                }
                break;
                
                case "meme":{
                    await interaction.deferReply();
                    const otherSubreddit = interaction.options.getString("other-subreddit") || "dankmemes";

                    const data = await reddit(client, "random-post", otherSubreddit, colors.ok, colors.error);
                    await interaction.editReply(data);

                }
                break;

                case "tools":{
                    const type = interaction.options.getSubcommand();
                    const input2 = interaction.options.getString("language");
                    let input = interaction.options.getString("input");
                    input ||= interaction.options.getString("word");
                    input ||= interaction.options.getString("question");
                    input ||= interaction.options.getString("choices");

                    const data = await toolsCmd(client, type, input, input2, colors.ok, colors.error);
                    await interaction.reply(data);
                }
                break;
                // OWNER ONLY COMMANDS BELOW:
                case "eval":{
                    await interaction.client.application?.fetch();
                    if (interaction.user.id !== client.application?.owner.id){
                        await interaction.reply({ embeds: [errorEmb.setTitle("You are to Evil for Eval").setDescription("You dont have the privilege to be eval")], ephemeral: true}).catch(console.log);
                        break;
                    }
                    const data = await evalShowModal(client);
                    await interaction.showModal(data);
                }
                break;
            }

        } catch (error) {
            console.log(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ embeds: [errorEmb.setDescription("A error happened")], ephemeral: true, options: {avatarURL: "https://google.com/favicon.ico"}  }).catch(console.log);
            } else { await interaction.editReply({ embeds: [errorEmb.setDescription("A error happened")],options: {username: "oof"} }); }
        }
    }
    // Buttons
    if (interaction.isButton()) {
        try {
            if (!interaction.memberPermissions.has(PermissionFlagsBits.SendMessages)) return;
            
            switch (interaction.customId.split("-")[0]) {
                case "random": {
                    if (["cat", "randomPost"].includes(interaction.customId.split("-")[2])) await interaction.deferReply({fetchReply: true});
                    const data = await randomButton(client, config, interaction.customId);
                    if (interaction?.deferred) await interaction.editReply({content: interaction.user.toString(), embeds:data.embeds, components: data.components, allowedMentions: {repliedUser: true, users: [interaction.user.id]}});
                    else await interaction.reply({content: interaction.user.toString(), embeds:data.embeds, components: data.components, allowedMentions: {repliedUser: true, users: [interaction.user.id]}});
                }
                break;

                case "ping": {
                    const data = await mini.ping(client, colors.ok, interaction.createdTimestamp);
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

    // User/message menu
    else if (interaction.isContextMenuCommand()) {
        try {
            if (interaction.isUserContextMenuCommand()){
                    switch (interaction.commandName) {
                        case "About user": {
                            const option = interaction.options.get("user");
                            const advanced = "";

                            const data = await about(client, config, option, advanced, process.env.topggapi);
                            await interaction.reply(data);
                        }
                    }
                }
            else if (interaction.isMessageContextMenuCommand()) {
                // for messages menu
                switch (interaction.commandName) {
                    case "Translate message":{
                        const from = "";
                        const to = interaction.locale; 
                        const msg = codeBlock("md", await tools.stringFromEmbed(interaction.options.getMessage("message")));

                        await interaction.deferReply();
                        const data = await translate(client, msg, to, from, colors.ok);
                        await interaction.editReply(data);

                    }
                    break;

                    case "Continue message (deep ai)":{
                        const type = "text-generator";
                        const input = codeBlock("md", await tools.stringFromEmbed(interaction.options.getMessage("message")));

                        await interaction.deferReply();
                        const data = await deepai(client, input, type, colors.ok, process.env.deepapi);
                        await interaction.editReply(data);

                    }
                    break;

                    case "Save message (pastebin)":{

                    const type = "pastebin";
                    const input2 = "md";
                    const input = await tools.stringFromEmbed(interaction.options.getMessage("message"));

                    const data = await toolsCmd(client, type, input, input2, colors.ok, colors.error);
                    await interaction.reply(data);

                    }
                    break;
                }
            }
        } catch (error) {
            console.log(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ embeds: [errorEmb.setDescription("A error happened")], ephemeral: true });
            } else { await interaction.editReply({ embeds: [errorEmb.setDescription("A error happened")] }); }
        }
    } else if (interaction.isAutocomplete()) {

        try {

            switch (interaction.commandName) {
                case "search": {
                    const type = interaction.options.getSubcommand();
                    const input = interaction.options.getString("input");

                    const data = await searchAutoComplete(client, type, input);

                    await interaction.respond(data);
                }
                break;
                case "random": {
                    const type = interaction.options.getSubcommand();
                    const input = interaction.options.getString("sub-reddit");

                    const data = await randomAutoComplete(client, type, input);

                    await interaction.respond(data);
                }
                break;
                case "about": {
                    const type = interaction.options.getSubcommand();
                    const input = interaction.options.getString("sub-reddit");

                    const data = await aboutAutoComplete(client, type, input);

                    await interaction.respond(data);
                }
                break;
            }
            
        } catch (err) {
            console.log(err);
            // interaction.respond([{name: "ERROR. There has been a issue...", value: ""}]);
        }

    } else if (interaction.isModalSubmit()){
        // console.log(interaction.user);
        switch (interaction.customId){
            case "eval":{
                await interaction.client.application.fetch(); 
                if (interaction.user.id !== client.application.owner.id) return;
                const input = interaction.components[0].components[0].data.value;
                // let input = interaction.fields.getTextInputValue("code");
                let hasError=false; let evalRes;
                try{
                    const discordBuilders = await import("@discordjs/builders");
                    const discordJs = await import("discord.js");
                    evalRes = await eval(input);
                }catch (err) { evalRes=err; hasError=true; console.log(err); }
                
                const data = await evalResult(client, config, input, evalRes, hasError);

                await interaction.reply(data);


        }
    }
}
});