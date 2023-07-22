import config from "#config.mjs";
import { ActionRowBuilder, ButtonBuilder, ContextMenuCommandBuilder, EmbedBuilder, MessageActionRowComponentBuilder, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import Command from "@riskybot/command";
import { inlineCode, italic } from "@discordjs/formatters";
import { ApplicationCommandInteraction, AttachmentBuilder } from "discord-api-parser";
import { trim } from "@riskybot/tools";
import { ApplicationCommandType, ButtonStyle } from "discord-api-types/v10";
import { smallApis } from "@riskybot/apis";


export default class Tools extends Command {
    name = "tools";
    description = "🛠️ Use the bot to something cool";

    command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
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
        ).addSubcommand(
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

    messageCommandName = "View source";
    messageCommand = new ContextMenuCommandBuilder()
        .setName(this.messageCommandName)
        .setType(ApplicationCommandType.Message);


    async handleApplicationCommand(interaction: ApplicationCommandInteraction) {

        const type = interaction.isChatInputCommand()
            ? interaction.options.getSubcommand(true)
            : interaction.isMessageCommand()
                ? interaction.commandName
                : null;

        if (!type) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("Unknown command type")
                .setDescription("This command can only be used as a slash command or a message command");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        switch (type) {
            case "rhymes": {

                // slash command
                if (!interaction.isChatInputCommand()) return;

                const word = interaction.options.getString("word", true);
                const rhymes = await smallApis.getRhymes(word);

                if (!rhymes.length) {
                    const embed = new EmbedBuilder()
                        .setColor(config.colors.error)
                        .setTitle("No rhymes found")
                        .setDescription(`No rhymes were found for ${inlineCode(word)}`);

                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const list = rhymes.map((rhyme, index) => `${index + 1}: ${rhyme}`);

                const embed = new EmbedBuilder()
                    .setAuthor({ name: "Rhyme Brain", url: "https://rhymebrain.com/en" })
                    .setURL(`https://rhymebrain.com/en/What_rhymes_with_${word}.html`)
                    .setTitle("Words that rhyme with " + inlineCode(trim(word, 15)))
                    .setDescription(list.join("\n"));

                return interaction.reply({ embeds: [embed] });
            }

            case "8ball": {

                // slash command
                if (!interaction.isChatInputCommand()) return;

                const question = interaction.options.getString("question", true);
                const response = ballResponses[Math.floor(Math.random() * ballResponses.length)];

                const embed = new EmbedBuilder()
                    .setTitle("🎱 Magic 8 Ball")
                    .setColor(config.colors.ok)
                    .setDescription(`${italic("Q:" + question)}\nA:${response}`);

                return interaction.reply({ embeds: [embed] });
            }

            case "choose": {

                // slash command
                if (!interaction.isChatInputCommand()) return;

                const choices = interaction.options.getString("choices", true)
                    .split(",")
                    .map(choice => choice.trim());

                const choice = choices[Math.floor(Math.random() * choices.length)];

                const embed = new EmbedBuilder()
                    .setTitle("🎲 Random Choice")
                    .setColor(config.colors.ok)
                    .setDescription(`I choose... ${italic(choice)}`);

                return interaction.reply({ embeds: [embed] });

            }

            case "View source": {
                if (!interaction.isMessageCommand()) return;

                const data = Buffer.from(JSON.stringify(interaction.targetMessage, null, 2));

                const attachment = new AttachmentBuilder(data, "message.json");

                const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel("Jump to message")
                            .setURL(`https://discord.com/channels/${interaction.guildId}/${interaction.targetMessage.channel_id}/${interaction.targetMessage.id}`)
                    );


                return interaction.reply({ attachments: [attachment], components: [actionRow] });
            }
        }

        return interaction.reply({content: "Unknown command type", ephemeral: true});
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


