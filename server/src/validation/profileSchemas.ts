import { z } from "zod";

// Zod profile mood and moodEmoji validation schema 
export const allowedMoodEmojis = [
    "😄",
    "🙂",
    "😔",
    "😠",
    "😴",
] as const;

export const updateProfileMoodSchema = z.object({
    mood: z
        .string()
        .trim()
        .min(1, "Mood is required")
        .max(50, "Mood must be 50 characters or less"),
    moodEmoji: z.enum(allowedMoodEmojis),
});

export type UpdateProfileMoodInput = z.infer<typeof updateProfileMoodSchema>;