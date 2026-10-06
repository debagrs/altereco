import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

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

type Scope = "brasil" | "internacional" | "ambos";
type ResultKind = "publication" | "dataset" | "project" | "official-data" | "repository";

type SearchResult = {
  id: string;
  title: string;
  url: string;
  source: string;
  provider: string;
  year?: string | number | null;
  authors?: string;
  snippet?: string;
  doi?: string;
  country?: string;
  kind: ResultKind;
  section: string;
  scope: "nacional" | "internacional" | "misto";
  tags?: string[];
  curator_area?: string;
  curator_tags?: string[];
};

type ProviderStatus = { provider: string; ok: boolean; count: number; note?: string };

type SectionConfig = {
  id: string;
  label: string;
  icon: string;
  area: string;
  queryPt: string;
  queryEn: string;
  providers: string[];
  officialLinks?: Array<{ title: string; source: string; url: string }>;
};

const SECTIONS: Record<string, SectionConfig> = {
  visao: {
    id: "visao", label: "Visão geral", icon: "monitoring", area: "publicacoes",
    queryPt: "relações humano animal bem-estar animal políticas públicas animais Brasil",
    queryEn: "human animal relations animal welfare public policy",
    providers: ["OpenAlex", "OpenAIRE", "SciELO", "Crossref", "DataCite"],
  },
  pets: {
    id: "pets", label: "Animais de companhia", icon: "pets", area: "publicacoes",
    queryPt: "animais de companhia cães gatos tutela guarda responsável bem-estar abandono",
    queryEn: "companion animals dogs cats responsible guardianship welfare abandonment",
    providers: ["OpenAlex", "OpenAIRE", "SciELO", "Crossref", "DataCite"],
    officialLinks: [{ title: "Pesquisa Nacional de Saúde", source: "IBGE", url: "https://www.ibge.gov.br/estatisticas/sociais/saude/9160-pesquisa-nacional-de-saude.html" }],
  },
  economia: {
    id: "economia", label: "Economia e mercado", icon: "payments", area: "publicacoes",
    queryPt: "economia animal mercado pet indústria de produtos animais bem-estar animal economia",
    queryEn: "animal economy pet market animal industry animal welfare economics",
    providers: ["OpenAlex", "OpenAIRE", "SciELO", "Crossref", "DataCite"],
    officialLinks: [{ title: "Informações gerais do setor pet", source: "ABEMPET / Abinpet", url: "https://abinpet.org.br/informacoes-gerais-do-setor/" }],
  },
  consumo: {
    id: "consumo", label: "Consumo e abate", icon: "restaurant", area: "publicacoes",
    queryPt: "abate de animais consumo de carne pecuária produção animal bem-estar senciência",
    queryEn: "animal slaughter meat consumption livestock production animal welfare sentience",
    providers: ["IBGE SIDRA", "OpenAlex", "OpenAIRE", "SciELO", "Crossref", "DataCite"],
    officialLinks: [{ title: "Pesquisa Trimestral do Abate de Animais", source: "IBGE / SIDRA", url: "https://sidra.ibge.gov.br/pesquisa/abate/tabelas" }],
  },
  experimentacao: {
    id: "experimentacao", label: "Experimentação animal", icon: "biotech", area: "publicacoes",
    queryPt: "experimentação animal animais de laboratório ética 3Rs pesquisa biomédica",
    queryEn: "animal experimentation laboratory animals ethics 3Rs biomedical research",
    providers: ["Europe PMC", "OpenAlex", "OpenAIRE", "SciELO", "Crossref", "NIH RePORTER", "DataCite"],
    officialLinks: [
      { title: "CONCEA", source: "MCTI", url: "https://www.gov.br/mcti/pt-br/composicao/colegiados/concea" },
      { title: "RENAMA", source: "MCTI", url: "https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/renama" },
    ],
  },
  violencia: {
    id: "violencia", label: "Maus-tratos e violência", icon: "gavel", area: "publicacoes",
    queryPt: "maus-tratos animais crueldade violência contra animais legislação proteção animal",
    queryEn: "animal cruelty abuse violence animal protection law",
    providers: ["OpenAlex", "OpenAIRE", "SciELO", "Crossref", "DataCite"],
    officialLinks: [{ title: "Lei 14.064/2020", source: "Planalto", url: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l14064.htm" }],
  },
  abandono: {
    id: "abandono", label: "Abandono e proteção", icon: "home", area: "publicacoes",
    queryPt: "abandono animal cães gatos situação de rua abrigos proteção animal adoção",
    queryEn: "animal abandonment stray dogs cats shelters animal protection adoption",
    providers: ["OpenAlex", "OpenAIRE", "SciELO", "Crossref", "DataCite"],
  },
  entretenimento: {
    id: "entretenimento", label: "Entretenimento e cativeiro", icon: "theater_comedy", area: "publicacoes",
    queryPt: "animais entretenimento zoológicos aquários circos cativeiro fauna bem-estar",
    queryEn: "animals entertainment zoos aquariums circuses captivity wildlife welfare",
    providers: ["OpenAlex", "OpenAIRE", "SciELO", "Crossref", "DataCite"],
    officialLinks: [{ title: "SisFauna", source: "IBAMA", url: "https://www.gov.br/ibama/pt-br/servicos/sistemas/sisfauna" }],
  },
  pesquisa: {
    id: "pesquisa", label: "Pesquisa e grupos", icon: "science", area: "publicacoes",
    queryPt: "bem-estar animal direito animal ética animal senciência estudos animais grupos de pesquisa",
    queryEn: "animal welfare animal law animal ethics sentience animal studies research",
    providers: ["OpenAlex", "OpenAIRE", "SciELO", "Crossref", "NIH RePORTER", "DataCite", "Zenodo"],
    officialLinks: [{ title: "Diretório dos Grupos de Pesquisa", source: "CNPq", url: "https://lattes.cnpq.br/web/dgp" }],
  },
  educacao: {
    id: "educacao", label: "Educação", icon: "school", area: "materiais",
    queryPt: "educação humanitária ensino sem animais alternativas didáticas uso de animais educação veterinária médica",
    queryEn: "humane education animal-free teaching alternatives animal use veterinary medical education",
    providers: ["OpenAlex", "OpenAIRE", "SciELO", "Europe PMC", "Crossref", "DataCite", "Zenodo"],
  },
  atlas: {
    id: "atlas", label: "Atlas global", icon: "public", area: "bases-dados",
    queryPt: "políticas de bem-estar animal proteção animal direitos animais global comparado",
    queryEn: "global animal welfare policy animal protection animal rights comparative",
    providers: ["OpenAlex", "OpenAIRE", "Crossref", "DataCite", "Zenodo"],
    officialLinks: [{ title: "FAOSTAT Developer Portal", source: "FAO", url: "https://www.fao.org/faostat/en/#developer-portal" }],
  },
  metodos: {
    id: "metodos", label: "Métodos substitutivos", icon: "hub", area: "metodos",
    queryPt: "métodos substitutivos métodos alternativos uso de animais ensino pesquisa NAMs in vitro in silico organoides órgão em chip",
    queryEn: "non-animal methods replacement alternatives NAMs in vitro in silico organoids organ-on-chip animal use teaching research",
    providers: ["Europe PMC", "OpenAlex", "OpenAIRE", "SciELO", "Crossref", "NIH RePORTER", "DataCite", "Zenodo"],
    officialLinks: [
      { title: "RENAMA", source: "MCTI", url: "https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/renama" },
      { title: "InterNICHE", source: "InterNICHE", url: "https://www.interniche.org/" },
      { title: "EURL ECVAM", source: "European Commission", url: "https://joint-research-centre.ec.europa.eu/eu-reference-laboratory-alternatives-animal-testing-eurl-ecvam_en" },
      { title: "NC3Rs", source: "NC3Rs", url: "https://nc3rs.org.uk/" },
    ],
  },
};

const PROVIDER_CATALOG = [
  { id: "openalex", label: "OpenAlex", scope: "nacional + internacional", type: "literatura", auth: "não" },
  { id: "openaire", label: "OpenAIRE Graph", scope: "nacional + internacional", type: "publicações + datasets", auth: "não" },
  { id: "scielo", label: "SciELO / ArticleMeta", scope: "Brasil + rede SciELO", type: "literatura", auth: "não" },
  { id: "europepmc", label: "Europe PMC / PubMed", scope: "internacional", type: "biomédica", auth: "não" },
  { id: "crossref", label: "Crossref", scope: "internacional", type: "metadados DOI", auth: "não" },
  { id: "datacite", label: "DataCite", scope: "internacional", type: "datasets + DOI", auth: "não" },
  { id: "zenodo", label: "Zenodo", scope: "internacional", type: "repositório aberto", auth: "não" },
  { id: "nih", label: "NIH RePORTER", scope: "internacional", type: "projetos financiados", auth: "não" },
  { id: "sidra", label: "IBGE SIDRA", scope: "Brasil", type: "estatística oficial", auth: "não" },
];

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
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
  const { data: profile, error } = await admin.from("profiles").select("id, role, active, full_name").eq("id", userData.user.id).maybeSingle();
  if (error) throw error;
  if (!profile || !profile.active || profile.role !== "admin") throw new Error("A API do Observatório é exclusiva da administração do AlterECO.");
  return { user: userData.user, profile };
}

function clean(value: unknown, max = 900) {
  const text = String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

function normalizeUrl(value: unknown) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^10\.\d{4,9}\//.test(raw)) return `https://doi.org/${raw}`;
  if (/^doi:/i.test(raw)) return `https://doi.org/${raw.replace(/^doi:\s*/i, "")}`;
  try { return new URL(raw).toString(); } catch (_) { return ""; }
}

function yearFrom(value: unknown): string | null {
  const match = String(value || "").match(/\b(?:19|20)\d{2}\b/);
  return match ? match[0] : null;
}

function normalizeTitle(value: unknown) {
  return clean(value, 500).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function resultId(provider: string, url: string, title: string) {
  const raw = `${provider}|${url}|${normalizeTitle(title)}`;
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i++) { hash ^= raw.charCodeAt(i); hash = Math.imul(hash, 16777619); }
  return `${provider.toLowerCase().replace(/\W+/g, "-")}-${(hash >>> 0).toString(16)}`;
}

function dedupe(items: SearchResult[], max = 48) {
  const seen = new Set<string>();
  const out: SearchResult[] = [];
  for (const item of items) {
    const doiKey = String(item.doi || "").toLowerCase().replace(/^https?:\/\/doi\.org\//, "");
    const key = doiKey ? `doi:${doiKey}` : item.url ? `url:${item.url.toLowerCase()}` : `title:${normalizeTitle(item.title)}`;
    if (!item.title || !item.url || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length >= max) break;
  }
  return out;
}

async function fetchJson(url: string, init: RequestInit = {}, timeoutMs = 9000): Promise<any | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...init,
      headers: { "Accept": "application/json", "User-Agent": "AlterECO-Observatorio-API/1.0", ...(init.headers || {}) },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (_) {
    return null;
  } finally { clearTimeout(timer); }
}

function combinedQuery(section: SectionConfig, scope: Scope, custom: string) {
  const extra = clean(custom, 300);
  const base = scope === "brasil" ? section.queryPt : scope === "internacional" ? section.queryEn : `${section.queryPt} ${section.queryEn}`;
  return `${base}${extra ? ` ${extra}` : ""}`.replace(/\s+/g, " ").trim();
}

function nationalScope(scope: Scope) { return scope === "brasil" ? "nacional" : scope === "internacional" ? "internacional" : "misto"; }

async function searchOpenAlex(section: SectionConfig, scope: Scope, query: string): Promise<SearchResult[]> {
  const params = new URLSearchParams({ search: query, "per-page": "8" });
  if (scope === "brasil") params.set("filter", "institutions.country_code:BR");
  const data = await fetchJson(`https://api.openalex.org/works?${params}`);
  const rows = Array.isArray(data?.results) ? data.results : [];
  return rows.map((w: any) => {
    const authors = Array.isArray(w?.authorships) ? w.authorships.slice(0, 5).map((a: any) => a?.author?.display_name).filter(Boolean).join(", ") : "";
    const countries = Array.isArray(w?.authorships) ? [...new Set(w.authorships.flatMap((a: any) => a?.countries || []))].join(", ") : "";
    const url = normalizeUrl(w?.doi || w?.primary_location?.landing_page_url || w?.id);
    return { id: resultId("OpenAlex", url, w?.title || ""), title: clean(w?.title, 500), url, source: w?.primary_location?.source?.display_name || "OpenAlex", provider: "OpenAlex", year: w?.publication_year || null, authors, snippet: clean(w?.type || "Publicação indexada no OpenAlex"), doi: w?.doi || "", country: countries, kind: "publication", section: section.id, scope: nationalScope(scope), tags: [section.label, "OpenAlex"] } as SearchResult;
  }).filter((x: SearchResult) => x.title && x.url);
}

async function searchOpenAire(section: SectionConfig, scope: Scope, query: string): Promise<SearchResult[]> {
  const params = new URLSearchParams({ search: query, pageSize: "8" });
  if (scope === "brasil") params.set("countryCode", "BR");
  const data = await fetchJson(`https://api.openaire.eu/graph/v3/research-products?${params}`);
  const rows = Array.isArray(data?.results) ? data.results : [];
  return rows.map((r: any) => {
    const pids = Array.isArray(r?.pids) ? r.pids : Array.isArray(r?.pid) ? r.pid : [];
    const doiObj = pids.find((p: any) => String(p?.scheme || p?.type || "").toLowerCase().includes("doi"));
    const doi = doiObj?.value || r?.doi || "";
    const url = normalizeUrl(doi ? `https://doi.org/${String(doi).replace(/^https?:\/\/doi\.org\//, "")}` : r?.bestAccessRight?.url || r?.url || (r?.id ? `https://explore.openaire.eu/search/result?pid=${encodeURIComponent(r.id)}` : ""));
    const authors = Array.isArray(r?.authors) ? r.authors.slice(0, 5).map((a: any) => a?.fullName || a?.name || a?.fullname).filter(Boolean).join(", ") : "";
    const title = r?.mainTitle || r?.title || r?.titles?.[0]?.value || "";
    return { id: resultId("OpenAIRE", url, title), title: clean(title, 500), url, source: clean(r?.publisher?.name || r?.publisher || r?.source?.name || r?.source || "OpenAIRE Graph", 250), provider: "OpenAIRE", year: r?.publicationYear || yearFrom(r?.publicationDate), authors, snippet: clean(r?.description || r?.bestAccessRight?.name || r?.type || "Resultado OpenAIRE"), doi, country: Array.isArray(r?.countries) ? r.countries.join(", ") : "", kind: String(r?.type || "").toLowerCase().includes("dataset") ? "dataset" : "publication", section: section.id, scope: nationalScope(scope), tags: [section.label, "OpenAIRE"] } as SearchResult;
  }).filter((x: SearchResult) => x.title && x.url);
}

async function searchCrossref(section: SectionConfig, scope: Scope, query: string): Promise<SearchResult[]> {
  const scoped = scope === "brasil" ? `${query} Brasil` : query;
  const params = new URLSearchParams({ "query.bibliographic": scoped, rows: "7", select: "DOI,title,author,published-print,published-online,container-title,type,abstract,URL" });
  const data = await fetchJson(`https://api.crossref.org/works?${params}`);
  const rows = data?.message?.items || [];
  return rows.map((r: any) => {
    const dateParts = r?.["published-print"]?.["date-parts"]?.[0] || r?.["published-online"]?.["date-parts"]?.[0] || [];
    const authors = Array.isArray(r?.author) ? r.author.slice(0,5).map((a:any) => [a?.given,a?.family].filter(Boolean).join(" ")).filter(Boolean).join(", ") : "";
    const doi = r?.DOI || ""; const url = normalizeUrl(doi ? `https://doi.org/${doi}` : r?.URL);
    const title = Array.isArray(r?.title) ? r.title[0] : r?.title;
    return { id: resultId("Crossref", url, title), title: clean(title,500), url, source: Array.isArray(r?.["container-title"]) ? r["container-title"][0] : "Crossref", provider: "Crossref", year: dateParts?.[0] || null, authors, snippet: clean(r?.abstract || r?.type || "Metadado DOI"), doi, kind: "publication", section: section.id, scope: nationalScope(scope), tags: [section.label,"Crossref"] } as SearchResult;
  }).filter((x:SearchResult)=>x.title&&x.url);
}

async function searchEuropePMC(section: SectionConfig, scope: Scope, query: string): Promise<SearchResult[]> {
  const scoped = scope === "brasil" ? `${query} AND (Brazil OR Brasil)` : query;
  const params = new URLSearchParams({ query: scoped, format: "json", pageSize: "7", resultType: "core" });
  const data = await fetchJson(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?${params}`);
  const rows = data?.resultList?.result || [];
  return rows.map((r:any) => {
    const doi = r?.doi || "";
    const url = normalizeUrl(doi ? `https://doi.org/${doi}` : r?.pmcid ? `https://europepmc.org/article/PMC/${r.pmcid}` : r?.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/` : "");
    return { id: resultId("Europe PMC",url,r?.title||""), title: clean(r?.title,500), url, source: r?.journalTitle || "Europe PMC / PubMed", provider: "Europe PMC", year: r?.pubYear || null, authors: r?.authorString || "", snippet: clean(r?.abstractText || r?.journalTitle || "Literatura biomédica"), doi, kind:"publication", section:section.id, scope:nationalScope(scope), tags:[section.label,"Europe PMC"] } as SearchResult;
  }).filter((x:SearchResult)=>x.title&&x.url);
}

