# @repo/types

Shared TypeScript types and Zod schemas for the Questigo monorepo.

## Features

- **Runtime Validation**: All types backed by Zod schemas for runtime type checking
- **Type Safety**: Full TypeScript support with inferred types
- **Shared Schemas**: Consistent validation across web and native apps
- **Tree Shakeable**: Import only what you need

## Installation

This package is automatically available in the monorepo workspace. Import from `@repo/types`:

```typescript
import { UserSchema, type User, z } from "@repo/types";
```

## Usage

### User Types

```typescript
import {
  UserSchema,
  CreateUserSchema,
  type User,
  type CreateUser,
} from "@repo/types";

// Validate data at runtime
const userData = UserSchema.parse(rawData);

// Type-safe user creation
const newUser: CreateUser = {
  email: "user@example.com",
  username: "johndoe",
  firstName: "John",
  lastName: "Doe",
};

// Validate before API calls
const validatedUser = CreateUserSchema.parse(newUser);
```

### API Response Types

```typescript
import {
  ApiResponseSchema,
  type ApiResponse,
  type ApiSuccess,
} from "@repo/types";

// Type-safe API responses
function handleApiResponse<T>(response: ApiResponse<T>) {
  if (response.success) {
    // TypeScript knows this is ApiSuccess<T>
    console.log(response.data);
  } else {
    // TypeScript knows this is ApiError
    console.error(response.error);
  }
}

// Validate API responses
const response = ApiResponseSchema.parse(apiData);
```

### Form Validation

```typescript
import { RequiredStringSchema, EmailSchema, z } from "@repo/types";

const LoginFormSchema = z.object({
  email: EmailSchema,
  password: RequiredStringSchema.min(8),
});

type LoginForm = z.infer<typeof LoginFormSchema>;

// Use in React Hook Form, Formik, etc.
const validateLogin = (data: unknown) => {
  return LoginFormSchema.safeParse(data);
};
```

### Common Validation

```typescript
import { IdSchema, EmailSchema, StatusSchema } from "@repo/types";

// Validate individual fields
const isValidId = IdSchema.safeParse(userId).success;
const isValidEmail = EmailSchema.safeParse(email).success;
const isValidStatus = StatusSchema.safeParse(status).success;
```

## Available Types

### User Types

- `User` - Complete user object
- `CreateUser` - User creation payload
- `UpdateUser` - User update payload (all fields optional)

### API Types

- `ApiResponse<T>` - Generic API response wrapper
- `ApiSuccess<T>` - Successful API response
- `ApiError` - Error API response
- `PaginatedResponse<T>` - Paginated API response
- `Pagination` - Pagination metadata

### Common Types

- `Id` - UUID string
- `Email` - Email string
- `Url` - URL string
- `DateString` - ISO date string
- `NodeEnv` - Node environment
- `Status` - Generic status enum
- `ValidationError` - Field validation error

## Schemas

All types have corresponding Zod schemas for runtime validation:

- `UserSchema`, `CreateUserSchema`, `UpdateUserSchema`
- `ApiResponseSchema`, `ApiSuccessSchema`, `ApiErrorSchema`
- `PaginationSchema`, `PaginatedResponseSchema`
- `IdSchema`, `EmailSchema`, `UrlSchema`, `DateStringSchema`
- `RequiredStringSchema`, `OptionalStringSchema`
- `NodeEnvSchema`, `StatusSchema`, `ValidationErrorSchema`

## Development

```bash
# Type checking
pnpm type-check

# Build for production
pnpm build

# Watch mode
pnpm dev
```
