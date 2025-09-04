import { RiddleRow } from "@repo/types";
import { safeDate } from "../utils/date";

export type RiddleUI = {
  id: string;
  questId: string;
  lat: number;
  lng: number;
  radiusM: number;
  orderIndex: number;
  createdAt: string; // ISO string
  image: string | null;
  translations: {
    id: string;
    locale: "en" | "he";
    title: string;
    prompt: string;
    hint?: string | null;
  }[];
  answers: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  // 👇 language-specific fields
  title: string;
  prompt: string;
  hint?: string | null;
};

export function mapRiddleRowToUI(
  r: RiddleRow,
  locale: "en" | "he" = "en",
): RiddleUI {
  const tr =
    r.riddle_translations.find((t) => t.locale === locale) ??
    r.riddle_translations[0];

  return {
    id: r.id,
    questId: r.quest_id,
    lat: r.latitude,
    lng: r.longitude,
    radiusM: r.radius_m ?? 30,
    orderIndex: r.order_index,
    createdAt: safeDate(r.created_at).toISOString(),
    image: r.image ?? null,
    translations: r.riddle_translations,
    answers: (r.riddle_answers ?? []).map((a) => ({
      id: a.id,
      text: a.answer,
      isCorrect: a.is_correct ?? true,
    })),
    title: tr?.title ?? "Untitled riddle",
    prompt: tr?.prompt ?? "",
    hint: tr?.hint ?? null,
  };
}
