-- ============================================================
-- AlterECO — Agenda curada 2026–2028 + Fórum comunitário
-- Data: 2026-09-15
-- Segurança: RLS + privilégios mínimos; submissões públicas = pending.
-- ============================================================

-- ---------- AGENDA DE EVENTOS ----------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 4 and 180),
  organizer text not null check (char_length(trim(organizer)) between 2 and 180),
  description text not null check (char_length(trim(description)) between 20 and 1200),
  event_kind text not null default 'outro'
    check (event_kind in ('congresso','conferencia','simposio','encontro','curso','webinar','workshop','prazo','outro')),
  start_date date not null check (start_date between date '2026-01-01' and date '2035-12-31'),
  end_date date,
  format text not null default 'presencial'
    check (format in ('presencial','online','hibrido')),
  location text check (location is null or char_length(location) <= 180),
  city text check (city is null or char_length(city) <= 120),
  country text check (country is null or char_length(country) <= 120),
  source_url text not null check (source_url ~* '^https?://[^[:space:]]+$'),
  registration_url text check (registration_url is null or registration_url ~* '^https?://[^[:space:]]+$'),
  tags text[] not null default '{}',
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  submitted_by uuid references auth.users(id) on delete set null,
  submitter_name text check (submitter_name is null or char_length(submitter_name) <= 160),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  verified_at timestamptz,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or end_date >= start_date)
);

create index if not exists events_status_start_idx on public.events(status, start_date);
create index if not exists events_kind_idx on public.events(event_kind);
create index if not exists events_submitted_by_idx on public.events(submitted_by);
create index if not exists events_reviewed_by_idx on public.events(reviewed_by);

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

alter table public.events enable row level security;

drop policy if exists "events_public_read" on public.events;
drop policy if exists "events_member_read" on public.events;
drop policy if exists "events_public_submit" on public.events;
drop policy if exists "events_admin_update" on public.events;
drop policy if exists "events_admin_delete" on public.events;

create policy "events_public_read"
on public.events for select
to anon
using (status = 'approved');

create policy "events_member_read"
on public.events for select
to authenticated
using (
  status = 'approved'
  or submitted_by = (select auth.uid())
  or (select public.is_altereco_admin())
);

-- Visitantes e pessoas autenticadas podem SUGERIR, nunca publicar.
create policy "events_public_submit"
on public.events for insert
to anon, authenticated
with check (
  status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
  and rejection_reason is null
  and verified_at is null
  and featured = false
  and (submitted_by is null or submitted_by = (select auth.uid()))
);

create policy "events_admin_update"
on public.events for update
to authenticated
using ((select public.is_altereco_admin()))
with check ((select public.is_altereco_admin()));

create policy "events_admin_delete"
on public.events for delete
to authenticated
using ((select public.is_altereco_admin()));

-- Privilégios explícitos: importante para projetos Supabase atuais.
revoke all on table public.events from anon, authenticated;
grant select (id,title,organizer,description,event_kind,start_date,end_date,format,location,city,country,source_url,registration_url,tags,status,verified_at,featured,created_at,updated_at) on table public.events to anon;
grant insert (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, status, submitted_by, submitter_name, featured)
  on table public.events to anon;
grant select, insert, update, delete on table public.events to authenticated;
grant all on table public.events to service_role;

-- ---------- FÓRUM: categorias + moderação total ----------
alter table public.forum_topics add column if not exists category text not null default 'Discussão';
alter table public.forum_topics add column if not exists reviewed_by uuid references auth.users(id) on delete set null;
alter table public.forum_topics add column if not exists reviewed_at timestamptz;
alter table public.forum_topics add column if not exists rejection_reason text;
alter table public.forum_replies add column if not exists reviewed_by uuid references auth.users(id) on delete set null;
alter table public.forum_replies add column if not exists reviewed_at timestamptz;
alter table public.forum_replies add column if not exists rejection_reason text;
alter table public.forum_replies alter column status set default 'pending';

create index if not exists forum_topics_author_idx on public.forum_topics(author_id);
create index if not exists forum_topics_reviewed_by_idx on public.forum_topics(reviewed_by);
create index if not exists forum_replies_author_idx on public.forum_replies(author_id);
create index if not exists forum_replies_reviewed_by_idx on public.forum_replies(reviewed_by);

