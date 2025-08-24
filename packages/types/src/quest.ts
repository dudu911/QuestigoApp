// packages/types/src/quest.ts
import { z } from "zod";

export const RiddleSchema = z.object({
  id: z.string(),
  title: z.string(),
  prompt: z.string(),
  image: z.string().url().optional(),
  lat: z.number(),
  lng: z.number(),
  radiusM: z.number().default(30),
});

export type Riddle = z.infer<typeof RiddleSchema>;

export const QuestSchema = z.object({
  id: z.string(),
  name: z.string(),
  riddles: z.array(RiddleSchema).min(1),
});

export type Quest = z.infer<typeof QuestSchema>;
