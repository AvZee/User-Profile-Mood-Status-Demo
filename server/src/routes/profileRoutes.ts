import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { updateProfileMoodSchema } from "../validation/profileSchemas";
import { getUserProfile, getUserMoodHistory, updateUser } from "../services/profileService";

const profileRoutes = new Hono()
    .get("/current", async (c) => {
        const profileId = 1; // mock user id

        const userProfile = await getUserProfile(profileId);

        if (!userProfile) {
            return c.json({ error: "Profile not found" }, 404);
        }

        return c.json({ profile: userProfile }, 200);
    })
    .get("/history", async (c) => {
        const profileId = 1;
        const history = await getUserMoodHistory(profileId);

        return c.json({ history }, 200);
    })
    .patch(
        "/mood",
        zValidator("json", updateProfileMoodSchema),
        async (c) => {
            const profileId = 1;
            const updates = c.req.valid("json");

            const updatedProfile = await updateUser(profileId, updates);

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

export { profileRoutes };
export type ProfileRoutesType = typeof profileRoutes;