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
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { fetchQuests } from "@services/questService";

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("he") ? "he" : "en";

  const {
    data: questRows = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["quests", locale],
    queryFn: () => fetchQuests(locale),
    staleTime: 1000 * 60 * 5,
  });

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
    console.error("Failed to fetch quests", { error: error.message });
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
        data={questRows}
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
