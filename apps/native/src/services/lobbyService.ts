import { supabase } from "./supabaseClient";

// Subscribe to lobby changes
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
        table: "lobbies",
        filter: `id=eq.${lobbyId}`,
      },
      onChange,
    )
    .subscribe();
}

export async function createLobby(hostId: string) {
  const { data, error } = await supabase
    .from("lobbies")
    .insert({ host_id: hostId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function joinLobby(lobbyId: string, playerId: string) {
  const { data, error } = await supabase
    .from("lobby_players")
    .insert({ lobby_id: lobbyId, player_id: playerId });
  if (error) throw error;
  return data;
}
