import { type RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v10";

export function resolveColor(color: string | number): number {
    if (typeof color === "string") {
        color = Number.parseInt(color.replace("#", ""), 16);
    }

    if (color < 0 || color > 0xFF_FF_FF) throw new RangeError("ColorRange");
    else if (Number.isNaN(color)) throw new TypeError("ColorConvert");

    return color;
}

export function resolveHexColor(color: number): string {
    return `#${color.toString(16).padStart(6, "0")}`;
}

export const listFormatter = new Intl.ListFormat("en", { style: "long" });

export const trim = (str: string, max: number): string => (str.length) > max ? `${str.slice(0, max - 1)}…` : str;

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
