
export function interactionCallback(id: string, token: string) {
    return `/interactions/${id}/${token}/callback` as const;
}

export function webhookMessage(applicationId: string, token: string, messageId: string | "@original") {
    return `/webhooks/${applicationId}/${token}/messages/${messageId}` as const;
}

export function webhook(applicationId: string, token: string) {
    return `/webhooks/${applicationId}/${token}` as const;
}

export function oauth2TokenExchange() {
    return "/oauth2/token" as const;
}

export function applicationGuildCommands(applicationId: string, guildId: string) {
    return `/applications/${applicationId}/guilds/${guildId}/commands` as const;
}

export function applicationCommands(applicationId: string) {
    return `/applications/${applicationId}/commands` as const;
}
