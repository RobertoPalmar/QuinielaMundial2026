-- =====================================================================
-- ranking_snapshots: standings capturadas ANTES de aplicar el último lote
-- de resultados. Se usan para mostrar el cambio de posición (↑/↓) de cada
-- participante en el ranking respecto al último snapshot registrado.
--
-- Escritura: solo server-side vía service_role (createAdminClient saltea RLS)
-- o admin. Lectura: pública, igual que la vista de scoring / matches / rounds.
-- =====================================================================

create table if not exists public.ranking_snapshots (
  id           bigserial primary key,
  user_id      uuid references public.profiles(id) on delete cascade,
  position     integer not null,
  total_points integer not null,
  snapshot_at  timestamptz not null default now()
);

-- Carga del último lote (rows con max snapshot_at) y lookup por usuario.
create index if not exists idx_ranking_snapshots_snapshot_at
  on public.ranking_snapshots(snapshot_at);
create index if not exists idx_ranking_snapshots_user
  on public.ranking_snapshots(user_id);

-- =====================================================================
-- Row Level Security (mismo patrón que matches / rounds)
-- =====================================================================
alter table public.ranking_snapshots enable row level security;

-- Lectura pública (el ranking la consume).
drop policy if exists ranking_snapshots_select on public.ranking_snapshots;
create policy ranking_snapshots_select on public.ranking_snapshots
  for select using (true);

-- Escritura solo admin. El service_role (server actions) saltea RLS de todos
-- modos; esta policy cubre el caso de un admin autenticado.
drop policy if exists ranking_snapshots_admin_write on public.ranking_snapshots;
create policy ranking_snapshots_admin_write on public.ranking_snapshots
  for all using (public.is_admin()) with check (public.is_admin());
