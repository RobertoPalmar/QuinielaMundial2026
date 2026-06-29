-- =====================================================================
-- Quiniela Mundial FIFA 2026 — esquema inicial
-- Tablas: profiles, rounds, matches, predictions
-- + RLS, helper is_admin(), trigger de alta de perfil, vista de scoring
-- =====================================================================

-- ---------- Extensiones ----------
create extension if not exists "pgcrypto";

-- ---------- profiles ----------
create table if not exists public.profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  username           text unique not null,
  role               text not null default 'user' check (role in ('user','admin')),
  group_stage_points integer not null default 0,
  created_at         timestamptz not null default now()
);

-- ---------- rounds ----------
create table if not exists public.rounds (
  id            serial primary key,
  slug          text unique not null,          -- '16avos','8vos','4tos','semis','tercer_lugar','final'
  name          text not null,
  ordinal       integer not null,              -- orden de la ronda
  locks_at      timestamptz,                   -- kickoff del primer partido = deadline
  is_open       boolean not null default false,
  exact_points  integer not null default 3,
  winner_points integer not null default 1
);

-- ---------- matches ----------
create table if not exists public.matches (
  id             serial primary key,
  round_id       integer not null references public.rounds(id) on delete cascade,
  api_fixture_id bigint unique,                -- id del fixture en API-Football
  home_team      text not null,
  away_team      text not null,
  kickoff_at     timestamptz,
  home_score     integer,                      -- marcador en vivo (viene de la API)
  away_score     integer,
  winner         text,                         -- equipo que avanza
  api_status     text,                         -- estado crudo API: NS,1H,HT,FT,AET,PEN...
  is_approved    boolean not null default false,
  approved_at    timestamptz,
  last_synced_at timestamptz
);
create index if not exists idx_matches_round on public.matches(round_id);

-- ---------- predictions ----------
create table if not exists public.predictions (
  id          serial primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  match_id    integer not null references public.matches(id) on delete cascade,
  pred_home   integer not null,
  pred_away   integer not null,
  pred_winner text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, match_id)
);
create index if not exists idx_predictions_user on public.predictions(user_id);
create index if not exists idx_predictions_match on public.predictions(match_id);

-- =====================================================================
-- Helpers
-- =====================================================================

-- Verifica si el usuario actual es admin (security definer evita recursion RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Alta automatica de perfil al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Impide que un usuario normal cambie su rol o sus puntos de grupos
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Solo restringe a usuarios finales reales. El service_role / SQL editor
  -- (auth.uid() null) es confiable y puede editar role/puntos libremente.
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.group_stage_points := old.group_stage_points;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_profile_update on public.profiles;
create trigger trg_guard_profile_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- updated_at automatico en predictions
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end;
$$;
drop trigger if exists trg_touch_predictions on public.predictions;
create trigger trg_touch_predictions
  before update on public.predictions
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- Vista de scoring (solo partidos aprobados)
-- =====================================================================
create or replace view public.v_user_scores as
select
  p.id                       as user_id,
  p.username,
  p.group_stage_points,
  coalesce(sum(
    case
      when pr.pred_home = m.home_score and pr.pred_away = m.away_score then r.exact_points
      when pr.pred_winner = m.winner then r.winner_points
      else 0
    end
  ), 0)                      as knockout_points,
  coalesce(sum(
    case
      when pr.pred_home = m.home_score and pr.pred_away = m.away_score then 1
      else 0
    end
  ), 0)                      as exact_hits,
  p.group_stage_points + coalesce(sum(
    case
      when pr.pred_home = m.home_score and pr.pred_away = m.away_score then r.exact_points
      when pr.pred_winner = m.winner then r.winner_points
      else 0
    end
  ), 0)                      as total_points
from public.profiles p
left join public.predictions pr on pr.user_id = p.id
left join public.matches m on m.id = pr.match_id and m.is_approved = true
left join public.rounds r on r.id = m.round_id
group by p.id, p.username, p.group_stage_points;

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles    enable row level security;
alter table public.rounds      enable row level security;
alter table public.matches     enable row level security;
alter table public.predictions enable row level security;

-- ----- profiles -----
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (true);                     -- lectura publica (ranking)

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
-- (el trigger guard_profile_update bloquea cambios de role/points)

-- ----- rounds -----
drop policy if exists rounds_select on public.rounds;
create policy rounds_select on public.rounds
  for select using (true);

drop policy if exists rounds_admin_write on public.rounds;
create policy rounds_admin_write on public.rounds
  for all using (public.is_admin()) with check (public.is_admin());

-- ----- matches -----
drop policy if exists matches_select on public.matches;
create policy matches_select on public.matches
  for select using (true);

drop policy if exists matches_admin_write on public.matches;
create policy matches_admin_write on public.matches
  for all using (public.is_admin()) with check (public.is_admin());

-- ----- predictions -----
-- lectura: propias siempre; ajenas solo tras el deadline de su ronda; admin todo
drop policy if exists predictions_select on public.predictions;
create policy predictions_select on public.predictions
  for select using (
    user_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.matches m
      join public.rounds r on r.id = m.round_id
      where m.id = predictions.match_id and now() >= r.locks_at
    )
  );

-- insert: solo propias y solo si la ronda esta abierta y antes del deadline
drop policy if exists predictions_insert on public.predictions;
create policy predictions_insert on public.predictions
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.matches m
      join public.rounds r on r.id = m.round_id
      where m.id = match_id and r.is_open = true and now() < r.locks_at
    )
  );

-- update: mismas condiciones
drop policy if exists predictions_update on public.predictions;
create policy predictions_update on public.predictions
  for update using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.matches m
      join public.rounds r on r.id = m.round_id
      where m.id = match_id and r.is_open = true and now() < r.locks_at
    )
  );

-- =====================================================================
-- Seed de rondas (16avos abierta; resto cerradas hasta que el admin abra)
-- locks_at de 16avos: ajustar al kickoff real del primer partido
-- =====================================================================
insert into public.rounds (slug, name, ordinal, is_open, locks_at) values
  ('16avos',       'Dieciseisavos de final', 1, true,  '2026-06-28 16:00:00+00'),
  ('8vos',         'Octavos de final',       2, false, null),
  ('4tos',         'Cuartos de final',       3, false, null),
  ('semis',        'Semifinales',            4, false, null),
  ('tercer_lugar', 'Tercer lugar',           5, false, null),
  ('final',        'Final',                  6, false, null)
on conflict (slug) do nothing;
