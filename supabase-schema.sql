-- Supabase DB schema for Trackly
-- Use this SQL in Supabase SQL Editor or via migration.

-- 1. Profiles table to store user metadata linked to auth.users
--    The auth system already manages email/password, but we keep email
--    also on the profile for easier query and display.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  nickname text,
  country text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. User bikes: each user can add many bikes to their profile
create table if not exists user_bikes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  manufacturer text,
  model text,
  year int,
  category text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_user_bikes_user_id on user_bikes(user_id);

-- 3. Circuits: optional shared/canonical list of circuit names
create table if not exists circuits (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  country text,
  location text,
  length_meters int,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Track days: the main log for a full day on track
create table if not exists track_days (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  circuit_id uuid references circuits(id),
  circuit_name text not null,
  bike_id uuid references user_bikes(id),
  bike_name text not null,
  weather text,
  temperature_air numeric,
  temperature_track numeric,
  tyre_front text,
  tyre_rear text,
  pressure_front text,
  pressure_rear text,
  fork_compression text,
  fork_rebound text,
  fork_preload text,
  mono_compression text,
  mono_rebound text,
  mono_preload text,
  gearing text,
  fuel_load text,
  notes text,
  best_lap_time numeric,
  average_lap_time numeric,
  session_summary jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_track_days_user_id on track_days(user_id);
create index if not exists idx_track_days_circuit_id on track_days(circuit_id);
create index if not exists idx_track_days_bike_id on track_days(bike_id);
create index if not exists idx_track_days_date on track_days(date);
