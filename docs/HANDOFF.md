# ELIMU Implementation Handoff

## Mandatory agent/developer rule

Every time files are modified, the response must end with an exact modified file list. The human lead should never have to guess what to copy, commit, or push.

## Workspace rule

All project files must live inside:

```text
/home/user/elimu/
```

Do not create project files outside this folder.

A stray `/home/user/docs/` folder was found during documentation consolidation. Its curriculum files were copied into `/home/user/elimu/docs/curriculum/`, then the stray folder was removed.

## Current status — 2026-07-24

Elimu is now a hardened PWA with:

- P4–P7 question bank
- content hardening and corruption audit tools
- Supabase auth
- clean new/existing account flow
- learner/parent role routing
- parent-child pairing through Supabase codes
- offline-first answer event queue
- cloud progress snapshots
- parent dashboard reading linked learner data
- trial/subscription gate
- UGX pricing page
- manual mobile money activation workflow
- MTN/Airtel setup checklist

Latest known verification:

```bash
npm install
node scripts/content-audit.mjs
node scripts/content-corruption-audit.mjs
./node_modules/.bin/tsc --noEmit
npm run build
```

Known result:

```text
TypeScript: passing
Production build: passing
Static export: passing
Content audit: 568 medium/low findings, 0 critical, 0 high
Content corruption audit: 0 findings
```

## Major phases completed

### 1. PWA and mobile refinement

Implemented:

- service worker
- manifest
- app icons/favicons
- install prompt/offline indicator
- mobile screen fit fixes
- module route offline cache support
- PWA starts at `/home/`

Key files:

- `public/sw.js`
- `public/manifest.json`
- `src/components/PWAControls.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`

### 2. Student UX cleanup

Implemented:

- student now lands on Home
- module question screen simplified
- no step/progress clutter in module header
- topic cards simplified
- answer guidance cues
- exit confirmation in module/practice
- multi-select partial credit

Key files:

- `src/app/home/page.tsx`
- `src/app/module/page.tsx`
- `src/app/practice/page.tsx`
- `src/app/subjects/page.tsx`
- `src/lib/scoring.ts`

### 3. Parent UX polish

Implemented:

- parent dashboard simplified and made payer-focused
- Needs Support
- Suggested Parent Action
- Subject Progress
- Recent Questions / Recent Accuracy
- Last Updated
- Shareable report card
- parent menu role-aware

Key file:

- `src/app/parent/page.tsx`

### 4. Content hardening

Implemented:

- duplicate question ID cleanup
- broken ordering key cleanup
- answer-revealing hint cleanup
- notation cleanup
- answer leakage cleanup
- P4/P5/P6/P7 readability passes
- sensitive-content trust review
- corruption audit script

Current audit status:

```text
content-audit: 568 findings, 0 critical, 0 high
content-corruption-audit: 0 findings
```

Key files:

- `src/lib/data.ts`
- `scripts/content-audit.mjs`
- `scripts/content-corruption-audit.mjs`
- `docs/CONTENT_AUDIT_REPORT.md`
- `docs/CONTENT_CORRUPTION_AUDIT.md`

### 5. Supabase auth/account foundation

Implemented:

- Supabase client
- auth helpers
- `/auth/` page
- clean landing choice:
  - I am new
  - I already have an account
- onboarding flows into signup
- email/password auth
- Google OAuth context preservation
- sign out
- signed-out flag for PWA/offline consistency
- AuthGate route protection
- role routing hardening

Key files:

- `src/app/auth/page.tsx`
- `src/components/AuthGate.tsx`
- `src/components/AccountBootstrap.tsx`
- `src/lib/auth.ts`
- `src/lib/cloud-profile.ts`
- `src/lib/supabase.ts`

### 6. Supabase SQL and fixes

SQL files now exist for reproducible setup and repairs:

- `supabase/schema.sql`
- `supabase/auth-fix.sql`
- `supabase/rls-recursion-fix.sql`
- `supabase/pairing-code-fix.sql`
- `supabase/parent-linking.sql`
- `supabase/reset-test-progress.sql`
- `supabase/dev-delete-all-test-accounts.sql`
- `supabase/manual-activation-snippets.sql`

