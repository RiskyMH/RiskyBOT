import { ESLint } from "eslint";
import path from "node:path";
import CIFormat from "./ci-format.ts";
import { Glob } from "bun";
import { applyHyperlink } from "@riskybot/tools";
import workspaces from "./glob-workspaces.ts";


const main = async () => {
    const ciPrint = new CIFormat({
        initialMessage: `Running eslint in ${workspaces.size} projects.`,
    });

    const globFiles = new Set<string>();

    // add all files to globFiles
    const files = new Glob("./{apps,packages}/*/{src,tests}/**/*.{ts,tsx}").scan();
    for await (const file of files) {
        if (file.endsWith(".d.ts")) continue;
        globFiles.add(file);
    }

    ciPrint.stats.completed.max = globFiles.size;
    ciPrint.stats.completed.name = "files";

    const eslint = new ESLint({ 
        cwd: path.join(import.meta.dir, "../"), 
        cache: true,
    });
    ciPrint.statsPrint();

    // go through each file and use Bun.file to get and use eslintfile on it
    await Promise.all([...globFiles].map(async (fileName) => {
        const file = await Bun.file(fileName).text();
        const results = await eslint.lintText(file, { filePath: fileName });

        for (const result of results[0].messages) {
            const rulesMetadata = eslint.getRulesMetaForResults(results);
            
            let code = result.ruleId ?? "unknown rule";
            if (result.ruleId && rulesMetadata[result.ruleId]?.docs?.url) {
                code = applyHyperlink(code, rulesMetadata[result.ruleId]!.docs!.url!);
            } else {
                console.log(result);
            }

            ciPrint.addEntry({
                path: fileName,
                line: result.line,
                column: result.column,
                type: result.severity === 2 ? "error" : "warning",
                message: result.message,
                code
            });

        }
        if (results[1]) {
            throw new Error("More than one result");
        }

        ciPrint.stats.completed.value += 1;
        ciPrint.statsPrint();

    }));
    ciPrint.end();
};

main();