-- As funções auxiliares são usadas por políticas autenticadas, mas não precisam ser RPC públicas.
revoke execute on function public.is_active_altereco_member() from public, anon;
revoke execute on function public.is_altereco_admin() from public, anon;
grant execute on function public.is_active_altereco_member() to authenticated, service_role;
grant execute on function public.is_altereco_admin() to authenticated, service_role;

-- Regras de integridade para submissões vindas do frontend público.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'forum_topics_author_name_len') then
    alter table public.forum_topics add constraint forum_topics_author_name_len check (char_length(trim(author_name)) between 2 and 100);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'forum_topics_title_len') then
    alter table public.forum_topics add constraint forum_topics_title_len check (char_length(trim(title)) between 5 and 180);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'forum_topics_body_len') then
    alter table public.forum_topics add constraint forum_topics_body_len check (char_length(trim(body)) between 20 and 5000);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'forum_topics_category_allowed') then
    alter table public.forum_topics add constraint forum_topics_category_allowed check (category in ('Discussão','Métodos substitutivos','NAMs','Ensino','Pesquisa','Legislação e ética','Materiais e recursos','Dúvidas','Outros'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'forum_replies_author_name_len') then
    alter table public.forum_replies add constraint forum_replies_author_name_len check (char_length(trim(author_name)) between 2 and 100);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'forum_replies_body_len') then
    alter table public.forum_replies add constraint forum_replies_body_len check (char_length(trim(body)) between 3 and 3000);
  end if;
end $$;

-- Tópicos: leitura pública só dos aprovados; qualquer visitante pode enviar pending.
drop policy if exists "forum_topics_member_insert" on public.forum_topics;
drop policy if exists "forum_topics_public_submit" on public.forum_topics;
create policy "forum_topics_public_submit"
on public.forum_topics for insert
to anon, authenticated
with check (
  status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
  and rejection_reason is null
  and (author_id is null or author_id = (select auth.uid()))
);

-- Respostas: também entram como pending e só podem mirar tópico já aprovado.
drop policy if exists "forum_replies_member_insert" on public.forum_replies;
drop policy if exists "forum_replies_public_submit" on public.forum_replies;
create policy "forum_replies_public_submit"
on public.forum_replies for insert
to anon, authenticated
with check (
  status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
  and rejection_reason is null
  and (author_id is null or author_id = (select auth.uid()))
  and exists (
    select 1 from public.forum_topics t
    where t.id = topic_id and t.status = 'approved'
  )
);

-- Limita o que visitantes anônimos podem fazer via Data API.
revoke all on table public.forum_topics from anon;
revoke all on table public.forum_replies from anon;
grant select (id,author_name,title,body,category,status,created_at,updated_at) on table public.forum_topics to anon;
grant select (id,topic_id,author_name,body,status,created_at,updated_at) on table public.forum_replies to anon;
grant insert (author_id, author_name, title, body, category, status)
  on table public.forum_topics to anon;
grant insert (topic_id, author_id, author_name, body, status)
  on table public.forum_replies to anon;

-- Pessoas autenticadas mantêm compatibilidade com o dashboard existente;
-- RLS continua impedindo update/delete para quem não for admin.
revoke all on table public.forum_topics from authenticated;
revoke all on table public.forum_replies from authenticated;
grant select, insert, update, delete on table public.forum_topics, public.forum_replies to authenticated;
grant all on table public.forum_topics, public.forum_replies to service_role;

