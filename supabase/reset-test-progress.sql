-- Elimu early-testing progress reset
-- Use ONLY before real learners start using the app.
-- This clears old demo/local progress snapshots that may have synced during auth testing.

truncate table public.answer_events restart identity cascade;
truncate table public.progress_snapshots restart identity cascade;

-- Keep accounts, profiles, students, pairing codes, and subscriptions intact.
-- After this, the app will initialize each learner with fresh zero progress on next sign-in.
