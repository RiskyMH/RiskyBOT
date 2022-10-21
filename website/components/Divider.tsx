export default function divider({ type, className = "" }) {
	if (type === "curveUp") {
		return (
			<svg
				className={`hidden md:block ${className}`}
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				width="100%"
				height="100"
				viewBox="0 0 100 100"
				preserveAspectRatio="none">
				<path d="M0 100 C 20 0 50 0 100 100 Z"></path>
			</svg>
		);
	} else if (type === "curveDown") {
		return (
			<svg
				className={`hidden md:block ${className}`}
				id="curveDownColor"
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				width="100%"
				height="100"
				viewBox="0 0 100 100"
				preserveAspectRatio="none">
				<path d="M0 0 C 50 100 80 100 100 0 Z"></path>
			</svg>
		);
	}
}
