import VerifiedTick from "../svgs/verified-tick";

interface AuthorInfoProps {
    /**
     * The name of the author
     */
    author: string;
    /**
     * Whether this author is a bot. Only works if `server` is `false` or `undefined`.
     */
    bot: boolean;
    /**
     * Whether this author is a `server` crosspost webhook. Only works if `bot` is `false` or `undefined`.
     */
    server: boolean;
    /**
     * Whether this author is the original poster.
     */
    op: boolean;
    /**
     * The colour of the author, which comes from their highest role
     */
    roleColor: string;
    /**
     * The role icon of the author, which comes from their highest role
     */
    roleIcon: string;
    /**
     * The role name of the author, which comes from their highest role
     */
    roleName: string;
    /**
     * Whether this bot is verified by Discord. Only works if `bot` is `true`
     */
    verified: boolean;
    /**
     * Whether to reverse the order of the author info for compact mode.
     */
    compact: boolean;
}

export function AuthorInfo({ author, bot, server, op, roleColor, roleIcon, roleName, verified, compact }: AuthorInfoProps) {
    return (
        <span className="discord-author-info">
            {/* TODO: use css for compact mode */}
            {!compact && (
                <div>
                    <span className="discord-author-username" style={{ color: roleColor }}>
                        {author}
                    </span>
                    {roleIcon && <img className="discord-author-role-icon" src={roleIcon} height="20" width="20" alt={roleName} draggable={false} />}
                </div>
            )}

            {/* If bot is true then we need to render a Bot tag */}
            {bot && !server && (
                <span className="discord-application-tag">
                    {/* If verified is true then a verified checkmark should be prefixed */}
                    {verified && <VerifiedTick />}
                    Bot
                </span>
            )}
            {server && !bot && <span className="discord-application-tag">Server</span>}
            {op && <span className="discord-application-tag discord-application-tag-op">OP</span>}
            {compact && (
                <span className="discord-author-username" style={{ color: roleColor }}>
                    {author}
                </span>
            )}
        </span>
    );
}