import { StyledText, StyledButton } from "@repo/ui";
import { View } from "react-native";
import { BottomPanel } from "../../src/components/BottomPanel";
import { Link } from "expo-router";

export default function Home() {
  return (
    <BottomPanel>
      <StyledText size="xl">Home</StyledText>
      <StyledButton>Start a quest</StyledButton>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
        <Link href="/(shell)/map" asChild>
          <StyledButton variant="secondary" size="sm">
            Map
          </StyledButton>
        </Link>
        <Link href="/(shell)/store" asChild>
          <StyledButton variant="secondary" size="sm">
            Store
          </StyledButton>
        </Link>
        <Link href="/(shell)/profile" asChild>
          <StyledButton variant="secondary" size="sm">
            Profile
          </StyledButton>
        </Link>
        <Link href="/(shell)/quests" asChild>
          <StyledButton variant="secondary" size="sm">
            Quests
          </StyledButton>
        </Link>
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
        <Link href="/(modals)/hint" asChild>
          <StyledButton variant="secondary" size="sm">
            Hint Modal
          </StyledButton>
        </Link>
        <Link href="/(modals)/lobby" asChild>
          <StyledButton variant="secondary" size="sm">
            Lobby Modal
          </StyledButton>
        </Link>
      </View>
    </BottomPanel>
  );
}
