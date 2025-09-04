// src/services/lobbyService.ts
import { supabase } from "./supabaseClient";
import { mapLobbyRowToUI, LobbyUI } from "../mappers/lobbyMapper";
import { mapPlayerRowToUI, PlayerUI } from "../mappers/playerMapper";
import { PlayerRowWithProfile } from "@repo/types";

function generateLobbyCode(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length })
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join("");
}

// ✅ Create a lobby
export async function createLobby(
  hostId: string,
  questId: string,
): Promise<LobbyUI> {
  const code = generateLobbyCode();
  const { data, error } = await supabase
    .from("lobbies")
    .insert({ host_id: hostId, quest_id: questId, code })
    .select("*")
    .single();

  if (error) throw error;
  return mapLobbyRowToUI(data);
}

// ✅ Join a lobby
export async function joinLobby(
  lobbyId: string,
  playerId: string,
): Promise<PlayerUI> {
  const { data, error } = await supabase
    .from("lobby_players")
    .insert({ lobby_id: lobbyId, player_id: playerId })
    .select("*, profiles (username)")
    .single();

  if (error) throw error;
  return mapPlayerRowToUI(data as PlayerRowWithProfile);
}

// ✅ Fetch lobby with players
export async function fetchLobbyWithPlayers(
  lobbyId: string,
): Promise<{ lobby: LobbyUI; players: PlayerUI[] }> {
  const { data, error } = await supabase
    .from("lobbies")
    .select(
      `
      *,
      lobby_players (
        id,
        lobby_id,
        player_id,
        is_host,
        is_ready,
        profiles (username)
      )
    `,
    )
    .eq("id", lobbyId)
    .single();

  if (error) throw error;

  return {
    lobby: mapLobbyRowToUI(data),
    players: (data.lobby_players as PlayerRowWithProfile[]).map(
      mapPlayerRowToUI,
    ),
  };
}

// ✅ Subscribe to lobby updates
export function subscribeToLobby(
  lobbyId: string,
  onChange: (lobby: LobbyUI, players: PlayerUI[]) => void,
) {
  return supabase
    .channel(`lobby:${lobbyId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "lobby_players",
        filter: `lobby_id=eq.${lobbyId}`,
      },
      async () => {
        try {
          const { lobby, players } = await fetchLobbyWithPlayers(lobbyId);
          onChange(lobby, players);
        } catch (err) {
          console.error("❌ Failed to refresh lobby:", err);
        }
      },
    )
    .subscribe();
}

// ✅ Lookup by join code
export async function getLobbyByCode(code: string): Promise<LobbyUI> {
  const { data, error } = await supabase
    .from("lobbies")
    .select("*")
    .eq("code", code)
    .single();

  if (error) throw error;
  return mapLobbyRowToUI(data);
}

// ✅ Update lobby status
export async function updateLobbyStatus(
  lobbyId: string,
  status: "waiting" | "active" | "completed",
): Promise<LobbyUI> {
  const { data, error } = await supabase
    .from("lobbies")
    .update({ status })
    .eq("id", lobbyId)
    .select("*")
    .single();

  if (error) throw error;
  return mapLobbyRowToUI(data);
}

// ✅ Host sets lobby active
export async function startLobby(lobbyId: string): Promise<LobbyUI> {
  const { data, error } = await supabase
    .from("lobbies")
    .update({ status: "active" })
    .eq("id", lobbyId)
    .select("*")
    .single();

  if (error) throw error;
  return mapLobbyRowToUI(data);
}

// ✅ Toggle player ready
export async function setPlayerReady(
  playerId: string,
  lobbyId: string,
  isReady: boolean,
): Promise<PlayerUI> {
  const { data, error } = await supabase
    .from("lobby_players")
    .update({ is_ready: isReady })
    .eq("player_id", playerId)
    .eq("lobby_id", lobbyId)
    .select("*, profiles (username)")
    .single();

  if (error) throw error;
  return mapPlayerRowToUI(data as PlayerRowWithProfile);
}

// ✅ Ensure player is in lobby (idempotent)
export async function ensurePlayerInLobby(
  lobbyId: string,
  playerId: string,
): Promise<PlayerUI> {
  const { data: existing, error: fetchErr } = await supabase
    .from("lobby_players")
    .select("*, profiles (username)")
    .eq("lobby_id", lobbyId)
    .eq("player_id", playerId)
    .maybeSingle();

  if (fetchErr) throw fetchErr;
  if (existing) return mapPlayerRowToUI(existing as PlayerRowWithProfile);

  const { data, error } = await supabase
    .from("lobby_players")
    .insert({ lobby_id: lobbyId, player_id: playerId })
    .select("*, profiles (username)")
    .single();

  if (error) throw error;
  return mapPlayerRowToUI(data as PlayerRowWithProfile);
}

// ✅ Leave lobby (reassign host if needed)
export async function leaveLobby(
  lobbyId: string,
  playerId: string,
  isHost = false,
): Promise<void> {
  const { error: removeError } = await supabase
    .from("lobby_players")
    .delete()
    .eq("lobby_id", lobbyId)
    .eq("player_id", playerId);

  if (removeError) throw removeError;

  if (isHost) {
    const { data: players, error: playersError } = await supabase
      .from("lobby_players")
      .select("id, player_id")
      .eq("lobby_id", lobbyId)
      .limit(1);

    if (playersError) throw playersError;

    if (!players || players.length === 0) {
      await supabase.from("lobbies").delete().eq("id", lobbyId);
    } else {
      const newHost = players[0];
      await supabase
        .from("lobbies")
        .update({ host_id: newHost.player_id })
        .eq("id", lobbyId);
      await supabase
        .from("lobby_players")
        .update({ is_host: true })
        .eq("id", newHost.id);
    }
  }
}

// ✅ Kick a player (host only)
export async function kickPlayer(
  lobbyId: string,
  hostId: string,
  playerId: string,
): Promise<void> {
  const { data: lobby, error } = await supabase
    .from("lobbies")
    .select("host_id")
    .eq("id", lobbyId)
    .single();

  if (error) throw error;
  if (!lobby || lobby.host_id !== hostId) {
    throw new Error("Only the host can kick players");
  }

  const { error: kickError } = await supabase
    .from("lobby_players")
    .delete()
    .eq("lobby_id", lobbyId)
    .eq("player_id", playerId);

  if (kickError) throw kickError;
}
