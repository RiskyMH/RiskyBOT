import type { NextPage } from "next";
import Link from "next/link";
import { useCallback, useState } from "react";

import commands from "../assets/commands.json";
import CommandListCommand from "../components/CommandListCommand";
import CommandsBrokenDropdown from "../components/CommandsBrokenDropdown";
import OpenGraph from "../components/OpenGraph";

const commandOrder = ["truth", "dare", "tod", "wyr", "nhie", "paranoia", "random", "help", "invite"];

const CommandsPage: NextPage = () => {
	const [query, setQuery] = useState("");

	const noCharQuery = query.replace("-", " ").replace(/[^a-zA-Z\s]/g, "").toLowerCase();
	const sort = (a, b) =>
		(commandOrder.includes(a.name) ? commandOrder.indexOf(a.name) : 999) -
		(commandOrder.includes(b.name) ? commandOrder.indexOf(b.name) : 999);

	const combined = [
		...commands.filter(c => (c?.bot?.toLowerCase() ?? "riskybot") == noCharQuery).sort(sort),
		...commands.filter(c => c.name.toLowerCase().includes(noCharQuery)).sort(sort),
		...commands.filter(c => c.description.toLowerCase().includes(noCharQuery)).sort(sort),
		...commands.filter(c => c.alias?.toLowerCase().includes(noCharQuery)).sort(sort),
	];

	const filteredCommands = combined.filter(
		(value, index, self) => index === self.findIndex(t => t.name === value.name)
	);

	const onSearchChange = useCallback(event => {
		const query = event.target.value;
		setQuery(query);
	}, []);

	return (
		<div>
			<OpenGraph
				title="RiskyBOT - Commands"
				description="Need help with commands? Here's a list of RiskyBOT's slash commands and how to fix commands not working properly."
			/>
			<div className="mt-24 flex flex-col pb-8 md:pb-32">
				<div className="mx-auto max-w-4xl px-2 text-center md:mt-12">
					<h1 className="text-4xl font-bold">Commands</h1>
					<p className="text-lg">
						RiskyBOT&apos;s commands are built into Discord with Slash Commands.
						<br />
						Type <code>&quot;/&quot;</code> on your keyboard to see them!
					</p>
					<CommandsBrokenDropdown />

				</div>
				<div className="mx-auto mt-6 w-full max-w-5xl rounded-lg p-4">
					<div>
						<input
							className="h-12 w-full rounded-md border border-gray-600 bg-transparent p-4 outline-none transition hover:border-discord-blurple focus:border-2 focus:border-discord-blurple "
							type="text"
							placeholder="🔎 Search commands"
							value={query}
							onChange={onSearchChange}
						/>
					</div>
					<div className="mt-4">
						{filteredCommands.map((command, index) => (
							<CommandListCommand
								{...command}
								key={index}
							/>
						))}
					</div>
					<p className="text-gray-400 italic mt-2">
						The commands with an icon are special dedicated bots, click <Link href="/other-bots" className="text-blue-500 hover:text-blue-600">here</Link> to learn more.
					</p>
				</div>

			</div>
		</div>
	);
};

export default CommandsPage;