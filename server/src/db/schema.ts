import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    bio: text("bio"),
    mood: text("mood"),
    moodEmoji: text("mood_emoji"),
    updatedAt: timestamp("updated_at", { mode: "date" }),
});