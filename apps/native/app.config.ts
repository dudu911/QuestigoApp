import type { ExpoConfig } from "@expo/config";

const config: ExpoConfig = {
  name: "Questigo",
  slug: "questigo",
  version: "1.0.0",
  scheme: "questigo",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: false, // Disable New Architecture temporarily
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  platforms: ["ios", "android", "web"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.dudu911.questigo",
    jsEngine: "jsc", // Disable Hermes temporarily
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
    },
  },
  android: {
    package: "com.dudu911.questigo",
    jsEngine: "jsc", // Disable Hermes temporarily
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
      },
    },
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    "expo-location",
    [
      "expo-build-properties",
      {
        android: {
          kotlinVersion: "2.0.21",
          proguardMinifyEnabled: false,
          enableProguardInReleaseBuilds: false,
          enableHermes: false,
          // Disable New Architecture
          newArchEnabled: false,
        },
        ios: {
          deploymentTarget: "15.1",
          enableHermes: false,
          // Disable New Architecture
          newArchEnabled: false,
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
