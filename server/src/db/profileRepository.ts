import { eq } from "drizzle-orm";
import { db } from "./client";
import { profiles } from "./schema";
import type { Profile } from "../types/profile";
import type { UpdateProfileMoodInput } from "../validation/profileSchemas";

// Helper function to map database row to Profile type
function mapProfileRow(row: typeof profiles.$inferSelect): Profile {
    return {
        id: row.id,
        username: row.username,
        bio: row.bio,
        mood: row.mood,
        moodEmoji: row.moodEmoji,
        updatedAt: row.updatedAt,
    };
}

// Database access functions for profiles
export async function getProfileById(profileId: number): Promise<Profile | null> {
    const rows = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, profileId))
        .limit(1);

    const row = rows[0];
    return row ? mapProfileRow(row) : null;
}

// Function to update the mood and moodEmoji of a profile by ID
export async function updateProfileMoodById(
    profileId: number,
    updates: UpdateProfileMoodInput
): Promise<Profile | null> {
    const rows = await db
        .update(profiles)
        .set({
            mood: updates.mood,
            moodEmoji: updates.moodEmoji,
            updatedAt: new Date(),
        })
        .where(eq(profiles.id, profileId))
        .returning();

    const row = rows[0];
    return row ? mapProfileRow(row) : null;
}