async function searchScielo(section: SectionConfig, scope: Scope, query: string): Promise<SearchResult[]> {
  const params = new URLSearchParams({ q: query, limit: "8", body: "false" });
  if (scope === "brasil") params.set("collection", "scl");
  const data = await fetchJson(`https://articlemeta.scielo.org/api/v1/article/?${params}`);
  const rows = Array.isArray(data?.objects) ? data.objects : Array.isArray(data) ? data : [];
  return rows.map((r:any) => {
    const title = r?.title || r?.original_title || r?.article_title || r?.front?.article_meta?.title_group?.article_title || "";
    const doi = r?.doi || r?.article_doi || r?.front?.article_meta?.article_id?.doi || "";
    const pid = r?.code || r?.pid || r?.v880 || "";
    const url = normalizeUrl(doi ? `https://doi.org/${doi}` : pid ? `https://search.scielo.org/?q=${encodeURIComponent(`pid:${pid}`)}` : r?.url || "");
    const authorsRaw = r?.authors || r?.contribs || [];
    const authors = Array.isArray(authorsRaw) ? authorsRaw.slice(0,5).map((a:any)=>a?.name || a?.full_name || [a?.given_names,a?.surname].filter(Boolean).join(" ")).filter(Boolean).join(", ") : "";
    const journal = r?.journal?.title || r?.journal_title || r?.source || "SciELO";
    const year = r?.publication_year || r?.year || yearFrom(r?.publication_date || r?.date);
    return { id:resultId("SciELO",url,title), title:clean(title,500), url, source:journal, provider:"SciELO", year, authors, snippet:clean(r?.abstract || r?.abstracts?.[0]?.text || r?.subject || "Artigo da rede SciELO"), doi, country: scope === "brasil" ? "BR" : "", kind:"publication", section:section.id, scope:nationalScope(scope), tags:[section.label,"SciELO"] } as SearchResult;
  }).filter((x:SearchResult)=>x.title&&x.url);
}

