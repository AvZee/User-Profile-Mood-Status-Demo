import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { updateProfileMoodSchema } from "../validation/profileSchemas";
import { getUserProfile, updateUserMood } from "../services/profileService";

const profileRoutes = new Hono()
    .get("/current", async (c) => {
        const profileId = 1; // mock user id

        const userProfile = await getUserProfile(profileId);

        if (!userProfile) {
            return c.json({ error: "Profile not found" }, 404);
        }

        return c.json({ profile: userProfile }, 200);
    })
    .patch(
        "/mood",
        zValidator("json", updateProfileMoodSchema),
        async (c) => {
            const profileId = 1; // mock user id
            const updates = c.req.valid("json");

            const updatedProfile = await updateUserMood(profileId, updates);

            if (!updatedProfile) {
                return c.json({ error: "Profile not found" }, 404);
            }

            return c.json(
                {
                    message: "Mood updated successfully",
                    profile: updatedProfile,
                },
                200
            );
        }
    );

export default profileRoutes;
export type ProfileRoutesType = typeof profileRoutes;