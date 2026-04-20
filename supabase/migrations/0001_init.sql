-- Bandirector initial schema

create extension if not exists "uuid-ossp";

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- songs
create table if not exists public.songs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  artist text not null,
  audio_storage_path text,
  key text,
  bpm numeric,
  feel text,
  analysis_json jsonb,
  lyrics_lrc text,
  uploaded_by uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','analyzing','ready','failed')),
  created_at timestamptz not null default now()
);

create index if not exists songs_status_idx on public.songs(status);
create index if not exists songs_title_artist_idx on public.songs using gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(artist,'')));

-- favorites
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, song_id)
);

-- rooms
create table if not exists public.rooms (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  host_id uuid not null references auth.users(id) on delete cascade,
  current_song_id uuid references public.songs(id) on delete set null,
  playback_state jsonb not null default '{"playing": false, "position_ms": 0, "updated_at": "1970-01-01T00:00:00Z"}'::jsonb,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create index if not exists rooms_code_idx on public.rooms(code);
create index if not exists rooms_host_idx on public.rooms(host_id);

-- room participants (guests identified by a signed cookie client-generated UUID)
create table if not exists public.room_participants (
  room_id uuid not null references public.rooms(id) on delete cascade,
  participant_id text not null,
  display_name text not null,
  instrument text,
  style text,
  joined_at timestamptz not null default now(),
  primary key (room_id, participant_id)
);

create index if not exists room_participants_room_idx on public.room_participants(room_id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.songs enable row level security;
alter table public.favorites enable row level security;
alter table public.rooms enable row level security;
alter table public.room_participants enable row level security;

-- profiles: readable by all authenticated users, updatable by self
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles
  for select using (true);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert with check (auth.uid() = id);

-- songs: readable by anyone (guests can jam), writable by authed
drop policy if exists "songs_select_all" on public.songs;
create policy "songs_select_all" on public.songs
  for select using (true);

drop policy if exists "songs_insert_authed" on public.songs;
create policy "songs_insert_authed" on public.songs
  for insert with check (auth.uid() = uploaded_by);

drop policy if exists "songs_update_any_authed" on public.songs;
create policy "songs_update_any_authed" on public.songs
  for update using (auth.uid() is not null);

-- favorites: private
drop policy if exists "favorites_own" on public.favorites;
create policy "favorites_own" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- rooms: readable by anyone (guests jam via code)
drop policy if exists "rooms_select_all" on public.rooms;
create policy "rooms_select_all" on public.rooms
  for select using (true);

drop policy if exists "rooms_insert_host" on public.rooms;
create policy "rooms_insert_host" on public.rooms
  for insert with check (auth.uid() = host_id);

drop policy if exists "rooms_update_host" on public.rooms;
create policy "rooms_update_host" on public.rooms
  for update using (auth.uid() = host_id);

drop policy if exists "rooms_delete_host" on public.rooms;
create policy "rooms_delete_host" on public.rooms
  for delete using (auth.uid() = host_id);

-- room_participants: readable by anyone, writable by anyone (guest-friendly)
-- The application enforces identity via signed cookie participant_id.
drop policy if exists "room_participants_select_all" on public.room_participants;
create policy "room_participants_select_all" on public.room_participants
  for select using (true);

drop policy if exists "room_participants_insert_all" on public.room_participants;
create policy "room_participants_insert_all" on public.room_participants
  for insert with check (true);

drop policy if exists "room_participants_update_all" on public.room_participants;
create policy "room_participants_update_all" on public.room_participants
  for update using (true);

drop policy if exists "room_participants_delete_all" on public.room_participants;
create policy "room_participants_delete_all" on public.room_participants
  for delete using (true);

-- Enable realtime
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.room_participants;
alter publication supabase_realtime add table public.songs;

-- storage bucket for songs (must be created via dashboard or CLI: `songs` public read)
-- Uploads allowed for authenticated users only.
