import { z } from "zod";

// Player schema
export const PlayerSchema = z.object({
  id: z.string().uuid(), // user id
  name: z.string(),
  avatarUrl: z.string().url().nullable(),
  isHost: z.boolean().default(false),
  isReady: z.boolean().default(false),
});

export type Player = z.infer<typeof PlayerSchema>;

// Lobby schema
export const LobbySchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(4).max(8), // join code
  hostId: z.string().uuid(),
  questId: z.string().uuid(),
  status: z.enum(["waiting", "active", "completed"]).default("waiting"),
  createdAt: z.string().datetime(),
  players: z.array(PlayerSchema),
});

export type Lobby = z.infer<typeof LobbySchema>;
