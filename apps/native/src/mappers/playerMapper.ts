import { PlayerRow } from "@repo/types";

export function mapPlayerRowToUI(p: PlayerRow) {
  return {
    id: p.id,
    lobbyId: p.lobby_id,
    playerId: p.player_id,
    isHost: p.is_host,
    isReady: p.is_ready,
  };
}

export type PlayerUI = ReturnType<typeof mapPlayerRowToUI>;
