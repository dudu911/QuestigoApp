import { z } from "zod";

// API Response types
export const ApiSuccessSchema = z.object({
  success: z.literal(true),
  data: z.unknown(),
  message: z.string().optional(),
});

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.unknown().optional(),
});

export const ApiResponseSchema = z.union([ApiSuccessSchema, ApiErrorSchema]);

export type ApiSuccess<T = unknown> = Omit<
  z.infer<typeof ApiSuccessSchema>,
  "data"
> & {
  data: T;
};

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// Pagination types
export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const PaginatedResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(z.unknown()),
  pagination: PaginationSchema,
});

export type Pagination = z.infer<typeof PaginationSchema>;
export type PaginatedResponse<T = unknown> = Omit<
  z.infer<typeof PaginatedResponseSchema>,
  "data"
> & {
  data: T[];
};
