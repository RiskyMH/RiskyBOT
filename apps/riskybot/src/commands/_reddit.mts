import { reddit } from "@riskybot/apis";
import { APIApplicationCommandOptionChoice } from "discord-api-types/v10";

export async function autoComplete(input: string): Promise<APIApplicationCommandOptionChoice[]> {

    const urbanOpt = await reddit.subredditAutoComplete(input, 25);

    if (!urbanOpt) return [];

    const wordList = urbanOpt
        .filter(word => !word.name.startsWith("u_"))
        .map(word => ({ name: word.name.startsWith("r/") ? word.name : "r/" + word.name, value: word.name }));

    return wordList.slice(0, 25);
}