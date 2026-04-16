// Profile type for backend
export type Profile = {
    id: number;
    username: string;
    bio: string | null;
    mood: string | null;
    moodEmoji: string | null;
};