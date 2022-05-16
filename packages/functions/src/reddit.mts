import fetch from "node-fetch";
import { hyperlink, inlineCode, time, ActionRowBuilder, ButtonBuilder, EmbedBuilder, MessageActionRowComponentBuilder } from "@discordjs/builders";
import {ButtonStyle} from "discord-api-types/v10";
import * as tools from "@riskybot/tools";
import type { Config } from "@riskybot/tools";

const redditBaseURL = "https://reddit.com/";


//TODO: Make sure everything works...
//TODO: Migrate the fetch into `@riskybot/apis`


export default async function search(config: Config, subEngine: string, input: string) {
    let searEmb = new EmbedBuilder().setTitle("Fun").setColor(config.getColors().ok);
    let errorEmb = new EmbedBuilder().setTitle("Errors - search").setColor(config.getColors().error);
    let row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
     new ButtonBuilder()
      .setLabel("Another?")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(false),

     new ButtonBuilder().setLabel("Link").setStyle(ButtonStyle.Link).setDisabled(false)
    ]);

    switch (subEngine) {
        case "random-post": {
            /** @type {import("../types").RedditRandomSubredditPosts[0]} */
            let redditPostList = await fetch(redditBaseURL + "r/" + (encodeURIComponent(input.replace("r/", ""))) + "/random.json?" + new URLSearchParams({ sort: "top", t: "daily", limit: "500", include_over_18: "false" })).then((response) => response.json()).then((e: any) => e[0]);
            // let redditPostList = await fetch("https://www.reddit.com/r/teenagers/comments/rvl8e2/what_are_your_views_on_marijuana/.json").then((response) => response.json()).then(e => e[0])
            // let redditPostList = await fetch("https://www.reddit.com/r/JackSucksAtLife/comments/rrznxn/on_one_tlc_drpimple_popper_episode_theres_an_og/.json?utm_campaign=redirect&utm_medium=desktop&utm_source=reddit&utm_name=random_link").then((response) => response.json()).then(e => e[0])
            // let redditPostList = await fetch("https://www.reddit.com/r/funny/comments/rv3weq/fake_gun.json").then((response) => response.json()).then(e => e[0])
            let filtered = redditPostList?.data?.children[0];

            // make sure to not give nsfw
            if (filtered?.data?.over_18) {
                // second chance to sure to not give nsfw
                redditPostList = await fetch(redditBaseURL + "r/" + (input) + "/random.json?" + new URLSearchParams({ sort: "top", t: "daily", limit: "500", include_over_18: "false" })).then((response) => response.json()).then((e: any) => e[0]);
                filtered = redditPostList?.data?.children[0];
            }
            if (filtered && !filtered?.data?.over_18 && !(redditPostList?. [0]?.error == 404 || redditPostList?. [0]?.error == 403)) {

                searEmb
                    .setAuthor({name: "Reddit post in "+tools.trim(filtered.data.subreddit_name_prefixed, 15), url:"https://www.reddit.com/"+filtered.data.subreddit_name_prefixed, iconURL: "https://www.reddit.com/favicon.ico"})
                    .setURL(redditBaseURL.slice(0, -1) + filtered.data.permalink)
                    .setTimestamp(filtered.data.created_utc * 1000)
                    .setFooter({text: "Posted by: " + filtered.data.author})
                    .setTitle(filtered.data.title);

                row.components[0].setCustomId(`random-again-randomPost-reddit-(${filtered.data.subreddit})`);
                // @ts-expect-error - .setURL() errors
                row.components[1].setURL(redditBaseURL.slice(0, -1) + await filtered.data.permalink);
                searEmb.addFields([{name:"Stats", value:`\`👍${filtered.data.ups}\` \`👎${filtered.data.downs}\` \`💬${filtered.data.num_comments}\``}]);

                if (filtered.data.selftext) searEmb.setDescription(tools.trim(filtered.data.selftext||"", 1024));

                // Image
                if (/\.(jpe?g|png|tiff?|(webp)!|bmp|gifv?)(\?.*)?$/i.test(filtered.data ?.url)) searEmb.setImage(filtered.data.url);
                // Imgur image
                else if (/(?<!i\.)imgur\.com\//i.test(filtered.data ?.url)) searEmb.setImage(filtered.data.url +".gif");
                // Commands link - don't show
                else if (/reddit\.com\/r\/[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\/comments\//i.test(filtered.data ?.url)) break; // searEmb.setDescription(tools.trim(searEmb.description + "\n\n*Click on the link to view comments:*\n" + filtered.data.url, 1024))
                // Video link
                else if (filtered.data ?.domain === "v.redd.it"|| filtered.data?.is_video) searEmb.setDescription(tools.trim(searEmb.data.description + hyperlink("\n\nView Video", filtered.data.url), 1024));
                // else if (filtered.data ?.domain === "v.redd.it"|| filtered.data?.is_video) searEmb.setDescription(tools.trim(searEmb.description + "\n\n*Click on the link to view embedded video:*\n"+filtered.data.url, 1024))
                // Gallery
                else if (/reddit\.com\/gallery\//i.test(filtered.data ?.url)) searEmb.setDescription(tools.trim(searEmb.data.description + hyperlink("\n\nView Gallery",filtered.data.url), 1024));
                // Else
                else searEmb.setDescription(tools.trim(searEmb.data.description + "\n\n*Click on the link to view embedded link:*\n" + filtered.data.url, 1024));
                
            } else {
                errorEmb.setDescription("no findings :(");
                return { embeds: [errorEmb] };
            }
        }
        break;

    case "subreddit": {
        /** @type {object} */
        let redditPostList: any = await fetch(redditBaseURL + "r/" + (encodeURIComponent(input.replace("r/", ""))) + "/about.json?" + new URLSearchParams()).then((response) => response.json());

        if (await redditPostList?.name || redditPostList.error != 404 || redditPostList.error != 403) {
            let redditChosen = await redditPostList.data;

            searEmb
                .setAuthor({ name: "Reddit", url: "https://www.reddit.com/", iconURL: "https://www.reddit.com/favicon.ico" })
                .setURL(redditBaseURL.slice(0, -1) + await redditChosen.url)
                .setTitle("About - " + inlineCode(tools.trim(await redditChosen.display_name_prefixed, 15)))
                .addFields([{ name:"Title", value: tools.trim(await redditChosen.title, 1024)}])
                .addFields([{name: "Short description", value: tools.trim(await redditChosen.public_description||"*No description provided*", 1024)}])
                .addFields([{name: "Made", value: time(await redditChosen.created_utc)}]);
            // @ts-expect-error - .setLabel() errors
            row.components[0].setCustomId(`random-again-randomPost-reddit-(${input})`).setLabel("Random post in subreddit").setStyle(ButtonStyle.Secondary);
            // @ts-expect-error - .setLabel() errors
            row.components[1].setURL(redditBaseURL.slice(0, -1) + await redditChosen.url);

            if (await redditChosen?.community_icon) searEmb.setThumbnail(await redditChosen.community_icon.split("?")[0]);
            if (await redditChosen?.icon_img) searEmb.setThumbnail(await redditChosen.icon_img);
            searEmb.addFields([{name:"Stats", value:`\`🧑${redditChosen.subscribers.toLocaleString()}\``}]);

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
        case "sub-reddit": {

            let urbanOpt: any = await fetch(redditBaseURL + "api/subreddit_autocomplete.json?" + new URLSearchParams({ query: input, limit: "25" })).then((response) => response.json());

            let wordList = urbanOpt.subreddits.filter((word: {name: string})=> !word.name.startsWith("u_")).map((word: {name: string}) => ({ name: word.name.includes("r/") ? word.name : "r/" + word.name, value: word.name })).slice(0, 25);

            if (!input.length) {
                urbanOpt = await fetch(redditBaseURL + "subreddits/popular.json?" + new URLSearchParams({ limit: "25" })).then((response) => response.json());

                wordList = urbanOpt.data.children.map((word: any) => ({ name: word.data.display_name_prefixed, value: word.data.display_name })).slice(0, 25);

                return wordList;
            }

            return wordList;
        }
    }

}