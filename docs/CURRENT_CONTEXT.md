# Elimu Current Context — 2026-07-24

This document is the current source-of-truth context for picking up the project without prior conversation history.

## Product goal

Elimu is a Uganda-focused Primary P4–P7 edtech PWA for learners and parents. It provides NCDC/UNEB PLE-aligned interactive question banks across:

- Mathematics
- Social Studies
- Integrated Science
- English Language

The product must feel:

- clean
- simple
- child-friendly
- parent-trustworthy
- offline-capable
- mobile-money-ready for Uganda

## Current technical status

### Build status

Latest known verification:

```bash
npm install
node scripts/content-audit.mjs
node scripts/content-corruption-audit.mjs
./node_modules/.bin/tsc --noEmit
npm run build
```

Known current result:

```text
TypeScript: passing
Production build: passing
Static export: passing
Content corruption audit: 0 findings
Content hardening audit: 568 medium/low findings, 0 critical, 0 high
```

### Main stack

- Next.js 14 static export
- React
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres
- PWA service worker in `public/sw.js`
- Offline-first localStorage state with Supabase sync

## Current app routes

```text
/
/auth/
/home/
/subjects/
/module/
/practice/
/parent/
/pricing/
/onboarding/
```

## PWA status

PWA is implemented with:

- `public/manifest.json`
- `public/sw.js`
- `public/favicon.ico`
- `public/favicon.png`
- `public/icon-192.png`
- `public/icon-512.png`
- `public/apple-touch-icon.png`
- `src/components/PWAControls.tsx`

The app is installable and supports offline app-shell behavior. Offline learning remains local-first; cloud sync happens when online.

## Auth/account status

Implemented:

- Supabase email auth
- Google auth flow support
- clean `/auth/` landing choice:
  - `I am new`
  - `I already have an account`
- onboarding-to-signup flow
- protected app routes via `AuthGate`
- role-based routing:
  - parent accounts redirect to `/parent/`
  - learner accounts redirect to `/home/`
- sign out/sign in path
- signed-out flag to reduce PWA/offline weirdness

Important auth files:

- `src/app/auth/page.tsx`
- `src/components/AuthGate.tsx`
- `src/components/AccountBootstrap.tsx`
- `src/lib/auth.ts`
- `src/lib/cloud-profile.ts`
- `src/lib/supabase.ts`

## Parent-child linking status

Implemented:

- student cloud pairing code
- pairing code visible in student hamburger and account page
- parent can enter code
- Supabase RPC creates `parent_student_links`
- parent dashboard loads linked student's profile, snapshot, and recent answer events

Required SQL:

- `supabase/parent-linking.sql`

Important app files:

- `src/components/HeaderStats.tsx`
- `src/app/onboarding/page.tsx`
- `src/app/parent/page.tsx`
- `src/lib/cloud-profile.ts`

## Progress sync status

Implemented:

- local answer event queue
- upload queued answer events to Supabase
- upload progress snapshots
- app-wide online sync bootstrap
- parent dashboard reads recent answer events
- parent dashboard shows recent accuracy/recent questions/last updated
- student header shows subtle sync status

Important files:

- `src/lib/sync.ts`
- `src/components/SyncStatus.tsx`
- `src/components/AccountBootstrap.tsx`
- `src/app/module/page.tsx`
- `src/app/practice/page.tsx`
- `src/app/parent/page.tsx`

## Subscription/payment status

Implemented:

- subscription/trial access helper
- subscription gate
- trial reminder notice
- `/pricing/` page
- UGX pricing plans
- MTN/Airtel selector
- phone-number capture
- pending activation request stored in `payment_transactions`
- manual activation snippets for pilots

Not yet implemented:

- live MTN MoMo API calls
- live Airtel Money API calls
- automatic webhook/callback activation

Important files:

- `src/lib/subscription.ts`
- `src/lib/payments.ts`
- `src/components/SubscriptionGate.tsx`
- `src/components/SubscriptionNotice.tsx`
- `src/app/pricing/page.tsx`
- `docs/MANUAL_ACTIVATION_WORKFLOW.md`
- `docs/MOBILE_MONEY_PLAN.md`
- `docs/MOBILE_MONEY_SETUP_CHECKLIST.md`
- `supabase/manual-activation-snippets.sql`

## Supabase SQL files

Run these in Supabase as needed:

- `supabase/schema.sql` — base tables and policies
- `supabase/auth-fix.sql` — auth profile trigger and RLS simplification
- `supabase/rls-recursion-fix.sql` — fixes profile policy recursion `42P17`
- `supabase/pairing-code-fix.sql` — fixes duplicate pairing-code collisions
- `supabase/parent-linking.sql` — real parent-child linking RPC
- `supabase/reset-test-progress.sql` — clears progress snapshots/events only
- `supabase/dev-delete-all-test-accounts.sql` — deletes all test accounts/data before real users
- `supabase/manual-activation-snippets.sql` — manual payment activation helper snippets

## Current content quality status

Major hardening completed:

- duplicate IDs fixed
- broken ordering answer keys fixed
- answer-revealing hints removed
- weird notation largely removed
- answer leakage reduced
- P4/P5/P6/P7 readability passes completed
- sensitive content softened
- corruption audit added

Latest audit:

```text
content-audit findings: 568 total; 0 critical; 0 high
content-corruption-audit findings: 0
```

Important scripts:

- `scripts/content-audit.mjs`
- `scripts/content-corruption-audit.mjs`
- `scripts/fix-critical-content.mjs`
- `scripts/fix-high-risk-content-pass1.mjs`
- `scripts/fix-answer-leakage-pass1.mjs`
- `scripts/fix-manual-high-risk-pass.mjs`
- `scripts/fix-long-options-pass.mjs`
- `scripts/fix-p4-readability-pass.mjs`
- `scripts/fix-p5-readability-pass.mjs`
- `scripts/fix-p6-readability-pass.mjs`
- `scripts/fix-p7-readability-pass.mjs`
- `scripts/fix-sensitive-trust-pass.mjs`

## Current known issues / next recommended work

1. Retest Google new-user signup after latest context-preservation changes.
2. Retest parent vs student routing after role hardening.
3. Test subscription gate with trial ending SQL.
4. Test payment pending request + manual activation with real `payment_id`.
5. Decide whether to build a small internal admin pending-request UI or proceed directly to MTN sandbox.
6. Begin MTN MoMo sandbox integration via Supabase Edge Functions.
7. Then begin Airtel Money sandbox integration.

## Workspace integrity

All project work should live inside:

```text
/home/user/elimu/
```

A stray `/home/user/docs/` folder was found and its curriculum files were copied into `/home/user/elimu/docs/curriculum/`, then the stray folder was removed. Current top-level workspace contains only:

```text
/home/user/elimu/
```

plus environment/system folders such as `.config`.
