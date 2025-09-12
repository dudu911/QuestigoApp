// src/hooks/useLobby.ts
import { useEffect, useMemo } from "react";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { RootState } from "@redux/store";
import { setLobby, setPlayers, resetLobby } from "../redux/lobbySlice";
import {
  fetchLobbyWithPlayers,
  ensurePlayerInLobby,
  leaveLobby,
  setPlayerReady,
  startLobby,
  kickPlayer,
} from "../services/lobbyService";

export function useLobby(lobbyId?: string) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    lobbyId: storedId,
    code,
    status,
    questId,
    players,
  } = useAppSelector((s: RootState) => s.lobby);
  const userId = useAppSelector((s: RootState) => s.auth.user?.id);

  const me = players.find((p) => p.playerId === userId);
  const allReady = players.length > 0 && players.every((p) => p.isReady);

  // 🔹 Initial fetch + ensure player
  useEffect(() => {
    if (!lobbyId || !userId) return;

    (async () => {
      try {
        const { lobby, players } = await fetchLobbyWithPlayers(lobbyId);
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

        await ensurePlayerInLobby(lobbyId, userId);

        if (lobby.status === "active" && lobby.questId) {
          router.replace(`/quest/${lobby.questId}`);
        }
      } catch (err) {
        console.error("❌ Failed to load lobby:", err);
      }
    })();

    return () => {
      // Don’t reset subscription here; handled by middleware
      dispatch(resetLobby());
    };
  }, [lobbyId, userId]);

  // 🔹 Redirect if lobby becomes active
  useEffect(() => {
    if (status === "active" && questId) {
      router.replace(`/quest/${questId}`);
    }
  }, [status, questId]);

  // 🔹 Actions
  const actions = useMemo(
    () => ({
      toggleReady: async () => {
        if (!me || !lobbyId) return;
        try {
          // Optimistic update
          dispatch(
            setPlayers(
              players.map((p) =>
                p.playerId === me.playerId ? { ...p, isReady: !me.isReady } : p,
              ),
            ),
          );
          await setPlayerReady(me.playerId, lobbyId, !me.isReady);
        } catch (err) {
          console.error("❌ Failed to toggle ready:", err);
        }
      },
      start: async () => {
        if (!lobbyId) return;
        try {
          await startLobby(lobbyId);
        } catch (err) {
          console.error("❌ Failed to start lobby:", err);
        }
      },
      leave: async () => {
        if (!lobbyId || !me) return;
        try {
          await leaveLobby(lobbyId, me.playerId, me.isHost);
          router.replace("/home");
        } catch (err) {
          console.error("❌ Failed to leave lobby:", err);
        }
      },
      kick: async (playerId: string) => {
        if (!lobbyId || !me) return;
        try {
          await kickPlayer(lobbyId, me.playerId, playerId);
        } catch (err) {
          console.error("❌ Failed to kick player:", err);
        }
      },
    }),
    [me, lobbyId, players],
  );

  return {
    lobbyId: storedId,
    code,
    status,
    questId,
    players,
    me,
    allReady,
    actions,
  };
}
