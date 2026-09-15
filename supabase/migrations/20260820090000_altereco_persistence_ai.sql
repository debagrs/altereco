-- ============================================================
-- AlterECO — persistência integrada + fórum + Storage + ECO IA
-- Projeto: plzywjjrezuzmzskjgly
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- utilitário updated_at ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- perfis ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'curator',
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists role text default 'curator';
alter table public.profiles add column if not exists active boolean default false;
alter table public.profiles add column if not exists created_at timestamptz default now();
alter table public.profiles add column if not exists updated_at timestamptz default now();

update public.profiles set role = 'curator' where role is null;
update public.profiles set active = false where active is null;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'curator',
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_altereco on auth.users;
create trigger on_auth_user_created_altereco
after insert on auth.users
for each row execute function public.handle_new_user_profile();

insert into public.profiles (id, full_name, role, active)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  'curator',
  false
from auth.users u
on conflict (id) do nothing;

create or replace function public.is_active_altereco_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.active = true
      and p.role in ('admin', 'curator')
  );
$$;

create or replace function public.is_altereco_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.active = true
      and p.role = 'admin'
  );
$$;

revoke all on function public.is_active_altereco_member() from public;
revoke all on function public.is_altereco_admin() from public;
grant execute on function public.is_active_altereco_member() to authenticated, service_role;
grant execute on function public.is_altereco_admin() to authenticated, service_role;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_admin_select" on public.profiles;
drop policy if exists "profiles_update_own_name" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = (select auth.uid()));
create policy "profiles_admin_select"
on public.profiles for select
to authenticated
using ((select public.is_altereco_admin()));
create policy "profiles_update_own_name"
on public.profiles for update
to authenticated
using (id = (select auth.uid()) and active = true)
with check (id = (select auth.uid()) and active = true);

revoke all on public.profiles from anon;
revoke all on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;
grant all on public.profiles to service_role;

-- ---------- conteúdos curatoriais ----------
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author_name text not null,
  area text not null,
  tags text[] not null default '{}',
  description text not null,
  long_description text,
  external_url text,
  image_url text,
  status text not null default 'pending',
  submitted_by uuid references auth.users(id) on delete set null,
  reviewed_by uuid references auth.users(id) on delete set null,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  published_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.content_items add column if not exists title text;
alter table public.content_items add column if not exists author_name text;
alter table public.content_items add column if not exists area text;
alter table public.content_items add column if not exists tags text[] default '{}';
alter table public.content_items add column if not exists description text;
alter table public.content_items add column if not exists long_description text;
alter table public.content_items add column if not exists external_url text;
alter table public.content_items add column if not exists image_url text;
alter table public.content_items add column if not exists status text default 'pending';
alter table public.content_items add column if not exists submitted_by uuid references auth.users(id) on delete set null;
alter table public.content_items add column if not exists reviewed_by uuid references auth.users(id) on delete set null;
alter table public.content_items add column if not exists submitted_at timestamptz default now();
alter table public.content_items add column if not exists reviewed_at timestamptz;
alter table public.content_items add column if not exists published_at timestamptz;
alter table public.content_items add column if not exists rejection_reason text;
alter table public.content_items add column if not exists created_at timestamptz default now();
alter table public.content_items add column if not exists updated_at timestamptz default now();

create index if not exists content_items_status_idx on public.content_items(status);
create index if not exists content_items_submitted_by_idx on public.content_items(submitted_by);
create index if not exists content_items_submitted_at_idx on public.content_items(submitted_at desc);

drop trigger if exists set_content_items_updated_at on public.content_items;
create trigger set_content_items_updated_at
before update on public.content_items
for each row execute function public.set_updated_at();

alter table public.content_items enable row level security;

drop policy if exists "content_public_read" on public.content_items;
drop policy if exists "content_member_read" on public.content_items;
drop policy if exists "content_member_insert" on public.content_items;
drop policy if exists "content_admin_update" on public.content_items;
drop policy if exists "content_admin_delete" on public.content_items;

create policy "content_public_read"
on public.content_items for select
to anon
using (status = 'approved');

create policy "content_member_read"
on public.content_items for select
to authenticated
using (
  status = 'approved'
  or submitted_by = (select auth.uid())
  or (select public.is_altereco_admin())
);

