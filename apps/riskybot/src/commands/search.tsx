// @jsxImportSource @riskybot/builders
import config from "#config.ts";
import { urbanDictionary } from "@riskybot/apis";
import Command from "@riskybot/command";
import { trim } from "@riskybot/tools";
import type { ApplicationCommandInteraction, AutocompleteInteraction } from "discord-api-parser";
import { ApplicationCommand, StringOption, Embed, EmbedFooter, EmbedAuthor, EmbedField } from "@lilybird/jsx";


export default class Search extends Command {
    override name = "search";
    override description = "🔍 Use the bot to search from sources";

    override command = (
        <ApplicationCommand name={this.name} description={this.description}>
            <ApplicationCommand name="urban-dictionary" description="Use Urban Dictionary to define">
                <StringOption
                    name="input"
                    description="What word do you want to trust Urban Dictionary with?"
                    required
                    autocomplete
                />
            </ApplicationCommand>
        </ApplicationCommand>
    );


    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        // Must be from a slash command (should always be anyway)
        if (!interaction.isChatInputCommand()) return;

        const engine = interaction.options.getSubcommand(true);

        switch (engine) {
            case "urban-dictionary": {
                const input = interaction.options.getString("input", true);
                const urbanDef = await urbanDictionary.define(input);

                if (!urbanDef || urbanDef.length === 0) {
                    const errorEmb = (
                        <Embed
                            color={config.colors.error}
                            title="Can't find your term"
                            description={`No results found for ${input}`}
                        >
                            <EmbedAuthor name="Urban Dictionary" url="https://www.urbandictionary.com/" icon_url="https://www.urbandictionary.com/apple-touch-icon.png" />
                        </Embed>
                    );

                    return interaction.reply({ embeds: [errorEmb], ephemeral: true });
                }

                const urbanChosen = urbanDef[0];
                let definition = `${urbanChosen.definition}\n\n*${urbanChosen.example.replaceAll("*", "\\*")}*`;

                const linkRegex = /\[([\S\s][^\]]*)\]/g;
                definition = definition.replaceAll(linkRegex, (_match, term) => {
                    const encodedTerm = encodeURIComponent(term);
                    return `[${term}](https://www.urbandictionary.com/define.php?term=${encodedTerm})`;
                });

                const embed = (
                    <Embed
                        color={config.colors.ok}
                        title={"Urban Dictionary result for " + trim(urbanChosen.word, 15)}
                        url={urbanChosen.permalink}
                        description={trim(definition, 4096)}
                        timestamp={urbanChosen.written_on}
                    >
                        <EmbedAuthor name="Urban Dictionary" url="https://www.urbandictionary.com/" icon_url="https://www.urbandictionary.com/apple-touch-icon.png" />
                        <EmbedFooter text={"Defined by: " + urbanChosen.author} />
                        <EmbedField name="Stats" value={`👍${urbanChosen.thumbs_up} 👎${urbanChosen.thumbs_down}`} />
                    </Embed>
                );

                return interaction.reply({ embeds: [embed] });
            }

        }
    }

    override async handleAutoComplete(interaction: AutocompleteInteraction) {
        switch (interaction.options.getSubcommand()) {
            case "urban-dictionary": {
                const input = interaction.options.getString("input", true);
                if (input.length === 0) return interaction.respond([]);

                const complete = await urbanDictionary.autoComplete(input);
                if (!complete || complete.length === 0) return interaction.respond([]);

                const wordList = complete.map(word => ({ name: trim(word, 100), value: word.slice(0, 100) }));

                if ((wordList[0].name.toLowerCase() !== input.toLowerCase())) {
                    wordList.unshift({ name: input, value: input });
                }

                interaction.respond(wordList.slice(0, 25));
            }

        }
    }


}
