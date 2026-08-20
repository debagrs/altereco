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
const GOOGLE_SEARCH_ENABLED = String(Deno.env.get("GEMINI_GOOGLE_SEARCH_ENABLED") || "false").toLowerCase() === "true";
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
const admin = createClient(SUPABASE_URL, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const FOCUS_LABELS: Record<string, string> = {
  geral: "busca ampla e atualizada em fontes científicas e institucionais",
  concea: "CONCEA/MCTI, legislação brasileira, RENAMA e documentos oficiais brasileiros",
  interniche: "InterNICHE, recursos educacionais humanitários e alternativas no ensino",
  cientifico: "artigos científicos, PubMed/Europe PMC, OpenAlex, Crossref, periódicos e literatura acadêmica",
  metodos: "métodos substitutivos, NAMs, validação, OECD, EURL ECVAM, NC3Rs e órgãos regulatórios",
  legislacao: "legislação, normas, resoluções, guias regulatórios e status oficial de validação",
};

const CURATOR_SYSTEM_PROMPT = `
Você é ECO CURADORIA, ferramenta INTERNA do AlterECO para administradores.
Você NÃO é a assistente pública ECO. Seu papel é pesquisar, verificar, selecionar e preparar conteúdos reais para revisão humana.

REGRAS:
1. Use somente as fontes recuperadas e fornecidas no contexto. Nunca invente títulos, autores, DOI, datas, resoluções ou links.
2. Priorize fontes primárias, institucionais e acadêmicas.
3. Diferencie método validado/reconhecido, método promissor ainda não validado e recurso didático.
4. Para Brasil, valorize CONCEA/MCTI, RENAMA, ANVISA e legislação oficial.
5. Para ensino humanitário, considere InterNICHE e literatura acadêmica documentada.
6. Para evidência científica, priorize artigos, revisões e metadados acadêmicos verificáveis.
7. Se algo não puder ser confirmado, sinalize explicitamente.
8. Não publique automaticamente. Tudo deve passar pela fila de aprovação do AlterECO.
9. Responda em português do Brasil.
`;

type CuratorSource = {
  title: string;
  url: string;
  source: string;
  snippet?: string;
  year?: string | number | null;
  authors?: string;
  doi?: string;
  type?: string;
  image_url?: string | null;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function safeFocus(value: unknown) {
  const focus = String(value || "geral").toLowerCase();
  return FOCUS_LABELS[focus] ? focus : "geral";
}

function getBearer(req: Request) {
  const auth = req.headers.get("Authorization") || "";
  return auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
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

function stripHtml(value: string) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeText(value: string) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function queryTerms(query: string) {
  const stop = new Set(["sobre", "para", "como", "com", "sem", "uma", "uns", "das", "dos", "que", "por", "uso", "animais", "animal", "ensino", "pesquisa", "metodos", "metodo", "alternativos", "alternativo", "substitutivos", "substitutivo"]);
  return normalizeText(query).split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !stop.has(w)).slice(0, 10);
}

function englishQuery(query: string) {
  let q = normalizeText(query);
  const replacements: Array<[RegExp, string]> = [
    [/metodos? (alternativos?|substitutivos?)/g, "replacement alternatives"],
    [/uso de animais/g, "animal use"],
    [/ensino/g, "education teaching"],
    [/pesquisa/g, "research"],
    [/fisiologia/g, "physiology"],
    [/farmacologia/g, "pharmacology"],
    [/anatomia/g, "anatomy"],
    [/toxicologia/g, "toxicology"],
    [/experimentacao animal/g, "animal experimentation"],
    [/educacao humanitaria/g, "humane education"],
    [/metodos sem animais/g, "non-animal methods"],
  ];
  for (const [pattern, value] of replacements) q = q.replace(pattern, value);
  if (!/replacement|non-animal|animal use|alternatives/.test(q)) q += " non-animal replacement alternatives";
  return q.replace(/\s+/g, " ").trim();
}

async function fetchJsonSafe(url: string) {
  try {
    const response = await fetch(url, {
      headers: { "Accept": "application/json", "User-Agent": "AlterECO-Curadoria/1.0" },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (_) {
    return null;
  }
}

async function fetchTextSafe(url: string) {
  try {
    const response = await fetch(url, {
      headers: { "Accept": "text/html,application/xhtml+xml", "User-Agent": "Mozilla/5.0 AlterECO-Curadoria/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(6500),
    });
    if (!response.ok) return "";
    return await response.text();
  } catch (_) {
    return "";
  }
}

function abstractFromInvertedIndex(index: Record<string, number[]> | null | undefined) {
  if (!index || typeof index !== "object") return "";
  const words: Array<{ word: string; pos: number }> = [];
  for (const [word, positions] of Object.entries(index)) {
    if (!Array.isArray(positions)) continue;
    for (const pos of positions) words.push({ word, pos: Number(pos) });
  }
  return words
    .filter((item) => Number.isFinite(item.pos))
    .sort((a, b) => a.pos - b.pos)
    .map((item) => item.word)
    .join(" ")
    .slice(0, 1100);
}

function getMetaContent(html: string, keys: string[]) {
  for (const key of keys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`, "i"),
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) return stripHtml(match[1]);
    }
  }
  return "";
}

function normalizeImageUrl(value: string, pageUrl: string) {
  if (!value) return null;
  try {
    const resolved = new URL(value, pageUrl).toString();
    if (!/^https?:\/\//i.test(resolved)) return null;
    const lower = resolved.toLowerCase();
    if (/placeholder|spacer|sprite|favicon|logo(?:[._-]|$)|avatar/.test(lower)) return null;
    return resolved;
  } catch (_) {
    return null;
  }
}

function extractPageMeta(html: string, pageUrl: string) {
  if (!html) return { description: "", image_url: null as string | null };
  const description = getMetaContent(html, ["description", "og:description", "twitter:description"]);
  const imageRaw = getMetaContent(html, ["og:image", "og:image:url", "twitter:image", "twitter:image:src"]);
  return {
    description: description.slice(0, 1100),
    image_url: normalizeImageUrl(imageRaw, pageUrl),
  };
}

async function enrichSource(source: CuratorSource): Promise<CuratorSource> {
  const hasGoodSnippet = String(source.snippet || "").trim().length >= 120;
  if (hasGoodSnippet && source.image_url) return source;
  const html = await fetchTextSafe(source.url);
  if (!html) return source;
  const meta = extractPageMeta(html, source.url);
  return {
    ...source,
    snippet: hasGoodSnippet ? source.snippet : (meta.description || source.snippet || ""),
    image_url: source.image_url || meta.image_url,
  };
}

async function enrichSources(sources: CuratorSource[]) {
  const enriched = await Promise.allSettled(sources.map(enrichSource));
  return enriched.map((result, index) => result.status === "fulfilled" ? result.value : sources[index]);
}

async function searchOpenAlex(query: string): Promise<CuratorSource[]> {
  const q = englishQuery(query);
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(q)}&per-page=8`;
  const payload = await fetchJsonSafe(url);
  const results = Array.isArray(payload?.results) ? payload.results : [];
  return results.map((item: any) => {
    const authors = Array.isArray(item.authorships)
      ? item.authorships.slice(0, 5).map((a: any) => a?.author?.display_name).filter(Boolean).join(", ")
      : "";
    const doi = String(item.doi || "").replace(/^https?:\/\/doi\.org\//i, "");
    const landing = item?.primary_location?.landing_page_url || item?.doi || item?.id || "";
    return {
      title: String(item.title || "Obra indexada no OpenAlex"),
      url: String(landing),
      source: "OpenAlex",
      year: item.publication_year || null,
      authors,
      doi,
      type: item.type || "article",
      snippet: abstractFromInvertedIndex(item.abstract_inverted_index) || [item?.primary_location?.source?.display_name, item.publication_year].filter(Boolean).join(" · "),
    };
  }).filter((s: CuratorSource) => s.url && s.title);
}

async function searchEuropePMC(query: string): Promise<CuratorSource[]> {
  const q = englishQuery(query);
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(q)}&format=json&pageSize=8&resultType=core`;
  const payload = await fetchJsonSafe(url);
  const results = Array.isArray(payload?.resultList?.result) ? payload.resultList.result : [];
  return results.map((item: any) => {
    const doi = String(item.doi || "").trim();
    const target = doi ? `https://doi.org/${doi}` : item.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/` : item.id ? `https://europepmc.org/article/${item.source || "MED"}/${item.id}` : "";
    return {
      title: String(item.title || "Registro Europe PMC"),
      url: target,
      source: "Europe PMC / PubMed",
      year: item.pubYear || null,
      authors: String(item.authorString || ""),
      doi,
      type: item.pubType || "article",
      snippet: String(item.abstractText || item.journalTitle || "").slice(0, 700),
    };
  }).filter((s: CuratorSource) => s.url && s.title);
}

async function searchCrossref(query: string): Promise<CuratorSource[]> {
  const q = englishQuery(query);
  const url = `https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(q)}&rows=8`;
  const payload = await fetchJsonSafe(url);
  const items = Array.isArray(payload?.message?.items) ? payload.message.items : [];
  return items.map((item: any) => {
    const title = Array.isArray(item.title) ? item.title[0] : item.title;
    const doi = String(item.DOI || "");
    const authors = Array.isArray(item.author)
      ? item.author.slice(0, 5).map((a: any) => [a.given, a.family].filter(Boolean).join(" ")).filter(Boolean).join(", ")
      : "";
    const year = item?.published?.["date-parts"]?.[0]?.[0] || item?.issued?.["date-parts"]?.[0]?.[0] || null;
    return {
      title: String(title || "Registro Crossref"),
      url: doi ? `https://doi.org/${doi}` : String(item.URL || ""),
      source: "Crossref",
      year,
      authors,
      doi,
      type: item.type || "article",
      snippet: stripHtml(String(item.abstract || "")) || [Array.isArray(item["container-title"]) ? item["container-title"][0] : "", item.publisher].filter(Boolean).join(" · "),
    };
  }).filter((s: CuratorSource) => s.url && s.title);
}

function extractLinks(html: string, baseUrl: string, preferredTerms: string[]): CuratorSource[] {
  const out: CuratorSource[] = [];
  const regex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const label = stripHtml(match[2]);
    if (label.length < 6 || label.length > 260) continue;
    const hay = normalizeText(label);
    const relevant = preferredTerms.length === 0 || preferredTerms.some((term) => hay.includes(term));
    if (!relevant) continue;
    let url = match[1];
    try { url = new URL(url, baseUrl).toString(); } catch (_) { continue; }
    if (!/^https?:\/\//i.test(url)) continue;
    out.push({ title: label, url, source: new URL(baseUrl).hostname, type: "institutional" });
  }
  return out;
}

async function searchConcea(query: string): Promise<CuratorSource[]> {
  const base = "https://www.gov.br/mcti/pt-br/composicao/colegiados/concea";
  const pages = [base, `${base}/arquivos`];
  const qTerms = queryTerms(query);
  const priority = [...new Set([...qTerms, "substitut", "alternativ", "ensino", "resolu", "nota", "repositorio", "metodo", "legisl", "renama"])];
  const chunks = await Promise.all(pages.map(fetchTextSafe));
  const links = chunks.flatMap((html, i) => extractLinks(html, pages[i], priority));
  return links.slice(0, 10).map((s) => ({ ...s, source: "CONCEA / MCTI" }));
}

async function searchInterniche(query: string): Promise<CuratorSource[]> {
  const pages = [
    "https://www.interniche.org/en/alternatives",
    "https://www.interniche.org/en/studies",
  ];
  const qTerms = queryTerms(query);
  const priority = [...new Set([...qTerms, "physiology", "pharmacology", "anatom", "simulation", "virtual", "alternative", "replacement", "humane", "education", "teaching"])];
  const chunks = await Promise.all(pages.map(fetchTextSafe));
  const links = chunks.flatMap((html, i) => extractLinks(html, pages[i], priority));
  const baseEntries: CuratorSource[] = [
    { title: "InterNICHE Alternatives Database", url: "https://www.interniche.org/en/alternatives", source: "InterNICHE", type: "database" },
    { title: "InterNICHE Studies Database", url: "https://www.interniche.org/en/studies", source: "InterNICHE", type: "database" },
  ];
  return [...links.map((s) => ({ ...s, source: "InterNICHE" })), ...baseEntries].slice(0, 10);
}

function dedupeSources(sources: CuratorSource[]) {
  const out: CuratorSource[] = [];
  const seen = new Set<string>();
  for (const source of sources) {
    const key = source.doi ? `doi:${source.doi.toLowerCase()}` : normalizeText(source.url || source.title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(source);
  }
  return out;
}

async function collectTrustedSources(query: string, focus: string) {
  const tasks: Promise<CuratorSource[]>[] = [];
  if (["geral", "cientifico", "metodos", "interniche"].includes(focus)) {
    tasks.push(searchOpenAlex(query), searchEuropePMC(query), searchCrossref(query));
  }
  if (["geral", "concea", "legislacao", "metodos"].includes(focus)) tasks.push(searchConcea(query));
  if (["geral", "interniche"].includes(focus)) tasks.push(searchInterniche(query));
  const settled = await Promise.allSettled(tasks);
  const merged = settled.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  const deduped = dedupeSources(merged).slice(0, 24);
  return await enrichSources(deduped);
}

function extractText(payload: any) {
  const parts = payload?.candidates?.[0]?.content?.parts || [];
  return parts.filter((part: any) => typeof part?.text === "string" && !part?.thought).map((part: any) => part.text).join("\n").trim();
}

function extractGrounding(payload: any) {
  const metadata = payload?.candidates?.[0]?.groundingMetadata || {};
  const chunks = Array.isArray(metadata.groundingChunks) ? metadata.groundingChunks : [];
  const sources = chunks.map((chunk: any) => chunk?.web).filter((web: any) => web?.uri).map((web: any) => ({
    title: String(web.title || web.uri), url: String(web.uri), source: "Google Search", type: "web",
  }));
  return {
    sources: dedupeSources(sources).slice(0, 12),
    searchQueries: Array.isArray(metadata.webSearchQueries) ? metadata.webSearchQueries.slice(0, 12) : [],
    searchEntryPoint: metadata?.searchEntryPoint?.renderedContent || "",
  };
}

async function callGemini(model: string, contents: any[], systemText: string, options: { googleSearch?: boolean; jsonMode?: boolean } = {}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const body: any = {
    systemInstruction: { parts: [{ text: systemText }] },
    contents,
    generationConfig: { maxOutputTokens: options.jsonMode ? 2200 : 3200 },
  };
  if (options.googleSearch) body.tools = [{ google_search: {} }];
  if (options.jsonMode) body.generationConfig.responseMimeType = "application/json";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY },
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

async function withFallback(contents: any[], systemText: string, options: { googleSearch?: boolean; jsonMode?: boolean } = {}) {
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

function deterministicSummary(query: string, sources: CuratorSource[]) {
  if (!sources.length) return `A pesquisa por “${query}” não recuperou registros estruturados nesta tentativa. Refine os termos ou selecione outro foco.`;
  const lines = sources.slice(0, 10).map((s, i) => {
    const meta = [s.source, s.year, s.authors].filter(Boolean).join(" · ");
    return `${i + 1}. ${s.title}${meta ? ` — ${meta}` : ""}${s.snippet ? `\n${s.snippet.slice(0, 360)}` : ""}`;
  });
  return `Pesquisa concluída em fontes científicas e institucionais. A síntese automática do Gemini não pôde ser usada nesta chamada, mas os registros abaixo são reais e clicáveis.\n\n${lines.join("\n\n")}\n\nRevise as fontes antes de transformar um achado em conteúdo.`;
}

async function research(userId: string, query: string, focus: string) {
  const directSources = await collectTrustedSources(query, focus);
  let sources = directSources;
  let answer = "";
  let model = "Pesquisa direta · sem Gemini";
  let searchQueries: string[] = [];
  let searchEntryPoint = "";
  let researchMode = "direct";

  if (GEMINI_API_KEY && GOOGLE_SEARCH_ENABLED) {
    try {
      const grounded = await withFallback(
        [{ role: "user", parts: [{ text: `Pesquise agora: ${query}\nFoco: ${FOCUS_LABELS[focus]}` }] }],
        CURATOR_SYSTEM_PROMPT,
        { googleSearch: true },
      );
      const grounding = extractGrounding(grounded.payload);
      sources = await enrichSources(dedupeSources([...grounding.sources, ...directSources]).slice(0, 24));
      answer = grounded.text;
      model = grounded.model;
      searchQueries = grounding.searchQueries;
      searchEntryPoint = grounding.searchEntryPoint;
      researchMode = "gemini-grounded";
    } catch (error) {
      console.warn("Google Search grounding indisponível; usando repositórios diretos:", (error as Error).message);
    }
  }

  if (!answer && GEMINI_API_KEY && sources.length) {
    try {
      const sourceContext = sources.slice(0, 18).map((s, i) => `${i + 1}. ${s.title}\nFonte: ${s.source}${s.year ? ` · ${s.year}` : ""}${s.authors ? ` · ${s.authors}` : ""}\nURL: ${s.url}${s.snippet ? `\nResumo/metadado: ${s.snippet}` : ""}`).join("\n\n");
      const result = await withFallback(
        [{ role: "user", parts: [{ text: `TEMA: ${query}\nFOCO: ${FOCUS_LABELS[focus]}\n\nFONTES REAIS RECUPERADAS:\n${sourceContext}\n\nSintetize 3 a 8 achados concretos e indique os melhores candidatos para o AlterECO. Não use conhecimento externo às fontes.` }] }],
        CURATOR_SYSTEM_PROMPT,
      );
      answer = result.text;
      model = result.model;
      researchMode = "repositories+gemini";
    } catch (error) {
      console.warn("Gemini indisponível para síntese; devolvendo fontes diretas:", (error as Error).message);
    }
  }

  if (!answer) answer = deterministicSummary(query, sources);

  const { data: run, error } = await admin.from("curator_ai_runs").insert({
    user_id: userId,
    query,
    focus,
    answer,
    sources,
    search_queries: searchQueries,
    model,
  }).select("id").single();
  if (error) throw error;

  return { runId: run.id, answer, sources, searchQueries, searchEntryPoint, model, researchMode };
}

function cleanJsonText(text: string) {
  return text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
}

function areaForSource(run: any, source: CuratorSource) {
  const hay = normalizeText(`${source.title} ${source.source} ${source.type || ""} ${source.url}`);
  if (source.type === "database" || /database|base de dados|repositorio|repository/.test(hay)) return "bases-dados";
  if (/resolu|legisla|norma|portaria|decreto|lei |regulat|test guideline|guideline|tg \d/.test(hay)) return "legislacao";
  if (/inter­niche|interniche/.test(hay)) return source.type === "database" ? "bases-dados" : "materiais";
  if (run.focus === "metodos" && /method|metodo|nam|organ-on|organoid|in vitro|in silico|replacement/.test(hay)) return "metodos";
  if (["article", "journal-article", "book", "book-chapter", "review", "posted-content", "proceedings-article"].includes(String(source.type || "").toLowerCase())) return "publicacoes";
  if (run.focus === "legislacao" || run.focus === "concea") return "legislacao";
  if (run.focus === "interniche") return "materiais";
  return "publicacoes";
}

function cleanSummary(source: CuratorSource, run: any) {
  const raw = stripHtml(String(source.snippet || "")).replace(/\s+/g, " ").trim();
  if (raw.length >= 45) return raw.slice(0, 760);
  const meta = [source.source, source.year, source.authors].filter(Boolean).join(" · ");
  return `Registro localizado na pesquisa “${run.query}”${meta ? ` em ${meta}` : ""}. Abra a fonte original para conferir o conteúdo completo e os metadados antes da aprovação.`;
}

function sourceToDraft(run: any, source: CuratorSource, sourceIndex = 0) {
  const description = cleanSummary(source, run);
  const tags = [
    run.focus,
    source.source,
    source.year ? String(source.year) : "",
    source.type || "",
  ].filter(Boolean).map(String).map((tag) => tag.trim()).filter(Boolean).slice(0, 10);

  return {
    source_index: sourceIndex,
    title: String(source.title || `Achado ${sourceIndex + 1}`).trim(),
    author_name: String(source.authors || source.source || "Fonte institucional/científica").trim(),
    area: areaForSource(run, source),
    tags,
    description,
    long_description: description,
    external_url: String(source.url || "").trim(),
    image_url: source.image_url || null,
    why_this_source: `Fonte recuperada diretamente de ${source.source || "repositório científico/institucional"}, com link verificável.`,
    verification_note: source.snippet
      ? "Resumo baseado em metadados/descrição recuperados da própria fonte. Conferir o documento original antes de aprovar."
      : "A fonte foi localizada, mas não forneceu resumo estruturado. Conferir o documento original e complementar a descrição antes de aprovar.",
    source: {
      source: source.source,
      year: source.year || null,
      authors: source.authors || "",
      doi: source.doi || "",
      type: source.type || "",
      image_url: source.image_url || null,
    },
  };
}

function fallbackDraftFromSource(run: any) {
  const source = Array.isArray(run.sources) ? run.sources[0] : null;
  if (!source) throw new Error("Não há fonte recuperada para criar um rascunho.");
  return sourceToDraft(run, source, 0);
}

async function prepareSources(userId: string, runId: string) {
  const { data: run, error } = await admin
    .from("curator_ai_runs")
    .select("id, user_id, query, focus, sources")
    .eq("id", runId)
    .maybeSingle();
  if (error) throw error;
  if (!run || run.user_id !== userId) throw new Error("Pesquisa da curadoria não encontrada.");

  const sources: CuratorSource[] = Array.isArray(run.sources) ? run.sources : [];
  if (!sources.length) throw new Error("Esta pesquisa não possui fontes para preparar.");

  const urls = sources.map((source) => String(source.url || "")).filter(Boolean);
  let existing: any[] = [];
  if (urls.length) {
    const { data, error: existingError } = await admin
      .from("content_items")
      .select("id, title, status, external_url")
      .in("external_url", urls)
      .in("status", ["pending", "approved"]);
    if (existingError) throw existingError;
    existing = data || [];
  }
  const existingMap = new Map(existing.map((item: any) => [String(item.external_url), item]));
  const candidates = sources.map((source, index) => ({
    ...sourceToDraft(run, source, index),
    existing: existingMap.get(String(source.url || "")) || null,
  }));

  return { runId, candidates };
}

async function submitSources(userId: string, runId: string, requestedIndexes: unknown) {
  const { data: run, error } = await admin
    .from("curator_ai_runs")
    .select("id, user_id, query, focus, sources, model")
    .eq("id", runId)
    .maybeSingle();
  if (error) throw error;
  if (!run || run.user_id !== userId) throw new Error("Pesquisa da curadoria não encontrada.");

  const sources: CuratorSource[] = Array.isArray(run.sources) ? run.sources : [];
  const indexes = Array.isArray(requestedIndexes)
    ? [...new Set(requestedIndexes.map((value) => Number(value)).filter((value) => Number.isInteger(value) && value >= 0 && value < sources.length))]
    : sources.map((_, index) => index);
  if (!indexes.length) throw new Error("Selecione pelo menos um achado para enviar à curadoria.");

  const selected = indexes.map((index) => ({ index, source: sources[index] })).filter((item) => item.source?.url);
  const urls = selected.map((item) => String(item.source.url));
  const { data: existing, error: duplicateError } = await admin
    .from("content_items")
    .select("id, title, status, external_url")
    .in("external_url", urls)
    .in("status", ["pending", "approved"]);
  if (duplicateError) throw duplicateError;
  const existingMap = new Map<string, any>((existing || []).map((item: any) => [String(item.external_url), item]));

  const created: any[] = [];
  const skipped: any[] = [];

  for (const { index, source } of selected) {
    const duplicate = existingMap.get(String(source.url));
    if (duplicate) {
      skipped.push({ sourceIndex: index, title: source.title, reason: duplicate.status === "approved" ? "já publicado" : "já na fila de aprovação", contentId: duplicate.id });
      continue;
    }

    const draft = sourceToDraft(run, source, index);
    const payload = {
      title: draft.title,
      author_name: draft.author_name,
      area: draft.area,
      tags: draft.tags,
      description: draft.description,
      long_description: draft.long_description || null,
      external_url: draft.external_url,
      image_url: draft.image_url || null,
      status: "pending",
      submitted_by: userId,
      curator_ai_run_id: runId,
      source_type: "ai_curator",
      source_metadata: {
        query: run.query,
        focus: run.focus,
        model: run.model,
        source_index: index,
        source: draft.source,
        why_this_source: draft.why_this_source,
      },
      verification_note: draft.verification_note,
    };

    const { data: item, error: insertError } = await admin
      .from("content_items")
      .insert(payload)
      .select("id, title, external_url, status")
      .single();
    if (insertError) {
      skipped.push({ sourceIndex: index, title: source.title, reason: insertError.message });
      continue;
    }
    created.push({ ...item, sourceIndex: index });
  }

  return { runId, created, skipped, requested: indexes.length };
}

async function createDraft(userId: string, runId: string, extraInstruction = "") {
  const { data: run, error } = await admin.from("curator_ai_runs").select("id, user_id, query, focus, answer, sources").eq("id", runId).maybeSingle();
  if (error) throw error;
  if (!run || run.user_id !== userId) throw new Error("Pesquisa da curadoria não encontrada.");

  let draft: any = null;
  let usedModel = "Rascunho estruturado · sem Gemini";

  if (GEMINI_API_KEY) {
    const sourceList = Array.isArray(run.sources)
      ? run.sources.map((s: any, i: number) => `${i + 1}. ${s.title} — ${s.url}\n${s.source || ""}${s.snippet ? `\n${s.snippet}` : ""}`).join("\n\n")
      : "";
    const draftSystem = `${CURATOR_SYSTEM_PROMPT}\nRetorne APENAS JSON válido com: title, author_name, area, tags, description, long_description, external_url, why_this_source, verification_note. Área deve ser uma de: metodos, materiais, publicacoes, legislacao, bases-dados, eventos.`;
    try {
      const result = await withFallback(
        [{ role: "user", parts: [{ text: `CONSULTA: ${run.query}\n\nPESQUISA: ${run.answer}\n\nFONTES:\n${sourceList}\n\nINSTRUÇÃO EXTRA: ${extraInstruction || "Escolha o candidato mais forte e verificável."}` }] }],
        draftSystem,
        { jsonMode: true },
      );
      draft = JSON.parse(cleanJsonText(result.text));
      usedModel = result.model;
    } catch (error) {
      console.warn("Gemini indisponível para rascunho; usando rascunho determinístico:", (error as Error).message);
    }
  }

  if (!draft) draft = fallbackDraftFromSource(run);
  const allowedAreas = new Set(["metodos", "materiais", "publicacoes", "legislacao", "bases-dados", "eventos"]);
  if (!allowedAreas.has(String(draft.area))) draft.area = "publicacoes";
  if (!Array.isArray(draft.tags)) draft.tags = [];
  if (!draft?.title || !draft?.description || !draft?.external_url) throw new Error("O rascunho não contém título, descrição e fonte verificável.");

  const { error: updateError } = await admin.from("curator_ai_runs").update({ draft, updated_at: new Date().toISOString() }).eq("id", runId).eq("user_id", userId);
  if (updateError) throw updateError;
  return { runId, draft, model: usedModel };
}

async function submitDraft(userId: string, runId: string) {
  const { data: run, error } = await admin.from("curator_ai_runs").select("id, user_id, query, focus, sources, draft, model, content_item_id").eq("id", runId).maybeSingle();
  if (error) throw error;
  if (!run || run.user_id !== userId) throw new Error("Pesquisa da curadoria não encontrada.");
  if (!run.draft) throw new Error("Crie o rascunho antes de enviá-lo para aprovação.");
  if (run.content_item_id) return { contentId: run.content_item_id, alreadySubmitted: true };

  const draft: any = run.draft;
  const externalUrl = String(draft.external_url || "").trim();
  if (!externalUrl) throw new Error("O rascunho precisa ter uma fonte principal antes de entrar na fila.");

  const { data: duplicate } = await admin.from("content_items").select("id, status, title").eq("external_url", externalUrl).in("status", ["pending", "approved"]).limit(1).maybeSingle();
  if (duplicate) throw new Error(`Esta fonte já está cadastrada como “${duplicate.title}” (${duplicate.status === "approved" ? "publicada" : "aguardando aprovação"}).`);

  const payload = {
    title: String(draft.title || "").trim(),
    author_name: String(draft.author_name || "Fonte verificada").trim(),
    area: String(draft.area || "publicacoes"),
    tags: Array.isArray(draft.tags) ? draft.tags.map(String).slice(0, 20) : [],
    description: String(draft.description || "").trim(),
    long_description: String(draft.long_description || "").trim() || null,
    external_url: externalUrl,
    image_url: draft.image_url || null,
    status: "pending",
    submitted_by: userId,
    curator_ai_run_id: runId,
    source_type: "ai_curator",
    source_metadata: {
      query: run.query,
      focus: run.focus,
      model: run.model,
      sources: Array.isArray(run.sources) ? run.sources.slice(0, 24) : [],
      why_this_source: draft.why_this_source || "",
    },
    verification_note: String(draft.verification_note || "Revisar a fonte antes da aprovação."),
  };

  const { data: item, error: insertError } = await admin.from("content_items").insert(payload).select("id").single();
  if (insertError) throw insertError;
  const { error: runUpdateError } = await admin.from("curator_ai_runs").update({ content_item_id: item.id, updated_at: new Date().toISOString() }).eq("id", runId).eq("user_id", userId);
  if (runUpdateError) throw runUpdateError;
  return { contentId: item.id, alreadySubmitted: false };
}

async function history(userId: string) {
  const { data, error } = await admin.from("curator_ai_runs").select("id, query, focus, answer, sources, draft, model, content_item_id, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(12);
  if (error) throw error;
  return { runs: data || [] };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);
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
      return json(await createDraft(user.id, runId, String(body?.instruction || "").trim().slice(0, 1200)));
    }
    if (action === "prepare_sources") {
      const runId = String(body?.runId || "").trim();
      if (!runId) return json({ error: "runId obrigatório." }, 400);
      return json(await prepareSources(user.id, runId));
    }
    if (action === "submit_sources") {
      const runId = String(body?.runId || "").trim();
      if (!runId) return json({ error: "runId obrigatório." }, 400);
      return json(await submitSources(user.id, runId, body?.sourceIndexes));
    }
    if (action === "submit_draft") {
      const runId = String(body?.runId || "").trim();
      if (!runId) return json({ error: "runId obrigatório." }, 400);
      return json(await submitDraft(user.id, runId));
    }
    if (action === "history") return json(await history(user.id));
    return json({ error: "Ação inválida." }, 400);
  } catch (error) {
    console.error("ECO Curadoria error:", error);
    const message = error instanceof Error ? error.message : "Erro interno da ECO Curadoria.";
    const status = /restrita|sessão/i.test(message) ? 403 : 500;
    return json({ error: message }, status);
  }
});