create policy "content_member_insert"
on public.content_items for insert
to authenticated
with check (
  (select public.is_active_altereco_member())
  and submitted_by = (select auth.uid())
  and status = 'pending'
);

create policy "content_admin_update"
on public.content_items for update
to authenticated
using ((select public.is_altereco_admin()))
with check ((select public.is_altereco_admin()));

create policy "content_admin_delete"
on public.content_items for delete
to authenticated
using ((select public.is_altereco_admin()));

revoke all on public.content_items from anon;
revoke all on public.content_items from authenticated;
grant select on public.content_items to anon;
grant select, insert, update, delete on public.content_items to authenticated;
grant all on public.content_items to service_role;

create or replace function public.approve_content_item(content_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_altereco_admin() then
    raise exception 'Acesso administrativo necessário';
  end if;

  update public.content_items
  set status = 'approved',
      reviewed_by = auth.uid(),
      reviewed_at = now(),
      published_at = coalesce(published_at, now()),
      rejection_reason = null
  where id = content_id;
end;
$$;

create or replace function public.reject_content_item(content_id uuid, reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_altereco_admin() then
    raise exception 'Acesso administrativo necessário';
  end if;

  update public.content_items
  set status = 'rejected',
      reviewed_by = auth.uid(),
      reviewed_at = now(),
      rejection_reason = nullif(trim(reason), '')
  where id = content_id;
end;
$$;

revoke all on function public.approve_content_item(uuid) from public;
revoke all on function public.reject_content_item(uuid, text) from public;
grant execute on function public.approve_content_item(uuid) to authenticated, service_role;
grant execute on function public.reject_content_item(uuid, text) to authenticated, service_role;

-- ---------- fórum ----------
create table if not exists public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  title text not null,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.forum_topics(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  body text not null,
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists forum_topics_status_created_idx on public.forum_topics(status, created_at desc);
create index if not exists forum_topics_author_idx on public.forum_topics(author_id);
create index if not exists forum_replies_topic_idx on public.forum_replies(topic_id, created_at);

drop trigger if exists set_forum_topics_updated_at on public.forum_topics;
create trigger set_forum_topics_updated_at
before update on public.forum_topics
for each row execute function public.set_updated_at();

drop trigger if exists set_forum_replies_updated_at on public.forum_replies;
create trigger set_forum_replies_updated_at
before update on public.forum_replies
for each row execute function public.set_updated_at();

alter table public.forum_topics enable row level security;
alter table public.forum_replies enable row level security;

drop policy if exists "forum_topics_public_read" on public.forum_topics;
drop policy if exists "forum_topics_member_read" on public.forum_topics;
drop policy if exists "forum_topics_member_insert" on public.forum_topics;
drop policy if exists "forum_topics_admin_update" on public.forum_topics;
drop policy if exists "forum_topics_admin_delete" on public.forum_topics;

create policy "forum_topics_public_read"
on public.forum_topics for select
to anon
using (status = 'approved');

create policy "forum_topics_member_read"
on public.forum_topics for select
to authenticated
using (
  status = 'approved'
  or author_id = (select auth.uid())
  or (select public.is_altereco_admin())
);

create policy "forum_topics_member_insert"
on public.forum_topics for insert
to authenticated
with check (
  (select public.is_active_altereco_member())
  and author_id = (select auth.uid())
  and status = 'pending'
);

create policy "forum_topics_admin_update"
on public.forum_topics for update
to authenticated
using ((select public.is_altereco_admin()))
with check ((select public.is_altereco_admin()));

create policy "forum_topics_admin_delete"
on public.forum_topics for delete
to authenticated
using ((select public.is_altereco_admin()));

drop policy if exists "forum_replies_public_read" on public.forum_replies;
drop policy if exists "forum_replies_member_read" on public.forum_replies;
drop policy if exists "forum_replies_member_insert" on public.forum_replies;
drop policy if exists "forum_replies_admin_update" on public.forum_replies;
drop policy if exists "forum_replies_admin_delete" on public.forum_replies;

create policy "forum_replies_public_read"
on public.forum_replies for select
to anon
using (
  status = 'approved'
  and exists (
    select 1 from public.forum_topics t
    where t.id = topic_id and t.status = 'approved'
  )
);

create policy "forum_replies_member_read"
on public.forum_replies for select
to authenticated
using (
  status = 'approved'
  or author_id = (select auth.uid())
  or (select public.is_altereco_admin())
);

create policy "forum_replies_member_insert"
on public.forum_replies for insert
to authenticated
with check (
  (select public.is_active_altereco_member())
  and author_id = (select auth.uid())
  and status = 'approved'
  and exists (
    select 1 from public.forum_topics t
    where t.id = topic_id and t.status = 'approved'
  )
);

create policy "forum_replies_admin_update"
on public.forum_replies for update
to authenticated
using ((select public.is_altereco_admin()))
with check ((select public.is_altereco_admin()));

create policy "forum_replies_admin_delete"
on public.forum_replies for delete
to authenticated
using ((select public.is_altereco_admin()));

revoke all on public.forum_topics from anon;
revoke all on public.forum_topics from authenticated;
revoke all on public.forum_replies from anon;
revoke all on public.forum_replies from authenticated;
grant select on public.forum_topics, public.forum_replies to anon;
grant select, insert, update, delete on public.forum_topics, public.forum_replies to authenticated;
grant all on public.forum_topics, public.forum_replies to service_role;

-- Seed apenas quando o fórum ainda estiver vazio.
insert into public.forum_topics (id, author_id, author_name, title, body, status, created_at)
select
  '00000000-0000-4000-8000-000000000001'::uuid,
  null,
  'Equipe AlterECO',
  'Bem-vindos ao Fórum AlterECO!',
  'Este é um espaço para compartilhar experiências e dúvidas sobre métodos substitutivos, educação humanitária e substituição do uso de animais no ensino e na pesquisa.',
  'approved',
  now() - interval '2 days'
where not exists (select 1 from public.forum_topics);

insert into public.forum_topics (id, author_id, author_name, title, body, status, created_at)
select
  '00000000-0000-4000-8000-000000000002'::uuid,
  null,
  'Curadoria AlterECO',
  'Construção ética na universidade',
  'Como criar caminhos institucionais para substituir práticas com uso de animais por métodos humanitários, cientificamente robustos e adequados ao contexto de cada curso?',
  'approved',
  now() - interval '1 day'
where not exists (
  select 1 from public.forum_topics where id = '00000000-0000-4000-8000-000000000002'::uuid
);

-- ---------- Storage de imagens curatoriais ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'altereco-content',
  'altereco-content',
  true,
  8388608,
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "altereco_content_upload" on storage.objects;
drop policy if exists "altereco_content_update" on storage.objects;
drop policy if exists "altereco_content_delete" on storage.objects;

create policy "altereco_content_upload"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'altereco-content'
  and (select public.is_active_altereco_member())
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "altereco_content_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'altereco-content'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (select public.is_altereco_admin())
  )
)
with check (bucket_id = 'altereco-content');

create policy "altereco_content_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'altereco-content'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (select public.is_altereco_admin())
  )
);

-- ---------- conversas ECO IA (somente Edge Function/service role) ----------
create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  visitor_hash text,
  mode text not null default 'pesquisa',
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_conversations_owner_ck check (user_id is not null or visitor_hash is not null)
);

create table if not exists public.ai_messages (
  id bigint generated by default as identity primary key,
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  model text,
  created_at timestamptz not null default now()
);

create index if not exists ai_conversations_user_idx on public.ai_conversations(user_id, updated_at desc);
create index if not exists ai_conversations_visitor_idx on public.ai_conversations(visitor_hash, updated_at desc);
create index if not exists ai_messages_conversation_idx on public.ai_messages(conversation_id, created_at);

drop trigger if exists set_ai_conversations_updated_at on public.ai_conversations;
create trigger set_ai_conversations_updated_at
before update on public.ai_conversations
for each row execute function public.set_updated_at();

alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

revoke all on public.ai_conversations from anon, authenticated;
revoke all on public.ai_messages from anon, authenticated;
grant all on public.ai_conversations, public.ai_messages to service_role;

-- O service role da Edge Function é o único canal de leitura/escrita das conversas.
