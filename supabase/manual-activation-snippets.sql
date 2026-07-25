-- Elimu Manual Activation Helper
-- IMPORTANT: Do NOT run this entire file from top to bottom.
-- This file is a guide with copy/paste sections.
-- Only Section 1 and Section 6 are safe to run immediately.
-- Sections 2–5 require replacing PAYMENT_ID_HERE or PROFILE_ID_HERE first.

-- ============================================================
-- SECTION 1: VIEW PENDING ACTIVATION REQUESTS
-- Safe to run as-is.
-- Run this first to find the real payment_id.
-- ============================================================

select
  pt.id as payment_id,
  pt.created_at,
  pt.provider,
  pt.amount_ugx,
  pt.phone_last4,
  pt.status as payment_status,
  pt.external_reference,
  pt.raw_payload ->> 'plan_id' as requested_plan_id,
  pt.raw_payload ->> 'plan_name' as requested_plan_name,
  pt.raw_payload ->> 'teacher_referral_code' as teacher_referral_code,
  p.id as profile_id,
  p.full_name,
  p.role,
  p.class_level,
  p.auth_user_id,
  s.status as subscription_status,
  s.plan as current_plan,
  s.trial_ends_at,
  s.current_period_ends_at
from public.payment_transactions pt
join public.profiles p on p.id = pt.profile_id
left join public.subscriptions s on s.profile_id = p.id
where pt.status = 'pending'
order by pt.created_at desc;

-- ============================================================
-- SECTION 2: ACTIVATE FAMILY MONTHLY + CREATE COMMISSION IF TEACHER CODE EXISTS
-- DO NOT run until you replace PAYMENT_ID_HERE with a real payment_id.
-- Copy only the block below into a new SQL query after replacing the ID.
-- Commission rule: UGX 8,000 for monthly paid account.
-- ============================================================

/*
with selected_payment as (
  select *
  from public.payment_transactions
  where id = 'PAYMENT_ID_HERE'
), activated_subscription as (
  update public.subscriptions s
  set
    status = 'active',
    plan = 'family',
    current_period_ends_at = now() + interval '30 days',
    updated_at = now()
  from selected_payment pt
  where s.profile_id = pt.profile_id
  returning s.profile_id
), successful_payment as (
  update public.payment_transactions
  set status = 'successful', updated_at = now()
  where id = 'PAYMENT_ID_HERE'
  returning *
), matched_referrer as (
  select r.id as referrer_id, sp.*
  from successful_payment sp
  join public.referrers r
    on upper(r.referral_code) = upper(sp.raw_payload ->> 'teacher_referral_code')
   and r.status = 'active'
), linked_student as (
  select l.student_profile_id, mr.*
  from matched_referrer mr
  left join public.parent_student_links l
    on l.parent_profile_id = mr.profile_id
   and l.status = 'active'
  limit 1
)
insert into public.commission_ledger (
  referrer_id,
  payment_transaction_id,
  parent_profile_id,
  student_profile_id,
  amount_ugx,
  status,
  payout_month
)
select
  referrer_id,
  id,
  profile_id,
  student_profile_id,
  8000,
  'pending',
  to_char(now(), 'YYYY-MM')
from linked_student
where referrer_id is not null
on conflict (payment_transaction_id) do nothing;
*/

-- ============================================================
-- SECTION 3: ACTIVATE FAMILY YEARLY + CREATE COMMISSION IF TEACHER CODE EXISTS
-- DO NOT run until you replace PAYMENT_ID_HERE with a real payment_id.
-- Copy only the block below into a new SQL query after replacing the ID.
-- Commission rule: UGX 76,800 for yearly paid account (20% discounted annual equivalent).
-- ============================================================

/*
with selected_payment as (
  select *
  from public.payment_transactions
  where id = 'PAYMENT_ID_HERE'
), activated_subscription as (
  update public.subscriptions s
  set
    status = 'active',
    plan = 'family',
    current_period_ends_at = now() + interval '365 days',
    updated_at = now()
  from selected_payment pt
  where s.profile_id = pt.profile_id
  returning s.profile_id
), successful_payment as (
  update public.payment_transactions
  set status = 'successful', updated_at = now()
  where id = 'PAYMENT_ID_HERE'
  returning *
), matched_referrer as (
  select r.id as referrer_id, sp.*
  from successful_payment sp
  join public.referrers r
    on upper(r.referral_code) = upper(sp.raw_payload ->> 'teacher_referral_code')
   and r.status = 'active'
), linked_student as (
  select l.student_profile_id, mr.*
  from matched_referrer mr
  left join public.parent_student_links l
    on l.parent_profile_id = mr.profile_id
   and l.status = 'active'
  limit 1
)
insert into public.commission_ledger (
  referrer_id,
  payment_transaction_id,
  parent_profile_id,
  student_profile_id,
  amount_ugx,
  status,
  payout_month
)
select
  referrer_id,
  id,
  profile_id,
  student_profile_id,
  76800,
  'pending',
  to_char(now(), 'YYYY-MM')
from linked_student
where referrer_id is not null
on conflict (payment_transaction_id) do nothing;
*/

-- ============================================================
-- SECTION 4: GIVE FREE / MANUAL COMPLIMENTARY ACCESS
-- DO NOT run until you replace PROFILE_ID_HERE with a real profile_id.
-- Use this for pilot testers, scholarships, staff, or temporary free access.
-- ============================================================

/*
update public.subscriptions
set
  status = 'manual_comp',
  plan = 'manual_comp',
  current_period_ends_at = null,
  updated_at = now()
where profile_id = 'PROFILE_ID_HERE';
*/

-- ============================================================
-- SECTION 5: MARK A PAYMENT AS FAILED
-- DO NOT run until you replace PAYMENT_ID_HERE with a real payment_id.
-- ============================================================

/*
update public.payment_transactions
set status = 'failed', updated_at = now()
where id = 'PAYMENT_ID_HERE';
*/

-- ============================================================
-- SECTION 6: VIEW ACTIVE SUBSCRIPTIONS
-- Safe to run as-is.
-- ============================================================

select
  p.full_name,
  p.role,
  p.class_level,
  s.plan,
  s.status,
  s.trial_ends_at,
  s.current_period_ends_at,
  s.updated_at
from public.subscriptions s
join public.profiles p on p.id = s.profile_id
order by s.updated_at desc;

-- ============================================================
-- SECTION 7: VIEW TEACHER COMMISSIONS
-- Safe to run as-is.
-- ============================================================

select
  r.display_name,
  r.referral_code,
  cl.payout_month,
  cl.status,
  sum(cl.amount_ugx) as total_commission_ugx,
  count(*) as paid_accounts
from public.commission_ledger cl
join public.referrers r on r.id = cl.referrer_id
group by r.display_name, r.referral_code, cl.payout_month, cl.status
order by cl.payout_month desc, r.display_name asc;
