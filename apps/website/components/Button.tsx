import Link from "next/link";
import type { PropsWithChildren } from "react";

export default function Button({ children, href = "", className = "", icon: Icon = FakeIcon, external = false }: PropsWithChildren<{ href: string, className?: string, icon?: ({ className }: { className?: string }) => JSX.Element, external?: boolean }>) {
    const classes = `hover:bg-discord-blurple/30 bg-discord-blurple/25 border-2 border-discord-blurple font-semibold text-white py-3 px-4 transition rounded-lg inline-block ${className}`;

    return external ? (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
            <Icon className="mr-2" />
            {children}
        </a>
    ) : (
        <Link href={href} scroll={false} className={classes}>
            {/* <button className={classes} onClick={onClick}> */}
            <Icon className="mr-2" />
            {children}
            {/* </button> */}
        </Link>
    );
}

function FakeIcon() {
    return <></>;
}