-- =============================================================================
-- ABUNDANCE CODE — Suscripciones y acceso a la app
-- Ejecutar en Supabase → SQL Editor → New query → Run.
-- Idempotente: se puede volver a ejecutar sin romper nada.
--
-- Modelo: el usuario paga en la web (Stripe Checkout en modo suscripción).
-- El webhook crea aquí una fila con un token de un solo uso. La app canjea
-- ese token y vincula la cuenta al mismo email que pagó.
-- =============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),

  -- Identidad: el email que pagó. Es la llave que une pago y cuenta de la app.
  email                   text not null,
  name                    text,

  -- Stripe
  stripe_customer_id      text,
  stripe_subscription_id  text,
  stripe_session_id       text unique,          -- idempotencia del webhook
  plan                    text not null default 'monthly'
                          check (plan in ('monthly','annual')),
  price_cents             integer,
  currency                text not null default 'usd',

  -- Estado del acceso
  status                  text not null default 'active'
                          check (status in ('active','past_due','canceled','incomplete')),
  current_period_end      timestamptz,

  -- Origen del acceso: pago por Stripe o esfera comprada en el modelo anterior
  source                  text not null default 'stripe'
                          check (source in ('stripe','legacy_sphere')),

  -- Enlace de acceso de un solo uso (lo canjea la app)
  access_token            text unique,
  access_code             text,                 -- respaldo legible: AC-XXXX-XXXX
  token_expires_at        timestamptz,
  redeemed_at             timestamptz,
  app_user_id             text,                 -- id del usuario en la app, tras canjear

  -- Atribución del embudo
  utm_campaign            text,

  -- Recordatorios a quien pagó y no activó
  reminders_sent          integer not null default 0,
  last_reminder_at        timestamptz,

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- El email es único, pero el índice tiene que ir sobre la COLUMNA, no sobre
-- lower(email): `upsert(..., { onConflict: 'email' })` no puede apuntar a un
-- índice de expresión y falla con "no unique or exclusion constraint matching
-- the ON CONFLICT specification". La normalización a minúsculas ya la hace el
-- backend antes de escribir (src/data/subscriptions.js).
drop index if exists public.subscriptions_email_idx;
create unique index if not exists subscriptions_email_idx
  on public.subscriptions (email);
create index if not exists subscriptions_token_idx
  on public.subscriptions (access_token);
create index if not exists subscriptions_stripe_sub_idx
  on public.subscriptions (stripe_subscription_id);
create index if not exists subscriptions_stripe_customer_idx
  on public.subscriptions (stripe_customer_id);

-- updated_at automático
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists subscriptions_touch_updated_at on public.subscriptions;
create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- Sin acceso público: sólo el backend (service_role) toca esta tabla.
alter table public.subscriptions enable row level security;

notify pgrst, 'reload schema';
