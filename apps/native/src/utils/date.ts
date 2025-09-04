// src/utils/date.ts
export function safeDate(value: unknown): Date {
  if (!value) return new Date(); // fallback
  const d = new Date(value as string);
  return isNaN(d.getTime()) ? new Date() : d;
}