-- ---------- SEMENTES VERIFICADAS DA AGENDA ----------
-- O ON CONFLICT não é usado porque a tabela não tem unicidade artificial por título/data.
-- Cada INSERT testa título + data para que a migration continue idempotente.

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'ESTIV Congress 2026', 'European Society of Toxicology In Vitro (ESTIV)', '23º congresso internacional de toxicologia in vitro, com foco em NAMs, abordagens não animais e ciência regulatória.', 'congresso', date '2026-06-29', date '2026-07-02', 'presencial', 'MECC Maastricht', 'Maastricht', 'Países Baixos', 'https://www.estiv.org/congress2026/', 'https://www.estiv.org/congress2026/', array['NAMs','in vitro','toxicologia','3Rs'], 'approved', now()
where not exists (select 1 from public.events where title='ESTIV Congress 2026' and start_date=date '2026-06-29');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'Training School — A multi-disciplinary approach to human-relevant modelling', 'COST Action IMPROVE', 'Formação interdisciplinar dedicada a modelagem human-relevant e abordagens com potencial de reduzir e substituir modelos animais.', 'curso', date '2026-09-30', date '2026-10-01', 'presencial', 'Pisa', 'Pisa', 'Itália', 'https://cost-improve.eu/events/', 'https://cost-improve.eu/events/', array['human-relevant','modelagem','NAMs','formação'], 'approved', now()
where not exists (select 1 from public.events where title='Training School — A multi-disciplinary approach to human-relevant modelling' and start_date=date '2026-09-30');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'Final Conference — COST Action IMPROVE', 'COST Action IMPROVE', 'Conferência final da rede IMPROVE, articulando modelos avançados e abordagens human-relevant.', 'conferencia', date '2026-10-02', date '2026-10-02', 'presencial', 'Pisa', 'Pisa', 'Itália', 'https://cost-improve.eu/events/', 'https://cost-improve.eu/events/', array['human-relevant','NAMs','3Rs'], 'approved', now()
where not exists (select 1 from public.events where title='Final Conference — COST Action IMPROVE' and start_date=date '2026-10-02');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'LIVe2026 — Lung In Vitro event', 'European Society of Toxicology In Vitro / Epithelix', 'Encontro sobre modelos pulmonares preditivos in vitro para pesquisa, eficácia e avaliação de toxicidade.', 'encontro', date '2026-10-08', date '2026-10-09', 'presencial', 'Arch Parc Convention Centre', 'Archamps', 'França', 'https://www.estiv.org/event/live2026-lung-in-vitro-event/', 'https://www.estiv.org/event/live2026-lung-in-vitro-event/', array['in vitro','pulmão','toxicologia','NAMs'], 'approved', now()
where not exists (select 1 from public.events where title='LIVe2026 — Lung In Vitro event' and start_date=date '2026-10-08');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'ASCCT 15th Annual Meeting', 'American Society for Cellular and Computational Toxicology', 'Encontro anual dedicado à fronteira das NAMs em ciência, política regulatória e educação em toxicologia.', 'congresso', date '2026-10-27', date '2026-10-29', 'presencial', 'Durham Convention Center', 'Durham, NC', 'Estados Unidos', 'https://www.ascctox.org/annualmeeting', 'https://www.ascctox.org/annualmeeting', array['NAMs','toxicologia computacional','regulação'], 'approved', now()
where not exists (select 1 from public.events where title='ASCCT 15th Annual Meeting' and start_date=date '2026-10-27');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select '13th Annual 3Rs Symposium — Sessão 1', 'NIH OLAW e parceiros', 'Sessão 1 do simpósio virtual gratuito Innovative Uses for the 3Rs, dedicado a substituição, redução e refinamento. A programação ocorre em 2, 4, 10 e 12 de novembro.', 'simposio', date '2026-11-02', date '2026-11-02', 'online', 'Online', null, 'Online', 'https://grants.nih.gov/news-events/calendar-of-events/6a3ada95e0d1cce8010ef2e2', 'https://grants.nih.gov/news-events/calendar-of-events/6a3ada95e0d1cce8010ef2e2', array['3Rs','substituição','simpósio','online'], 'approved', now()
where not exists (select 1 from public.events where title='13th Annual 3Rs Symposium — Sessão 1' and start_date=date '2026-11-02');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select '13th Annual 3Rs Symposium — Sessão 2', 'NIH OLAW e parceiros', 'Sessão 2 do simpósio virtual gratuito Innovative Uses for the 3Rs, dedicado a substituição, redução e refinamento. A programação ocorre em 2, 4, 10 e 12 de novembro.', 'simposio', date '2026-11-04', date '2026-11-04', 'online', 'Online', null, 'Online', 'https://grants.nih.gov/news-events/calendar-of-events/6a3ada95e0d1cce8010ef2e2', 'https://grants.nih.gov/news-events/calendar-of-events/6a3ada95e0d1cce8010ef2e2', array['3Rs','substituição','simpósio','online'], 'approved', now()
where not exists (select 1 from public.events where title='13th Annual 3Rs Symposium — Sessão 2' and start_date=date '2026-11-04');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select '13th Annual 3Rs Symposium — Sessão 3', 'NIH OLAW e parceiros', 'Sessão 3 do simpósio virtual gratuito Innovative Uses for the 3Rs, dedicado a substituição, redução e refinamento. A programação ocorre em 2, 4, 10 e 12 de novembro.', 'simposio', date '2026-11-10', date '2026-11-10', 'online', 'Online', null, 'Online', 'https://grants.nih.gov/news-events/calendar-of-events/6a3ada95e0d1cce8010ef2e2', 'https://grants.nih.gov/news-events/calendar-of-events/6a3ada95e0d1cce8010ef2e2', array['3Rs','substituição','simpósio','online'], 'approved', now()
where not exists (select 1 from public.events where title='13th Annual 3Rs Symposium — Sessão 3' and start_date=date '2026-11-10');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select '13th Annual 3Rs Symposium — Sessão 4', 'NIH OLAW e parceiros', 'Sessão 4 do simpósio virtual gratuito Innovative Uses for the 3Rs, dedicado a substituição, redução e refinamento. A programação ocorre em 2, 4, 10 e 12 de novembro.', 'simposio', date '2026-11-12', date '2026-11-12', 'online', 'Online', null, 'Online', 'https://grants.nih.gov/news-events/calendar-of-events/6a3ada95e0d1cce8010ef2e2', 'https://grants.nih.gov/news-events/calendar-of-events/6a3ada95e0d1cce8010ef2e2', array['3Rs','substituição','simpósio','online'], 'approved', now()
where not exists (select 1 from public.events where title='13th Annual 3Rs Symposium — Sessão 4' and start_date=date '2026-11-12');


insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'EPAA Annual Conference 2026', 'European Partnership for Alternative Approaches to Animal Testing', 'Conferência anual sobre implementação do roadmap europeu e adoção de NAMs, com participação gratuita mediante inscrição.', 'conferencia', date '2026-11-17', date '2026-11-17', 'presencial', 'Albert Borschette Congress Center', 'Bruxelas', 'Bélgica', 'https://single-market-economy.ec.europa.eu/events/epaa-annual-conference-2026-2026-11-17_en', 'https://single-market-economy.ec.europa.eu/events/epaa-annual-conference-2026-2026-11-17_en', array['NAMs','regulação','3Rs','União Europeia'], 'approved', now()
where not exists (select 1 from public.events where title='EPAA Annual Conference 2026' and start_date=date '2026-11-17');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'EUSAAT Congress 2027', 'European Society for Alternatives to Animal Testing', 'Congresso europeu dedicado a alternativas ao uso de animais e implementação dos 3Rs.', 'congresso', date '2027-02-17', date '2027-02-19', 'presencial', 'Linz', 'Linz', 'Áustria', 'https://cost-improve.eu/events/', 'https://eusaat.eu/eusaat-congress/congress-information/', array['3Rs','alternativas','EUSAAT'], 'approved', now()
where not exists (select 1 from public.events where title='EUSAAT Congress 2027' and start_date=date '2027-02-17');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'Human Specific Research Conference 2027', 'Centre for Human Specific Research', 'Conferência interdisciplinar sobre pesquisa centrada em células, tecidos e dados humanos, incluindo MPS, organoides e abordagens in silico.', 'conferencia', date '2027-04-21', date '2027-04-22', 'presencial', 'Crowne Plaza Newcastle', 'Newcastle', 'Reino Unido', 'https://humanspecificresearch.org/human-specific-research-conference/', 'https://humanspecificresearch.org/human-specific-research-conference/', array['human-specific','organoides','MPS','in silico'], 'approved', now()
where not exists (select 1 from public.events where title='Human Specific Research Conference 2027' and start_date=date '2027-04-21');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'WC14 — prazo para submissão de resumos', 'Alternatives Congress Trust / WC14', 'Prazo oficial para submissão de resumos ao 14th World Congress on Alternatives and Animal Use in the Life Sciences.', 'prazo', date '2027-03-01', date '2027-03-01', 'online', 'Online', null, 'Online', 'https://www.wc14seoul.org/dates-deadlines/', 'https://www.wc14seoul.org/dates-deadlines/', array['WC14','prazo','resumos','NAMs'], 'approved', now()
where not exists (select 1 from public.events where title='WC14 — prazo para submissão de resumos' and start_date=date '2027-03-01');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'WC14 — 14th World Congress on Alternatives and Animal Use in the Life Sciences', 'Alternatives Congress Trust / KoCVAM / KoBIA', 'Congresso mundial dedicado aos 3Rs e às New Approach Methodologies (NAMs), com foco em inovação, validação, regulação e adoção internacional.', 'congresso', date '2027-08-15', date '2027-08-19', 'presencial', 'Seul', 'Seul', 'Coreia do Sul', 'https://www.wc14seoul.org/', 'https://www.wc14seoul.org/', array['WC14','NAMs','3Rs','substituição'], 'approved', now()
where not exists (select 1 from public.events where title='WC14 — 14th World Congress on Alternatives and Animal Use in the Life Sciences' and start_date=date '2027-08-15');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'ICT2028 — encerramento Early Bird', 'IUTOX / Society of Toxicology of Canada', 'Prazo de inscrição antecipada para o 18th International Congress of Toxicology.', 'prazo', date '2028-02-12', date '2028-02-12', 'online', 'Online', null, 'Online', 'https://ict2028.com/', 'https://ict2028.com/', array['ICT2028','toxicologia','NGRA','prazo'], 'approved', now()
where not exists (select 1 from public.events where title='ICT2028 — encerramento Early Bird' and start_date=date '2028-02-12');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'ICT2028 — IUTOX International Congress of Toxicology XVIII', 'IUTOX / Society of Toxicology of Canada', 'Congresso internacional de toxicologia com temas em inovação na avaliação de toxicidade, novas tecnologias e next-generation risk assessment.', 'congresso', date '2028-06-11', date '2028-06-14', 'presencial', 'Vancouver Convention Centre', 'Vancouver, BC', 'Canadá', 'https://ict2028.com/', 'https://ict2028.com/', array['ICT2028','toxicologia','NGRA','NAMs'], 'approved', now()
where not exists (select 1 from public.events where title='ICT2028 — IUTOX International Congress of Toxicology XVIII' and start_date=date '2028-06-11');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'EUROTOX 2026 — 60th Congress', 'Federation of European Toxicologists & European Societies of Toxicology', 'Congresso europeu de toxicologia com programação relacionada a métodos inovadores, avaliação de risco e abordagens relevantes para NAMs.', 'congresso', date '2026-09-13', date '2026-09-16', 'presencial', 'Vienna', 'Viena', 'Áustria', 'https://www.eurotox.com/annual-congress-awards/', 'https://www.eurotox.com/annual-congress-awards/', array['toxicologia','NAMs','avaliação de risco'], 'approved', now()
where not exists (select 1 from public.events where title='EUROTOX 2026 — 60th Congress' and start_date=date '2026-09-13');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'Eco-NAMs Webinar — QSARs to Predict Aquatic Toxicity', 'EMA / FDA / EPA / HESI / NIES / PETA Science Consortium', 'Webinar sobre uso de QSARs e outras NAMs para avaliação de ecotoxicidade, com foco em predição de toxicidade aquática.', 'webinar', date '2026-09-17', date '2026-09-17', 'online', 'Online', null, 'Online', 'https://www.fda.gov/news-events/fda-meetings-conferences-and-workshops/eco-nams-webinar-series-qsars-predict-aquatic-toxicity-09172026', 'https://www.fda.gov/news-events/fda-meetings-conferences-and-workshops/eco-nams-webinar-series-qsars-predict-aquatic-toxicity-09172026', array['Eco-NAMs','QSAR','ecotoxicologia','in silico'], 'approved', now()
where not exists (select 1 from public.events where title='Eco-NAMs Webinar — QSARs to Predict Aquatic Toxicity' and start_date=date '2026-09-17');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'Trans-NIH Mini-Symposium #3 — NAMs in HIV Research', 'National Institutes of Health (NIH)', 'Simpósio virtual sobre modelos human-relevant, prontidão de plataformas e caminhos de validação para NAMs na pesquisa pré-clínica em HIV.', 'simposio', date '2026-09-18', date '2026-09-18', 'online', 'Online', null, 'Online', 'https://scgcorp.com/namsforhiv2026/Agendas', 'https://scgcorp.com/namsforhiv2026/Agendas', array['NAMs','human-relevant','validação','HIV'], 'approved', now()
where not exists (select 1 from public.events where title='Trans-NIH Mini-Symposium #3 — NAMs in HIV Research' and start_date=date '2026-09-18');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'ESTIV Applied Training Course 2026', 'European Society of Toxicology In Vitro (ESTIV)', 'Curso aplicado com práticas em toxicologia in vitro, modelos de pele, olho, pulmão e trato gastrointestinal e sistemas microfluídicos.', 'curso', date '2026-09-20', date '2026-09-25', 'presencial', 'L’Oréal Research & Innovation Centre', 'Saint-Ouen-sur-Seine', 'França', 'https://www.estiv.org/projects-activities/training-course/organization/', 'https://www.estiv.org/projects-activities/training-course/organization/', array['in vitro','microfluídica','formação','toxicologia'], 'approved', now()
where not exists (select 1 from public.events where title='ESTIV Applied Training Course 2026' and start_date=date '2026-09-20');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'EPIC Webinar — Using NAMs under TSCA', 'US EPA / PETA Science Consortium / IIVS / California DPR', 'Webinar sobre uso de NAMs sob a legislação TSCA e aplicação de evidências para avaliação de carcinogenicidade.', 'webinar', date '2026-09-22', date '2026-09-22', 'online', 'Online', null, 'Online', 'https://www.thepsci.eu/epicwebinars/', 'https://www.thepsci.eu/epicwebinars/', array['NAMs','TSCA','regulação','EPA'], 'approved', now()
where not exists (select 1 from public.events where title='EPIC Webinar — Using NAMs under TSCA' and start_date=date '2026-09-22');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'ICCVAM Communities of Practice — Integration of NAMs Data', 'ICCVAM / NICEATM / NIH ORIVA', 'Webinar sobre integração de dados de NAMs em decisões regulatórias e estruturas de evidência.', 'webinar', date '2026-10-07', date '2026-10-07', 'online', 'Online', null, 'Online', 'https://ntp.niehs.nih.gov/whatwestudy/niceatm/3rs-meetings/commprac-2026', 'https://ntp.niehs.nih.gov/whatwestudy/niceatm/3rs-meetings/commprac-2026', array['ICCVAM','NAMs','regulação','validação'], 'approved', now()
where not exists (select 1 from public.events where title='ICCVAM Communities of Practice — Integration of NAMs Data' and start_date=date '2026-10-07');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'Cumbre NAMs — Inteligência Artificial em Toxicologia', 'Universidad CES', 'Webinar latino-americano sobre machine learning, QSAR, integração de dados in vitro, organoid intelligence e toxicologia preditiva.', 'webinar', date '2026-10-10', date '2026-10-10', 'online', 'Online', null, 'Online', 'https://www.ces.edu.co/cumbre-nams/webinars/', 'https://www.ces.edu.co/cumbre-nams/webinars/', array['NAMs','IA','QSAR','organoides','América Latina'], 'approved', now()
where not exists (select 1 from public.events where title='Cumbre NAMs — Inteligência Artificial em Toxicologia' and start_date=date '2026-10-10');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'Workshop — Alternative Methodologies in Pharmaceutical Development', 'NCI / NIH ORIVA', 'Workshop sobre validação, padronização e integração de NAMs no desenvolvimento farmacêutico, pesquisa biomédica e ciência regulatória.', 'workshop', date '2026-10-20', date '2026-10-21', 'hibrido', 'NIH Neuroscience Center Building / webcast', 'Rockville, MD', 'Estados Unidos', 'https://ntp.niehs.nih.gov/whatwestudy/niceatm/3rs-meetings/ampd-wksp-2026', 'https://ntp.niehs.nih.gov/whatwestudy/niceatm/3rs-meetings/ampd-wksp-2026', array['NAMs','fármacos','validação','regulação'], 'approved', now()
where not exists (select 1 from public.events where title='Workshop — Alternative Methodologies in Pharmaceutical Development' and start_date=date '2026-10-20');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'Workshop — Recent Developments in Human-Based Models', 'NIH ORIVA / DAIBR', 'Workshop sobre sistemas baseados em biologia humana, metodologias transformativas, integração in vitro/in silico e modelos de doenças humanas.', 'workshop', date '2026-10-22', date '2026-10-23', 'hibrido', 'NIH Neuroscience Center Building / webcast', 'Rockville, MD', 'Estados Unidos', 'https://ntp.niehs.nih.gov/whatwestudy/niceatm/3rs-meetings/daibr-wksp-2026', 'https://ntp.niehs.nih.gov/whatwestudy/niceatm/3rs-meetings/daibr-wksp-2026', array['human-based','NAMs','in vitro','in silico'], 'approved', now()
where not exists (select 1 from public.events where title='Workshop — Recent Developments in Human-Based Models' and start_date=date '2026-10-22');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'Cumbre NAMs — BraCVAM e RENAMA: validação e avanços regulatórios', 'Universidad CES / BraCVAM / FIOCRUZ', 'Webinar sobre BraCVAM e RENAMA, validação de métodos alternativos, OECD GD 34 e avanços regulatórios no Brasil e América Latina.', 'webinar', date '2026-11-07', date '2026-11-07', 'online', 'Online', null, 'Online', 'https://www.ces.edu.co/cumbre-nams/webinars/', 'https://www.ces.edu.co/cumbre-nams/webinars/', array['BraCVAM','RENAMA','Brasil','validação','NAMs'], 'approved', now()
where not exists (select 1 from public.events where title='Cumbre NAMs — BraCVAM e RENAMA: validação e avanços regulatórios' and start_date=date '2026-11-07');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'Animalfree Research Forum 2026', 'Animalfree Research', 'Fórum anual dedicado a pesquisa sem animais, tecnologias human-relevant e diálogo entre ciência, política e sociedade.', 'encontro', date '2026-11-09', date '2026-11-09', 'presencial', 'Zurich', 'Zurique', 'Suíça', 'https://www.altex.org/index.php/altex/Calendar', 'https://animalfree-research.org/en/forum/', array['animal-free','organoides','organ-on-chip','alternativas'], 'approved', now()
where not exists (select 1 from public.events where title='Animalfree Research Forum 2026' and start_date=date '2026-11-09');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select '2027 Microphysiological Systems World Summit', 'MPS World Summit', 'Encontro internacional dedicado a sistemas microfisiológicos que emulam biologia humana para pesquisa, desenvolvimento e avaliação de segurança.', 'congresso', date '2027-06-08', date '2027-06-11', 'presencial', 'Edinburgh International Conference Centre (EICC)', 'Edimburgo', 'Escócia', 'https://mpsworldsummit.org/', 'https://mpsworldsummit.org/', array['MPS','organ-on-chip','human-relevant','NAMs'], 'approved', now()
where not exists (select 1 from public.events where title='2027 Microphysiological Systems World Summit' and start_date=date '2027-06-08');

insert into public.events (title, organizer, description, event_kind, start_date, end_date, format, location, city, country, source_url, registration_url, tags, status, verified_at)
select 'EARA Conference 2027 — Animal research and new approaches', 'European Animal Research Association (EARA)', 'Conferência sobre comunicação, transparência e confiança pública em pesquisa biomédica, incluindo o debate sobre novas abordagens e NAMs.', 'conferencia', date '2027-11-04', date '2027-11-05', 'presencial', 'NOVA Medical School', 'Lisboa', 'Portugal', 'https://www.eara.eu/events/eara-conference-2027', 'https://www.eara.eu/events/eara-conference-2027', array['NAMs','comunicação científica','ética','transparência'], 'approved', now()
where not exists (select 1 from public.events where title='EARA Conference 2027 — Animal research and new approaches' and start_date=date '2027-11-04');

