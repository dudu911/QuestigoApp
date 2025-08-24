import { queryWithSchema, singleWithSchema } from "./queryWithSchema";
import { QuestSchema, RiddleSchema } from "@repo/types";

// Fetch all quests
export async function fetchQuests() {
  return queryWithSchema("quests", QuestSchema);
}

// Fetch a single quest by id
export async function fetchQuestById(id: string) {
  return singleWithSchema("quests", QuestSchema, (q) => q.eq("id", id));
}

// Fetch riddles for a quest
export async function fetchRiddlesForQuest(questId: string) {
  return queryWithSchema("riddles", RiddleSchema, (q) =>
    q.eq("quest_id", questId).order("order_index", { ascending: true }),
  );
}

// ======================
// RIDDLES
// ======================
// export async function fetchRiddlesForQuest(questId: string) {
//   const { data, error } = await supabase
//     .from("riddles")
//     .select(
//       `
//       id,
//       title,
//       prompt,
//       image,
//       answer,
//       hint,
//       latitude,
//       longitude,
//       radius_m,
//       order_index
//     `,
//     )
//     .eq("quest_id", questId)
//     .order("order_index", { ascending: true });

//   if (error) throw error;
//   if (!data) return [];

//   // map DB fields -> Zod schema fields
//   return data.map((row) =>
//     RiddleSchema.parse({
//       id: row.id,
//       title: row.title,
//       prompt: row.prompt,
//       image: row.image ?? undefined,
//       lat: row.latitude,
//       lng: row.longitude,
//       radiusM: row.radius_m ?? 30,
//     }),
//   );
// }
