import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const PRIMARY_MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-3.5-flash";
const FALLBACK_MODEL = Deno.env.get("GEMINI_FALLBACK_MODEL") || "gemini-3.5-flash-lite";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

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

function getPublishableKey(): string {
  const current = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
  if (current) {
    try {
      const parsed = JSON.parse(current);
      if (parsed?.default) return parsed.default;
    } catch (_) {
      // fallback legado abaixo
    }
  }
  return Deno.env.get("SUPABASE_ANON_KEY") || "";
}

const serviceKey = getSecretKey();
const publishableKey = getPublishableKey();
const admin = createClient(SUPABASE_URL, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const MODE_LABELS: Record<string, string> = {
  ensino: "ensino humanitário",
  pesquisa: "pesquisa e substituição 1R",
  biomedica: "biomedicina, farmácia e áreas afins",
  legislacao: "legislação, bases e validação",
};

const GREETINGS: Record<string, string> = {
  ensino:
    "Olá! Posso transformar um conteúdo em uma aula humanitária sem uso de animais. Diga a etapa de ensino, a disciplina e o tema; se ainda não souber tudo, eu monto uma proposta inicial.",
  pesquisa:
    "Olá! Vamos mapear a substituição do modelo animal. Conte qual é o objetivo científico, o desfecho que precisa medir e, se houver, qual método animal está sendo usado hoje.",
  biomedica:
    "Olá! Posso comparar alternativas human-relevant como culturas 2D/3D, organoides, organ-on-chip, modelos computacionais, dados humanos e outras NAMs. Diga qual procedimento ou pergunta você quer substituir.",
  legislacao:
    "Olá! Posso orientar a busca por legislação, métodos reconhecidos, bases oficiais e status de validação. Diga o país, a área e o método ou produto em questão.",
};

const SYSTEM_PROMPT = `
Você é ECO, a assistente especializada da plataforma AlterECO, voltada à educação humanitária, bioética e substituição do uso de animais no ensino e na pesquisa.

PRINCÍPIOS CENTRAIS
1. Priorize SUBSTITUIÇÃO (1R / Replacement). Quando mencionar os 3Rs, diferencie claramente redução/refinamento de substituição e não apresente redução ou refinamento como equivalentes éticos ou metodológicos ao 1R.
2. Trabalhe com linguagem científica, pedagógica e não moralizante. O objetivo é ajudar docentes, estudantes e pesquisadores a fazer transições viáveis e bem fundamentadas.
3. Nunca invente números, leis, resoluções, validações, DOI, autores, URLs ou status regulatórios. Se não houver base suficiente, diga explicitamente que a informação precisa ser conferida em fonte oficial.
4. Diferencie sempre: (a) método validado/reconhecido para finalidade regulatória; (b) método cientificamente promissor mas ainda não validado; (c) recurso didático/educacional.
5. Para questões brasileiras, priorize fontes primárias e institucionais como CONCEA/MCTI, RENAMA, legislação federal, ANVISA e documentos oficiais. Em contexto internacional, priorize OECD Test Guidelines, EURL ECVAM, NC3Rs, FDA e outras fontes regulatórias diretamente pertinentes.
6. Em pesquisa, privilegie métodos human-relevant e alternativas de substituição: dados humanos, culturas celulares, modelos 3D, organoides, organ-on-chip, microfisiologia, in silico/QSAR, modelagem computacional, sistemas sintéticos, simuladores, cadáveres de origem ética quando pedagogicamente pertinentes, imagens, realidade estendida e revisão sistemática, conforme o problema.
7. Não otimize procedimentos invasivos com animais. Se a pergunta partir de um protocolo animal, ajude a decompor o objetivo científico e redirecionar para uma estratégia de substituição.
8. Quando o usuário pedir uma aula, proponha objetivos de aprendizagem, atividade sem uso de animais, recursos, avaliação e adaptação por faixa etária.
9. Quando o usuário pedir um plano de substituição em pesquisa, responda preferencialmente com: Objetivo científico → o que o modelo atual mede → alternativas possíveis → evidência/validação → limitações → próximos passos → fontes a conferir.
10. Quando faltarem dados, faça no máximo 2 ou 3 perguntas essenciais, mas ainda ofereça uma primeira rota provisória útil.
11. Responda em português do Brasil, salvo pedido em outro idioma.
12. Ao final de respostas técnicas, inclua “Fontes para conferir” com apenas fontes reais presentes no contexto fornecido ou instituições oficiais que você saiba identificar com segurança. Não fabrique links específicos.

A plataforma AlterECO não substitui parecer regulatório, CEUA, CEP, comitê institucional ou orientação jurídica; ela apoia a busca e o desenho de alternativas de substituição.
`;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeMode(mode: unknown) {
  return typeof mode === "string" && MODE_LABELS[mode] ? mode : "pesquisa";
}

async function getOptionalUser(req: Request) {
  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7).trim();
  if (token.split(".").length !== 3 || !publishableKey) return null;

  try {
    const client = createClient(SUPABASE_URL, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data, error } = await client.auth.getUser(token);
    if (error) return null;
    return data.user || null;
  } catch (_) {
    return null;
  }
}

