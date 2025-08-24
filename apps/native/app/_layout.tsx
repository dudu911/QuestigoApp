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
const client = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    // one-time init placeholder
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={client}>
        <SafeAreaProvider>
          <Provider store={store}>
            <ThemeProvider>
              <Slot />
            </ThemeProvider>
          </Provider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
