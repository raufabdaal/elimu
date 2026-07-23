-- Elimu real parent-child linking
-- Run this in Supabase SQL Editor after schema/auth fixes.
-- Safe to run more than once.

create or replace function public.link_parent_to_student_by_code(code_input text)
returns table (
  student_profile_id uuid,
  student_name text,
  student_class_level text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  parent_id uuid;
  parent_role text;
  found_student_profile_id uuid;
  found_student_name text;
  found_student_class text;
begin
  parent_id := public.current_profile_id();

  if parent_id is null then
    raise exception 'No signed-in profile found';
  end if;

  select role into parent_role
  from public.profiles
  where id = parent_id;

  if parent_role <> 'parent' then
    raise exception 'Only parent accounts can link to a student';
  end if;

  select s.profile_id, p.full_name, s.class_level
    into found_student_profile_id, found_student_name, found_student_class
  from public.students s
  join public.profiles p on p.id = s.profile_id
  where s.pairing_code = trim(code_input)
  limit 1;

  if found_student_profile_id is null then
    raise exception 'Pairing code not found';
  end if;

  insert into public.parent_student_links (parent_profile_id, student_profile_id, status)
  values (parent_id, found_student_profile_id, 'active')
  on conflict (parent_profile_id, student_profile_id) do update
    set status = 'active';

  student_profile_id := found_student_profile_id;
  student_name := found_student_name;
  student_class_level := found_student_class;
  return next;
end;
$$;

grant execute on function public.link_parent_to_student_by_code(text) to authenticated;
