-- DANGER: DEVELOPMENT / TEST RESET ONLY
-- This deletes ALL test accounts and app data in this Supabase project.
-- Use ONLY before real parents/students start using the app.
-- After running this, old test emails can be used again for fresh sign-up.

-- 1. Clear public app data first
truncate table
  public.payment_transactions,
  public.answer_events,
  public.progress_snapshots,
  public.parent_student_links,
  public.students,
  public.subscriptions,
  public.profiles
restart identity cascade;

-- 2. Delete Supabase Auth users
-- This should also remove auth identities/sessions through Supabase's auth schema constraints.
delete from auth.users;

-- 3. Verify cleanup
select 'profiles' as table_name, count(*) from public.profiles
union all select 'students', count(*) from public.students
union all select 'subscriptions', count(*) from public.subscriptions
union all select 'parent_student_links', count(*) from public.parent_student_links
union all select 'progress_snapshots', count(*) from public.progress_snapshots
union all select 'answer_events', count(*) from public.answer_events
union all select 'payment_transactions', count(*) from public.payment_transactions
union all select 'auth_users', count(*) from auth.users;
