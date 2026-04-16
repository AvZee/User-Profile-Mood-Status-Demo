import type { UpdateProfileMoodInput } from "../validation/profileSchemas";
import { getProfileById, updateProfileMoodById } from "../db/profileRepository";
import type { Profile } from "../types/profile";

export async function getUserProfile(profileId: number): Promise<Profile | null> {
    return getProfileById(profileId);
}

export async function updateUserMood(
    profileId: number,
    updates: UpdateProfileMoodInput
): Promise<Profile | null> {
    const existingProfile = await getProfileById(profileId);

    if (!existingProfile) {
        return null;
    }

    return updateProfileMoodById(profileId, updates);
}