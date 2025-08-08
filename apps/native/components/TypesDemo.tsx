import React, { useState } from "react";
import { StyledView, StyledText, StyledButton, theme } from "@repo/ui";
import {
  UserSchema,
  CreateUserSchema,
  type User,
  type CreateUser,
  z,
} from "@repo/types";

export function TypesDemo() {
  const [validationResult, setValidationResult] = useState<string>("");

  // Demo user data
  const validUserData: CreateUser = {
    email: "john.doe@example.com",
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
  };

  const invalidUserData = {
    email: "invalid-email",
    username: "jo", // too short
    firstName: "", // required but empty
    lastName: "Doe",
  };

  const validateUser = (data: unknown, isValid: boolean) => {
    try {
      const result = CreateUserSchema.parse(data);
      setValidationResult(`✅ Valid: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join("\n");
        setValidationResult(`❌ Invalid:\n${errorMessages}`);
      } else {
        setValidationResult(`❌ Unexpected error: ${error}`);
      }
    }
  };

  return (
    <StyledView padding="lg" backgroundColor={theme.colors.gray[50]}>
      <StyledText size="xl" fontWeight="bold" marginBottom="md">
        Shared Types Demo with Zod
      </StyledText>

      <StyledText marginBottom="sm" color={theme.colors.gray[700]}>
        Test validation with shared schemas:
      </StyledText>

      <StyledView style={{ marginBottom: theme.spacing.lg }}>
        <StyledButton
          variant="primary"
          onPress={() => validateUser(validUserData, true)}
          style={{ marginBottom: theme.spacing.sm }}
        >
          Validate Good Data
        </StyledButton>

        <StyledButton
          variant="secondary"
          onPress={() => validateUser(invalidUserData, false)}
        >
          Validate Bad Data
        </StyledButton>
      </StyledView>

      {validationResult ? (
        <StyledView
          backgroundColor={theme.colors.white}
          padding="md"
          style={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.gray[300],
          }}
        >
          <StyledText
            size="sm"
            style={{ fontFamily: "monospace" }}
            color={theme.colors.gray[800]}
          >
            {validationResult}
          </StyledText>
        </StyledView>
      ) : null}
    </StyledView>
  );
}
