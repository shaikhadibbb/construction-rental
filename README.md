# ConstructRent — Construction Equipment Rental Platform

A full-stack equipment rental platform built with **Next.js 14**, **TypeScript**, **Supabase**, and **Tailwind CSS**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Database + Auth | Supabase (PostgreSQL + Row Level Security) |
| Storage | Supabase Storage (`equipment-images` bucket) |
| Styling | Tailwind CSS v4 + inline CSS-in-JS |
| Email | Resend |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-org/construction-rental.git
cd construction-rental
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your real values (see table below).

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous/public key |
| `RESEND_API_KEY` | ✅ | Resend API key for booking emails |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional | WhatsApp number without `+` (e.g. `919876543210`) |
| `NEXT_PUBLIC_CALL_NUMBER` | Optional | Call number with `+` (e.g. `+919876543210`) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Optional | Contact email shown in footer |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical URL for sitemap/OG tags |

---

## Database Schema

### `equipment`
```sql
create table equipment (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null,  -- 'excavators' | 'cranes' | 'forklifts' | 'compactors' | 'telehandlers' | 'compressors'
  daily_rate numeric not null,
  image_url text,
  images text[] default '{}',
  is_available boolean default true,
  created_at timestamptz default now()
);
```

### `bookings`
```sql
create table bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  equipment_id uuid references equipment(id),
  customer_name text,
  customer_email text,
  customer_phone text,
  equipment_name text,
  start_date date,
  end_date date,
  total_amount numeric default 0,
  status text default 'pending',  -- 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes text,
  created_at timestamptz default now()
);
```

### `profiles`
```sql
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  phone text,
  role text default 'user',  -- 'user' | 'admin'
  created_at timestamptz default now()
);
```

### `reviews`
```sql
create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  equipment_id uuid references equipment(id) not null,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  unique (user_id, equipment_id)
);
```

---

## Supabase Storage

Create a **public** bucket named `equipment-images`.

Add a storage policy that allows authenticated users to upload:

```sql
-- INSERT policy for authenticated users
create policy "Authenticated users can upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'equipment-images');

-- SELECT policy for public read
create policy "Public read"
  on storage.objects for select
  to public
  using (bucket_id = 'equipment-images');
```

---

## Row Level Security (RLS)

Enable RLS on all tables. Recommended policies:

```sql
-- Equipment: public read
alter table equipment enable row level security;
create policy "Public read equipment" on equipment for select to public using (true);
create policy "Admin full access equipment" on equipment for all to authenticated
  using ((select role from profiles where id = auth.uid()) = 'admin');

-- Bookings: users see their own
alter table bookings enable row level security;
create policy "Users see own bookings" on bookings for select to authenticated
  using (user_id = auth.uid() or customer_email = (select email from profiles where id = auth.uid()));
create policy "Anyone can insert booking" on bookings for insert to public with check (true);
create policy "Admin full access bookings" on bookings for all to authenticated
  using ((select role from profiles where id = auth.uid()) = 'admin');
```

---

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin panel (role-protected)
│   ├── catalog/        # Equipment catalog + detail pages
│   ├── dashboard/      # User booking dashboard
│   ├── login/          # Auth pages
│   └── api/            # API routes (email, quote)
├── components/
│   ├── layout/         # Navbar, Footer
│   └── ui/             # Reusable UI components
├── hooks/
│   └── useUser.ts      # Auth state hook
├── lib/
│   ├── supabase.ts     # Supabase client (browser + server)
│   ├── constants.ts    # App-wide constants (phone, email, categories)
│   └── env.ts          # Environment variable validation
├── types/
│   └── index.ts        # Shared TypeScript interfaces
└── middleware.ts        # Route protection (SSR-correct Supabase session check)
```

---

## Admin Access

1. Create a user via Supabase Auth (email/password).
2. In the `profiles` table, set `role = 'admin'` for that user's row.
3. Navigate to `/admin` — middleware validates auth session and admin role before route access.

---

## Deployment (Vercel)

```bash
vercel --prod
```

Set all environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

Add the Supabase project URL to the `allowedOrigins` in your Supabase dashboard under **Authentication → URL Configuration**.
