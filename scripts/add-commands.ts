
import path from "node:path";
import { Glob } from "bun";
import addCommandsToWebsite from "./add-commands-website.ts";

const bots = [
    "./apps/riskybot",
    "./apps/imgen"
];


const files = new Glob("./src/commands/**/*.{js,ts}");

type CommandList = {
    name: string;
    file: string;
    folder: string;
}[];


for (const bot of bots) {
    const cwd = path.join(import.meta.dir, "../", bot);
    const commandListFile = path.join(cwd, "src/commands.ts");
    // const commandList = await Bun.file(commandListFile).text();
    // console.log(commandList);
    const commandList: CommandList = [];

    // make a file for the imports (export * from "./file.ts")
    for await (const file of files.scan({ cwd })) {
        if (/^(?:.*[\\/])?_[^\\/]*$/.test(file)) continue;
        const command = await Bun.file(path.join(cwd, file)).text();
        // make regex to get the name of the command
        // ie `export default class Ping extends Command {` -> `Ping`
        const name = command.match(/export default class (\w+) extends Command {/)?.[1];

        // use regex to get folder name
        // ie `./src/commands/ping.ts` -> `./commands`
        // ie `./src/commands/owner/eval.ts` -> `./commands/owner`
        const folder = file.match(/(.*\/)?[^/]+$/)?.[1];
        if (!folder || !name) continue;

        commandList.push({
            name: name!,
            file: file
                .replace("./src/", "./")
                .replace(".ts", ".ts"),
            folder: folder.replace("src/", "")
        });
    }

    const importsString = commandList.map(c => `import ${c.name} from "${c.file}";`).join("\n");

    let commandsString = "";
    let lastFolder = "";
    for (const command of commandList) {
        if (command.folder !== lastFolder) {
            commandsString += lastFolder == "" ? "" : "\n\n";
            commandsString += `    // ${command.folder}`;
            lastFolder = command.folder;
        }
        commandsString += `\n    ${command.name},`;
    }


    const fileString = `${importsString}
import type { Command } from "@riskybot/command";

export const commands: typeof Command[] = [
${commandsString}
];

export default commands;
`;

    Bun.write(commandListFile, fileString);

    // run deploy commands
    if (Bun.argv.includes("--deploy")) await import(cwd + "/src/deploy-commands.ts");
    addCommandsToWebsite(path.basename(bot));
}

console.log("Done!")