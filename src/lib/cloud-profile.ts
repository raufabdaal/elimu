import { getSupabaseClient } from "@/lib/supabase";
import { freshLearningState, loadState, resetLearningForProfile, saveState } from "@/lib/store";
import { AppState, ClassLevel, Role } from "@/lib/types";

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

export interface CloudStudent {
  id: string;
  profile_id: string;
  class_level: ClassLevel;
  pairing_code: string | null;
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
  student: CloudStudent | null;
  subscription: CloudSubscription | null;
  email: string | null;
}

export interface CloudAnswerEvent {
  id: string;
  question_id: string;
  topic_id: string | null;
  subject_id: string | null;
  class_level: ClassLevel | null;
  is_correct: boolean;
  partial_score: number;
  answered_at: string;
}

export interface LinkedStudentSummary {
  profile: CloudProfile;
  student: CloudStudent | null;
  snapshot: {
    progress_json?: AppState["progress"];
    session_json?: AppState["session"];
    topic_progress_json?: AppState["topicProgress"];
    continue_json?: AppState["continue"];
    synced_at?: string;
  } | null;
  recentEvents: CloudAnswerEvent[];
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

export async function getCloudStudent(profileId?: string): Promise<CloudStudent | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const profile = profileId ? ({ id: profileId } as CloudProfile) : await getCloudProfile();
  if (!profile?.id) return null;

  const { data, error } = await supabase
    .from("students")
    .select("id, profile_id, class_level, pairing_code")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (error) throw error;
  return data as CloudStudent | null;
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
  const existing = await getCloudSubscription(profileId);
  if (existing) return existing;

  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .insert({ profile_id: profileId, plan: "trial", status: "trialing" })
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
    const existingStudent = await getCloudStudent(profile.id);
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
  const student = profile?.role === "learner" ? await getCloudStudent(profile.id) : null;

  return {
    profile,
    student,
    subscription,
    email: userData.user.email || null,
  };
}

export async function syncLocalSnapshotToCloud() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const profile = await ensureCloudProfile();
  if (!profile || profile.role !== "learner") return null;

  const { data: existingSnapshot, error: snapshotReadError } = await supabase
    .from("progress_snapshots")
    .select("id, progress_json, session_json, topic_progress_json, continue_json")
    .eq("student_profile_id", profile.id)
    .maybeSingle();

  if (snapshotReadError) throw snapshotReadError;

  if (existingSnapshot) {
    saveState({
      progress: existingSnapshot.progress_json || {},
      session: existingSnapshot.session_json || {},
      topicProgress: existingSnapshot.topic_progress_json || {},
      continue: existingSnapshot.continue_json || {},
    });
    return { id: existingSnapshot.id, mode: "downloaded" };
  }

  const fresh = freshLearningState({
    role: "learner",
    name: profile.full_name,
    classLevel: profile.class_level || "p5",
  });
  resetLearningForProfile(fresh.profile);

  const { data, error } = await supabase
    .from("progress_snapshots")
    .insert({
      student_profile_id: profile.id,
      progress_json: fresh.progress,
      session_json: fresh.session,
      topic_progress_json: fresh.topicProgress,
      continue_json: fresh.continue,
      local_updated_at: new Date().toISOString(),
      synced_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) throw error;
  return { ...data, mode: "initialized" };
}

export async function linkParentToStudentByCode(code: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const parentProfile = await ensureCloudProfile({ role: "parent", fullName: loadState().profile.name || "Parent" });
  if (!parentProfile) throw new Error("Please sign in as a parent first.");

  const { data, error } = await supabase.rpc("link_parent_to_student_by_code", {
    code_input: code.trim(),
  });

  if (error) throw error;
  return Array.isArray(data) ? data[0] : data;
}

export async function consumePendingPairCodeIfAny(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const pendingCode = localStorage.getItem("elimu_pending_pair_code");
  if (!pendingCode) return null;

  const profile = await getCloudProfile();
  if (!profile || profile.role !== "parent") return null;

  const linked = await linkParentToStudentByCode(pendingCode);
  localStorage.removeItem("elimu_pending_pair_code");
  return linked?.student_name || null;
}

export async function getFirstLinkedStudentSummary(): Promise<LinkedStudentSummary | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const parentProfile = await getCloudProfile();
  if (!parentProfile || parentProfile.role !== "parent") return null;

  const { data: links, error: linksError } = await supabase
    .from("parent_student_links")
    .select("student_profile_id")
    .eq("parent_profile_id", parentProfile.id)
    .eq("status", "active")
    .limit(1);

  if (linksError) throw linksError;
  const studentProfileId = links?.[0]?.student_profile_id;
  if (!studentProfileId) return null;

  const { data: studentProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id, auth_user_id, role, full_name, class_level")
    .eq("id", studentProfileId)
    .single();
  if (profileError) throw profileError;

  const student = await getCloudStudent(studentProfileId);

  const { data: snapshot, error: snapshotError } = await supabase
    .from("progress_snapshots")
    .select("progress_json, session_json, topic_progress_json, continue_json, synced_at")
    .eq("student_profile_id", studentProfileId)
    .maybeSingle();
  if (snapshotError) throw snapshotError;

  const { data: recentEvents, error: eventsError } = await supabase
    .from("answer_events")
    .select("id, question_id, topic_id, subject_id, class_level, is_correct, partial_score, answered_at")
    .eq("student_profile_id", studentProfileId)
    .order("answered_at", { ascending: false })
    .limit(250);
  if (eventsError) throw eventsError;

  return {
    profile: studentProfile as CloudProfile,
    student,
    snapshot,
    recentEvents: (recentEvents || []) as CloudAnswerEvent[],
  };
}
