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
    setHintUsed(state) {
      state.hintUsed = true;
    },
  },
});

export const { setActiveQuestId, nextRiddle, setHintUsed } = questSlice.actions;
export default questSlice.reducer;
