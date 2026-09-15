import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
const PRIMARY_MODEL = Deno.env.get("GEMINI_OBSERVATORIO_MODEL") || Deno.env.get("GEMINI_MODEL") || "gemini-3.5-flash";
const FALLBACK_MODEL = Deno.env.get("GEMINI_OBSERVATORIO_FALLBACK_MODEL") || Deno.env.get("GEMINI_FALLBACK_MODEL") || "gemini-3.5-flash-lite";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";

function getSecretKey(): string {
  const current = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (current) {
    try {
      const parsed = JSON.parse(current);
      if (parsed?.default) return parsed.default;
    } catch (_) {}
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
}

const serviceKey = getSecretKey();
const admin = SUPABASE_URL && serviceKey
  ? createClient(SUPABASE_URL, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

type Evidence = {
  title: string;
  url: string;
  source: string;
  year?: string | number | null;
  authors?: string;
  journal?: string;
  snippet?: string;
  type?: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function normalizeUrl(value: unknown): string {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^doi:/i.test(raw)) return `https://doi.org/${raw.replace(/^doi:\s*/i, "")}`;
  if (/^10\.\d{4,9}\//.test(raw)) return `https://doi.org/${raw}`;
  return `https://${raw.replace(/^\/+/, "")}`;
}

function dedupeEvidence(items: Evidence[], limit = 18): Evidence[] {
  const seen = new Set<string>();
  const out: Evidence[] = [];
  for (const item of items) {
    const url = normalizeUrl(item.url);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push({ ...item, url });
    if (out.length >= limit) break;
  }
  return out;
}

function stripHtml(value: string): string {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function compact(value: unknown, max = 900): string {
  const text = stripHtml(String(value || ""));
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

async function fetchJson(url: string, timeoutMs = 8500): Promise<any | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "AlterECO-Observatorio/1.0 (academic research assistant)" },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (_) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function titleCaseName(author: any): string {
  return [author?.firstName, author?.lastName].filter(Boolean).join(" ") || "";
}

async function searchOpenAlex(query: string): Promise<Evidence[]> {
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=6&select=id,doi,title,publication_year,authorships,primary_location,abstract_inverted_index`;
  const data = await fetchJson(url);
  const results = Array.isArray(data?.results) ? data.results : [];
  return results.map((work: any) => {
    const authors = Array.isArray(work.authorships)
      ? work.authorships.slice(0, 4).map((a: any) => a?.author?.display_name).filter(Boolean).join(", ")
      : "";
    const journal = work?.primary_location?.source?.display_name || "";
    const url = work?.doi || work?.primary_location?.landing_page_url || work?.id || "";
    return {
      title: work?.title || "Publicação científica",
      url,
      source: "OpenAlex",
      year: work?.publication_year || null,
      authors,
      journal,
      type: "scientific",
    } as Evidence;
  }).filter((x: Evidence) => x.url && x.title);
}

async function searchEuropePMC(query: string): Promise<Evidence[]> {
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&pageSize=6&resultType=core`;
  const data = await fetchJson(url);
  const results = data?.resultList?.result || [];
  return results.map((r: any) => {
    let target = "";
    if (r?.doi) target = `https://doi.org/${r.doi}`;
    else if (r?.pmcid) target = `https://europepmc.org/article/PMC/${r.pmcid}`;
    else if (r?.pmid) target = `https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`;
    else if (r?.id) target = `https://europepmc.org/article/${r.source || "MED"}/${r.id}`;
    return {
      title: r?.title || "Artigo científico",
      url: target,
      source: "Europe PMC / PubMed",
      year: r?.pubYear || null,
      authors: r?.authorString || "",
      journal: r?.journalTitle || "",
      snippet: compact(r?.abstractText || "", 700),
      type: "scientific",
    } as Evidence;
  }).filter((x: Evidence) => x.url && x.title);
}

async function searchCrossref(query: string): Promise<Evidence[]> {
  const url = `https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(query)}&rows=5&select=DOI,title,author,published-print,published-online,container-title,type,abstract`;
  const data = await fetchJson(url);
  const items = data?.message?.items || [];
  return items.map((r: any) => {
    const dateParts = r?.["published-print"]?.["date-parts"]?.[0] || r?.["published-online"]?.["date-parts"]?.[0] || [];
    const authors = Array.isArray(r?.author)
      ? r.author.slice(0, 4).map((a: any) => [a?.given, a?.family].filter(Boolean).join(" ")).filter(Boolean).join(", ")
      : "";
    return {
      title: Array.isArray(r?.title) ? r.title[0] : (r?.title || "Publicação científica"),
      url: r?.DOI ? `https://doi.org/${r.DOI}` : "",
      source: "Crossref",
      year: dateParts?.[0] || null,
      authors,
      journal: Array.isArray(r?.["container-title"]) ? r["container-title"][0] : "",
      snippet: compact(r?.abstract || "", 650),
      type: "scientific",
    } as Evidence;
  }).filter((x: Evidence) => x.url && x.title);
}

const OFFICIAL_SOURCES = [
  { keys: ["abate", "frango", "bovino", "suino", "suíno", "consumo", "carne"], title: "Pesquisa Trimestral do Abate de Animais", source: "IBGE", url: "https://www.ibge.gov.br/estatisticas/economicas/agricultura-e-pecuaria/9203-pesquisas-trimestrais-do-abate-de-animais.html", type: "official" },
  { keys: ["experimenta", "concea", "animal em pesquisa", "uso de animais", "ceua"], title: "Conselho Nacional de Controle de Experimentação Animal (CONCEA)", source: "MCTI / CONCEA", url: "https://www.gov.br/mcti/pt-br/composicao/colegiados/concea", type: "official" },
  { keys: ["alternativ", "substitut", "nam", "3r", "replacement", "renama"], title: "Rede Nacional de Métodos Alternativos (RENAMA)", source: "MCTI / RENAMA", url: "https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/renama", type: "official" },
  { keys: ["tese", "disserta", "capes", "pos-gradu", "pós-gradua"], title: "Catálogo de Teses e Dissertações", source: "CAPES", url: "https://catalogodeteses.capes.gov.br/catalogo-teses/#!/", type: "official" },
  { keys: ["grupo", "cnpq", "dgp", "diretorio"], title: "Diretório dos Grupos de Pesquisa no Brasil", source: "CNPq / DGP", url: "https://lattes.cnpq.br/web/dgp", type: "official" },
  { keys: ["lei", "legisla", "maus-tratos", "maus tratos", "direito animal"], title: "Lei nº 14.064/2020", source: "Planalto", url: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l14064.htm", type: "official" },
  { keys: ["faostat", "global", "mundial", "produção animal", "producao animal"], title: "FAOSTAT", source: "FAO", url: "https://www.fao.org/faostat/", type: "official" },
  { keys: ["zoool", "zoo", "fauna", "cativeiro", "silvestre"], title: "Fauna", source: "IBAMA", url: "https://www.gov.br/ibama/pt-br/assuntos/biodiversidade-e-fauna", type: "official" },
];

function officialEvidence(query: string): Evidence[] {
  const q = query.toLowerCase();
  return OFFICIAL_SOURCES
    .filter((s) => s.keys.some((k) => q.includes(k)))
    .map((s) => ({ title: s.title, url: s.url, source: s.source, type: s.type }));
}

async function curatedAlterecoEvidence(question: string): Promise<Evidence[]> {
  if (!admin) return [];
  const tokens = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\W+/).filter((w) => w.length >= 5).slice(0, 5);
  try {
    let query = admin.from("content_items")
      .select("title,author_name,publication_year,subject_area,description,long_description,external_url,tags")
      .eq("status", "approved")
      .not("external_url", "is", null)
      .limit(8);
    if (tokens.length) {
      const filters = tokens.flatMap((word) => [
        `title.ilike.%${word}%`,
        `description.ilike.%${word}%`,
        `long_description.ilike.%${word}%`,
      ]);
      query = query.or(filters.join(","));
    }
    const { data, error } = await query;
    if (error || !Array.isArray(data)) return [];
    return data.map((item: any) => ({
      title: item.title || "Conteúdo AlterECO",
      url: item.external_url,
      source: item.author_name || "AlterECO · fonte cadastrada",
      year: item.publication_year || null,
      authors: item.author_name || "",
      journal: item.subject_area || "",
      snippet: compact(item.long_description || item.description || "", 700),
      type: "curated",
    })).filter((x: Evidence) => x.url);
  } catch (_) {
    return [];
  }
}

function localEvidenceFromBody(raw: unknown): Evidence[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 10).map((item: any) => ({
    title: compact(item?.title || item?.label || item?.source || "Dado do Observatório", 180),
    url: normalizeUrl(item?.url || item?.link || ""),
    source: compact(item?.source || item?.fonte || "Observatório AlterECO", 120),
    year: item?.year || item?.ano || null,
    snippet: compact(item?.snippet || item?.text || item?.value || "", 650),
    type: "observatory",
  })).filter((x: Evidence) => x.url);
}

function extractText(payload: any): string {
  const parts = payload?.candidates?.[0]?.content?.parts || [];
  return parts.filter((p: any) => typeof p?.text === "string" && !p?.thought).map((p: any) => p.text).join("\n").trim();
}

function extractGrounding(payload: any): Evidence[] {
  const metadata = payload?.candidates?.[0]?.groundingMetadata || {};
  const chunks = Array.isArray(metadata.groundingChunks) ? metadata.groundingChunks : [];
  return chunks
    .map((chunk: any) => chunk?.web)
    .filter((web: any) => web?.uri)
    .map((web: any) => ({ title: String(web.title || web.uri), url: String(web.uri), source: "Google Search", type: "web" }));
}

async function callGemini(model: string, question: string, history: any[], evidence: Evidence[]) {
  const evidenceText = evidence.map((e, i) => {
    const details = [e.authors, e.journal, e.year ? String(e.year) : ""].filter(Boolean).join(" · ");
    return `[${i + 1}] ${e.title}\nFonte: ${e.source}${details ? ` · ${details}` : ""}\nURL: ${e.url}${e.snippet ? `\nTrecho/metadado: ${e.snippet}` : ""}`;
  }).join("\n\n");

  const system = `Você é ECO OBSERVATÓRIO, assistente científico do Observatório Humano-Animal do AlterECO.\n\nREGRAS OBRIGATÓRIAS:\n1. Você NÃO é a ECO pública geral e NÃO é a ECO Curadoria. Seu papel é análise científica de dados e literatura.\n2. Baseie afirmações factuais SOMENTE nas evidências fornecidas abaixo e, quando necessário, em resultados recuperados pela pesquisa Google habilitada nesta chamada.\n3. Cada parágrafo que contenha um dado, número, conclusão científica, afirmação histórica, legal ou regulatória deve conter pelo menos uma citação no formato [1], [2] etc.\n4. Nunca invente percentuais, estimativas de subnotificação, autores, DOI, leis, datas, links, estudos ou relações causais.\n5. Diferencie claramente: dado oficial; artigo/revisão científica; conteúdo curado do AlterECO; hipótese/interpretação.\n6. Se as fontes não sustentarem uma afirmação, diga explicitamente: “As fontes recuperadas não permitem afirmar isso com segurança.”\n7. Prefira revisões sistemáticas, meta-análises, estudos revisados por pares e fontes oficiais.\n8. Não trate correlação como causalidade. Aponte limitações metodológicas e divergências entre fontes.\n9. Responda em português do Brasil, com clareza acadêmica, sem moralização.\n10. Termine com uma seção curta “Como interpretar” quando houver incerteza, limitação ou diferença entre fontes.\n11. NÃO crie uma seção de URLs no texto; a interface mostrará as referências clicáveis logo abaixo da resposta. Use apenas os marcadores [n].\n\nEVIDÊNCIAS PRÉ-RECUPERADAS:\n${evidenceText || "Nenhuma evidência pré-recuperada disponível."}`;

  const contents: any[] = [];
  const safeHistory = Array.isArray(history) ? history.slice(-8) : [];
  for (const turn of safeHistory) {
    if (!turn?.content) continue;
    contents.push({ role: turn.role === "assistant" ? "model" : "user", parts: [{ text: String(turn.content).slice(0, 3500) }] });
  }
  contents.push({ role: "user", parts: [{ text: question }] });

  const body: any = {
    systemInstruction: { parts: [{ text: system }] },
    contents,
    generationConfig: { temperature: 0.15, topP: 0.85, maxOutputTokens: 2600 },
    tools: [{ google_search: {} }],
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok || payload?.error) {
    const err = new Error(payload?.error?.message || `Gemini HTTP ${response.status}`);
    (err as any).status = response.status;
    throw err;
  }
  const answer = extractText(payload);
  if (!answer) throw new Error("O modelo retornou uma resposta vazia.");
  return { answer, payload };
}

async function synthesize(question: string, history: any[], evidence: Evidence[]) {
  if (!GEMINI_API_KEY) {
    return { answer: "A síntese por IA está temporariamente indisponível, mas as referências científicas e oficiais recuperadas estão listadas abaixo.", model: "evidence-only", extra: [] as Evidence[] };
  }
  try {
    const primary = await callGemini(PRIMARY_MODEL, question, history, evidence);
    return { answer: primary.answer, model: PRIMARY_MODEL, extra: extractGrounding(primary.payload) };
  } catch (error) {
    console.warn("Observatorio primary model failed:", (error as Error).message);
    if (FALLBACK_MODEL && FALLBACK_MODEL !== PRIMARY_MODEL) {
      try {
        const fallback = await callGemini(FALLBACK_MODEL, question, history, evidence);
        return { answer: fallback.answer, model: FALLBACK_MODEL, extra: extractGrounding(fallback.payload) };
      } catch (fallbackError) {
        console.warn("Observatorio fallback model failed:", (fallbackError as Error).message);
      }
    }
    const fallbackAnswer = evidence.length
      ? "Não foi possível gerar a síntese automática neste momento. Para não inventar uma resposta, apresento abaixo apenas as fontes científicas e oficiais recuperadas para esta pergunta."
      : "Não foi possível gerar uma resposta com evidência suficiente neste momento. Tente reformular a pergunta com um tema mais específico.";
    return { answer: fallbackAnswer, model: "evidence-only", extra: [] as Evidence[] };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  try {
    const body = await req.json();
    const question = String(body?.question || "").trim();
    if (question.length < 3) return json({ error: "Digite uma pergunta mais específica." }, 400);
    if (question.length > 1800) return json({ error: "Pergunta muito longa. Use até 1800 caracteres." }, 400);

    const [openAlex, europePmc, crossref, curated] = await Promise.all([
      searchOpenAlex(question),
      searchEuropePMC(question),
      searchCrossref(question),
      curatedAlterecoEvidence(question),
    ]);

    const local = localEvidenceFromBody(body?.localEvidence);
    const official = officialEvidence(question);
    const preEvidence = dedupeEvidence([...local, ...official, ...curated, ...europePmc, ...openAlex, ...crossref], 16);

    const synthesis = await synthesize(question, body?.history || [], preEvidence);
    const allEvidence = dedupeEvidence([...preEvidence, ...synthesis.extra], 20);

    return json({
      answer: synthesis.answer,
      model: synthesis.model,
      sources: allEvidence,
      evidenceCount: allEvidence.length,
      disclaimer: "Resposta assistida por IA. Verifique as fontes primárias antes de citar academicamente.",
    });
  } catch (error) {
    console.error("ECO Observatorio error:", error);
    return json({ error: error instanceof Error ? error.message : "Erro interno da ECO Observatório." }, 500);
  }
});
