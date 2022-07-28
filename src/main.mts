import {Client} from "@riskybot/discord-interactions";
import { InteractionType, OAuth2Scopes } from "discord-api-types/v10";
import express from "express";
import { Config, stringFromEmbed } from "@riskybot/tools";
import bodyParser from "body-parser";

import "dotenv/config";

import { mini, about, translate, meCredits, random, fun, search, searchAutoComplete, reddit, randomAutoComplete, aboutAutoComplete, toolsCmd, randomButton, evalShowModal, evalResult } from "@riskybot/commands";
import { codeBlock, EmbedBuilder } from "@discordjs/builders";


const app = express();
const config = new Config("./config.yml", undefined, true);
const wait = (await import("util")).promisify(setTimeout);

if (!process.env.APPLICATION_TOKEN) throw new Error("APPLICATION_TOKEN is not set");
if (!process.env.APPLICATION_ID) throw new Error("APPLICATION_ID is not set");
if (!process.env.APPLICATION_PUBLIC_KEY) throw new Error("APPLICATION_PUBLIC_KEY is not set");

const client = new Client({token: process.env.APPLICATION_TOKEN, applicationId: process.env.APPLICATION_ID, publicKey: process.env.APPLICATION_PUBLIC_KEY }, config);

process.on("unhandledRejection", error => {
    console.info("\n---START ERROR---");
    console.error("Unhandled promise rejection:");
    console.error(error);
    console.info("---END ERROR---\n");
});

process.on("uncaughtException", error => {
    console.info("\n---START ERROR---");
    console.error("Uncaught exception:");
    console.error(error);
    console.info("---END ERROR---\n");
});

const ownerIds: string[] = [process.env.OWNER_ID || ""];

app.use(bodyParser.json());

function rateLimiting(req: express.Request, res: express.Response) {
    return {req, res};
}

