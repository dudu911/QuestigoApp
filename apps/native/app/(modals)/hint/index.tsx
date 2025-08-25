import { Stack } from "expo-router";
import { StyledText, StyledButton } from "@repo/ui";
import { View } from "react-native";

export default function HintModal() {
  return (
    <>
      <Stack.Screen options={{ presentation: "modal", headerTitle: "Hint" }} />
      <View style={{ padding: 20, gap: 16 }}>
        <StyledText size="lg">Quest Hint</StyledText>
        <StyledText size="sm">One hint per riddle</StyledText>
        <StyledText size="sm">
          💡 Look for the ancient symbol carved into the stone near the fountain
        </StyledText>
        <StyledButton variant="primary">Use Hint</StyledButton>
        <StyledButton variant="secondary">Save for Later</StyledButton>
      </View>
    </>
  );
}
