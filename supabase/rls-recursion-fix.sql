-- Elimu RLS recursion fix
-- Run this in Supabase SQL Editor if you see:
-- {"code":"42P17","message":"infinite recursion detected in policy for relation \"profiles\""}
-- Safe to run more than once.

-- ------------------------------------------------------------
-- 1. Security-definer helper functions
-- These avoid querying public.profiles directly inside RLS policies.
-- ------------------------------------------------------------

create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.id
  from public.profiles p
  where p.auth_user_id = auth.uid()
  limit 1;
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
    from public.parent_student_links l
    where l.parent_profile_id = public.current_profile_id()
      and l.student_profile_id = student_profile
      and l.status = 'active'
  );
$$;

-- ------------------------------------------------------------
-- 2. Drop policies that may recursively query profiles
-- ------------------------------------------------------------

drop policy if exists "profiles_select_own_or_linked" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

drop policy if exists "students_select_own_or_linked" on public.students;
drop policy if exists "students_insert_own" on public.students;
drop policy if exists "students_update_own" on public.students;

drop policy if exists "links_select_related" on public.parent_student_links;
drop policy if exists "links_insert_parent" on public.parent_student_links;
drop policy if exists "links_update_parent" on public.parent_student_links;

drop policy if exists "snapshots_select_student_or_parent" on public.progress_snapshots;
drop policy if exists "snapshots_upsert_student" on public.progress_snapshots;
drop policy if exists "snapshots_all_student" on public.progress_snapshots;

drop policy if exists "events_select_student_or_parent" on public.answer_events;
drop policy if exists "events_insert_student" on public.answer_events;

drop policy if exists "subscriptions_owner_all" on public.subscriptions;
drop policy if exists "payments_owner_all" on public.payment_transactions;

-- ------------------------------------------------------------
-- 3. Recreate recursion-safe RLS policies
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
  auth_user_id = auth.uid()
  or public.is_linked_parent_of(id)
);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth_user_id = auth.uid());

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

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

create policy "snapshots_all_student"
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

-- Subscriptions and payments
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
