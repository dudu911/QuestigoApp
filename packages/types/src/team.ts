// packages/types/src/team.ts
import { z } from "zod";

export const TeamSchema = z.object({
  id: z.string(),
  code: z.string().min(4),
  name: z.string(),
  members: z
    .array(z.object({ id: z.string(), displayName: z.string() }))
    .max(4),
});

export type Team = z.infer<typeof TeamSchema>;
