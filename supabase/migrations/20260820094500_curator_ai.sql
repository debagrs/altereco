create table if not exists public.curator_ai_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  query text not null,
  focus text not null default 'geral',
  answer text,
  sources jsonb not null default '[]'::jsonb,
  search_queries jsonb not null default '[]'::jsonb,
  draft jsonb,
  model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists curator_ai_runs_user_created_idx
  on public.curator_ai_runs(user_id, created_at desc);

alter table public.curator_ai_runs enable row level security;

revoke all on public.curator_ai_runs from anon, authenticated;
grant all on public.curator_ai_runs to service_role;
