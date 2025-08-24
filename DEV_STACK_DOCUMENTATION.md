# Questigo - Development Stack Documentation

## Project Overview

Questigo is a React Native/Web monorepo built with modern tooling and a custom universal styling system. This project prioritizes reliability, maintainability, and universal compatibility across web and native platforms.

---

## 🏗️ Architecture & Monorepo

### Core Infrastructure

- **Turborepo 2.5.5** - Build system orchestration and workspace management
- **pnpm 10.12.4** - Fast, efficient package manager with workspace support
- **TypeScript 5.8.3** - Full type safety across all packages and applications

### Workspace Structure

```
questigo/
├── apps/
│   ├── native/
│   │   ├── app/
│   │   │   ├── _layout.tsx              # Root layout (ThemeProvider, Redux Provider, Supabase Client, i18n)
│   │   │   ├── index.tsx                # Redirect to /home or /intro if first-time
│   │   │   ├── intro/                   # Intro/Tutorial flow
│   │   │   │   └── index.tsx
│   │   │   ├── auth/                    # Auth routes
│   │   │   │   ├── login.tsx
│   │   │   │   ├── register.tsx
│   │   │   │   └── reset-password.tsx
│   │   │   ├── home/                    # Quest discovery
│   │   │   │   └── index.tsx
│   │   │   ├── quest/                   # Quest detail + gameplay
│   │   │   │   ├── [id].tsx             # QuestDetails screen
│   │   │   │   ├── [id]/gameplay.tsx    # Gameplay screen (Map + Riddle)
│   │   │   │   └── [id]/complete.tsx    # Completion screen
│   │   │   ├── lobby/                   # Multiplayer lobby modal
│   │   │   │   └── [code].tsx
│   │   │   ├── store/                   # Credit store
│   │   │   │   └── index.tsx
│   │   │   ├── profile/                 # Profile & settings
│   │   │   │   └── index.tsx
│   │   │   └── _layout.tab.tsx          # Bottom tab navigator (Home, Map, Store, Profile)
│   │   ├── src/
│   │   │   ├── components/              # Local/native components
│   │   │   │   ├── MapCanvas.tsx        # Cross-platform map
│   │   │   │   └── QuestMap.tsx         # Wraps MapCanvas with quest logic
│   │   │   ├── redux/                   # Redux slices
│   │   │   │   ├── store.ts             # Root store
│   │   │   │   ├── authSlice.ts         # Auth state (JWT, profile)
│   │   │   │   ├── questSlice.ts        # Active quest, riddles, hints
│   │   │   │   ├── lobbySlice.ts        # Multiplayer lobby state
│   │   │   │   └── creditsSlice.ts      # Credit balance & purchases
│   │   │   ├── services/                # Supabase + API services
│   │   │   │   ├── supabaseClient.ts    # Supabase client init
│   │   │   │   ├── authService.ts       # Login, logout, social OAuth
│   │   │   │   ├── questService.ts      # Fetch quests, riddles
│   │   │   │   ├── lobbyService.ts      # Real-time lobby join/sync
│   │   │   │   └── paymentService.ts    # Stripe/PSP checkout
│   │   │   └── utils/                   # Helpers
│   │   │       ├── i18n.ts              # i18n setup (EN/HE, RTL)
│   │   │       └── geo.ts               # GPS radius check
│   │   └── app.json
│   ├── web/                             # Optional web app (can use same routes)
│   │   └── ...
├── packages/
│   ├── ui/                              # Shared UI library
│   │   ├── components/
│   │   │   ├── IntroCarousel.tsx
│   │   │   ├── QuestCard.tsx
│   │   │   ├── RiddlePanel.tsx
│   │   │   ├── HintButton.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── CreditPackCard.tsx
│   │   │   └── PlayerAvatar.tsx
│   │   └── index.ts                     # Export barrel
│   ├── config/
│   │   ├── index.ts                     # Env + constants
│   │   └── supabase.ts                  # Supabase URL/key loading from env
│   └── types/
│       ├── quest.ts                     # Quest, riddle, hint types
│       ├── lobby.ts                     # Lobby/player types
│       ├── auth.ts                      # Auth/user types
│       └── index.ts
├── .env                                 # EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, ...
└── turbo.json, pnpm-workspace.yaml, etc.
```

---

## 🚀 React Native & Cross-Platform

### Core Framework

- **Expo SDK 52.0.47** - Latest Expo development platform
- **React Native 0.76.9** - Latest React Native with React 18.3.1
- **expo-router 4.0.21** - File-based navigation system
- **react-native-web 0.19.13** - Web compatibility layer
- **react-native-reanimated 3.16.7** - Advanced animation library

### Platform Support

- **Native**: iOS and Android via Expo
- **Web**: Browser support via react-native-web
- **Development**: Hot reload on both platforms

### Key Dependencies

- **expo-status-bar 2.0.1** - Status bar management
- **react-native-safe-area-context 4.12.0** - Safe area handling
- **react-native-screens 4.4.0** - Native screen management
- **inline-style-prefixer 6.0.4** - CSS prefixing for web compatibility

---

## 🎨 Universal Styling System

### Custom Implementation

Instead of using complex styling libraries like NativeWind or Tamagui (which had compatibility issues), we implemented a custom universal styling system that provides:

- **Type-safe design tokens**
- **Universal components** that work identically on web and native
- **Consistent theming** across platforms
- **No babel plugin conflicts**

### Theme Configuration (`packages/ui/src/theme.ts`)

