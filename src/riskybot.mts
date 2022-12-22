import { Config, stringFromEmbed } from "@riskybot/tools";
import { InteractionType, OAuth2Scopes, PermissionFlagsBits } from "discord-api-types/v10";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { about, aboutAutoComplete, evalResult, evalShowModal, fun, meCredits, mini, random, randomAutoComplete, randomButton, reddit, search, searchAutoComplete, toolsCmd, translate } from "@riskybot/commands";
import { parseRawInteraction, verifyInteraction } from "discord-api-parser";
import { EmbedBuilder } from "@discordjs/builders";
import { codeBlock } from "@discordjs/formatters";
import path from "path";

// import "dotenv/config";

const config = new Config(path.join(process.cwd(), "config.yml"), true);

// if (!process.env.APPLICATION_TOKEN) throw new Error("APPLICATION_TOKEN is not set");
// if (!process.env.APPLICATION_ID) throw new Error("APPLICATION_ID is not set");
if (!process.env.APPLICATION_PUBLIC_KEY) throw new Error("APPLICATION_PUBLIC_KEY is not set");

const ownerIds: string[] = [process.env.OWNER_ID || ""];


export default async function (request: VercelRequest, response: VercelResponse): Promise<void | VercelResponse> {

    if (!await verifyInteraction(request, response, process.env.APPLICATION_PUBLIC_KEY ?? "Key")) return;

    const interaction = parseRawInteraction(request.body);

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
        // console.info(request.body);
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
                const role = interaction.options.getRole("role");
                const channel = interaction.options.getChannel("channel");
                const stringInput = interaction.options.getString("subreddit");
                const advanced = interaction.options.getString("extra") || "";


                const data = await about(config, { user, member, role, channel, stringInput, name }, advanced, process.env.TOPGG_TOKEN);

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
                const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${interaction.applicationId}&scope=${[OAuth2Scopes.ApplicationsCommands].join(" ")}`;

                const data = await meCredits(config, inviteUrl, "RiskyBOT");

                await interaction.reply(data);
                break;
            }

            case "random": {
                const type = interaction.options.getSubcommand(true);
                const num1 = interaction.options.getInteger("num1") || interaction.options.getInteger("min");
                const num2 = interaction.options.getInteger("num2") || interaction.options.getInteger("max");
                const text1 = interaction.options.getString("subreddit") || interaction.options.getString("category");

                const data = await random(config, type, { num1, num2, text1 }, interaction.user.id);

                await interaction.reply(data);
                break;
            }

            case "fun": {
                const type = interaction.options.getSubcommand(true);
                const user1 = interaction.options.getUser("user1") || interaction.options.getUser("user") || interaction.user;
                const member1 = interaction.options.getMember("member1") || interaction.options.getMember("member") || interaction.member;
                const user2 = interaction.options.getUser("user2") || interaction.user;
                const text1 = interaction.options.getString("message");

                // TODO: Make there have no possible errors (catch from apis) & make time no longer then 3sec
                const data = await fun(config, type, { user1, member1, user2, text1 });

                await interaction.reply(data);
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

                const data = await reddit(config, "post", otherSubreddit, interaction.user.id);

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

                const data = await about(config, { user, member, name: "user" }, advanced, process.env.TOPGG_TOKEN);

                await interaction.reply(data);
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

        if (!interaction.member?.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({ embeds: [errorEmb.setTitle("You don't have permission").setDescription("You don't have the permission to send messages in this channel, so you can't press the button...")], ephemeral: true });
            return;
        }

        switch (interaction.customId.split("-")[0]) {
            case "random": {
                const customIdSplitted = interaction.customId.split("-");
                const origUser = customIdSplitted[customIdSplitted.length - 1] || interaction.message.interaction?.user.id;

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
                const input = interaction.options.getString("subreddit") ?? "";

                const data = await randomAutoComplete(type, input);

                await interaction.respond(data);
                break;
            }

            case "about": {
                const type = interaction.options.getSubcommand(true);
                const input = interaction.options.getString("subreddit", true);

                const data = await aboutAutoComplete(type, input);

                await interaction.respond(data);
                break;
            }

            default:
                await interaction.respond([{ name: `Unknown Autocomplete: \`${interaction.commandName}\``, value: `Unknown Autocomplete: \`${interaction.commandName}\`` }]);
                throw new Error(`Unknown Autocomplete: ${interaction.commandName}`);
        }

    }

    else if (interaction.isModalSubmit()) {
        // if (interaction.isFromMessage()) console.log("message");
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

                interaction.reply(data);
                break;
            }
            default:
                await interaction.reply({ embeds: [errorEmb.setTitle("Unknown Interaction").setDescription(`Unknown Modal: \`${interaction.customId}\``)], ephemeral: true });
                throw new Error(`Unknown Modal: ${interaction.customId}`);
        }

    }

    if (response.headersSent) return;

    return response.json({ interaction: "sent" });
}
