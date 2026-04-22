import { eq, desc } from "drizzle-orm";
import { db } from "./client";
import { profiles, moodHistory } from "./schema";
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

// Function to get a profile by ID
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

// Function to get the mood history for a profile
export async function getMoodHistoryByProfileId(profileId: number) {
    return db
        .select()
        .from(moodHistory)
        .where(eq(moodHistory.profileId, profileId))
        .orderBy(desc(moodHistory.createdAt))
        .limit(5);
}

// Function to create a new mood history entry for a profile
export async function createMoodHistoryEntry(profileId: number, updates: UpdateProfileMoodInput) {
    await db.insert(moodHistory).values({
        profileId,
        mood: updates.mood,
        moodEmoji: updates.moodEmoji,
        createdAt: new Date(),
    });
}