async function ownerContext(req: Request, visitorToken: unknown) {
  const user = await getOptionalUser(req);
  if (user) return { userId: user.id, visitorHash: null as string | null };

  if (typeof visitorToken !== "string" || visitorToken.length < 16) {
    throw new Error("Identificador anônimo inválido.");
  }
  return { userId: null as string | null, visitorHash: await sha256(visitorToken) };
}

async function ensureConversationOwner(
  conversationId: string,
  owner: { userId: string | null; visitorHash: string | null },
) {
  const { data, error } = await admin
    .from("ai_conversations")
    .select("id, user_id, visitor_hash, mode")
    .eq("id", conversationId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Conversa não encontrada.");

  const matches = owner.userId
    ? data.user_id === owner.userId
    : !data.user_id && data.visitor_hash === owner.visitorHash;

  if (!matches) throw new Error("Você não tem acesso a esta conversa.");
  return data;
}

async function startConversation(
  mode: string,
  owner: { userId: string | null; visitorHash: string | null },
) {
  const greeting = GREETINGS[mode] || GREETINGS.pesquisa;
  const { data: conversation, error } = await admin
    .from("ai_conversations")
    .insert({
      user_id: owner.userId,
      visitor_hash: owner.visitorHash,
      mode,
      title: MODE_LABELS[mode],
    })
    .select("id, mode")
    .single();
  if (error) throw error;

  const { error: messageError } = await admin.from("ai_messages").insert({
    conversation_id: conversation.id,
    role: "assistant",
    content: greeting,
    model: "AlterECO",
  });
  if (messageError) throw messageError;

  return {
    conversationId: conversation.id,
    mode: conversation.mode,
    messages: [{ role: "assistant", content: greeting }],
  };
}

async function getHistory(
  conversationId: string,
  owner: { userId: string | null; visitorHash: string | null },
) {
  const conversation = await ensureConversationOwner(conversationId, owner);
  const { data, error } = await admin
    .from("ai_messages")
    .select("role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(80);
  if (error) throw error;

  return {
    conversationId,
    mode: conversation.mode,
    messages: (data || []).map((m) => ({ role: m.role, content: m.content })),
  };
}

async function getCuratedContext(message: string) {
  const words = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/\W+/)
    .filter((w) => w.length >= 5)
    .slice(0, 5);

  let query = admin
    .from("content_items")
    .select("title, area, tags, description, external_url, published_at")
    .eq("status", "approved")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(16);

  if (words.length) {
    const filters = words.flatMap((word) => [
      `title.ilike.%${word}%`,
      `description.ilike.%${word}%`,
    ]);
    query = query.or(filters.join(","));
  }

  const { data, error } = await query;
  if (error) {
    console.warn("Curated context query failed:", error.message);
    return "Nenhum item curatorial dinâmico pôde ser recuperado nesta consulta.";
  }

  if (!data?.length) {
    return "Nenhum item curatorial aprovado correspondeu diretamente à consulta.";
  }

  return data
    .map((item, index) => {
      const tags = Array.isArray(item.tags) ? item.tags.join(", ") : "";
      return `${index + 1}. ${item.title} | área: ${item.area} | tags: ${tags}\n${item.description}${item.external_url ? `\nFonte cadastrada: ${item.external_url}` : ""}`;
    })
    .join("\n\n");
}

async function callGemini(model: string, contents: unknown[], systemText: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY || "",
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemText }] },
      contents,
      generationConfig: {
        temperature: 0.25,
        topP: 0.9,
        maxOutputTokens: 3500,
      },
    }),
  });

  const payload = await response.json();
  if (!response.ok || payload?.error) {
    const error = new Error(payload?.error?.message || `Gemini HTTP ${response.status}`);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  const parts = payload?.candidates?.[0]?.content?.parts || [];
  const text = parts
    .filter((part: { text?: string; thought?: boolean }) => part?.text && !part?.thought)
    .map((part: { text: string }) => part.text)
    .join("\n")
    .trim();

  if (!text) throw new Error("O Gemini retornou uma resposta vazia.");
  return text;
}

