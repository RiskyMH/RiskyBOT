import "./discord-message.css";
import { Avatars, Profile, resolveAvatar } from "../options.mjs";
import { Children, PropsWithChildren } from "react";
import { AuthorInfo } from "../author-info/author-info";
import Ephemeral from "../svgs/ephemeral";
import clsx from "clsx";

export interface DiscordMessageProps {

    /**
     * The message author's username.
     * @default 'User'
     */
    author?: string;

    /**
     * The message author's avatar. Can be an avatar shortcut, relative path, or external link.
     */
    avatar?: Avatars;

    /**
     * Whether the message author is a bot or not.
     * Only works if `server` is `false` or `undefined`.
     */
    bot?: boolean

    /**
     * Whether the message author is a server crosspost webhook or not.
     * Only works if `bot` is `false` or `undefined`.
     */
    server?: boolean

    /**
     * Whether the bot is verified or not.
     * Only works if `bot` is `true`
     */
    verified?: boolean

    /**
     * Whether the author is the original poster.
     */
    op?: boolean

    /**
     * The message author's primary role color. Can be any [CSS color value](https://www.w3schools.com/cssref/css_colors_legal.asp).
     */
    roleColor?: string

    /**
     * The message author's role icon URL.
     */
    roleIcon?: string

    /**
     * Whether the message has been edited or not.
     */
    edited?: boolean,

    /**
     * Whether to highlight this message.
     */
    highlight?: boolean,

    /**
     * Whether to make this message ephemeral.
     */
    ephemeral?: boolean,

    /**
     * The timestamp to use for the message date.
     */
    timestamp?: string | Date,

    /**
     * Whether to use 24-hour format for the timestamp.
     */
    twentyFour?: boolean,

    /**
     * Any extra classes to apply to the component.
     */
    className?: string;

}

export function DiscordMessage({ children, className, author, avatar, bot, server, verified, op, roleColor, roleIcon, edited, highlight, ephemeral, timestamp, twentyFour }: PropsWithChildren<DiscordMessageProps>) {

    author ||= "User";
    avatar = resolveAvatar(avatar);

    const arrayChildren = Children.toArray(children);

    // const hasThread: boolean =
    //     arrayChildren.some((child): boolean => {
    //         // @ts-expect-error ts doesn't understand this
    //         return child?.tagName?.toLowerCase() === "discord-thread";
    //     });
    // TODO: get data from a child component
    const hasThread = false;

    const profile: Profile = {
        avatar,
        author,
        bot,
        server,
        verified,
        op,
        roleColor,
        roleIcon
    };

    timestamp = timestamp ? new Date(timestamp) : new Date();
    const formatedDate = twentyFour ? timestamp.toLocaleTimeString("en-US", { hour12: false }) : timestamp.toLocaleTimeString("en-US", { hour12: true });

    // TODO: get data from parent component
    const compactMode = false;

    return (
        <div className={clsx("discord-message", className, {
            "discord-highlight-mention": highlight,
            "discord-message-has-thread": hasThread,
            "discord-highlight-ephemeral": ephemeral
        })} >

            <slot name="reply"></slot>

            <div className="discord-message-inner">
                {/* If compact mode */}
                <span className="discord-compact discord-message-timestamp">{formatedDate}</span>
                <div className="discord-author-avatar">
                    <img src={profile.avatar} alt={profile.author} />
                </div>
                <div className="discord-message-content">
                    {/* If not compact mode */}
                    <div className="discord-not-compact">
                        <AuthorInfo
                            author={profile.author ?? ""}
                            bot={profile.bot ?? false}
                            server={profile.server ?? false}
                            verified={profile.verified ?? false}
                            op={profile.op ?? false}
                            roleColor={profile.roleColor ?? ""}
                            roleIcon={profile.roleIcon ?? ""}
                            roleName={profile.roleName ?? ""}
                            compact={compactMode}
                        />
                        <span className="discord-message-timestamp">{formatedDate}</span>
                    </div>
                    <div className="discord-message-body">
                        {/* If not compact mode */}
                        <div className="discord-not-compact">
                            <AuthorInfo
                                author={profile.author ?? ""}
                                bot={profile.bot ?? false}
                                server={profile.server ?? false}
                                verified={profile.verified ?? false}
                                op={profile.op ?? false}
                                roleColor={profile.roleColor ?? ""}
                                roleIcon={profile.roleIcon ?? ""}
                                roleName={profile.roleName ?? ""}
                                compact={compactMode}
                            />
                        </div>
                        <span className="discord-message-markup">
                            {arrayChildren.filter(child => typeof (child) === "string")}
                        </span>
                        {edited ? <span className="discord-message-edited">(edited)</span> : ""}
                    </div>
                    <div className="discord-message-compact-indent">
                        {arrayChildren.filter(child => typeof (child) !== "string")}

                        {/* <slot name="embeds"></slot>
                        <slot name="attachments"></slot>
                        <slot name="components"></slot>
                        <slot name="reactions"></slot>
                        <slot name="thread"></slot> */}

                        {ephemeral && (
                            <div className="discord-message-ephemeral">
                                <Ephemeral className="discord-message-ephemeral-icon" />
                                Only you can see this • <span className="discord-message-ephemeral-link">Dismiss message</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiscordMessage;