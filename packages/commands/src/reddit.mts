import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { hyperlink, inlineCode, time } from "@discordjs/formatters";
import { reddit } from "@riskybot/apis";
import * as tools from "@riskybot/tools";
import { Config, EnvEnabled, trim } from "@riskybot/tools";
import { ButtonStyle } from "discord-api-types/v10";
import { fetch } from "undici";

const redditBaseURL = "https://reddit.com/";


//TODO: Make sure everything works...   
//TODO: Migrate the fetch into `@riskybot/apis`


export default async function search(config: Config, subEngine: string, input: string, userId?: string) {
    const searEmb = new EmbedBuilder().setTitle("Fun").setColor(config.getColors().ok);
    const errorEmb = new EmbedBuilder().setTitle("Errors - search").setColor(config.getColors().error);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder()
            .setLabel("Another?")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false),

        new ButtonBuilder().setLabel("Link").setStyle(ButtonStyle.Link).setDisabled(false)
    ]);

    switch (subEngine) {
        case "post": {
            // const redditPostList = await fetch(redditBaseURL + "r/" + (encodeURIComponent(input.replace("r/", ""))) + "/random.json?" + new URLSearchParams({ sort: "top", t: "daily", limit: "500", include_over_18: "false" })).then((response) => response.json()).then((e: any) => e[0]);
            let redditPost = await reddit.randomPostInSubreddit(input.replace("r/", ""));

            let nsfwTimes = 0;

            while (redditPost?.over_18 && 5 > nsfwTimes) {
                nsfwTimes++;
                redditPost = await reddit.randomPostInSubreddit(input.replace("r/", ""));
            }

            if (redditPost && !redditPost?.over_18) {

                searEmb
                    .setAuthor({ name: "Reddit post in " + tools.trim(redditPost.subreddit_name_prefixed, 15), url: "https://www.reddit.com/" + redditPost.subreddit_name_prefixed, iconURL: "https://www.reddit.com/favicon.ico" })
                    .setURL(redditBaseURL.slice(0, -1) + redditPost.permalink)
                    .setTimestamp(redditPost.created_utc * 1000)
                    .setFooter({ text: "Posted by: " + redditPost.author })
                    .setTitle(redditPost.title);

                row.components[0].setCustomId(`random-again-randomPost-reddit-(${redditPost.subreddit})${userId ? "-" + userId : ""}`);
                row.components[1].setURL(redditBaseURL.slice(0, -1) + await redditPost.permalink);
                searEmb.addFields([{ name: "Stats", value: `\`👍${redditPost.ups}\` \`👎${redditPost.downs}\` \`💬${redditPost.num_comments}\`` }]);

                if (redditPost.selftext) searEmb.setDescription(tools.trim(redditPost.selftext, 1024));

                // Image
                if (/\.(jpe?g|png|tiff?|(webp)!|bmp|gifv?)(\?.*)?$/i.test(redditPost?.url)) searEmb.setImage(redditPost.url);
                // Imgur image
                else if (/(?<!i\.)imgur\.com\//i.test(redditPost?.url)) searEmb.setImage(redditPost.url + ".gif");
                // Commands link - don't show
                else if (/reddit\.com\/r\/[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\/comments\//i.test(redditPost?.url)) break; // searEmb.setDescription(tools.trim(searEmb.description + "\n\n*Click on the link to view comments:*\n" + redditPost.url, 1024))
                // Video link
                else if (redditPost?.domain === "v.redd.it" || redditPost?.is_video) searEmb.setDescription(tools.trim(searEmb.data.description + hyperlink("\n\nView Video", redditPost.url), 1024));
                // else if (redditPost ?.domain === "v.redd.it"|| redditPost?.is_video) searEmb.setDescription(tools.trim(searEmb.description + "\n\n*Click on the link to view embedded video:*\n"+redditPost.url, 1024))
                // Gallery
                else if (/reddit\.com\/gallery\//i.test(redditPost?.url)) searEmb.setDescription(tools.trim(searEmb.data.description + hyperlink("\n\nView Gallery", redditPost.url), 1024));
                // Else
                else searEmb.setDescription(tools.trim(searEmb.data.description + "\n\n*Click on the link to view embedded link:*\n" + redditBaseURL + redditPost.url, 1024));

            } else {
                if (redditPost === null) {
                    errorEmb.setTitle("Can't any posts")
                        .setDescription(trim("No results found for subreddit " + inlineCode("r/" + input), 4096))
                        .setAuthor({ name: "Reddit", url: "https://www.urbandictionary.com/", iconURL: "https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png" });
                }
                else if (redditPost === undefined) errorEmb.setTitle("We had an error").setDescription("An error occurred while using the [`Reddit`](https://reddit.com) API");
                else if (redditPost?.over_18) {
                    errorEmb.setTitle("Can't any posts")
                        .setDescription(trim("The only results for subreddit " + inlineCode("r/" + input) + " were NSFW", 4096))
                        .setAuthor({ name: "Reddit", url: "https://www.urbandictionary.com/", iconURL: "https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png" });
                }
                return { embeds: [errorEmb], ephemeral: true };
            }
        }
            break;

        case "subreddit": {
            const redditPostList: any = await fetch(redditBaseURL + "r/" + (encodeURIComponent(input.replace("r/", ""))) + "/about.json?" + new URLSearchParams()).then((response) => response.json());

            if (redditPostList && await redditPostList?.data?.name && (redditPostList.error != 404 || redditPostList.error != 403)) {
                const redditChosen = await redditPostList.data;

                searEmb
                    .setAuthor({ name: "Reddit", url: "https://www.reddit.com/", iconURL: "https://www.reddit.com/favicon.ico" })
                    .setURL(redditBaseURL.slice(0, -1) + await redditChosen.url)
                    .setTitle("About - " + inlineCode(tools.trim(await redditChosen.display_name_prefixed, 15)))
                    .addFields([{ name: "Title", value: tools.trim(await redditChosen.title, 1024) }])
                    .addFields([{ name: "Short description", value: tools.trim(await redditChosen.public_description || "*No description provided*", 1024) }])
                    .addFields([{ name: "Made", value: time(await redditChosen.created_utc) }]);
                row.components[0].setCustomId(`random-again-randomPost-reddit-(${input})${userId ? "-" + userId : ""}`).setLabel("Random post in subreddit").setStyle(ButtonStyle.Secondary);
                row.components[1].setURL(redditBaseURL.slice(0, -1) + await redditChosen.url);

                if (await redditChosen?.community_icon) searEmb.setThumbnail(await redditChosen.community_icon.split("?")[0]);
                if (await redditChosen?.icon_img) searEmb.setThumbnail(await redditChosen.icon_img);
                searEmb.addFields([{ name: "Stats", value: `\`🧑${redditChosen.subscribers.toLocaleString()}\`` }]);

            } else {
                errorEmb.setDescription("no findings :(");
                return { embeds: [errorEmb] };
            }
        }
            break;
    }
    return { embeds: [searEmb], components: [row] };
}


export async function autoComplete(subEngine: string, input: string) {

    switch (subEngine) {
        case "subreddit": {

            if (!input.length) {
                const urbanOpt: any = await fetch(redditBaseURL + "subreddits/popular.json?" + new URLSearchParams({ limit: "25" })).then((response) => response.json());

                const wordList = urbanOpt.data.children.map((word: any) => ({ name: word.data.display_name_prefixed, value: word.data.display_name })).slice(0, 25);

                return wordList;
            }

            const urbanOpt = await reddit.subredditAutoComplete(input, 25);
            if (urbanOpt === undefined) return;
            if (!urbanOpt) return [];

            const wordList = urbanOpt.filter((word: { name: string }) => !word.name.startsWith("u_")).map((word: { name: string }) => ({ name: word.name.includes("r/") ? word.name : "r/" + word.name, value: word.name }));


            return wordList.slice(0, 25);
        }
    }

}


export function applicationCommands(config?: Config, envEnabledList?: EnvEnabled) {
    // eslint-disable-next-line no-unused-expressions
    config; envEnabledList; // Just so it is used

    // Some of the commands that use this file (reddit.mts) are in about.mts, random.mts
    if (config?.apiEnabled.reddit) {
        const searchSlashCommand = new SlashCommandBuilder()
            .setName("meme")
            .setDescription("🤣 Uses Reddit and r/dankmemes (or another option) to give you a random meme")
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("other-subreddit")
                    .setDescription("Another few meme options")
                    .setRequired(false)
                    .setChoices(
                        { name: "r/dankmemes", value: "dankmemes" },
                        { name: "r/memes", value: "memes" },
                        { name: "r/PrequelMemes", value: "PrequelMemes" },
                        { name: "r/terriblefacebookmemes", value: "terriblefacebookmemes" },
                        { name: "r/funny", value: "funny" },
                        { name: "r/teenagers", value: "teenagers" },
                        { name: "r/ComedyCemetery", value: "ComedyCemetery" }
                    )
            );
        return [searchSlashCommand];
    }

    return [];
}
