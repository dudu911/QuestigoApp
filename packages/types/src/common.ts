import { z } from "zod";

// Common validation schemas
export const IdSchema = z.string().uuid();
export const EmailSchema = z.string().email();
export const UrlSchema = z.string().url();
export const DateStringSchema = z.string().datetime();

// Form validation helpers
export const RequiredStringSchema = z.string().min(1, "This field is required");
export const OptionalStringSchema = z.string().optional();

// Environment types
export const NodeEnvSchema = z.enum(["development", "production", "test"]);

// Status types
export const StatusSchema = z.enum([
  "active",
  "inactive",
  "pending",
  "archived",
]);

// Common inferred types
export type Id = z.infer<typeof IdSchema>;
export type Email = z.infer<typeof EmailSchema>;
export type Url = z.infer<typeof UrlSchema>;
export type DateString = z.infer<typeof DateStringSchema>;
export type NodeEnv = z.infer<typeof NodeEnvSchema>;
export type Status = z.infer<typeof StatusSchema>;

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Error types
export const ValidationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string(),
});

export type ValidationError = z.infer<typeof ValidationErrorSchema>;
