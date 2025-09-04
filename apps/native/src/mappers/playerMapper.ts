import { PlayerRow } from "@repo/types";

type PlayerRowWithProfile = PlayerRow & {
  profiles?: {
    username?: string | null;
  } | null;
};

export function mapPlayerRowToUI(p: PlayerRowWithProfile) {
  return {
    id: p.id,
    lobbyId: p.lobby_id,
    playerId: p.player_id,
    isHost: p.is_host,
    isReady: p.is_ready,
    username: p.profiles?.username ?? undefined,
  };
}

export type PlayerUI = ReturnType<typeof mapPlayerRowToUI>;
