"use client";

import { StyledView, StyledText, StyledButton, ThemeProvider } from "@repo/ui";

export default function Web() {
  return (
    <ThemeProvider>
      <StyledView
        padding="lg"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          minHeight: 600,
        }}
      >
        <StyledText size="2xl" fontWeight="bold" marginBottom="md">
          Web App
        </StyledText>
        <StyledText size="lg" color="orange" marginBottom="sm">
          Questigo Web Platform
        </StyledText>
        <StyledText
          size="xl"
          fontWeight="bold"
          marginBottom="lg"
          color="orange"
        >
          Universal UI Components Working!
        </StyledText>
        <StyledButton variant="primary" onPress={() => console.log("Pressed!")}>
          Test Button
        </StyledButton>
      </StyledView>
    </ThemeProvider>
  );
}
