import React from "react";
import { FlatList, Pressable } from "react-native";
import { StyledView, StyledText } from "@repo/ui";
import { router } from "expo-router";

// Dummy quest data
const quests = [
  { id: "quest-1", title: "Berlin Adventure" },
  { id: "quest-2", title: "Tel Aviv Quest" },
];

export default function HomeScreen() {
  return (
    <StyledView flex={1} padding="lg">
      <StyledText size="xl" fontWeight="bold" marginBottom="lg">
        🗺️ Quest Discovery
      </StyledText>

      <FlatList
        data={quests}
        keyExtractor={(q) => q.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/quest/${item.id}`)}
            style={{
              padding: 16,
              backgroundColor: "white",
              borderRadius: 8,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <StyledText size="lg" fontWeight="medium">
              {item.title}
            </StyledText>
          </Pressable>
        )}
      />
    </StyledView>
  );
}
