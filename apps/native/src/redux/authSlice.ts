import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@repo/types";

export type SupportedLanguage = "en" | "he";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  locale: SupportedLanguage;
  isOnline: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  locale: "en",
  isOnline: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setLocale(state, action: PayloadAction<SupportedLanguage>) {
      state.locale = action.payload;
    },
    setIsOnline(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, setLoading, setLocale, setIsOnline, logout } =
  authSlice.actions;

export default authSlice.reducer;
