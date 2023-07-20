import config from "#config.mjs";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, MessageActionRowComponentBuilder, SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { reddit } from "@riskybot/apis";
import Command from "@riskybot/command";
import { hyperlink, inlineCode, italic } from "@discordjs/formatters";
import { ApplicationCommandInteraction, AutocompleteInteraction } from "discord-api-parser";
import { fetch } from "undici";
import { trim } from "@riskybot/tools";
import { autoComplete as redditAutocomplete } from "./_reddit.mjs";
import { ButtonStyle } from "discord-api-types/v10";


export default class Random extends Command {
    name = "random";
    description = "Produces random results";

    command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("number")
                .setDescription("A random number")
                .addNumberOption(
                    new SlashCommandNumberOption()
                        .setName("min")
                        .setDescription("The min the random number can go")
                ).addNumberOption(
                    new SlashCommandNumberOption()
                        .setName("max")
                        .setDescription("The max the random number can go")
                )
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("cat")
                .setDescription("🐱 A random cat image")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("dog")
                .setDescription("🐶 A random dog image")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("dad-joke")
                .setDescription("🤣 A random dad joke")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("bird")
                .setDescription("🐦 A random bird image")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("duck")
                .setDescription("🦆 A random duck image")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("quote")
                .setDescription("🗨️ A random quote")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("affirmation")
                .setDescription("A random affirmation")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("insult")
                .setDescription("😢 A random insult")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("fact")
                .setDescription("A random fact")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("emoji")
                .setDescription("A random emoji")
        ).addSubcommandGroup(
            new SlashCommandSubcommandGroupBuilder()
                .setName("reddit")
                .setDescription("Use Reddit to ...")
                .addSubcommand(
                    new SlashCommandSubcommandBuilder()
                        .setName("post")
                        .setDescription("Uses Reddit and your selected subreddit")
                        .addStringOption(
                            new SlashCommandStringOption()
                                .setName("subreddit")
                                .setDescription("The subreddit to get a random post from")
                                .setRequired(true)
                                .setAutocomplete(true)
                        )
                )
        );

    async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        // Must be from a slash command (should always be anyway)
        if (!interaction.isChatInputCommand()) return;

        const type = interaction.options.getSubcommand(true);

        switch (type) {
            case "cat": {
                const cat = await (await fetch("http://aws.random.cat/meow")).json() as { file: string };

                const embed = new EmbedBuilder()
                    .setTitle("🐱 Cat")
                    .setURL("https://random.cat/view")
                    .setFooter({ text: "Powered by https://aws.random.cat" })
                    .setColor(config.colors.washedOut.ok)
                    .setImage(cat.file);

                return interaction.reply({ content: "Here is your random cat", embeds: [embed], ephemeral: true });
            }

            case "dog": {
                const dog = await (await fetch("https://dog.ceo/api/breeds/image/random")).json() as { message: string };

                const embed = new EmbedBuilder()
                    .setTitle("🐶 Dog")
                    .setURL("https://dog.ceo/")
                    .setFooter({ text: "Powered by https://dog.ceo" })
                    .setColor(config.colors.ok)
                    .setImage(dog.message);

                return interaction.reply({ content: "Here is your random dog", embeds: [embed] });
            }

            case "dadjoke":
            case "dad-joke": {
                const joke = await (await fetch("https://icanhazdadjoke.com", { headers: { Accept: "application/json" } })).json() as { id: string, joke: string };

                const embed = new EmbedBuilder()
                    .setTitle("🤣 Dad Joke")
                    .setURL("https://icanhazdadjoke.com/j/" + joke.id)
                    .setFooter({ text: "Powered by https://icanhazdadjoke.com" })
                    .setColor(config.colors.ok)
                    .setDescription(joke.joke);

                return interaction.reply({ content: "Here is your random dad joke", embeds: [embed] });
            }
            case "quote": {
                const quote = await (await fetch("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json")).json() as { quoteText: string, quoteAuthor: string, quoteLink: string };

                const embed = new EmbedBuilder()
                    .setTitle("Quote")
                    .setURL(quote.quoteLink)
                    .setFooter({ text: "Powered by https://forismatic.com/en" })
                    .setColor(config.colors.ok)
                    .setDescription(`"${italic(quote.quoteText)}" (${quote.quoteAuthor})`);

                return interaction.reply({ content: "Here is your random quote", embeds: [embed] });
            }

            case "affirmation": {
                const affirmation = await (await fetch("https://www.affirmations.dev")).json() as { affirmation: string };

                const embed = new EmbedBuilder()
                    .setTitle("Affirmation")
                    .setURL("https://www.affirmations.dev")
                    .setFooter({ text: "Powered by https://www.affirmations.dev" })
                    .setColor(config.colors.ok)
                    .setDescription(affirmation.affirmation);

                return interaction.reply({ content: "Here is your random affirmation", embeds: [embed] });
            }

            case "insult": {
                const insult = await (await fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json")).json() as { insult: string };

                const embed = new EmbedBuilder()
                    .setTitle("Insult")
                    .setURL("https://evilinsult.com")
                    .setFooter({ text: "Powered by https://evilinsult.com" })
                    .setColor(config.colors.ok)
                    .setDescription(insult.insult);

                return interaction.reply({ content: "Here is your random insult", embeds: [embed] });
            }

            case "fact": {
                const fact = await (await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en")).json() as { text: string, permalink: string };

                const embed = new EmbedBuilder()
                    .setTitle("Fact")
                    .setURL(fact.permalink)
                    .setColor(config.colors.ok)
                    .setDescription(fact.text)
                    .setFooter({ text: "Powered by https://uselessfacts.jsph.pl" });

                return interaction.reply({ content: "Here is your random fact", embeds: [embed] });
            }

            case "bird": {
                const bird = await (await fetch("https://shibe.online/api/birds?count=1")).json() as string[];

                const embed = new EmbedBuilder()
                    .setTitle("🐦 Bird")
                    .setURL("https://shibe.online/")
                    .setFooter({ text: "Powered by https://shibe.online" })
                    .setColor(config.colors.ok)
                    .setImage(bird[0]);

                return interaction.reply({ content: "Here is your random bird", embeds: [embed] });
            }

            case "duck": {
                const duck = await (await fetch("https://random-d.uk/api/v2/quack")).json() as { url: string };

                const embed = new EmbedBuilder()
                    .setTitle("🦆 Duck")
                    .setURL("https://random-d.uk/")
                    .setFooter({ text: "Powered by https://random-d.uk" })
                    .setColor(config.colors.ok)
                    .setImage(duck.url);

                return interaction.reply({ content: "Here is your random duck", embeds: [embed] });
            }


            case "number": {
                const min = interaction.options.getInteger("min") ?? 0;
                const max = interaction.options.getInteger("max") ?? 100;
                const result = Math.floor(Math.random() * (max - min) + min).toLocaleString();

                const embed = new EmbedBuilder()
                    .setTitle(`Random number between \`${min}\` and \`${max}\``)
                    .setColor(config.colors.ok)
                    .setDescription(result);

                return interaction.reply({ embeds: [embed] });
            }

            case "randomPost":
            case "post": {
                const subreddit = interaction.options.getString("subreddit", true)
                    .replace("r/", "");

                const redditPost = await reddit.randomPostInSubreddit(subreddit);

                // let nsfwTimes = 0;

                // while (redditPost?.over_18 && 5 > nsfwTimes) {
                //     nsfwTimes++;
                //     console.info("NSFW post found, retrying...");
                //     redditPost = await reddit.randomPostInSubreddit(subreddit);
                // }

                if (!redditPost || redditPost?.over_18) {
                    const errorEmb = new EmbedBuilder()
                        .setAuthor({ name: "Reddit", url: "https://www.reddit.com/", iconURL: "https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png" })
                        .setTitle("Can't any posts")
                        .setColor(config.colors.error);

                    if (redditPost === null) {
                        errorEmb.setDescription(trim("No results found for subreddit " + inlineCode("r/" + subreddit), 4096));
                    }

                    else if (redditPost?.over_18) {
                        errorEmb.setDescription(trim("The only results for subreddit " + inlineCode("r/" + subreddit) + " were NSFW", 4096));
                        console.info("NSFW post found ;(");
                    }

                    return interaction.reply({ embeds: [errorEmb], ephemeral: true });
                }

                const url = "https://redd.it/" + redditPost.id;

                const embed = new EmbedBuilder()
                    .setAuthor({ name: "Reddit post in " + trim(redditPost.subreddit_name_prefixed, 15), url: "https://www.reddit.com/" + redditPost.subreddit_name_prefixed, iconURL: "https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png" })
                    .setURL(url)
                    .setTitle(trim(redditPost.title, 256))
                    .setColor(config.colors.ok)
                    .setTimestamp(redditPost.created_utc * 1000)
                    .setFooter({ text: "Posted by: " + redditPost.author })
                    .addFields([{ name: "Stats", value: `\`👍${redditPost.ups}\` \`👎${redditPost.downs}\` \`💬${redditPost.num_comments}\`` }]);

                const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel("Comments")
                            .setURL(url)
                    );

                if (redditPost.selftext) embed.setDescription(trim(redditPost.selftext, 1024));

                // Image
                if (/\.(jpe?g|png|tiff?|(webp)!|bmp|gifv?)(\?.*)?$/i.test(redditPost?.url)) {
                    embed.setImage(redditPost.url);
                }

                // Imgur image
                else if (/(?<!i\.)imgur\.com\//i.test(redditPost?.url)) {
                    embed.setImage(redditPost.url + ".gif");
                }
                // Comments link - do nothing
                else if (/reddit\.com\/r\/[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\/comments\//i.test(redditPost?.url)) {
                    // searEmb.setDescription(tools.trim(searEmb.description + "\n\n*Click on the link to view comments:*\n" + redditPost.url, 1024))
                }

                // Video link
                else if (redditPost?.domain === "v.redd.it" || redditPost?.is_video) {
                    embed.setDescription(trim(embed.data.description + hyperlink("\n\nView Video", redditPost.url), 1024));
                }

                // Gallery
                else if (/reddit\.com\/gallery\//i.test(redditPost?.url)) {
                    embed.setDescription(trim(embed.data.description + hyperlink("\n\nView Gallery", redditPost.url), 1024));
                }

                // Else
                else {
                    embed.setDescription(trim(embed.data.description + "\n\n*Click on the link to view embedded link:*\nhttps://reddit.com/" + redditPost.url, 1024));
                }

                return interaction.reply({ embeds: [embed], components: [actionRow] });

            }

        }
    }

    async handleAutoComplete(interaction: AutocompleteInteraction) {
        switch (interaction.options.getSubcommand()) {
            case "post": {
                const input = interaction.options.getString("subreddit", true);
                return interaction.respond(await redditAutocomplete(input));
            }

        }
    }

}
