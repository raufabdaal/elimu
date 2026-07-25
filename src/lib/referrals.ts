import { getSupabaseClient } from "@/lib/supabase";

export interface ReferrerProfile {
  id: string;
  profile_id: string;
  display_name: string;
  phone_number: string | null;
  referral_code: string;
  status: string;
  commission_monthly_ugx: number;
}

export interface ReferrerDashboardRow {
  payment_id: string;
  created_at: string;
  provider: string;
  amount_ugx: number;
  payment_status: string;
  external_reference: string;
  plan_id: string | null;
  plan_name: string | null;
  parent_name: string | null;
  parent_profile_id: string | null;
  student_name: string | null;
  student_profile_id: string | null;
  commission_amount_ugx: number | null;
  commission_status: string | null;
  payout_month: string | null;
}

export async function createOrGetReferrer(displayName: string, phoneNumber?: string): Promise<ReferrerProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("create_or_get_referrer", {
    display_name_input: displayName,
    phone_input: phoneNumber || null,
  });

  if (error) throw error;
  return Array.isArray(data) ? (data[0] as ReferrerProfile) : null;
}

export async function getMyReferrerProfile(): Promise<ReferrerProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("referrers")
    .select("id, profile_id, display_name, phone_number, referral_code, status, commission_monthly_ugx")
    .maybeSingle();

  if (error) throw error;
  return data as ReferrerProfile | null;
}

export async function getReferrerDashboardRows(): Promise<ReferrerDashboardRow[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("get_referrer_dashboard");
  if (error) throw error;
  return (data || []) as ReferrerDashboardRow[];
}

export function calculateReferralSummary(rows: ReferrerDashboardRow[]) {
  const paidRows = rows.filter((row) => row.payment_status === "successful");
  const pendingRows = rows.filter((row) => row.payment_status === "pending");
  const pendingCommission = rows
    .filter((row) => row.commission_status === "pending" || row.commission_status === "approved")
    .reduce((sum, row) => sum + (row.commission_amount_ugx || 0), 0);
  const paidCommission = rows
    .filter((row) => row.commission_status === "paid")
    .reduce((sum, row) => sum + (row.commission_amount_ugx || 0), 0);

  return {
    totalReferred: rows.length,
    paidCount: paidRows.length,
    pendingCount: pendingRows.length,
    pendingCommission,
    paidCommission,
  };
}
