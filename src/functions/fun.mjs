import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";

const nekoBaseURL = "https://nekobot.xyz/api/";
const sraBaseURL = "https://some-random-api.ml/";

/**
 * @param {import("discord.js").Client} client
 * @param {string} type
 * @param {import("discord.js").User} inputUser1
 * @param {import("discord.js").CommandInteractionOption["member"]} inputMember1
 * @param {import("discord.js").User} inputUser2
 * @param {string} inputText
 * @param {import("discord.js").HexColorString} color
 * @param {import("discord.js").HexColorString} colorErr
 * @return {Promise <import("discord.js").InteractionReplyOptions>}
 */

export default async function fun(client, type, inputUser1, inputMember1, inputUser2, inputText, color, colorErr) {
    let funEmb = new MessageEmbed().setTitle("Fun").setAuthor("neko").setColor(color);
    let errorEmb = new MessageEmbed().setTitle("Errors - fun").setColor(colorErr);
    let errors = [];

    try {
        
        /** @type Object */
        let fun = {};
        if (!errors.length) {
            switch (type) {
                case "clyde-say": {
                    fun = await fetch(nekoBaseURL + "imagegen?" + new URLSearchParams({ type: "clyde", text: inputText })).then((response) => response.json());
                    funEmb.setImage(await fun.message).setAuthor({name: "nekobot", url: "http://neekobot.xyz"}).setTitle("Fun - `Clyde Say`");
                }
                break;
            case "ship": {
                fun = await fetch(nekoBaseURL + "imagegen?" + new URLSearchParams({ type: "ship", user1: inputUser1.displayAvatarURL(), user2: inputUser2.displayAvatarURL() })).then((response) => response.json());
                funEmb.setImage(await fun.message).setAuthor({name: "nekobot", url: "http://neekobot.xyz"}).setTitle("Fun - `Ship`");
            }
            break;
            case "captcha": {
                fun = await fetch(nekoBaseURL + "imagegen?" + new URLSearchParams({ type: "captcha", url: inputUser1.displayAvatarURL(), username: inputUser1.username })).then((response) => response.json());
                funEmb.setImage(await fun.message).setAuthor({name: "nekobot", url: "http://nekobot.xyz"}).setTitle("Fun - `Captcha`");
            }
            break;
            case "whowouldwin": {
                fun = await fetch(nekoBaseURL + "imagegen?" + new URLSearchParams({ type: "whowouldwin", user1: inputUser1.displayAvatarURL(), user2: inputUser2.displayAvatarURL() })).then((response) => response.json());
                funEmb.setImage(await fun.message).setAuthor({name: "nekobot", url: "http://nekobot.xyz"}).setTitle("Fun - `Who Would Win`");
            }
            break;
            case "changemymind": {
                fun = await fetch(nekoBaseURL + "imagegen?" + new URLSearchParams({ type: "changemymind", text: inputText })).then((response) => response.json());
                funEmb.setImage(await fun.message).setAuthor({name: "nekobot", url: "http://nekobot.xyz"}).setTitle("Fun - `Change My Mind`");
            }
            break;
            case "iphonex": {
                fun = await fetch(nekoBaseURL + "imagegen?" + new URLSearchParams({ type: "iphonex", url: inputUser1.displayAvatarURL() })).then((response) => response.json());
                funEmb.setImage(await fun.message).setAuthor({name: "nekobot", url: "http://nekobot.xyz"}).setTitle("Fun - `iPhone X`");
            }
            break;
            case "trump-tweet": {
                fun = await fetch(nekoBaseURL + "imagegen?" + new URLSearchParams({ type: "trumptweet", text: inputText })).then((response) => response.json());
                funEmb.setImage(await fun.message).setAuthor({name: "nekobot", url: "http://nekobot.xyz"}).setTitle("Fun - `Trump Tweet`");
            }
            break;
            case "tweet": {
            //  let fun = await fetch(nekoBaseURL+"imagegen?type=tweet&text="+inputText+"&username="+inputUser1.username).then((response) => response.json())
            //  funEmb.setImage(await fun.message).setAuthor("nekobot", "", "http://neekobot.xyz").setTitle("Fun - `Tweet`")
                // @ts-expect-error - using types that isn't existing (vscode)
                fun = await fetch(sraBaseURL + "canvas/tweet?" + new URLSearchParams({ comment: inputText, username: inputUser1.username, avatar: inputUser1.displayAvatarURL({format: "png"}), displayname: inputMember1?.displayName??inputUser1.username })).then((response) => response.url);
                funEmb.setImage(await fun).setAuthor({name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png"}).setTitle("Fun - `tweet`");
            }
            break;
            case "deepfry": {
                fun = await fetch(nekoBaseURL + "imagegen?" + new URLSearchParams({ type: "deepfry", image: inputUser1.displayAvatarURL() })).then((response) => response.json());
                funEmb.setImage(await fun.message).setAuthor({name: "nekobot", url: "http://nekobot.xyz"}).setTitle("Fun - `Deepfry`");
            }
            break;
            case "blurpify": {
                fun = await fetch(nekoBaseURL + "imagegen?" + new URLSearchParams({ type: "blurpify", image: inputUser1.displayAvatarURL() })).then((response) => response.json());
                funEmb.setImage(await fun.message).setAuthor({name: "nekobot", url: "http://neekobot.xyz"}).setTitle("Fun - `Blurpify`");
            }
            }
            return { embeds: [funEmb] };
        } else {
            errorEmb.setDescription("• " + errors.join("\n• "));

            return { embeds: [errorEmb], ephemeral: true };
        }
    } catch (err) { console.log(err); return { embeds: [errorEmb.setDescription("A error happened")], ephemeral: true }; }
}