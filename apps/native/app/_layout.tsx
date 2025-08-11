import "../src/i18n";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@repo/ui";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/i18n";
import { View, StyleSheet, Platform } from "react-native";
import { MapCanvas } from "../src/components/MapCanvas";

const client = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    // Future one-time init (analytics, etc.)
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={client}>
        <SafeAreaProvider>
          <ThemeProvider>
            <View style={styles.root}>
              {/* Persistent map lives beneath navigation layers (native only) */}
              {Platform.OS !== "web" && (
                <View style={styles.mapLayer} pointerEvents="none">
                  <MapCanvas />
                </View>
              )}
              {/* Navigation stack controlling tabs + modals */}
              <Stack screenOptions={{ headerShown: false }}>
                {/* Tabs group (home/quests/profile) */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                {/* Modal examples */}
                <Stack.Screen
                  name="(modals)/settings"
                  options={{ presentation: "modal", title: "Settings" }}
                />
              </Stack>
            </View>
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mapLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});
