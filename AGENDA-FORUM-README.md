# AlterECO — Agenda + Fórum (15/09/2026)

Esta atualização foi construída sobre o ZIP atual do projeto e mantém a stack existente: HTML, CSS, JavaScript e Supabase.

## Agenda

- calendário mensal responsivo com marcações nos dias;
- lista dos eventos do mês abaixo do calendário;
- atalhos para 2026, 2027 e 2028;
- filtros por tipo de evento;
- 29 eventos/próximos prazos pesquisados e cadastrados inicialmente;
- links de fonte oficial e, quando diferente, de inscrição;
- formulário público `Sugerir evento`;
- toda nova sugestão entra com `status = pending`;
- a administradora pode revisar, editar, aprovar, retirar ou excluir pelo dashboard.

## Fórum

O fórum adota uma lógica inspirada em fóruns de threads (como Reddit), sem copiar sua interface:

- tópicos por categoria;
- busca;
- ordenação por recentes ou mais comentados;
- respostas dentro de cada thread;
- tópicos e respostas enviados pelo público entram como `pending`;
- somente conteúdo aprovado fica visível publicamente;
- administração centralizada no dashboard.

A primeira versão não inclui upvotes/downvotes. A decisão é intencional: a prioridade é discussão qualificada e moderação curatorial, não ranking por popularidade.

## Banco de dados

A migration `supabase/migrations/20260915090000_agenda_forum_community.sql` contém:

- tabela `events`;
- RLS e privilégios mínimos para submissões públicas;
- extensão das tabelas existentes do fórum para categorias e revisão;
- índices para as novas relações;
- sementes idempotentes dos eventos pesquisados.

No projeto Supabase atual `altereco`, a estrutura e as sementes desta atualização foram aplicadas em 15/09/2026.

## Arquivos adicionados

- `community.js`
- `community.css`
- `admin-community.js`
- `AGENDA-FORUM-README.md`
- `supabase/migrations/20260915090000_agenda_forum_community.sql`

`index.html` também foi atualizado para carregar os novos módulos.

## Atualização do Observatório — 15/09/2026

- tipografia do Observatório normalizada pelo design system principal (Source Sans 3 para hierarquia/UI e Source Serif 4 para leitura);
- pesos e escalas tipográficas antigas do módulo limitados aos pesos realmente carregados pela plataforma;
- responsividade revisada nos 13 painéis do Observatório, incluindo grids inline legados e Assistente IA;
- contraste claro/escuro reforçado em superfícies, chips, formulários, links, avisos e Assistente IA;
- seção Educação reconstruída com componentes responsivos;
- 11 publicações em português adicionadas e classificadas entre `Educação Básica / Escolar` e `Ensino Superior / Universidade`;
- filtros por nível de ensino adicionados à bibliografia;
- KPIs antigos sem fonte explícita no projeto substituídos por indicadores auditáveis da própria base.
