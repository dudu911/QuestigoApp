import { useLocalSearchParams, router } from "expo-router";
import { StyledView, StyledText, StyledButton } from "@repo/ui";

export default function HintModal() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <StyledView flex padding="lg" backgroundColor="white">
      <StyledText size="xl" fontWeight="bold" marginBottom="md">
        💡 Hint
      </StyledText>
      <StyledText marginBottom="lg">Showing hint for riddle {id}</StyledText>
      <StyledButton variant="secondary" onPress={() => router.back()}>
        Close
      </StyledButton>
    </StyledView>
  );
}
