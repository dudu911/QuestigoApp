import { z } from "zod";

export const PlayerSchema = z.object({
  id: z.string().uuid(),
  lobby_id: z.string().uuid(),
  player_id: z.string().uuid(),
  is_host: z.boolean().catch(false),
  is_ready: z.boolean().catch(false),
});

export type Player = z.infer<typeof PlayerSchema>;

export const LobbySchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(4).max(8),
  host_id: z.string().uuid(),
  quest_id: z.string().uuid(),
  status: z.enum(["waiting", "active", "completed"]).default("waiting"),
  created_at: z.coerce.date(),
});

export type Lobby = z.infer<typeof LobbySchema>;
