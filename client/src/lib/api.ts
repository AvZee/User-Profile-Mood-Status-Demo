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

export type MoodHistoryEntry = {
    id: number;
    profileId: number;
    mood: string;
    moodEmoji: string;
    createdAt: string | null;
};

export type ErrorResponse = {
    error: string;
};

export type ProfileResponse = {
    profile: Profile;
};

export type MoodHistoryResponse = {
    history: MoodHistoryEntry[];
};

export type UpdateMoodSuccessResponse = {
    message: string;
    profile: Profile;
};

export async function getCurrentProfile() {
    const res = await fetch(`${baseUrl}/current`);

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load profile");
    }

    return res.json();
}

export async function getMoodHistory() {
    const res = await fetch(`${baseUrl}/history`);

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load mood history");
    }

    return res.json();
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
        const text = await res.text();
        throw new Error(text || "Failed to update mood");
    }
    
    return res.json();
}