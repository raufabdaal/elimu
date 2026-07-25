"use client";

import { FormEvent, useEffect, useState } from "react";
import { Copy, Loader2, RefreshCw, Users, Wallet, CheckCircle2, Clock3 } from "lucide-react";
import AppShell from "@/components/AppShell";
import { getAccountSummary, type AccountSummary } from "@/lib/cloud-profile";
import { calculateReferralSummary, createOrGetReferrer, getMyReferrerProfile, getReferrerDashboardRows, type ReferrerDashboardRow, type ReferrerProfile } from "@/lib/referrals";
import { formatUgx } from "@/lib/payments";

export default function TeacherPage() {
  const [account, setAccount] = useState<AccountSummary | null>(null);
  const [referrer, setReferrer] = useState<ReferrerProfile | null>(null);
  const [rows, setRows] = useState<ReferrerDashboardRow[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const summary = await getAccountSummary();
      setAccount(summary);
      const existing = await getMyReferrerProfile();
      setReferrer(existing);
      if (existing) {
        setDisplayName(existing.display_name || summary?.profile?.full_name || "");
        setPhoneNumber(existing.phone_number || "");
        const dashboardRows = await getReferrerDashboardRows();
        setRows(dashboardRows);
      } else {
        setDisplayName(summary?.profile?.full_name || "");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load teacher dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const profile = await createOrGetReferrer(displayName, phoneNumber);
      setReferrer(profile);
      setMessage("Teacher partner profile is ready.");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create teacher partner profile.");
    } finally {
      setSaving(false);
    }
  };

  const copyCode = async () => {
    if (!referrer?.referral_code) return;
    await navigator.clipboard?.writeText(referrer.referral_code).catch(() => undefined);
    setMessage("Referral code copied.");
    setTimeout(() => setMessage(""), 1500);
  };

  const summary = calculateReferralSummary(rows);

  return (
    <AppShell showTabBar={false} noScrollPad role="parent">
      <div className="min-h-[90vh] px-5 py-6 max-w-[900px] mx-auto w-full">
        <div className="flex flex-col gap-5">
          <div className="text-center max-w-xl mx-auto">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-700">
              Teacher Partner Program
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-950">Referral Dashboard</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500 leading-relaxed">
              Share your teacher code with parents. You earn commission only when a referred account pays and is confirmed.
            </p>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-white border border-slate-200 p-6 flex items-center justify-center gap-2 text-sm font-bold text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading dashboard...
            </div>
          ) : !account?.profile ? (
            <section className="rounded-[28px] border-2 border-amber-200 bg-amber-50 p-5 text-center">
              <h2 className="text-xl font-black text-amber-950">Sign in first</h2>
              <p className="mt-1 text-sm font-bold text-amber-800">Create or sign in to an Elimu account before joining the teacher partner program.</p>
            </section>
          ) : !referrer ? (
            <section className="rounded-[30px] border-2 border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Create teacher partner profile</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">This creates your referral code.</p>
              <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-3">
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Teacher / marketer name" className="answer-input bg-white text-base" />
                <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Mobile money payout number" inputMode="tel" className="answer-input bg-white text-base" />
                {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}
                <button type="submit" disabled={saving || !displayName.trim()} className="btn btn-primary w-full font-black">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />} Create Referral Code
                </button>
              </form>
            </section>
          ) : (
            <>
              <section className="rounded-[30px] border-2 border-emerald-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Your referral code</span>
                    <h2 className="mt-1 font-mono text-3xl font-black tracking-wider text-emerald-950">{referrer.referral_code}</h2>
                    <p className="mt-1 text-xs font-bold text-slate-500">Ask parents to enter this code on the pricing/payment page.</p>
                  </div>
                  <button type="button" onClick={copyCode} className="btn btn-primary font-black">
                    <Copy className="w-4 h-4" /> Copy Code
                  </button>
                </div>
                {message && <p className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p>}
              </section>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard label="Referred" value={`${summary.totalReferred}`} icon={<Users className="w-5 h-5" />} />
                <StatCard label="Paid" value={`${summary.paidCount}`} icon={<CheckCircle2 className="w-5 h-5" />} />
                <StatCard label="Pending" value={`${summary.pendingCount}`} icon={<Clock3 className="w-5 h-5" />} />
                <StatCard label="Commission" value={formatUgx(summary.pendingCommission)} icon={<Wallet className="w-5 h-5" />} />
              </div>

              <section className="rounded-[30px] border-2 border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">Referred payments</h2>
                    <p className="text-xs font-semibold text-slate-500">Only confirmed payments earn commission.</p>
                  </div>
                  <button type="button" onClick={refresh} className="btn btn-secondary bg-white px-3 py-2 text-xs font-black">
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  {rows.length === 0 ? (
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm font-bold text-slate-500 text-center">
                      No referred payments yet.
                    </div>
                  ) : rows.map((row) => (
                    <div key={row.payment_id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-black text-slate-950 truncate">{row.parent_name || "Parent"}</p>
                          <p className="text-xs font-bold text-slate-500 truncate">{row.student_name ? `Student: ${row.student_name}` : row.external_reference}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${row.payment_status === "successful" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {row.payment_status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>{formatUgx(row.amount_ugx)}</span>
                        <span>Commission: {row.commission_amount_ugx ? formatUgx(row.commission_amount_ugx) : "Not earned yet"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm text-center">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{icon}</div>
      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</span>
      <span className="mt-0.5 block text-lg font-black text-slate-950">{value}</span>
    </div>
  );
}
