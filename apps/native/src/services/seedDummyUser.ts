// src/services/seedDummyUser.ts
import { supabase } from "./supabaseClient";
import { dummyUser } from "../../src/utils/dummyUser";

export async function seedDummyUser() {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: dummyUser.id,
      username: dummyUser.username,
      avatar_url: dummyUser.avatar_url,
      locale: dummyUser.locale,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("❌ Failed to seed dummy user:", error);
    throw error;
  }

  console.log("✅ Dummy user ready:", data.id);
  return data.id;
}
