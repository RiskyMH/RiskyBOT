import type { NextPage } from "next";
import OpenGraph from "../components/OpenGraph";
import { SERVER_INVITE_URL } from "../constants";

const LegalPage: NextPage = () => {
	return (
		<div>
			<OpenGraph
				title="RiskyBOT - Legal"
				description="RiskyBOT's privacy policy and terms of service explaining how it uses data and how to use the service legally."
			/>
			<a id="privacy" className="scroll-m-24"></a>
			<div className="mt-24 flex flex-col pb-8 md:pb-32">
				<div className="mx-auto w-full max-w-5xl px-4 md:mt-12">
					<div className="text-center">
						<h1 className="text-4xl font-bold">Privacy Policy</h1>
						<p className="text-lg">Effective Date: October 1st, 2022</p>
					</div>
					<div className="mt-4 text-lg">
						<p>
							RiskyBOT (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;) operates the RiskyBOT discord application (the &quot;Service&quot; or &quot;bot&quot;).
						</p>
						<h1 className="mt-4 text-2xl font-semibold">Welcome!</h1>
						<p className="mt-1">
							This Privacy Policy explains what user data we collect and how we use, store, protect, or share it through
							use of our Service. The entire document covers specifics, but below is a human-understandable overview of
							this Privacy Policy.
						</p>
						<ul className="mt-2 ml-10 list-disc">
							<li>
								<b>We care about privacy.</b> We understand the importance of privacy. We are committed to transparency
								of our policies.
							</li>
							<li>
								<b>We don&apos;t sell data.</b> Our Service is sustained through our premium subscription service. You
								aren&apos;t the product.
							</li>
							<li>
								<b>We only store what&apos;s needed.</b> All data stored is what&apos;s required for the Service to
								function.
							</li>
							<li>
								<b>You control your data.</b> You can request a copy of or deletion of any user data we store on you.
							</li>
						</ul>
						<h1 className="mt-4 text-2xl font-semibold">Data Storage Length</h1>
						<p className="mt-1">
							Data is stored as long as required for the Service to function, or until data deletion is requested. More
							specifics on data deletion can be found below!
						</p>
						<h1 className="mt-4 text-2xl font-semibold">Disclosure Of Data</h1>
						<p className="mt-1">
							We care about your data. Data is not shared with third parties other than the services listed below:
						</p>
						<ul className="mt-2 ml-10 list-disc">
							<li>
								<b>Vercel.</b> Vercel is a hosting service provided by Vercel Inc. We use Vercel to receive the bots interactions and execute them. The only data that is stored is logs and Vercel&apos;s data
								collection and processing policies can be found in their{" "}
								<a
									href="https://vercel.com/legal/privacy-policy/"
									className="text-blue-500 hover:text-blue-600"
									target="_blank"
									rel="noopener noreferrer">
									privacy policy
								</a>
								.
							</li>
						</ul>
						<p className="mt-4">Data also may be disclosed in the belief that such action is necessary to:</p>
						<ul className="mt-2 ml-10 list-disc">
							<li>Comply with a legal obligation</li>
							<li>Protect and defend the rights or property of the Service</li>
							<li>Prevent or investigate possible wrongdoing in connection with the Service</li>
							<li>Protect the personal safety of users of the Service or the public</li>
							<li>Protect against legal liability</li>
						</ul>
						<h1 className="mt-4 text-2xl font-semibold">Requesting Data Deletion</h1>
						<p className="mt-1">
							To request your user data deletion, please join our {" "}
							<a
								href={SERVER_INVITE_URL}
								className="text-blue-500 hover:text-blue-600"
								target="_blank"
								rel="noopener noreferrer">
								support Discord server
							</a>{" "}
							and directly message a developer providing your Discord User ID.
							Depending on the data deleted, certain or all features of the Service may become unavailable to you. Users
							requesting premium information deletion may have their servers deactivated without a refund. You are able
							to request data deletion once every 30 days.
						</p>
						<h1 className="mt-4 text-2xl font-semibold">Requesting Your Data</h1>
						<p className="mt-1">
							To request a collection of your user data stored in our database, please join our {" "}
							<a
								href={SERVER_INVITE_URL}
								className="text-blue-500 hover:text-blue-600"
								target="_blank"
								rel="noopener noreferrer">
								support Discord server
							</a>{" "}
							and directly message a developer providing your Discord User ID. You are
							able to request your data once every 30 days, and it may take up to a month to collect your data.
						</p>
						<h1 className="mt-4 text-2xl font-semibold">Contact Us</h1>
						<p className="mt-1">
							If you have any questions, we&apos;re happy to answer them! Please join our {" "}
							<a
								href={SERVER_INVITE_URL}
								className="text-blue-500 hover:text-blue-600"
								target="_blank"
								rel="noopener noreferrer">
								support Discord server
							</a>{" "}
							to ask. We&apos;ll get back to you as soon as possible.
						</p>
					</div>
				</div>
			</div>
			<a id="terms" className="scroll-m-24"></a>
			<div className="flex flex-col pb-8 md:pb-32">
				<div className="mx-auto w-full max-w-5xl px-4 md:mt-12">
					<div className="text-center">
						<h1 className="text-4xl font-bold">Terms Of Service</h1>
						<p className="text-lg">October 1st, 2022</p>
					</div>
					<div className="mt-4 text-lg">
						<p>
							RiskyBOT (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;) operates the RiskyBOT discord application (the &quot;Service&quot; or &quot;bot&quot;).
						</p>
						<h1 className="mt-4 text-2xl font-semibold">Terms</h1>
						<p className="mt-1">
							By accessing or using the service, you agree to be bound to the terms of service, all applicable laws,
							regulations, and agree that you are responsible for compliance with any applicable laws of the place where
							the owner is based. If you do not acknowledge and agree to these terms, you are prohibited from using or
							accessing the service. This website and its components are protected by the applicable copyright and
							trademark law.
						</p>
						{/* <h1 className="mt-4 text-2xl font-semibold">Trademarks & Copyrights</h1>
						<p className="mt-1">
							&quot;RiskyBOT Bot&quot;, and our &quot;TD&quot; logo, are trademarks of RiskyBOT Bot. This
							website, the RiskyBOT Discord bot, and our &quot;TD&quot; logo are copyrights of RiskyBOT Bot.
						</p> */}
						<h1 className="mt-4 text-2xl font-semibold">Limitations</h1>
						<p className="mt-1">
							In no event shall we be liable for any damages (including, without limitation, damages for loss of data or
							profit, or due to business interruption) arising out of the use or inability to use the materials on the
							Service, even if us or a RiskyBOT Bot authorized representative has been notified orally or in
							writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied
							warranties, or limitations of liability for consequential or incidental damages, these limitations may not
							apply to you.
						</p>
						<h1 className="mt-4 text-2xl font-semibold">Accuracy of Materials</h1>
						<p className="mt-1">
							The materials appearing on the Service could include technical, typographical, or photographic errors. We
							do not warrant that any of the materials on its website are accurate, complete or current. We may make
							changes to the materials contained on its website at any time without notice. However we do not make any
							commitment to update the materials.
						</p>
						<h1 className="mt-4 text-2xl font-semibold">Modifications</h1>
						<p className="mt-1">
							We may revise these terms of service or our privacy policy for the Service at any time without notice. By
							using the Service you are agreeing to be bound by the then current version of these terms of service and
							privacy policy.
						</p>
						<h1 className="mt-4 text-2xl font-semibold">Contact Us</h1>
						<p className="mt-1">
							If you have any questions, we&apos;re happy to answer them! Please join our {" "}
							<a
								href={SERVER_INVITE_URL}
								className="text-blue-500 hover:text-blue-600"
								target="_blank"
								rel="noopener noreferrer">
								support Discord server
							</a>{" "}
							to ask. We&apos;ll get back to you as soon as possible.
						</p>
					</div>
				</div>
			</div>
		</div >

	);
};

export default LegalPage;
