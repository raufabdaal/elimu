"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, LogOut, Mail, UserPlus } from "lucide-react";
import AppShell from "@/components/AppShell";
import { signInWithEmail, signOut, signUpWithEmail } from "@/lib/auth";
import {
  AccountSummary,
  ensureCloudProfile,
  getAccountSummary,
  getCloudProfile,
  getTrialDaysLeft,
  consumePendingPairCodeIfAny,
  syncLocalSnapshotToCloud,
} from "@/lib/cloud-profile";
import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";
import { loadState } from "@/lib/store";
import { ClassLevel, Role } from "@/lib/types";

type AuthMode = "landing" | "signin" | "signup";

function friendlyAuthError(error: unknown): string {
  const fallbackDetail = (() => {
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  })();
  const message = error instanceof Error ? error.message : fallbackDetail || "Authentication failed. Please try again.";
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "Invalid email or password. If you just signed up, confirm your email first, then sign in again.";
  }
  if (lower.includes("email not confirmed")) {
    return "Your email is not confirmed yet. Open the confirmation email from Supabase, then sign in again.";
  }
  if (lower.includes("unsupported provider")) {
    return "Google sign-in is not fully enabled in Supabase yet. Enable the Google provider and add the Google OAuth client details.";
  }
  if (lower.includes("row-level security") || lower.includes("violates") || lower.includes("permission denied")) {
    return `Signed in, but profile setup failed: ${message}. Check that the latest Supabase SQL patches were run.`;
  }
  if (message === "{}" || message === "undefined" || message === "null") {
    return "Authentication failed, but no detailed message was returned. Check Supabase Auth logs and make sure the SQL patches have been run.";
  }

  return message;
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const local = loadState();
  const initialMode = (searchParams.get("mode") as AuthMode | null) || "landing";
  const [mode, setMode] = useState<AuthMode>(["landing", "signin", "signup"].includes(initialMode) ? initialMode : "landing");
  const [role, setRole] = useState<Role>((searchParams.get("role") as Role) || local.profile.role || "learner");
  const [classLevel, setClassLevel] = useState<ClassLevel>((searchParams.get("class") as ClassLevel) || local.profile.classLevel || "p5");
  const [fullName, setFullName] = useState(searchParams.get("name") || local.profile.name || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [account, setAccount] = useState<AccountSummary | null>(null);

  const refreshAccount = async () => {
    const summary = await getAccountSummary();
    setAccount(summary);
    if (summary?.profile) {
      setRole(summary.profile.role);
      if (summary.profile.class_level) setClassLevel(summary.profile.class_level);
      setFullName(summary.profile.full_name || "");
    }
    return summary;
  };

  useEffect(() => {
    const init = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setCheckingSession(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        try {
          const existing = await getCloudProfile();
          if (!existing) {
            await ensureCloudProfile({ role, fullName: fullName || local.profile.name || "Student", classLevel });
          } else {
            await ensureCloudProfile({
              role: existing.role,
              fullName: existing.full_name,
              classLevel: existing.class_level || classLevel,
            });
          }
          await syncLocalSnapshotToCloud().catch(() => null);
          const linkedName = await consumePendingPairCodeIfAny().catch(() => null);
          await refreshAccount();
          setMessage(linkedName ? `Account connected and linked to ${linkedName}.` : "Account connected.");
        } catch (e) {
          setError(friendlyAuthError(e));
        }
      }
      setCheckingSession(false);
    };
    init();

    const supabase = getSupabaseClient();
    const { data: authListener } = supabase?.auth.onAuthStateChange(async (event) => {
      if (event !== "SIGNED_IN") return;
      try {
        await ensureCloudProfile({ role, fullName: fullName || local.profile.name || "Student", classLevel });
        await syncLocalSnapshotToCloud().catch(() => null);
        const linkedName = await consumePendingPairCodeIfAny().catch(() => null);
        await refreshAccount();
        setMessage(linkedName ? `Account connected and linked to ${linkedName}.` : "Account connected.");
        setError("");
      } catch (e) {
        setError(friendlyAuthError(e));
      }
    }) || { data: { subscription: null } };

    return () => {
      authListener.subscription?.unsubscribe();
    };
    // Complete OAuth/email session setup once after redirects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goAfterAuth = () => {
    const next = searchParams.get("next");
    if (next) {
      router.push(next);
      return;
    }
    router.push(role === "parent" ? "/parent/" : "/home/");
  };

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!hasSupabaseConfig()) {
      setError("Supabase is not configured yet. Add your URL and public key to .env.local and Vercel.");
      return;
    }
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (mode === "signup" && !fullName.trim()) {
      setError("Please complete onboarding first so we know the account name and class.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const result = await signUpWithEmail(email.trim(), password, {
          role,
          fullName: fullName.trim(),
          classLevel,
        });

        if (result.session) {
          await ensureCloudProfile({ role, fullName: fullName.trim(), classLevel });
          await syncLocalSnapshotToCloud().catch(() => null);
          await refreshAccount();
          setMessage("Account created and connected.");
        } else {
          setMessage("If this is a new email, check your inbox to verify it. If you already created this account, switch to Sign In.");
        }
      } else {
        await signInWithEmail(email.trim(), password);
        await ensureCloudProfile({ role, fullName: fullName.trim() || local.profile.name || "Student", classLevel });
        await syncLocalSnapshotToCloud().catch(() => null);
        const linkedName = await consumePendingPairCodeIfAny().catch(() => null);
        await refreshAccount();
        setMessage(linkedName ? `Signed in and linked to ${linkedName}.` : "Signed in successfully.");
      }
    } catch (e) {
      setError(friendlyAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    if (!hasSupabaseConfig()) {
      setError("Supabase is not configured yet. Add your URL and public key to .env.local and Vercel.");
      return;
    }

    if (mode === "signup" && !fullName.trim()) {
      setError("Please complete onboarding first so we know the account name and class.");
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const redirectTo = `${window.location.origin}/auth/?mode=${mode}&role=${role}&class=${classLevel}`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (oauthError) setError(friendlyAuthError(oauthError));
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError("");
    try {
      await signOut();
      setAccount(null);
      setMode("signin");
      setMessage("Signed out on this device.");
    } catch (e) {
      setError(friendlyAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  const trialDaysLeft = getTrialDaysLeft(account?.subscription || null);
  const subscriptionLabel = account?.subscription
    ? account.subscription.status === "trialing"
      ? `Free trial · ${trialDaysLeft ?? 0} day${trialDaysLeft === 1 ? "" : "s"} left`
      : `${account.subscription.plan} · ${account.subscription.status}`
    : "Trial starts after account creation";

  return (
    <AppShell showTabBar={false} noScrollPad role={role === "parent" ? "parent" : "learner"}>
      <div className="min-h-[90vh] px-5 py-6 max-w-[460px] mx-auto w-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-5"
        >
          <div className="text-center">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-3xl mx-auto flex items-center justify-center shadow-sm">
              E
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-4 leading-tight">
              {account?.profile ? "Account Settings" : mode === "signup" ? "Create your account" : mode === "signin" ? "Welcome back" : "Welcome to Elimu"}
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1 leading-relaxed">
              {account?.profile ? "Manage this device session." : "Sign in to save progress and connect parent reports."}
            </p>
          </div>

          {!hasSupabaseConfig() && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-bold text-amber-950">
              Supabase keys are missing. Add them to <span className="font-mono">.env.local</span> and Vercel before using auth.
            </div>
          )}

          {checkingSession ? (
            <div className="rounded-3xl bg-white border border-slate-200 p-6 flex items-center justify-center gap-2 text-sm font-bold text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Checking account...
            </div>
          ) : account?.profile ? (
            <div className="rounded-3xl bg-white border-2 border-slate-200 p-5 shadow-sm flex flex-col gap-4">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h2 className="text-lg font-black text-emerald-950">Signed in</h2>
                  <p className="text-xs font-bold text-emerald-800 break-words">{account.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <AccountRow label="Name" value={account.profile.full_name || "Not set"} />
                <AccountRow label="Role" value={account.profile.role === "parent" ? "Parent / Guardian" : "Student"} />
                {account.profile.role === "learner" && <AccountRow label="Class" value={(account.profile.class_level || classLevel).toUpperCase()} />}
                {account.profile.role === "learner" && <AccountRow label="Parent Code" value={account.student?.pairing_code || "Generating..."} />}
                <AccountRow label="Plan" value={subscriptionLabel} />
              </div>

              {message && <p className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-3">{message}</p>}
              {error && <p className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</p>}

              <button type="button" onClick={goAfterAuth} className="btn btn-primary w-full py-3.5 font-black">
                Continue to App <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleSignOut} disabled={loading} className="btn w-full py-3.5 font-black bg-rose-50 text-rose-800 border border-rose-200">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                Sign Out
              </button>
            </div>
          ) : mode === "landing" ? (
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => router.push("/onboarding/?new=1")}
                className="card card-press bg-white border-2 border-emerald-200 p-5 rounded-[28px] flex items-center justify-between gap-4 text-left"
              >
                <div>
                  <h2 className="text-lg font-black text-slate-900">I am new</h2>
                  <p className="text-xs font-bold text-slate-500 mt-1">Set up class, name, and free trial.</p>
                </div>
                <UserPlus className="w-6 h-6 text-emerald-600 shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="card card-press bg-white border-2 border-slate-200 p-5 rounded-[28px] flex items-center justify-between gap-4 text-left"
              >
                <div>
                  <h2 className="text-lg font-black text-slate-900">I already have an account</h2>
                  <p className="text-xs font-bold text-slate-500 mt-1">Sign in with email or Google.</p>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-500 shrink-0" />
              </button>
            </div>
          ) : (
            <>
              {mode === "signup" && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                  <h2 className="text-sm font-black text-emerald-950">Start with a free trial</h2>
                  <p className="text-xs font-bold text-emerald-800 mt-1 leading-relaxed">
                    Create one account, try Elimu first, and we will show reminders before the trial ends.
                  </p>
                  <p className="text-[11px] font-bold text-emerald-700 mt-2">
                    {role === "parent" ? "Parent account" : `Student account · ${classLevel.toUpperCase()}`} {fullName ? `· ${fullName}` : ""}
                  </p>
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="card bg-white p-4 border-2 border-slate-200/90 flex flex-col gap-3">
                {mode === "signup" && !fullName && (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === "parent" ? "Parent name" : "Student name"}
                    className="answer-input text-base bg-white"
                  />
                )}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  className="answer-input text-base bg-white"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className="answer-input text-base bg-white"
                />

                {error && <p className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</p>}
                {message && <p className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-3">{message}</p>}

                <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 font-black">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {mode === "signup" ? "Create Account" : "Sign In"}
                </button>
              </form>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={!hasSupabaseConfig()}
                className="btn btn-secondary w-full py-3.5 font-black bg-white"
              >
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "landing" : "signin")}
                className="text-xs font-black text-emerald-700 text-center py-2"
              >
                {mode === "signin" ? "New to Elimu? Start here" : "Already have an account? Sign in"}
              </button>

              <p className="text-[11px] font-semibold text-slate-400 text-center leading-relaxed">
                Email verification is enabled. New email accounts may need to verify before signing in.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
}

function AccountRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 border border-slate-200/80 px-3.5 py-3">
      <span className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</span>
      <span className="text-sm font-black text-slate-900 text-right break-words">{value}</span>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AppShell showTabBar={false}><div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div></AppShell>}>
      <AuthContent />
    </Suspense>
  );
}
