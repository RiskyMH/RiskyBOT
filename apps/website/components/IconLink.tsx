import Link from "next/link";
import type { PropsWithChildren } from "react";

export default function IconLink({ href, title, icon: Icon, external = false }: PropsWithChildren<{ href: string, title: string, icon?: ({ className }: { className?: string }) => JSX.Element, external?: boolean }>) {
    return external ? (
        <a className="pr-2 transition hover:opacity-80" href={href} title={title} target="_blank" rel="noopener noreferrer">
            {Icon && <Icon />}
        </a>
    ) : (
        <Link
            href={href}
            scroll={false}
            title={title}
            className="pr-2 transition hover:opacity-80"
        >
            {Icon && <Icon />}
        </Link>
    );
}
