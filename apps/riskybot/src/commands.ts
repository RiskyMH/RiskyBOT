import About from "./commands/about.tsx";
import Fun from "./commands/fun.tsx";
import AboutMe_Credits from "./commands/me+credits.tsx";
import Hello from "./commands/ping.tsx";
import Random from "./commands/random.tsx";
import Search from "./commands/search.tsx";
import Tools from "./commands/tools.tsx";
import Translate from "./commands/translate.tsx";
import Eval from "./commands/owner/eval.tsx";
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
