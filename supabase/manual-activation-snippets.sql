-- Elimu Manual Activation Helper
-- IMPORTANT: Do NOT run this entire file from top to bottom.
-- This file is a guide with copy/paste sections.
-- Only Section 1 is safe to run immediately.
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
-- SECTION 2: ACTIVATE FAMILY MONTHLY
-- DO NOT run until you replace PAYMENT_ID_HERE with a real payment_id.
-- Copy only the block below into a new SQL query after replacing the ID.
-- ============================================================

/*
with selected_payment as (
  select *
  from public.payment_transactions
  where id = 'PAYMENT_ID_HERE'
)
update public.subscriptions s
set
  status = 'active',
  plan = 'family',
  current_period_ends_at = now() + interval '30 days',
  updated_at = now()
from selected_payment pt
where s.profile_id = pt.profile_id;

update public.payment_transactions
set status = 'successful', updated_at = now()
where id = 'PAYMENT_ID_HERE';
*/

-- ============================================================
-- SECTION 3: ACTIVATE FAMILY TERM
-- DO NOT run until you replace PAYMENT_ID_HERE with a real payment_id.
-- Copy only the block below into a new SQL query after replacing the ID.
-- ============================================================

/*
with selected_payment as (
  select *
  from public.payment_transactions
  where id = 'PAYMENT_ID_HERE'
)
update public.subscriptions s
set
  status = 'active',
  plan = 'family',
  current_period_ends_at = now() + interval '90 days',
  updated_at = now()
from selected_payment pt
where s.profile_id = pt.profile_id;

update public.payment_transactions
set status = 'successful', updated_at = now()
where id = 'PAYMENT_ID_HERE';
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
