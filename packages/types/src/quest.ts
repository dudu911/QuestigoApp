import { z } from "zod";

export const QuestSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  hero_image: z.string().url().nullable().optional(),
  created_by: z.string().uuid().nullable().optional(),
  created_at: z.string().datetime(),
});

export type Quest = z.infer<typeof QuestSchema>;

// Existing Riddle schema (for reference)
export const RiddleSchema = z.object({
  id: z.string().uuid(),
  quest_id: z.string().uuid(),
  title: z.string(),
  prompt: z.string(),
  image: z.string().url().optional(),
  answer: z.string(),
  hint: z.string().nullable().optional(),
  lat: z.number(),
  lng: z.number(),
  radiusM: z.number().default(30),
  order_index: z.number(),
  created_at: z.string().datetime(),
});

export type Riddle = z.infer<typeof RiddleSchema>;
