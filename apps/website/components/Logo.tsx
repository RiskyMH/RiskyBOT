import { addBasePath } from "next/dist/client/add-base-path";
import type { HTMLProps } from "react";

export default function Logo(props: { variation?: "imgen" | "normal" } & HTMLProps<HTMLImageElement>) {
	return (
		props.variation === "imgen" ? (
			<img src={addBasePath("/imggen_bot.svg")} className="rounded-full" alt="Logo" {...props} width="278" height="241" />
		) : (
			<img src={addBasePath("/robot.svg")} alt="Logo" {...props} width="278" height="241" />
		)
	);
}