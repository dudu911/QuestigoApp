import React from "react";
import { useLocalSearchParams, router } from "expo-router";
import { StyledView, StyledText, StyledButton } from "@repo/ui";

export default function LobbyModal() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <StyledView
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="white"
      padding="lg"
    >
      <StyledText size="xl" fontWeight="bold" marginBottom="md">
        👥 Lobby: {id}
      </StyledText>

      <StyledButton
        variant="primary"
        onPress={() => router.replace("/home")}
        style={{ marginBottom: 12 }}
      >
        Start Quest → Back to Home
      </StyledButton>

      <StyledButton variant="secondary" onPress={() => router.back()}>
        Close Lobby
      </StyledButton>
    </StyledView>
  );
}
