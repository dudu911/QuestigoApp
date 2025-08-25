import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { StyledView, StyledText, StyledButton } from "@repo/ui";
import { fetchQuests } from "../../../src/services/questService";
import { useAppDispatch } from "../../../src/redux/hooks";
import { setQuests } from "../../../src/redux/questSlice";
import { useTranslation } from "react-i18next";
import i18n from "../../../src/i18n";

export default function QuestDiscoveryScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadQuests = async () => {
      try {
        setLoading(true);
        const data = await fetchQuests();
        dispatch(setQuests(data)); // ✅ push into Redux
      } catch (err: any) {
        console.error("Error fetching quests:", err);
        setError(t("common.error"));
      } finally {
        setLoading(false);
      }
    };
    loadQuests();
  }, []);

  if (loading) {
    return (
      <StyledView flex alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" />
        <StyledText>{t("common.loading")}</StyledText>
      </StyledView>
    );
  }

  if (error) {
    return (
      <StyledView flex alignItems="center" justifyContent="center">
        <StyledText color="red">{error}</StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView flex alignItems="center" justifyContent="center">
      <StyledButton
        onPress={() =>
          i18n.changeLanguage(i18n.language === "en" ? "he" : "en")
        }
      >
        Switch Language
      </StyledButton>

      <StyledText>{t("quest.title")}</StyledText>
      <StyledText>{t("navigation.quests")} loaded ✅</StyledText>
    </StyledView>
  );
}
