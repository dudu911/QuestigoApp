import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  locale: z.enum(["en", "he"]).default("en"),
  created_at: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;
