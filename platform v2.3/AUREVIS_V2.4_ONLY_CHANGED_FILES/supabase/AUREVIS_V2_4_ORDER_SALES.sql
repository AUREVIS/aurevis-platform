-- AUREVIS V2.4 — Safe order workflow, order history, 5% cashback and sales analytics
-- Run this file once in Supabase SQL Editor after the V2.3 SQL file.
begin;

alter table public.profiles add column if not exists is_archived boolean not null default false;
alter table public.orders add column if not exists completed_at timestamptz;
alter table public.orders add column if not exists cashback_rate numeric(5,2) not null default 5;
alter table public.orders add column if not exists cashback_earned numeric(12,2) not null default 0;
alter table public.orders add column if not exists cashback_credited boolean not null default false;
alter table public.orders add column if not exists payment_method text not null default 'cash';

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  sku text,
  product_name text not null,
  volume text,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) generated always as (unit_price * quantity) stored,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  previous_status text,
  next_status text not null,
  changed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists order_status_history_order_id_idx
  on public.order_status_history(order_id, created_at desc);

alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;

drop policy if exists "order_items_read_own_or_admin" on public.order_items;
create policy "order_items_read_own_or_admin" on public.order_items for select
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and (o.user_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

drop policy if exists "order_history_read_own_or_admin" on public.order_status_history;
create policy "order_history_read_own_or_admin" on public.order_status_history for select
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and (o.user_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

create or replace function public.create_aurevis_order(
  order_phone text,
  order_address text,
  order_notes text,
  cart_items jsonb
)
returns table(order_id uuid, order_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  new_order_id uuid;
  new_order_number text;
  computed_total numeric(12,2) := 0;
  cart_item jsonb;
  matched_product public.products%rowtype;
  item_quantity integer;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if coalesce(trim(order_phone), '') = '' then raise exception 'Phone is required'; end if;
  if coalesce(trim(order_address), '') = '' then raise exception 'Delivery address is required'; end if;
  if jsonb_typeof(cart_items) <> 'array' or jsonb_array_length(cart_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  insert into public.orders as created_order (
    user_id, status, subtotal, bonus_spent, total_amount,
    delivery_address, phone, notes, cashback_rate, payment_method
  ) values (
    auth.uid(), 'new', 0, 0, 0,
    trim(order_address), trim(order_phone), nullif(trim(order_notes), ''), 5, 'cash'
  ) returning created_order.id, created_order.order_number into new_order_id, new_order_number;

  for cart_item in select * from jsonb_array_elements(cart_items)
  loop
    item_quantity := greatest(1, least(100, coalesce((cart_item->>'quantity')::integer, 1)));
    matched_product := null;

    if coalesce(cart_item->>'id', '') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
      select * into matched_product from public.products
      where id = (cart_item->>'id')::uuid and is_active = true;
    end if;

    if matched_product.id is null and coalesce(cart_item->>'sku', '') <> '' then
      select * into matched_product from public.products
      where sku = cart_item->>'sku' and is_active = true;
    end if;

    if matched_product.id is null then
      raise exception 'Product is unavailable: %', coalesce(cart_item->>'name', cart_item->>'id', 'unknown');
    end if;

    insert into public.order_items (
      order_id, product_id, sku, product_name, volume, unit_price, quantity
    ) values (
      new_order_id,
      matched_product.id,
      matched_product.sku,
      coalesce(matched_product.name_hy, matched_product.name_en, matched_product.sku),
      matched_product.volume,
      matched_product.retail_price,
      item_quantity
    );

    computed_total := computed_total + (matched_product.retail_price * item_quantity);
  end loop;

  update public.orders
  set subtotal = computed_total, total_amount = computed_total, updated_at = now()
  where id = new_order_id;

  insert into public.order_status_history(order_id, previous_status, next_status, changed_by)
  values (new_order_id, null, 'new', auth.uid());

  return query select new_order_id, new_order_number;
exception
  when others then
    raise;
end;
$$;

create or replace function public.admin_update_order_status(
  target_order_id uuid,
  next_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_order public.orders%rowtype;
  reward numeric(12,2);
begin
  if not public.is_admin(auth.uid()) then raise exception 'Admin access required'; end if;
  if next_status not in ('new', 'confirmed', 'preparing', 'delivery', 'completed', 'cancelled') then
    raise exception 'Invalid order status';
  end if;

  select * into current_order from public.orders
  where id = target_order_id for update;

  if current_order.id is null then raise exception 'Order not found'; end if;
  if current_order.status in ('completed', 'cancelled') and current_order.status <> next_status then
    raise exception 'Completed or cancelled orders are locked';
  end if;
  if current_order.status = next_status then return; end if;

  reward := round(current_order.total_amount * current_order.cashback_rate / 100, 2);

  update public.orders
  set status = next_status,
      completed_at = case when next_status = 'completed' then now() else completed_at end,
      cashback_earned = case when next_status = 'completed' then reward else cashback_earned end,
      cashback_credited = case when next_status = 'completed' then true else cashback_credited end,
      updated_at = now()
  where id = target_order_id;

  if next_status = 'completed' and not current_order.cashback_credited then
    insert into public.wallets(user_id, balance)
    values (current_order.user_id, reward)
    on conflict (user_id) do update
    set balance = public.wallets.balance + excluded.balance, updated_at = now();

    insert into public.wallet_ledger(user_id, amount, note, created_by)
    values (
      current_order.user_id,
      reward,
      '5% cashback — order #' || current_order.order_number,
      auth.uid()
    );
  end if;

  insert into public.order_status_history(order_id, previous_status, next_status, changed_by)
  values (target_order_id, current_order.status, next_status, auth.uid());
end;
$$;

create or replace function public.admin_sales_summary()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select case when public.is_admin(auth.uid()) then jsonb_build_object(
    'today_total', coalesce(sum(o.total_amount) filter (
      where o.status = 'completed' and o.completed_at >= date_trunc('day', now())), 0),
    'month_total', coalesce(sum(o.total_amount) filter (
      where o.status = 'completed' and o.completed_at >= date_trunc('month', now())), 0),
    'all_time_total', coalesce(sum(o.total_amount) filter (where o.status = 'completed'), 0),
    'completed_orders', count(*) filter (where o.status = 'completed'),
    'sold_items', coalesce((
      select sum(oi.quantity)
      from public.order_items oi
      join public.orders completed_order on completed_order.id = oi.order_id
      where completed_order.status = 'completed'
    ), 0),
    'cashback_total', coalesce(sum(o.cashback_earned) filter (where o.status = 'completed'), 0)
  ) else null end
  from public.orders o;
$$;

-- Customers create orders only through the validated RPC. Admin status changes also use RPC.
revoke insert, update on public.orders from authenticated;
grant select on public.orders, public.order_items, public.order_status_history to authenticated;

revoke all on function public.create_aurevis_order(text, text, text, jsonb) from public, anon;
revoke all on function public.admin_update_order_status(uuid, text) from public, anon;
revoke all on function public.admin_sales_summary() from public, anon;
grant execute on function public.create_aurevis_order(text, text, text, jsonb) to authenticated;
grant execute on function public.admin_update_order_status(uuid, text) to authenticated;
grant execute on function public.admin_sales_summary() to authenticated;

commit;
