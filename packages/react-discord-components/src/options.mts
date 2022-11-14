export interface Profile {
    author?: string;
    avatar?: string;
    bot?: boolean;
    verified?: boolean;
    server?: boolean;
    op?: boolean;
    roleColor?: string;
    roleIcon?: string;
    roleName?: string;
}

export interface DiscordMessageOptions {
    avatar?: string;
    profiles?: { [key: string]: Profile };
    emojis?: { [key: string]: Emoji };
    defaultTheme?: string;
    defaultMode?: string;
    defaultBackground?: "discord" | "none";
}

export enum DiscordAvatars {
    blue = "https://cdn.discordapp.com/embed/avatars/0.png",
    gray = "https://cdn.discordapp.com/embed/avatars/1.png",
    green = "https://cdn.discordapp.com/embed/avatars/2.png",
    orange = "https://cdn.discordapp.com/embed/avatars/3.png",
    red = "https://cdn.discordapp.com/embed/avatars/4.png",
    pink = "https://cdn.discordapp.com/embed/avatars/5.png",
    default = blue
}

export type Avatars = DiscordAvatars | typeof DiscordAvatars | string;

export function resolveAvatar(avatar?: Avatars ): string {
    // @ts-expect-error not happy with the type of DiscordAvatars
    return (avatar && DiscordAvatars[avatar]) || avatar || DiscordAvatars.default;
}

export interface Emoji {
    name?: string;
    url?: string;
    embedEmoji?: boolean;
}


