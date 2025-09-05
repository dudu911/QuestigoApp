// src/redux/middleware/supabaseRealtime.ts
import { Middleware } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabaseClient";
import { setPlayers, setLobby } from "../lobbySlice";
import { setBalance, setPurchases } from "../creditsSlice";

import {
  LobbySchema,
  UserCreditsSchema,
  PurchaseSchema,
  PlayerRowWithProfile,
} from "@repo/types";
import {
  mapCreditsRowToUI,
  mapPlayerRowToUI,
  mapPurchaseRowToUI,
} from "../../mappers";

export const supabaseRealtimeMiddleware: Middleware = (store) => {
  let lobbyChannel: ReturnType<typeof supabase.channel> | null = null;
  let creditsChannel: ReturnType<typeof supabase.channel> | null = null;
  let purchasesChannel: ReturnType<typeof supabase.channel> | null = null;

  return (next) => (action: any) => {
    const result = next(action);

    // ✅ Lobby subscription
    // ✅ Handle lobby subscription (lobbies + lobby_players)
    // ✅ Handle lobby subscription (lobbies + lobby_players)
    if (action.type === "lobby/setLobby" && action.payload?.id) {
      const lobbyId = action.payload.id;

      if (lobbyChannel) {
        supabase.removeChannel(lobbyChannel);
        lobbyChannel = null;
      }

      lobbyChannel = supabase
        .channel(`lobby:${lobbyId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "lobby_players",
            filter: `lobby_id=eq.${lobbyId}`,
          },
          async () => {
            const { data, error } = await supabase
              .from("lobby_players")
              .select(
                "id, lobby_id, player_id, is_host, is_ready, profiles (username)",
              )
              .eq("lobby_id", lobbyId);

            if (!error && data) {
              const players = (data as PlayerRowWithProfile[]).map(
                mapPlayerRowToUI,
              );
              store.dispatch(setPlayers(players));
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "lobbies",
            filter: `id=eq.${lobbyId}`,
          },
          (payload) => {
            if (payload.new) {
              const lobby = LobbySchema.safeParse(payload.new);
              if (lobby.success) {
                store.dispatch(
                  setLobby({
                    id: lobby.data.id,
                    code: lobby.data.code,
                    status: lobby.data.status,
                    questId: lobby.data.quest_id ?? null,
                    hostId: lobby.data.host_id ?? null,
                  }),
                );
              }
            }
          },
        )
        .subscribe((status) =>
          console.log("🔔 Lobby realtime subscription status:", status),
        );

      console.log(`✅ Subscribed to realtime updates for lobby ${lobbyId}`);
    }

    if (action.type === "lobby/resetLobby") {
      if (lobbyChannel) {
        supabase.removeChannel(lobbyChannel);
        lobbyChannel = null;
        console.log("🛑 Unsubscribed from lobby realtime");
      }
    }

    // ✅ Credits subscription
    if (action.type === "auth/setUser" && action.payload?.id) {
      const userId = action.payload.id;

      if (creditsChannel) {
        supabase.removeChannel(creditsChannel);
        creditsChannel = null;
      }
      if (purchasesChannel) {
        supabase.removeChannel(purchasesChannel);
        purchasesChannel = null;
      }

      creditsChannel = supabase
        .channel(`credits:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user_credits",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.new) {
              const credits = UserCreditsSchema.safeParse(payload.new);
              if (credits.success) {
                const mapped = mapCreditsRowToUI(credits.data);
                store.dispatch(setBalance(mapped.balance));
              }
            }
          },
        )
        .subscribe();

      purchasesChannel = supabase
        .channel(`purchases:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "purchases",
            filter: `user_id=eq.${userId}`,
          },
          async () => {
            const { data, error } = await supabase
              .from("purchases")
              .select("*")
              .eq("user_id", userId)
              .order("created_at", { ascending: false });

            if (!error && data) {
              const parsed = PurchaseSchema.array().safeParse(data);
              if (parsed.success) {
                const purchases = parsed.data.map(mapPurchaseRowToUI);
                store.dispatch(setPurchases(purchases));
              }
            }
          },
        )
        .subscribe();

      console.log(
        `✅ Subscribed to realtime updates for credits & purchases of ${userId}`,
      );
    }

    if (action.type === "auth/logout") {
      if (creditsChannel) {
        supabase.removeChannel(creditsChannel);
        creditsChannel = null;
      }
      if (purchasesChannel) {
        supabase.removeChannel(purchasesChannel);
        purchasesChannel = null;
      }
      console.log("🛑 Unsubscribed from credits & purchases realtime");
    }

    return result;
  };
};
