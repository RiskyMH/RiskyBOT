// a server that executes main.ts
import handle from "./main.ts";

Bun.serve({
  fetch: handle,
});