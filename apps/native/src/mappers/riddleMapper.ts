import { RiddleRow } from "@repo/types";

export function mapRiddleRowToUI(r: RiddleRow, locale: "en" | "he") {
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
    createdAt:
      r.created_at && !isNaN(new Date(r.created_at as any).getTime())
        ? new Date(r.created_at as any).toISOString()
        : null,
    image: r.image ?? null,
    title: tr?.title ?? "Untitled riddle",
    prompt: tr?.prompt ?? "",
    hint: tr?.hint ?? undefined,
    answers: (r.riddle_answers ?? []).map((a) => ({
      id: a.id,
      text: a.answer,
      isCorrect: a.is_correct ?? true,
    })),
  };
}

export type RiddleUI = ReturnType<typeof mapRiddleRowToUI>;
