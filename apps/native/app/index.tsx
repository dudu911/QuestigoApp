import { StatusBar } from "expo-status-bar";
import { StyledView, StyledText, StyledButton, theme } from "@repo/ui";
import { TypesDemo } from "../components/TypesDemo";

export default function Native() {
  return (
    <StyledView
      flex={1}
      backgroundColor={theme.colors.white}
      alignItems="center"
      justifyContent="center"
      padding="lg"
      style={{}}
    >
      <StyledText size="4xl" fontWeight="bold" marginBottom="lg" style={{}}>
        Native
      </StyledText>
      <StyledText
        color={theme.colors.orange}
        marginBottom="sm"
        fontWeight="normal"
        style={{}}
      >
        Hi (Orange via Universal Theme)
      </StyledText>
      <StyledText
        color={theme.colors.navy}
        marginBottom="lg"
        fontWeight="normal"
        style={{}}
      >
        Hi (Navy via Universal Theme)
      </StyledText>
      <StyledButton
        variant="primary"
        size="md"
        onPress={() => {
          console.log("Pressed!");
          alert("Pressed!");
        }}
      >
        Boop
      </StyledButton>

      <TypesDemo />

      <StatusBar style="auto" />
    </StyledView>
  );
}
