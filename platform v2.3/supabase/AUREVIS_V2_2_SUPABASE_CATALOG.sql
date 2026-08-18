-- AUREVIS V2.2 — Prices + 37 syrup flavors
begin;

update public.products
set retail_price = 5600
where category_id = (select id from public.categories where slug = 'purees');

update public.products
set retail_price = 4400
where category_id = (select id from public.categories where slug = 'syrups');

with syrup_category as (
  select id from public.categories where slug = 'syrups'
),
flavors(sku, name_hy, name_en, sort_order) as (
  values
    ('SYRUP-CHOCOLATE', 'Chocolate', 'Chocolate', 10),
    ('SYRUP-MOJITO', 'Mojito', 'Mojito', 20),
    ('SYRUP-PASSION-FRUIT', 'Passion Fruit', 'Passion Fruit', 30),
    ('SYRUP-BERRY-MIX', 'Berry Mix', 'Berry Mix', 40),
    ('SYRUP-CARAMEL', 'Caramel', 'Caramel', 50),
    ('SYRUP-VANILLA', 'Vanilla', 'Vanilla', 60),
    ('SYRUP-PISTACHIO', 'Pistachio', 'Pistachio', 70),
    ('SYRUP-BLUEBERRY', 'Blueberry', 'Blueberry', 80),
    ('SYRUP-RASPBERRY', 'Raspberry', 'Raspberry', 90),
    ('SYRUP-LIME', 'Lime', 'Lime', 100),
    ('SYRUP-LEMON', 'Lemon', 'Lemon', 110),
    ('SYRUP-PINEAPPLE', 'Pineapple', 'Pineapple', 120),
    ('SYRUP-BANANA', 'Banana', 'Banana', 130),
    ('SYRUP-CHERRY', 'Cherry', 'Cherry', 140),
    ('SYRUP-BLUE-CURACAO', 'Blue Curaçao', 'Blue Curaçao', 150),
    ('SYRUP-ORANGE', 'Orange', 'Orange', 160),
    ('SYRUP-APPLE', 'Apple', 'Apple', 170),
    ('SYRUP-BLACK-CURRANT', 'Black Currant', 'Black Currant', 180),
    ('SYRUP-PEACH', 'Peach', 'Peach', 190),
    ('SYRUP-APRICOT', 'Apricot', 'Apricot', 200),
    ('SYRUP-COCONUT', 'Coconut', 'Coconut', 210),
    ('SYRUP-LYCHEE', 'Lychee', 'Lychee', 220),
    ('SYRUP-SEA-BUCKTHORN', 'Sea Buckthorn', 'Sea Buckthorn', 230),
    ('SYRUP-POMEGRANATE', 'Pomegranate', 'Pomegranate', 240),
    ('SYRUP-WATERMELON', 'Watermelon', 'Watermelon', 250),
    ('SYRUP-MELON', 'Melon', 'Melon', 260),
    ('SYRUP-YUZU', 'Yuzu', 'Yuzu', 270),
    ('SYRUP-SALTED-CARAMEL', 'Salted Caramel', 'Salted Caramel', 280),
    ('SYRUP-PEAR', 'Pear', 'Pear', 290),
    ('SYRUP-RHUBARB', 'Rhubarb', 'Rhubarb', 300),
    ('SYRUP-CINNAMON', 'Cinnamon', 'Cinnamon', 310),
    ('SYRUP-GREEN-APPLE', 'Green Apple', 'Green Apple', 320),
    ('SYRUP-GRAPE', 'Grape', 'Grape', 330),
    ('SYRUP-GRAPEFRUIT', 'Grapefruit', 'Grapefruit', 340),
    ('SYRUP-HAZELNUT', 'Hazelnut', 'Hazelnut', 350),
    ('SYRUP-MINT', 'Mint', 'Mint', 360),
    ('SYRUP-GINGER', 'Ginger', 'Ginger', 370)
)
insert into public.products (
  sku, category_id, name_hy, name_en, volume,
  retail_price, bonus_reward, ice_gift_kg,
  stock_quantity, is_active, partner_available, sort_order
)
select
  f.sku, c.id, f.name_hy, f.name_en, '1 լիտր',
  4400, 100, 5, 0, true, false, 1000 + f.sort_order
from flavors f
cross join syrup_category c
on conflict (sku) do update
set category_id = excluded.category_id,
    name_hy = excluded.name_hy,
    name_en = excluded.name_en,
    volume = excluded.volume,
    retail_price = 4400,
    bonus_reward = 100,
    ice_gift_kg = 5,
    is_active = true,
    sort_order = excluded.sort_order,
    updated_at = now();

commit;

select c.slug as category, count(*) as product_count,
       min(p.retail_price) as min_price, max(p.retail_price) as max_price
from public.products p
left join public.categories c on c.id = p.category_id
where c.slug in ('purees','syrups')
group by c.slug
order by c.slug;