async function searchDataCite(section: SectionConfig, scope: Scope, query: string): Promise<SearchResult[]> {
  const scoped = scope === "brasil" ? `${query} Brasil` : query;
  const params = new URLSearchParams({ query: scoped, "page[size]": "7", affiliation: "true" });
  const data = await fetchJson(`https://api.datacite.org/dois?${params}`);
  const rows = Array.isArray(data?.data) ? data.data : [];
  return rows.map((r:any) => {
    const a = r?.attributes || {}; const doi = a?.doi || r?.id || ""; const url = normalizeUrl(a?.url || (doi ? `https://doi.org/${doi}` : ""));
    const title = Array.isArray(a?.titles) ? a.titles[0]?.title : "";
    const authors = Array.isArray(a?.creators) ? a.creators.slice(0,5).map((x:any)=>x?.name || [x?.givenName,x?.familyName].filter(Boolean).join(" ")).filter(Boolean).join(", ") : "";
    const kind = String(a?.types?.resourceTypeGeneral || "").toLowerCase().includes("dataset") ? "dataset" : "publication";
    return { id:resultId("DataCite",url,title), title:clean(title,500), url, source:a?.publisher || "DataCite", provider:"DataCite", year:a?.publicationYear || null, authors, snippet:clean(Array.isArray(a?.descriptions) ? a.descriptions[0]?.description : a?.types?.resourceType || "Registro DataCite"), doi, kind, section:section.id, scope:nationalScope(scope), tags:[section.label,"DataCite"] } as SearchResult;
  }).filter((x:SearchResult)=>x.title&&x.url);
}

