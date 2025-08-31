import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { StyledView, StyledText, StyledButton } from "@repo/ui";
import * as Location from "expo-location";
import { useAppSelector, useAppDispatch } from "@redux/hooks";

import { RootState } from "../../../src/redux/store";
import {
  setActiveQuestId,
  nextRiddle,
  setHintUsed,
} from "../../../src/redux/questSlice";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../src/services/supabaseClient";
import { getDistanceFromLatLonInM } from "../../../src/utils/geo";
import { mapRiddleRowToUI } from "../../../src/mappers/riddleMapper";
import { mapQuestRowToUI } from "../../../src/mappers/questMapper";
import { useTranslation } from "react-i18next";
import { RiddleRow, QuestRow } from "@repo/types";

// --- Query functions ---
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

export default function QuestModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { i18n, t } = useTranslation();
  const locale = i18n.language.startsWith("he") ? "he" : "en";

  const dispatch = useAppDispatch();
  const riddleIndex = useAppSelector(
    (s: RootState) => s.quest.currentRiddleIndex,
  );
  const hintUsed = useAppSelector((s: RootState) => s.quest.hintUsed);

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
  const riddles = data
    ? data.riddles.map((r) => mapRiddleRowToUI(r, locale))
    : [];

  // Track active quest id
  useEffect(() => {
    if (id) dispatch(setActiveQuestId(id));
  }, [id]);

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

  // Compute distance
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

  if (isLoading) {
    return (
      <StyledView flex padding="lg">
        <StyledText>{t("common.loading")}</StyledText>
      </StyledView>
    );
  }

  if (isError || !quest) {
    return (
      <StyledView flex padding="lg">
        <StyledText>Error loading quest.</StyledText>
        <StyledButton variant="secondary" onPress={() => router.back()}>
          Close
        </StyledButton>
      </StyledView>
    );
  }

  const currentRiddle = riddles[riddleIndex];
  const insideGeofence =
    distance !== null &&
    currentRiddle &&
    distance <= currentRiddle.radiusM + 50;

  return (
    <StyledView flex padding="lg" backgroundColor="white">
      <StyledText size="xl" fontWeight="bold" marginBottom="md">
        {quest.title}
      </StyledText>

      {currentRiddle ? (
        <>
          <StyledText size="lg" marginBottom="sm">
            {currentRiddle.prompt}
          </StyledText>

          {currentRiddle.image && (
            <StyledView margin="md">
              <StyledText>(Image: {currentRiddle.image})</StyledText>
            </StyledView>
          )}

          <StyledText marginBottom="sm">
            Distance: {distance ? `${distance.toFixed(0)}m` : "Unknown"}
          </StyledText>

          <StyledButton
            variant="secondary"
            disabled={!insideGeofence}
            onPress={() => dispatch(setHintUsed())}
            style={{ marginBottom: 8 }}
          >
            {hintUsed
              ? (currentRiddle.hint ?? t("quest.noHint"))
              : t("quest.showHint")}
          </StyledButton>

          <StyledButton
            variant="primary"
            disabled={!insideGeofence}
            onPress={() => {
              if (riddleIndex < riddles.length - 1) {
                dispatch(nextRiddle());
              } else {
                router.replace("/home");
              }
            }}
          >
            {riddleIndex < riddles.length - 1 ? "Next Riddle" : "Finish Quest"}
          </StyledButton>
        </>
      ) : (
        <StyledText>{t("quest.noRiddlesFound")}</StyledText>
      )}

      <StyledButton
        variant="secondary"
        onPress={() => router.back()}
        style={{ marginTop: 16 }}
      >
        {t("common.close")}
      </StyledButton>
    </StyledView>
  );
}