app.post("/discord-interactions", async (request, response, next) => {
    const isValidRequest = client.verify(request, response);
    if (!isValidRequest) return console.warn("Invalid request");

    if (!rateLimiting(request, response)) return;

    const interaction = client.parse(request.body);
    // console.log(interaction);

    // the template embeds for `done` or `error`
    // const doneEmb = new EmbedBuilder().setColor(config.getColors().good).setTitle("Done!");
    const errorEmb = new EmbedBuilder().setColor(config.getColors().error).setTitle("Error");


    // Nothing really interesting, just to see what commands used
    if (interaction.isChatInputCommand() && interaction.commandName) {
        if (interaction.options && interaction.options.getSubcommand(false)) {
            console.info(`SLASH: ${interaction.commandName} (${interaction.options.getSubcommand()})`);
        } 
        else {
            console.info(`SLASH: ${interaction.commandName}`);
        }
    } 
    else if ((interaction.isUserCommand() || interaction.isMessageCommand()) && interaction.commandName) {
        console.info(`CONTEXT: ${interaction.commandName}`);
    } 
    else if (interaction.isButton() && interaction.customId) {
        console.info(`BUTTON: ${interaction.customId.split("-")[0]}`);
    } 
    else if (interaction.isSelectMenu() && interaction.customId) {
        console.info(`SELECT: ${interaction.customId.split("-")[0]}`);
    } 
    else if (interaction.isModalSubmit() && interaction.customId) {
        console.info(`MODAL: ${interaction.customId.split("-")[0]}`);
    } 
    else if (interaction.isAutocomplete() && interaction.commandName) {
        console.info(`AUTOCOMPLETE: ${interaction.commandName}`);
    } 
    else if (interaction.type === InteractionType.Ping) {
        console.info("PING");
    } 
    else {
        console.info(`UNKNOWN: ${interaction.type}`);
        console.info(request.body);
    }
    
    // console.log(JSON.stringify(request.body, null, 2));
    
    if (interaction.isChatInputCommand()) {
      
        switch (interaction.commandName) {
            case "ping": {
                const data = await mini.ping(config, Number(interaction.createdAt));
                await interaction.reply(data);
                break;
            }

            case "about": {
                const name = interaction.options.getSubcommand(true);
                const user = interaction.options.getUser("user") || interaction.user;
                const member = interaction.options.getMember("user");
                const role = interaction.options.getRole("role") || undefined;
                const channel = interaction.options.getChannel("channel") || undefined;
                const stringInput = interaction.options.getString("sub-reddit") || undefined;
                const advanced = interaction.options.getString("extra") || "";

                const data = await about(config, {user, member, role, channel, stringInput, name }, advanced, process.env.TOPGG_TOKEN);

                await interaction.reply(data);
                break;
            }        
            
            case "translate": {
                const to = interaction.options.getString("to", true);
                const msg = interaction.options.getString("input", true);
                const from = interaction.options.getString("from");

                const data = await translate(config, msg, to, from);
                
                await interaction.reply(data);
                break;
            }

            case "-aboutme-credits-": {
                const inviteUrl = client.generateInvite({scopes: [OAuth2Scopes.ApplicationsCommands]});
                
                const data = await meCredits(config, inviteUrl, "RiskyBOT");
                
                await interaction.reply(data);
                break;
            }

            case "random": {
                const type = interaction.options.getSubcommand(true);
                const num1 = interaction.options.getInteger("num1") || interaction.options.getInteger("min");
                const num2 = interaction.options.getInteger("num2") || interaction.options.getInteger("max");
                const text1 = interaction.options.getString("sub-reddit") || interaction.options.getString("category");

                const data = await random(config, type, {num1, num2, text1}, interaction.user.id);
                await interaction.reply(data);
                break;
            }

            case "fun": {
                const type = interaction.options.getSubcommand(true);
                const user1 = interaction.options.getUser("user1") || interaction.options.getUser("user") || interaction.user;
                const member1 = interaction.options.getMember("member1") || interaction.options.getMember("member") || interaction.member;
                const user2 = interaction.options.getUser("user2") || interaction.user;
                const text1 = interaction.options.getString("message");

                // TODO: Either remove the defer and/or make there have no possible errors (catch from apis)
                interaction.deferReply();
                const data = await fun(config, type, {user1, member1, user2, text1});
                
                if (type === "hack") {
                    // await interaction.deferReply();
                    for (let i = 0; i < 17; i++) {
                        const data = await fun(config, type, { user1, member1, user2, text1: i.toString() });
                        interaction.editReply(data);
                        await wait(Math.random() * (2700 - 2300) + 2300);
                    } break;
                }

                await interaction.editReply(data);
                break;
            }

            case "search": {
                const type = interaction.options.getSubcommand(true);
                const input = interaction.options.getString("input") || interaction.options.getString("song-name") || "";

                const data = await search(config, type, input);

                await interaction.reply(data);
                break;
            }

            case "meme": {
                const otherSubreddit = interaction.options.getString("other-subreddit") || "dankmemes";
                
                const data = await reddit(config, "random-post", otherSubreddit, interaction.user.id);
                
                await interaction.reply(data);
                break;
            }

            case "tools": {
                const type = interaction.options.getSubcommand(true);
                const input = interaction.options.getString("input") || interaction.options.getString("word") || interaction.options.getString("question") || interaction.options.getString("choices") || "";
                const input2 = interaction.options.getString("language") || "";

                const data = await toolsCmd(config, type, input, input2);

                await interaction.reply(data);
                break;
            }

            // OWNER ONLY COMMANDS BELOW:
            case "eval": {

                if (!ownerIds.includes(interaction.user.id)) {
                    interaction.reply({ embeds: [errorEmb.setTitle("You are to Evil for Eval").setDescription("You don't have the privilege to be eval")], ephemeral: true }).catch(console.warn);
                    return;
                }

                const data = await evalShowModal();

                await interaction.showModal(data);
                break;
            }
            
            default:
                await interaction.reply({ embeds: [errorEmb.setTitle("Unknown Interaction").setDescription(`Unknown Command: \`/${interaction.commandName}\``)], ephemeral: true });
                throw new Error(`Unknown Command: /${interaction.commandName}`);
        }
    }

    else if (interaction.isUserCommand()) {
        switch (interaction.commandName) {
            case "About user": {
                const user = interaction.options.getUser("user", true);
                const member = interaction.options.getMember("user");
                const advanced = "";

                const data = await about(config, {user, member, name: "About user"}, advanced, process.env.TOPGG_TOKEN);
                interaction.reply(data);
                break;
            }

            default:
                await interaction.reply({ embeds: [errorEmb.setTitle("Unknown Interaction").setDescription(`Unknown User Command: \`${interaction.commandName}\``)], ephemeral: true });
                throw new Error(`Unknown User Command: ${interaction.commandName}`);
        }

    }

    else if (interaction.isMessageCommand()) {
        switch (interaction.commandName) {
            case "Translate message": {
                const from = "";
                const to = interaction.locale || "en";
                const msg = codeBlock("md", await stringFromEmbed(interaction.options.getMessage("message", true)));

                const data = await translate(config, msg, to, from);
                
                await interaction.reply(data);
                break;

            }

            case "Save message - Pastebin": {
                const type = "pastebin";
                const input2 = "md";
                const input = await stringFromEmbed(interaction.options.getMessage("message", true));

                const data = await toolsCmd(config, type, input, input2);
                
                await interaction.reply(data);
                break;

            }
            default:
                await interaction.reply({ embeds: [errorEmb.setTitle("Unknown Interaction").setDescription(`Unknown Message Command: \`${interaction.commandName}\``)], ephemeral: true });
                throw new Error(`Unknown Message Command: ${interaction.commandName}`);
        }
    }

    else if (interaction.isButton()) {
        switch (interaction.customId.split("-")[0]) {
            case "random": {
                const customIdSplitted = interaction.customId.split("-");
                // TODO: Actually implement this
                const origUser = customIdSplitted[customIdSplitted.length-1] || interaction.message.interaction?.user.id;
                
                const data = await randomButton(config, interaction.customId, origUser);
                
                await interaction.reply({ ...data, ephemeral: origUser !== interaction.user.id });
                break;
            }

            case "ping": {
                const data = await mini.ping(config, Number(interaction.createdAt));
                
                await interaction.update(data);
                break;
            }

            default:
                await interaction.reply({ embeds: [errorEmb.setTitle("Unknown Interaction").setDescription(`Unknown Button Component: \`${interaction.customId}\``)], ephemeral: true });
                throw new Error(`Unknown Button Component: ${interaction.customId}`);                           

        }

    }

    else if (interaction.isSelectMenu()) {
        switch (interaction.customId.split("-")[0]) {
            default:    
                await interaction.reply({ embeds: [errorEmb.setTitle("Unknown Interaction").setDescription(`Unknown Select Menu Component: \`${interaction.customId}\``)], ephemeral: true });
                throw new Error(`Unknown Select Menu Component: ${interaction.customId}`);                           
        }
    }

    else if (interaction.isAutocomplete()) {
        switch (interaction.commandName) {
            case "search": {
                const type = interaction.options.getSubcommand(true);
                const input = interaction.options.getString("input", true);

                const data = await searchAutoComplete(type, input);

                await interaction.respond(data);
                break;
            }

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
                break;
            }

            default:
                await interaction.respond([{name: `Unknown Autocomplete: \`${interaction.commandName}\``, value: `Unknown Autocomplete: \`${interaction.commandName}\``}]);
                throw new Error(`Unknown Autocomplete: ${interaction.commandName}`);
        }

    }

    else if (interaction.isModalSubmit()) {
        switch (interaction.customId) {
            
            // OWNER ONLY COMMANDS BELOW:
            case "eval": {
                if (!ownerIds.includes(interaction.user.id)) {
                    interaction.reply({ embeds: [errorEmb.setTitle("You are to Evil for Eval").setDescription("You don't have the privilege to be eval")], ephemeral: true }).catch(console.warn);
                    return;
                }

                const input = interaction.fields.getTextInputValue("code", true);
                let hasError = false; let evalRes;
                try {
                    evalRes = await eval(input);
                } catch (err) { evalRes = err; hasError = true; console.error("EVAL RESULT ERROR BELOW:"); console.error(err); }

                const data = await evalResult(config, input, evalRes, hasError);

                await interaction.reply(data);
                break;
            }
            default:    
                await interaction.reply({ embeds: [errorEmb.setTitle("Unknown Interaction").setDescription(`Unknown Modal: \`${interaction.customId}\``)], ephemeral: true });
                throw new Error(`Unknown Modal: ${interaction.customId}`);
        }

    }

    return next();

});

app.post("/discord-interactions", async () => {
    if (global.gc) global.gc();
});

setInterval(function() { 
    if (global.gc) global.gc();
}, 25_000);


const port = process.env.PORT || 80;

app.listen(port, () => {
    console.info("\x1b[92mDiscord Interactions Ready!\x1b[0m");
    if (port !== 80) console.info(`\x1b[93mⓘ  Listening on port ${port}\x1b[0m`);
});