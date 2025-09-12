import "../src/i18n";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@repo/ui";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/i18n";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { DirectionProvider } from "../src/i18n/DirectionProvider";
import { setUser } from "@redux/authSlice";
import "react-native-get-random-values";
import { demoUsers } from "../src/utils/dummyUsers"; // ✅ import list

const client = new QueryClient();

export default function RootLayout() {
  const dispatch = store.dispatch;
  useEffect(() => {
    // seed dummy user if not already set
    if (demoUsers.length > 0) {
      dispatch(setUser(demoUsers[0]));
    }
  }, [dispatch]);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={client}>
        <SafeAreaProvider>
          <Provider store={store}>
            <ThemeProvider>
              <DirectionProvider>
                <Slot />
              </DirectionProvider>
            </ThemeProvider>
          </Provider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