async function searchZenodo(section: SectionConfig, scope: Scope, query: string): Promise<SearchResult[]> {
  const scoped = scope === "brasil" ? `${query} Brazil` : query;
  const params = new URLSearchParams({ q: scoped, size: "7", sort: "bestmatch" });
  const data = await fetchJson(`https://zenodo.org/api/records?${params}`);
  const rows = data?.hits?.hits || [];
  return rows.map((r:any) => {
    const meta = r?.metadata || {}; const doi = r?.doi || meta?.doi || ""; const url = normalizeUrl(r?.links?.html || (doi ? `https://doi.org/${doi}` : ""));
    const authors = Array.isArray(meta?.creators) ? meta.creators.slice(0,5).map((x:any)=>x?.name).filter(Boolean).join(", ") : "";
    const type = String(meta?.resource_type?.type || meta?.upload_type || "").toLowerCase();
    return { id:resultId("Zenodo",url,meta?.title||""), title:clean(meta?.title,500), url, source:"Zenodo", provider:"Zenodo", year:yearFrom(meta?.publication_date), authors, snippet:clean(meta?.description || "Recurso em repositório aberto"), doi, kind:type.includes("dataset")?"dataset":"repository", section:section.id, scope:nationalScope(scope), tags:[section.label,"Zenodo"] } as SearchResult;
  }).filter((x:SearchResult)=>x.title&&x.url);
}

