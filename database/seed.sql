create extension if not exists pgcrypto;

do $$
declare
  seed_user_id uuid := '11111111-1111-1111-1111-111111111111';
  checking_account_id uuid := 'a1111111-1111-1111-1111-111111111111';
  savings_account_id uuid := 'a2222222-2222-2222-2222-222222222222';
  identity_id uuid := '21111111-1111-1111-1111-111111111111';
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    seed_user_id,
    'authenticated',
    'authenticated',
    'seed@moneymind.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Avery Johnson"}',
    now(),
    now()
  )
  on conflict (id) do nothing;

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    identity_id,
    seed_user_id,
    format('{"sub":"%s","email":"%s"}', seed_user_id, 'seed@moneymind.com')::jsonb,
    'email',
    'seed@moneymind.com',
    now(),
    now(),
    now()
  )
  on conflict (id) do nothing;

  insert into public.users (id, email, full_name, role, created_at)
  values (
    seed_user_id,
    'seed@moneymind.com',
    'Avery Johnson',
    'admin',
    '2026-01-15T10:00:00.000Z'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        role = excluded.role;

  insert into public.accounts (id, user_id, account_type, balance, created_at)
  values
    (checking_account_id, seed_user_id, 'checking', 8240.52, '2026-01-16T09:30:00.000Z'),
    (savings_account_id, seed_user_id, 'savings', 18125.11, '2026-01-16T09:31:00.000Z')
  on conflict (id) do update
    set balance = excluded.balance;

  insert into public.cards (
    id,
    user_id,
    card_number,
    status,
    online_payments_enabled,
    international_enabled
  )
  values (
    'c1111111-1111-1111-1111-111111111111',
    seed_user_id,
    '4111111111112049',
    'active',
    true,
    false
  )
  on conflict (id) do nothing;

  insert into public.transactions (id, account_id, type, description, category, amount, created_at)
  values
    ('30000000-0000-0000-0000-000000000001', checking_account_id, 'credit', 'Payroll Deposit', 'Income', 4200.00, '2026-03-13T09:00:00.000Z'),
    ('30000000-0000-0000-0000-000000000002', checking_account_id, 'debit', 'Whole Foods Market', 'Groceries', 124.52, '2026-03-13T18:42:00.000Z'),
    ('30000000-0000-0000-0000-000000000003', checking_account_id, 'debit', 'Uber', 'Transport', 28.70, '2026-03-12T14:08:00.000Z'),
    ('30000000-0000-0000-0000-000000000004', checking_account_id, 'debit', 'Netflix', 'Subscriptions', 19.99, '2026-03-11T05:20:00.000Z'),
    ('30000000-0000-0000-0000-000000000005', checking_account_id, 'debit', 'Blue Bottle Coffee', 'Dining', 16.25, '2026-03-10T08:20:00.000Z'),
    ('30000000-0000-0000-0000-000000000006', savings_account_id, 'credit', 'Automatic Savings Transfer', 'Transfer', 600.00, '2026-03-09T10:00:00.000Z'),
    ('30000000-0000-0000-0000-000000000007', checking_account_id, 'debit', 'Apple Store', 'Shopping', 249.00, '2026-03-08T15:20:00.000Z'),
    ('30000000-0000-0000-0000-000000000008', checking_account_id, 'debit', 'Shell Fuel', 'Transport', 72.34, '2026-03-08T11:03:00.000Z'),
    ('30000000-0000-0000-0000-000000000009', checking_account_id, 'debit', 'Rent Payment', 'Housing', 1850.00, '2026-03-05T12:00:00.000Z'),
    ('30000000-0000-0000-0000-000000000010', checking_account_id, 'debit', 'CVS Pharmacy', 'Health', 43.21, '2026-03-04T17:30:00.000Z'),
    ('30000000-0000-0000-0000-000000000011', checking_account_id, 'credit', 'Refund - Amazon', 'Shopping', 54.90, '2026-03-03T09:10:00.000Z'),
    ('30000000-0000-0000-0000-000000000012', checking_account_id, 'debit', 'Spotify', 'Subscriptions', 11.99, '2026-03-02T07:14:00.000Z'),
    ('30000000-0000-0000-0000-000000000013', checking_account_id, 'debit', 'Dinner at Nopa', 'Dining', 96.40, '2026-03-01T20:12:00.000Z'),
    ('30000000-0000-0000-0000-000000000014', savings_account_id, 'credit', 'High-Yield Savings Interest', 'Income', 24.10, '2026-02-28T23:00:00.000Z'),
    ('30000000-0000-0000-0000-000000000015', checking_account_id, 'debit', 'Southwest Airlines', 'Travel', 318.20, '2026-02-28T13:40:00.000Z'),
    ('30000000-0000-0000-0000-000000000016', checking_account_id, 'debit', 'Target', 'Shopping', 87.46, '2026-02-27T16:51:00.000Z'),
    ('30000000-0000-0000-0000-000000000017', checking_account_id, 'debit', 'Lyft', 'Transport', 34.11, '2026-02-25T19:03:00.000Z'),
    ('30000000-0000-0000-0000-000000000018', savings_account_id, 'credit', 'Round-up Savings Sweep', 'Transfer', 82.64, '2026-02-24T09:18:00.000Z'),
    ('30000000-0000-0000-0000-000000000019', checking_account_id, 'debit', 'Comcast', 'Utilities', 74.99, '2026-02-22T11:00:00.000Z'),
    ('30000000-0000-0000-0000-000000000020', checking_account_id, 'debit', 'Trader Joe''s', 'Groceries', 89.27, '2026-02-21T17:45:00.000Z')
  on conflict (id) do nothing;

  insert into public.notifications (id, user_id, message, type, created_at)
  values
    ('40000000-0000-0000-0000-000000000001', seed_user_id, 'Payroll deposit of $4,200 posted to your checking account.', 'transaction', '2026-03-13T09:02:00.000Z'),
    ('40000000-0000-0000-0000-000000000002', seed_user_id, 'Money moved successfully from checking to savings.', 'transfer', '2026-03-09T10:03:00.000Z'),
    ('40000000-0000-0000-0000-000000000003', seed_user_id, 'Dining spend is 12% higher than your recent weekly average.', 'insight', '2026-03-02T15:00:00.000Z'),
    ('40000000-0000-0000-0000-000000000004', seed_user_id, 'Low balance alert is armed for balances below $1,000.', 'warning', '2026-02-20T12:00:00.000Z')
  on conflict (id) do nothing;
end $$;
