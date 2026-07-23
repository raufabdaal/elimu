# Elimu Manual Activation Workflow

This is the free-first pilot workflow before live MTN/Airtel API integration.

## Where this fits

Parents can now go to:

```text
/pricing/
```

They can choose:

- MTN Mobile Money
- Airtel Money
- Family Monthly
- Family Term

The app creates a pending row in:

```text
public.payment_transactions
```

No real mobile money collection happens yet. You manually verify payment outside the app, then activate the subscription in Supabase.

## Step 1: Parent requests activation

Parent enters mobile money number and clicks:

```text
Request Activation
```

This creates a pending transaction.

## Step 2: View pending requests

In Supabase:

```text
SQL Editor → New query
```

Open:

```text
supabase/manual-activation-snippets.sql
```

Run section 1:

```sql
select ... from public.payment_transactions ... where pt.status = 'pending'
```

You will see:

- payment_id
- provider
- amount_ugx
- phone_last4
- requested_plan_id
- profile_id
- parent/student name
- current subscription state

## Step 3: Confirm payment manually

For pilot usage, you can confirm payment by:

- checking your MTN/Airtel merchant line manually
- asking the parent to send proof/reference
- checking SMS/payment notification

When confirmed, copy the `payment_id`.

## Step 4: Activate monthly or term access

For monthly access, run section 2 in:

```text
supabase/manual-activation-snippets.sql
```

Replace:

```text
PAYMENT_ID_HERE
```

with the real transaction ID.

For term access, run section 3 instead.

This updates:

```text
subscriptions.status = active
subscriptions.plan = family
payment_transactions.status = successful
```

## Step 5: Complimentary/manual access

For a free pilot, scholarship, staff account, or tester, use section 4:

```sql
update public.subscriptions
set status = 'manual_comp', plan = 'manual_comp'
where profile_id = 'PROFILE_ID_HERE';
```

## Step 6: Failed/cancelled request

If the parent does not pay or sends wrong details, use section 5:

```sql
update public.payment_transactions
set status = 'failed'
where id = 'PAYMENT_ID_HERE';
```

## Current limitations

This is manual. It is good for pilots and early users, but not for scale.

Later, live mobile money integration should automate:

1. payment request
2. STK/prompt push to phone
3. callback/webhook confirmation
4. subscription activation
5. receipt/reference display

## Free-first note

Sandbox testing for MTN/Airtel APIs is usually free. Production collection usually requires merchant onboarding and transaction fees. Some providers may require approval, business documents, settlement account details, and/or minimum conditions.

So this manual workflow lets Elimu start testing payments without paying for an integration upfront.
