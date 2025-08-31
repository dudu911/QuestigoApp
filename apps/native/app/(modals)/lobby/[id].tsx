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
} from "../../../src/services/lobbyService";

export default function LobbyModal() {
  const { id } = useLocalSearchParams<{ id: string; code: string }>();
  const dispatch = useAppDispatch();
  const players = useAppSelector((s) => s.lobby.players);

  useEffect(() => {
    if (!id) return;

    // fetch once
    fetchLobbyWithPlayers(id).then((lobby) => {
      // ✅ store both id + code in Redux
      dispatch(setLobby({ id: lobby.id, code: lobby.code }));

      // ✅ set players
      dispatch(
        setPlayers(
          lobby.lobby_players.map((p: any) => ({
            id: p.id,
            playerId: p.player_id,
            username: p.profiles?.username,
            isHost: p.is_host,
            isReady: p.is_ready,
          })),
        ),
      );
    });

    // subscribe realtime
    const sub = subscribeToLobby(id, () => {
      fetchLobbyWithPlayers(id).then((lobby) => {
        // keep id/code in Redux in sync too
        dispatch(setLobby({ id: lobby.id, code: lobby.code }));

        dispatch(
          setPlayers(
            lobby.lobby_players.map((p: any) => ({
              id: p.id,
              playerId: p.player_id,
              username: p.profiles?.username,
              isHost: p.is_host,
              isReady: p.is_ready,
            })),
          ),
        );
      });
    });

    return () => {
      sub.unsubscribe();
      dispatch(resetLobby());
    };
  }, [id]);

  return (
    <StyledView flex={1} padding="lg" backgroundColor="white">
      <StyledText size="xl" fontWeight="bold" marginBottom="md">
        👥 Lobby {id}
      </StyledText>

      {players.map((p) => (
        <StyledText key={p.id}>
          {p.username ?? p.playerId} {p.isHost ? "⭐" : ""}{" "}
          {p.isReady ? "✅" : "❌"}
        </StyledText>
      ))}

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
