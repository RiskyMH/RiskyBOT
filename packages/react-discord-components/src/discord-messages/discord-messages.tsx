import "./discord-messages.css";
import type { PropsWithChildren } from "react";
import clsx from "clsx";

export interface DiscordMessagesProps {
    /**
     * Whether to use light theme or not.
     * @default false
     */
    lightTheme?: boolean,

    /**
     * Whether to use compact mode or not.
     * @default false
     */
    compactMode?: boolean,

    /**
     * Whether to exclude the background or not.
     * @default false
     */
    noBackground?: boolean

    /**
     * Any extra classes to apply to the component.
     */
    className?: string;
}

export function DiscordMessages({ children, lightTheme, compactMode, noBackground, className }: PropsWithChildren<DiscordMessagesProps>) {

    return (
        <div className={clsx("discord-messages", className,
            {
                "discord-light-theme": lightTheme,
                "discord-compact-mode": compactMode,
                "discord-no-background": noBackground,
            },            
        )} >
            {children}
        </div>
    );
}

export default DiscordMessages;