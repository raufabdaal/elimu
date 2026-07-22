# Mobile Money Plan for Elimu

Elimu will prioritize Ugandan mobile money payments instead of Stripe.

## Why mobile money first

For Uganda, parents are more likely to pay with:

- MTN Mobile Money
- Airtel Money

Stripe can remain optional later for card/international payments, but it should not be the primary launch path.

## Free-first reality

There is no fully free production mobile money processing layer. Usually:

- Sandbox/testing is free.
- Production requires merchant approval.
- Providers charge transaction fees.
- Some aggregators may charge setup, monthly, or transaction fees.

So we should build the app payment logic now in a provider-agnostic way, then connect a real provider later.

## Possible integration paths

### Option 1: Direct MTN MoMo API

Pros:

- Direct MTN integration.
- Good for Uganda.
- Sandbox exists for testing.

Cons:

- Production approval required.
- API setup can be bureaucratic.
- Airtel still needs separate integration.

### Option 2: Direct Airtel Money API

Pros:

- Direct Airtel integration.
- Good for local users.

Cons:

- Production approval required.
- Separate from MTN.

### Option 3: Aggregator later

Examples may include local/regional payment aggregators that support MTN and Airtel.

Pros:

- One API for multiple networks.
- Easier reporting.

Cons:

- Usually transaction fees.
- Some require contracts or approval.

## Product architecture

The app should not hard-code Stripe or any one provider.

We use this table now:

```text
payment_transactions
```

With fields:

- provider: mtn_momo | airtel_money | manual | other
- amount_ugx
- phone_last4
- external_reference
- status: pending | successful | failed | cancelled
- raw_payload

This allows us to support MTN/Airtel later without changing the parent dashboard/account system.

## Recommended payment flow later

1. Parent chooses plan.
2. Parent enters mobile money phone number.
3. App creates a pending payment transaction.
4. Backend/API requests mobile money collection.
5. Parent approves prompt on phone.
6. Provider sends callback/webhook.
7. App marks payment successful.
8. Subscription changes from trial/expired to active.

## Important backend note

Mobile money API secrets must never run in the browser.

When we integrate MTN/Airtel, we will need one of:

- Supabase Edge Functions
- Vercel Serverless Functions
- Another backend function layer

The frontend will only create/observe payment state. Secret API calls happen server-side.

## Development phase before real payments

Before provider approval, we can build:

- free trial
- subscription status table
- manual activation
- expired state
- parent plan UI
- payment transaction records with provider = manual

This lets the full subscription logic work before real mobile money is connected.

## Launch recommendation

Start with:

1. Supabase auth and profiles
2. Trial/subscription state
3. Manual payment activation for early pilot parents
4. MTN MoMo sandbox
5. Airtel Money sandbox or provider application
6. Production mobile money approval
