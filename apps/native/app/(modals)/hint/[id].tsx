import { useLocalSearchParams, router } from "expo-router";
import { StyledView, StyledText, StyledButton } from "@repo/ui";

export default function HintModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <StyledView flex padding="lg">
      <StyledText size="xl" fontWeight="bold">
        Hint
      </StyledText>
      <StyledText>Showing hint for riddle {id}</StyledText>
      <StyledButton variant="secondary" onPress={() => router.back()}>
        Close
      </StyledButton>
    </StyledView>
  );
}
