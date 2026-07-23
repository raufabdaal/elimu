# Clean Test Reset Guide

Use this only while Elimu is still in testing and before real parents/students use the app.

## Why reset?

During early auth/payment/sync testing, many accounts may be created with mixed roles, old local storage, old demo progress, old pairing codes, and test payment requests.

A clean reset lets us test the real flow from zero.

## Part A — Reset Supabase test accounts

In Supabase:

```text
Project → SQL Editor → New query
```

Open and copy:

```text
supabase/dev-delete-all-test-accounts.sql
```

Paste it into SQL Editor and run it.

This deletes:

- auth users
- profiles
- students
- parent-child links
- progress snapshots
- answer events
- payment transactions
- subscriptions

After this, you can reuse your test email addresses.

## Part B — Clear app data on your devices

This is important because the installed PWA and browser can keep old localStorage/session data.

### Chrome desktop

1. Open the app.
2. Click the padlock/settings icon near the URL.
3. Go to Site settings.
4. Click Clear data.
5. Reload the app.

Alternative:

```text
Chrome DevTools → Application → Storage → Clear site data
```

### Android Chrome / PWA

1. Open Android Settings.
2. Go to Apps.
3. Find Chrome or the installed Elimu PWA.
4. Storage.
5. Clear storage / Clear site data.

If the PWA is installed, it can help to uninstall and reinstall it after the reset.

### iPhone Safari / PWA

1. Remove the installed Elimu icon from Home Screen.
2. Go to Settings → Safari → Advanced → Website Data.
3. Find the app domain and delete it.
4. Reinstall the PWA from Safari.

## Part C — Fresh test flow

After both Supabase and device data are clear:

1. Open `/auth/`.
2. Tap `I am new`.
3. Create one student account.
4. Confirm email if required.
5. Sign in.
6. Confirm student starts with zero progress.
7. Open hamburger and copy Parent Pairing Code.
8. Use another browser/device or sign out.
9. Create one parent account.
10. Pair with the student's code.
11. Answer a few student questions.
12. Refresh parent dashboard and check recent questions/accuracy.
13. Visit `/pricing/` and create one pending activation request.
14. Use `supabase/manual-activation-snippets.sql` Section 1 to view pending requests.

## Do not run reset after real users exist

Once real users are using the app, never run this reset script on production Supabase.
