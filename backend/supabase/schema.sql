-- =============================================================================
-- ABUNDANCE CODE — Supabase schema
-- Run this in Supabase → SQL Editor → New query → Run.
-- Idempotent: re-running is safe (uses IF NOT EXISTS / CREATE OR REPLACE).
-- =============================================================================

-- ---- Extensions ------------------------------------------------------------
create extension if not exists "pgcrypto";

-- =============================================================================
-- 1.  profiles  (extends auth.users with app-specific fields)
-- =============================================================================
create table if not exists public.profiles (
  id                     uuid primary key references auth.users(id) on delete cascade,
  email                  text not null,
  name                   text,

  -- Birth data for energetic profile
  birth_date             date,
  birth_time             text,         -- "14:35" — keep string to allow partial input
  birth_place            text,

  -- Portal access
  is_activated           boolean not null default false,
  activation_code        text,
  activated_at           timestamptz,

  -- Subscription
  subscription_status    text not null default 'none'
                         check (subscription_status in ('none','trial','active','canceled','past_due')),
  subscription_id        text,
  subscription_end_date  timestamptz,

  -- Stripe
  stripe_customer_id     text,

  -- Trial (30 days from activation)
  trial_start_date       timestamptz,
  trial_end_date         timestamptz,

  -- Admin
  is_admin               boolean not null default false,

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (lower(email));
create index if not exists profiles_stripe_customer_idx on public.profiles (stripe_customer_id);

-- =============================================================================
-- 2.  products  (catalog — used by admin + Stripe products mirror)
-- =============================================================================
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text default '',
  price_cents     integer not null,        -- store in cents (usd)
  currency        text not null default 'usd',
  image_url       text default '',
  is_active       boolean not null default true,
  slug            text unique,
  wc_product_id   integer unique,          -- WooCommerce mirror id (unique for upsert)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- =============================================================================
-- 3.  orders  (Stripe checkout result + shipping + activation code)
-- =============================================================================
create table if not exists public.orders (
  id                       uuid primary key default gen_random_uuid(),

  -- Customer
  email                    text not null,
  name                     text default '',
  phone                    text,

  -- Shipping address (flattened — cheaper to query)
  address_line1            text default '',
  address_line2            text,
  address_city             text default '',
  address_state            text,
  address_postal_code      text default '',
  address_country          text default '',

  -- Product snapshot at time of purchase
  product_name             text default 'Crystal Code',
  product_type             text not null default 'crystal-code'
                           check (product_type in ('crystal-code','crystal-code-premium')),
  product_includes_bracelet boolean not null default false,
  product_price_cents      integer not null,
  product_currency         text not null default 'usd',

  -- Stripe
  stripe_session_id        text unique,
  stripe_payment_intent_id text,

  -- Status
  status                   text not null default 'pending'
                           check (status in ('pending','paid','processing','shipped','delivered','refunded','canceled')),

  -- Shipping ops
  tracking_number          text,
  shipped_at               timestamptz,
  delivered_at             timestamptz,
  notes                    text,

  -- Activation
  activation_code          text unique,
  qr_code_url              text,
  is_activated             boolean not null default false,

  -- Linked customer (after activation)
  user_id                  uuid references public.profiles(id) on delete set null,

  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists orders_user_id_idx          on public.orders (user_id);
create index if not exists orders_status_idx           on public.orders (status);
create index if not exists orders_activation_code_idx  on public.orders (activation_code);
create index if not exists orders_email_idx            on public.orders (lower(email));
create index if not exists orders_created_at_idx       on public.orders (created_at desc);

-- =============================================================================
-- 4.  daily_activations  (one per user per day)
-- =============================================================================
create table if not exists public.daily_activations (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.profiles(id) on delete cascade,
  date                 date not null,

  -- Core content
  frequency            text,                 -- "888"
  planetary_influence  text,                 -- "Jupiter – House 2"
  energy_type          text,                 -- "Financial expansion energy"
  daily_message        text,
  ritual               text,

  -- Energy windows / Premium (jsonb because they're free-form arrays)
  opportunity_windows  jsonb not null default '[]'::jsonb,
  full_activation      text,
  planetary_alerts     jsonb not null default '[]'::jsonb,

  is_premium           boolean not null default false,
  is_read              boolean not null default false,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  unique (user_id, date)
);

create index if not exists daily_activations_user_date_idx
  on public.daily_activations (user_id, date desc);

-- =============================================================================
-- 5.  blog_posts
-- =============================================================================
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  excerpt       text default '',
  content       text default '',
  image_url     text default '',
  author        text default 'Abundance Code',
  category      text default 'Astrology',
  is_published  boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (is_published, published_at desc);

-- =============================================================================
-- updated_at triggers
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['profiles','products','orders','daily_activations','blog_posts']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t
    );
  end loop;
end;
$$;

-- =============================================================================
-- Auto-create a profile row when a new auth.users row is inserted
-- (Supabase Auth signup → profile)
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- Row Level Security
-- =============================================================================

-- profiles: user can read/update own; service_role (server) bypasses RLS
alter table public.profiles enable row level security;

drop policy if exists "profile self read"  on public.profiles;
drop policy if exists "profile self update" on public.profiles;
drop policy if exists "profile public none" on public.profiles;

create policy "profile self read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profile self update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- products: public read of active items; only service_role writes
alter table public.products enable row level security;

drop policy if exists "products public read" on public.products;
create policy "products public read"
  on public.products for select
  using (is_active = true);

-- orders: a user can read their own orders; writes done via service_role from server
alter table public.orders enable row level security;

drop policy if exists "orders self read" on public.orders;
create policy "orders self read"
  on public.orders for select
  using (auth.uid() = user_id);

-- daily_activations: user reads own
alter table public.daily_activations enable row level security;

drop policy if exists "activations self read"  on public.daily_activations;
drop policy if exists "activations self write" on public.daily_activations;

create policy "activations self read"
  on public.daily_activations for select
  using (auth.uid() = user_id);

-- blog_posts: public read of published rows
alter table public.blog_posts enable row level security;

drop policy if exists "blog public read" on public.blog_posts;
create policy "blog public read"
  on public.blog_posts for select
  using (is_published = true);

-- =============================================================================
-- Force PostgREST schema cache reload (so new tables are visible immediately)
-- =============================================================================
notify pgrst, 'reload schema';

-- =============================================================================
-- Seed (optional) — uncomment to populate two demo products
-- =============================================================================
-- insert into public.products (name, description, price_cents, currency, slug, is_active)
-- values
--   ('Crystal Code', 'Premium sphere + personal portal + diagnosis', 17700, 'usd', 'crystal-code', true),
--   ('Crystal Code Premium', 'Crystal Code + energetic bracelet', 21700, 'usd', 'crystal-code-premium', true)
-- on conflict (slug) do nothing;
