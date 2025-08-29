export type RiddleRow = {
  id: string;
  quest_id: string;
  latitude: number;
  longitude: number;
  radius_m?: number;
  image?: string;
  riddle_translations: {
    locale: "en" | "he";
    prompt: string;
    hint?: string | null;
  }[];
};

export type RiddleUI = {
  id: string;
  questId: string;
  latitude: number;
  longitude: number;
  radius: number;
  image?: string;
  prompt: string;
  hint?: string;
};

export function mapRiddleRowToUI(
  row: RiddleRow,
  locale: "en" | "he",
): RiddleUI {
  const tr = row.riddle_translations.find((t) => t.locale === locale) ??
    row.riddle_translations[0] ?? { prompt: "Untitled riddle", hint: "" };

  return {
    id: row.id,
    questId: row.quest_id,
    latitude: row.latitude,
    longitude: row.longitude,
    radius: row.radius_m ?? 30,
    image: row.image ?? undefined,
    prompt: tr.prompt,
    hint: tr.hint ?? undefined,
  };
}
