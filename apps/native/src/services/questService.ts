import { supabase } from "./supabaseClient";
import { RiddleSchema } from "@repo/types"; // assuming you export Zod RiddleSchema here

// ======================
// QUESTS
// ======================
export async function fetchQuests() {
  const { data, error } = await supabase.from("quests").select("*");
  if (error) throw error;
  return data;
}

export async function fetchQuestById(id: string) {
  const { data, error } = await supabase
    .from("quests")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// ======================
// RIDDLES
// ======================
export async function fetchRiddlesForQuest(questId: string) {
  const { data, error } = await supabase
    .from("riddles")
    .select(
      `
      id,
      title,
      prompt,
      image,
      answer,
      hint,
      latitude,
      longitude,
      radius_m,
      order_index
    `,
    )
    .eq("quest_id", questId)
    .order("order_index", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  // map DB fields -> Zod schema fields
  return data.map((row) =>
    RiddleSchema.parse({
      id: row.id,
      title: row.title,
      prompt: row.prompt,
      image: row.image ?? undefined,
      lat: row.latitude,
      lng: row.longitude,
      radiusM: row.radius_m ?? 30,
    }),
  );
}
