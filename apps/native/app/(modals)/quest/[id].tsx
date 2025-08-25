import React, { useEffect, useState } from "react";
import { FlatList, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { StyledView, StyledText, StyledButton } from "@repo/ui";
import {
  fetchQuestById,
  fetchRiddlesForQuest,
} from "../../../src/services/questService";
import type { QuestUI, RiddleUI } from "../../../src/services/mappers";
import { useAppDispatch } from "../../../src/redux/hooks";
import { setActiveQuest, setRiddles } from "../../../src/redux/questSlice";
import { useTranslation } from "react-i18next";

export default function QuestModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("he") ? "he" : "en";

  const [quest, setQuest] = useState<QuestUI | null>(null);
  const [riddles, setRiddlesLocal] = useState<RiddleUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadQuest = async () => {
      try {
        setLoading(true);

        const questData = await fetchQuestById(id);
        setQuest(questData);
        dispatch(setActiveQuest(questData));

        const riddlesData = await fetchRiddlesForQuest(id);
        setRiddlesLocal(riddlesData);
        dispatch(setRiddles(riddlesData));
      } catch (err) {
        console.error("Error loading quest:", err);
      } finally {
        setLoading(false);
      }
    };

    loadQuest();
  }, [id]);

  if (loading) {
    return (
      <StyledView flex alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" />
        <StyledText>{t("common.loading")}</StyledText>
      </StyledView>
    );
  }

  if (!quest) {
    return (
      <StyledView flex alignItems="center" justifyContent="center">
        <StyledText>{t("common.error")}</StyledText>
        <StyledButton variant="secondary" onPress={() => router.back()}>
          {t("common.close")}
        </StyledButton>
      </StyledView>
    );
  }

  // Pick localized quest translation
  const questTr =
    quest.translations.find((tr) => tr.locale === locale) ??
    quest.translations[0];

  return (
    <StyledView flex padding="lg" backgroundColor="white">
      <StyledText size="xl" fontWeight="bold" marginBottom="sm">
        {questTr?.title ?? "Untitled Quest"}
      </StyledText>
      <StyledText size="sm" marginBottom="lg">
        {questTr?.description ?? ""}
      </StyledText>

      <FlatList
        data={riddles}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => {
          const riddleTr =
            item.translations.find((tr) => tr.locale === locale) ??
            item.translations[0];

          return (
            <StyledView
              padding="md"
              marginBottom="sm"
              style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8 }}
            >
              <StyledText fontWeight="bold">{riddleTr?.title}</StyledText>
              <StyledText>{riddleTr?.prompt}</StyledText>
              {riddleTr?.hint && (
                <StyledText size="sm" color="gray">
                  💡 {riddleTr.hint}
                </StyledText>
              )}
            </StyledView>
          );
        }}
      />

      <StyledButton
        variant="primary"
        onPress={() => router.push(`/lobby/${quest.id}-lobby`)}
        style={{ marginTop: 16 }}
      >
        {t("quest.start")}
      </StyledButton>
    </StyledView>
  );
}
