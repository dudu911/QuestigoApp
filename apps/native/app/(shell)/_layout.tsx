import { Stack } from "expo-router";
import { View } from "react-native";
import { MapCanvas } from "../../src/components/MapCanvas";

export default function ShellLayout() {
  return (
    <View style={{ flex: 1 }}>
      <MapCanvas />
      <Stack
        screenOptions={{ headerShown: false, presentation: "transparentModal" }}
      />
    </View>
  );
}
