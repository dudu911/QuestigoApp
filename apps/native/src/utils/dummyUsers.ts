// src/utils/dummyUsers.ts
import { ProfileWithStringDate } from "@redux/authSlice";

// 👇 Match the seeded users in Supabase
export const demoUsers: ProfileWithStringDate[] = [
  {
    id: "0652f100-181b-4c9c-94c2-c3b38a7a1386",
    username: "DemoUser1",
    avatar_url: null,
    locale: "en",
    created_at: new Date().toISOString(),
  },
  {
    id: "c72f92d9-5cf1-47e4-9d21-2e7c9d50a100",
    username: "DemoUser2",
    avatar_url: null,
    locale: "en",
    created_at: new Date().toISOString(),
  },
  {
    id: "a48a9f5a-6f87-49ac-b6a1-95d4f61fcb22",
    username: "DemoUser3",
    avatar_url: null,
    locale: "he",
    created_at: new Date().toISOString(),
  },
];
