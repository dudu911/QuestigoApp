import { StyledText, StyledButton } from "@repo/ui";
import { View } from "react-native";
import { BottomPanel } from "../../../src/components/BottomPanel";
import { Link } from "expo-router";

export default function Map() {
  return (
    <BottomPanel>
      <StyledText size="xl">Map</StyledText>
      <StyledText size="sm">
        Explore the world and find quest locations
      </StyledText>
      <StyledButton variant="secondary">Find Nearby Quests</StyledButton>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
        <Link href="/(shell)/home" asChild>
          <StyledButton variant="secondary" size="sm">
            Home
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
      </View>
    </BottomPanel>
  );
}
