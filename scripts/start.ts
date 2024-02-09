import { handle as handleRiskybot } from "@riskybot/riskybot";
import { handle as handleImgen } from "@riskybot/imgen";

Bun.serve({
    fetch: async (request) => {
        switch (new URL(request.url).pathname) {
            case "/api/riskybot": {
                return handleRiskybot(request);
            }

            case "/api/imgen": {
                return handleImgen(request);
            }

            default: {
                return Response.json({ error: "Invalid endpoint" }, { status: 404 });
            }
        }
    }
});

console.log("Server started");