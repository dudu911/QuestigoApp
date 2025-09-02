import { supabase } from "./supabaseClient";
import { QuestSchema, RiddleSchema } from "@repo/types";
import { mapQuestRowToUI, QuestUI } from "../mappers/questMapper";
import { mapRiddleRowToUI, RiddleUI } from "../mappers/riddleMapper";

// ✅ Fetch all quests with translations
export async function fetchQuests(locale: string): Promise<QuestUI[]> {
  const { data, error } = await supabase.from("quests").select(`
      *,
      quest_translations (*)
    `);
  console.log("[fetchQuests] locale:", locale);
  console.log("[fetchQuests] quest_translations:", data);
  if (error) throw error;

  const parsed = QuestSchema.array().safeParse(data);

  if (!parsed.success) {
    console.error("❌ Zod validation failed for quests", parsed.error.issues);
    throw new Error("Invalid quests data from Supabase");
  }
  const safeLocale = locale === "en" || locale === "he" ? locale : undefined;
  return parsed.data.map((row) => mapQuestRowToUI(row, safeLocale));
}

// ✅ Fetch a single quest by ID with translations
export async function fetchQuestById(id: string): Promise<QuestUI> {
  const { data, error } = await supabase
    .from("quests")
    .select(
      `
      *,
      quest_translations (*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  const parsed = QuestSchema.safeParse(data);
  if (!parsed.success) {
    console.error("❌ Zod validation failed for quest", parsed.error.issues);
    throw new Error("Invalid quest data from Supabase");
  }

  return mapQuestRowToUI(parsed.data);
}

// ✅ Fetch riddles for a quest (with translations + answers)
export async function fetchRiddlesForQuest(
  questId: string,
  locale?: "en" | "he",
): Promise<RiddleUI[]> {
  const { data, error } = await supabase
    .from("riddles")
    .select(
      `
      *,
      riddle_translations (*),
      riddle_answers (*)
    `,
    )
    .eq("quest_id", questId)
    .order("order_index", { ascending: true });

  if (error) throw error;

  const parsed = RiddleSchema.array().safeParse(data);
  if (!parsed.success) {
    console.error("❌ Zod validation failed for riddles", parsed.error.issues);
    throw new Error("Invalid riddles data from Supabase");
  }

  const safeLocale: "en" | "he" =
    locale === "en" || locale === "he" ? locale : "en";
  return parsed.data.map((row) => mapRiddleRowToUI(row, safeLocale));
}
