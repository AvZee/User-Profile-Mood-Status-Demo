import { db } from "./client";
import { profiles } from "./schema";
import { logger } from "../lib/logger";

async function seed() {
    const inserted = await db
        .insert(profiles)
        .values({
            username: "ProgrammerPete",
            bio: "Building projects",
            mood: "Happy",
            moodEmoji: "🙂",
        })
        .onConflictDoNothing({
            target: profiles.username,
        })
        .returning();

    if (inserted.length === 0) {
        logger.info("Demo user already exists. Skipping seed.");
        return;
    }

    logger.info("Seed complete");
}

seed().catch((err) => {
    logger.error({ err }, "Seed failed");
    process.exit(1);
});