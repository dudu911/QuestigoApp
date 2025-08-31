import { Lobby } from "@repo/types";

export function mapLobbyToUI(l: Lobby) {
  return {
    id: l.id,
    code: l.code,
    hostId: l.host_id,
    questId: l.quest_id,
    status: l.status,
    createdAt:
      l.created_at && !isNaN(new Date(l.created_at as any).getTime())
        ? new Date(l.created_at as any).toISOString()
        : null,
    // translations: l.translations ?? [], // optional if you add lobby_translations
  };
}
export type LobbyUI = ReturnType<typeof mapLobbyToUI>;
