"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Phone, Smartphone, Sparkles } from "lucide-react";
import AppShell from "@/components/AppShell";
import { getAccountSummary, getTrialDaysLeft, type AccountSummary } from "@/lib/cloud-profile";
import { createPendingPaymentTransaction, formatUgx, getRecentPaymentTransactions, PAYMENT_PLANS, PaymentProvider, PaymentPlan } from "@/lib/payments";
import { getSubscriptionLabel } from "@/lib/subscription";

interface PaymentRow {
  id: string;
  status: string;
  external_reference: string;
  amount_ugx: number;
  provider: string;
  phone_last4: string | null;
  created_at: string;
}

export default function PricingPage() {
  const [account, setAccount] = useState<AccountSummary | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>("mtn_momo");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [payments, setPayments] = useState<PaymentRow[]>([]);

  const refresh = async () => {
    const summary = await getAccountSummary().catch(() => null);
    setAccount(summary);
    const rows = await getRecentPaymentTransactions().catch(() => []);
    setPayments(rows as PaymentRow[]);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleActivationRequest = async (plan: PaymentPlan) => {
    setError("");
    setMessage("");

    if (plan.id === "school_contact") {
      setMessage("School/group activation is handled manually for now. Contact the Elimu team with the number of learners.");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Enter the MTN or Airtel mobile money number to attach to this activation request.");
      return;
    }

    setLoadingPlan(plan.id);
    try {
      const payment = await createPendingPaymentTransaction({
        planId: plan.id,
        provider: selectedProvider,
        phoneNumber,
      });
      setMessage(`Activation request saved. Reference: ${payment.external_reference}. Mobile money collection will be connected in the next payment phase.`);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create activation request.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const trialDays = getTrialDaysLeft(account?.subscription || null);

  return (
    <AppShell showTabBar={false} noScrollPad role={account?.profile?.role === "parent" ? "parent" : "learner"}>
      <div className="min-h-[90vh] px-5 py-6 max-w-[760px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-5"
        >
          <div className="text-center max-w-lg mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-700">
              <Smartphone className="h-3.5 w-3.5" /> Mobile Money First
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black leading-tight text-slate-950">Choose Elimu access</h1>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-500">
              We are preparing MTN Mobile Money and Airtel Money activation. These plan requests prepare the account for mobile money collection.
            </p>
          </div>

          <section className="rounded-[28px] border-2 border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Current Access</span>
                <h2 className="text-lg font-black text-slate-950">{getSubscriptionLabel(account?.subscription || null)}</h2>
                {trialDays !== null && (
                  <p className="text-xs font-bold text-slate-500">Trial days left: {trialDays}</p>
                )}
              </div>
              <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800 border border-emerald-200">
                {account?.email || "Signed-in account"}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border-2 border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-black text-slate-950">Mobile money number</h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Use the parent/guardian MTN or Airtel number for activation.</p>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_auto]">
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                inputMode="tel"
                placeholder="e.g. 0772 123 456"
                className="answer-input text-base bg-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProvider("mtn_momo")}
                  className={`rounded-2xl border px-3 py-2 text-xs font-black ${selectedProvider === "mtn_momo" ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-600 border-slate-200"}`}
                >
                  MTN
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProvider("airtel_money")}
                  className={`rounded-2xl border px-3 py-2 text-xs font-black ${selectedProvider === "airtel_money" ? "bg-rose-600 text-white border-rose-600" : "bg-white text-slate-600 border-slate-200"}`}
                >
                  Airtel
                </button>
              </div>
            </div>
          </section>

          {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}
          {message && <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p>}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {PAYMENT_PLANS.map((plan) => (
              <section key={plan.id} className="rounded-[30px] border-2 border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-950">{plan.name}</h2>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">{plan.description}</p>
                </div>

                <div>
                  <span className="text-2xl font-black text-slate-950">{formatUgx(plan.amountUgx)}</span>
                  <span className="ml-1 text-xs font-bold text-slate-400">{plan.interval}</span>
                </div>

                <ul className="flex flex-col gap-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs font-bold text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" /> {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleActivationRequest(plan)}
                  disabled={loadingPlan === plan.id}
                  className={`btn w-full py-3.5 font-black ${plan.id === "family_term" ? "btn-primary" : "btn-secondary bg-white"}`}
                >
                  {loadingPlan === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : plan.id === "school_contact" ? <Phone className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  {plan.id === "school_contact" ? "Request Quote" : "Request Activation"}
                </button>
              </section>
            ))}
          </div>

          {payments.length > 0 && (
            <section className="rounded-[28px] border-2 border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-black text-slate-950">Recent activation requests</h2>
              <div className="mt-3 flex flex-col gap-2">
                {payments.map((payment) => (
                  <div key={payment.id} className="rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 flex items-center justify-between gap-3">
                    <span>{payment.provider.replace("_", " ")} · {formatUgx(payment.amount_ugx)}</span>
                    <span className="font-black text-amber-700 uppercase">{payment.status}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
}
