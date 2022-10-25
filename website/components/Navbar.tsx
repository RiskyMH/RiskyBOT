import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRef } from "react";
import { useEffect } from "react";
import { BOT_INVITE_URL, SERVER_INVITE_URL } from "../constants";
import Logo from "./Logo";
import NavItem from "./NavItem";

export default function Navbar() {
	const collapseElement = useRef(null);

	useEffect(() => {
		window.addEventListener("click", e => collapseMenu(e, true));
	}, []);

	function collapseMenu(_, noOpen = false) {
		const elem = collapseElement.current;
		if (!elem) return;
		if (elem.clientHeight) {
			elem.style.height = 0;
		} else if (!noOpen) {
			elem.style.height = elem.scrollHeight + "px";
		}
	}

	return (
		<div className="flex justify-center">
			<div className="fixed top-0 z-[100] py-3 px-3 md:text-lg lg:pl-20 md:pl-10 lg:pr-20 md:pr-10 bg-[#10182F] shadow-md position shadow-black/50 w-full rounded-b-lg">
				<div className="flex items-center">
					<Link
						href="/"
						title="Home"
						className="hover:md:bg-white/10 rounded-lg rounded-l-3xl  md:p-2 flex items-center ease-in-out duration-100">

						<Logo className="h-10 w-10" />
						<p className="ml-3 font-semibold pr-10 md:mr-1 lg:mr-[-10px]">RiskyBOT</p>
						{/* <NavItem href="/" important={true}>RiskyBOT</NavItem> */}

					</Link>
					<div className="ml-auto flex items-center md:hidden mr-3">
						<button className="text-xl" onClick={collapseMenu} aria-label="Open menu">
							<FontAwesomeIcon icon={faBars} />
						</button>
					</div>
					<div className="hidden w-full items-center md:flex">
						<div className="ml-3">
							<NavItem href="/">Home</NavItem>
							<NavItem href="/commands">Commands</NavItem>
							<NavItem href={SERVER_INVITE_URL} external>
								Support
							</NavItem>
						</div>
						<div className="ml-auto flex items-center" >
							<a
								href={BOT_INVITE_URL}
								className="pr-4  pl-1 items-center rounded-lg bg-discord-blurple px-2 py-2 font-semibold text-white transition hover:bg-discord-blurple/25 hover:text-white white border-2  border-discord-blurple active::text-white selection:text-red"
								target="_blank"
								rel="noopener noreferrer">
								<FontAwesomeIcon className="w-10" icon={faDiscord} />
								Add RiskyBOT
							</a>
						</div>
					</div>
				</div>
				<div className="h-0 overflow-hidden transition-[height] duration-300 md:hidden" ref={collapseElement}>
					<div className="mtr-2 flex flex-col pl-[3.89rem]">
						<NavItem href="/">Home</NavItem>
						<NavItem href="/commands">Commands</NavItem>
						<NavItem href={SERVER_INVITE_URL} external>
							Support
						</NavItem>
						<div className="flex items-center ml-[-28px]">
							<NavItem href={BOT_INVITE_URL} external>
								<FontAwesomeIcon icon={faDiscord} className="mr-1" />
								Add RiskyBOT
							</NavItem>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}