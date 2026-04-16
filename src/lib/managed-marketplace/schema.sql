-- Managed Marketplace + Logistics schema (reference draft)

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  is_b2b boolean default false,
  company_name text,
  company_gst text,
  credit_limit numeric default 0,
  preferred_language text default 'en',
  created_at timestamptz default now()
);

create table if not exists depots (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  area text not null,
  latitude numeric not null,
  longitude numeric not null,
  service_radius_km int not null default 50
);

create table if not exists equipment (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  model text not null,
  category text not null,
  status text not null check (status in ('available', 'rented', 'maintenance')),
  depot_id uuid references depots(id),
  depreciation_value numeric not null,
  hour_meter_reading numeric default 0,
  last_service_date date,
  insurance_validity date,
  rc_book_number text,
  base_daily_rate numeric not null,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists operators (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  license_number text unique not null,
  specialization text not null,
  years_experience int not null,
  languages text[] default '{}',
  police_verified boolean default false,
  rating numeric default 0,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  equipment_id uuid references equipment(id),
  operator_id uuid references operators(id),
  booking_mode text not null check (booking_mode in ('b2c', 'b2b')),
  status text not null check (status in ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  city text not null,
  start_date date not null,
  end_date date not null,
  price_breakdown jsonb not null,
  gst_type text check (gst_type in ('cgst_sgst', 'igst')),
  project_mode boolean default false,
  account_manager text,
  created_at timestamptz default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  payment_method text not null check (payment_method in ('upi', 'card', 'netbanking')),
  payment_mode text not null check (payment_mode in ('advance_20', 'full')),
  amount numeric not null,
  status text not null default 'captured',
  provider_reference text,
  created_at timestamptz default now()
);

create table if not exists damage_claims (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  photos text[] default '{}',
  estimate_amount numeric not null default 0,
  liability_tier text not null check (liability_tier in ('basic', 'standard', 'premium')),
  resolution_status text not null check (resolution_status in ('open', 'review', 'resolved')),
  created_at timestamptz default now()
);
