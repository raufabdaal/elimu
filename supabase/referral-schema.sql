-- Elimu Teacher / Referral Program Schema
-- SQL action: RUN FULL FILE
-- Safe to run more than once. Does not delete existing data.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------

create table if not exists public.referrers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  display_name text not null,
  phone_number text,
  referral_code text not null unique,
  status text not null default 'active' check (status in ('active', 'paused', 'blocked')),
  commission_monthly_ugx integer not null default 8000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.referrers(id) on delete cascade,
  parent_profile_id uuid references public.profiles(id) on delete set null,
  student_profile_id uuid references public.profiles(id) on delete set null,
  source_code text not null,
  status text not null default 'trialing' check (status in ('trialing', 'paid', 'inactive', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (referrer_id, parent_profile_id, student_profile_id)
);

create table if not exists public.commission_ledger (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.referrers(id) on delete cascade,
  payment_transaction_id uuid not null unique references public.payment_transactions(id) on delete cascade,
  parent_profile_id uuid references public.profiles(id) on delete set null,
  student_profile_id uuid references public.profiles(id) on delete set null,
  amount_ugx integer not null check (amount_ugx >= 0),
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'cancelled')),
  earned_at timestamptz not null default now(),
  payout_month text not null default to_char(now(), 'YYYY-MM'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commission_payouts (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.referrers(id) on delete cascade,
  amount_ugx integer not null check (amount_ugx >= 0),
  phone_number text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at triggers

drop trigger if exists touch_referrers_updated_at on public.referrers;
create trigger touch_referrers_updated_at
before update on public.referrers
for each row execute function public.touch_updated_at();

drop trigger if exists touch_referrals_updated_at on public.referrals;
create trigger touch_referrals_updated_at
before update on public.referrals
for each row execute function public.touch_updated_at();

drop trigger if exists touch_commission_ledger_updated_at on public.commission_ledger;
create trigger touch_commission_ledger_updated_at
before update on public.commission_ledger
for each row execute function public.touch_updated_at();

drop trigger if exists touch_commission_payouts_updated_at on public.commission_payouts;
create trigger touch_commission_payouts_updated_at
before update on public.commission_payouts
for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- Helper functions
-- ------------------------------------------------------------

create or replace function public.make_referral_code(name_input text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  base text;
  candidate text;
  suffix text;
  attempts integer := 0;
begin
  base := upper(regexp_replace(coalesce(name_input, 'TEACHER'), '[^A-Za-z0-9]+', '', 'g'));
  if length(base) < 3 then
    base := 'ELIMU';
  end if;
  base := substring(base from 1 for 8);

  loop
    suffix := upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 4));
    candidate := 'T-' || base || '-' || suffix;
    exit when not exists (select 1 from public.referrers where referral_code = candidate);
    attempts := attempts + 1;
    if attempts > 25 then
      raise exception 'Could not generate unique referral code';
    end if;
  end loop;

  return candidate;
end;
$$;

create or replace function public.create_or_get_referrer(display_name_input text, phone_input text default null)
returns table (
  id uuid,
  profile_id uuid,
  display_name text,
  phone_number text,
  referral_code text,
  status text,
  commission_monthly_ugx integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_id uuid;
  existing_id uuid;
begin
  current_id := public.current_profile_id();
  if current_id is null then
    raise exception 'No signed-in profile found';
  end if;

  select r.id into existing_id
  from public.referrers r
  where r.profile_id = current_id
  limit 1;

  if existing_id is null then
    insert into public.referrers (profile_id, display_name, phone_number, referral_code)
    values (
      current_id,
      coalesce(nullif(trim(display_name_input), ''), 'Teacher Partner'),
      nullif(trim(coalesce(phone_input, '')), ''),
      public.make_referral_code(display_name_input)
    );
  else
    update public.referrers r
    set
      display_name = coalesce(nullif(trim(display_name_input), ''), r.display_name),
      phone_number = coalesce(nullif(trim(coalesce(phone_input, '')), ''), r.phone_number),
      updated_at = now()
    where r.id = existing_id;
  end if;

  return query
  select r.id, r.profile_id, r.display_name, r.phone_number, r.referral_code, r.status, r.commission_monthly_ugx
  from public.referrers r
  where r.profile_id = current_id;
end;
$$;

grant execute on function public.create_or_get_referrer(text, text) to authenticated;

create or replace function public.get_referrer_dashboard()
returns table (
  payment_id uuid,
  created_at timestamptz,
  provider text,
  amount_ugx integer,
  payment_status text,
  external_reference text,
  plan_id text,
  plan_name text,
  parent_name text,
  parent_profile_id uuid,
  student_name text,
  student_profile_id uuid,
  commission_amount_ugx integer,
  commission_status text,
  payout_month text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_id uuid;
  ref_id uuid;
  ref_code text;
begin
  current_id := public.current_profile_id();
  if current_id is null then
    raise exception 'No signed-in profile found';
  end if;

  select r.id, r.referral_code into ref_id, ref_code
  from public.referrers r
  where r.profile_id = current_id
    and r.status = 'active'
  limit 1;

  if ref_id is null then
    return;
  end if;

  return query
  select
    pt.id as payment_id,
    pt.created_at,
    pt.provider,
    pt.amount_ugx,
    pt.status as payment_status,
    pt.external_reference,
    pt.raw_payload ->> 'plan_id' as plan_id,
    pt.raw_payload ->> 'plan_name' as plan_name,
    parent_p.full_name as parent_name,
    parent_p.id as parent_profile_id,
    student_p.full_name as student_name,
    student_p.id as student_profile_id,
    cl.amount_ugx as commission_amount_ugx,
    cl.status as commission_status,
    cl.payout_month
  from public.payment_transactions pt
  join public.profiles parent_p on parent_p.id = pt.profile_id
  left join public.parent_student_links link on link.parent_profile_id = parent_p.id and link.status = 'active'
  left join public.profiles student_p on student_p.id = link.student_profile_id
  left join public.commission_ledger cl on cl.payment_transaction_id = pt.id
  where upper(pt.raw_payload ->> 'teacher_referral_code') = upper(ref_code)
  order by pt.created_at desc;
end;
$$;

grant execute on function public.get_referrer_dashboard() to authenticated;

-- ------------------------------------------------------------
-- RLS policies
-- ------------------------------------------------------------

alter table public.referrers enable row level security;
alter table public.referrals enable row level security;
alter table public.commission_ledger enable row level security;
alter table public.commission_payouts enable row level security;

drop policy if exists "referrers_select_own" on public.referrers;
drop policy if exists "referrers_insert_own" on public.referrers;
drop policy if exists "referrers_update_own" on public.referrers;

create policy "referrers_select_own"
on public.referrers for select
to authenticated
using (profile_id = public.current_profile_id());

create policy "referrers_insert_own"
on public.referrers for insert
to authenticated
with check (profile_id = public.current_profile_id());

create policy "referrers_update_own"
on public.referrers for update
to authenticated
using (profile_id = public.current_profile_id())
with check (profile_id = public.current_profile_id());

drop policy if exists "referrals_select_referrer" on public.referrals;
create policy "referrals_select_referrer"
on public.referrals for select
to authenticated
using (
  exists (
    select 1 from public.referrers r
    where r.id = referrals.referrer_id
      and r.profile_id = public.current_profile_id()
  )
);

drop policy if exists "commission_ledger_select_referrer" on public.commission_ledger;
create policy "commission_ledger_select_referrer"
on public.commission_ledger for select
to authenticated
using (
  exists (
    select 1 from public.referrers r
    where r.id = commission_ledger.referrer_id
      and r.profile_id = public.current_profile_id()
  )
);

drop policy if exists "commission_payouts_select_referrer" on public.commission_payouts;
create policy "commission_payouts_select_referrer"
on public.commission_payouts for select
to authenticated
using (
  exists (
    select 1 from public.referrers r
    where r.id = commission_payouts.referrer_id
      and r.profile_id = public.current_profile_id()
  )
);