```typescript
export const theme = {
  colors: {
    navy: "#0B2843", // Primary brand color
    orange: "#F49C00", // Accent color
    white: "#FFFFFF",
    black: "#000000",
    gray: {
      // Complete gray scale
      50: "#F9FAFB",
      100: "#F3F4F6",
      // ... full scale to 900
    },
  },
  spacing: {
    xs: 4, // 4px
    sm: 8, // 8px
    md: 16, // 16px
    lg: 24, // 24px
    xl: 32, // 32px
    "2xl": 48, // 48px
  },
  typography: {
    xs: 12, // 12px
    sm: 14, // 14px
    base: 16, // 16px
    lg: 18, // 18px
    xl: 20, // 20px
    "2xl": 24, // 24px
    "3xl": 30, // 30px
    "4xl": 36, // 36px
    "5xl": 48, // 48px
  },
};
```

### Universal Components (`packages/ui/src/styled-components.tsx`)

#### StyledView

```typescript
<StyledView
  flex={1}
  backgroundColor={theme.colors.white}
  alignItems="center"
  justifyContent="center"
  padding="lg"  // Uses theme.spacing.lg (24px)
>
```

#### StyledText

```typescript
<StyledText
  size="4xl"              // Uses theme.typography["4xl"] (36px)
  color={theme.colors.orange}
  marginBottom="sm"       // Uses theme.spacing.sm (8px)
  fontWeight="bold"
>
  Heading Text
</StyledText>
```

#### StyledButton

```typescript
<StyledButton
  variant="primary"       // Orange background
  size="md"              // Medium padding
  onPress={handlePress}
>
  Button Text
</StyledButton>
```

---

## 🔧 Development Tools & Configuration

### Build Tools

- **Metro Bundler** - Clean configuration optimized for monorepo
- **Babel** - Minimal setup (expo preset + reanimated plugin only)
- **ESLint** - Code quality enforcement
- **Prettier** - Consistent code formatting

### Development Environment

- **VS Code** - Primary IDE with proper workspace support
- **Node.js 18+** - Runtime requirement
- **Development Servers**:
  - Native: `localhost:8083` (Expo Metro bundler)
  - Web: `localhost:3000` (Next.js)

### Scripts

```json
{
  "dev": "turbo run dev",
  "dev:web": "pnpm --filter web dev",
  "dev:native": "pnpm --filter native dev",
  "dev:mobile": "pnpm --filter native dev",
  "build": "turbo run build",
  "clean": "turbo run clean && rm -rf node_modules"
}
```

---

## 📦 Package Management

### Workspace Configuration

- **pnpm workspaces** for efficient dependency management
- **Shared dependencies** hoisted to root when possible
- **Local packages** linked via `workspace:*` protocol

### Key Package Relationships

```
@repo/ui (packages/ui)
├── Used by: apps/native, apps/web
├── Exports: StyledView, StyledText, StyledButton, theme
└── Dependencies: react-native (for universal components)
```

---

## 🚫 What We Avoided & Why

### NativeWind

- **Issue**: Babel plugin conflicts with Expo SDK 52
- **Alternative**: Custom styled components with theme tokens

### Tamagui

- **Issue**: Requires React Native 0.79.2, we're on 0.76.9
- **Alternative**: Custom universal components with similar API

### Tailwind CSS

- **Issue**: Not needed after removing NativeWind
- **Alternative**: Theme-based design tokens

### Complex CSS-in-JS

- **Issue**: Compatibility and performance concerns
- **Alternative**: Simple, reliable React Native StyleSheet approach

---

## ✅ Current Status & Achievements

### Completed Phases

- **✅ Part 1**: Turborepo + Expo monorepo foundation
- **✅ Part 2**: Universal styling system with custom components

### Working Features

- **✅ Hot reload** on both web and native platforms
- **✅ Universal components** with consistent styling
- **✅ Type-safe theming** with design tokens
- **✅ Clean Metro configuration** without plugin conflicts
- **✅ Workspace dependencies** properly resolved
- **✅ Development servers** stable and performant

### Performance Metrics

- **Bundle sizes**: Optimized for both platforms
- **Build times**: Fast with Turborepo caching
- **Development experience**: Smooth hot reload and debugging

---

## 🎯 Next Steps (Part 3+)

### Potential Areas for Part 3

1. **Data Layer**: TanStack Query v5 + Supabase integration
2. **Advanced Navigation**: expo-router advanced features and layouts
3. **State Management**: Global state with Context API or Zustand
4. **Authentication**: Supabase Auth implementation
5. **Native Features**: Camera, notifications, file system access

### Architecture Principles Moving Forward

- **Reliability over bleeding-edge**: Choose stable, proven solutions
- **Universal compatibility**: Ensure features work on both platforms
- **Type safety**: Maintain full TypeScript coverage
- **Developer experience**: Prioritize fast, smooth development workflow

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Clone and install
git clone <repository>
cd questigo
pnpm install

# Start development servers
pnpm dev:mobile  # Native app on localhost:8083
pnpm dev:web     # Web app on localhost:3000
```

### Project Health

- **Dependencies**: All compatible and up-to-date
- **Build system**: Stable and performant
- **Type safety**: 100% TypeScript coverage
- **Testing**: Ready for test implementation
- **Production**: Architecture ready for deployment

---

Prrisma Schema
model Riddle {
id String @id @default(uuid())
questId String
title String
prompt String
image String? // optional image URL
answer String
hint String?
latitude Float
longitude Float
radiusM Int @map("radius_m") @default(30) // maps to SQL column radius_m
orderIndex Int @map("order_index")
createdAt DateTime @default(now())

quest Quest @relation(fields: [questId], references: [id], onDelete: Cascade)
}

_Last updated: August 24, 2025_
_Project Status: Part 2 Complete ✅_