async function searchNIH(section: SectionConfig, scope: Scope, query: string): Promise<SearchResult[]> {
  if (scope === "brasil") return [];
  const body = {
    criteria: { advanced_text_search: { operator: "and", search_field: "all", search_text: query }, include_active_projects: true },
    include_fields: ["ProjectTitle","AbstractText","FiscalYear","OrgName","OrgCountry","PrincipalInvestigators","ProjectNum","ProjectDetailUrl"],
    offset: 0, limit: 6, sort_field: "fiscal_year", sort_order: "desc"
  };
  const data = await fetchJson("https://api.reporter.nih.gov/v2/projects/search", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }, 12000);
  const rows = Array.isArray(data?.results) ? data.results : [];
  return rows.map((r:any) => {
    const title = r?.project_title || r?.ProjectTitle || "";
    const projectNum = r?.project_num || r?.ProjectNum || "";
    const url = normalizeUrl(r?.project_detail_url || r?.ProjectDetailUrl || (projectNum ? `https://reporter.nih.gov/project-details/${encodeURIComponent(projectNum)}` : "https://reporter.nih.gov/"));
    const pisRaw = r?.principal_investigators || r?.PrincipalInvestigators || [];
    const authors = Array.isArray(pisRaw) ? pisRaw.slice(0,5).map((x:any)=>x?.full_name || x?.FullName || [x?.first_name,x?.last_name].filter(Boolean).join(" ")).filter(Boolean).join(", ") : "";
    const org = r?.organization?.org_name || r?.OrgName || r?.organization?.name || "NIH RePORTER";
    return { id:resultId("NIH RePORTER",url,title), title:clean(title,500), url, source:org, provider:"NIH RePORTER", year:r?.fiscal_year || r?.FiscalYear || null, authors, snippet:clean(r?.abstract_text || r?.AbstractText || "Projeto financiado indexado no NIH RePORTER"), country:r?.organization?.org_country || r?.OrgCountry || "", kind:"project", section:section.id, scope:"internacional", tags:[section.label,"NIH RePORTER"] } as SearchResult;
  }).filter((x:SearchResult)=>x.title&&x.url);
}

