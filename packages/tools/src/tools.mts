import YAML from "js-yaml";
import { readFileSync } from "fs";
import type {ConfigJSON} from "./types.mjs";
import {Util} from "discord.js";
import type{ CommandInteractionOption, BaseGuildTextChannel, Webhook } from "discord.js";


export class Config {
    constructor(location: string, ymal = false){

        let config: ConfigJSON;
        if (!ymal){
            config = JSON.parse(readFileSync(location, "utf8"));
        } else{
            config = YAML.load(readFileSync(location, "utf8")) as ConfigJSON;
        }

        this.colors = config.colors;
        this.apiEnabled = config.apiEnabled;
        // return ;
    }
    public colors: ConfigJSON["colors"] = {ok: "#000000", error: "#000000", good: "#000000", warning: "#000000"};
    public apiEnabled: ConfigJSON["apiEnabled"] = 
        {reddit: true, topgg: false, deepai: false, nekobot: true, someRandomApi: true, urbandictionary: true, googletranslate: true,
            randomSmallOnes: {
                pastegg: true,
                rhymebrain: true,
                awsrandomcat: true,
                dogceo: true,
                icanhazdadjoke: true,
                forismatic: true,
                affirmationsdev: true,
                evilinsultcom: true,
                excuserheroku: true,
                uselessfactspl: true,
                shibeonline: true,
                randomduk: true,
                zooanimalapiheroku: true,
                emojihubheroku: true,
            }
        };
    public getColors(){
        const ok = Util.resolveColor(this.colors.ok);
        const error = Util.resolveColor(this.colors.error);
        const good = Util.resolveColor(this.colors.good);
        const warning = Util.resolveColor(this.colors.warning);
        return {ok, error, good, warning};
    }

}
/** Some of these vars are also controlled by the `config.yml` */
export class EnvEnabled {
    constructor(env: typeof process["env"], config?: Config){
        config;
        if (env.discordapi != null) this.hasDiscordApi = true;
        if (env.discordapiExtra != null) this.hasDiscordApiExtra = true;
        if (env.topggapi != null) this.HasTopggApi = true;
        if (env.deepapi != null) this.HasDeepApi = true;
        if (env.production != null) this.hasProductionBool = true;
        if (env.ownerGuildId != null) this.hasOwnerGuildId = true;
        // return ;
    }
    // [key: string]: boolean;
    /**  Has a entry in `discordapi`? */
    public hasDiscordApi: boolean = false;
    /**  Has a entry in `discordapiExtra`? */
    public hasDiscordApiExtra: boolean = false;
    /** Has a entry in `production`? - is it in testing or in release mode - useless rn*/
    public hasProductionBool: boolean = false;
    /** Has a entry in `deepapi`? */
    public HasTopggApi: boolean = false;
    /** Has a entry in `HasDeepApi`? */
    public HasDeepApi: boolean = false;
    /** Has a entry in `ownerGuildId`? */
    public hasOwnerGuildId: boolean = false;
}

// @ts-ignore
export const listFormatter: Intl.ListFormat = new Intl.ListFormat("en", { style: "long" });

export async function webhookMakeOrFind(channel: BaseGuildTextChannel, webhookName: string, botId: string) : Promise<Webhook> {
    let webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(
        (u) => u.name === webhookName && u.owner?.id === botId
    );

    if (!webhook) {
        channel
            .createWebhook(webhookName, {})
            // .then((webhook) => console.log(`Created webhook ${webhook}`))
            .catch(console.error);

        webhooks = await channel.fetchWebhooks();
        webhook = webhooks.find(
            (u) => u.name === webhookName && u.owner?.id === botId
        );
    }
    // @ts-expect-error
    return webhook;
}


export const trim = (str: string, max: number): string =>
    (str.length ?? "") > max ? `${str.slice(0, max - 1)}…` : str;


export async function getBetweenStr(string: string, statChar: string, endChar: string, splitChar: string = ""): Promise<string | string[]> {
    let string2 = string.substring(
        string.indexOf(statChar) + 1,
        string.lastIndexOf(endChar)
    );

    if (splitChar) return string2.split(splitChar);
    else return string2;
}


export async function stringFromEmbed(message: CommandInteractionOption["message"]): Promise<string> {
    let msg = message?.content || "";

    for (let emb of message?.embeds ?? []) {
        msg += "\n";
        if (emb.author) {
            // if (emb.author.url) msg += `![Author icon](${emb.author.url}) ${emb.author.name}`;
            msg += `\n# ${emb.author.name}${emb.author.url ? ` (url: ${emb.author.url})` : ""}`;
        }
        if (emb.title) msg += `\n# ${emb.title}${emb.url ? ` (url: ${emb.url})` : ""}`;
        if (emb.description) msg += `\n${emb.description}`;
        for (let embField of emb?.fields ?? []) {
            msg += `\n## ${embField.name}`;
            msg += `\n${embField.value}`;
        }
        if (emb.footer) msg += `\n *${emb.footer.text}*`;
        if (emb.timestamp) msg += `\n *${emb.timestamp.toLocaleString()}*`;
        if (emb.image) msg += `\n *Image url: ${emb.image.url}*`;
        if (emb.video) msg += `\n *Video url: ${emb.video.url}*`;
        if (emb.thumbnail) msg += `\n *Thumbnail url: ${emb.thumbnail.url}*`;
  // if (emb.color) msg+= `\nColor: ${emb.color}`
 }

 return msg;
}

