import Affect from "./commands/affect.ts";
import Cry from "./commands/cry.ts";
import ImageFrom from "./commands/image-from.ts";
import Ping from "./commands/ping.ts";
import type { Command } from "@riskybot/command";

export const commands: typeof Command[] = [
    // ./commands/
    Affect,
    Cry,
    ImageFrom,
    Ping,
];

export default commands;
