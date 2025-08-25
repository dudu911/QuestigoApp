import { queryWithSchema, singleWithSchema } from "./queryWithSchema";
import { LobbySchema, PlayerSchema } from "@repo/types";
import { mapLobbyToUI, mapPlayerToUI, LobbyUI, PlayerUI } from "./mappers";
import { supabase } from "./supabaseClient";

// Fetch lobby by id
export async function fetchLobbyById(lobbyId: string): Promise<LobbyUI> {
  const lobby = await singleWithSchema("lobbies", LobbySchema, (q) =>
    q.eq("id", lobbyId),
  );
  return mapLobbyToUI({
    ...lobby,
    status: lobby.status ?? "waiting", // Provide a default status if undefined
  });
}

// Fetch players for a lobby
export async function fetchLobbyPlayers(lobbyId: string): Promise<PlayerUI[]> {
  const players = await queryWithSchema("lobby_players", PlayerSchema, (q) =>
    q.eq("lobby_id", lobbyId),
  );
  return players.map((p) =>
    mapPlayerToUI({
      ...p,
      is_host: Boolean(p.is_host),
      is_ready: Boolean(p.is_ready),
    }),
  );
}

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
