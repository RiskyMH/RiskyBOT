import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function IconLink({ href, icon, title, external = false }) {
	return (
		external ? (
			<a className="pr-2 transition hover:opacity-80" href={href} title={title} target="_blank" rel="noopener noreferrer">
				<FontAwesomeIcon icon={icon} />
			</a>
		) : (
			<Link href={href} scroll={false} title={title}>
				<a className="pr-2 transition hover:opacity-80" >
					<FontAwesomeIcon icon={icon} />
				</a>
			</Link>
		)
	);
}
