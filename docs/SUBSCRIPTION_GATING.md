# Elimu Subscription / Trial Gating

This is the first free-tier subscription gate.

## Current behavior

The app reads the signed-in user's Supabase `subscriptions` row.

Access is allowed when:

- `status = trialing` and `trial_ends_at` is still in the future
- `status = active`
- `status = manual_comp`

Access is blocked when:

- trial has ended
- status is `expired`
- status is `cancelled`
- status is `past_due`

## User-facing behavior

If a trial is close to ending, Home and Parent dashboard show a small reminder:

```text
Free trial · X days left
```

If access has ended, the app shows a clean activation screen instead of the learning app.

The activation screen currently explains that MTN/Airtel mobile money activation is next.

## Manual pilot activation

Before mobile money is integrated, pilot users can be activated manually in Supabase:

```sql
update public.subscriptions
set status = 'manual_comp', plan = 'manual_comp'
where profile_id = 'PROFILE_ID_HERE';
```

or for a paid/manual family activation:

```sql
update public.subscriptions
set status = 'active', plan = 'family', current_period_ends_at = now() + interval '30 days'
where profile_id = 'PROFILE_ID_HERE';
```

## Mobile money next

When MTN/Airtel integration is added, payment success will update the same `subscriptions` row.
No Stripe-specific logic is required.
