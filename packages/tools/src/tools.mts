// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import yaml from "js-yaml";
import { readFileSync } from "fs";
import {ConfigJSON} from "./types.mjs";
import { ColorResolvable, Util, HexColorString } from "discord.js";


export class Config {
    constructor(location: string, ymal = false){

        let config: ConfigJSON;
        if (!ymal){
            config = JSON.parse(readFileSync(location, "utf8"));
        } else{
            config = yaml.load(readFileSync(location, "utf8"));
        }

        this.colors = config.colors;
        // return ;
    }
    public colors: ConfigJSON["colors"] = {ok: "#000000", error: "#000000", good: "#000000", warning: "#000000"};
    public getColors(): {ok: number, error: number, good: number, warning: number} {
        const ok = Util.resolveColor(this.colors.ok);
        const error = Util.resolveColor(this.colors.error);
        const good = Util.resolveColor(this.colors.good);
        const warning = Util.resolveColor(this.colors.warning);
        return {ok, error, good, warning};
    }

}

/**
 * @param {string} str
 * @exports string
 */
export function toTitleCase(str) {
    return str.replace("/wS*/g", function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
}
/**
 * @param {import("discord.js").BaseGuildTextChannel} channel
 * @param {string} webhookName
 * @param {string} botID
 * @exports import("discord.js").Webhook
 */
export async function webhookMakeOrFind(channel, webhookName, botID) {
    let webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(
        (u) => u.name === webhookName && u.owner.id === botID
    );

    if (!webhook) {
        channel
            .createWebhook(webhookName, {})
            .then((webhook) => console.log(`Created webhook ${webhook}`))
            .catch(console.error);

        webhooks = await channel.fetchWebhooks();
        webhook = await webhooks.find(
            (u) => u.name === webhookName && u.owner.id === botID
        );
    }
    return webhook;
}

export function mergeObjs(obj1, obj2) {
    const merged = {};
    let keys1 = Object.keys(obj1);
    keys1.forEach((k1) => {
        merged[k1] = obj2[k1] || obj1[k1]; // replace values from 2nd object, if any
    });
    Object.keys(obj2).forEach((k2) => {
        if (!keys1.includes(k2)) merged[k2] = obj1[k2]; // add additional properties from second object, if any
    });

    return merged;
}
export function dateBetter(inputUTC) {
    let UTC = new Date(inputUTC);

    let min = ("00" + UTC.getMinutes()).slice(-2);
    let hour = ("00" + UTC.getHours()).slice(-2);
    let daynum = ("00" + UTC.getDate()).slice(-2);
    let month = ("00" + UTC.getMonth()).slice(-2);
    let year = ("0000" + UTC.getFullYear()).slice(-2);

    let date = `${hour}:${min} ${daynum}/${month}/${year}`;

    return date;
}

/**
 * @param {string} str
 * @param {number} max
 */
export const trim = (str, max) =>
    str.length > max ? `${str.slice(0, max - 1)}…` : str;

/**
 * @param {string} string
 * @param {string} statChar
 * @param {string} endChar
 * @param {string} splitChar
 * @returns { Promise <string | string[] > }
 */
export async function getBetweenStr(string, statChar, endChar, splitChar = null) {
    let string2 = string.substring(
        string.indexOf(statChar) + 1,
        string.lastIndexOf(endChar)
    );

    if (splitChar) return string2.split(splitChar);
    else return string2;
}

/**
 * @param {import("discord.js").CommandInteractionOption["message"]} message
 * @returns { Promise <string  > } a markdown version of the message
 */
export async function stringFromEmbed(message) {
    let msg = message.content || "";

    for (let emb of message.embeds) {
        msg += "\n";
        if (emb.author) {
            // if (emb.author.url) msg += `![Author icon](${emb.author.url}) ${emb.author.name}`;
            msg += `\n# ${emb.author.name}${emb.author.url ? ` (url: ${emb.author.url})` : ""
        }}`;
        }
        if (emb.title)
            msg += `\n# ${emb.title}${emb.url ? ` (url: ${emb.url})` : ""}`;
        if (emb.description) msg += `\n${emb.description}`;
        for (let embField of emb ?.fields ?? []) {
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

/**
 * @param {string} string
 * @param { string | string[] } contains
 * @param { boolean } endsWith
 * @returns { Promise< boolean>}
 */
export async function strIncludes(string, contains, endsWith = false) {
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

