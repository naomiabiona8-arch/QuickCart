// app.ts
// Create express app : setting first ,then all the /api routes, then the "not found" and error handlers.
// it does not start listening : server.ts does that

import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import { env } from "./config/env";

// STEP 3: Create te express app
// the express app : allows the website to call us (CORS), read JSON bodies, server uploaded photos,put every route under /api, then the 404 and error handlers.

const app = express();

app.use(express.json());

// Next: STEP 4 (Handle unkown urls AND Errors ) -> server/src/middleware/notfound.ts

export default app;
