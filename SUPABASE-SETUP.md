# AlterECO — ativação do Supabase + Gemini

O código já está preparado para o projeto Supabase `plzywjjrezuzmzskjgly`.

## 1. GitHub integration

No Supabase > Project Settings > Integrations > GitHub:

- Repository: `debagrs/altereco`
- Working directory: `.`
- Deploy to production: ON
- Production branch: `main`

Depois clique **Enable integration**.

Ao enviar estes arquivos para `main`, o Supabase aplica a migration e publica a Edge Function `ai-eco` declarada em `supabase/config.toml`.

## 2. Troque a chave Gemini antiga

A chave Gemini anterior estava gravada em `config.js`, portanto ficou exposta no navegador/GitHub. Revogue-a no Google AI Studio e crie uma chave nova.

Não coloque a chave nova em nenhum arquivo do GitHub.

## 3. Cadastre a chave nova no Supabase

Supabase > Edge Functions > Secrets (ou Project Settings > Edge Functions/Secrets, conforme a interface):

- Name: `GEMINI_API_KEY`
- Value: sua nova chave do Google AI Studio

O modelo padrão já está configurado como `gemini-3.5-flash`.

Opcionalmente, podem ser definidos:

- `GEMINI_MODEL=gemini-3.5-flash`
- `GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite`

## 4. O que passa a persistir

- Auth/Sessão: Supabase Auth
- Perfis e papéis: `profiles`
- Conteúdos enviados/curadoria: `content_items`
- Fórum: `forum_topics` e `forum_replies`
- Imagens enviadas: bucket `altereco-content`
- Conversas da ECO IA: `ai_conversations` e `ai_messages`

O navegador mantém apenas preferências locais e um identificador anônimo da conversa; o conteúdo do fórum e das conversas não depende mais de `localStorage`.

## 5. Primeiro acesso

Novas contas de Auth recebem perfil `curator` com `active=false`. Para liberar uma pessoa, ajuste o perfil em `profiles` para `active=true`. A conta administradora existente deve permanecer com `role=admin` e `active=true`.
