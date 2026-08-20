import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
const PRIMARY_MODEL = Deno.env.get("GEMINI_CURATOR_MODEL") || Deno.env.get("GEMINI_MODEL") || "gemini-3.5-flash";
const FALLBACK_MODEL = Deno.env.get("GEMINI_CURATOR_FALLBACK_MODEL") || Deno.env.get("GEMINI_FALLBACK_MODEL") || "gemini-3.5-flash-lite";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";

function getSecretKey(): string {
  const current = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (current) {
    try {
      const parsed = JSON.parse(current);
      if (parsed?.default) return parsed.default;
    } catch (_) {
      // fallback legado abaixo
    }
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
}

const serviceKey = getSecretKey();
const admin = createClient(SUPABASE_URL, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const FOCUS_LABELS: Record<string, string> = {
  geral: "busca ampla e atualizada na web científica e institucional",
  concea: "CONCEA/MCTI, legislação brasileira, RENAMA e documentos oficiais brasileiros",
  interniche: "InterNICHE, recursos educacionais humanitários e alternativas no ensino",
  cientifico: "artigos científicos, PubMed, SciELO, periódicos, revisões e literatura acadêmica",
  metodos: "métodos substitutivos, NAMs, validação, OECD, EURL ECVAM, NC3Rs e órgãos regulatórios",
  legislacao: "legislação, normas, resoluções, guias regulatórios e status oficial de validação",
};

const PRIORITY_SOURCES = `
Fontes prioritárias a procurar, conforme pertinência:
- CONCEA / MCTI e páginas oficiais gov.br;
- RENAMA / MCTI;
- ANVISA;
- InterNICHE (interniche.org);
- PubMed / NCBI;
- SciELO;
- periódicos científicos e editoras acadêmicas reconhecidas;
- OECD Test Guidelines;
- EURL ECVAM / Joint Research Centre da Comissão Europeia;
- NC3Rs;
- FDA, EMA e demais órgãos regulatórios quando pertinentes;
- universidades, sociedades científicas e repositórios institucionais confiáveis.
`;

const CURATOR_SYSTEM_PROMPT = `
Você é ECO CURADORIA, uma ferramenta INTERNA do AlterECO para administradores e curadores.
Você NÃO é a assistente pública ECO. Seu papel é pesquisar, verificar, selecionar e preparar conteúdos reais para a plataforma.

OBJETIVO
Encontrar conteúdos reais, atuais e verificáveis sobre substituição do uso de animais no ensino e na pesquisa, educação humanitária, bioética, métodos substitutivos/NAMs, materiais didáticos, legislação, bases de dados, publicações e eventos.

REGRAS DE PESQUISA
1. Use a pesquisa Google quando ela puder melhorar a resposta. Busque fontes primárias e institucionais antes de blogs ou agregadores.
2. Nunca invente títulos, DOI, autores, datas, resoluções, links, validações ou instituições.
3. Dê preferência a páginas oficiais, artigos científicos, periódicos, repositórios universitários e organizações reconhecidas.
4. Diferencie claramente método validado/reconhecido, método promissor ainda não validado e recurso didático.
5. Para o Brasil, priorize CONCEA/MCTI, RENAMA, ANVISA e legislação oficial.
6. Para ensino humanitário, procure também InterNICHE e experiências universitárias documentadas.
7. Para evidência científica, procure PubMed, SciELO, periódicos e revisões; não trate uma notícia como evidência primária.
8. Se uma informação estiver incerta ou a fonte não puder ser verificada, sinalize isso e não recomende publicação automática.
9. Não publique nada sozinho. Produza pesquisa e rascunho para revisão humana do administrador.
10. Responda em português do Brasil, salvo pedido explícito em outro idioma.

FORMATO DA PESQUISA
- Síntese do que foi encontrado.
- 3 a 8 achados concretos, cada um com relevância para o AlterECO.
- Indique quais achados são candidatos fortes para virar conteúdo.
- Aponte eventuais lacunas ou pontos que precisam de checagem manual.
${PRIORITY_SOURCES}
`;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function safeFocus(value: unknown) {
  const focus = String(value || "geral").toLowerCase();
  return FOCUS_LABELS[focus] ? focus : "geral";
}

function getBearer(req: Request) {
  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return "";
  return auth.slice(7).trim();
}

async function requireAdmin(req: Request) {
  const token = getBearer(req);
  if (!token) throw new Error("Sessão administrativa ausente.");

  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData?.user) throw new Error("Sessão administrativa inválida ou expirada.");

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, role, active, full_name")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile || !profile.active || profile.role !== "admin") {
    throw new Error("A ECO Curadoria é restrita à administração do AlterECO.");
  }

  return { user: userData.user, profile };
}

