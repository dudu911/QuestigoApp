// src/mappers/questMapper.ts
import { QuestRow } from "@repo/types";

export type QuestUI = {
  id: string;
  cityKey: string;
  countryCode: string;
  heroImage: string | null;
  latitude: number;
  longitude: number;
  createdBy: string | null;
  createdAt: string; // ✅ stored as ISO string for Redux
  title: string;
  description: string;
  translations: {
    id: string;
    locale: "en" | "he";
    title: string;
    description: string;
  }[];
};

export function mapQuestRowToUI(
  q: QuestRow,
  locale: "en" | "he" = "en",
): QuestUI {
  const tr =
    q.quest_translations?.find((t) => t.locale === locale) ??
    q.quest_translations?.[0];

  let createdAt: string | null = null;
  if (q.created_at) {
    const date = new Date(q.created_at);
    if (!isNaN(date.getTime())) {
      createdAt = date.toISOString();
    }
  }
  return {
    id: q.id,
    cityKey: q.city,
    countryCode: q.country,
    heroImage: q.hero_image ?? null,
    latitude: q.latitude,
    longitude: q.longitude,
    createdBy: q.created_by,
    createdAt: createdAt ?? "",
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
