const baseUrl = `${import.meta.env.VITE_API_URL}/api/profile`;

// Type definitions for profile data and API responses

export type Profile = {
    id: number;
    username: string;
    bio: string | null;
    mood: string | null;
    moodEmoji: string | null;
    updatedAt: string | null;
};

export type ErrorResponse = {
    error: string;
};

export type ProfileResponse = {
    profile: Profile;
};

export type UpdateMoodSuccessResponse = {
    message: string;
    profile: Profile;
};

export async function getCurrentProfile() {
    const res = await fetch(`${baseUrl}/current`);

    if (!res.ok) {
        const data: ErrorResponse = await res.json();
        throw new Error(data.error || "Failed to load profile");
    }

    const data: ProfileResponse = await res.json();
    return data;
}

export async function updateMood(payload: {
    mood: string;
    moodEmoji: Profile["moodEmoji"];
}) {
    const res = await fetch(`${baseUrl}/mood`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const data: ErrorResponse = await res.json();
        throw new Error(data.error || "Failed to update mood");
    }
    
    const data: UpdateMoodSuccessResponse = await res.json();
    return data;
}