import { z } from "zod";

export const QuestTranslationSchema = z.object({
  locale: z.enum(["en", "he"]),
  title: z.string(),
  description: z.string().nullable().optional(),
});

export const QuestSchema = z.object({
  id: z.string().uuid(),
  city: z.string().nullable().optional(), // i18n key
  country: z.string().nullable().optional(), // ISO code
  hero_image: z.string().url().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  created_by: z.string().uuid().nullable().optional(),
  created_at: z.coerce.date(),
  translations: z.array(QuestTranslationSchema),
});

export type Quest = z.infer<typeof QuestSchema>;

export const RiddleTranslationSchema = z.object({
  locale: z.enum(["en", "he"]),
  title: z.string(),
  prompt: z.string(),
  hint: z.string().nullable().optional(),
});

export const RiddleAnswerSchema = z.object({
  id: z.string().uuid(),
  riddle_id: z.string().uuid(),
  answer: z.string(),
  is_correct: z.boolean().optional().default(true),
});

export const RiddleSchema = z.object({
  id: z.string().uuid(),
  quest_id: z.string().uuid(),
  latitude: z.number(),
  longitude: z.number(),
  radius_m: z.number().nullable().optional(), // ✅ tolerate missing
  order_index: z.number(),
  image: z.string().url().nullable().optional(),
  created_at: z.coerce.date(),
  translations: z.array(RiddleTranslationSchema),
  answers: z.array(RiddleAnswerSchema).optional().nullable(),
});

export type Riddle = z.infer<typeof RiddleSchema>;
export type RiddleAnswer = z.infer<typeof RiddleAnswerSchema>;
