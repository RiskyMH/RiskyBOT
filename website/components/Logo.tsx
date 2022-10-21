import { addBasePath } from "next/dist/client/add-base-path";

export default function Logo(props) {
	return (
		props.variation === "imgen" ? (
			<img src="https://cdn.discordapp.com/avatars/959340277385007154/b7863d0a698ea22585749b44bd971b6b.png?size=512" className="rounded-full" alt="Logo" {...props} width="278" height="241"  />
		) : (
			<img src={addBasePath("/robot.svg")} alt="Logo" {...props} width="278" height="241"  />
		)
	);
}