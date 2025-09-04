import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "@repo/types";

export type SupportedLanguage = "en" | "he";

// ✅ Override Profile type locally to use string for created_at
export interface ProfileWithStringDate
  extends Omit<Profile, "created_at" | "username"> {
  username: string; // Ensure username is always a string
  created_at: string; // Supabase returns timestamptz as string
}

interface AuthState {
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
    locale: "en" | "he";
    created_at: string; // ✅ ISO string
  } | null;
  token: string | null;
  loading: boolean;
  locale: "en" | "he";
  isOnline: boolean;
}

// ✅ Demo users for testing multiplayer without real auth
const DEMO_USERS: Record<"ios" | "android", ProfileWithStringDate> = {
  ios: {
    id: "11111111-1111-1111-1111-111111111111",
    username: "ios-demo",
    avatar_url: null,
    locale: "en",
    created_at: new Date().toISOString(),
  },
  android: {
    id: "22222222-2222-2222-2222-222222222222",
    username: "android-demo",
    avatar_url: null,
    locale: "en",
    created_at: new Date().toISOString(),
  },
};

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
    setUser(state, action: PayloadAction<ProfileWithStringDate | null>) {
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

    // 🔹 For demo purposes only
    useDemoUser(state, action: PayloadAction<"ios" | "android">) {
      state.user = DEMO_USERS[action.payload];
    },
  },
});

export const {
  setUser,
  setToken,
  setLoading,
  setLocale,
  setIsOnline,
  logout,
  useDemoUser,
} = authSlice.actions;

export default authSlice.reducer;
