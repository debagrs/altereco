-- ============================================================
-- AlterECO — API interna do Observatório
-- Persiste pesquisas realizadas pela conta administrativa.
-- ============================================================

create table if not exists public.observatorio_api_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  section text not null,
  scope text not null default 'ambos',
  query text not null,
  providers jsonb not null default '[]'::jsonb,
  result_count integer not null default 0,
  results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists observatorio_api_runs_user_created_idx
  on public.observatorio_api_runs(user_id, created_at desc);
create index if not exists observatorio_api_runs_section_idx
  on public.observatorio_api_runs(section);

alter table public.observatorio_api_runs enable row level security;

revoke all on public.observatorio_api_runs from anon;
revoke all on public.observatorio_api_runs from authenticated;
grant select, insert, delete on public.observatorio_api_runs to authenticated;
grant all on public.observatorio_api_runs to service_role;

drop policy if exists "observatorio_api_admin_read_own" on public.observatorio_api_runs;
create policy "observatorio_api_admin_read_own"
on public.observatorio_api_runs for select
to authenticated
using (
  user_id = (select auth.uid())
  and (select public.is_altereco_admin())
);

drop policy if exists "observatorio_api_admin_insert_own" on public.observatorio_api_runs;
create policy "observatorio_api_admin_insert_own"
on public.observatorio_api_runs for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and (select public.is_altereco_admin())
);

drop policy if exists "observatorio_api_admin_delete_own" on public.observatorio_api_runs;
create policy "observatorio_api_admin_delete_own"
on public.observatorio_api_runs for delete
to authenticated
using (
  user_id = (select auth.uid())
  and (select public.is_altereco_admin())
);
