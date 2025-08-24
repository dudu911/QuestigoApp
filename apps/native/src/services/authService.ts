import { supabase } from "./supabaseClient";
import { singleWithSchema } from "./queryWithSchema";
import { ProfileSchema } from "@repo/types";

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

// Fetch the user’s profile (typed + validated)
export async function fetchProfile(userId: string) {
  return singleWithSchema("profiles", ProfileSchema, (q) => q.eq("id", userId));
}
