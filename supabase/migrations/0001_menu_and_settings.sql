-- ============================================================================
-- 0001 · Menu and restaurant settings
--
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
--
-- What it creates
--   menu_categories   one row per menu section ("Thalis", "Sizzlers"...)
--   menu_items        one row per dish, linked to its category
--   restaurant_settings  a single row with hours, dish of the day, etc.
--
-- Security (Row Level Security, "RLS")
--   Supabase exposes every table through a public API. RLS decides, per row,
--   who may read or write. We turn it on for every table and only allow
--   *reading* the menu and settings. Writing happens later from our own
--   server code with the secret key, which bypasses RLS on purpose.
-- ============================================================================

-- Diet and heat are small fixed sets, so the database enforces them.
create type diet as enum ('veg', 'egg', 'nonveg');

create table menu_categories (
  id          text primary key,            -- "thali", matches the menu.ts ids
  title       text not null,
  blurb       text not null default '',
  sort_order  int  not null default 0,     -- order on the menu page
  created_at  timestamptz not null default now()
);

create table menu_items (
  id           bigint generated always as identity primary key,
  category_id  text not null references menu_categories (id) on delete cascade,
  name         text not null,
  price        int  not null check (price >= 0),   -- rupees, whole numbers
  diet         diet not null,
  heat         smallint not null default 1 check (heat between 0 and 3),
  note         text,
  signature    boolean not null default false,
  available    boolean not null default true,      -- owner can mark "sold out"
  sort_order   int  not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (category_id, name)                       -- no duplicate dishes in a section
);

-- Speeds up "all dishes in this category, in order".
create index menu_items_category_idx on menu_items (category_id, sort_order);

-- One row only: the "id = 1" check makes a second row impossible.
create table restaurant_settings (
  id               int primary key default 1 check (id = 1),
  opens            time not null default '11:00',
  closes           time not null default '23:00',
  closed_today     boolean not null default false,  -- holiday override
  dish_of_the_day  text,                            -- drives "Today's craving"
  updated_at       timestamptz not null default now()
);
insert into restaurant_settings (id) values (1);

-- Keep updated_at honest on every change.
create function touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger menu_items_touch before update on menu_items
  for each row execute function touch_updated_at();
create trigger restaurant_settings_touch before update on restaurant_settings
  for each row execute function touch_updated_at();

-- Row Level Security: on for every table, then allow public reads only.
alter table menu_categories     enable row level security;
alter table menu_items          enable row level security;
alter table restaurant_settings enable row level security;

create policy "menu categories are public" on menu_categories     for select using (true);
create policy "menu items are public"      on menu_items          for select using (true);
create policy "settings are public"        on restaurant_settings for select using (true);
