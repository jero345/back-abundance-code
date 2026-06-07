# Supabase setup — Abundance Code backend

## 1. Create the project (one-time)

1. Go to https://supabase.com → **New project**
2. Pick a name, region close to your users, and a strong DB password (store it somewhere safe — it's separate from API keys)
3. Wait ~2 min for it to provision

## 2. Grab credentials

In your project: **Project Settings → API**

| Where it lives           | Variable                    | Used by              |
|--------------------------|-----------------------------|----------------------|
| Project URL              | `SUPABASE_URL`              | backend + frontend   |
| `anon` / `public` key    | `SUPABASE_ANON_KEY`         | backend + frontend   |
| `service_role` secret    | `SUPABASE_SERVICE_ROLE_KEY` | **backend only**     |

Paste them into `backend/.env` (see `backend/.env.example` for the template).

**Never** put `service_role` in the frontend or in git.

## 3. Run the schema

In Supabase Dashboard → **SQL Editor** → **New query**, paste the contents of
`backend/supabase/schema.sql` and click **Run**.

This creates:
- `profiles` (extends `auth.users`)
- `products`, `orders`, `blog_posts`, `daily_activations`
- RLS policies (users only see their own rows; public read for products/blog)
- `updated_at` trigger
- `handle_new_user()` trigger: every signup auto-creates a `profiles` row

The script is **idempotent** — safe to re-run if you change something and want
to reapply.

## 4. Grant yourself admin

After you sign up once via the frontend (or via Supabase Auth → Users → Add user),
go back to SQL Editor and run:

```sql
update public.profiles
set is_admin = true
where email = 'you@example.com';
```

The admin panel (`/admin`) and `requireAdmin` middleware will let you through.

## 5. Optional — turn off email confirmation in dev

By default Supabase requires email confirmation on signup, which means the
session returned by `register` will be `null` until the user clicks the link.

For local dev you can disable it: **Authentication → Providers → Email →
Confirm email** → off.

In production: keep it on, and update the frontend to handle the
`requiresEmailConfirmation: true` response from `/api/users/register`.

## 6. Verify

```bash
cd backend
npm install
npm run dev
```

Then hit `http://localhost:5000/api/health` — should return:

```json
{ "status": "ok", "backend": "supabase" }
```

If the server boots but DB calls fail with `Missing SUPABASE_URL...` warnings,
your `.env` isn't loaded. Make sure it's at `backend/.env` (not project root).

## What changed vs the old MongoDB stack

| Before                          | After                                       |
|---------------------------------|---------------------------------------------|
| `mongoose.connect(MONGODB_URI)` | per-request Supabase client (no startup DB) |
| `models/User.js` + bcrypt       | Supabase Auth + `profiles` row              |
| `jwt.sign / jwt.verify`         | Supabase access tokens (verified server-side via `sb.auth.getUser`) |
| `models/Order.js` (Mongoose)    | `src/data/orders.js` DAL → `public.orders`  |
| `Order.find({ ... })`           | `sb.from('orders').select(...).eq(...)`     |
| Auth header → `User.findById`   | Auth header → `sb.auth.getUser(token)` + profile fetch |

Frontend keeps calling the same REST endpoints (`/api/users/login`, `/api/orders/my`,
etc.). The shape of the access token changed but the storage key in localStorage
stays the same.

## Data model notes

- IDs are **UUIDs** (not Mongo ObjectIds). Anywhere the old code used `_id`, the
  new code uses `id`.
- Field names use **snake_case** in the DB (`birth_date`, `is_activated`, etc.)
  to match Postgres conventions. Controllers translate to camelCase in their JSON
  responses where the frontend expected it (e.g. `getMe`, `register`, `login`).
- Money is still stored as **cents** (`product_price_cents`, `price_cents`) — no
  floats, no rounding drift.
- `opportunity_windows` and `planetary_alerts` on `daily_activations` are stored
  as `jsonb` — query them with `->` / `->>` if you ever need to.

## Going further

- **Storage** (product images, blog covers): create a bucket in Supabase Storage
  and use `sb.storage.from('bucket').upload(...)` from the backend.
- **Realtime** (live order status on admin panel): subscribe via Supabase
  Realtime from the frontend — no backend changes needed.
- **Edge Functions**: for cron-like things (e.g. send subscription renewal
  emails), use Supabase scheduled functions instead of building it into Express.
