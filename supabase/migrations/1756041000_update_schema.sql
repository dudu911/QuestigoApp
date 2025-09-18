-- Track per-user quest progress
-- Quest progress table
create table if not exists quest_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  quest_id uuid references quests(id) on delete cascade,
  riddle_index int not null default 0,
  hint_used boolean not null default false,
  updated_at timestamptz default now(),

  unique (user_id, quest_id)
);

-- Function to auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to update timestamp on row update
drop trigger if exists set_updated_at on quest_progress;
create trigger set_updated_at
before update on quest_progress
for each row
execute procedure update_updated_at_column();


-- Existing profile policy
create policy "Users can insert their own profile"
on profiles for insert
with check (auth.uid() = id);

-- Add coordinates to quests
alter table quests
  add column latitude double precision,
  add column longitude double precision;

-- Base riddle table (structural only)
create table riddles (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid references quests(id) on delete cascade,
  latitude double precision not null,
  longitude double precision not null,
  radius_m integer default 30,
  order_index integer not null,
  created_at timestamptz default now()
);

-- Translations for riddle text
create table riddle_translations (
  id uuid primary key default gen_random_uuid(),
  riddle_id uuid references riddles(id) on delete cascade,
  locale text not null check (locale in ('en','he')),
  title text not null,
  prompt text not null,
  hint text,
  unique(riddle_id, locale)
);

-- Answers table (many-to-one with riddles)
create table riddle_answers (
  id uuid primary key default gen_random_uuid(),
  riddle_id uuid references riddles(id) on delete cascade,
  answer text not null,
  is_correct boolean default true -- allows for trick/decoy answers later
);