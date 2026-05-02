import "dotenv/config";
import { app } from "./app";
import { logger } from "./lib/logger";

const port = Number(process.env.PORT) || 3000;

logger.info({ port }, "Server starting");

Bun.serve({
    port,
    fetch: app.fetch,
});