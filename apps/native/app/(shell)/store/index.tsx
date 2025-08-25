import { StyledText, StyledButton } from "@repo/ui";
import { View } from "react-native";
import { BottomPanel } from "../../../src/components/BottomPanel";
import { Link } from "expo-router";

export default function Store() {
  return (
    <BottomPanel>
      <StyledText size="xl">Store</StyledText>
      <StyledText size="sm">
        Purchase hints, power-ups, and exclusive quest content
      </StyledText>
      <StyledButton variant="primary">Browse Items</StyledButton>

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
        <Link href="/(shell)/profile" asChild>
          <StyledButton variant="secondary" size="sm">
            Profile
          </StyledButton>
        </Link>
      </View>
    </BottomPanel>
  );
}
