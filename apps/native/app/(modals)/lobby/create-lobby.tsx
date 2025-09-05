// app/(modals)/lobby/create-lobby.tsx
import React, { useState } from "react";
import { View, ActivityIndicator, FlatList, Pressable } from "react-native";
import { StyledView, StyledText, StyledButton } from "@repo/ui";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { fetchQuests } from "../../../src/services/questService";
import { createLobby } from "../../../src/services/lobbyService";
import { useAppSelector } from "@redux/hooks";
import { RootState } from "../../../src/redux/store";

export default function CreateLobbyModal() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("he") ? "he" : "en";
  const userId = useAppSelector((s: RootState) => s.auth.user?.id);

  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: quests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["quests", locale],
    queryFn: () => fetchQuests(locale),
  });

  const handleCreate = async () => {
    try {
      console.log("Creating lobby...");
      if (!userId) throw new Error("Not logged in");
      if (!selectedQuestId) throw new Error("Please select a quest first");

      setLoadingCreate(true);
      const lobby = await createLobby(userId, selectedQuestId);
      //await ensurePlayerInLobby(lobby.lobby.id, userId); // ✅ add host as a player row
      router.replace(`/lobby/${lobby.lobby.id}`);
    } catch (err: any) {
      console.log("Error creating lobby:", err);
      setError(err.message);
    } finally {
      setLoadingCreate(false);
    }
  };

  if (isLoading) {
    return (
      <StyledView flex padding="lg">
        <ActivityIndicator />
        <StyledText>{t("common.loading")}</StyledText>
      </StyledView>
    );
  }

  if (isError) {
    return (
      <StyledView flex padding="lg">
        <StyledText>{t("common.error")}</StyledText>
        <StyledButton variant="secondary" onPress={() => router.back()}>
          {t("common.close")}
        </StyledButton>
      </StyledView>
    );
  }

  return (
    <StyledView flex padding="lg" backgroundColor="white">
      <StyledText size="xl" fontWeight="bold" marginBottom="md">
        {t("team.createTeam")}
      </StyledText>

      <FlatList
        data={quests}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelectedQuestId(item.id)}
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor:
                selectedQuestId === item.id ? "blue" : "rgba(0,0,0,0.2)",
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <StyledText fontWeight="bold">{item.title}</StyledText>
            <StyledText>{item.description}</StyledText>
          </Pressable>
        )}
      />

      <View style={{ paddingTop: 16 }}>
        {error && (
          <StyledText color="red" marginBottom="sm">
            {error}
          </StyledText>
        )}

        <StyledButton
          variant="primary"
          disabled={!selectedQuestId || loadingCreate}
          onPress={handleCreate}
        >
          {loadingCreate ? t("common.loading") : t("team.createTeam")}
        </StyledButton>

        <StyledButton variant="secondary" onPress={() => router.back()}>
          {t("common.cancel")}
        </StyledButton>
      </View>
    </StyledView>
  );
}
