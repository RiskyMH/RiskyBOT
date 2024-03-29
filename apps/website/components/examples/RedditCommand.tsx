import {
    DiscordMessage,
    DiscordMessages,
    DiscordMention,
    DiscordActionRow,
    DiscordAttachments,
    DiscordButton,
    DiscordCommand,
    DiscordEmbed,
    DiscordEmbedFooter,
    DiscordEmbedDescription,
    DiscordInlineCode
} from "@skyra/discord-components-react";
import { addBasePath } from "next/dist/client/add-base-path";
import { useEffect, useState } from "react";
import { BOT_INVITE_URL } from "../../constants";


const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


export default function DiscordRedditExample() {
    const imgUrl = addBasePath("/robot.svg");

    const [data, setData] = useState({
        title: "Loading...",
        ups: 0,
        downs: 0,
        num_comments: 0,
        permalink: "",
        url: null,
        subreddit_name_prefixed: "r/dankmemes",
        selftext: "",
        created_utc: 0,
        author: "Loading...",
    });
    const [response, setResponse] = useState("o.O this meme is funny 🤣!");
    const [count, setCount] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [hasLoadedLegitPost, setLoadedLegitPost] = useState(false);

    useEffect(() => {
        fetchQuestion();
    }, []);

    async function fetchQuestion(subreddit = "meme") {
        setCount((c) => c + 1);
        
        setLoading(true);
        if (count >= 4) return;

        console.info(`Fetching new post from ${subreddit}...`);

        // Later TODO: Not use static data (use API for random)

        // Simulate a 1 second delay
        await wait(1000);

        setData({
            title: "is't possible to have this much power",
            ups: 150_449,
            downs: 0,
            num_comments: 867,
            permalink: "/r/dankmemes/comments/jkbo9t/is_t_possible_to_have_this_much_power/",
            url: "https://i.redd.it/ns2zniy2s1w51.gif",
            subreddit_name_prefixed: "r/dankmemes",
            selftext: "",
            created_utc: 1_603_983_862,
            author: "zakuria44",
        });

        setLoadedLegitPost(true);
        setLoading(false);
        fetchResponse();

    }

    function fetchResponse() {
        const list = [
            "o.O this meme is funny 🤣!",
            "I mean there are better memes out there",
        ];
        const random = Math.floor(Math.random() * list.length);
        setResponse(list[random]);
    }

    const IntroMessage = (
        <DiscordMessages className="rounded-lg scale-75" >
            <DiscordMessage author="Friend" avatar="orange" highlight roleColor="#f1c40f">
                <DiscordMention>User</DiscordMention> {" "}
                I heard that RiskyBOT has a command for viewing Reddit posts!
            </DiscordMessage>
            <style>{css}</style>
            <DiscordMessage author="RiskyBOT" avatar={imgUrl} bot verified>
                <DiscordCommand slot="reply" author="Friend" avatar="orange" command="/random reddit post" />
                <DiscordEmbed
                    slot="embeds"
                    color="#3B82F6"
                    authorName={"Reddit post in " + data?.subreddit_name_prefixed}
                    // authorImage="https://www.reddit.com/favicon.ico"
                    authorImage="https://www.redditinc.com/assets/images/site/reddit-logo.png"
                    authorUrl={"https://www.reddit.com/" + data?.subreddit_name_prefixed}
                    embedTitle={data?.title}
                    url={hasLoadedLegitPost ? "https://www.reddit.com" + data?.permalink : null}
                    image={imgUrlIsTrulyAnImage(data?.url) ? data?.url : ""}
                >

                    <DiscordEmbedDescription slot="description" className={hasLoadedLegitPost ? "block" : "hidden"}> {
                        <div>
                            <p>{data?.selftext}</p>
                            <p className="flex items-center">
                                <DiscordInlineCode className="pr-1"> 👍 {data?.ups.toLocaleString()}</DiscordInlineCode>
                                <DiscordInlineCode className="pr-1"> 👎 {data?.downs.toLocaleString()} </DiscordInlineCode>
                                <DiscordInlineCode> 💬 {data?.num_comments.toLocaleString()} </DiscordInlineCode>
                            </p>
                        </div>
                    } </DiscordEmbedDescription>


                    <DiscordEmbedFooter slot="footer" timestamp={isLoading ? null : new Date(data?.created_utc * 1000)}>
                        <p>
                            {isLoading ? "Loading new post..." : "Posted by " + data?.author}
                        </p>
                    </DiscordEmbedFooter>

                </DiscordEmbed>
                <DiscordAttachments slot="components">
                    <DiscordActionRow>
                        <DiscordButton
                            type="primary"
                            disabled={isLoading}
                            onClick={e => (e.currentTarget.disabled ? null : fetchQuestion())}>
                            Another?
                        </DiscordButton>
                        {
                            !isLoading && data?.url ? (
                                <DiscordButton url={"https://www.reddit.com" + data?.permalink}>
                                    Link
                                </DiscordButton>
                            ) : null
                        }
                    </DiscordActionRow>
                </DiscordAttachments>
            </DiscordMessage>
            <DiscordMessage author="You" roleColor="#3498db" >
                <p>{response}</p>
            </DiscordMessage>
        </DiscordMessages>
    );

    const RatelimitMessage = (
        <div>
            <DiscordMessages className="rounded-lg scale-75" >
                <DiscordMessage author="Friend" avatar="orange" highlight roleColor="#f1c40f">
                    <DiscordMention>User</DiscordMention> {" "}
                    I heard that RiskyBOT has a command for viewing Reddit posts!
                </DiscordMessage>
                <DiscordMessage author="RiskyBOT" avatar={imgUrl} bot verified>
                    <DiscordCommand slot="reply" author="Friend" avatar="orange" command="/random reddit-post"></DiscordCommand>
                    <DiscordEmbed slot="embeds" color="#3B82F6" embedTitle="Wanna keep getting memes?">
                        <DiscordEmbedDescription slot="description">
                            Add the bot to your server with the button below!
                        </DiscordEmbedDescription>
                    </DiscordEmbed>
                    <DiscordAttachments slot="components">
                        <DiscordActionRow>
                            <DiscordButton type="primary" url={BOT_INVITE_URL}>
                                Invite RiskyBOT
                            </DiscordButton>
                        </DiscordActionRow>
                    </DiscordAttachments>
                </DiscordMessage>
                <DiscordMessage author="You" roleColor="#3498db">
                    Ok, I will add the bot to my server now....
                </DiscordMessage>
            </DiscordMessages>
        </div>
    );



    return count <= 4 ? IntroMessage : RatelimitMessage;
}

const css = `  
    .discord-embed-image {
        max-width: 200px !important;
        max-height: 200px !important;
    }
`;


function imgUrlIsTrulyAnImage(url: string) {
    return url && url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}