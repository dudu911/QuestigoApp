import React, { useState } from "react";
import { StyledView, StyledText, StyledButton, theme } from "@repo/ui";
import { env, validateEnv, isDev, isProd } from "@repo/config";

export function ConfigDemo() {
  const [configStatus, setConfigStatus] = useState<string>("");

  const checkConfig = () => {
    try {
      const config = validateEnv();
      setConfigStatus(`✅ Configuration Valid:
API_URL: ${config.API_URL || "(not set)"}
MAPS_KEY: ${config.MAPS_KEY ? "***" + config.MAPS_KEY.slice(-4) : "(not set)"}
Environment: ${isDev ? "Development" : isProd ? "Production" : "Unknown"}`);
    } catch (error) {
      setConfigStatus(`❌ Configuration Error:
${error instanceof Error ? error.message : "Unknown error"}

Current values:
API_URL: ${env.API_URL || "(empty)"}
MAPS_KEY: ${env.MAPS_KEY || "(empty)"}`);
    }
  };

  const showEnvVars = () => {
    setConfigStatus(`🔧 Environment Variables:
API_URL: ${env.API_URL || "(not set)"}
MAPS_KEY: ${env.MAPS_KEY ? "***" + env.MAPS_KEY.slice(-4) : "(not set)"}
NODE_ENV: ${process.env.NODE_ENV || "(not set)"}

Environment Flags:
isDev: ${isDev}
isProd: ${isProd}

Note: Set EXPO_PUBLIC_API_URL and EXPO_PUBLIC_MAPS_KEY in .env file`);
  };

  return (
    <StyledView padding="lg" backgroundColor={theme.colors.gray[50]}>
      <StyledText size="xl" fontWeight="bold" marginBottom="md">
        Config Demo with Typed Env
      </StyledText>

      <StyledText marginBottom="sm" color={theme.colors.gray[700]}>
        Test typed environment configuration:
      </StyledText>

      <StyledView style={{ marginBottom: theme.spacing.lg }}>
        <StyledButton
          variant="primary"
          onPress={checkConfig}
          style={{ marginBottom: theme.spacing.sm }}
        >
          Validate Config
        </StyledButton>

        <StyledButton variant="secondary" onPress={showEnvVars}>
          Show Environment
        </StyledButton>
      </StyledView>

      {configStatus ? (
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
            {configStatus}
          </StyledText>
        </StyledView>
      ) : null}

      <StyledView style={{ marginTop: theme.spacing.md }}>
        <StyledText size="sm" color={theme.colors.gray[600]}>
          💡 Tip: Create apps/native/.env with EXPO_PUBLIC_API_URL and
          EXPO_PUBLIC_MAPS_KEY
        </StyledText>
      </StyledView>
    </StyledView>
  );
}
