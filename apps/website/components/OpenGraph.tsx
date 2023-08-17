import { addBasePath } from "next/dist/client/add-base-path";
import Head from "next/head";
import { useRouter } from "next/router";
import { BOT_INVITE_URL, SERVER_INVITE_URL } from "../constants";

export default function OpenGraph({
	title = "RiskyBOT",
	description = "Add RiskyBOT to your Discord server! Featuring heaps of commands that are all fun and useful, RiskyBOT is the perfect way to make servers with friends more fun and exciting.",
}) {
	const router = useRouter();
	const url = `https://bot.riskymh.dev${router.asPath}`;

	// application/ld+json metadata
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Organization",
		url: "https://bot.riskymh.dev",
		logo: "https://bot.riskymh.dev/robot.png",
		description: "Add RiskyBOT to your Discord server! Featuring heaps of commands that are all fun and useful, RiskyBOT is the perfect way to make servers with friends more fun and exciting.",
		// thumbnailUrl: "https://bot.riskymh.dev/robot.png",
		sameAs: [BOT_INVITE_URL, SERVER_INVITE_URL, "https://github.com/RiskyMH/RiskyBOT"],
		name: "RiskyBOT",
		member: {
			"@type": "OrganizationRole",
			member: {
				"@type": "Person",
				name: "RiskyMH"
			},
			roleName: "Owner"
		}
	};

	const simpleTitle = title === "RiskyBOT" ? title : title.replace("RiskyBOT - ", "RiskyBOT | ");
	const siteName = title === "RiskyBOT" ? "" : "";

	return (
		<Head>
			<title>{title}</title>
			<meta key="description" name="description" content={description} />
			<meta key="theme-color" name="theme-color" content="#5865F2" />
			<meta key="format-detection" name="format-detection" content="telephone=no" />
			<link rel="canonical" href={url} />
			<meta content="text/html; charset=UTF-8" name="Content-Type" />
			<link rel="icon" href={addBasePath("/robot.png")} />
			<link rel="icon" type="image/svg" href={addBasePath("/robot.svg")} />
			<link rel="apple-touch-icon" href={addBasePath("/robot.png")} />
			<link rel="shortcut icon" href={addBasePath("/robot.svg")} />

			{/* Twitter */}
			<meta name="twitter:card" content="summary" key="twitter-card" />
			{/* <meta name="twitter:title" content={simpleTitle} key="twitter-title" />
			<meta name="twitter:site" content="RiskyBOT" key="twitter-site" />
			<meta name="twitter:description" content={description} key="twitter-desc" />
			<meta name="twitter:image" content={addBasePath("/robot.png")} key="twitter-image" /> */}

			{/* Open Graph */}
			<meta property="og:url" content={url} key="og-url" />
			<meta property="og:image" content={addBasePath("/robot.png")} key="og-image" />
			{/* <meta property="og:image" content={addBasePath("/robot.svg")} key="og-image" /> */}
			<meta property="og:title" content={simpleTitle} key="og-title" />
			<meta property="og:site_name" content={siteName} key="og-site_name" />
			<meta property="og:description" content={description} key="og-desc" />
			<meta property="og:locale" content="en_US" key="og-locale" />

			{/* application/ld+json metadata  */}
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} key="og-ld-json" />

		</Head>
	);
}
