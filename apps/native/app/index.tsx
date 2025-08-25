import { StatusBar } from "expo-status-bar";
import { StyledView, StyledText, StyledButton, useTheme } from "@repo/ui";
import { TypesDemo } from "../src/dev/TypesDemo";
import { ConfigDemo } from "../src/dev/ConfigDemo";
import { ProvidersDemo } from "../src/dev/ProvidersDemo";
import { Link } from "expo-router";
import { ScrollView } from "react-native";

export default function Native() {
  const { theme } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.white }}>
      <StyledView
        flex={1}
        backgroundColor={theme.colors.white}
        alignItems="center"
        justifyContent="center"
        padding="lg"
        style={{ minHeight: 600 }}
      >
        <StyledText size="4xl" fontWeight="bold" marginBottom="lg" style={{}}>
          Questigo
        </StyledText>
        <StyledText
          color={theme.colors.orange}
          marginBottom="sm"
          fontWeight="normal"
          style={{}}
        >
          Interactive Quest Adventure Game
        </StyledText>
        <StyledText
          color={theme.colors.navy}
          marginBottom="lg"
          fontWeight="normal"
          style={{}}
        >
          Explore, Solve, Discover
        </StyledText>
        <Link href="/(shell)/home" asChild>
          <StyledButton style={{ backgroundColor: "#F49C00" }}>
            <StyledText color="#FFFFFF" fontWeight="600">
              Enter Game World
            </StyledText>
          </StyledButton>
        </Link>
        <ProvidersDemo />
        <TypesDemo />
        <ConfigDemo />
        <StatusBar style="auto" />
      </StyledView>
    </ScrollView>
  );
}
