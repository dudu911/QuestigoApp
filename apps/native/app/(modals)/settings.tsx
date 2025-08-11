import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function SettingsModal() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Adjust your preferences here.</Text>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Close</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 24 },
  title: { fontSize: 28, fontWeight: "600", color: "white" },
  subtitle: { marginTop: 12, color: "#bbb" },
  button: {
    marginTop: 32,
    backgroundColor: "#F49C00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonText: { color: "#000", fontWeight: "600" },
});
