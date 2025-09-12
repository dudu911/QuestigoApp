// app/(modals)/quest/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { StyledView, StyledText, StyledButton } from "@repo/ui";
import { useTranslation } from "react-i18next";
import { useQuest } from "../../../src/hooks/useQuest";

export default function QuestModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { i18n, t } = useTranslation();
  const locale = i18n.language.startsWith("he") ? "he" : "en";

  const {
    quest,
    currentRiddle,
    riddleIndex,
    hintUsed,
    insideGeofence,
    isLoading,
    isError,
    actions,
    riddles,
  } = useQuest(id, locale);

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
        <StyledText>{t("common.error")}</StyledText>
        <StyledButton variant="secondary" onPress={actions.close}>
          {t("common.close")}
        </StyledButton>
      </StyledView>
    );
  }

  return (
    <StyledView flex={1} padding="lg" backgroundColor="white">
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
            {t("quest.distance")}:{" "}
            {insideGeofence ? t("quest.inside") : t("quest.outside")}
          </StyledText>

          {!hintUsed ? (
            <StyledButton
              variant="secondary"
              disabled={!insideGeofence}
              onPress={actions.showHint}
              style={{ marginBottom: 8 }}
            >
              {t("quest.showHint")}
            </StyledButton>
          ) : (
            <StyledText marginBottom="sm">
              💡 {currentRiddle.hint ?? t("quest.noHint")}
            </StyledText>
          )}

          <StyledButton
            variant="primary"
            disabled={!insideGeofence}
            onPress={actions.next}
          >
            {riddleIndex < riddles.length - 1
              ? t("quest.nextRiddle")
              : t("quest.finish")}
          </StyledButton>
        </>
      ) : (
        <StyledText>{t("quest.noRiddlesFound")}</StyledText>
      )}

      {/* Multiplayer actions */}
      <StyledButton
        variant="primary"
        onPress={actions.createLobby}
        style={{ marginTop: 16 }}
      >
        {t("quest.createLobby")}
      </StyledButton>

      <StyledButton
        variant="secondary"
        onPress={actions.joinLobby}
        style={{ marginTop: 8 }}
      >
        {t("quest.joinLobby")}
      </StyledButton>

      {/* Always last */}
      <StyledButton
        variant="secondary"
        onPress={actions.close}
        style={{ marginTop: 16 }}
      >
        {t("common.close")}
      </StyledButton>
    </StyledView>
  );
}
