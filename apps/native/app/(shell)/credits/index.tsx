import React from "react";
import { FlatList } from "react-native";
import { useAppSelector } from "../../../src/redux/hooks";
import { StyledView, StyledText } from "@repo/ui";

export default function CreditsScreen() {
  const balance = useAppSelector((state) => state.credits.balance);
  const purchases = useAppSelector((state) => state.credits.purchases);

  return (
    <StyledView flex={1} padding="lg">
      <StyledText size="xl" fontWeight="bold" marginBottom="lg">
        💰 Credits
      </StyledText>

      {/* Balance */}
      <StyledView
        backgroundColor="white"
        padding="md"
        style={{
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#ddd",
          marginBottom: 20,
        }}
      >
        <StyledText size="lg">Current Balance:</StyledText>
        <StyledText size="2xl" fontWeight="bold" color="green">
          {balance} credits
        </StyledText>
      </StyledView>

      {/* Purchases */}
      <StyledText size="lg" marginBottom="sm">
        Purchase History
      </StyledText>
      {purchases.length === 0 ? (
        <StyledText color="gray">No purchases yet</StyledText>
      ) : (
        <FlatList
          data={purchases}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <StyledView
              backgroundColor="white"
              padding="md"
              style={{
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#eee",
                marginBottom: 12,
              }}
            >
              <StyledText size="lg" fontWeight="medium">
                {item.package_id} – {item.credits} credits
              </StyledText>
              <StyledText size="sm" color="gray">
                {item.amount} {item.currency} •{" "}
                {item.created_at.toLocaleString()}
              </StyledText>
            </StyledView>
          )}
        />
      )}
    </StyledView>
  );
}
