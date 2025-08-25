import React from "react";
import { useLocalSearchParams, router } from "expo-router";
import { StyledView, StyledText, StyledButton } from "@repo/ui";

export default function QuestModal() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <StyledView
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="white"
      padding="lg"
      style={{ borderRadius: 12 }}
    >
      <StyledText size="xl" fontWeight="bold" marginBottom="md">
        🎯 Quest: {id}
      </StyledText>

      <StyledButton
        variant="primary"
        onPress={() => router.push(`/lobby/${id}-lobby`)}
        style={{ marginBottom: 12 }}
      >
        Join Lobby
      </StyledButton>

      <StyledButton variant="secondary" onPress={() => router.back()}>
        Close
      </StyledButton>
    </StyledView>
  );
}
