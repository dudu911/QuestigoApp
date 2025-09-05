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
// ✅ Create a lobby and register host as a player
export async function createLobby(
  hostId: string,
  questId: string,
): Promise<{
  lobby: LobbyUI;
  hostPlayer: PlayerUI;
}> {
  const code = generateLobbyCode();

  // 1. Create lobby
  const { data: lobbyData, error: lobbyError } = await supabase
    .from("lobbies")
    .insert({ host_id: hostId, quest_id: questId, code })
    .select("*")
    .single();

  if (lobbyError) throw lobbyError;

  const lobby = mapLobbyRowToUI(lobbyData);

  // 2. Insert host into lobby_players with is_host = true
  const { data: playerData, error: playerError } = await supabase
    .from("lobby_players")
    .insert({
      lobby_id: lobby.id,
      player_id: hostId,
      is_host: true, // 👈 mark host
    })
    .select(
      "*, id, lobby_id, player_id, is_host, is_ready, profiles (username)",
    )
    .single();

  if (playerError) throw playerError;

  const hostPlayer = mapPlayerRowToUI(playerData);

  return { lobby, hostPlayer };
}
// ✅ Join a lobby
export async function joinLobby(
  lobbyId: string,
  playerId: string,
): Promise<PlayerUI> {
  const { data, error } = await supabase
    .from("lobby_players")
    .insert({ lobby_id: lobbyId, player_id: playerId })
    .select(
      "*, id, lobby_id, player_id, is_host, is_ready, profiles (username)",
    )
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
// src/services/lobbyService.ts

export async function setPlayerReady(
  playerId: string,
  lobbyId: string,
  isReady: boolean,
): Promise<PlayerUI> {
  console.log("setPlayerReady", { playerId, lobbyId, isReady }); // 🔍 debug

  // Update the row
  const { data, error } = await supabase
    .from("lobby_players")
    .update({ is_ready: isReady })
    .eq("player_id", playerId)
    .eq("lobby_id", lobbyId)
    .select("id, lobby_id, player_id, is_host, is_ready, profiles (username)")
    .maybeSingle(); // ✅ safer than single()

  if (error) throw error;

  if (!data) {
    // 🔄 fallback: ensure player exists and fetch it
    const { data: existing, error: fetchErr } = await supabase
      .from("lobby_players")
      .select("id, lobby_id, player_id, is_host, is_ready, profiles (username)")
      .eq("player_id", playerId)
      .eq("lobby_id", lobbyId)
      .maybeSingle();

    if (fetchErr) throw fetchErr;
    if (!existing) {
      throw new Error(
        `Player ${playerId} not found in lobby ${lobbyId} after update`,
      );
    }

    return mapPlayerRowToUI(existing as PlayerRowWithProfile);
  }

  // ✅ Normal path
  return mapPlayerRowToUI(
    Array.isArray(data.profiles)
      ? { ...data, profiles: data.profiles[0] }
      : (data as PlayerRowWithProfile),
  );
}
// ✅ Ensure player is in lobby (idempotent)
export async function ensurePlayerInLobby(
  lobbyId: string,
  playerId: string,
): Promise<PlayerUI> {
  const { data: existing, error: fetchErr } = await supabase
    .from("lobby_players")
    .select("id, lobby_id, player_id, is_host, is_ready, profiles (username)")
    .eq("lobby_id", lobbyId)
    .eq("player_id", playerId)
    .maybeSingle();

  if (fetchErr) throw fetchErr;
  if (existing) {
    // Fix: convert profiles array to object for PlayerRowWithProfile compatibility
    const fixedExisting = {
      ...existing,
      profiles: Array.isArray(existing.profiles)
        ? existing.profiles[0]
        : existing.profiles,
    };
    return mapPlayerRowToUI(fixedExisting as PlayerRowWithProfile);
  }

  const { data, error } = await supabase
    .from("lobby_players")
    .insert({ lobby_id: lobbyId, player_id: playerId })
    .select("id, lobby_id, player_id, is_host, is_ready, profiles (username)")
    .single();

  if (error) throw error;
  // Fix: convert profiles array to object for PlayerRowWithProfile compatibility
  const fixedData = {
    ...data,
    profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
  };
  return mapPlayerRowToUI(fixedData as PlayerRowWithProfile);
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
