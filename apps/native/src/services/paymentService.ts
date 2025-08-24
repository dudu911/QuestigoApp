import { supabase } from "./supabaseClient";

// Example placeholder: payments will likely call a backend endpoint
export async function purchaseCredits(userId: string, packageId: string) {
  // hit your backend endpoint here for Stripe/Israeli PSP
  const { data, error } = await supabase.functions.invoke("purchase-credits", {
    body: { userId, packageId },
  });
  if (error) throw error;
  return data;
}
