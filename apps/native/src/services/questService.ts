import { queryWithSchema, singleWithSchema } from "./queryWithSchema";
import { QuestSchema, Riddle, RiddleSchema } from "@repo/types";
import { mapQuestToUI, mapRiddleToUI, QuestUI, RiddleUI } from "./mappers";

// ✅ Fetch all quests → UI-friendly type
export async function fetchQuests(): Promise<QuestUI[]> {
  const quests = await queryWithSchema("quests", QuestSchema, (q) =>
    q.select("*, translations:quest_translations(*)"),
  );
  return quests.map(mapQuestToUI);
}

// ✅ Fetch single quest by id
export async function fetchQuestById(id: string): Promise<QuestUI> {
  const quest = await singleWithSchema("quests", QuestSchema, (q) =>
    q.eq("id", id).select("*, translations:quest_translations(*)"),
  );
  return mapQuestToUI(quest);
}

// ✅ Fetch riddles for a quest
export async function fetchRiddlesForQuest(
  questId: string,
): Promise<RiddleUI[]> {
  const riddles = await queryWithSchema("riddles", RiddleSchema, (q) =>
    q
      .eq("quest_id", questId)
      .select(
        "*, translations:riddle_translations(*), answers:riddle_answers(*)",
      )
      .order("order_index", { ascending: true }),
  );
  return (riddles as Riddle[]).map(mapRiddleToUI); // ✅ cast to Zod type
}
