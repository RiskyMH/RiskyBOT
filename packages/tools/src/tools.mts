import { type APIMessage, type RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v10";
import { fetch } from "undici";

export function resolveColor(color: string | number): number {
    if (typeof color === "string") {
        color = parseInt(color.replace("#", ""), 16);
    }

    if (color < 0 || color > 0xffffff) throw new RangeError("ColorRange");
    else if (Number.isNaN(color)) throw new TypeError("ColorConvert");

    return color;
}

export function resolveHexColor(color: number): string {
    return `#${color.toString(16).padStart(6, "0")}`;
}


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - would use @ts-expect-error but only *some* of the time it errors
export const listFormatter: Intl.ListFormat = new Intl.ListFormat("en", { style: "long" });

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


export async function stringFromEmbed(message: APIMessage): Promise<string> {
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


const DISCORD_API_URL = "https://discord.com/api/v10";

export async function getBearerTokenFromKey(applicationId: string, privateKey: string, scopes: string[]) {
    const res = await fetch(DISCORD_API_URL + Routes.oauth2TokenExchange(), {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${applicationId}:${privateKey}`).toString("base64")}`,
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            scope: scopes.join(" ") || "applications.commands.update",
        }),
    });

    const json = await res.json() as { access_token: string };
    const bearerToken = json.access_token;

    if (!bearerToken) throw new Error("Failed to get bearer token");
    return bearerToken;

}

export async function deployCommands({ applicationId, clientSecret, guildId, commands }: {
    applicationId: string;
    clientSecret: string;
    guildId?: string;
    commands: RESTPostAPIApplicationCommandsJSONBody[];
}) {
    const bearerToken = await getBearerTokenFromKey(applicationId, clientSecret, ["applications.commands.update"]);

    const url = guildId ? Routes.applicationGuildCommands(applicationId, guildId) : Routes.applicationCommands(applicationId);

    const res = await fetch(DISCORD_API_URL + url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(commands),
    });

    const json = await res.json();
    if (res.status !== 200) throw new Error(`Failed to deploy commands: ${JSON.stringify(json)}`);

    return json;
}

