import { EmbedBuilder } from "discord.js";
import {fetch} from "undici";
import { codeBlock, ContextMenuCommandBuilder, inlineCode, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, spoiler } from "@discordjs/builders";
import * as tools from "@riskybot/tools";
import type { Config, EnvEnabled } from "@riskybot/tools";
import { ApplicationCommandType } from "discord-api-types/v10";


//TODO: Make sure everything works...
//TODO: Migrate the fetch into `@riskybot/apis`


export default async function toolsCmd(config: Config, engine: string, input: string, input2: string) {
    let toolsEmb = new EmbedBuilder().setTitle("Tools").setColor(config.getColors().ok);
    let errorEmb = new EmbedBuilder().setTitle("Errors - tools").setColor(config.getColors().error);

    switch (engine) {
        case "rhymes": {
            // TODO: fix types
            let rhymes: {word:string}[] = await fetch("https://rhymebrain.com/talk?" + new URLSearchParams({ function: "getRhymes", maxResults: "10", word: input })).then((response) => response.json()) as any;
            
            if (rhymes.length) {
                let list = [];
                for (let rhyme in rhymes){
                    list.push(`${Number(rhyme)+1}: ${rhymes[rhyme].word}`);
                }
                toolsEmb
                    .setAuthor({name: "Rhyme Brain", url: "https://rhymebrain.com/en"})
                    .setURL(`https://rhymebrain.com/en/What_rhymes_with_${input}.html`)
                    .setTitle("Words that rhyme - " + inlineCode(tools.trim(input, 15)))
                    .setDescription(list.join("\n"));
            } else {
                errorEmb.setDescription("no findings :(");
                return { embeds: [errorEmb], ephemeral: true };
            }
        }
        break;
        case "pastebin": {
            let data = {
             name: "Discord Paste - (RiskyBOT)",
             description: "The data",
             visibility: "unlisted",
             //  expires: "",
             files: [
              {
               name: "Downloaded data"+input2? `.${input2}`: "",
               content: {
                   format: "text",
                    highlight_language: input2,
                    value: input
               },
              },
             ],
            };
            // TODO: fix types
            let pastegg: {result: {id: any, deletion_key: any }} = await fetch("https://api.paste.gg/v1/pastes", {body:JSON.stringify(data), headers: {"Content-Type": "application/json"}, method: "POST"}).then((response) => response.json()) as any;
            if (await pastegg?.result) {

                toolsEmb
                    .setAuthor({name: "Paste.gg", url: "https://paste.gg"})
                    .setURL(`https://paste.gg/p/anonymous/${pastegg.result.id}`)
                    .setTitle("Upload code - `Paste.gg`")
                    .setDescription(`Code: ${codeBlock(input2, input)}\nURL: https://paste.gg/p/anonymous/${pastegg.result.id}\nDeleation key: ${spoiler(inlineCode(pastegg.result.deletion_key))}`);
            } else {
                errorEmb.setDescription("no findings :(");
                return { embeds: [errorEmb], ephemeral: true };
            }
        }
        break;

        case "8ball": {
            const randomIndex = Math.floor(
                Math.random() * ballResponses.length
            );
            toolsEmb
            .setTitle("🎱 8Ball")
            .setDescription(`Q: ${input}\nA: ${ballResponses[randomIndex]}`);

        }
        break;

        case "choose": {

            const randomIndex = Math.floor(
                Math.random() * input.split(",").length
            );
            toolsEmb
            .setTitle("Choose")
            .setDescription(`I choose.. ${input.split(",")[randomIndex]}!`);

        }

    }
    return { embeds: [toolsEmb] };
}

const ballResponses = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes definitely.",
    "You may rely on it.", 

    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",

    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.", 

    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful. ",
];



export function applicationCommands(config: Config, envEnabledList?:EnvEnabled) {
    config; envEnabledList; // Just so it is used
    let toolsSlashCommand = new SlashCommandBuilder()
        .setName("tools")
        .setDescription("🛠️ Use the bot to _____________________________")
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("choose")
                .setDescription("Use the bot to choose an option")
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName("choices")
                        .setDescription("The list to choose from (separated by ',')")
                        .setRequired(true)
                )
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("8ball")
                .setDescription("🎱 Ask the Magic 8 Ball a question!")
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName("question")
                        .setDescription("Your question")
                        .setRequired(true)
                )
        );
    if (config.apiEnabled.randomSmallOnes.rhymebrain){
        toolsSlashCommand.addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("rhymes")
                .setDescription("Find words that rhyme with a provided word")
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName("word")
                        .setDescription("The word to find rhymes for")
                        .setRequired(true)
                )
        );
    }
    
    if (config.apiEnabled.randomSmallOnes.pastegg){
        toolsSlashCommand.addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("pastebin")
                .setDescription("Uses Paste.gg to upload code")
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName("input")
                        .setDescription("Your code")
                        .setRequired(true)
                ).addStringOption(
                    new SlashCommandStringOption()
                        .setName("language")
                        .setDescription("Your code's language")
                        .setRequired(false)
                        .setChoices(
                            {name: "JavaScript", value: "js"},
                            {name: "CSS", value: "css"},
                            {name: "Python", value: "py"},
                            {name: "HTML", value: "html"},
                            {name: "Java", value: "java"},
                            {name: "Markdown", value: "md"},
                            {name: "PHP", value: "php"},
                            {name: "SQL", value: "sql"},
                            {name: "Swift", value: "swift"},
                            {name: "TypeScript", value: "ts"},
                            {name: "YAML", value: "yaml"},
                            {name: "Rust", value: "rs"},
                            {name: "Perl", value: "perl"},
                            {name: "JSON", value: "json"},
                            {name: "Go", value: "go"},
                            {name: "C", value: "c"},
                            {name: "C#", value: "csharp"},
                            {name: "C++", value: "cpp"},
                            {name: "Shell", value: "bash"},
                            {name: "R", value: "r"},
                            {name: "PowerShell", value: "ps1"},
                            {name: "Objective-C", value: "objc"},
                            {name: "Kotlin", value: "kt"},
                            {name: "cURL", value: "curl"},
                            {name: "Docker", value: "dockerfile"}

                        )
                )
        );
        let pastbinMessageMenu = new ContextMenuCommandBuilder()
            .setName("Save message - Pastebin")
            .setType(ApplicationCommandType.Message);
        return [toolsSlashCommand, pastbinMessageMenu];
    }
    
    return [toolsSlashCommand];
}