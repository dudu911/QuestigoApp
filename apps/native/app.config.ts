import type { ExpoConfig } from "@expo/config";

const config: ExpoConfig = {
  name: "Questigo",
  slug: "questigo",
  version: "1.0.0",
  scheme: "com.turbo.example",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.dudu911.questigo",
    config: {
      googleMapsApiKey:
        process.env.GOOGLE_MAPS_API_KEY || process.env.EXPO_PUBLIC_MAPS_KEY,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    package: "com.dudu911.questigo",
    config: {
      googleMaps: {
        apiKey:
          process.env.GOOGLE_MAPS_API_KEY || process.env.EXPO_PUBLIC_MAPS_KEY,
      },
    },
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    [
      "expo-build-properties",
      {
        android: {
          // Use Kotlin 1.9.25 to match what expo-modules-core expects
          // and disable Compose compiler version compatibility check
          kotlinVersion: "1.9.25",
          proguardMinifyEnabled: false,
          enableProguardInReleaseBuilds: false,
        },
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "7efab992-b4fe-487c-bc53-caec78fcfbad",
    },
  },
};

export default config;
