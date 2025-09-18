// src/redux/questSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuestState {
  activeQuestId: string | null;
  currentRiddleIndex: number;
  hintUsed: boolean;
}

const initialState: QuestState = {
  activeQuestId: null,
  currentRiddleIndex: 0,
  hintUsed: false,
};

const questSlice = createSlice({
  name: "quest",
  initialState,
  reducers: {
    setActiveQuestId(state, action: PayloadAction<string | null>) {
      state.activeQuestId = action.payload;
      state.currentRiddleIndex = 0;
      state.hintUsed = false;
    },
    nextRiddle(state) {
      state.currentRiddleIndex += 1;
      state.hintUsed = false;
    },
    setRiddleIndex(state, action: PayloadAction<number>) {
      state.currentRiddleIndex = action.payload;
      state.hintUsed = false; // reset hint when jumping directly
    },
    setHintUsed(state) {
      state.hintUsed = true;
    },
    // ✅ new: reset everything explicitly
    resetQuest(state) {
      state.activeQuestId = null;
      state.currentRiddleIndex = 0;
      state.hintUsed = false;
    },
  },
});

export const {
  setActiveQuestId,
  nextRiddle,
  setRiddleIndex,
  setHintUsed,
  resetQuest, // export new action
} = questSlice.actions;

export default questSlice.reducer;
