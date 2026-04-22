import type { UpdateProfileMoodInput } from "../validation/profileSchemas";
import { getProfileById, updateProfileMoodById, createMoodHistoryEntry, getMoodHistoryByProfileId } from "../db/profileRepository";
import type { Profile } from "../types/profile";

// Service functions for profile-related operations

export async function getUserProfile(profileId: number): Promise<Profile | null> {
    return getProfileById(profileId);
}

export async function getUserMoodHistory(profileId: number) {
    return getMoodHistoryByProfileId(profileId);
}

export async function updateUser(
    profileId: number,
    updates: UpdateProfileMoodInput
): Promise<Profile | null> {
    const existingProfile = await getProfileById(profileId);

    if (!existingProfile) {
        return null;
    }

    const updatedProfile = await updateProfileMoodById(profileId, updates);

    if (updatedProfile) {
        await createMoodHistoryEntry(profileId, updates);
    }

    return updatedProfile;
}