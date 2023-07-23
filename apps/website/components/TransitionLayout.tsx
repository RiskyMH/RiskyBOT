import { useEffect, useState } from "react";

export default function TransitionLayout({ children, location }) {
	const [currentRoute, setCurrentRoute] = useState(location);
	const [displayChildren, setDisplayChildren] = useState(children);
	const [transitionStage, setTransitionStage] = useState("fadeIn");

	useEffect(() => {
		if (location !== currentRoute) setTransitionStage("fadeOut");
	}, [currentRoute, location]);

	return (
		<div
			onTransitionEnd={() => {
				if (transitionStage === "fadeOut") {
					setDisplayChildren(children);
					setCurrentRoute(location);
					setTransitionStage("fadeIn");
					window.scrollTo(0, 0);
				}
			}}
			className={`transition-opacity duration-200 ${transitionStage === "fadeOut" ? "opacity-0" : ""} `}>
			{displayChildren}
		</div>
	);
}
