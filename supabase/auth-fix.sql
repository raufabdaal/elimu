-- Elimu Auth/RLS repair patch
-- Run this in Supabase SQL Editor if sign-in succeeds but profile setup fails.
-- Safe to run more than once.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. Automatically create profile + trial subscription for new auth users
-- ------------------------------------------------------------

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_role text;
  raw_class text;
  raw_name text;
  new_profile_id uuid;
begin
  raw_role := coalesce(new.raw_user_meta_data ->> 'role', 'learner');
  if raw_role not in ('learner', 'parent') then
    raw_role := 'learner';
  end if;

  raw_class := coalesce(new.raw_user_meta_data ->> 'class_level', 'p5');
  if raw_class not in ('p4', 'p5', 'p6', 'p7') then
    raw_class := 'p5';
  end if;

  raw_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    split_part(new.email, '@', 1),
    'Student'
  );

  insert into public.profiles (auth_user_id, role, full_name, class_level)
  values (new.id, raw_role, raw_name, raw_class)
  on conflict (auth_user_id) do update
    set role = excluded.role,
        full_name = excluded.full_name,
        class_level = excluded.class_level,
        updated_at = now()
  returning id into new_profile_id;

  insert into public.subscriptions (profile_id, plan, status)
  values (new_profile_id, 'trial', 'trialing')
  on conflict (profile_id) do nothing;

  if raw_role = 'learner' then
    insert into public.students (profile_id, class_level, pairing_code, pairing_code_expires_at)
    values (
      new_profile_id,
      raw_class,
      lpad(floor(random() * 1000000)::int::text, 6, '0'),
      null
    )
    on conflict (profile_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- Backfill profiles for users who already signed up before this trigger existed.
insert into public.profiles (auth_user_id, role, full_name, class_level)
select
  u.id,
  case when coalesce(u.raw_user_meta_data ->> 'role', 'learner') in ('learner', 'parent')
    then coalesce(u.raw_user_meta_data ->> 'role', 'learner')
    else 'learner'
  end as role,
  coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', split_part(u.email, '@', 1), 'Student') as full_name,
  case when coalesce(u.raw_user_meta_data ->> 'class_level', 'p5') in ('p4', 'p5', 'p6', 'p7')
    then coalesce(u.raw_user_meta_data ->> 'class_level', 'p5')
    else 'p5'
  end as class_level
from auth.users u
where not exists (
  select 1 from public.profiles p where p.auth_user_id = u.id
);

insert into public.subscriptions (profile_id, plan, status)
select p.id, 'trial', 'trialing'
from public.profiles p
where not exists (
  select 1 from public.subscriptions s where s.profile_id = p.id
);

insert into public.students (profile_id, class_level, pairing_code, pairing_code_expires_at)
select p.id, coalesce(p.class_level, 'p5'), lpad(floor(random() * 1000000)::int::text, 6, '0'), null
from public.profiles p
where p.role = 'learner'
  and not exists (
    select 1 from public.students s where s.profile_id = p.id
  );

-- ------------------------------------------------------------
-- 2. Replace RLS policies with simpler auth.uid()-based policies
-- ------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.parent_student_links enable row level security;
alter table public.progress_snapshots enable row level security;
alter table public.answer_events enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_transactions enable row level security;

-- Drop old policies if present

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

drop policy if exists "events_select_student_or_parent" on public.answer_events;
drop policy if exists "events_insert_student" on public.answer_events;

drop policy if exists "subscriptions_owner_all" on public.subscriptions;
drop policy if exists "payments_owner_all" on public.payment_transactions;

-- Profiles
create policy "profiles_select_own_or_linked"
on public.profiles for select
to authenticated
using (
  auth_user_id = auth.uid()
  or exists (
    select 1
    from public.parent_student_links l
    join public.profiles parent_p on parent_p.id = l.parent_profile_id
    where parent_p.auth_user_id = auth.uid()
      and l.student_profile_id = profiles.id
      and l.status = 'active'
  )
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
  exists (select 1 from public.profiles p where p.id = students.profile_id and p.auth_user_id = auth.uid())
  or exists (
    select 1
    from public.parent_student_links l
    join public.profiles parent_p on parent_p.id = l.parent_profile_id
    where parent_p.auth_user_id = auth.uid()
      and l.student_profile_id = students.profile_id
      and l.status = 'active'
  )
);

create policy "students_insert_own"
on public.students for insert
to authenticated
with check (
  exists (select 1 from public.profiles p where p.id = students.profile_id and p.auth_user_id = auth.uid())
);

create policy "students_update_own"
on public.students for update
to authenticated
using (exists (select 1 from public.profiles p where p.id = students.profile_id and p.auth_user_id = auth.uid()))
with check (exists (select 1 from public.profiles p where p.id = students.profile_id and p.auth_user_id = auth.uid()));

-- Links
create policy "links_select_related"
on public.parent_student_links for select
to authenticated
using (
  exists (select 1 from public.profiles p where p.id = parent_student_links.parent_profile_id and p.auth_user_id = auth.uid())
  or exists (select 1 from public.profiles p where p.id = parent_student_links.student_profile_id and p.auth_user_id = auth.uid())
);

create policy "links_insert_parent"
on public.parent_student_links for insert
to authenticated
with check (
  exists (select 1 from public.profiles p where p.id = parent_student_links.parent_profile_id and p.auth_user_id = auth.uid())
);

create policy "links_update_parent"
on public.parent_student_links for update
to authenticated
using (exists (select 1 from public.profiles p where p.id = parent_student_links.parent_profile_id and p.auth_user_id = auth.uid()))
with check (exists (select 1 from public.profiles p where p.id = parent_student_links.parent_profile_id and p.auth_user_id = auth.uid()));

-- Snapshots
create policy "snapshots_select_student_or_parent"
on public.progress_snapshots for select
to authenticated
using (
  exists (select 1 from public.profiles p where p.id = progress_snapshots.student_profile_id and p.auth_user_id = auth.uid())
  or exists (
    select 1
    from public.parent_student_links l
    join public.profiles parent_p on parent_p.id = l.parent_profile_id
    where parent_p.auth_user_id = auth.uid()
      and l.student_profile_id = progress_snapshots.student_profile_id
      and l.status = 'active'
  )
);

create policy "snapshots_all_student"
on public.progress_snapshots for all
to authenticated
using (exists (select 1 from public.profiles p where p.id = progress_snapshots.student_profile_id and p.auth_user_id = auth.uid()))
with check (exists (select 1 from public.profiles p where p.id = progress_snapshots.student_profile_id and p.auth_user_id = auth.uid()));

-- Events
create policy "events_select_student_or_parent"
on public.answer_events for select
to authenticated
using (
  exists (select 1 from public.profiles p where p.id = answer_events.student_profile_id and p.auth_user_id = auth.uid())
  or exists (
    select 1
    from public.parent_student_links l
    join public.profiles parent_p on parent_p.id = l.parent_profile_id
    where parent_p.auth_user_id = auth.uid()
      and l.student_profile_id = answer_events.student_profile_id
      and l.status = 'active'
  )
);

create policy "events_insert_student"
on public.answer_events for insert
to authenticated
with check (exists (select 1 from public.profiles p where p.id = answer_events.student_profile_id and p.auth_user_id = auth.uid()));

-- Subscriptions / payments
create policy "subscriptions_owner_all"
on public.subscriptions for all
to authenticated
using (exists (select 1 from public.profiles p where p.id = subscriptions.profile_id and p.auth_user_id = auth.uid()))
with check (exists (select 1 from public.profiles p where p.id = subscriptions.profile_id and p.auth_user_id = auth.uid()));

create policy "payments_owner_all"
on public.payment_transactions for all
to authenticated
using (exists (select 1 from public.profiles p where p.id = payment_transactions.profile_id and p.auth_user_id = auth.uid()))
with check (exists (select 1 from public.profiles p where p.id = payment_transactions.profile_id and p.auth_user_id = auth.uid()));
