import { z } from "zod";

export const UserCreditsSchema = z.object({
  user_id: z.string().uuid(),
  balance: z.number().default(0),
  updated_at: z.coerce.date(), // ✅ coercion
});

export type UserCredits = z.infer<typeof UserCreditsSchema>;

export const PurchaseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  package_id: z.string(),
  credits: z.number(),
  amount: z.number(),
  currency: z.string().default("USD"),
  created_at: z.coerce.date(), // ✅ coercion
});

export type Purchase = z.infer<typeof PurchaseSchema>;
