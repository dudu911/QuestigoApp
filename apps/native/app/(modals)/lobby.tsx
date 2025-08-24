import { Stack } from "expo-router";
import { StyledText, StyledButton } from "@repo/ui";
import { View } from "react-native";

export default function LobbyModal() {
  // ysage examps for realtime lobby subscription
  //   import { useAppDispatch } from "../redux/hooks"
  // import { setLobby, resetLobby } from "../redux/lobbySlice"

  // const dispatch = useAppDispatch()

  // // Join a lobby
  // dispatch(setLobby({ id: "your-lobby-id", code: "DEMO1234", ... }))

  // // Later leave lobby
  // dispatch(resetLobby())

  return (
    <>
      <Stack.Screen
        options={{ presentation: "modal", headerTitle: "Team Lobby" }}
      />
      <View style={{ padding: 20, gap: 16 }}>
        <StyledText size="lg">Team Lobby</StyledText>
        <StyledText size="sm">
          Wait for your team members to join before starting the quest
        </StyledText>
        <StyledButton variant="primary">Start Quest</StyledButton>
        <StyledButton variant="secondary">Leave Lobby</StyledButton>
      </View>
    </>
  );
}
