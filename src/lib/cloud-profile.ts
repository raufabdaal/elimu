import { getSupabaseClient } from "@/lib/supabase";
import { loadState, saveState } from "@/lib/store";
import { ClassLevel, Role } from "@/lib/types";

export interface CloudProfileInput {
  role: Role;
  fullName: string;
  classLevel?: ClassLevel;
}

export interface CloudProfile {
  id: string;
  auth_user_id: string;
  role: Role;
  full_name: string;
  class_level: ClassLevel | null;
}

export interface CloudSubscription {
  id: string;
  profile_id: string;
  plan: "trial" | "family" | "school" | "manual_comp";
  status: "trialing" | "active" | "past_due" | "expired" | "cancelled" | "manual_comp";
  trial_started_at: string | null;
  trial_ends_at: string | null;
  current_period_ends_at: string | null;
}

export interface AccountSummary {
  profile: CloudProfile | null;
  subscription: CloudSubscription | null;
  email: string | null;
}

function generatePairingCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function getTrialDaysLeft(subscription: CloudSubscription | null): number | null {
  if (!subscription?.trial_ends_at) return null;
  const end = new Date(subscription.trial_ends_at).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
}

export async function getCloudProfile(): Promise<CloudProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, auth_user_id, role, full_name, class_level")
    .eq("auth_user_id", userData.user.id)
    .maybeSingle();

  if (error) throw error;
  return data as CloudProfile | null;
}

export async function getCloudSubscription(profileId?: string): Promise<CloudSubscription | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const profile = profileId ? ({ id: profileId } as CloudProfile) : await getCloudProfile();
  if (!profile?.id) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, profile_id, plan, status, trial_started_at, trial_ends_at, current_period_ends_at")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (error) throw error;
  return data as CloudSubscription | null;
}

async function ensureTrialSubscription(profileId: string): Promise<CloudSubscription | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const existing = await getCloudSubscription(profileId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      profile_id: profileId,
      plan: "trial",
      status: "trialing",
    })
    .select("id, profile_id, plan, status, trial_started_at, trial_ends_at, current_period_ends_at")
    .single();

  if (error) throw error;
  return data as CloudSubscription;
}

export async function ensureCloudProfile(input?: Partial<CloudProfileInput>): Promise<CloudProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const user = userData.user;
  if (!user) return null;

  const local = loadState();
  const metadata = user.user_metadata || {};
  const role = (input?.role || metadata.role || local.profile.role || "learner") as Role;
  const fullName =
    input?.fullName ||
    metadata.full_name ||
    metadata.name ||
    local.profile.name ||
    (role === "parent" ? "Parent" : "Student");
  const classLevel = (input?.classLevel || metadata.class_level || local.profile.classLevel || "p5") as ClassLevel;

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        auth_user_id: user.id,
        role,
        full_name: fullName,
        class_level: classLevel,
      },
      { onConflict: "auth_user_id" }
    )
    .select("id, auth_user_id, role, full_name, class_level")
    .single();

  if (profileError) throw profileError;
  const profile = profileData as CloudProfile;

  if (role === "learner") {
    const { data: existingStudent, error: existingStudentError } = await supabase
      .from("students")
      .select("id, pairing_code")
      .eq("profile_id", profile.id)
      .maybeSingle();

    if (existingStudentError) throw existingStudentError;

    if (existingStudent) {
      const { error: studentUpdateError } = await supabase
        .from("students")
        .update({ class_level: classLevel })
        .eq("profile_id", profile.id);
      if (studentUpdateError) throw studentUpdateError;
    } else {
      let studentError: unknown = null;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const { error } = await supabase.from("students").insert({
          profile_id: profile.id,
          class_level: classLevel,
          pairing_code: generatePairingCode(),
          pairing_code_expires_at: null,
        });
        if (!error) {
          studentError = null;
          break;
        }
        studentError = error;
        if (!error.message?.includes("students_pairing_code_key")) break;
      }
      if (studentError) throw studentError;
    }
  }

  await ensureTrialSubscription(profile.id);

  saveState({
    profile: {
      ...local.profile,
      role,
      name: fullName,
      classLevel,
    },
  });

  return profile;
}

export async function getAccountSummary(): Promise<AccountSummary | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const profile = await getCloudProfile();
  const subscription = profile ? await getCloudSubscription(profile.id) : null;

  return {
    profile,
    subscription,
    email: userData.user.email || null,
  };
}

export async function syncLocalSnapshotToCloud() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const profile = await ensureCloudProfile();
  if (!profile || profile.role !== "learner") return null;

  const local = loadState();
  const { data, error } = await supabase
    .from("progress_snapshots")
    .upsert(
      {
        student_profile_id: profile.id,
        progress_json: local.progress,
        session_json: local.session,
        topic_progress_json: local.topicProgress,
        continue_json: local.continue,
        local_updated_at: new Date().toISOString(),
        synced_at: new Date().toISOString(),
      },
      { onConflict: "student_profile_id" }
    )
    .select("id")
    .single();

  if (error) throw error;
  return data;
}
