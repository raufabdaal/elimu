# Elimu Lessons Learned

This document records product, technical, and operational lessons learned during the hardening/auth/sync/payment phase.

## Product lessons

### 1. The market will not reward mediocre content

Content must be clean, age-appropriate, and trustworthy before monetization. Parents will not pay if they see wrong answers, intimidating wording, or inconsistent marking.

### 2. Parents are the payer, so parent UX must be serious

Parent dashboard should not feel like a child dashboard. It should answer:

- Is my child learning?
- Where is my child struggling?
- What should I do next?
- Can I trust this report?

### 3. Simplicity beats feature clutter

Screens that worked best were the clean question screens. We should keep extending that standard:

- fewer bars
- fewer labels
- subtle visual status
- clear action buttons
- no unnecessary menus

### 4. PWA/offline behavior must be local-first

For Uganda, unstable connectivity is expected. The app should never block learning just because sync fails. Local state must keep working offline.

### 5. Mobile money is the correct payment direction

For Uganda, MTN Mobile Money and Airtel Money matter more than Stripe. Stripe can be optional later, but the core system must be mobile-money-first.

## Content lessons

### 1. Hints must guide, not reveal

Old hints sometimes gave answers directly. We cleaned these. Future hint writing rule:

```text
Hint = thinking direction, not answer.
```

### 2. Options must test; explanations must teach

Correct options should not contain full reasoning. Keep options short. Put teaching in `explanation` and `deepDive`.

### 3. Multi-select needs partial credit

If a child selects 3 of 4 correct choices, marking everything wrong is unfair. Multi-select now gives partial marks and shows missing choices.

### 4. Bulk edits can corrupt data

Bulk transformations caused examples like:

- `A ∩ B` appearing in a geography answer
- `2, 4, 5, 3, 1` appearing as a river answer

We added `scripts/content-corruption-audit.mjs` to catch this class of issue.

### 5. Sensitive content must be factual but not graphic

Health, HIV/STI, child protection, violence, and colonial history content must be age-safe and trust-safe.

## Auth/account lessons

### 1. Cloud role must win over local state

A device can have stale localStorage. Once a user is signed in, Supabase profile role must control routing and experience.

### 2. Onboarding must not bypass auth

New-user onboarding now feeds into account creation instead of directly entering the app.

### 3. Google OAuth loses local context unless preserved

For Google signup, we save pending auth context locally before redirect:

- role
- class
- name
- mode

Then consume it when Google returns.

### 4. PWA sessions can feel confusing during testing

Installed PWAs and browsers can keep old localStorage/session data. During testing, always clear site data and reinstall PWA after major auth changes.

## Supabase/RLS lessons

### 1. RLS policies can recurse

The error:

```text
42P17 infinite recursion detected in policy for relation "profiles"
```

was caused by policies querying `profiles` from inside `profiles` policy logic. Fixed with security-definer helper functions.

### 2. Demo pairing codes break real accounts

The demo code `739104` caused a unique constraint collision in `students.pairing_code`. Real cloud accounts must generate unique pairing codes.

### 3. Use SQL patches rather than ad-hoc fixes

We now keep every Supabase fix as a file:

- `auth-fix.sql`
- `rls-recursion-fix.sql`
- `pairing-code-fix.sql`
- `parent-linking.sql`

This makes setup reproducible.

## Sync lessons

### 1. Parent dashboard needs real events, not only snapshots

Progress snapshots are useful, but parent insight improves when reading recent `answer_events`.

### 2. Use `local_event_id` for duplicate safety

Queued offline answer events use a unique local ID. Supabase upsert prevents duplicate uploads.

### 3. Student should see subtle sync status

A small cloud icon is enough:

- saved online
- offline
- answers waiting

No big sync menu is needed.

## Payment lessons

### 1. Do not run placeholder SQL

`PAYMENT_ID_HERE` and `PROFILE_ID_HERE` are placeholders. The manual activation SQL is now safer by commenting out sections that need replacements.

### 2. Manual activation is enough for pilots

Before MTN/Airtel API integration, the current flow is:

```text
parent requests activation → pending transaction → manual confirmation → manual subscription activation
```

### 3. Mobile money secrets must be server-side only

MTN/Airtel credentials should never be in frontend code. Use Supabase Edge Functions or serverless functions.

## Operational lessons

### 1. Document every phase

The project should always include:

- changelog
- handoff
- current context
- setup docs
- SQL scripts
- lessons learned
- file push checklist

### 2. Keep workspace clean

All project files belong inside `/home/user/elimu/`. No stray `/home/user/docs` or `/home/user/src` folders.

### 3. Always end with exact modified file list

This is mandatory so the human lead can push without guessing.
