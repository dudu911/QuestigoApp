import React from "react";
import { useTranslation } from "react-i18next";
import { StyledView, StyledText, StyledButton, useTheme } from "@repo/ui";
import { useAppStore, type SupportedLanguage } from "../src/state/useAppStore";

export function ProvidersDemo() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  // Use the simplified store directly
  const {
    activeQuestId,
    teamCode,
    locale,
    isOnline,
    setActiveQuestId,
    setTeamCode,
    setLocale,
    setIsOnline,
  } = useAppStore();

  const toggleLanguage = async () => {
    const newLocale: SupportedLanguage = locale === "en" ? "he" : "en";
    await i18n.changeLanguage(newLocale);
    setLocale(newLocale);
  };

  const simulateQuest = () => {
    const questId = activeQuestId ? undefined : "demo-quest-123";
    setActiveQuestId(questId);
  };

  const simulateTeam = () => {
    const newTeamCode = teamCode ? undefined : "DEMO";
    setTeamCode(newTeamCode);
  };

  return (
    <StyledView padding="lg" backgroundColor={theme.colors.gray[50]}>
      <StyledText size="xl" fontWeight="bold" marginBottom="md">
        {t("common.loading")} - Providers Demo
      </StyledText>

      <StyledText marginBottom="sm" color={theme.colors.gray[700]}>
        Language: {locale === "en" ? "English" : "עברית"}
      </StyledText>

      <StyledView style={{ marginBottom: theme.spacing.md }}>
        <StyledText size="sm" color={theme.colors.gray[600]} marginBottom="sm">
          🌐 i18n: {t("navigation.home")} | {t("navigation.quests")} |{" "}
          {t("navigation.team")}
        </StyledText>

        <StyledText size="sm" color={theme.colors.gray[600]} marginBottom="sm">
          📱 Zustand State:
        </StyledText>
        <StyledText
          size="sm"
          style={{ fontFamily: "monospace" }}
          marginBottom="sm"
        >
          • Active Quest: {activeQuestId || "None"}
        </StyledText>
        <StyledText
          size="sm"
          style={{ fontFamily: "monospace" }}
          marginBottom="sm"
        >
          • Team Code: {teamCode || "None"}
        </StyledText>
        <StyledText
          size="sm"
          style={{ fontFamily: "monospace" }}
          marginBottom="sm"
        >
          • Online: {isOnline ? "✅" : "❌"}
        </StyledText>
      </StyledView>

      <StyledView style={{ marginBottom: theme.spacing.lg }}>
        <StyledButton
          variant="primary"
          onPress={toggleLanguage}
          style={{ marginBottom: theme.spacing.sm }}
        >
          Switch to {locale === "en" ? "עברית" : "English"}
        </StyledButton>

        <StyledButton
          variant="secondary"
          onPress={simulateQuest}
          style={{ marginBottom: theme.spacing.sm }}
        >
          {activeQuestId ? "Finish Quest" : "Start Quest"}
        </StyledButton>

        <StyledButton
          variant="secondary"
          onPress={simulateTeam}
          style={{ marginBottom: theme.spacing.sm }}
        >
          {teamCode ? "Leave Team" : "Join Team"}
        </StyledButton>

        <StyledButton
          variant="secondary"
          onPress={() => setIsOnline(!isOnline)}
        >
          Toggle Network: {isOnline ? "Go Offline" : "Go Online"}
        </StyledButton>
      </StyledView>

      <StyledView
        backgroundColor={theme.colors.white}
        padding="md"
        style={{
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.colors.gray[300],
        }}
      >
        <StyledText size="sm" color={theme.colors.gray[600]}>
          🎯 Providers Active:
        </StyledText>
        <StyledText size="sm" style={{ fontFamily: "monospace" }}>
          ✅ QueryClientProvider{"\n"}✅ SafeAreaProvider{"\n"}✅ ThemeProvider
          {"\n"}✅ I18nextProvider{"\n"}✅ Zustand Store
        </StyledText>
      </StyledView>
    </StyledView>
  );
}
