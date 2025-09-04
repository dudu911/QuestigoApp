// src/utils/dummyUser.ts
import type { Profile } from "@repo/types";

// Use a fixed UUID so it’s stable between sessions
export const DUMMY_USER_ID = "0652f100-181b-4c9c-94c2-c3b38a7a1386";

export const dummyUser: Profile = {
  id: DUMMY_USER_ID,
  username: "DemoUser",
  avatar_url: null,
  locale: "en",
  created_at: new Date().toISOString(), // stored as string in DB
};
