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
- **TypeScript**: Full type safety with path mapping
- **Bundler**: Metro with monorepo support

## Project Structure

```
apps/native/
├── app/                    # expo-router routes
│   ├── _layout.tsx        # Root layout with navigation
│   └── index.tsx          # Home screen
├── components/            # App-specific components
├── babel.config.js        # Babel configuration
├── metro.config.js        # Metro bundler config
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
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
  <StyledButton onPress={handlePress}>
    Universal Button
  </StyledButton>
</StyledView>
```

## Navigation

Uses expo-router for file-based navigation:

```tsx
// Navigate programmatically
import { router } from "expo-router";
router.push("/profile");

// Link components
import { Link } from "expo-router";
<Link href="/about">About</Link>
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
