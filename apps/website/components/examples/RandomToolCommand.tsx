import {
    DiscordMessage,
    DiscordMessages,
    DiscordMention,
    DiscordActionRow,
    DiscordAttachments,
    DiscordButton,
    DiscordCommand,
    DiscordEmbed,
    DiscordEmbedDescription,
    DiscordBold
} from "@skyra/discord-components-react";
import { addBasePath } from "next/dist/client/add-base-path";
import { useEffect, useState } from "react";
import { BOT_INVITE_URL } from "../../constants";

export default function DiscordRandomToolExample() {
    const imgUrl = addBasePath("/robot.svg");
    const [data, setData] = useState("50");
    const [response, setResponse] = useState("o.O this meme is funny 🤣!");
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetchNumber();
    }, []);

    function fetchNumber() {
        setCount(count + 1);
        setLoading(true);
        const highNum = 100;
        const lowNum = 0;
        const randomNum = Math.floor(Math.random() * (highNum - lowNum + 1)) + lowNum;
        const rounded = Math.round(randomNum / 10) * 1;
        setTimeout(() => {
            setData(rounded.toLocaleString());
            fetchResponse();
            setLoading(false);
        }, 500);
    }

    function fetchResponse() {
        const list = [
            "YAY! I guessed the number correctly!",
            "oh 😔 I didn't guess the number correctly",
            "Seriously? who would guess " + data + "?",
        ];
        const random = Math.floor(Math.random() * list.length);
        setResponse(list[random]);
    }

    const IntroMessage = (
        <DiscordMessages className="rounded-lg scale-75" >
            <DiscordMessage author="Friend" avatar="orange" highlight roleColor="#f1c40f">
                <DiscordMention>User</DiscordMention> {" "}
                I also heard that RiskyBOT can help with giving you a random number!
            </DiscordMessage>
            <DiscordMessage author="RiskyBOT" avatar={imgUrl} bot verified>
                <DiscordCommand slot="reply" author="Friend" avatar="orange" command="/random number"></DiscordCommand>
                <DiscordEmbed
                    slot="embeds"
                    color="#3B82F6"
                    embedTitle="Random Number"

                >
                    <DiscordEmbedDescription slot="description">
                        <p>Number: <DiscordBold className="font-bold">{loading ? "..." : data.toLocaleString()}</DiscordBold> </p>
                    </DiscordEmbedDescription>
                </DiscordEmbed>
                <DiscordAttachments slot="components">
                    <DiscordActionRow>
                        <DiscordButton
                            type="primary"
                            onClick={e => (e.currentTarget.disabled ? null : fetchNumber())}
                            disabled={loading}
                        >
                            Another?
                        </DiscordButton>
                    </DiscordActionRow>
                </DiscordAttachments>
            </DiscordMessage>
            <DiscordMessage author="You" roleColor="#3498db" >
                <p>
                    {response}
                </p>
            </DiscordMessage>
        </DiscordMessages>
    );

    const RatelimitMessage = (
        <div>
            <DiscordMessages className="rounded-lg scale-75" >
                <DiscordMessage author="Friend" avatar="orange" highlight roleColor="#f1c40f">
                    <DiscordMention>User</DiscordMention> {" "}
                    I also heard that RiskyBOT can help with giving you a random number!
                </DiscordMessage>
                <DiscordMessage author="RiskyBOT" avatar={imgUrl} bot verified>
                    <DiscordCommand slot="reply" author="Friend" avatar="orange" command="/random number"></DiscordCommand>
                    <DiscordEmbed slot="embeds" color="#3B82F6" embedTitle="Wanna keep guessing numbers?">
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



    return count <= 5 ? IntroMessage : RatelimitMessage;
}
