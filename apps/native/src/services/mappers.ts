import { Quest, Lobby, Player, UserCredits, Purchase } from "@repo/types";
import type { z } from "zod";
import { RiddleSchema } from "@repo/types";

type Riddle = z.infer<typeof RiddleSchema>;

// ✅ Quests
export function mapQuestToUI(q: Quest) {
  return {
    id: q.id,
    cityKey: q.city, // e.g. "jerusalem"
    countryCode: q.country, // e.g. "IL"
    heroImage: q.hero_image,
    latitude: q.latitude,
    longitude: q.longitude,
    createdBy: q.created_by,
    createdAt: q.created_at.toISOString(),
    translations: q.translations, // [{locale, title, description}, ...]
  };
}
export type QuestUI = ReturnType<typeof mapQuestToUI>;

export function mapRiddleToUI(r: Riddle) {
  return {
    id: r.id,
    questId: r.quest_id,
    lat: r.latitude,
    lng: r.longitude,
    radiusM: r.radius_m ?? 30,
    orderIndex: r.order_index,
    createdAt: r.created_at.toISOString(),
    image: r.image ?? null,
    translations: r.translations,
    answers: (r.answers ?? []).map((a) => ({
      id: a.id,
      text: a.answer,
      isCorrect: a.is_correct ?? true, // ✅ normalized
    })),
  };
}

export type RiddleUI = ReturnType<typeof mapRiddleToUI>;

// ✅ Lobbies
export function mapLobbyToUI(l: Lobby) {
  return {
    id: l.id,
    code: l.code,
    hostId: l.host_id,
    questId: l.quest_id,
    status: l.status,
    createdAt: l.created_at,
    // translations: l.translations ?? [], // optional if you add lobby_translations
  };
}
export type LobbyUI = ReturnType<typeof mapLobbyToUI>;

// ✅ Players
export function mapPlayerToUI(p: Player) {
  return {
    id: p.id,
    lobbyId: p.lobby_id,
    playerId: p.player_id,
    isHost: Boolean(p.is_host),
    isReady: Boolean(p.is_ready),
  };
}
export type PlayerUI = ReturnType<typeof mapPlayerToUI>;

// ✅ User Credits
export function mapCreditsToUI(c: UserCredits) {
  return {
    userId: c.user_id,
    balance: c.balance,
    updatedAt: c.updated_at,
  };
}
export type UserCreditsUI = ReturnType<typeof mapCreditsToUI>;

// ✅ Purchases
export function mapPurchaseToUI(p: Purchase) {
  return {
    id: p.id,
    userId: p.user_id,
    packageId: p.package_id,
    credits: p.credits,
    amount: p.amount,
    currency: p.currency,
    createdAt: p.created_at,
  };
}
export type PurchaseUI = ReturnType<typeof mapPurchaseToUI>;
