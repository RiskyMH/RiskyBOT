import Affect from "./commands/affect.tsx";
import Cry from "./commands/cry.tsx";
import ImageFrom from "./commands/image-from.tsx";
import Ping from "./commands/ping.tsx";
import type { Command } from "@riskybot/command";

export const commands: typeof Command[] = [
    // ./commands/
    Affect,
    Cry,
    ImageFrom,
    Ping,
];

export default commands;
