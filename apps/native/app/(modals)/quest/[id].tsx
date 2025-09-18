// app/(modals)/quest/[id].tsx
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyledView, StyledText, StyledButton } from "@repo/ui";
import { useTranslation } from "react-i18next";
import { useQuest } from "../../../src/hooks/useQuest";

export default function QuestModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
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
    resumed,
    progressChecked,
  } = useQuest(id, locale);

  const [highlight, setHighlight] = useState(false);
  const [singleQuestStarted, setSingleQuestStarted] = useState(false);

  const isDev = process.env.NODE_ENV === "development";
  const canInteract = isDev ? true : insideGeofence;

  // Highlight when resuming
  useEffect(() => {
    if (resumed) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [resumed]);

  // ✅ Don’t render riddles until progress has been checked
  if (isLoading || !progressChecked) {
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

      {resumed && (
        <StyledView
          padding="sm"
          margin="sm"
          backgroundColor="yellow"
          style={{ borderRadius: 6 }}
        >
          <StyledText size="sm">
            {t("quest.resumed", {
              index: riddleIndex + 1,
              hint: hintUsed ? t("quest.hintUsed") : "",
            })}
          </StyledText>
        </StyledView>
      )}

      {/* 🔹 Show riddles only if resumed OR explicitly started */}
      {(resumed || singleQuestStarted) && currentRiddle ? (
        <StyledView
          padding="md"
          style={{
            backgroundColor: highlight ? "#fffae6" : "transparent",
            borderRadius: 6,
          }}
        >
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
              disabled={!canInteract}
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
            disabled={!canInteract}
            onPress={actions.next}
          >
            {riddleIndex < riddles.length - 1
              ? t("quest.nextRiddle")
              : t("quest.finish")}
          </StyledButton>
        </StyledView>
      ) : null}

      {/* 🔹 Entry buttons if not resumed and not started yet */}
      {!resumed && !singleQuestStarted && (
        <>
          <StyledButton
            variant="primary"
            onPress={() => setSingleQuestStarted(true)}
            style={{ marginTop: 16 }}
          >
            {t("quest.startSingle")}
          </StyledButton>

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
        </>
      )}

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
