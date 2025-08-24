-- ===========================
-- PROFILES (extends auth.users)
-- ===========================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  locale text default 'en',
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ===========================
-- QUESTS
-- ===========================
create table if not exists quests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  city text,
  country text,
  hero_image text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

alter table quests enable row level security;

create policy "Anyone can read quests"
  on quests for select
  using (true);

-- ===========================
-- RIDDLES
-- ===========================
create table if not exists riddles (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid references quests(id) on delete cascade,
  title text not null,                        -- matches Zod title
  prompt text not null,                       -- matches Zod prompt
  image text,                                 -- optional image URL
  answer text not null,
  hint text,
  latitude double precision not null,
  longitude double precision not null,
  radius_m integer default 30,                -- matches radiusM
  order_index int not null,
  created_at timestamptz default now()
);


alter table riddles enable row level security;

create policy "Anyone can read riddles"
  on riddles for select
  using (true);

-- ===========================
-- LOBBIES
-- ===========================
create table if not exists lobbies (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  host_id uuid references profiles(id),
  quest_id uuid references quests(id),
  status text check (status in ('waiting','active','completed')) default 'waiting',
  created_at timestamptz default now()
);

alter table lobbies enable row level security;

create policy "Anyone can view lobbies"
  on lobbies for select
  using (true);

create policy "Hosts can update their lobby"
  on lobbies for update
  using (auth.uid() = host_id);

-- ===========================
-- LOBBY PLAYERS
-- ===========================
create table if not exists lobby_players (
  id uuid primary key default gen_random_uuid(),
  lobby_id uuid references lobbies(id) on delete cascade,
  player_id uuid references profiles(id) on delete cascade,
  is_host boolean default false,
  is_ready boolean default false,
  joined_at timestamptz default now(),
  unique (lobby_id, player_id)
);

alter table lobby_players enable row level security;

create policy "Players can view lobby players"
  on lobby_players for select
  using (true);

create policy "Player can insert themselves"
  on lobby_players for insert
  with check (auth.uid() = player_id);

create policy "Player can update themselves"
  on lobby_players for update
  using (auth.uid() = player_id);

-- ===========================
-- PURCHASES
-- ===========================
create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  package_id text not null,
  credits integer not null,
  amount decimal(10,2) not null,
  currency text default 'USD',
  created_at timestamptz default now()
);

alter table purchases enable row level security;

create policy "Users can view their purchases"
  on purchases for select
  using (auth.uid() = user_id);

create policy "Users can insert their purchases"
  on purchases for insert
  with check (auth.uid() = user_id);

-- ===========================
-- USER CREDITS
-- ===========================
create table if not exists user_credits (
  user_id uuid primary key references profiles(id) on delete cascade,
  balance integer not null default 0,
  updated_at timestamptz default now()
);

alter table user_credits enable row level security;

create policy "Users can view their credits"
  on user_credits for select
  using (auth.uid() = user_id);

create policy "System functions can update credits"
  on user_credits for update
  using (auth.uid() = user_id);
