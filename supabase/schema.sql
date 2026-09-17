-- Retro Gaming Hub — community data schema
--
-- Run this once in your Supabase project's SQL editor (Project -> SQL Editor
-- -> New query). It's safe to re-run: every statement is idempotent.
--
-- There's no user-account system in the app (no login flow), so every writer
-- uses the public anon key. Each browser generates a random "device id" (see
-- src/lib/deviceId.ts) that's stored as voter_id/player_id purely to stop the
-- same browser from upvoting or marking "played" twice — it is not a secure
-- identity and should not be treated as one.

create extension if not exists "pgcrypto";

-- Games the community proposes adding to the catalog.
create table if not exists suggestions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  release_year integer,
  platform text,
  cover_url text,
  video_url text,
  reason text not null,
  submitted_by text default 'Anonymous',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- One row per (suggestion, browser) upvote.
create table if not exists suggestion_votes (
  id uuid primary key default gen_random_uuid(),
  suggestion_id uuid not null references suggestions (id) on delete cascade,
  voter_id text not null,
  created_at timestamptz not null default now(),
  unique (suggestion_id, voter_id)
);

-- Convenience view: suggestions with a live vote count, newest/most-voted first.
create or replace view suggestions_with_votes as
select
  s.*,
  count(v.id) as votes
from suggestions s
left join suggestion_votes v on v.suggestion_id = s.id
group by s.id;

-- Nostalgia comments / mini-reviews left under any game (curated catalog,
-- live-fetched catalog, or a suggestion — game_id is just a free-form string
-- matching whatever id the app used, so no foreign key here).
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  game_id text not null,
  author_name text not null default 'Anonymous',
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists comments_game_id_idx on comments (game_id);

-- "Played It!" badge — one row per (game, browser).
create table if not exists played_games (
  id uuid primary key default gen_random_uuid(),
  game_id text not null,
  player_id text not null,
  created_at timestamptz not null default now(),
  unique (game_id, player_id)
);
create index if not exists played_games_game_id_idx on played_games (game_id);

-- Convenience view: how many distinct browsers marked each game played.
create or replace view played_counts as
select game_id, count(*) as played_count
from played_games
group by game_id;

-- Row Level Security: this is a public, anonymous community board (no login),
-- so the anon key needs insert + select on everything. Nobody can update or
-- delete existing rows from the client — that's intentionally left for you to
-- do from the Supabase dashboard (e.g. to moderate spam or approve a
-- suggestion) using the service-role key, never the public anon key.

alter table suggestions enable row level security;
alter table suggestion_votes enable row level security;
alter table comments enable row level security;
alter table played_games enable row level security;

drop policy if exists "public read suggestions" on suggestions;
create policy "public read suggestions" on suggestions for select using (true);
drop policy if exists "public insert suggestions" on suggestions;
create policy "public insert suggestions" on suggestions for insert with check (true);

drop policy if exists "public read suggestion_votes" on suggestion_votes;
create policy "public read suggestion_votes" on suggestion_votes for select using (true);
drop policy if exists "public insert suggestion_votes" on suggestion_votes;
create policy "public insert suggestion_votes" on suggestion_votes for insert with check (true);

drop policy if exists "public read comments" on comments;
create policy "public read comments" on comments for select using (true);
drop policy if exists "public insert comments" on comments;
create policy "public insert comments" on comments for insert with check (true);

drop policy if exists "public read played_games" on played_games;
create policy "public read played_games" on played_games for select using (true);
drop policy if exists "public insert played_games" on played_games;
create policy "public insert played_games" on played_games for insert with check (true);
