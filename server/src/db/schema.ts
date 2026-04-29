import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    bio: text("bio"),
    mood: text("mood"),
    moodEmoji: text("mood_emoji"),
    updatedAt: timestamp("updated_at", { mode: "date" }),
});

export const moodHistory = pgTable("mood_history", {
    id: serial("id").primaryKey(),
    profileId: integer("profile_id").notNull().references(() => profiles.id, {
        onDelete: "cascade",
    }),
    mood: text("mood").notNull(),
    moodEmoji: text("mood_emoji").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});