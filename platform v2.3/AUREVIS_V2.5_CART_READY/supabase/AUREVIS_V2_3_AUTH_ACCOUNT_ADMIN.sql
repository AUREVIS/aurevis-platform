-- AUREVIS V2.3 — Customer accounts, HoReCa approval, unified wallet and Admin security
begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  account_type text not null default 'customer' check (account_type in ('customer', 'horeca')),
  company_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  horeca_status text not null default 'not_applicable' check (horeca_status in ('not_applicable', 'pending', 'approved', 'rejected')),
  loyalty_tier text not null default 'standard' check (loyalty_tier in ('standard', 'bronze', 'silver', 'gold')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Upgrade older AUREVIS profiles tables without deleting existing users.
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists account_type text not null default 'customer';
alter table public.profiles add column if not exists company_name text;
alter table public.profiles add column if not exists role text not null default 'customer';
alter table public.profiles add column if not exists horeca_status text not null default 'not_applicable';
alter table public.profiles add column if not exists loyalty_tier text not null default 'standard';
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create table if not exists public.wallets (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  balance numeric(12,2) not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12,2) not null,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('AV-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  user_id uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'new' check (status in ('new', 'confirmed', 'preparing', 'delivery', 'completed', 'cancelled')),
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  bonus_spent numeric(12,2) not null default 0 check (bonus_spent >= 0),
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  delivery_address text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin(check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = check_user_id and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_type text;
begin
  selected_type := case
    when new.raw_user_meta_data->>'account_type' = 'horeca' then 'horeca'
    else 'customer'
  end;

  insert into public.profiles (
    id, email, full_name, phone, account_type, company_name, horeca_status
  ) values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'AUREVIS Customer'
    ),
    nullif(new.raw_user_meta_data->>'phone', ''),
    selected_type,
    nullif(new.raw_user_meta_data->>'company_name', ''),
    case when selected_type = 'horeca' then 'pending' else 'not_applicable' end
  )
  on conflict (id) do nothing;

  insert into public.wallets (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill users created before V2.3.
insert into public.profiles (id, email, full_name, phone, account_type, company_name, horeca_status)
select
  u.id,
  u.email,
  coalesce(
    nullif(u.raw_user_meta_data->>'full_name', ''),
    nullif(split_part(coalesce(u.email, ''), '@', 1), ''),
    'AUREVIS Customer'
  ),
  nullif(u.raw_user_meta_data->>'phone', ''),
  case when u.raw_user_meta_data->>'account_type' = 'horeca' then 'horeca' else 'customer' end,
  nullif(u.raw_user_meta_data->>'company_name', ''),
  case when u.raw_user_meta_data->>'account_type' = 'horeca' then 'pending' else 'not_applicable' end
from auth.users u
on conflict (id) do nothing;

insert into public.wallets (user_id)
select id from public.profiles
on conflict (user_id) do nothing;

create or replace function public.protect_profile_admin_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id and not public.is_admin(auth.uid()) then
    if new.role is distinct from old.role
      or new.horeca_status is distinct from old.horeca_status
      or new.loyalty_tier is distinct from old.loyalty_tier then
      raise exception 'Only an admin can change protected profile fields';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists protect_profile_admin_fields on public.profiles;
create trigger protect_profile_admin_fields
  before update on public.profiles
  for each row execute procedure public.protect_profile_admin_fields();

create or replace function public.admin_set_horeca_status(target_user_id uuid, next_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then raise exception 'Admin access required'; end if;
  if next_status not in ('pending', 'approved', 'rejected') then raise exception 'Invalid HoReCa status'; end if;

  update public.profiles
  set horeca_status = next_status,
      loyalty_tier = case when next_status = 'approved' and loyalty_tier = 'standard' then 'bronze' else loyalty_tier end,
      updated_at = now()
  where id = target_user_id and account_type = 'horeca';
end;
$$;

create or replace function public.admin_adjust_wallet(target_user_id uuid, amount_delta numeric, entry_note text default null)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  next_balance numeric;
begin
  if not public.is_admin(auth.uid()) then raise exception 'Admin access required'; end if;

  update public.wallets
  set balance = balance + amount_delta, updated_at = now()
  where user_id = target_user_id and balance + amount_delta >= 0
  returning balance into next_balance;

  if next_balance is null then raise exception 'Wallet update failed or balance would become negative'; end if;

  insert into public.wallet_ledger (user_id, amount, note, created_by)
  values (target_user_id, amount_delta, entry_note, auth.uid());
  return next_balance;
end;
$$;

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_ledger enable row level security;
alter table public.orders enable row level security;

drop policy if exists "profiles_read_own_or_admin" on public.profiles;
create policy "profiles_read_own_or_admin" on public.profiles for select
using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles for update
using (id = auth.uid() or public.is_admin(auth.uid()))
with check (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "wallets_read_own_or_admin" on public.wallets;
create policy "wallets_read_own_or_admin" on public.wallets for select
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "ledger_read_own_or_admin" on public.wallet_ledger;
create policy "ledger_read_own_or_admin" on public.wallet_ledger for select
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "orders_read_own_or_admin" on public.orders;
create policy "orders_read_own_or_admin" on public.orders for select
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "orders_create_own" on public.orders;
create policy "orders_create_own" on public.orders for insert
with check (user_id = auth.uid());

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders for update
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

grant usage on schema public to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.wallets, public.wallet_ledger to authenticated;
grant select, insert on public.orders to authenticated;

grant execute on function public.admin_set_horeca_status(uuid, text) to authenticated;
grant execute on function public.admin_adjust_wallet(uuid, numeric, text) to authenticated;

commit;

-- IMPORTANT: after running this file, promote only the real owner account:
-- update public.profiles set role = 'admin' where email = 'YOUR_ADMIN_EMAIL';
