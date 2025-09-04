// src/mappers/lobbyMapper.ts
import { Lobby } from "@repo/types";

export type LobbyUI = {
  id: string;
  code: string;
  questId: string | null;
  hostId: string | null;
  status: "waiting" | "active" | "completed";
  createdAt: string; // ✅ store as ISO string
};

export function mapLobbyRowToUI(row: Lobby): LobbyUI {
  return {
    id: row.id,
    code: row.code,
    questId: row.quest_id ?? null,
    hostId: row.host_id ?? null,
    status: row.status as "waiting" | "active" | "completed",
    createdAt: new Date(row.created_at).toISOString(), // ✅ safe conversion
  };
}
