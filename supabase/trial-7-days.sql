-- Elimu 7-day trial patch
-- Run this in Supabase SQL Editor to change future trial accounts from 14 days to 7 days.
-- Safe to run more than once.

alter table public.subscriptions
alter column trial_ends_at set default (now() + interval '7 days');

-- Optional pilot reset for accounts that are still trialing and were created with a longer trial.
-- This keeps already-active/manual accounts untouched.
update public.subscriptions
set
  trial_ends_at = least(trial_ends_at, trial_started_at + interval '7 days'),
  updated_at = now()
where status = 'trialing'
  and trial_started_at is not null
  and trial_ends_at > trial_started_at + interval '7 days';

select
  p.full_name,
  s.status,
  s.plan,
  s.trial_started_at,
  s.trial_ends_at
from public.subscriptions s
left join public.profiles p on p.id = s.profile_id
order by s.updated_at desc;
