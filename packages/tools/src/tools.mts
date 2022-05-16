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
        // return ;
    }
    public colors: ConfigJSON["colors"] = {ok: "#000000", error: "#000000", good: "#000000", warning: "#000000"};
    public colorsd: ConfigJSON["colors"] = {ok: "#000000", error: "#000000", good: "#000000", warning: "#000000"};
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
    /** Has a entry in `production`? - is it in testing or in release mode*/
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

export function toTitleCase(str: string): string {
    return str.replace("/wS*/g", function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
}

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

export function mergeObjs(obj1: object, obj2: object): object {
    const merged = {};
    let keys1 = Object.keys(obj1);
    keys1.forEach((k1) => {
        // @ts-expect-error
        merged[k1] = obj2[k1] || obj1[k1]; // replace values from 2nd object, if any
    });
    Object.keys(obj2).forEach((k2) => {
        // @ts-expect-error
        if (!keys1.includes(k2)) merged[k2] = obj1[k2]; // add additional properties from second object, if any
    });

    return merged;
}
export function dateBetter(inputUTC: string): string {
    let UTC = new Date(inputUTC);

    let min = ("00" + UTC.getMinutes()).slice(-2);
    let hour = ("00" + UTC.getHours()).slice(-2);
    let daynum = ("00" + UTC.getDate()).slice(-2);
    let month = ("00" + UTC.getMonth()).slice(-2);
    let year = ("0000" + UTC.getFullYear()).slice(-2);

    let date = `${hour}:${min} ${daynum}/${month}/${year}`;

    return date;
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


export async function stringFromEmbed(message: CommandInteractionOption["message"]): Promise <string> {
 let msg = message?.content || "";

 for (let emb of message?.embeds ?? []) {
  msg += "\n";
  if (emb.author) {
   // if (emb.author.url) msg += `![Author icon](${emb.author.url}) ${emb.author.name}`;
   msg += `\n# ${emb.author.name}${
    emb.author.url ? ` (url: ${emb.author.url})` : ""
   }}`;
  }
  if (emb.title)
   msg += `\n# ${emb.title}${emb.url ? ` (url: ${emb.url})` : ""}`;
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


export async function strIncludes(string: string, contains: string | string[], endsWith: boolean = false): Promise<boolean> {
    if (!endsWith) {
        if (!Array.isArray(contains)) {
            if (string.includes(contains)) return true;
        } else {
            for (let str of contains) {
                if (string.includes(str)) return true;
            }
        }
    } else {
        if (!Array.isArray(contains)) {
            if (string.endsWith(contains)) return true;
        } else {
            for (let str of contains) {
                if (string.endsWith(str)) return true;
            }
        }
    }
    return false;
}

