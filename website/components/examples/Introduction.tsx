import {
    DiscordMessage,
    DiscordMessages,
    DiscordMention,
    DiscordSystemMessage,
} from "@skyra/discord-components-react";
import { addBasePath } from "next/dist/client/add-base-path";

export default function DiscordIntroductionExample() {
    const imgUrl = addBasePath("/robot.svg");

    const IntroMessage = (
        <DiscordMessages className="rounded-lg" >
            <DiscordSystemMessage type="join">
                Welcome, <i style={{ color: "#e5403c" }}>RiskyBOT</i>. We hope you brought pizza.
            </DiscordSystemMessage>
            <DiscordMessage author="RiskyBOT" avatar={imgUrl} bot verified>
                Thanks for inviting me to your server! I have lots of fun results and is just a good bot to have.
            </DiscordMessage>
            <DiscordMessage author="Friend" avatar="orange" highlight roleColor="#f1c40f">
                <DiscordMention>User</DiscordMention> {" "}
                I invited RiskyBOT because it looks cool! 
            </DiscordMessage>
            <DiscordMessage author="You" roleColor="#3498db">
                Ok, sounds good. I'll check it out.
            </DiscordMessage>
            
        </DiscordMessages>
    );


    return IntroMessage;
}