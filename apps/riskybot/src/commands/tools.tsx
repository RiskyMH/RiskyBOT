// @jsxImportSource @riskybot/builders
import config from "#config.ts";
import Command from "@riskybot/command";
import { AttachmentBuilder, type ApplicationCommandInteraction } from "discord-api-parser";
import { trim, inlineCode, italic } from "@riskybot/tools";
import { smallApis } from "@riskybot/apis";
import { ApplicationCommand, Embed, ActionRow, Button, StringOption, EmbedAuthor} from "@lilybird/jsx";
import { ApplicationCommandType, ButtonStyle } from "lilybird";


export default class Tools extends Command {
    override name = "tools";
    override description = "🛠️ Use the bot to something cool";

    override command = (
        <ApplicationCommand name={this.name} description={this.description}>
            <ApplicationCommand name="choose" description="Use the bot to choose an option">
                <StringOption
                    name="choices"
                    description="The list to choose from (separated by ',')"
                    required
                />
            </ApplicationCommand>
            <ApplicationCommand name="8ball" description="🎱 Ask the Magic 8 Ball a question!">
                <StringOption
                    name="question"
                    description="Your question"
                    required
                />
            </ApplicationCommand>
            <ApplicationCommand name="rhymes" description="Find words that rhyme with a provided word">
                <StringOption
                    name="word"
                    description="The word to find rhymes for"
                    required
                />
            </ApplicationCommand>
        </ApplicationCommand>
    );

    override aliases = ["View source"];
    override messageCommand = {
        name: "View source",
        type: ApplicationCommandType.MESSAGE,
    };

    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {

        const type = interaction.isChatInputCommand()
            ? interaction.options.getSubcommand(true)
            : interaction.isMessageCommand()
                ? interaction.commandName
                : null;

        if (!type) {
            const embed = (
                <Embed
                    color={config.colors.error}
                    title="Unknown command type"
                    description="This command can only be used as a slash command or a message command"
                />
            );

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        switch (type) {
            case "rhymes": {

                // slash command
                if (!interaction.isChatInputCommand()) return;

                const word = interaction.options.getString("word", true);
                const rhymes = await smallApis.getRhymes(word);

                if (rhymes.length === 0) {
                    const embed = (
                        <Embed
                            color={config.colors.error}
                            title="No rhymes found"
                            description={`No rhymes were found for ${inlineCode(word)}`}
                        />
                    );

                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const list = rhymes.map((rhyme, index) => `${index + 1}: ${rhyme.word}`);

                const embed = (
                    <Embed
                        color={config.colors.ok}
                        title={"Words that rhyme with " + inlineCode(trim(word, 15))}
                        url={`https://rhymebrain.com/en/What_rhymes_with_${word}.html`}
                        description={list.join("\n")}
                    >
                        <EmbedAuthor name="Rhyme Brain" url="https://rhymebrain.com/en" />
                    </Embed>
                );

                return interaction.reply({ embeds: [embed] });
            }

            case "8ball": {

                // slash command
                if (!interaction.isChatInputCommand()) return;

                const question = interaction.options.getString("question", true);
                const response = ballResponses[Math.floor(Math.random() * ballResponses.length)];

                const embed = (
                    <Embed
                        title="🎱 Magic 8 Ball"
                        color={config.colors.ok}
                        description={`${italic("Q:" + question)}\nA:${response}`}
                    />
                );

                return interaction.reply({ embeds: [embed] });
            }

            case "choose": {

                // slash command
                if (!interaction.isChatInputCommand()) return;

                const choices = interaction.options.getString("choices", true)
                    .split(",")
                    .map(choice => choice.trim());

                const choice = choices[Math.floor(Math.random() * choices.length)];

                const embed = (
                    <Embed
                        title="🎲 Random Choice"
                        color={config.colors.ok}
                        description={`I choose... ${italic(choice)}`}
                    />
                );

                return interaction.reply({ embeds: [embed] });

            }

            case "View source": {
                if (!interaction.isMessageCommand()) return;

                const data = Buffer.from(JSON.stringify(interaction.targetMessage, null, 2));

                const attachment = new AttachmentBuilder(data, "message.json");

                const actionRow = (
                    <ActionRow>
                        <Button
                            style={ButtonStyle.Link}
                            label="Jump to message"
                            url={`https://discord.com/channels/${interaction.guildId}/${interaction.targetMessage.channel_id}/${interaction.targetMessage.id}`}
                        />
                    </ActionRow>
                );

                return interaction.reply({ attachments: [attachment], components: [actionRow] });
            }
        }

        return interaction.reply({ content: "Unknown command type", ephemeral: true });
    }
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


