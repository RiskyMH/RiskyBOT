import config from "#config.mjs";
import { EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, inlineCode } from "@discordjs/builders";
import { urbanDictionary } from "@riskybot/apis";
import Command from "@riskybot/command";
import { trim } from "@riskybot/tools";
import { ApplicationCommandInteraction, AutocompleteInteraction } from "discord-api-parser";


export default class Search extends Command {
    name = "search";
    description = "🔍 Use the bot to search from sources";

    command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("urban-dictionary")
                .setDescription("Use Urban Dictionary to define")
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName("input")
                        .setDescription("What word do you want to trust Urban Dictionary with?")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        );

    async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        // Must be from a slash command (should always be anyway)
        if (!interaction.isChatInputCommand()) return;



        const engine = interaction.options.getSubcommand(true);

        switch (engine) {
            case "urban-dictionary": {
                const input = interaction.options.getString("input", true);
                const urbanDef = await urbanDictionary.define(input);

                if (!urbanDef || !urbanDef.length) {
                    const errorEmb = new EmbedBuilder()
                        .setColor(config.colors.error)
                        .setTitle("Can't find your term")
                        .setDescription(trim("No results found for " + inlineCode(input), 4096))
                        .setAuthor({ name: "Urban Dictionary", url: "https://www.urbandictionary.com/", iconURL: "https://www.urbandictionary.com/apple-touch-icon.png" });

                    return interaction.reply({ embeds: [errorEmb], ephemeral: true });
                }

                const urbanChosen = urbanDef[0];
                let definition = `${urbanChosen.definition}\n\n*${urbanChosen.example.replaceAll("*", "\\*")}*`;

                const linkRegex = /\[([\S\s][^\]]*)\]/g;
                definition = definition.replace(linkRegex, (_match, term) => {
                    const encodedTerm = encodeURIComponent(term);
                    return `[${term}](https://www.urbandictionary.com/define.php?term=${encodedTerm})`;
                });

                const embed = new EmbedBuilder()
                    .setAuthor({ name: "Urban Dictionary", url: "https://www.urbandictionary.com/", iconURL: "https://www.urbandictionary.com/apple-touch-icon.png" })
                    .setTitle("Urban Dictionary result for " + inlineCode(trim(urbanChosen.word, 15)))
                    .setColor(config.colors.ok)
                    .setURL(urbanChosen.permalink)
                    .setDescription(trim(definition, 4096))
                    .addFields([{ name: "Stats", value: `\`👍${urbanChosen.thumbs_up}\` \`👎${urbanChosen.thumbs_down}\`` }])
                    .setTimestamp(urbanChosen.written_on)
                    .setFooter({ text: "Defined by: " + urbanChosen.author });

                return interaction.reply({ embeds: [embed] });
            }

        }
    }

    async handleAutoComplete(interaction: AutocompleteInteraction) {
        switch (interaction.options.getSubcommand()) {
            case "urban-dictionary": {
                const input = interaction.options.getString("input", true);
                if (!input.length) return interaction.respond([]);

                const complete = await urbanDictionary.autoComplete(input);
                if (!complete || !complete.length) return interaction.respond([]);

                const wordList = complete.map((word: string) => ({ name: word, value: word }));

                if ((wordList[0].name.toLowerCase() !== input.toLowerCase())) {
                    wordList.unshift({ name: input, value: input });
                }

                interaction.respond(wordList.slice(0, 25));
            }

        }
    }


}
