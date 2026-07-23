"use client";

import { useEffect, useState } from "react";
import { Clock3, Smartphone } from "lucide-react";
import { getAccountSummary, type AccountSummary } from "@/lib/cloud-profile";
import { getSubscriptionLabel, shouldShowTrialReminder } from "@/lib/subscription";

export default function SubscriptionNotice() {
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
            We will remind you before access ends. Mobile money activation with MTN/Airtel is being prepared.
          </p>
        </div>
        <Smartphone className="mt-1 h-4 w-4 shrink-0 text-amber-700" />
      </div>
    </section>
  );
}
