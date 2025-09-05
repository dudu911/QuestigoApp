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
  startLobby,
  setPlayerReady,
  ensurePlayerInLobby,
  leaveLobby,
  kickPlayer,
} from "../../../src/services/lobbyService";
import { RootState } from "@redux/store";
import { supabase } from "@services/supabaseClient";

export default function LobbyModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { lobbyId, code, players, status, questId } = useAppSelector(
    (s) => s.lobby,
  );
  const userId = useAppSelector((s: RootState) => s.auth.user?.id);

  const me = players.find((p) => p.playerId === userId);
  const allReady = players.length > 0 && players.every((p) => p.isReady);

  // 🔹 Initial fetch only (realtime handled by middleware)
  useEffect(() => {
    if (!id) return;

    fetchLobbyWithPlayers(id).then(({ lobby, players }) => {
      dispatch(
        setLobby({
          id: lobby.id,
          code: lobby.code,
          status: lobby.status,
          questId: lobby.questId,
          hostId: lobby.hostId,
        }),
      );
      dispatch(setPlayers(players));

      if (lobby.status === "active" && lobby.questId) {
        router.replace(`/quest/${lobby.questId}`);
      }
    });

    return () => {
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

  useEffect(() => {
    if (!id) return;

    // 🔍 Debug subscription (logs all events from lobby_players)
    const debugChannel = supabase
      .channel("debug:lobby_players")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lobby_players" },
        (payload) => {
          console.log("🔔 Debug payload:", payload);
        },
      )
      .subscribe((status) => console.log("📡 Debug status:", status));

    return () => {
      debugChannel.unsubscribe();
    };
  }, [id]);

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
              // ✅ Optimistic update
              dispatch(
                setPlayers(
                  players.map((p) =>
                    p.playerId === me.playerId
                      ? { ...p, isReady: !me.isReady }
                      : p,
                  ),
                ),
              );

              // ✅ Persist to DB
              await setPlayerReady(me.playerId, lobbyId!, !me.isReady);
            } catch (err) {
              console.error("❌ Failed to toggle ready:", err);
              // Optionally rollback
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
