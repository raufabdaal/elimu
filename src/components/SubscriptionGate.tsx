"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LockKeyhole, Loader2, Smartphone, UserRound } from "lucide-react";
import { getAccountSummary, type AccountSummary } from "@/lib/cloud-profile";
import { hasSupabaseConfig } from "@/lib/supabase";
import { canAccessLearning, getSubscriptionLabel } from "@/lib/subscription";

const PUBLIC_PATHS = ["/auth", "/onboarding", "/pricing"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export default function SubscriptionGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [account, setAccount] = useState<AccountSummary | null>(null);
  const publicPath = isPublicPath(pathname);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (publicPath || !hasSupabaseConfig()) {
        if (!cancelled) setChecking(false);
        return;
      }

      const summary = await getAccountSummary().catch(() => null);
      if (cancelled) return;
      setAccount(summary);
      setChecking(false);
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [pathname, publicPath]);

  if (publicPath || !hasSupabaseConfig()) return <>{children}</>;

  if (checking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#E7EFEA] text-emerald-800">
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-5 shadow-sm border border-emerald-100">
          <Loader2 className="h-7 w-7 animate-spin" />
          <p className="text-sm font-black">Checking access...</p>
        </div>
      </div>
    );
  }

  if (account?.profile && !canAccessLearning(account.subscription)) {
    return (
      <div className="min-h-screen w-full bg-[#E7EFEA] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[460px] rounded-[32px] bg-white border-2 border-slate-200 p-6 shadow-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-amber-700 mb-4">
            <LockKeyhole className="h-8 w-8" />
          </div>
          <span className="inline-flex rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-800">
            {getSubscriptionLabel(account.subscription)}
          </span>
          <h1 className="mt-3 text-2xl font-black text-slate-950">Your trial has ended</h1>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-500">
            Learning progress is safe. To continue using Elimu, this account needs to be activated.
          </p>

          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left">
            <div className="flex items-start gap-3">
              <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              <div>
                <h2 className="text-sm font-black text-emerald-950">Mobile money activation is next</h2>
                <p className="mt-1 text-xs font-bold leading-relaxed text-emerald-800">
                  We are preparing MTN Mobile Money and Airtel Money activation. For pilot accounts, activation can be handled manually first.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2.5">
            <button
              type="button"
              onClick={() => router.push("/pricing/")}
              className="btn btn-primary w-full py-3.5 font-black"
            >
              <Smartphone className="h-4 w-4" /> View Activation Options
            </button>
            <button
              type="button"
              onClick={() => router.push("/auth/?mode=signin")}
              className="btn btn-secondary w-full bg-white py-3.5 font-black"
            >
              <UserRound className="h-4 w-4" /> Sign in with another account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
