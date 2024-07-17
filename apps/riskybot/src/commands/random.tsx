// @jsxImportSource @riskybot/builders
import config from "#config.ts";
import { reddit, smallApis } from "@riskybot/apis";
import Command from "@riskybot/command";
import type { ApplicationCommandInteraction, AutocompleteInteraction } from "discord-api-parser";
import { trim, hyperlink, inlineCode, italic } from "@riskybot/tools";
import { autoComplete as redditAutocomplete } from "./_reddit.ts";
import { ApplicationCommand, Embed, ActionRow, Button, EmbedFooter, SubCommandGroupOption, SubCommandOption, EmbedImage, NumberOption, StringOption, EmbedAuthor, EmbedField } from "@lilybird/jsx";
import { ButtonStyle } from "lilybird";


export default class Random extends Command {
    override name = "random";
    override description = "Produces random results";

    override command = (
        <ApplicationCommand name={this.name} description={this.description}>

            <SubCommandOption name="number" description="A random number">
                <NumberOption
                    name="min"
                    description="The min the random number can go"
                />
                <NumberOption
                    name="max"
                    description="The max the random number can go"
                />
            </SubCommandOption>

            <SubCommandOption name="cat" description="🐱 A random cat image" children={[]} />
            <SubCommandOption name="dog" description="🐶 A random dog image" children={[]} />
            <SubCommandOption name="dad-joke" description="🤣 A random dad joke" children={[]} />
            <SubCommandOption name="bird" description="🐦 A random bird image" children={[]} />
            <SubCommandOption name="duck" description="🦆 A random duck image" children={[]} />
            <SubCommandOption name="quote" description="🗨️ A random quote" children={[]} />
            <SubCommandOption name="affirmation" description="A random affirmation" children={[]} />
            <SubCommandOption name="insult" description="😢 A random insult" children={[]} />
            <SubCommandOption name="fact" description="A random fact" children={[]} />
            <SubCommandOption name="emoji" description="A random emoji" children={[]} />

            <SubCommandGroupOption name="reddit" description="Use Reddit to ...">
                <SubCommandOption
                    name="post"
                    description="Uses Reddit and your selected subreddit"
                >
                    <StringOption
                        name="subreddit"
                        description="The subreddit to get a random post from"
                        required
                        autocomplete
                    />
                </SubCommandOption>
            </SubCommandGroupOption>

        </ApplicationCommand>
    );

    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        // Must be from a slash command (should always be anyway)
        if (!interaction.isChatInputCommand()) return;

        const type = interaction.options.getSubcommand(true);

