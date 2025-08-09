// packages/config/src/index.ts
export const env = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? "",
  MAPS_KEY: process.env.EXPO_PUBLIC_MAPS_KEY ?? "",
} as const;

// Type-safe environment configuration
export type Env = typeof env;

// Helper to validate required environment variables
export const validateEnv = () => {
  const missing: string[] = [];

  if (!env.API_URL) missing.push("EXPO_PUBLIC_API_URL");
  if (!env.MAPS_KEY) missing.push("EXPO_PUBLIC_MAPS_KEY");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  return env;
};

// Development helpers
export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";
