import React, { useState } from "react";
import { StyledView, StyledText, StyledButton } from "@repo/ui";
import { TextInput, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { getLobbyByCode, joinLobby } from "../../../src/services/lobbyService";
import { useAppSelector } from "@redux/hooks";
import { RootState } from "../../../src/redux/store";

export default function JoinLobbyModal() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const userId = useAppSelector((s: RootState) => s.auth.user?.id);

  const handleJoin = async () => {
    if (!code.trim()) {
      setError("Please enter a lobby code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const normalizedCode = code.trim().toUpperCase();
      const lobby = await getLobbyByCode(normalizedCode);
      if (!lobby) throw new Error("Lobby not found");

      if (!userId) throw new Error("Not logged in");
      console.log("trying to joing lobby");
      await joinLobby(lobby.id, userId);
      router.replace(`/lobby/${lobby.id}`);
    } catch (err: any) {
      setError(err.message ?? "Failed to join lobby");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledView flex padding="lg" backgroundColor="white">
      <StyledText size="xl" fontWeight="bold" marginBottom="md">
        🔑 Join Lobby
      </StyledText>

      <TextInput
        value={code}
        onChangeText={(txt) => setCode(txt.toUpperCase())}
        placeholder="Enter code"
        autoCapitalize="characters"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 16,
          borderRadius: 8,
        }}
      />

      {error && (
        <StyledText color="red" marginBottom="sm">
          {error}
        </StyledText>
      )}

      <StyledButton
        variant="secondary"
        onPress={handleJoin}
        disabled={loading}
        style={{ marginBottom: 12 }}
      >
        {loading ? <ActivityIndicator color="#fff" /> : "Join"}
      </StyledButton>

      <StyledButton variant="secondary" onPress={() => router.back()}>
        Cancel
      </StyledButton>
    </StyledView>
  );
}