        switch (type) {
            case "cat": {
                const cat = await smallApis.randomCat();

                const embed = (
                    <Embed title="🐱 Cat" url="https://thecatapi.com" color={config.colors.ok}>
                        <EmbedFooter text="Powered by https://thecatapi.com" />
                        <EmbedImage url={cat.url} />
                    </Embed>
                );

                return interaction.reply({ content: "Here is your random cat", embeds: [embed] });
            }

            case "dog": {
                const dog = await smallApis.randomDog();

                const embed = (
                    <Embed title="🐶 Dog" url="https://dog.ceo/" color={config.colors.ok}>
                        <EmbedFooter text="Powered by https://dog.ceo" />
                        <EmbedImage url={dog.message} />
                    </Embed>
                );

                return interaction.reply({ content: "Here is your random dog", embeds: [embed] });
            }

            case "dadjoke":
            case "dad-joke": {
                const joke = await smallApis.randomDadJoke();

                const embed = (
                    <Embed title="🤣 Dad Joke" url={"https://icanhazdadjoke.com/j/" + joke.id} color={config.colors.ok} description={joke.joke}>
                        <EmbedFooter text="Powered by https://icanhazdadjoke.com" />
                    </Embed>
                );

                return interaction.reply({ content: "Here is your random dad joke", embeds: [embed] });
            }

            case "quote": {
                const quote = await smallApis.randomQuote();

                const embed = (
                    <Embed title="Quote" url={quote.quoteLink} color={config.colors.ok} description={`"${italic(quote.quoteText)}" (${quote.quoteAuthor})`}>
                        <EmbedFooter text="Powered by https://forismatic.com/en" />
                    </Embed>
                );

                return interaction.reply({ content: "Here is your random quote", embeds: [embed] });
            }

            case "affirmation": {
                const affirmation = await smallApis.randomAffirmation();

                const embed = (
                    <Embed title="Affirmation" url="https://affirmations.dev" color={config.colors.ok} description={affirmation.affirmation}>
                        <EmbedFooter text="Powered by https://affirmations.dev" />
                    </Embed>
                );

                return interaction.reply({ content: "Here is your random affirmation", embeds: [embed] });
            }

            case "insult": {
                const insult = await smallApis.randomInsult();

                const embed = (
                    <Embed title="Insult" url="https://evilinsult.com" color={config.colors.ok} description={insult.insult}>
                        <EmbedFooter text="Powered by https://evilinsult.com" />
                    </Embed>
                );

                return interaction.reply({ content: "Here is your random insult", embeds: [embed] });
            }

            case "fact": {
                const fact = await smallApis.randomFact();

                const embed = (
                    <Embed title="Fact" url={fact.permalink} color={config.colors.ok} description={fact.text}>
                        <EmbedFooter text="Powered by https://uselessfacts.jsph.pl" />
                    </Embed>
                );

                return interaction.reply({ content: "Here is your random fact", embeds: [embed] });
            }

            case "bird": {
                const bird = await smallApis.randomBird();

                const embed = (
                    <Embed title="🐦 Bird" url="https://shibe.online/" color={config.colors.ok}>
                        <EmbedFooter text="Powered by https://shibe.online" />
                        <EmbedImage url={bird} />
                    </Embed>
                );

                return interaction.reply({ content: "Here is your random bird", embeds: [embed] });
            }

            case "duck": {
                const duck = await smallApis.randomDuck();

                const embed = (
                    <Embed title="🦆 Duck" url="https://random-d.uk/" color={config.colors.ok}>
                        <EmbedFooter text="Powered by https://random-d.uk" />
                        <EmbedImage url={duck.url} />
                    </Embed>
                );

                return interaction.reply({ content: "Here is your random duck", embeds: [embed] });
            }


            case "number": {
                const min = interaction.options.getInteger("min") ?? 0;
                const max = interaction.options.getInteger("max") ?? 100;
                const result = Math.floor(Math.random() * (max - min) + min).toLocaleString();

                const embed = (
                    <Embed
                        title={`Random number between \`${min}\` and \`${max}\``}
                        color={config.colors.ok}
                        description={result}
                    />
                );

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
                    if (redditPost?.over_18) console.info("NSFW post found ;(");

                    const errorEmb = (
                        <Embed
                            title="Can't find any posts"
                            color={config.colors.error}
                            description={
                                redditPost === null
                                    ? `No results found for subreddit ${inlineCode("r/" + subreddit)}`
                                    : `The only results for subreddit ${inlineCode("r/" + subreddit)} were NSFW`
                            }
                        >
                            <EmbedAuthor name="Reddit" url="https://www.reddit.com/" icon_url="https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png" />
                        </Embed>
                    );

                    return interaction.reply({ embeds: [errorEmb], ephemeral: true });
                }

                const url = "https://redd.it/" + redditPost.id;

                let imageURL = null as string | null;
                let description = null as string | null;

                if (redditPost.selftext) description = trim(redditPost.selftext, 1024);

                // Image
                if (/\.(jpe?g|png|tiff?|(webp)!|bmp|gifv?)(\?.*)?$/i.test(redditPost?.url)) {
                    imageURL = redditPost.url;
                }

                // Imgur image
                else if (/(?<!i\.)imgur\.com\//i.test(redditPost?.url)) {
                    imageURL = redditPost.url + ".gif";
                }
                // Comments link - do nothing
                else if (/reddit\.com\/r\/[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\/comments\//i.test(redditPost?.url)) {
                    // searEmb.setDescription(tools.trim(searEmb.description + "\n\n*Click on the link to view comments:*\n" + redditPost.url, 1024))
                }

                // Video link
                else if (redditPost?.domain === "v.redd.it" || redditPost?.is_video) {
                    description = trim(description + hyperlink("\n\nView Video", redditPost.url), 1024);
                }

                // Gallery
                else if (/reddit\.com\/gallery\//i.test(redditPost?.url)) {
                    description = trim(description + hyperlink("\n\nView Gallery", redditPost.url), 1024);
                }

                // Else
                else {
                    description = trim(description + "\n\n*Click on the link to view embedded link:*\nhttps://reddit.com/" + redditPost.url, 1024);
                }


                const embed = (
                    <Embed
                        title={trim(redditPost.title, 256)}
                        color={config.colors.ok}
                        timestamp={redditPost.created_utc * 1000}
                        url={url}
                        description={description || undefined}
                    >
                        <EmbedAuthor
                            name={"Reddit post in " + trim(redditPost.subreddit_name_prefixed, 15)}
                            url={"https://www.reddit.com/" + redditPost.subreddit_name_prefixed}
                            icon_url="https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png"
                        />

                        <EmbedFooter text={"Posted by: " + redditPost.author} />
                        <EmbedField name="Stats" value={`\`👍${redditPost.ups}\` \`👎${redditPost.downs}\` \`💬${redditPost.num_comments}\``} />

                        {imageURL && <EmbedImage url={imageURL} />}
                    </Embed>
                );

                const actionRow = (
                    <ActionRow>
                        <Button label="Comments" url={url} style={ButtonStyle.Link} />
                    </ActionRow>
                );

                return interaction.reply({ embeds: [embed], components: [actionRow] });

            }

        }
    }

    override async handleAutoComplete(interaction: AutocompleteInteraction) {
        switch (interaction.options.getSubcommand()) {
            case "post": {
                const input = interaction.options.getString("subreddit", true);
                return interaction.respond(await redditAutocomplete(input));
            }

        }
    }

}
