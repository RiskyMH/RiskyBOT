// multi functions
export * as mini from "./mini.mjs";
export * as defaultApplicationCommands from "./defaultApplicationCommands.mjs";

// default functions
export { default as about, autoComplete as aboutAutoComplete } from "./about.mjs";
export { default as deepai } from "./deepai.mjs";
export { default as say} from "./say.mjs";
export { default as translate} from "./translate.mjs";
export { default as meCredits, extra as meCreditsExtra} from "./me+credits.mjs";
export { default as random, autoComplete as randomAutoComplete, button as randomButton } from "./random.mjs";
export { default as fun } from "./fun.mjs";
export { default as search, autoComplete as searchAutoComplete } from "./search.mjs";
export { default as reddit, autoComplete as redditAutoComplete } from "./reddit.mjs";
export { default as toolsCmd } from "./toolsCmd.mjs";
export { evalShowModal, evalResult } from "./ownerCmds.mjs";
