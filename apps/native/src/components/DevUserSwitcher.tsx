// src/components/DevUserSwitcher.tsx
import React from "react";
import { StyledView, StyledText, StyledButton } from "@repo/ui";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { setUser } from "../redux/authSlice";
import { demoUsers } from "../utils/dummyUsers";
import { RootState } from "../redux/store";

export function DevUserSwitcher() {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((s: RootState) => s.auth.user?.id);

  return (
    <StyledView padding="md" backgroundColor="white">
      <StyledText size="lg" fontWeight="bold" marginBottom="sm">
        👤 Switch Demo User
      </StyledText>
      {demoUsers.map((u) => {
        const isActive = u.id === currentUserId;
        return (
          <StyledButton
            key={u.id}
            variant={isActive ? "primary" : "secondary"}
            onPress={() => dispatch(setUser(u))}
            style={{
              marginBottom: 8,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 6, // 👈 if your StyledButton supports style props like this
            }}
          >
            <StyledText>{u.username}</StyledText>
            {isActive && <StyledText>✅</StyledText>}
          </StyledButton>
        );
      })}
    </StyledView>
  );
}
