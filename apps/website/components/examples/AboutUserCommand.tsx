import {
    DiscordMessage,
    DiscordMessages,
    DiscordMention,
    DiscordCommand,
    DiscordEmbed,
    DiscordEmbedField,
    DiscordEmbedFields,
    DiscordTime,
    DiscordItalic,
} from "@skyra/discord-components-react";
import { addBasePath } from "next/dist/client/add-base-path";
import { useEffect, useState } from "react";
import { BOT_INVITE_URL } from "../../constants";


export default function DiscordAboutUserExample() {
    const imgUrl = addBasePath("/robot.svg");

    const [largeQuery, setMatches] = useState(window.matchMedia("(min-width: 1024px)").matches);

    useEffect(() => {
        const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
        window.matchMedia("(min-width: 1024px)").addEventListener("change", handler);
        return () => window.matchMedia("(min-width: 1024px)").removeEventListener("change", handler);
    }, []);

    // const aboutUserMessage = 

    const AboutUserMessage = (
        <DiscordMessages className="rounded-lg scale-75" >
            <DiscordMessage author="Friend" avatar="orange" highlight roleColor="#f1c40f">
                <DiscordMention>User</DiscordMention> {" "}
                Is it true that RiskyBOT can give information on a user?
            </DiscordMessage>
            <DiscordMessage author="RiskyBOT" avatar={imgUrl} bot verified >
                <DiscordCommand slot="reply" author="Friend" avatar="orange" command="/about user" />
                <DiscordEmbed
                    slot="embeds"
                    color="#3B82F6"
                    authorName="RiskyBOT"
                    authorImage={imgUrl}
                    thumbnail={largeQuery ? imgUrl : ""}
                    authorUrl={BOT_INVITE_URL}
                >
                    <DiscordEmbedFields slot="fields">
                        <DiscordEmbedField fieldTitle="Made">
                            <DiscordTime>
                                {discordDate(new Date(1_606_193_539_547))}
                            </DiscordTime>
                            <DiscordTime className="ml-1">
                                ({discordDateRelativeYears(new Date(1_606_193_539_547))})
                            </DiscordTime>
                        </DiscordEmbedField>

                        <DiscordEmbedField fieldTitle="Joined server" inline={largeQuery} inlineIndex={1}>
                            <DiscordTime className="whitespace-normal lg:whitespace-nowrap">
                                {discordDate(new Date())}
                            </DiscordTime>
                        </DiscordEmbedField>

                        <DiscordEmbedField fieldTitle="Server nickname" inline={largeQuery} inlineIndex={largeQuery ? 3 : 1}>
                            <DiscordItalic>
                                No nickname set
                            </DiscordItalic>
                        </DiscordEmbedField>

                        <DiscordEmbedField fieldTitle="Roles" >
                            <DiscordMention color="#57F287" type="role">
                                Good Bots
                            </DiscordMention>

                            <DiscordMention type="role" className="ml-1">
                                Bots
                            </DiscordMention>
                        </DiscordEmbedField>
                    </DiscordEmbedFields>
                </DiscordEmbed>
            </DiscordMessage>
            <DiscordMessage author="You" roleColor="#3498db" >
                Apparently so!
            </DiscordMessage>
        </DiscordMessages>
    );

    return AboutUserMessage;
}

const discordDate = (date: Date): string => {
    const formatter = new Intl.DateTimeFormat("en-us", { timeStyle: "short", dateStyle: "long" });
    return formatter.format(date).replace("at ", "");
};

const discordDateRelativeYears = (date: Date): string => {
    const formatter = new Intl.RelativeTimeFormat("en-us", { style: "long" });
    return formatter.format(date.getFullYear() - new Date().getFullYear(), "years");
};
