// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-nocheck

import { codeBlock, EmbedBuilder } from "@discordjs/builders";
import { Client, Team } from "discord.js";

import { mini, about, deepai, translate, meCredits, random, fun, search, searchAutoComplete, reddit, randomAutoComplete, aboutAutoComplete, toolsCmd, randomButton, evalShowModal, evalResult } from "@riskybot/functions";
import * as tools from "@riskybot/tools";

import "dotenv/config";
import { PermissionFlagsBits } from "discord-api-types/v10";
const wait = (await import("util")).promisify(setTimeout);


//TODO: Test everything!

// make bot
const client: Client = new Client({ intents: 0 }); // doesn't need any intents
const config = new tools.Config("./config.yml", true);
// const envEnabled = new tools.EnvEnabled(process.env, config);

// login to discord
if (process.env.discordapi) client.login(process.env.discordapi);
else console.error("\u001b[31m\u001b[1mDISCORD TOKEN REQUIRED\u001b[0m\n- put a valid discord bot token in `.env`\n- and make sure you used `npm start`\n");

client.once("ready", async () => {
    console.info("\x1b[92mDiscord Ready!\x1b[0m");
    console.info("Name:", client.user?.username);
    console.info();
});

client.on("debug", console.info);
client.on("error", console.error);
client.on("warn", console.warn);
process.on("unhandledRejection", error => {
  console.error("Unhandled promise rejection:");
  console.error(error);
});

process.on("uncaughtException", error => {
  console.error("Uncaught exception:");
  console.error(error);
});

