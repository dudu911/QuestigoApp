import { queryWithSchema } from "./queryWithSchema";
import { UserCreditsSchema, PurchaseSchema } from "@repo/types";
import {
  mapCreditsRowToUI,
  mapPurchaseRowToUI,
  UserCreditsUI,
  PurchaseUI,
} from "../mappers";
import { supabase } from "./supabaseClient";

// Fetch user credits balance
export async function fetchUserCredits(
  userId: string,
): Promise<UserCreditsUI[]> {
  const credits = await queryWithSchema(
    "user_credits",
    UserCreditsSchema,
    (q) => q.eq("user_id", userId),
  );
  return credits.map((c) =>
    mapCreditsRowToUI({
      ...c,
      balance: c.balance !== undefined ? c.balance : 0,
    }),
  );
}

// Fetch purchase history
export async function fetchPurchases(userId: string): Promise<PurchaseUI[]> {
  const purchases = await queryWithSchema("purchases", PurchaseSchema, (q) =>
    q.eq("user_id", userId).order("created_at", { ascending: false }),
  );
  return purchases.map((p) =>
    mapPurchaseRowToUI({
      ...p,
      currency: p.currency !== undefined ? p.currency : "USD",
    }),
  );
}

// Stub for purchase (edge function later)
export async function purchaseCredits(userId: string, packageId: string) {
  const { data, error } = await supabase.functions.invoke("purchase-credits", {
    body: { userId, packageId },
  });
  if (error) throw error;
  return data;
}
