import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
// Update the path below to the actual location of your fetchQuests service
import { fetchQuests } from "@services/questService";

export default function QuestsScreen() {
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuests()
      .then((data) => setQuests(data ?? []))
      .catch(() => {
        // Optionally handle error
        setQuests([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Quests
      </Text>
      <FlatList
        data={quests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 12,
              padding: 12,
              backgroundColor: "#eee",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={{ color: "#888" }}>
              {item.city}, {item.country}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
