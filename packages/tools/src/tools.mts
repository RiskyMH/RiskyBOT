import YAML from "js-yaml";
import { readFileSync } from "fs";
import { resolveColor } from "discord.js";
import type { ConfigType } from "./types.mjs";
import type { CommandInteractionOption, Webhook, TextChannel } from "discord.js";


export class Config {
    /** Can provide a location to the config (YMAL or JSON) or provide a direct object */
    constructor(location: string, directInput?: ConfigType, ymal = false) {
        
        let rawConfig: ConfigType;
        if (directInput) {
            rawConfig = directInput;
        } else if (!ymal) {
            rawConfig = JSON.parse(readFileSync(location, "utf8"));
        } else {
            rawConfig = YAML.load(readFileSync(location, "utf8")) as ConfigType;
        }

        // Use the provided config or the default config

        this.colors = rawConfig.colors;
        this.colors.ok ||= "#5865F2";
        this.colors.error ||= "#ED4245";
        this.colors.good ||= "#57F287";
        this.colors.warning ||= "#FEE75C";
        this.colors.washedOut ||=  rawConfig.colors.washedOut || {};
        this.colors.washedOut.ok ||= "#586599";

        this.apiEnabled = rawConfig.apiEnabled;
        this.apiEnabled.reddit ||= true;
        this.apiEnabled.topgg ||= false;
        this.apiEnabled.deepai ||= false;
        this.apiEnabled.nekobot ||= true;
        this.apiEnabled.someRandomApi ||= true;
        this.apiEnabled.urbanDictionary ||= true;
        this.apiEnabled.googleTranslate ||= true;
        this.apiEnabled.randomSmallOnes ||= rawConfig.apiEnabled?.randomSmallOnes || {};
        this.apiEnabled.randomSmallOnes.randomImage ||= true;
        this.apiEnabled.randomSmallOnes.randomText ||= true;

        // return ;
    }
    public colors: ConfigType["colors"];
    public apiEnabled: ConfigType["apiEnabled"];
    public getColors() {
        const ok = resolveColor(this.colors.ok);
        const error = resolveColor(this.colors.error);
        const good = resolveColor(this.colors.good);
        const warning = resolveColor(this.colors.warning);
        const washedOut = {
            ok: resolveColor(this.colors.washedOut.ok),
        };
        return {ok, error, good, warning, washedOut};
    }

}
/** To find out if something has an entry in the .env */
export class EnvEnabled {
    constructor(env: typeof process["env"]) {
        if (env.DISCORD_TOKEN != null) this.hasDiscordToken = true;
        if (env.DISCORD_EXTRA_TOKEN != null) this.hasDiscordExtraToken = true;
        if (env.TOPGG_TOKEN != null) this.HasTopggToken = true;
        if (env.DEEPAI_TOKEN != null) this.HasDeepaiToken = true;
        if (env.PRODUCTION != null) this.hasProductionBool = true;
        if (env.OWNER_GUILD_ID != null) this.hasOwnerGuildId = true;
        // return ;
    }
    // [key: string]: boolean;
    /**  Has a entry in `DISCORD_TOKEN`? */
    public hasDiscordToken = false;
    /**  Has a entry in `DISCORD_EXTRA_TOKEN`? */
    public hasDiscordExtraToken = false;
    /** Has a entry in `PRODUCTION`? - is it in testing or in release mode - useless rn*/
    public hasProductionBool = false;
    /** Has a entry in `TOPGG_TOKEN`? */
    public HasTopggToken = false;
    /** Has a entry in `DEEPAI_TOKEN`? */
    public HasDeepaiToken = false;
    /** Has a entry in `OWNER_GUILD_ID`? */
    public hasOwnerGuildId = false;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - would use @ts-expect-error but some times it errors
export const listFormatter: Intl.ListFormat = new Intl.ListFormat("en", { style: "long" });

export async function webhookMakeOrFind(channel: TextChannel, webhookName: string, botId: string) : Promise<Webhook> {
    let webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(
        (u) => u.name === webhookName && u.owner?.id === botId
    );

    if (!webhook) {
        channel.createWebhook({name: webhookName}).catch(console.error);
        webhooks = await channel.fetchWebhooks();
        webhook = webhooks.find((u) => u.name === webhookName && u.owner?.id === botId);
    }
    if (!webhook) throw new Error("Could not find or create webhook");
    return webhook;
}


export const trim = (str: string, max: number): string =>
    (str.length ?? "") > max ? `${str.slice(0, max - 1)}…` : str;


export async function getBetweenStr(string: string, statChar: string, endChar: string, splitChar = ""): Promise<string | string[]> {
    const string2 = string.substring(
        string.indexOf(statChar) + 1,
        string.lastIndexOf(endChar)
    );

    if (splitChar) return string2.split(splitChar);
    else return string2;
}


export async function stringFromEmbed(message: CommandInteractionOption["message"]): Promise<string> {
    let msg = message?.content || "";

    for (const emb of message?.embeds ?? []) {
        msg += "\n";
        if (emb.author) {
            // if (emb.author.url) msg += `![Author icon](${emb.author.url}) ${emb.author.name}`;
            msg += `\n# ${emb.author.name}${emb.author.url ? ` (url: ${emb.author.url})` : ""}`;
        }
        if (emb.title) msg += `\n# ${emb.title}${emb.url ? ` (url: ${emb.url})` : ""}`;
        if (emb.description) msg += `\n${emb.description}`;
        for (const embField of emb?.fields ?? []) {
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

