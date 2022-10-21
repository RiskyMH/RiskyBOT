import Link from "next/link";

export default function FooterLink({ children, href, external = false }) {
	const classes = "my-1 text-sm opacity-80 hover:opacity-100 transition";

	return external ? (
		<a href={href} className={classes} target="_blank" rel="noopener noreferrer">
			{children}
		</a>
	) : (
		<Link href={href} scroll={false}>
			<a className={classes}>{children}</a>
		</Link>
	);
}
