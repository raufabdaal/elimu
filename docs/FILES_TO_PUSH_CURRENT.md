# Files To Push — Current Working Tree

Generated from `git status --short` after the auth/sync/payment/documentation phase.

## Important note

Do not push:

- `node_modules/`
- `dist/` unless manually deploying static export outside Vercel
- `.env.local`

Do push source, docs, SQL, scripts, and `public/` PWA assets.

## Current modified tracked files

```text
M docs/CHANGELOG.md
M docs/HANDOFF.md
M package-lock.json
M package.json
M src/app/globals.css
M src/app/home/page.tsx
M src/app/layout.tsx
M src/app/module/page.tsx
M src/app/onboarding/page.tsx
M src/app/page.tsx
M src/app/parent/page.tsx
M src/app/practice/page.tsx
M src/app/subjects/page.tsx
M src/components/AppShell.tsx
M src/components/Celebration.tsx
M src/components/EncouragementToast.tsx
M src/components/EnergyBar.tsx
M src/components/Hearts.tsx
M src/components/PhoneShell.tsx
M src/components/QuestionRenderer.tsx
M src/components/Streak.tsx
M src/components/SubjectIcons.tsx
M src/components/TabBar.tsx
M src/components/question-types/Matching.tsx
M src/components/question-types/MultiSelect.tsx
M src/components/question-types/MultipleChoice.tsx
M src/components/question-types/Ordering.tsx
M src/components/question-types/ShortAnswer.tsx
M src/components/question-types/TrueFalse.tsx
M src/lib/data.ts
M src/lib/scoring.ts
M src/lib/sounds.ts
M src/lib/store.ts
M src/lib/types.ts
```

## Current untracked files/directories to add

```text
.env.example
docs/AUTH_SETUP.md
docs/CLEAN_TEST_RESET.md
docs/CONTENT_AUDIT_REPORT.md
docs/CONTENT_CORRUPTION_AUDIT.md
docs/CURRENT_CONTEXT.md
docs/HARDENING_RELEASE_REPORT.md
docs/LESSONS_LEARNED.md
docs/MANUAL_ACTIVATION_WORKFLOW.md
docs/MOBILE_MONEY_PLAN.md
docs/MOBILE_MONEY_SETUP_CHECKLIST.md
docs/SUBSCRIPTION_GATING.md
docs/SUPABASE_SETUP.md
docs/content-audit-findings.csv
docs/curriculum/
public/
scripts/
src/app/auth/
src/app/pricing/
src/components/AccountBootstrap.tsx
src/components/AuthGate.tsx
src/components/HeaderStats.tsx
src/components/PWAControls.tsx
src/components/SubscriptionGate.tsx
src/components/SubscriptionNotice.tsx
src/components/SyncStatus.tsx
src/lib/auth.ts
src/lib/cloud-profile.ts
src/lib/payments.ts
src/lib/subscription.ts
src/lib/supabase.ts
src/lib/sync.ts
supabase/
```

## Recommended git commands

Review first:

```bash
git status --short
```

Add all source/docs/public/sql/script changes:

```bash
git add .env.example docs public scripts supabase package.json package-lock.json src
```

Check what will be committed:

```bash
git status --short
```

Commit:

```bash
git commit -m "Harden content and add auth sync subscription payment foundations"
```

Push:

```bash
git push
```

## After pushing

Set Vercel env vars:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Do not commit `.env.local`.
