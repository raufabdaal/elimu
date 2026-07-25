"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Loader2, MessageCircle, Smartphone, Sparkles } from "lucide-react";
import AppShell from "@/components/AppShell";
import { getAccountSummary, getTrialDaysLeft, type AccountSummary } from "@/lib/cloud-profile";
import {
  createPendingPaymentTransaction,
  formatUgx,
  generateManualPaymentReference,
  getRecentPaymentTransactions,
  MANUAL_PAYMENT_DETAILS,
  PAYMENT_PLANS,
  type PaymentPlan,
} from "@/lib/payments";
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
  const [selectedPlanId, setSelectedPlanId] = useState<PaymentPlan["id"] | null>("family_monthly");
  const [manualReference, setManualReference] = useState(generateManualPaymentReference());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [payments, setPayments] = useState<PaymentRow[]>([]);

  const selectedPlan = useMemo(
    () => PAYMENT_PLANS.find((plan) => plan.id === selectedPlanId) || PAYMENT_PLANS[0],
    [selectedPlanId]
  );

  const refresh = async () => {
    const summary = await getAccountSummary().catch(() => null);
    setAccount(summary);
    const rows = await getRecentPaymentTransactions().catch(() => []);
    setPayments(rows as PaymentRow[]);
  };

  useEffect(() => {
    refresh();
  }, []);

  const copyText = async (text: string) => {
    await navigator.clipboard?.writeText(text).catch(() => undefined);
    setMessage("Copied.");
    setTimeout(() => setMessage(""), 1500);
  };

  const handlePaid = async () => {
    setError("");
    setMessage("");

    if (!selectedPlan || selectedPlan.id === "school_contact") {
      setMessage("For school/group activation, please WhatsApp support for a manual quote.");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Enter the phone number you used to send the Airtel Money payment.");
      return;
    }

    setLoading(true);
    try {
      const payment = await createPendingPaymentTransaction({
        planId: selectedPlan.id,
        provider: MANUAL_PAYMENT_DETAILS.provider,
        phoneNumber,
        manualReference,
      });
      setMessage(`Payment submitted for review. Reference: ${payment.external_reference}. Activation is ${MANUAL_PAYMENT_DETAILS.activationTime}.`);
      setManualReference(generateManualPaymentReference());
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit payment for review.");
    } finally {
      setLoading(false);
    }
  };

  const trialDays = getTrialDaysLeft(account?.subscription || null);
  const supportUrl = `https://wa.me/${MANUAL_PAYMENT_DETAILS.supportWhatsappInternational}`;

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
              <Smartphone className="h-3.5 w-3.5" /> Airtel Money Manual Activation
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black leading-tight text-slate-950">Activate Elimu access</h1>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-500">
              Pay by Airtel Money, then submit the reference for confirmation. Activation is {MANUAL_PAYMENT_DETAILS.activationTime}.
            </p>
          </div>

          <section className="rounded-[28px] border-2 border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Current Access</span>
                <h2 className="text-lg font-black text-slate-950">{getSubscriptionLabel(account?.subscription || null)}</h2>
                {trialDays !== null && <p className="text-xs font-bold text-slate-500">Trial days left: {trialDays}</p>}
              </div>
              <a href={supportUrl} target="_blank" rel="noreferrer" className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800 border border-emerald-200 inline-flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp support
              </a>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PAYMENT_PLANS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => {
                  setSelectedPlanId(plan.id);
                  setManualReference(generateManualPaymentReference());
                }}
                className={`rounded-[28px] border-2 bg-white p-4 text-left shadow-sm transition-all ${
                  selectedPlanId === plan.id ? "border-emerald-500 ring-4 ring-emerald-100" : "border-slate-200"
                }`}
              >
                <h2 className="text-base font-black text-slate-950">{plan.name}</h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">{plan.description}</p>
                <div className="mt-3">
                  <span className="text-xl font-black text-slate-950">{formatUgx(plan.amountUgx)}</span>
                  <span className="ml-1 text-xs font-bold text-slate-400">{plan.interval}</span>
                </div>
              </button>
            ))}
          </div>

          {selectedPlan.id === "school_contact" ? (
            <section className="rounded-[28px] border-2 border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <h2 className="text-lg font-black text-emerald-950">School / group access</h2>
              <p className="mt-1 text-sm font-bold text-emerald-800 leading-relaxed">
                For schools and groups, WhatsApp support with the number of learners. We will prepare a manual quote.
              </p>
              <a href={supportUrl} target="_blank" rel="noreferrer" className="btn btn-primary mt-4 w-full font-black">
                <MessageCircle className="h-4 w-4" /> Contact on WhatsApp
              </a>
            </section>
          ) : (
            <section className="rounded-[30px] border-2 border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Airtel Money instructions</h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">Send the exact amount, then tap “I Have Paid”.</p>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <InstructionRow label="Amount" value={formatUgx(selectedPlan.amountUgx)} onCopy={() => copyText(String(selectedPlan.amountUgx))} />
                <InstructionRow label="Send to Airtel" value={MANUAL_PAYMENT_DETAILS.paymentNumber} onCopy={() => copyText(MANUAL_PAYMENT_DETAILS.paymentNumber)} />
                <InstructionRow label="Account name" value={MANUAL_PAYMENT_DETAILS.accountName} onCopy={() => copyText(MANUAL_PAYMENT_DETAILS.accountName)} />
                <InstructionRow label="Reference" value={manualReference} onCopy={() => copyText(manualReference)} highlight />
              </div>

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold leading-relaxed text-amber-900">
                If Airtel does not let you enter a reference, still send the money, then submit the phone number you paid with. We will match by amount and phone.
              </div>

              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                inputMode="tel"
                placeholder="Phone number used to pay e.g. 0757 656 297"
                className="answer-input mt-4 text-base bg-white"
              />

              {error && <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}
              {message && <p className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p>}

              <button type="button" onClick={handlePaid} disabled={loading} className="btn btn-primary mt-4 w-full py-3.5 font-black">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                I Have Paid
              </button>
            </section>
          )}

          {payments.length > 0 && (
            <section className="rounded-[28px] border-2 border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-black text-slate-950">Recent activation requests</h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Pending means the payment is waiting for manual confirmation.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {payments.map((payment) => (
                  <div key={payment.id} className="rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 flex items-center justify-between gap-3">
                    <span>{payment.external_reference} · {formatUgx(payment.amount_ugx)}</span>
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

function InstructionRow({ label, value, onCopy, highlight = false }: { label: string; value: string; onCopy: () => void; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 ${highlight ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
      <div className="min-w-0">
        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</span>
        <span className={`block truncate font-black ${highlight ? "text-xl tracking-wider text-emerald-950" : "text-sm text-slate-950"}`}>{value}</span>
      </div>
      <button type="button" onClick={onCopy} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 border border-slate-200 active:scale-95" aria-label={`Copy ${label}`}>
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}
