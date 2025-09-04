// src/components/DevUserSwitcher.tsx
import React from "react";
import { StyledView, StyledText, StyledButton } from "@repo/ui";
import { useAppDispatch } from "@redux/hooks";
import { setUser } from "../redux/authSlice";
import { demoUsers } from "../utils/dummyUsers";

export function DevUserSwitcher() {
  const dispatch = useAppDispatch();

  return (
    <StyledView padding="md" backgroundColor="white">
      <StyledText size="lg" fontWeight="bold" marginBottom="sm">
        👤 Switch Demo User
      </StyledText>
      {demoUsers.map((u) => (
        <StyledButton
          key={u.id}
          variant="secondary"
          onPress={() => dispatch(setUser(u))}
          style={{ marginBottom: 8 }}
        >
          {u.username}
        </StyledButton>
      ))}
    </StyledView>
  );
}
