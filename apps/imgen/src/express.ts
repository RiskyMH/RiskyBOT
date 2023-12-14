
// an express server that executes main.ts

import express from "express";
import handle from "./main.ts";

const app = express();

app.use(express.json());

app.post("/", handle);
app.use("/api/imgen", handle);

app.listen(3000, () => console.info("Listening on port 3000"));