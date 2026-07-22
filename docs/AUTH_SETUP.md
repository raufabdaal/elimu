# Elimu Auth Setup

Auth provider: Supabase free tier.

## Current implementation

The app now has:

- `/auth/` page
- Email sign up
- Email sign in
- Google sign in button
- Student/Parent role choice
- Student class choice
- Signed-in account status card
- Trial/subscription status display
- Sign out on this device
- Manual “Sync Progress Now” action
- Supabase profile creation
- Trial subscription row creation
- Student row creation for learner accounts
- Local progress snapshot sync helper
- Client bootstrap that quietly syncs signed-in users when online

## Supabase Email Auth

You already enabled email verification. That is fine for production-style testing.

Flow:

1. User creates account with email/password.
2. Supabase sends verification email.
3. User verifies email.
4. The app now requests email confirmation redirects back to `/auth/`.
5. User signs in after verification.

If an older confirmation link opens the website home page instead of `/auth/`, that is not fatal. After confirming, manually open `/auth/` and sign in.

## Supabase Google Auth redirect settings

In Supabase dashboard:

```text
Authentication → URL Configuration
```

Set Site URL to your deployed app URL, for example:

```text
https://your-vercel-domain.vercel.app
```

Add redirect URLs:

```text
http://localhost:3000/auth/
http://localhost:3000/auth/**
https://your-vercel-domain.vercel.app/auth/
https://your-vercel-domain.vercel.app/auth/**
```

If you use a custom domain later, add:

```text
https://your-custom-domain.com/auth/
https://your-custom-domain.com/auth/**
```

The wildcard versions are useful because Google/email redirects can return with query parameters.

## Google provider setup

In Supabase:

```text
Authentication → Providers → Google
```

Make sure Google is enabled and saved.

If Google sign-in returns:

```text
400 validation_failed unsupported provider Provider is not enabled
```

then Google is not fully enabled in Supabase yet. Usually this means one of these is missing:

1. The Google provider toggle is still off.
2. Google Client ID is missing.
3. Google Client Secret is missing.
4. The settings were changed but not saved.

Google OAuth usually requires Google Cloud Console credentials. Supabase will show the callback URL you need to add inside Google Cloud Console.

## Local env file

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_key
```

Never commit `.env.local`.

## Test checklist

1. Run local dev server:

```bash
npm run dev
```

2. Open:

```text
http://localhost:3000/auth/
```

3. Test student email sign-up.
4. Verify email.
5. Sign in.
6. Confirm redirect can continue to Home.
7. Test parent sign-up.
8. Test Google sign-in after redirect URLs are configured.

## If sign-in succeeds but profile setup fails

If the app says:

```text
Could not finish account setup
Authentication failed
row-level security
permission denied
```

run this repair patch in Supabase SQL Editor:

```text
supabase/auth-fix.sql
```

This patch:

- creates an automatic profile/subscription trigger for new auth users
- backfills profiles for existing auth users
- replaces RLS policies with simpler `auth.uid()`-based policies
- keeps parent-child security rules in place

After running it, return to `/auth/` and sign in again.

## Current limitations

- Parent-child pairing is still local/demo in UI. The database is ready, but the real pairing flow is the next implementation step.
- Cloud sync helper exists, but background sync queue is not yet wired into every answer event.
- Subscription/trial database table exists, but UI gating is not yet implemented.
