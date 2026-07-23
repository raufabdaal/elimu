-- Elimu manual activation workflow snippets
-- These are NOT app migrations. Use them manually in Supabase SQL Editor during pilot operations.
-- Replace the IDs/placeholders before running.

-- 1. See latest pending activation requests
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

-- 2. Activate one pending FAMILY MONTHLY request after confirming mobile money manually
-- Replace PAYMENT_ID_HERE with the payment_transactions.id value.
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

-- 3. Activate one pending FAMILY TERM request after confirming mobile money manually
-- Replace PAYMENT_ID_HERE with the payment_transactions.id value.
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

-- 4. Give manual complimentary access to a profile
-- Replace PROFILE_ID_HERE with profiles.id.
update public.subscriptions
set
  status = 'manual_comp',
  plan = 'manual_comp',
  current_period_ends_at = null,
  updated_at = now()
where profile_id = 'PROFILE_ID_HERE';

-- 5. Mark a pending payment as failed/cancelled
update public.payment_transactions
set status = 'failed', updated_at = now()
where id = 'PAYMENT_ID_HERE';

-- 6. See active subscriptions
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
