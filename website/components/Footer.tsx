import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLegal } from "@fortawesome/free-solid-svg-icons";
import { SERVER_INVITE_URL } from "../constants";

import Divider from "./Divider";
import IconLink from "./IconLink";

export default function Footer() {
	return (
		<div>
			<Divider type="curveUp" className="-mt-32 fill-theme-d1" />
			<footer className=" pb-5 text-center bg-theme-d1 sm:text-left">
				<div className="mx-auto max-w-7xl px-6">
					{/* Footer Content */}
					<div className="py-8 sm:flex">
						<div className="flex w-full flex-col justify-between md:flex-row">
							<div className="flex flex-col p-1">
								<h1 className="text-lg font-bold">Add fun to your Discord server!</h1>
								<p className="text-gray-300">Featuring lots of different functions</p>
								<p className="mt-1 text-2xl">
									<IconLink href={SERVER_INVITE_URL} title="Support" icon={faDiscord} external />
									<IconLink href="https://github.com/RiskyMH/RiskyBOT" title="GitHub" icon={faGithub} external />
									<IconLink href="/legal" title="Legal" icon={faLegal} />
								</p>
							</div>

							{/* <div className="flex flex-col p-1">
								<h2 className="font-bold uppercase">Product</h2>
								<FooterLink href="/invite" external>
									Invite Bot
								</FooterLink>
								<FooterLink href="https://github.com/RiskyMH/RiskyBOT" external>
									GitHub
								</FooterLink>
								<FooterLink href="https://github.com/RiskyMH/RiskyBOT" external>
									FooterLink
								</FooterLink>
							</div> */}

							{/* <div className="flex flex-col p-1">
								<h2 className="font-bold uppercase">Legal</h2>
								<FooterLink href="/privacy">Privacy</FooterLink>
								<FooterLink href="/terms">Terms</FooterLink>
							</div> */}

						</div>
					</div>

					{/* Copyright */}
					<div className="border-t border-gray-400 sm:w-full">
						<p className="ml-2 pt-4">&copy; 2020-{new Date().getFullYear()} RiskyMH. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
