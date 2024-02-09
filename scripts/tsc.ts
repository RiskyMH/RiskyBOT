/* eslint-disable no-console */
/* eslint-disable unicorn/no-process-exit */

// a file to run tsc in every project
import pc from "picocolors";
import { applyHyperlink } from "@riskybot/tools";
import CIFormat from "./ci-format.ts";
import workspaces from "./glob-workspaces.ts";
import { existsSync } from "node:fs";

const fileNoPrettyMessageRegex = /(.*)\((\d+),(\d+)\):\s+(error|warning|info)\s+(TS\d+)\s*:\s*(.*)/;
// error TS18003: No inputs were found in config file './RiskyBOT/apps/bot/tsconfig.json'. Specified 'include' paths were '["src/*"]' and 'exclude' paths were '["../../dist","../../node_modules"]'.
const basicErrorRegex = /^error\s+(TS\d+)\s*:\s*(.*)/;


const main = async () => {
    const ciPrint = new CIFormat({
        initialMessage: `Running tsc in ${workspaces.size} projects.`,
    });

    const workspacesWithTests = new Set(workspaces);
    for (const workspace of workspacesWithTests) {
        // if it has tests folder, add it to the list
        if (existsSync(workspace + "/tests")) {
            workspacesWithTests.add(workspace + "/tests");
        }
    }

    ciPrint.stats.completed.max = workspacesWithTests.size;
    ciPrint.stats.completed.name = "workspaces";
    ciPrint.statsPrint();

    await Promise.all([...workspacesWithTests].map(async (path) => {
        const proc = Bun.spawn({ cmd: ["tsc", "--noEmit"], cwd: path });

        const text = await new Response(proc.stdout).text();
        const results = text.split("\n");
        
        for (const result of results) {
            if (basicErrorRegex.test(result)) {
                ciPrint.statsPrint(pc.red(result));
                ciPrint.stats.errors += 1;
            }

            if (result.startsWith("../")) continue;

            const match = result.match(fileNoPrettyMessageRegex);

            if (match) {
                const [, file, line, column, type, code, message] = match;
                const linkedCode = applyHyperlink(code, `https://typescript.tv/errors/#${code}`);
                ciPrint.addEntry({ path: path + "/" + file, line: Number(line), column: Number(column), type, message, code: linkedCode });
            }
        }

        ciPrint.stats.completed.value += 1;
        ciPrint.statsPrint();

    }));

    ciPrint.end();

};


main();

