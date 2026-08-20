alter table public.content_items
  add column if not exists curator_ai_run_id uuid references public.curator_ai_runs(id) on delete set null,
  add column if not exists source_type text,
  add column if not exists source_metadata jsonb not null default '{}'::jsonb,
  add column if not exists verification_note text;

alter table public.curator_ai_runs
  add column if not exists content_item_id uuid references public.content_items(id) on delete set null;

create index if not exists content_items_curator_ai_run_idx
  on public.content_items(curator_ai_run_id);

create index if not exists curator_ai_runs_content_item_idx
  on public.curator_ai_runs(content_item_id);
