# @repo/config

Typed environment configuration for the Questigo monorepo.

## Features

- **Type-Safe Environment Variables**: Full TypeScript support for env vars
- **Runtime Validation**: Helper to validate required environment variables
- **Expo Integration**: Uses `EXPO_PUBLIC_*` pattern for client-side access
- **Development Helpers**: Environment detection utilities

## Installation

This package is automatically available in the monorepo workspace. Import from `@repo/config`:

```typescript
import { env, validateEnv, isDev } from "@repo/config";
```

## Usage

### Environment Variables

```typescript
import { env } from "@repo/config";

// Type-safe access to environment variables
const apiUrl = env.API_URL; // string
const mapsKey = env.MAPS_KEY; // string

// Use in API calls
fetch(`${env.API_URL}/api/quests`);
```

### Validation

```typescript
import { validateEnv } from "@repo/config";

// Validate all required env vars are present
try {
  const config = validateEnv();
  console.log("✅ Environment configuration valid");
} catch (error) {
  console.error("❌ Missing environment variables:", error.message);
}
```

### Development Helpers

```typescript
import { isDev, isProd, isTest } from "@repo/config";

if (isDev) {
  console.log("Running in development mode");
}

if (isProd) {
  // Production-only code
}
```

## Environment Variables

The following environment variables are supported:

### Required

- **`EXPO_PUBLIC_API_URL`** - Backend API base URL
- **`EXPO_PUBLIC_MAPS_KEY`** - Google Maps API key

### Setup

Create a `.env` file in your app root:

```bash
# .env (apps/native/.env)
EXPO_PUBLIC_API_URL=https://api.questigo.com
EXPO_PUBLIC_MAPS_KEY=your_google_maps_api_key_here
```

### Expo Public Variables

Variables prefixed with `EXPO_PUBLIC_` are:

- ✅ Available in client-side code
- ✅ Bundled with the app
- ✅ Accessible at runtime
- ⚠️ Visible to end users (don't put secrets here)

## Type Safety

The config exports a const assertion for full type safety:

```typescript
// env is typed as:
// {
//   readonly API_URL: string;
//   readonly MAPS_KEY: string;
// }
```

## Best Practices

1. **Use validation**: Call `validateEnv()` at app startup
2. **Development defaults**: Set reasonable defaults for development
3. **No secrets**: Only use `EXPO_PUBLIC_*` for client-safe values
4. **Environment detection**: Use `isDev`/`isProd` for conditional logic

## Integration

Add to your app's package.json:

```json
{
  "dependencies": {
    "@repo/config": "workspace:*"
  }
}
```

Then import and use:

```typescript
import { env, validateEnv } from "@repo/config";

// Validate on app startup
validateEnv();

// Use throughout your app
const response = await fetch(`${env.API_URL}/api/data`);
```
