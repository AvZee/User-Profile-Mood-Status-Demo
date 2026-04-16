import { eq } from "drizzle-orm";
import { db } from "./client";
import { profiles } from "./schema";
import type { Profile } from "../types/profile";
import type { UpdateProfileMoodInput } from "../validation/profileSchemas";

function mapProfileRow(row: typeof profiles.$inferSelect): Profile {
    return {
        id: row.id,
        username: row.username,
        bio: row.bio,
        mood: row.mood,
        moodEmoji: row.moodEmoji,
    };
}

export async function getProfileById(profileId: number): Promise<Profile | null> {
    const rows = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, profileId))
        .limit(1);

    const row = rows[0];
    return row ? mapProfileRow(row) : null;
}

export async function updateProfileMoodById(
    profileId: number,
    updates: UpdateProfileMoodInput
): Promise<Profile | null> {
    const rows = await db
        .update(profiles)
        .set({
            mood: updates.mood,
            moodEmoji: updates.moodEmoji,
        })
        .where(eq(profiles.id, profileId))
        .returning();

    const row = rows[0];
    return row ? mapProfileRow(row) : null;
}