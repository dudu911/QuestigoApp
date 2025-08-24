import { queryWithSchema } from "./queryWithSchema";
import { PurchaseSchema, UserCreditsSchema } from "@repo/types";
import { supabase } from "./supabaseClient";

// Fetch current balance
export async function fetchUserCredits(userId: string) {
  return queryWithSchema("user_credits", UserCreditsSchema, (q) =>
    q.eq("user_id", userId),
  );
}

// Fetch purchase history
export async function fetchPurchases(userId: string) {
  return queryWithSchema("purchases", PurchaseSchema, (q) =>
    q.eq("user_id", userId),
  );
}

// Example placeholder for initiating a purchase flow
export async function purchaseCredits(userId: string, packageId: string) {
  // Likely calls a Supabase Edge Function or backend endpoint
  const { data, error } = await supabase.functions.invoke("purchase-credits", {
    body: { userId, packageId },
  });
  if (error) throw error;
  return data;
}
