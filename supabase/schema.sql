-- Elimu Supabase schema
-- Paste this into Supabase SQL Editor and run it once.
-- This schema is free-tier friendly and designed for offline-first sync later.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Enums via check constraints rather than Postgres enum types.
-- Easier to adjust while the product is still changing.
-- ------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null check (role in ('learner', 'parent')),
  full_name text not null default '',
  class_level text check (class_level in ('p4', 'p5', 'p6', 'p7')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  class_level text not null check (class_level in ('p4', 'p5', 'p6', 'p7')),
  pairing_code text unique,
  pairing_code_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.parent_student_links (
  id uuid primary key default gen_random_uuid(),
  parent_profile_id uuid not null references public.profiles(id) on delete cascade,
  student_profile_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'revoked')),
  created_at timestamptz not null default now(),
  unique (parent_profile_id, student_profile_id)
);

create table if not exists public.progress_snapshots (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null unique references public.profiles(id) on delete cascade,
  progress_json jsonb not null default '{}'::jsonb,
  session_json jsonb not null default '{}'::jsonb,
  topic_progress_json jsonb not null default '{}'::jsonb,
  continue_json jsonb not null default '{}'::jsonb,
  local_updated_at timestamptz,
  synced_at timestamptz not null default now()
);

create table if not exists public.answer_events (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.profiles(id) on delete cascade,
  local_event_id text not null,
  question_id text not null,
  topic_id text,
  subject_id text,
  class_level text check (class_level in ('p4', 'p5', 'p6', 'p7')),
  is_correct boolean not null default false,
  partial_score numeric not null default 0,
  answered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (student_profile_id, local_event_id)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  plan text not null default 'trial' check (plan in ('trial', 'family', 'school', 'manual_comp')),
  status text not null default 'trialing' check (status in ('trialing', 'active', 'past_due', 'expired', 'cancelled', 'manual_comp')),
  trial_started_at timestamptz not null default now(),
  trial_ends_at timestamptz not null default (now() + interval '14 days'),
  current_period_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Payment table is provider-agnostic so we can support MTN/Airtel/mobile money later
-- without tying the data model to Stripe.
create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('mtn_momo', 'airtel_money', 'manual', 'other')),
  amount_ugx integer not null check (amount_ugx > 0),
  phone_last4 text,
  external_reference text,
  status text not null default 'pending' check (status in ('pending', 'successful', 'failed', 'cancelled')),
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_profiles_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger touch_students_updated_at
before update on public.students
for each row execute function public.touch_updated_at();

create trigger touch_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.touch_updated_at();

create trigger touch_payment_transactions_updated_at
before update on public.payment_transactions
for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- Helper functions for Row Level Security
-- ------------------------------------------------------------

create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.profiles where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.is_linked_parent_of(student_profile uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.parent_student_links link
    where link.parent_profile_id = public.current_profile_id()
      and link.student_profile_id = student_profile
      and link.status = 'active'
  );
$$;

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.parent_student_links enable row level security;
alter table public.progress_snapshots enable row level security;
alter table public.answer_events enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_transactions enable row level security;

-- Profiles
create policy "profiles_select_own_or_linked"
on public.profiles for select
to authenticated
using (
  id = public.current_profile_id()
  or public.is_linked_parent_of(id)
);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth_user_id = auth.uid());

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = public.current_profile_id())
with check (id = public.current_profile_id());

-- Students
create policy "students_select_own_or_linked"
on public.students for select
to authenticated
using (
  profile_id = public.current_profile_id()
  or public.is_linked_parent_of(profile_id)
);

create policy "students_insert_own"
on public.students for insert
to authenticated
with check (profile_id = public.current_profile_id());

create policy "students_update_own"
on public.students for update
to authenticated
using (profile_id = public.current_profile_id())
with check (profile_id = public.current_profile_id());

-- Parent-child links
create policy "links_select_related"
on public.parent_student_links for select
to authenticated
using (
  parent_profile_id = public.current_profile_id()
  or student_profile_id = public.current_profile_id()
);

create policy "links_insert_parent"
on public.parent_student_links for insert
to authenticated
with check (parent_profile_id = public.current_profile_id());

create policy "links_update_parent"
on public.parent_student_links for update
to authenticated
using (parent_profile_id = public.current_profile_id())
with check (parent_profile_id = public.current_profile_id());

-- Progress snapshots
create policy "snapshots_select_student_or_parent"
on public.progress_snapshots for select
to authenticated
using (
  student_profile_id = public.current_profile_id()
  or public.is_linked_parent_of(student_profile_id)
);

create policy "snapshots_upsert_student"
on public.progress_snapshots for all
to authenticated
using (student_profile_id = public.current_profile_id())
with check (student_profile_id = public.current_profile_id());

-- Answer events
create policy "events_select_student_or_parent"
on public.answer_events for select
to authenticated
using (
  student_profile_id = public.current_profile_id()
  or public.is_linked_parent_of(student_profile_id)
);

create policy "events_insert_student"
on public.answer_events for insert
to authenticated
with check (student_profile_id = public.current_profile_id());

-- Subscriptions and payments: owner can see own billing state.
create policy "subscriptions_owner_all"
on public.subscriptions for all
to authenticated
using (profile_id = public.current_profile_id())
with check (profile_id = public.current_profile_id());

create policy "payments_owner_all"
on public.payment_transactions for all
to authenticated
using (profile_id = public.current_profile_id())
with check (profile_id = public.current_profile_id());
