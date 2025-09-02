import { QuestRow } from "@repo/types";

// A clean UI-facing type
export type QuestUIBase = {
  id: string;
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  title: string;
  description: string;
  heroImage: string | null;
};

// Mapper: pick the right translation for current locale
export function mapQuestRowToUI(q: QuestRow, locale: "en" | "he" = "en") {
  // Debug: log locale and available translations
  if (typeof window !== "undefined") {
    console.log("[mapQuestRowToUI] locale:", locale);
    console.log("[mapQuestRowToUI] quest_translations:", q.quest_translations);
  }
  const tr =
    q.quest_translations?.find((t) => t.locale === locale) ??
    q.quest_translations?.[0];

  console.log("[mapQuestRowToUI] selected_translation:", tr?.title);

  return {
    id: q.id,
    cityKey: q.city,
    countryCode: q.country,
    heroImage: q.hero_image ?? null,
    latitude: q.latitude,
    longitude: q.longitude,
    createdBy: q.created_by,
    createdAt:
      q.created_at && !isNaN(new Date(q.created_at as any).getTime())
        ? new Date(q.created_at as any).toISOString()
        : null,
    translations: (q.quest_translations ?? []).map((t) => ({
      id: t.id,
      locale: t.locale,
      title: t.title,
      description: t.description ?? "",
    })),
    title: tr?.title ?? "Untitled quest",
    description: tr?.description ?? "",
  };
}
export type QuestUI = ReturnType<typeof mapQuestRowToUI>;
