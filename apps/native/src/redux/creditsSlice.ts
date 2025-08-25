import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Purchase } from "@repo/types";

interface CreditsState {
  balance: number;
  loading: boolean;
  purchases: Purchase[]; // ✅ Purchase.created_at is Date
}

const initialState: CreditsState = {
  balance: 0,
  loading: false,
  purchases: [],
};

const creditsSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    setBalance(state, action: PayloadAction<number>) {
      state.balance = action.payload;
    },
    incrementBalance(state, action: PayloadAction<number>) {
      state.balance += action.payload;
    },
    decrementBalance(state, action: PayloadAction<number>) {
      state.balance = Math.max(0, state.balance - action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setPurchases(state, action: PayloadAction<Purchase[]>) {
      state.purchases = action.payload;
    },
  },
});

export const {
  setBalance,
  incrementBalance,
  decrementBalance,
  setLoading,
  setPurchases,
} = creditsSlice.actions;
export default creditsSlice.reducer;
