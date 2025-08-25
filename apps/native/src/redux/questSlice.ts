import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { QuestUI, RiddleUI } from "@services/mappers";

interface QuestState {
  quests: QuestUI[];
  activeQuest: QuestUI | null;
  riddles: RiddleUI[];
  currentRiddleIndex: number;
  hintUsed: boolean;
}

const initialState: QuestState = {
  quests: [],
  activeQuest: null,
  riddles: [],
  currentRiddleIndex: 0,
  hintUsed: false,
};

const questSlice = createSlice({
  name: "quest",
  initialState,
  reducers: {
    setQuests(state, action: PayloadAction<QuestUI[]>) {
      state.quests = action.payload;
    },
    setActiveQuest(state, action: PayloadAction<QuestUI | null>) {
      state.activeQuest = action.payload;
      state.currentRiddleIndex = 0;
      state.hintUsed = false;
    },
    setRiddles(state, action: PayloadAction<RiddleUI[]>) {
      state.riddles = action.payload;
    },
    nextRiddle(state) {
      if (state.currentRiddleIndex < state.riddles.length - 1) {
        state.currentRiddleIndex += 1;
        state.hintUsed = false;
      }
    },
    useHint(state) {
      state.hintUsed = true;
    },
  },
});

export const { setQuests, setActiveQuest, setRiddles, nextRiddle, useHint } =
  questSlice.actions;
export default questSlice.reducer;
