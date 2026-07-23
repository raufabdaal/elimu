import { getSupabaseClient } from "@/lib/supabase";
import { ClassLevel, Role } from "@/lib/types";

const SIGNED_OUT_KEY = "elimu_auth_signed_out";

function rememberSignedOut(value: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SIGNED_OUT_KEY, value ? "true" : "false");
  } catch {}
}

export function hasExplicitlySignedOut(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SIGNED_OUT_KEY) === "true";
  } catch {
    return false;
  }
}

export function markSignedInLocally() {
  rememberSignedOut(false);
}

export interface AuthProfilePayload {
  role: Role;
  fullName: string;
  classLevel?: ClassLevel;
}

export async function signUpWithEmail(email: string, password: string, profile: AuthProfilePayload) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/` : undefined,
      data: {
        role: profile.role,
        full_name: profile.fullName,
        class_level: profile.classLevel || null,
      },
    },
  });

  if (error) throw error;
  if (data.session) rememberSignedOut(false);
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  rememberSignedOut(false);
  return data;
}

export async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  rememberSignedOut(true);
}

export async function getCurrentSession() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getCurrentUser() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}
