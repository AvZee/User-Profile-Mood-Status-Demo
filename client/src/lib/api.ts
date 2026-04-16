import { hc } from "hono/client";
import type { ProfileRoutesType } from "../../../server/src/routes/profileRoutes";

const baseUrl = `${import.meta.env.VITE_API_URL}/api/profile`;

export const client = hc<ProfileRoutesType>(baseUrl);