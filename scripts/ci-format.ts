/* eslint-disable no-console */
/* eslint-disable unicorn/no-process-exit */

// a file to run tsc in every project
import pc from "picocolors";
import { clearLine, cursorTo } from "node:readline";
import { supportsHyperlinks } from "@riskybot/tools";

// ([^\\s].*)[\\(:](\d+):(\d+)(?::\s+|\s+-\s+)(error|warning|info)\s*:\s*(.*)\s*\((TS\d+)\)$


function fancyPrint(stickyLine: string, newLine?: string) {
    // clear the last line, print new line, and finally print the sticky line

    clearLine(process.stdout, 0);
    cursorTo(process.stdout, 0);
    if (newLine) process.stdout.write(newLine + "\n");
    process.stdout.write(stickyLine);

}


export default class CIFormat {

    readonly startTime = Date.now();

    readonly stats = {
        errors: 0,
        warnings: 0,
        completed: {
            name: "files",
            value: 0,
            max: 0
        },
    };

    constructor({ initialMessage }: { initialMessage: string}) {
        console.log(initialMessage);
    }

    statsPrint(aboveLine?: string) {
        if (!supportsHyperlinks) {
            if (aboveLine) console.log(aboveLine);
            return;
        }

        // show the done stats 
        const line = `Checked ${pc.bold(this.stats.completed.value)}/${this.stats.completed.max} ${this.stats.completed.name}. Found ${pc.bold(this.stats.errors)} errors and ${(this.stats.warnings)} warnings.`;
        fancyPrint(pc.gray(line), aboveLine);
    }

    public async addEntry({ path, line, column, type, code, message }: { path: string, line: number, column: number, type: string, code: string, message: string }) {
        const elements = [
            // ./apps/bot/src/api/[bot].ts
            pc.cyan(path) +
            // :12:34:
            pc.gray(":") + pc.yellow(line) + pc.gray(":") + pc.yellow(column) + pc.gray(":"),

            // error
            (type === "error" ? pc.red("error") :type === "warning" ? pc.yellow("warning") :  type) + pc.gray(":"),

            // Expected 0 arguments, but got 1.
            pc.bold(message),

            // TS2554: 
            code ? pc.gray("(" + code + ")") : "",
        ];
        const fullMessage = elements.join(" ");
        this.statsPrint(fullMessage);

        if (process.env.GITHUB_ACTIONS) {
            const formatted = `::${type} file=${path},line=${line},col=${column},title=yes::${message} (${code})`
            console.log(formatted);
        }

        switch (type) {
            case "error": {
                this.stats.errors += 1;
                break;
            }
            case "warning": {
                this.stats.warnings += 1;
                break;
            }
        }
    }

    public end() {
        fancyPrint(`\n${pc.gray(`[${pc.bold(timeDiff(this.startTime) + "s")}]`)} Found ${pc.bold(this.stats.errors)} errors in ${pc.bold(this.stats.completed.max)} ${this.stats.completed.name}.\n`);
        if (this.stats.errors > 0) {
            process.exit(2);
        }

    }
}



function timeDiff(time: number) {
    // return the time difference in seconds (2dp)
    return ((Date.now() - time) / 1000).toFixed(2);
}

