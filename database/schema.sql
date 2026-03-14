create extension if not exists pgcrypto;

create type public.account_type as enum ('savings', 'checking', 'credit');
create type public.transaction_type as enum ('debit', 'credit');
create type public.transfer_status as enum ('pending', 'completed', 'failed');
create type public.card_status as enum ('active', 'frozen');
create type public.notification_type as enum ('transaction', 'transfer', 'warning', 'insight');
create type public.app_role as enum ('customer', 'admin');

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  account_type public.account_type not null,
  balance numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  type public.transaction_type not null,
  description text not null,
  category text not null,
  amount numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.transfers (
  id uuid primary key default gen_random_uuid(),
  from_account uuid not null references public.accounts (id) on delete cascade,
  to_account uuid not null references public.accounts (id) on delete cascade,
  amount numeric(12, 2) not null,
  status public.transfer_status not null default 'completed',
  created_at timestamptz not null default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  card_number text not null,
  status public.card_status not null default 'active',
  online_payments_enabled boolean not null default true,
  international_enabled boolean not null default false
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  message text not null,
  type public.notification_type not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  spending_insight text not null,
  saving_tip text not null,
  anomaly_detection text not null,
  predicted_balance_7_days numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_accounts_user_id on public.accounts (user_id);
create index if not exists idx_transactions_account_id on public.transactions (account_id);
create index if not exists idx_notifications_user_id on public.notifications (user_id);
create index if not exists idx_cards_user_id on public.cards (user_id);
create index if not exists idx_ai_insights_user_id on public.ai_insights (user_id);

alter table public.users enable row level security;
alter table public.accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.transfers enable row level security;
alter table public.cards enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_insights enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create policy "users can read own profile"
  on public.users
  for select
  using (id = auth.uid() or public.is_admin());

create policy "users can insert own profile"
  on public.users
  for insert
  with check (id = auth.uid());

create policy "users can update own profile"
  on public.users
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "users can view own accounts"
  on public.accounts
  for select
  using (user_id = auth.uid() or public.is_admin());

create policy "users can manage own accounts"
  on public.accounts
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "users can view own transactions"
  on public.transactions
  for select
  using (
    exists (
      select 1
      from public.accounts
      where accounts.id = transactions.account_id
        and (accounts.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "users can insert own transactions"
  on public.transactions
  for insert
  with check (
    exists (
      select 1
      from public.accounts
      where accounts.id = transactions.account_id
        and accounts.user_id = auth.uid()
    )
  );

create policy "users can view own transfers"
  on public.transfers
  for select
  using (
    exists (
      select 1
      from public.accounts a
      where (a.id = transfers.from_account or a.id = transfers.to_account)
        and (a.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "users can insert own transfers"
  on public.transfers
  for insert
  with check (
    exists (
      select 1
      from public.accounts a
      where a.id = transfers.from_account
        and a.user_id = auth.uid()
    )
  );

create policy "users can view own cards"
  on public.cards
  for select
  using (user_id = auth.uid() or public.is_admin());

create policy "users can update own cards"
  on public.cards
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "users can insert own cards"
  on public.cards
  for insert
  with check (user_id = auth.uid());

create policy "users can view own notifications"
  on public.notifications
  for select
  using (user_id = auth.uid() or public.is_admin());

create policy "users can insert own notifications"
  on public.notifications
  for insert
  with check (user_id = auth.uid());

create policy "users can view own ai insights"
  on public.ai_insights
  for select
  using (user_id = auth.uid() or public.is_admin());

create policy "users can insert own ai insights"
  on public.ai_insights
  for insert
  with check (user_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'MoneyMind User'),
    'customer'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.execute_transfer(
  p_from_account uuid,
  p_to_account uuid,
  p_amount numeric
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_transfer_id uuid := gen_random_uuid();
  v_user_id uuid := auth.uid();
  v_source_balance numeric(12, 2);
begin
  if p_from_account = p_to_account then
    raise exception 'Source and destination must differ.';
  end if;

  if p_amount <= 0 then
    raise exception 'Transfer amount must be positive.';
  end if;

  select balance
  into v_source_balance
  from public.accounts
  where id = p_from_account
    and user_id = v_user_id
  for update;

  if v_source_balance is null then
    raise exception 'Source account not found.';
  end if;

  if v_source_balance < p_amount then
    raise exception 'Insufficient balance.';
  end if;

  perform 1
  from public.accounts
  where id = p_to_account
    and user_id = v_user_id
  for update;

  if not found then
    raise exception 'Destination account not found.';
  end if;

  update public.accounts
  set balance = balance - p_amount
  where id = p_from_account;

  update public.accounts
  set balance = balance + p_amount
  where id = p_to_account;

  insert into public.transfers (id, from_account, to_account, amount, status)
  values (v_transfer_id, p_from_account, p_to_account, p_amount, 'completed');

  insert into public.transactions (account_id, type, description, category, amount)
  values
    (p_from_account, 'debit', 'MoneyMind Transfer Out', 'Transfer', p_amount),
    (p_to_account, 'credit', 'MoneyMind Transfer In', 'Transfer', p_amount);

  insert into public.notifications (user_id, message, type)
  values (v_user_id, format('Transfer of $%s completed successfully.', trim(to_char(p_amount, 'FM999999990.00'))), 'transfer');

  if (select balance from public.accounts where id = p_from_account) < 1000 then
    insert into public.notifications (user_id, message, type)
    values (v_user_id, 'Low balance alert: your source account is below $1,000.', 'warning');
  end if;

  return v_transfer_id;
end;
$$;

grant execute on function public.execute_transfer(uuid, uuid, numeric) to authenticated;