Important learned errors:

- `42P17 infinite recursion detected in policy for relation "profiles"` → run `rls-recursion-fix.sql`
- duplicate `students_pairing_code_key` → run `pairing-code-fix.sql`
- `PAYMENT_ID_HERE` UUID error → do not run placeholder SQL; use safe commented manual snippets

### 7. Parent-child linking

Implemented:

- learner gets cloud pairing code
- code visible in Account page and hamburger
- parent enters code
- `link_parent_to_student_by_code` RPC creates link
- parent dashboard reads linked child profile/snapshot/events

Key files:

- `supabase/parent-linking.sql`
- `src/lib/cloud-profile.ts`
- `src/app/onboarding/page.tsx`
- `src/app/parent/page.tsx`
- `src/components/HeaderStats.tsx`

### 8. Sync foundation

Implemented:

- local answer event queue
- offline-safe queued events
- event upload to `answer_events`
- progress snapshot upload to `progress_snapshots`
- subtle sync status icon in student header
- parent dashboard uses recent answer events

Key files:

- `src/lib/sync.ts`
- `src/components/SyncStatus.tsx`
- `src/components/AccountBootstrap.tsx`
- `src/app/module/page.tsx`
- `src/app/practice/page.tsx`
- `src/app/parent/page.tsx`

### 9. Trial/subscription/payment foundation

Implemented:

- subscription access helper
- subscription gate
- trial reminder notice
- pricing page
- UGX family plans
- MTN/Airtel selector
- pending activation request creation
- manual activation workflow
- MTN/Airtel setup checklist

Key files:

- `src/lib/subscription.ts`
- `src/lib/payments.ts`
- `src/components/SubscriptionGate.tsx`
- `src/components/SubscriptionNotice.tsx`
- `src/app/pricing/page.tsx`
- `docs/SUBSCRIPTION_GATING.md`
- `docs/MANUAL_ACTIVATION_WORKFLOW.md`
- `docs/MOBILE_MONEY_PLAN.md`
- `docs/MOBILE_MONEY_SETUP_CHECKLIST.md`
- `supabase/manual-activation-snippets.sql`

## Operational setup checklist

### Supabase required env vars

Frontend env vars:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Do not expose service-role key.

### Future mobile money server env vars

Server-side only:

```text
MTN_MOMO_ENVIRONMENT
MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY
MTN_MOMO_API_USER
MTN_MOMO_API_KEY
MTN_MOMO_CALLBACK_URL

AIRTEL_MONEY_ENVIRONMENT
AIRTEL_MONEY_CLIENT_ID
AIRTEL_MONEY_CLIENT_SECRET
AIRTEL_MONEY_COUNTRY
AIRTEL_MONEY_CURRENCY
AIRTEL_MONEY_CALLBACK_URL
```

## Current known limitations

1. Live MTN/Airtel API collection is not implemented yet.
2. Manual activation is currently used for pilot payments.
3. Google OAuth should be retested after context preservation changes.
4. Parent dashboard is linked and event-aware, but deeper analytics can improve later.
5. Remaining content audit findings are medium/low only and can be refined gradually.

## Recommended next work

1. Retest clean fresh flow after clearing old PWA/browser data:
   - one student
   - one parent
   - pairing
   - answer events
   - parent dashboard
   - pricing request
2. Build a small internal pending activation admin view OR continue with SQL manual workflow.
3. Begin MTN MoMo sandbox via Supabase Edge Functions.
4. Begin Airtel Money sandbox.
5. Add production mobile money callbacks and activation automation.

## Where to read next

- `docs/CURRENT_CONTEXT.md`
- `docs/LESSONS_LEARNED.md`
- `docs/FILES_TO_PUSH_CURRENT.md`
- `docs/AUTH_SETUP.md`
- `docs/SUPABASE_SETUP.md`
- `docs/CLEAN_TEST_RESET.md`
- `docs/MANUAL_ACTIVATION_WORKFLOW.md`
- `docs/MOBILE_MONEY_SETUP_CHECKLIST.md`
