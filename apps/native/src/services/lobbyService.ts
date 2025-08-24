import { queryWithSchema, singleWithSchema } from "./queryWithSchema";
import { LobbySchema, PlayerSchema } from "@repo/types";
import { supabase } from "./supabaseClient";

// Fetch lobby by id
export async function fetchLobbyById(lobbyId: string) {
  return singleWithSchema("lobbies", LobbySchema, (q) => q.eq("id", lobbyId));
}

// Fetch players for a lobby
export async function fetchLobbyPlayers(lobbyId: string) {
  return queryWithSchema("lobby_players", PlayerSchema, (q) =>
    q.eq("lobby_id", lobbyId),
  );
}

// Subscribe to realtime changes (unchanged — Supabase subscription isn’t typed by Zod)
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