async function searchSidraSlaughter(section: SectionConfig, scope: Scope): Promise<SearchResult[]> {
  if (scope === "internacional" || section.id !== "consumo") return [];
  const tables = [
    { id:"1092", species:"Bovinos" }, { id:"1093", species:"Suínos" }, { id:"1094", species:"Frangos" }
  ];
  const out: SearchResult[] = [];
  for (const table of tables) {
    const data = await fetchJson(`https://apisidra.ibge.gov.br/values/t/${table.id}/n1/all/v/all/p/last%201?formato=json`, {}, 8000);
    if (!Array.isArray(data) || data.length < 2) continue;
    const sample = data.slice(1, 6).map((row:any) => `${row?.D1N || row?.D2N || "Brasil"}: ${row?.V || ""} ${row?.MN || row?.D3N || ""}`.trim()).join(" · ");
    const url = `https://sidra.ibge.gov.br/tabela/${table.id}`;
    out.push({ id:resultId("IBGE SIDRA",url,table.species), title:`Pesquisa Trimestral do Abate — ${table.species}`, url, source:"IBGE · SIDRA", provider:"IBGE SIDRA", year:new Date().getFullYear(), snippet:clean(sample || `Tabela SIDRA ${table.id} · série oficial de abate`), country:"BR", kind:"official-data", section:section.id, scope:"nacional", tags:[section.label,"IBGE","SIDRA",table.species] });
  }
  return out;
}

