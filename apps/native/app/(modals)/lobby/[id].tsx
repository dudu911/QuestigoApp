// app/(modals)/lobby/[id].tsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { StyledView, StyledText, StyledButton } from "@repo/ui";
import { useLobby } from "../../../src/hooks/useLobby";

export default function LobbyModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { code, players, me, allReady, actions } = useLobby(id);

  return (
    <StyledView flex={1} padding="lg" backgroundColor="white">
      <StyledText size="xl" fontWeight="bold" marginBottom="md">
        👥 Lobby {code}
      </StyledText>

      {players.map((p) => (
        <StyledView
          key={p.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <StyledText>
            {p.username ?? p.playerId} {p.isHost ? "⭐" : ""}{" "}
            {p.isReady ? "✅" : "❌"}
          </StyledText>

          {me?.isHost && p.playerId !== me.playerId && (
            <StyledButton
              variant="secondary"
              onPress={() => actions.kick(p.playerId)}
            >
              Kick
            </StyledButton>
          )}
        </StyledView>
      ))}

      {me && (
        <StyledButton
          variant={me.isReady ? "secondary" : "primary"}
          onPress={actions.toggleReady}
          style={{ marginTop: 16 }}
        >
          {me.isReady ? "Unready" : "Ready"}
        </StyledButton>
      )}

      {me?.isHost && (
        <StyledButton
          variant="primary"
          disabled={!allReady}
          onPress={actions.start}
          style={{ marginTop: 16 }}
        >
          {allReady ? "Start Quest" : "Waiting for players..."}
        </StyledButton>
      )}

      {me && (
        <StyledButton
          variant="secondary"
          onPress={actions.leave}
          style={{ marginTop: 16 }}
        >
          Leave Lobby
        </StyledButton>
      )}

      <StyledButton
        variant="secondary"
        onPress={() => actions.leave()}
        style={{ marginTop: 16 }}
      >
        Close Lobby
      </StyledButton>
    </StyledView>
  );
}
