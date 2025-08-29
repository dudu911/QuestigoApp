export type QuestRow = {
  id: string;
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  quest_translations: {
    locale: "en" | "he";
    title: string;
    description: string;
  }[];
};

// A clean UI-facing type
export type QuestUI = {
  id: string;
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  title: string;
  description: string;
};

// Mapper: pick the right translation for current locale
export function mapQuestRowToUI(row: QuestRow, locale: "en" | "he"): QuestUI {
  const tr = row.quest_translations.find((t) => t.locale === locale) ??
    row.quest_translations[0] ?? { title: "Untitled quest", description: "" };

  return {
    id: row.id,
    latitude: row.latitude,
    longitude: row.longitude,
    country: row.country,
    city: row.city,
    title: tr.title,
    description: tr.description,
  };
}
