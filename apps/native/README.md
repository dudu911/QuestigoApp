# Questigo Native App

React Native mobile application built with Expo SDK 52 and expo-router for file-based navigation.

## Development Commands

### Start Development Server

```bash
# From workspace root
pnpm dev:native

# Or from this directory
cd apps/native
pnpm dev
```

### Platform-Specific Development

```bash
# iOS Simulator
pnpm ios

# Android Emulator
pnpm android

# Web Development
pnpm web
```

### Production Builds

```bash
# Build for iOS
pnpm build:ios

# Build for Android
pnpm build:android

# Build for web
pnpm build:web
```

## Tech Stack

- **Framework**: Expo SDK 52 (React Native 0.76.9)
- **Navigation**: expo-router 4.0.21 (file-based routing)
- **Animations**: react-native-reanimated 3.16.7
- **Styling**: Universal styled components (@repo/ui)
- **State Management**: Zustand 5.0.7 (lightweight state store)
- **Data Fetching**: @tanstack/react-query 5.84.2
- **Internationalization**: i18next 25.3.2 + react-i18next 15.6.1
- **Localization**: expo-localization 16.1.6
- **Safe Areas**: react-native-safe-area-context 4.12.0
- **Types**: Shared types with Zod validation (@repo/types)
- **Config**: Typed environment variables (@repo/config)
- **TypeScript**: Full type safety with path mapping
- **Bundler**: Metro with monorepo support

## Project Structure

```
apps/native/
├── app/                         # expo-router routes
│   ├── _layout.tsx             # Root layout with navigation
│   ├── index.tsx               # Landing/welcome screen
│   ├── (shell)/                # Persistent Map Shell Group
│   │   ├── _layout.tsx         # Shell layout with persistent map
│   │   ├── home.tsx            # Home tab screen
│   │   ├── map.tsx             # Map tab screen
│   │   ├── store.tsx           # Store tab screen
│   │   └── profile.tsx         # Profile tab screen
│   └── (modals)/               # Modal Screen Group
│       ├── hint.tsx            # Hint modal
│       └── lobby.tsx           # Team lobby modal
├── src/
│   ├── components/             # App-specific components
│   │   ├── MapCanvas.tsx       # Persistent map component
│   │   └── BottomPanel.tsx     # Bottom overlay panel
│   ├── state/                  # State management
│   └── i18n/                   # Internationalization
├── babel.config.js             # Babel configuration
├── metro.config.js             # Metro bundler config
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Universal Styling

This app uses a custom universal styling system that works across web and native:

```tsx
import { StyledView, StyledText, StyledButton } from "@repo/ui";

// Universal components with theme support
<StyledView style={{ bg: "primary", p: 4 }}>
  <StyledText variant="h1" color="white">
    Universal Text
  </StyledText>
  <StyledButton onPress={handlePress}>Universal Button</StyledButton>
</StyledView>;
```

## Persistent Map

### MapCanvas Component

The persistent map uses `expo-maps` with platform-specific implementations:

```tsx
import { GoogleMaps, AppleMaps } from "expo-maps";

// Automatically selects appropriate map for platform
const MapView = Platform.OS === "ios" ? AppleMaps.View : GoogleMaps.View;

// Always renders behind shell content
<MapView style={StyleSheet.absoluteFill} />;
```

### Configuration

Map functionality requires `EXPO_PUBLIC_MAPS_KEY` environment variable:

```bash
# .env.local
EXPO_PUBLIC_MAPS_KEY=your_google_maps_api_key_here
```

### Bottom Panel Overlay

Shell screens use `BottomPanel` for content overlay:

```tsx
import { BottomPanel } from "@/src/components/BottomPanel";

export default function Screen() {
  return <BottomPanel>{/* Your screen content */}</BottomPanel>;
}
```

## App Providers

The app is wrapped with multiple providers in `app/_layout.tsx`:

```tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from "@repo/ui";

// App state management with Zustand
import { useAppStore } from "./src/state/useAppStore";

// Global state includes:
// - activeQuestId: Current quest being played
// - teamCode: Team join code
// - locale: App language (en/he)
// - isOnline: Network status
```

### State Management

```tsx
import { useAppStore, useAppActions } from "./src/state/useAppStore";

// Access state
const { activeQuestId, teamCode, locale } = useAppStore();

// Update state
const { setActiveQuestId, setTeamCode, setLocale } = useAppActions();
```

### Internationalization

```tsx
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
console.log(t("navigation.home")); // "Home" or "בית"

// Change language
import { changeLanguage } from "./src/i18n";
changeLanguage("he"); // Switch to Hebrew
```

## Navigation

### Router Shell Architecture

The app uses a persistent map shell where the map is always visible underneath screen content:

```tsx
// Persistent map shell - always renders map
import { router } from "expo-router";

// Navigate to shell screens (map stays visible)
router.push("/(shell)/home");
router.push("/(shell)/map");
router.push("/(shell)/store");
router.push("/(shell)/profile");

// Navigate to modals (overlay the shell)
router.push("/(modals)/hint");
router.push("/(modals)/lobby");
```

### Screen Groups

**Shell Group `(shell)/`**

- Renders over persistent MapCanvas background
- Uses BottomPanel for content overlay
- Maintains map state across navigation

**Modal Group `(modals)/`**

- Full-screen modal presentation
- Independent of shell/map layout
- Used for focused interactions

Uses expo-router for file-based navigation:

```tsx
// Navigate programmatically
import { router } from "expo-router";
router.push("/profile");

// Link components
import { Link } from "expo-router";
<Link href="/about">About</Link>;
```

## Monorepo Integration

- **Shared UI**: `@repo/ui` package for universal components
- **Shared Config**: `@repo/typescript-config` and `@repo/eslint-config`
- **Metro Configuration**: Optimized for pnpm symlinks and workspace resolution
- **TypeScript**: Path mapping for `@repo/*` packages

## Development Tips

1. **Metro Cache**: Clear Metro cache if you encounter module resolution issues:

   ```bash
   pnpm start --clear
   ```

2. **Shared Packages**: Changes to `@repo/ui` are hot-reloaded automatically

3. **Platform-Specific Code**: Use `.native.tsx` and `.web.tsx` extensions for platform-specific implementations

4. **Debugging**: Use Flipper or React Native Debugger for advanced debugging

## Environment Setup

Ensure you have the required development environment:

- **Node.js**: 18+ (required for Expo SDK 52)
- **Expo CLI**: `npm install -g @expo/cli`
- **iOS Development**: Xcode 15+ (macOS only)
- **Android Development**: Android Studio with SDK 34+

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `pnpm start --clear`
2. **Package resolution**: Ensure `pnpm install` is run from workspace root
3. **iOS builds**: Clean build folder in Xcode if builds fail
4. **Android builds**: Clean gradle cache with `cd android && ./gradlew clean`

### Performance

- Uses Hermes engine for better performance
- react-native-reanimated for 60fps animations
- Optimized Metro configuration for fast bundling
