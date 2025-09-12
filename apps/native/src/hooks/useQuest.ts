// src/hooks/useQuest.ts
import { useEffect, useState, useCallback, useMemo } from "react";
import { useFocusEffect, router } from "expo-router";
import * as Location from "expo-location";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { RootState } from "../redux/store";
import { setActiveQuestId, nextRiddle, setHintUsed } from "../redux/questSlice";
import { supabase } from "../services/supabaseClient";
import { mapQuestRowToUI } from "../mappers/questMapper";
import { mapRiddleRowToUI } from "../mappers/riddleMapper";
import { getDistanceFromLatLonInM } from "../utils/geo";
import { RiddleRow, QuestRow } from "@repo/types";
import { createLobby } from "@services/index";

const GEOFENCE_MARGIN = 50;

async function fetchQuestWithRiddles(id: string): Promise<{
  quest: QuestRow;
  riddles: RiddleRow[];
}> {
  const { data, error } = await supabase
    .from("quests")
    .select(
      `
      id,
      country,
      city,
      quest_translations (*),
      riddles (
        id,
        quest_id,
        latitude,
        longitude,
        radius_m,
        image,
        riddle_translations (*)
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !data) throw error ?? new Error("Quest not found");
  return {
    quest: data as unknown as QuestRow,
    riddles: (data.riddles ?? []) as RiddleRow[],
  };
}

export function useQuest(id: string | undefined, locale: "en" | "he") {
  const dispatch = useAppDispatch();
  const riddleIndex = useAppSelector(
    (s: RootState) => s.quest.currentRiddleIndex,
  );
  const hintUsed = useAppSelector((s: RootState) => s.quest.hintUsed);
  const userId = useAppSelector((s: RootState) => s.auth.user?.id);

  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quest", id],
    queryFn: () => fetchQuestWithRiddles(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const quest = data ? mapQuestRowToUI(data.quest, locale) : null;
  const riddles = useMemo(
    () => (data ? data.riddles.map((r) => mapRiddleRowToUI(r, locale)) : []),
    [data, locale],
  );

  // Track active quest id
  useEffect(() => {
    if (id) dispatch(setActiveQuestId(id));
  }, [id, dispatch]);

  // Reset quest when modal closes (focus lost or unmounted)
  useFocusEffect(
    useCallback(() => {
      return () => {
        dispatch(setActiveQuestId(null));
      };
    }, [dispatch]),
  );
  useEffect(() => {
    return () => {
      dispatch(setActiveQuestId(null));
    };
  }, [dispatch]);

  // Get user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setUserCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
    })();
  }, []);

  // Compute distance to current riddle
  useEffect(() => {
    if (userCoords && riddles.length > 0) {
      const r = riddles[riddleIndex];
      if (r) {
        const d = getDistanceFromLatLonInM(
          userCoords.lat,
          userCoords.lng,
          r.lat,
          r.lng,
        );
        setDistance(d);
      }
    }
  }, [userCoords, riddles, riddleIndex]);

  const currentRiddle = riddles[riddleIndex];
  const insideGeofence =
    distance !== null &&
    currentRiddle &&
    distance <= (currentRiddle.radiusM ?? 30) + GEOFENCE_MARGIN;

  const actions = {
    next: () => {
      // ✅ Optimistic UI update
      dispatch(nextRiddle());

      // 🔜 Optional: save progress to DB later
      // await supabase.from("quest_progress").upsert({ user_id: userId, quest_id: quest?.id, riddle_index: riddleIndex + 1 });
    },
    showHint: () => {
      // ✅ Optimistic UI update
      dispatch(setHintUsed());

      // 🔜 Optional: save hint usage to DB
    },
    createLobby: async () => {
      if (!userId || !quest) return;
      const lobby = await createLobby(userId, quest.id!);
      router.push(`/lobby/${lobby.lobby.id}`);
    },
    joinLobby: () => router.push("/(modals)/lobby/join-lobby"),
    close: () => router.back(),
  };

  return {
    quest,
    riddles,
    currentRiddle,
    riddleIndex,
    hintUsed,
    insideGeofence,
    isLoading,
    isError,
    actions,
  };
}
