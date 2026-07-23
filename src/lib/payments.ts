import { ensureCloudProfile } from "@/lib/cloud-profile";
import { getSupabaseClient } from "@/lib/supabase";

export type PaymentProvider = "mtn_momo" | "airtel_money" | "manual";

export interface PaymentPlan {
  id: "family_monthly" | "family_term" | "school_contact";
  name: string;
  amountUgx: number;
  interval: string;
  description: string;
  features: string[];
}

export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: "family_monthly",
    name: "Family Monthly",
    amountUgx: 20000,
    interval: "per month",
    description: "Best for one household during normal school weeks.",
    features: ["Student learning access", "Parent dashboard", "Weekly report card", "Offline PWA learning"],
  },
  {
    id: "family_term",
    name: "Family Term",
    amountUgx: 50000,
    interval: "per school term",
    description: "Better value for a full school term of practice.",
    features: ["Everything in monthly", "Term-long access", "Mock checkpoint tracking", "Priority for new features"],
  },
  {
    id: "school_contact",
    name: "School / Group",
    amountUgx: 0,
    interval: "custom",
    description: "For schools, coaching centres, and groups of learners.",
    features: ["Multiple learners", "Admin reporting", "Custom onboarding support", "Manual quote"],
  },
];

export function formatUgx(amount: number): string {
  if (!amount) return "Custom";
  return `UGX ${amount.toLocaleString("en-UG")}`;
}

export function getPaymentPlan(planId: PaymentPlan["id"]): PaymentPlan | undefined {
  return PAYMENT_PLANS.find((plan) => plan.id === planId);
}

export async function createPendingPaymentTransaction({
  planId,
  provider,
  phoneNumber,
}: {
  planId: PaymentPlan["id"];
  provider: PaymentProvider;
  phoneNumber?: string;
}) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const profile = await ensureCloudProfile();
  if (!profile) throw new Error("Please sign in before requesting activation.");

  const plan = getPaymentPlan(planId);
  if (!plan) throw new Error("Unknown payment plan.");

  const digits = (phoneNumber || "").replace(/\D/g, "");
  const phoneLast4 = digits ? digits.slice(-4) : null;
  const externalReference = `${plan.id}-${provider}-${Date.now()}`;

  const { data, error } = await supabase
    .from("payment_transactions")
    .insert({
      profile_id: profile.id,
      provider,
      amount_ugx: Math.max(plan.amountUgx, 1),
      phone_last4: phoneLast4,
      external_reference: externalReference,
      status: "pending",
      raw_payload: {
        plan_id: plan.id,
        plan_name: plan.name,
        interval: plan.interval,
        note: "Mobile money API is not live yet. This is a pending pilot activation request.",
      },
    })
    .select("id, status, external_reference, amount_ugx, provider, phone_last4, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function getRecentPaymentTransactions() {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const profile = await ensureCloudProfile();
  if (!profile) return [];

  const { data, error } = await supabase
    .from("payment_transactions")
    .select("id, status, external_reference, amount_ugx, provider, phone_last4, created_at")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data || [];
}
