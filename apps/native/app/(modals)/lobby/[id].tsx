// app/(modals)/lobby/[id].tsx
import React, { useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { StyledView, StyledText, StyledButton } from "@repo/ui";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  setLobby,
  setPlayers,
  resetLobby,
} from "../../../src/redux/lobbySlice";
import {
  fetchLobbyWithPlayers,
  subscribeToLobby,
  startLobby,
  setPlayerReady,
  ensurePlayerInLobby,
  leaveLobby,
  kickPlayer,
} from "../../../src/services/lobbyService";
import { RootState } from "@redux/store";

export default function LobbyModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { lobbyId, code, players, status, questId } = useAppSelector(
    (s) => s.lobby,
  );
  const userId = useAppSelector((s: RootState) => s.auth.user?.id);

  const me = players.find((p) => p.playerId === userId);
  const allReady = players.length > 0 && players.every((p) => p.isReady);

  // 🔹 Fetch lobby + subscribe
  useEffect(() => {
    if (!id) return;

    const loadLobby = async () => {
      const { lobby, players } = await fetchLobbyWithPlayers(id);
      dispatch(setLobby(lobby));
      dispatch(setPlayers(players));

      if (lobby.status === "active" && lobby.questId) {
        router.replace(`/quest/${lobby.questId}`);
      }
    };

    loadLobby();

    const sub = subscribeToLobby(id, (lobby, players) => {
      dispatch(setLobby(lobby));
      dispatch(setPlayers(players));

      if (lobby.status === "active" && lobby.questId) {
        router.replace(`/quest/${lobby.questId}`);
      }
    });

    return () => {
      sub.unsubscribe();
      dispatch(resetLobby());
    };
  }, [id]);

  // 🔹 Auto-redirect if lobby becomes active
  useEffect(() => {
    if (status === "active" && questId) {
      router.replace(`/quest/${questId}`);
    }
  }, [status, questId]);

  // 🔹 Ensure current user is in the lobby
  useEffect(() => {
    if (!id || !userId) return;

    ensurePlayerInLobby(id, userId).catch((err) =>
      console.error("❌ Failed to join lobby:", err),
    );

    return () => {
      if (userId) {
        const me = players.find((p) => p.playerId === userId);
        leaveLobby(id, userId, me?.isHost ?? false).catch((err) =>
          console.error("❌ Failed to leave lobby:", err),
        );
      }
      dispatch(resetLobby());
    };
  }, [id, userId]);

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

          {/* ✅ Kick button only for host, not self */}
          {me?.isHost && p.playerId !== userId && (
            <StyledButton
              variant="secondary"
              onPress={async () => {
                try {
                  await kickPlayer(lobbyId!, me.playerId, p.playerId);
                } catch (err) {
                  console.error("❌ Failed to kick player:", err);
                }
              }}
            >
              Kick
            </StyledButton>
          )}
        </StyledView>
      ))}

      {me && (
        <StyledButton
          variant={me.isReady ? "secondary" : "primary"}
          onPress={async () => {
            try {
              await setPlayerReady(me.playerId, lobbyId!, !me.isReady);
            } catch (err) {
              console.error("❌ Failed to toggle ready:", err);
            }
          }}
          style={{ marginTop: 16 }}
        >
          {me.isReady ? "Unready" : "Ready"}
        </StyledButton>
      )}

      {me?.isHost && (
        <StyledButton
          variant="primary"
          disabled={!allReady}
          onPress={async () => {
            try {
              await startLobby(lobbyId!);
            } catch (err) {
              console.error("❌ Failed to start quest:", err);
            }
          }}
          style={{ marginTop: 16 }}
        >
          {allReady ? "Start Quest" : "Waiting for players..."}
        </StyledButton>
      )}

      {me && (
        <StyledButton
          variant="secondary"
          onPress={async () => {
            try {
              await leaveLobby(lobbyId!, me.playerId, me.isHost);
              router.replace("/home");
            } catch (err) {
              console.error("❌ Failed to leave lobby:", err);
            }
          }}
          style={{ marginTop: 16 }}
        >
          Leave Lobby
        </StyledButton>
      )}

      <StyledButton
        variant="secondary"
        onPress={() => router.back()}
        style={{ marginTop: 16 }}
      >
        Close Lobby
      </StyledButton>
    </StyledView>
  );
}
