# MTN MoMo + Airtel Money Setup Checklist

This is the setup checklist before we write live mobile money code.

Elimu is mobile-money-first for Uganda. Stripe is not part of the primary launch path.

## Current payment stage

Right now the app supports:

- UGX pricing page
- MTN / Airtel provider choice
- phone number collection
- pending activation request saved in Supabase
- manual activation after payment confirmation

The app does not yet trigger a real MTN/Airtel payment prompt.

## What we need before live integration

### Business / operations details

Prepare:

- business name to appear on payment prompts
- settlement phone/account details
- support phone number
- refund/contact process
- pricing decisions in UGX
- terms for monthly and term access

### Technical details

Prepare:

- production app URL
- webhook/callback URL
- backend function environment
- secret storage in Supabase/Vercel
- database update rules for successful/failed payments

## Recommended free-first order

1. Keep manual activation for pilot parents.
2. Apply for or set up MTN MoMo sandbox credentials.
3. Apply for or set up Airtel Money sandbox credentials.
4. Build server-side payment initiation functions.
5. Build webhook/callback handlers.
6. Test with sandbox/low-value internal payments.
7. Request/complete production approval.
8. Switch provider environment from sandbox to production.

## MTN MoMo integration checklist

### What we need

- Collections subscription key
- API user
- API key/API secret
- target environment: sandbox first, then Uganda production environment later
- callback host / webhook URL

### Expected server-side flow

1. App creates a pending `payment_transactions` row.
2. Server function requests an MTN MoMo collection.
3. Parent approves the prompt on their phone.
4. Server function checks payment status or receives callback.
5. If successful, update:
   - `payment_transactions.status = successful`
   - `subscriptions.status = active`
   - `subscriptions.current_period_ends_at = now() + interval '30 days'` or term period

### MTN environment variables later

These must never be exposed in frontend code.

```env
MTN_MOMO_ENVIRONMENT=sandbox
MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY=
MTN_MOMO_API_USER=
MTN_MOMO_API_KEY=
MTN_MOMO_CALLBACK_URL=
```

## Airtel Money integration checklist

### What we need

- Airtel client ID
- Airtel client secret
- API base URL
- country code: UG
- currency: UGX
- callback/webhook URL if supported/required
- production merchant approval

### Expected server-side flow

1. App creates a pending `payment_transactions` row.
2. Server function requests Airtel Money collection.
3. Parent approves the prompt on their phone.
4. Server checks transaction status or receives callback.
5. If successful, update payment and subscription rows.

### Airtel environment variables later

These must never be exposed in frontend code.

```env
AIRTEL_MONEY_ENVIRONMENT=sandbox
AIRTEL_MONEY_CLIENT_ID=
AIRTEL_MONEY_CLIENT_SECRET=
AIRTEL_MONEY_COUNTRY=UG
AIRTEL_MONEY_CURRENCY=UGX
AIRTEL_MONEY_CALLBACK_URL=
```

## Backend choice

We should not call MTN/Airtel directly from the browser.

Recommended options:

### Option A: Supabase Edge Functions

Good because:

- close to our database
- can update `payment_transactions` and `subscriptions`
- can store provider secrets outside the frontend

### Option B: Vercel Serverless Functions

Good because:

- app is already on Vercel
- simple API routes/functions if we later move away from static-only export

Current app uses static export, so Supabase Edge Functions are the cleaner first choice.

## Database flow already ready

The current table is:

```text
payment_transactions
```

Important fields:

- provider
- amount_ugx
- phone_last4
- external_reference
- status
- raw_payload

The subscription table is:

```text
subscriptions
```

Important fields:

- plan
- status
- trial_ends_at
- current_period_ends_at

## Status mapping

Provider result should map like this:

```text
PENDING    -> payment_transactions.status = pending
SUCCESSFUL -> payment_transactions.status = successful, subscription active
FAILED     -> payment_transactions.status = failed
CANCELLED  -> payment_transactions.status = cancelled
```

## What we should build next

Before provider API code, we should add one internal operational screen or helper flow:

- pending activation request list
- copy payment reference
- show provider, amount, phone last 4
- manual status explanation

After that, build MTN sandbox first, then Airtel.

## Important cost note

Sandbox/testing can usually be done without live transaction charges. Production payments will normally involve transaction fees, and provider/merchant approval may be required. Avoid aggregators with setup/monthly fees unless direct MTN/Airtel onboarding becomes too slow.
