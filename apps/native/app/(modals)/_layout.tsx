import { Stack } from "expo-router";
import { Pressable, Text } from "react-native";
import { router } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal", // iOS-style slide-up
        headerShown: true,
        headerTitleStyle: { fontWeight: "bold" },
        headerRight: () => (
          <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
            <Text style={{ color: "blue" }}>Close</Text>
          </Pressable>
        ),
      }}
    >
      {/* Optional: customize titles per modal */}
      <Stack.Screen name="quest/[id]" options={{ title: "Quest" }} />
      <Stack.Screen name="hint/[id]" options={{ title: "Hint" }} />
      <Stack.Screen name="lobby/[id]" options={{ title: "Lobby" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}
