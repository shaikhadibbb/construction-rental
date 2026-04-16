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

-- loyaty system & contractor credits
create or replace function award_booking_credits()
returns trigger as $$
declare
  earned_credits numeric;
begin
  -- Award 2% of total_amount as credits points
  if new.status = 'confirmed' and (tg_op = 'INSERT' or old.status != 'confirmed') then
    earned_credits := round(new.total_amount * 0.02);
    update profiles set credits_balance = credits_balance + earned_credits where id = new.user_id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists booking_credits_trigger on bookings;
create trigger booking_credits_trigger
after insert or update on bookings
for each row execute function award_booking_credits();

-- redemption RPC
create or replace function spend_credits_and_book(
  p_user_id uuid,
  p_equipment_id uuid,
  p_start_date date,
  p_end_date date,
  p_total_before_discount numeric,
  p_credits_to_use numeric
) returns jsonb as $$
declare
  v_current_credits numeric;
  v_booking_id uuid;
  v_final_amount numeric;
begin
  -- 1. verify balance
  select credits_balance into v_current_credits from profiles where id = p_user_id for update;
  if p_credits_to_use > 0 and (v_current_credits is null or v_current_credits < p_credits_to_use) then
    raise exception 'Insufficient credits. You only have %', coalesce(v_current_credits, 0);
  end if;

  -- 2. deduct
  if p_credits_to_use > 0 then
    update profiles set credits_balance = credits_balance - p_credits_to_use where id = p_user_id;
  end if;

  v_final_amount := p_total_before_discount - p_credits_to_use;
  if v_final_amount < 0 then
    v_final_amount := 0;
  end if;

  -- 3. create booking
  insert into bookings (user_id, equipment_id, start_date, end_date, total_amount, status, booking_mode, city, price_breakdown) 
  values (p_user_id, p_equipment_id, p_start_date, p_end_date, v_final_amount, 'confirmed', 'b2c', 'Mumbai', '{}'::jsonb)
  returning id into v_booking_id;

  return jsonb_build_object('success', true, 'booking_id', v_booking_id, 'final_amount', v_final_amount);
end;
$$ language plpgsql;
