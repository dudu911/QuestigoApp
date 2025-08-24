import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import questReducer from "./questSlice";
import lobbyReducer from "./lobbySlice";
import creditsReducer from "./creditsSlice";
import { supabaseRealtimeMiddleware } from "./middleware/supabaseRealtime";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quest: questReducer,
    lobby: lobbyReducer,
    credits: creditsReducer,
  },
  middleware: (getDefault) => getDefault().concat(supabaseRealtimeMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
