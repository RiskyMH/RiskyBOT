import OpenGraph from "../components/OpenGraph";
import Link from "next/link";
import { IMGEN_INVITE_URL } from "../constants";
import Button from "../components/Button";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import type { NextPage } from "next";

const OtherBotsPage: NextPage = () => {
	return (
		<div>
			<OpenGraph
				title="RiskyBOT - Other Bots"
				description="RiskyBOT's other bots that are more specialized then the main bot. This includes a bot dedicated to image generation."
			/>
			<a id="imgen" className="scroll-m-24"></a>
			<div className="mt-24 flex flex-col pb-8 md:pb-32" >
				<div className="mx-auto w-full max-w-5xl px-4 md:mt-12">
					<div className="text-center">
						<h1 className="text-4xl font-bold">Image Generation</h1>
						<p className="text-lg">A bot that generates images using your input.</p>

						<Button href={IMGEN_INVITE_URL} external icon={faDiscord} className="p-2 mt-2 text-center w-full sm:w-max">
							Add Image Generate
						</Button>
					</div>
					<div className="mt-4 text-lg">
						<p>
							This special bot is a collection of commands that generate images using your input. It is useful and still follows the same <Link href="/legal" className="text-blue-500 hover:text-blue-600">privacy policy</Link> as the main bot.
						</p>
						<h1 className="mt-4 text-2xl font-semibold">Title</h1>
						<p className="mt-1">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam luctus sapien at arcu congue, ac imperdiet tortor tempor. Nulla sit amet hendrerit eros. Aenean laoreet non risus id fringilla. Vestibulum vel nunc in felis tincidunt ultricies. Pellentesque vitae libero dui. Nulla purus lacus, pulvinar eu congue eu, tincidunt nec lorem. Suspendisse interdum odio nec erat ullamcorper, ac elementum eros tincidunt. Aenean rhoncus feugiat dictum. Sed luctus elit imperdiet, volutpat est et, porttitor nibh. Vestibulum nec sapien pharetra quam iaculis fringilla. Integer vehicula orci eu quam placerat, a condimentum purus convallis. Praesent commodo leo at urna faucibus, varius consequat nisl laoreet. Phasellus lacinia egestas turpis, eu cursus eros vulputate in. Integer semper fermentum posuere. Sed pulvinar sodales auctor.
						</p>
						<ul className="mt-2 ml-10 list-disc">
							<li>
								<b>List 1 </b>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce in finibus mi, nec tincidunt arcu. In pellentesque non mauris sed sagittis. Donec sit amet dolor.
							</li>
							<li>
								<b>List 2 </b>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce in finibus mi, nec tincidunt arcu. In pellentesque non mauris sed sagittis. Donec sit amet dolor.
							</li>
							<li>
								<b>List 3 </b>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce in finibus mi, nec tincidunt arcu. In pellentesque non mauris sed sagittis. Donec sit amet dolor.
							</li>
						</ul>
						<br />
					</div>
				</div>
			</div>
			<a id="bot2" className="scroll-m-24"></a>
			<div className="flex flex-col pb-8 md:pb-32">
				<div className="mx-auto w-full max-w-5xl px-4 md:mt-12">
					<div className="text-center">
						<h1 className="text-4xl font-bold">Another Bot</h1>
						<p className="text-lg">A bot that xxx.</p>

						<Button href={IMGEN_INVITE_URL} external icon={faDiscord} className="p-2 mt-2 text-center w-full sm:w-max">
							Add bot!
						</Button>
					</div>
					<div className="mt-4 text-lg">
						<p>
							This special bot is a collection of commands xxx. It is useful and still follows the same <Link href="/legal" className="text-blue-500 hover:text-blue-600">privacy policy</Link> as the main bot.
						</p>
						<h1 className="mt-4 text-2xl font-semibold">Title</h1>
						<p className="mt-1">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam luctus sapien at arcu congue, ac imperdiet tortor tempor. Nulla sit amet hendrerit eros. Aenean laoreet non risus id fringilla. Vestibulum vel nunc in felis tincidunt ultricies. Pellentesque vitae libero dui. Nulla purus lacus, pulvinar eu congue eu, tincidunt nec lorem. Suspendisse interdum odio nec erat ullamcorper, ac elementum eros tincidunt. Aenean rhoncus feugiat dictum. Sed luctus elit imperdiet, volutpat est et, porttitor nibh. Vestibulum nec sapien pharetra quam iaculis fringilla. Integer vehicula orci eu quam placerat, a condimentum purus convallis. Praesent commodo leo at urna faucibus, varius consequat nisl laoreet. Phasellus lacinia egestas turpis, eu cursus eros vulputate in. Integer semper fermentum posuere. Sed pulvinar sodales auctor.
						</p>
						<ul className="mt-2 ml-10 list-disc">
							<li>
								<b>List 1 </b>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce in finibus mi, nec tincidunt arcu. In pellentesque non mauris sed sagittis. Donec sit amet dolor.
							</li>
							<li>
								<b>List 2 </b>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce in finibus mi, nec tincidunt arcu. In pellentesque non mauris sed sagittis. Donec sit amet dolor.
							</li>
							<li>
								<b>List 3 </b>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce in finibus mi, nec tincidunt arcu. In pellentesque non mauris sed sagittis. Donec sit amet dolor.
							</li>
						</ul>
						<br />
					</div>
				</div>
			</div>
		</div >
	);
};

export default OtherBotsPage;