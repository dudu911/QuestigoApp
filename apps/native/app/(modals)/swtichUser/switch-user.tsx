// app/(modals)/switch-user.tsx
import React from "react";
import { StyledView, StyledText, StyledButton } from "@repo/ui";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { setUser } from "@redux/authSlice";
import { demoUsers } from "../../../src/utils/dummyUsers";
import { router } from "expo-router";

export default function SwitchUserModal() {
  const dispatch = useAppDispatch();
  const activeUserId = useAppSelector((s) => s.auth.user?.id);

  return (
    <StyledView flex={1} padding="lg" backgroundColor="white">
      <StyledText size="xl" fontWeight="bold" marginBottom="md">
        👤 Switch User
      </StyledText>

      {demoUsers.map((u) => {
        const isActive = u.id === activeUserId;
        return (
          <StyledButton
            key={u.id}
            variant={isActive ? "primary" : "secondary"}
            onPress={() => {
              dispatch(setUser(u));
              router.back();
            }}
            style={{ marginBottom: 12 }}
          >
            <StyledText>
              {u.username} {isActive ? "✅" : ""}
            </StyledText>
          </StyledButton>
        );
      })}

      <StyledButton
        variant="secondary"
        onPress={() => router.back()}
        style={{ marginTop: 24 }}
      >
        Close
      </StyledButton>
    </StyledView>
  );
}
