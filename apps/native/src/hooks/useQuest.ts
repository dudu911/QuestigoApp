// src/hooks/useQuest.ts
import { useEffect, useState, useCallback, useMemo } from "react";
import { useFocusEffect, router } from "expo-router";
import * as Location from "expo-location";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { RootState } from "../redux/store";
import {
  setActiveQuestId,
  nextRiddle,
  setHintUsed,
  setRiddleIndex,
  resetQuest,
} from "../redux/questSlice";
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
  const [resumed, setResumed] = useState(false);
  const [progressChecked, setProgressChecked] = useState(false);

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

  // Reset quest only when modal closes (not mid-query)
  useFocusEffect(
    useCallback(() => {
      return () => {
        dispatch(resetQuest());
        setResumed(false);
      };
    }, [dispatch]),
  );
  useEffect(() => {
    return () => {
      dispatch(resetQuest());
      setResumed(false);
    };
  }, [dispatch]);

  // Load quest progress from DB
  useEffect(() => {
    if (!id || !userId) return;

    (async () => {
      const { data: progress, error } = await supabase
        .from("quest_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("quest_id", id)
        .maybeSingle();

      if (error) {
        console.error("❌ Failed to fetch quest progress:", error);
        setProgressChecked(true);
        return;
      }

      if (progress) {
        dispatch(setRiddleIndex(progress.riddle_index));
        if (progress.hint_used) dispatch(setHintUsed());
        setResumed(progress.riddle_index > 0 || progress.hint_used);
      } else {
        await supabase.from("quest_progress").insert({
          user_id: userId,
          quest_id: id,
          riddle_index: 0,
          hint_used: false,
        });
        setResumed(false);
      }
      setProgressChecked(true);
    })();
  }, [id, userId, dispatch]);

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

  const persistProgress = async (newIndex: number, newHintUsed: boolean) => {
    if (!userId || !quest) return;
    await supabase.from("quest_progress").upsert(
      {
        user_id: userId,
        quest_id: quest.id!,
        riddle_index: newIndex,
        hint_used: newHintUsed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,quest_id" },
    );
  };

  const actions = {
    next: async () => {
      const newIndex = riddleIndex + 1;

      if (newIndex < riddles.length) {
        dispatch(nextRiddle());
        await persistProgress(newIndex, false);
      } else {
        // Quest completed: clear progress + reset
        dispatch(resetQuest());
        setResumed(false);

        if (userId && quest) {
          await supabase
            .from("quest_progress")
            .delete()
            .eq("user_id", userId)
            .eq("quest_id", quest.id!);
        }

        // Delay navigation to avoid query race
        setTimeout(() => router.replace("/home"), 100);
      }
    },
    showHint: async () => {
      dispatch(setHintUsed());
      await persistProgress(riddleIndex, true);
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
    resumed,
    progressChecked,
  };
}