async function runSingleProvider(name: string, section: SectionConfig, scope: Scope, query: string): Promise<SearchResult[]> {
  if (name === "OpenAlex") return await searchOpenAlex(section,scope,query);
  if (name === "OpenAIRE") return await searchOpenAire(section,scope,query);
  if (name === "SciELO") return await searchScielo(section,scope,query);
  if (name === "Crossref") return await searchCrossref(section,scope,query);
  if (name === "Europe PMC") return await searchEuropePMC(section,scope,query);
  if (name === "DataCite") return await searchDataCite(section,scope,query);
  if (name === "Zenodo") return await searchZenodo(section,scope,query);
  if (name === "NIH RePORTER") return await searchNIH(section,scope,query);
  if (name === "IBGE SIDRA") return await searchSidraSlaughter(section,scope);
  return [];
}

async function runProvider(name: string, section: SectionConfig, scope: Scope, query: string): Promise<{items: SearchResult[]; status: ProviderStatus}> {
  try {
    let items: SearchResult[] = [];
    const dualScopeProviders = new Set(["OpenAlex","OpenAIRE","SciELO","Crossref","Europe PMC","DataCite","Zenodo"]);
    if (scope === "ambos" && dualScopeProviders.has(name)) {
      const [national, international] = await Promise.all([
        runSingleProvider(name, section, "brasil", query),
        runSingleProvider(name, section, "internacional", query),
      ]);
      items = dedupe([...national, ...international], 12);
    } else {
      items = await runSingleProvider(name, section, scope, query);
    }
    return { items, status:{provider:name,ok:true,count:items.length} };
  } catch (e) {
    return { items:[], status:{provider:name,ok:false,count:0,note:e instanceof Error ? e.message : "falha"} };
  }
}

function officialResults(section: SectionConfig): SearchResult[] {
  return (section.officialLinks || []).map((x) => ({
    id:resultId(x.source,x.url,x.title), title:x.title, url:x.url, source:x.source, provider:"Fonte oficial", snippet:"Fonte institucional vinculada a esta seção do Observatório. Use para conferência e atualização manual dos indicadores.", kind:"official-data", section:section.id, scope:x.url.includes("gov.br") || x.url.includes("ibge.gov.br") || x.url.includes("abinpet") ? "nacional" : "internacional", tags:[section.label,"fonte oficial"]
  }));
}

async function persistRun(userId: string, section: SectionConfig, scope: Scope, query: string, providerStatus: ProviderStatus[], results: SearchResult[]) {
  try {
    const { data } = await admin.from("observatorio_api_runs").insert({ user_id:userId, section:section.id, scope, query, providers:providerStatus, result_count:results.length, results }).select("id").single();
    return data?.id || null;
  } catch (_) { return null; }
}

const ALLOWED_CONTENT_AREAS = new Set(["metodos","materiais","publicacoes","legislacao","bases-dados","eventos"]);

function normalizeCuratorArea(value: unknown): string | null {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "bases") return "bases-dados";
  return ALLOWED_CONTENT_AREAS.has(normalized) ? normalized : null;
}

function inferEditorialArea(section: SectionConfig, item: SearchResult) {
  const manual = normalizeCuratorArea(item.curator_area);
  if (manual) return manual;

  const haystack = clean([item.title, item.snippet, item.source, ...(item.tags || [])].filter(Boolean).join(" "), 3000).toLowerCase();
  if (/\b(lei|leis|legisla|regula|regulament|resolu[cç][aã]o|norma|normativ|decreto|portaria|jur[ií]dic|direito animal|policy|law|regulation)\b/.test(haystack)) return "legislacao";
  if (item.kind === "dataset" || item.kind === "repository" || item.kind === "official-data") return "bases-dados";
  if (section.id === "metodos") return "metodos";
  if (section.id === "educacao") return "materiais";
  return normalizeCuratorArea(section.area) || "publicacoes";
}

