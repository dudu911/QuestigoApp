import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quest, Riddle } from "@repo/types";

interface QuestState {
  activeQuest: Quest | null;
  riddles: Riddle[];
  currentRiddleIndex: number;
  hintUsed: boolean;
}

const initialState: QuestState = {
  activeQuest: null,
  riddles: [],
  currentRiddleIndex: 0,
  hintUsed: false,
};

const questSlice = createSlice({
  name: "quest",
  initialState,
  reducers: {
    setActiveQuest(state, action: PayloadAction<Quest | null>) {
      state.activeQuest = action.payload;
      state.currentRiddleIndex = 0;
      state.hintUsed = false;
    },
    setRiddles(state, action: PayloadAction<Riddle[]>) {
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

export const { setActiveQuest, setRiddles, nextRiddle, useHint } =
  questSlice.actions;
export default questSlice.reducer;
