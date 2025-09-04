// src/services/userService.ts
import { supabase } from "./supabaseClient";
import { dummyUser, DUMMY_USER_ID } from "../utils/dummyUser";

export async function ensureDummyUserExists() {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", DUMMY_USER_ID)
    .maybeSingle();

  if (!data) {
    const { error: insertErr } = await supabase
      .from("profiles")
      .insert(dummyUser);
    if (insertErr) {
      console.error("❌ Failed to insert dummy user:", insertErr);
      throw insertErr;
    }
    console.log("✅ Dummy user inserted into profiles");
  }
}
