import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "./lib/logger";
import { profileRoutes } from "./routes/profileRoutes";

export const app = new Hono();

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

app.get("/", (c) => {
    return c.json({
        ok: true,
        name: "User Mood Status Backend",
    });
});

app.route("/api/profile", profileRoutes);

app.notFound((c) => {
    return c.json(
        {
            ok: false,
            error: "Route not found",
        },
        404
    );
});

app.onError((err, c) => {
    logger.error({ err }, "Unhandled application error");

    return c.json(
        {
            ok: false,
            error: "Internal server error",
        },
        500
    );
});