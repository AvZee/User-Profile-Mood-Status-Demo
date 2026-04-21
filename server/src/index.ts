import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import profileRoutes from "./routes/profileRoutes";
import logger from "./logger";

const app = new Hono();

app.use(
    "/api/*",
    cors({
        origin: [
            "http://localhost:5173",
            "https://user-profile-mood-status-demo-oemf.vercel.app/",
        ],
        allowMethods: ["GET", "PATCH", "OPTIONS"],
        allowHeaders: ["Content-Type"],
    })
);

app.get("/", (c) => c.text("API Running"));

app.route("/api/profile", profileRoutes);

Bun.serve({
    fetch: app.fetch,
    port: 3000,
});

logger.info("Server running on http://localhost:3000");