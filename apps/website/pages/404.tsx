import type { NextPage } from "next";
import Button from "../components/Button";
import OpenGraph from "../components/OpenGraph";
import { SERVER_INVITE_URL } from "../constants";

const NotFoundPage: NextPage = () => {
	return (
		<div className="mt-48 pb-8 md:mt-56 md:pb-32">
			<OpenGraph
				title="RiskyBOT - 404"
				description="This is an unknown page on the RiskyBOT website."
			/>

			<div className="mx-auto max-w-4xl px-2 text-center">
				<h1 className="text-8xl font-bold">404</h1>
				<p className="text-2xl">The requested URL was not found.</p>
				<div className="mt-4">
					<Button href="/" className="px-4 py-2 text-white">
						Home Page
					</Button>
					<Button href={SERVER_INVITE_URL} className="mt-2 px-4 py-2 text-white sm:ml-2 sm:mt-0" external>
						Get Support
					</Button>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;