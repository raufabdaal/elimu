-- Elimu pairing code collision fix
-- Run this in Supabase SQL Editor if you see:
-- duplicate key value violates unique constraint "students_pairing_code_key"
-- Safe to run more than once.

-- Creates a unique 6-digit pairing code generator.
create or replace function public.generate_unique_pairing_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  candidate text;
  attempts integer := 0;
begin
  loop
    candidate := lpad(floor(random() * 1000000)::int::text, 6, '0');
    exit when not exists (select 1 from public.students where pairing_code = candidate);
    attempts := attempts + 1;
    if attempts > 25 then
      raise exception 'Could not generate unique pairing code after 25 attempts';
    end if;
  end loop;
  return candidate;
end;
$$;

-- Replace the auth-user trigger so it uses the unique generator.
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
      public.generate_unique_pairing_code(),
      null
    )
    on conflict (profile_id) do update
      set class_level = excluded.class_level,
          updated_at = now();
  end if;

  return new;
end;
$$;

-- Backfill missing student rows for learner profiles without causing code collisions.
insert into public.students (profile_id, class_level, pairing_code, pairing_code_expires_at)
select p.id, coalesce(p.class_level, 'p5'), public.generate_unique_pairing_code(), null
from public.profiles p
where p.role = 'learner'
  and not exists (
    select 1 from public.students s where s.profile_id = p.id
  );

-- Optional safety: if the old demo code 739104 exists, keep it for that one row only.
-- Future accounts will no longer reuse the local demo code.
