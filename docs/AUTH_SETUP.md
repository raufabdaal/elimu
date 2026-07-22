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
4. User returns to `/auth/` and signs in.

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
https://your-vercel-domain.vercel.app/auth/
```

If you use a custom domain later, add:

```text
https://your-custom-domain.com/auth/
```

## Google provider setup

In Supabase:

```text
Authentication → Providers → Google
```

Make sure Google is enabled.

Google OAuth may require Google Cloud Console credentials. Supabase will show the callback URL you need to add inside Google Cloud Console.

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

## Current limitations

- Parent-child pairing is still local/demo in UI. The database is ready, but the real pairing flow is the next implementation step.
- Cloud sync helper exists, but background sync queue is not yet wired into every answer event.
- Subscription/trial database table exists, but UI gating is not yet implemented.
