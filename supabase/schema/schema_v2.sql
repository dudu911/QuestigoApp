-- ==============
-- USERS / PROFILES
-- ==============
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  locale text default 'en',
  created_at timestamptz default now()
);

-- ==============
-- QUESTS
-- ==============
create table quests (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references profiles(id) on delete set null,
  hero_image text,
  city text,       -- i18n key, e.g. "jerusalem"
  country text,    -- ISO code, e.g. "IL"
  latitude double precision,
  longitude double precision,
  created_at timestamptz default now()
);

create table quest_translations (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid references quests(id) on delete cascade,
  locale text not null check (locale in ('en','he')),
  title text not null,
  description text,
  unique(quest_id, locale)
);

-- ==============
-- RIDDLES
-- ==============
create table riddles (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid references quests(id) on delete cascade,
  latitude double precision not null,
  longitude double precision not null,
  radius_m integer default 30,
  order_index integer not null,
  image text,
  created_at timestamptz default now()
);

create table riddle_translations (
  id uuid primary key default gen_random_uuid(),
  riddle_id uuid references riddles(id) on delete cascade,
  locale text not null check (locale in ('en','he')),
  title text not null,
  prompt text not null,
  hint text,
  unique(riddle_id, locale)
);

create table riddle_answers (
  id uuid primary key default gen_random_uuid(),
  riddle_id uuid references riddles(id) on delete cascade,
  answer text not null,
  is_correct boolean default true
);

-- ==============
-- LOBBIES
-- ==============
create table lobbies (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  host_id uuid references profiles(id) on delete set null,
  quest_id uuid references quests(id) on delete cascade,
  status text default 'waiting' check (status in ('waiting','active','completed')),
  created_at timestamptz default now()
);

create table lobby_players (
  id uuid primary key default gen_random_uuid(),
  lobby_id uuid references lobbies(id) on delete cascade,
  player_id uuid references profiles(id) on delete cascade,
  is_host boolean default false,
  is_ready boolean default false,
  unique(lobby_id, player_id)
);

-- ==============
-- ECONOMY (Credits + Purchases)
-- ==============
create table user_credits (
  user_id uuid primary key references profiles(id) on delete cascade,
  balance integer default 0,
  updated_at timestamptz default now()
);

create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  package_id text not null,
  credits integer not null,
  amount numeric not null,
  currency text default 'USD',
  created_at timestamptz default now()
);


-- Make sure the "anon" and "authenticated" roles can use the schema
grant usage on schema public to postgres, anon, authenticated, service_role;

-- Allow CRUD operations on all tables in public
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;

-- Allow usage of sequences (for UUIDs/serials, etc.)
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

-- Make sure future tables automatically inherit
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;
