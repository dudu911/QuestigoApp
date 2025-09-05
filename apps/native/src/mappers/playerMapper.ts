// src/mappers/playerMapper.ts
import { PlayerRowWithProfile } from "@repo/types";

function normalizeProfile(
  profile: PlayerRowWithProfile["profiles"],
): string | undefined {
  if (!profile) return undefined;
  if (Array.isArray(profile)) {
    return profile[0]?.username ?? undefined;
  }
  return profile.username ?? undefined;
}

export function mapPlayerRowToUI(p: PlayerRowWithProfile) {
  return {
    id: p.id,
    lobbyId: p.lobby_id,
    playerId: p.player_id,
    isHost: p.is_host,
    isReady: p.is_ready,
    username: normalizeProfile(p.profiles),
  };
}

export type PlayerUI = ReturnType<typeof mapPlayerRowToUI>;
