# Supabase Setup for Elimu

This guide uses the free Supabase tier.

## 1. Add environment variables locally

Create a file named `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_or_anon_key
```

Do not commit `.env.local`.

The Supabase key you use in the frontend should be the public/anon/publishable key, not the service role secret.

## 2. Add environment variables in Vercel

In Vercel:

```text
Project → Settings → Environment Variables
```

Add:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Apply them to Production, Preview, and Development.

## 3. Run the database schema

In Supabase:

```text
Project → SQL Editor → New query
```

Copy the full contents of:

```text
supabase/schema.sql
```

Paste it into the SQL Editor and click Run.

This creates:

- profiles
- students
- parent_student_links
- progress_snapshots
- answer_events
- subscriptions
- payment_transactions

It also enables Row Level Security policies.

## 4. Auth settings

In Supabase:

```text
Authentication → Providers → Email
```

Recommended development setup:

- Enable Email provider.
- For easiest early testing, you can disable email confirmations temporarily.
- Before public launch, enable email confirmation again.

## 5. Local verification

After adding `.env.local`, run:

```bash
npm run build
```

The app is written so it still builds if Supabase env vars are missing, but auth features will only work after the keys are added.

## 6. Security reminder

Never expose or commit:

- Supabase service role key
- database password
- `.env.local`

Only the frontend public/anon/publishable key belongs in `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
