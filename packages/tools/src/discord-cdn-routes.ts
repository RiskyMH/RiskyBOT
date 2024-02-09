
export function emoji(emojiId: string, extension: string = "png") {
    return `/emojis/${emojiId}.${extension}` as const;
}

export function guildMemberAvatar(guildId: string, userId: string, memberAvatar: string, format: string) {
    return `/guilds/${guildId}/users/${userId}/avatars/${memberAvatar}.${format}` as const;
}

export function userAvatar(userId: string, hash: string, extension: string = "png") {
    return `/avatars/${userId}/${hash}.${extension}` as const;
}

export function userBanner(userId: string, hash: string, extension: string = "png") {
    return `/banners/${userId}/${hash}.${extension}` as const;
}

export function defaultUserAvatar(modulo: 1 | 2 | 3 | 4 | 5) {
    return `/embed/avatars/${modulo}.png` as const;
}
