import { StyledText, StyledButton } from "@repo/ui";
import { View } from "react-native";
import { BottomPanel } from "../../src/components/BottomPanel";
import { Link } from "expo-router";

export default function Profile() {
  return (
    <BottomPanel>
      <StyledText size="xl">Profile</StyledText>
      <StyledText size="sm">
        View your achievements, stats, and quest history
      </StyledText>
      <StyledButton variant="secondary">Edit Profile</StyledButton>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
        <Link href="/(shell)/home" asChild>
          <StyledButton variant="secondary" size="sm">
            Home
          </StyledButton>
        </Link>
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
      </View>
    </BottomPanel>
  );
}