//////////////////////\\\\\\\\\\\\\\\\\\\\\
///////////////    COMMANDS    \\\\\\\\\\\\
//////////////////////\\\\\\\\\\\\\\\\\\\\\
client.on("interactionCreate", async (interaction) => {

    // the template embeds for `done` or `error`
    // const doneEmb = new EmbedBuilder().setColor(config.getColors().good).setTitle("Done!");
    const errorEmb = new EmbedBuilder().setColor(config.getColors().error).setTitle("Error");

    // Nothing really intreating, just to see what commands used
    if (interaction.isChatInputCommand() && interaction.commandName) {
        if (interaction.options.getSubcommand(false)) {
            console.info(`SLASH: ${interaction.commandName} (${interaction.options.getSubcommand()})`);
        } else {
            console.info(`SLASH: ${interaction.commandName}`);
        }
    } else if (interaction.isContextMenuCommand() && interaction.commandName){
        console.info(`CONTEXT: ${interaction.commandName}`);
    } else if (interaction.isButton() && interaction.customId){
        console.info(`BUTTON: ${interaction.customId.split("-")[0]}`);
    } else if (interaction.isSelectMenu() && interaction.customId){
        console.info(`SELECT: ${interaction.customId.split("-")[0]}`);
    } else if (interaction.isModalSubmit() && interaction.customId){
        console.info(`MODAL: ${interaction.customId.split("-")[0]}`);
    } else if (interaction.isAutocomplete() && interaction.commandName){
        console.info(`AUTOCOMPLETE: ${interaction.commandName}`);
    } else {
        console.info(`UNKNOWN: ${interaction}`);
    }


    // Slash Commands
    if (interaction.isChatInputCommand()) {

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

                const advanced = interaction.options.getString("extra")||"";
                if (!option) return;

                const data = await about(config, option, advanced, process.env.topggapi);
                await interaction.reply(data);

            }
                break;

            case "deep-ai": {
                const type = interaction.options.getSubcommand(true);
                let input = interaction.options.getString("input");
                input ||= interaction.options.getString("text");

                await interaction.deferReply();
                const data = await deepai(config, input || "", type, process.env.deepapi);
                await interaction.editReply(data);
            }
                break;

            case "translate": {
                const to = interaction.options.getString("to", true);
                const msg = interaction.options.getString("input", true);
                const from = interaction.options.getString("from");

                const data = await translate(config, msg, to, from || undefined);
                await interaction.reply(data);
            }
                break;

            case "ping": {
                const data = await mini.ping(config, interaction.createdTimestamp, client.ws.ping);
                await interaction.reply(data);
            }
                break;

            case "-aboutme-credits-": {
                const data = await meCredits(client, config);
                await interaction.reply(data);
            }
                break;
            case "random": {
                const type = interaction.options.getSubcommand(true);
                let num1 = interaction.options.getInteger("num1");
                let num2 = interaction.options.getInteger("num2");
                num1 ||= interaction.options.getInteger("min");
                num2 ||= interaction.options.getInteger("max");
                let text1 = interaction.options.getString("sub-reddit");
                text1 ||= interaction.options.getString("category");

                const data = await random(config, type, num1 || 0, num2 || 0, text1 || "");
                await interaction.reply(data);
            }
                break;

            case "fun": {
                const type = interaction.options.getSubcommand(true);
                let user1 = interaction.options.getUser("user1");
                user1 ||= interaction.options.getUser("user");
                user1 ||= interaction.user;
                let member1 = interaction.options.getMember("user1");
                member1 ||= interaction.options.getMember("user");
                member1 ||= interaction.member;
                let user2 = interaction.options.getUser("user2");
                user2 ||= interaction.user;
                const text = interaction.options.getString("message") || "";

                if (type === "hack") {
                    await interaction.deferReply();
                    for (let i = 0; i < 17; i++) {
                        const data = await fun(config, type, user1, member1, user2, i.toString());
                        await interaction.editReply(data);
                        await wait(Math.random() * (2700 - 2300) + 2300);
                    } break;
                }

                const data = await fun(config, type, user1, member1, user2, text);
                await interaction.reply(data);
            }
                break;

            case "search": {
                const type = interaction.options.getSubcommand(true);
                let input = interaction.options.getString("input");
                input ||= interaction.options.getString("song-name");

                const data = await search(config, type, input || "");

                await interaction.reply(data);
            }
                break;

            case "meme": {
                const otherSubreddit = interaction.options.getString("other-subreddit") || "dankmemes";

                const data = await reddit(config, "random-post", otherSubreddit);
                await interaction.reply(data);

            }
                break;

            case "tools": {
                const type = interaction.options.getSubcommand(true);
                let input = interaction.options.getString("input");
                input ||= interaction.options.getString("word");
                input ||= interaction.options.getString("question");
                input ||= interaction.options.getString("choices");
                let input2 = interaction.options.getString("language");

                const data = await toolsCmd(config, type, input || "", input2 || "");
                await interaction.reply(data);
            }
                break;
            // OWNER ONLY COMMANDS BELOW:
            case "eval": {
                await interaction.client.application?.fetch();
                if (interaction.user.id !== client?.application?.owner?.id) {
                    await interaction.reply({ embeds: [errorEmb.setTitle("You are to Evil for Eval").setDescription("You dont have the privilege to be eval")], ephemeral: true }).catch(console.warn);
                    break;
                }
                const data = await evalShowModal();
                await interaction.showModal(data);
            }
                break;
        }
    }
    // Buttons
    if (interaction.isButton()) {

        if (!interaction?.memberPermissions?.has(PermissionFlagsBits.SendMessages)) return;

        switch (interaction.customId.split("-")[0]) {
            case "random": {
                // TODO: Actually implement this
                let wasOrigUsr = interaction.message.interaction?.user.id === interaction.user.id ||interaction.customId.split("-")[-1] === interaction.user.id;
                const data = await randomButton(config, interaction.customId, interaction.user.id);
                interaction.reply({ embeds: data.embeds, components: data.components, ephemeral: !wasOrigUsr });
                break;
            }

            case "ping": {
                const data = await mini.ping(config, interaction.createdTimestamp, client.ws.ping);
                await interaction.update(data);
                break;
            }

        }
    }

    // User/message menu
    else if (interaction.isContextMenuCommand()) {
        // try {
            if (interaction.isUserContextMenuCommand()) {
                switch (interaction.commandName) {
                    case "About user": {
                        const option = interaction.options.get("user", true);
                        const advanced = "";

                        const data = await about(config, option, advanced, process.env.topggapi);
                        await interaction.reply(data);
                    }
                }
            }
            else if (interaction.isMessageContextMenuCommand()) {
                // for messages menu
                switch (interaction.commandName) {
                    case "Translate message": {
                        const from = "";
                        const to = interaction.locale;
                        const msg = codeBlock("md", await tools.stringFromEmbed(interaction.options.getMessage("message", true)));

                        const data = await translate(config, msg, to, from);
                        await interaction.reply(data);

                    }
                        break;

                    case "Continue message - Deepai": {
                        const type = "text-generator";
                        const input = codeBlock("md", await tools.stringFromEmbed(interaction.options.getMessage("message", true)));

                        const data = await deepai(config, input, type, process.env.deepapi);
                        await interaction.reply(data);

                    }
                        break;

                    case "Save message - Pastebin": {
                        const type = "pastebin";
                        const input2 = "md";
                        const input = await tools.stringFromEmbed(interaction.options.getMessage("message", true));

                        const data = await toolsCmd(config, type, input, input2);
                        await interaction.reply(data);

                    }
                        break;
                }
            }

        } else if (interaction.isAutocomplete()) {

            switch (interaction.commandName) {
                case "search": {
                    const type = interaction.options.getSubcommand(true);
                    const input = interaction.options.getString("input", true);

                    const data = await searchAutoComplete(type, input);

                    await interaction.respond(data);
                }
                    break;
                case "random": {
                    const type = interaction.options.getSubcommand(true);
                    const input = interaction.options.getString("sub-reddit", true);

                    const data = await randomAutoComplete(type, input);

                    await interaction.respond(data);
                }
                    break;
                case "about": {
                    const type = interaction.options.getSubcommand(true);
                    const input = interaction.options.getString("sub-reddit", true);

                    const data = await aboutAutoComplete(type, input);

                    await interaction.respond(data);
                }
                    break;
            }

        } else if (interaction.isModalSubmit()) {
            switch (interaction.customId) {

                // OWNER ONLY COMMANDS BELOW:
                case "eval": {
                    await interaction.client?.application?.fetch();
                    if (interaction.user.id !== client.application?.owner?.id) return;
                    if (client.application?.owner instanceof Team && !client.application?.owner.members.has(interaction.user.id)) return;

                    const input = interaction.components[0].components[0].data.value ?? "";
                    // let input = interaction.fields.getTextInputValue("code");
                    let hasError = false; let evalRes;
                    try {
                        evalRes = await eval(input);
                    } catch (err) { evalRes = err; hasError = true; console.error("EVAL RESULT ERROR BELOW:"); console.error(err); }

                    const data = await evalResult(config, input, evalRes, hasError);

                    await interaction.reply(data);

                }
            }
        }
    });