import About from "./commands/about.ts";
import Fun from "./commands/fun.ts";
import AboutMe_Credits from "./commands/me+credits.ts";
import Hello from "./commands/ping.ts";
import Random from "./commands/random.ts";
import Search from "./commands/search.ts";
import Tools from "./commands/tools.ts";
import Translate from "./commands/translate.ts";
import Eval from "./commands/owner/eval.ts";
import type { Command } from "@riskybot/command";

export const commands: typeof Command[] = [
    // ./commands/
    About,
    Fun,
    AboutMe_Credits,
    Hello,
    Random,
    Search,
    Tools,
    Translate,

    // ./commands/owner/
    Eval,
];

export default commands;
