import { z } from "zod";

export const PlayerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatarUrl: z.string().url().nullable().optional(),
  isHost: z.boolean().default(false),
  isReady: z.boolean().default(false),
});

export type Player = z.infer<typeof PlayerSchema>;

export const LobbySchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(4).max(8),
  hostId: z.string().uuid(),
  questId: z.string().uuid(),
  status: z.enum(["waiting", "active", "completed"]).default("waiting"),
  createdAt: z.coerce.date(), // ✅ coercion
  players: z.array(PlayerSchema).default([]),
});

export type Lobby = z.infer<typeof LobbySchema>;
