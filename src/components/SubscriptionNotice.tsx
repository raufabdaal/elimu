"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3 } from "lucide-react";
import { getAccountSummary, type AccountSummary } from "@/lib/cloud-profile";
import { getSubscriptionLabel, shouldShowTrialReminder } from "@/lib/subscription";

export default function SubscriptionNotice() {
  const router = useRouter();
  const [account, setAccount] = useState<AccountSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAccountSummary()
      .then((summary) => {
        if (!cancelled) setAccount(summary);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!account?.subscription || !shouldShowTrialReminder(account.subscription)) return null;

  return (
    <section className="rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 shadow-2xs">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <Clock3 className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black text-amber-950">{getSubscriptionLabel(account.subscription)}</h3>
          <p className="mt-0.5 text-xs font-bold leading-relaxed text-amber-800">
            Your progress is safe. Choose an activation option before the trial ends to keep access open.
          </p>
          <button
            type="button"
            onClick={() => router.push("/pricing/")}
            className="mt-2 inline-flex items-center gap-1 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-black text-white active:scale-95"
          >
            View plans <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
