import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    bio: text("bio"),
    mood: text("mood"),
    moodEmoji: text("mood_emoji"),
});