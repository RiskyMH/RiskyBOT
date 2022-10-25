import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function NavItem({ children, href, external = false }) {
	const classes = "hover:md:bg-white/10 rounded-lg md:p-3 py-3 ease-in-out duration-100";

	return external ? (
		<a href={href} className={classes} target="_blank" rel="noopener noreferrer">
			{children}
			<FontAwesomeIcon className="ml-2" size="xs" icon={faArrowUpRightFromSquare} />
		</a>
	) : (
		<Link href={href} scroll={false} className={classes}>
			{children}
		</Link>
	);
}