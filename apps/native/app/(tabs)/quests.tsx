import { View, Text, StyleSheet } from "react-native";

export default function QuestsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quests</Text>
      <Text style={styles.subtitle}>List of quests will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: "600", color: "white" },
  subtitle: { marginTop: 12, color: "#ccc" },
});
