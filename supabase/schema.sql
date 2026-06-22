-- Таблица записей дневника
create table diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  beer_id text not null,
  beer_name text not null,
  beer_image text,
  rating integer not null check (rating >= 0 and rating <= 10),
  rating_category text not null,
  user_type text,
  user_style text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index diary_entries_user_id_idx on diary_entries(user_id);

alter table diary_entries enable row level security;

create policy "Users can view own diary entries"
  on diary_entries for select using (auth.uid() = user_id);
create policy "Users can insert own diary entries"
  on diary_entries for insert with check (auth.uid() = user_id);
create policy "Users can update own diary entries"
  on diary_entries for update using (auth.uid() = user_id);
create policy "Users can delete own diary entries"
  on diary_entries for delete using (auth.uid() = user_id);

-- Таблица баров
create table bars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  country text not null,
  city text not null,
  address text,
  latitude double precision,
  longitude double precision,
  rating integer check (rating >= 0 and rating <= 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bars_user_id_idx on bars(user_id);

alter table bars enable row level security;

create policy "Users can view own bars"
  on bars for select using (auth.uid() = user_id);
create policy "Users can insert own bars"
  on bars for insert with check (auth.uid() = user_id);
create policy "Users can update own bars"
  on bars for update using (auth.uid() = user_id);
create policy "Users can delete own bars"
  on bars for delete using (auth.uid() = user_id);