function extractText(payload: any) {
  const parts = payload?.candidates?.[0]?.content?.parts || [];
  return parts
    .filter((part: any) => typeof part?.text === "string" && !part?.thought)
    .map((part: any) => part.text)
    .join("\n")
    .trim();
}

function extractGrounding(payload: any) {
  const metadata = payload?.candidates?.[0]?.groundingMetadata || {};
  const chunks = Array.isArray(metadata.groundingChunks) ? metadata.groundingChunks : [];
  const sources = chunks
    .map((chunk: any) => chunk?.web)
    .filter((web: any) => web?.uri)
    .map((web: any) => ({
      title: String(web.title || web.uri),
      url: String(web.uri),
    }));

  const deduped: Array<{ title: string; url: string }> = [];
  const seen = new Set<string>();
  for (const source of sources) {
    if (seen.has(source.url)) continue;
    seen.add(source.url);
    deduped.push(source);
  }

  return {
    sources: deduped.slice(0, 12),
    searchQueries: Array.isArray(metadata.webSearchQueries) ? metadata.webSearchQueries.slice(0, 12) : [],
    searchEntryPoint: metadata?.searchEntryPoint?.renderedContent || "",
  };
}

async function callGemini(
  model: string,
  contents: any[],
  systemText: string,
  options: { googleSearch?: boolean; jsonMode?: boolean } = {},
) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const body: any = {
    systemInstruction: { parts: [{ text: systemText }] },
    contents,
    generationConfig: {
      temperature: options.jsonMode ? 0.15 : 0.2,
      topP: 0.9,
      maxOutputTokens: options.jsonMode ? 2200 : 4200,
    },
  };

  if (options.googleSearch) {
    body.tools = [{ google_search: {} }];
  }
  if (options.jsonMode) {
    body.generationConfig.responseMimeType = "application/json";
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  if (!response.ok || payload?.error) {
    const error = new Error(payload?.error?.message || `Gemini HTTP ${response.status}`);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  const text = extractText(payload);
  if (!text) throw new Error("O Gemini retornou uma resposta vazia.");
  return { text, payload };
}

async function withFallback(
  contents: any[],
  systemText: string,
  options: { googleSearch?: boolean; jsonMode?: boolean } = {},
) {
  try {
    const result = await callGemini(PRIMARY_MODEL, contents, systemText, options);
    return { ...result, model: PRIMARY_MODEL };
  } catch (primaryError) {
    console.warn("Curator primary Gemini model failed:", (primaryError as Error).message);
    if (!FALLBACK_MODEL || FALLBACK_MODEL === PRIMARY_MODEL) throw primaryError;
    const result = await callGemini(FALLBACK_MODEL, contents, systemText, options);
    return { ...result, model: FALLBACK_MODEL };
  }
}

async function research(userId: string, query: string, focus: string) {
  const prompt = `
TEMA SOLICITADO PELO ADMINISTRADOR:
${query}

FOCO DESTA BUSCA:
${FOCUS_LABELS[focus]}

Faça uma pesquisa real na web agora. Procure especialmente fontes primárias e acadêmicas pertinentes. Não limite a busca ao que já existe no AlterECO.
Ao final, indique os melhores candidatos para cadastro e por quê.
`;

  const result = await withFallback(
    [{ role: "user", parts: [{ text: prompt }] }],
    CURATOR_SYSTEM_PROMPT,
    { googleSearch: true },
  );

  const grounding = extractGrounding(result.payload);

  const { data: run, error } = await admin
    .from("curator_ai_runs")
    .insert({
      user_id: userId,
      query,
      focus,
      answer: result.text,
      sources: grounding.sources,
      search_queries: grounding.searchQueries,
      model: result.model,
    })
    .select("id")
    .single();

  if (error) throw error;

  return {
    runId: run.id,
    answer: result.text,
    sources: grounding.sources,
    searchQueries: grounding.searchQueries,
    searchEntryPoint: grounding.searchEntryPoint,
    model: result.model,
  };
}

function cleanJsonText(text: string) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

async function createDraft(userId: string, runId: string, extraInstruction = "") {
  const { data: run, error } = await admin
    .from("curator_ai_runs")
    .select("id, user_id, query, focus, answer, sources")
    .eq("id", runId)
    .maybeSingle();

  if (error) throw error;
  if (!run || run.user_id !== userId) throw new Error("Pesquisa da curadoria não encontrada.");

  const sourceList = Array.isArray(run.sources)
    ? run.sources.map((source: any, i: number) => `${i + 1}. ${source.title} — ${source.url}`).join("\n")
    : "";

  const draftSystem = `
Você é a etapa editorial da ECO CURADORIA do AlterECO.
Transforme a pesquisa fornecida em UM candidato de conteúdo para a plataforma.
Use SOMENTE fatos sustentados pela pesquisa e pelas fontes apresentadas.
Não invente DOI, autores, títulos, datas, links ou validações.
Prefira como external_url uma fonte primária/oficial ou o artigo científico original.

Classifique a área usando APENAS um destes valores:
- metodos
- materiais
- publicacoes
- legislacao
- bases-dados
- eventos

Retorne APENAS JSON válido, sem markdown, neste formato:
{
  "title": "...",
  "author_name": "instituição ou autoria principal verificável",
  "area": "publicacoes",
  "tags": ["..."],
  "description": "resumo curto para card",
  "long_description": "texto editorial expandido, objetivo e contextualizado",
  "external_url": "https://...",
  "why_this_source": "por que esta fonte é adequada para o AlterECO",
  "verification_note": "o que ainda precisa de checagem humana, ou 'Fonte verificada na pesquisa'"
}
`;

  const prompt = `
CONSULTA ORIGINAL:
${run.query}

PESQUISA REALIZADA:
${run.answer}

FONTES RECUPERADAS:
${sourceList}

INSTRUÇÃO EXTRA DO ADMINISTRADOR:
${extraInstruction || "Escolha o candidato mais forte, atual, verificável e útil para o AlterECO."}
`;

  const result = await withFallback(
    [{ role: "user", parts: [{ text: prompt }] }],
    draftSystem,
    { jsonMode: true },
  );

  let draft: any;
  try {
    draft = JSON.parse(cleanJsonText(result.text));
  } catch (_) {
    throw new Error("A IA gerou um rascunho em formato inválido. Tente novamente.");
  }

  if (!draft?.title || !draft?.description || !draft?.external_url) {
    throw new Error("O rascunho não contém título, descrição e fonte verificável.");
  }

  const allowedAreas = new Set(["metodos", "materiais", "publicacoes", "legislacao", "bases-dados", "eventos"]);
  if (!allowedAreas.has(String(draft.area))) draft.area = "publicacoes";
  if (!Array.isArray(draft.tags)) draft.tags = [];

  const { error: updateError } = await admin
    .from("curator_ai_runs")
    .update({ draft, updated_at: new Date().toISOString() })
    .eq("id", runId)
    .eq("user_id", userId);
  if (updateError) throw updateError;

  return { runId, draft, model: result.model };
}

async function history(userId: string) {
  const { data, error } = await admin
    .from("curator_ai_runs")
    .select("id, query, focus, answer, sources, draft, model, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) throw error;
  return { runs: data || [] };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  if (!GEMINI_API_KEY) return json({ error: "GEMINI_API_KEY não configurada nos Secrets do Supabase." }, 503);
  if (!SUPABASE_URL || !serviceKey) return json({ error: "Configuração segura do Supabase indisponível." }, 503);

  try {
    const { user } = await requireAdmin(req);
    const body = await req.json();
    const action = String(body?.action || "research");

    if (action === "research") {
      const query = String(body?.query || "").trim();
      if (query.length < 3) return json({ error: "Digite um tema para pesquisar." }, 400);
      if (query.length > 1600) return json({ error: "A consulta está muito longa." }, 400);
      return json(await research(user.id, query, safeFocus(body?.focus)));
    }

    if (action === "draft") {
      const runId = String(body?.runId || "").trim();
      if (!runId) return json({ error: "runId obrigatório." }, 400);
      const extraInstruction = String(body?.instruction || "").trim().slice(0, 1200);
      return json(await createDraft(user.id, runId, extraInstruction));
    }

    if (action === "history") {
      return json(await history(user.id));
    }

    return json({ error: "Ação inválida." }, 400);
  } catch (error) {
    console.error("ECO Curadoria error:", error);
    const message = error instanceof Error ? error.message : "Erro interno da ECO Curadoria.";
    const status = /restrita|sessão/i.test(message) ? 403 : 500;
    return json({ error: message }, status);
  }
});