async function generateReply(
  conversationId: string,
  mode: string,
  userMessage: string,
  owner: { userId: string | null; visitorHash: string | null },
) {
  await ensureConversationOwner(conversationId, owner);

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("ai_messages")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", conversationId)
    .eq("role", "user")
    .gte("created_at", since);

  if ((count || 0) >= 40) {
    throw new Error("Limite temporário desta conversa atingido. Tente novamente mais tarde.");
  }

  const { error: saveUserError } = await admin.from("ai_messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: userMessage,
  });
  if (saveUserError) throw saveUserError;

  const { data: recent, error: historyError } = await admin
    .from("ai_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(24);
  if (historyError) throw historyError;

  const curatedContext = await getCuratedContext(userMessage);
  const systemText = `${SYSTEM_PROMPT}\n\nMODO ATUAL: ${MODE_LABELS[mode] || MODE_LABELS.pesquisa}.\n\nCONTEXTO CURATORIAL RECUPERADO DO ALTERECO:\n${curatedContext}`;

  const contents = (recent || [])
    .reverse()
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

  let responseText: string;
  let usedModel = PRIMARY_MODEL;
  try {
    responseText = await callGemini(PRIMARY_MODEL, contents, systemText);
  } catch (primaryError) {
    console.warn("Primary Gemini model failed:", (primaryError as Error).message);
    if (!FALLBACK_MODEL || FALLBACK_MODEL === PRIMARY_MODEL) throw primaryError;
    responseText = await callGemini(FALLBACK_MODEL, contents, systemText);
    usedModel = FALLBACK_MODEL;
  }

  const { error: saveAssistantError } = await admin.from("ai_messages").insert({
    conversation_id: conversationId,
    role: "assistant",
    content: responseText,
    model: usedModel,
  });
  if (saveAssistantError) throw saveAssistantError;

  await admin
    .from("ai_conversations")
    .update({ mode, updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return { response: responseText, model: usedModel, conversationId, mode };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  if (!GEMINI_API_KEY) {
    return json({ error: "GEMINI_API_KEY não configurada nos Secrets do Supabase." }, 503);
  }
  if (!serviceKey) {
    return json({ error: "Chave secreta do Supabase indisponível para a Edge Function." }, 503);
  }

  try {
    const body = await req.json();
    const action = body?.action || "message";
    const owner = await ownerContext(req, body?.visitorToken);

    if (action === "start") {
      const mode = safeMode(body?.mode);
      return json(await startConversation(mode, owner));
    }

    const conversationId = String(body?.conversationId || "");
    if (!conversationId) return json({ error: "conversationId obrigatório." }, 400);

    if (action === "history") {
      return json(await getHistory(conversationId, owner));
    }

    if (action === "delete") {
      await ensureConversationOwner(conversationId, owner);
      const { error } = await admin.from("ai_conversations").delete().eq("id", conversationId);
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === "message") {
      const message = String(body?.message || "").trim();
      if (!message) return json({ error: "Mensagem vazia." }, 400);
      if (message.length > 3000) return json({ error: "Mensagem muito longa. Use até 3000 caracteres." }, 400);

      const conversation = await ensureConversationOwner(conversationId, owner);
      const mode = safeMode(body?.mode || conversation.mode);
      return json(await generateReply(conversationId, mode, message, owner));
    }

    return json({ error: "Ação inválida." }, 400);
  } catch (error) {
    console.error("ECO IA error:", error);
    const message = error instanceof Error ? error.message : "Erro interno da ECO IA.";
    return json({ error: message }, 500);
  }
});
