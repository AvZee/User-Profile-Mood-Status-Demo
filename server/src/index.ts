import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import profileRoutes from "./routes/profileRoutes";
import { logger } from "./logger";

const app = new Hono();
const port = Number(process.env.PORT|| 3000);

app.use(
    "/api/*",
    cors({
        origin: [
            "http://localhost:5173",
            "https://user-profile-mood-status-demo.vercel.app",
        ],
        allowMethods: ["GET", "PATCH", "OPTIONS"],
        allowHeaders: ["Content-Type"],
    })
);

app.get("/", (c) => c.text("API Running"));

app.route("/api/profile", profileRoutes);

Bun.serve({
    fetch: app.fetch,
    port,
});

logger.info({ port }, "Server starting");