import { z } from "zod";

export const QuestTranslationSchema = z.object({
  locale: z.enum(["en", "he"]),
  title: z.string(),
  description: z.string().nullable().optional(),
});

export const QuestSchema = z.object({
  id: z.string(),
  created_by: z.string().nullable(),
  hero_image: z.string().nullable(),
  city: z.string(),
  country: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  created_at: z.coerce.date(),
  quest_translations: z
    .array(
      z.object({
        id: z.string(),
        quest_id: z.string(),
        locale: z.enum(["en", "he"]),
        title: z.string(),
        description: z.string().nullable(),
      }),
    )
    .optional(),
});

export type QuestRow = z.infer<typeof QuestSchema>;

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
  id: z.string(),
  quest_id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  radius_m: z.number().optional(),
  order_index: z.number(),
  created_at: z.coerce.date(),
  image: z.string().nullable().optional(),
  riddle_translations: z.array(
    z.object({
      id: z.string(),
      riddle_id: z.string(),
      locale: z.enum(["en", "he"]),
      title: z.string(),
      prompt: z.string(),
      hint: z.string().nullable().optional(),
    }),
  ),
  riddle_answers: z
    .array(
      z.object({
        id: z.string(),
        riddle_id: z.string(),
        answer: z.string(),
        is_correct: z.boolean().optional(),
      }),
    )
    .optional(),
});
export type RiddleRow = z.infer<typeof RiddleSchema>;
export type RiddleAnswer = z.infer<typeof RiddleAnswerSchema>;
