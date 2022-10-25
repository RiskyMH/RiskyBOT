import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Button({ children, href = "", className = "", icon = null, external = false }) {
    const classes = `hover:bg-discord-blurple/30 bg-discord-blurple/25 border-2 border-discord-blurple font-semibold text-white py-3 px-4 transition rounded-lg inline-block ${className}`;

    return external ? (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
            {icon ? <FontAwesomeIcon className="mr-2" icon={icon} /> : ""}
            {children}
        </a>
    ) : (
        (<Link href={href} scroll={false} className={classes}>
            {/* <button className={classes} onClick={onClick}> */}

            {icon ? <FontAwesomeIcon className="mr-2" icon={icon} /> : ""}
            {children}

            {/* </button> */}
        </Link>)
    );
}