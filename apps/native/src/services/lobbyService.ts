import { supabase } from "./supabaseClient";

function generateLobbyCode(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createLobby(hostId: string, questId: string) {
  const code = generateLobbyCode();

  const { data, error } = await supabase
    .from("lobbies")
    .insert({
      host_id: hostId,
      quest_id: questId,
      code, // 👈 short join codeX
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function joinLobby(lobbyId: string, playerId: string) {
  const { data, error } = await supabase
    .from("lobby_players")
    .insert({ lobby_id: lobbyId, player_id: playerId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchLobbyWithPlayers(lobbyId: string) {
  const { data, error } = await supabase
    .from("lobbies")
    .select(
      `
      id,
      code,
      host_id,
      created_at,
      lobby_players (
        id,
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
  return data;
}

// 🔴 realtime subscription
export function subscribeToLobby(
  lobbyId: string,
  onChange: (payload: any) => void,
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
      onChange,
    )
    .subscribe();
}
