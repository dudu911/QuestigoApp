import React from "react";
import {
  View,
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { StyledText } from "@repo/ui";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../src/services/supabaseClient";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { mapQuestRowToUI, QuestRow } from "../../../src/mappers/questMapper";

async function fetchQuests(): Promise<QuestRow[]> {
  const { data, error } = await supabase.from("quests").select(`
      id,
      latitude,
      longitude,
      country,
      city,
      quest_translations (*)
    `);
  if (error) throw error;
  return data as QuestRow[];
}

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("he") ? "he" : "en";

  const {
    data: questRows = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["quests"],
    queryFn: fetchQuests,
    staleTime: 1000 * 60 * 5,
  });

  const quests = questRows.map((q) => mapQuestRowToUI(q, locale));

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
        <StyledText>{t("common.loading")}</StyledText>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StyledText>{t("common.error")}</StyledText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={quests}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        contentContainerStyle={{ paddingBottom: 36 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/quest/${item.id}`)}
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
          >
            <StyledText size="xl" fontWeight="bold">
              {item.title}
            </StyledText>
            <StyledText>{item.description}</StyledText>
          </Pressable>
        )}
      />
    </View>
  );
}