function normalizedEditorialTags(item: SearchResult, section: SectionConfig): string[] {
  const source = Array.isArray(item.curator_tags) ? item.curator_tags : (Array.isArray(item.tags) ? item.tags : []);
  const cleaned = source.map((tag) => clean(tag, 80)).filter(Boolean);
  if (!cleaned.length) cleaned.push(section.label);
  return [...new Set(cleaned)].slice(0,20);
}

async function submitItems(userId: string, sectionId: string, items: SearchResult[]) {
  const section = SECTIONS[sectionId] || SECTIONS.visao;
  const created: any[] = []; const skipped: any[] = [];
  for (const item of items.slice(0,30)) {
    const url = normalizeUrl(item?.url); const title = clean(item?.title,500);
    if (!url || !title) { skipped.push({title,reason:"registro incompleto"}); continue; }
    const { data: exists } = await admin.from("content_items").select("id,title").eq("external_url",url).limit(1);
    if (Array.isArray(exists) && exists.length) { skipped.push({title,reason:"já existe na curadoria"}); continue; }
    const tags = normalizedEditorialTags(item, section);
    const editorialArea = inferEditorialArea(section,item);
    const payload = {
      title,
      author_name: clean(item.authors || item.source || item.provider,250) || "Fonte externa",
      area: editorialArea,
      tags,
      description: clean(item.snippet || `Resultado localizado por ${item.provider} para a seção ${section.label}.`,1200),
      long_description: clean(`${item.snippet || ""}\n\nOrigem: ${item.provider}. Fonte: ${item.source}. ${item.year ? `Ano: ${item.year}.` : ""}`,3500),
      external_url:url,
      image_url:null,
      status:"pending",
      submitted_by:userId,
      source_type:"observatorio_api",
      source_metadata:{
        section:section.id,
        provider:item.provider,
        source:item.source,
        kind:item.kind,
        year:item.year || null,
        doi:item.doi || null,
        country:item.country || null,
        scope:item.scope,
        curator_area:editorialArea,
        curator_tags:tags
      },
      verification_note:`Achado automaticamente pela API interna do Observatório. Destino editorial revisável: ${editorialArea}. Revisar fonte primária, escopo, resumo e pertinência antes de aprovar.`
    };
    const { data, error } = await admin.from("content_items").insert(payload).select("id,title").single();
    if (error) skipped.push({title,reason:error.message}); else created.push(data);
  }
  return { created, skipped };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers:corsHeaders });
  if (req.method !== "POST") return json({error:"Método não permitido."},405);
  try {
    const { user } = await requireAdmin(req);
    const body = await req.json().catch(()=>({}));
    const action = String(body?.action || "catalog");

    if (action === "catalog") {
      return json({ sections:Object.values(SECTIONS), providers:PROVIDER_CATALOG });
    }

    if (action === "history") {
      const { data, error } = await admin.from("observatorio_api_runs").select("id,section,scope,query,providers,result_count,results,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(12);
      if (error) throw error;
      return json({ runs:data || [] });
    }

    if (action === "submit") {
      const sectionId = String(body?.section || "visao");
      const items = Array.isArray(body?.items) ? body.items : [];
      if (!items.length) return json({error:"Nenhum resultado selecionado."},400);
      return json(await submitItems(user.id,sectionId,items));
    }

    if (action === "search") {
      const sectionId = String(body?.section || "visao");
      const section = SECTIONS[sectionId];
      if (!section) return json({error:"Seção do Observatório inválida."},400);
      const scopeRaw = String(body?.scope || "ambos");
      const scope: Scope = scopeRaw === "brasil" || scopeRaw === "internacional" ? scopeRaw : "ambos";
      const query = combinedQuery(section,scope,String(body?.query || ""));
      const providers = section.providers;
      const settled = await Promise.all(providers.map((name)=>runProvider(name,section,scope,query)));
      const providerStatus = settled.map((x)=>x.status);
      const results = dedupe([...officialResults(section), ...settled.flatMap((x)=>x.items)], 48);
      const runId = await persistRun(user.id,section,scope,query,providerStatus,results);
      return json({ runId, section, scope, query, providers:providerStatus, results, total:results.length, searchedAt:new Date().toISOString() });
    }

    return json({error:"Ação inválida."},400);
  } catch (e) {
    return json({error:e instanceof Error ? e.message : "Falha na API do Observatório."},401);
  }
});
