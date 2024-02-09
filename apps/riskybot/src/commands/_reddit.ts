import { reddit } from "@riskybot/apis";
import type { ApplicationCommandOptionChoiceStructure } from "lilybird";

export async function autoComplete(input: string): Promise<ApplicationCommandOptionChoiceStructure[]> {

    if (input.length === 0) {
        const urbanOpt = await reddit.popularSubreddits();

        const wordList = urbanOpt
            .map(word => ({ name: word.display_name_prefixed, value: word.display_name_prefixed }));

        return wordList.slice(0, 25);
    }

    const urbanOpt = await reddit.subredditAutoComplete(input);

    if (!urbanOpt) return [];

    const wordList = urbanOpt
        .filter(word => !word.name.startsWith("u_"))
        .map(word => ({ name: word.name.startsWith("r/") ? word.name : "r/" + word.name, value: word.name }));

    return wordList.slice(0, 25);
}