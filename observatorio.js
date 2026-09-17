/**
 * AlterECO Observatório - High-End Scientific Hub (UFSM / CNPq)
 * Author: Debora Gasparetto
 * 
 * Reconstructed to be EXACTLY as the screenshots provided.
 */

const OBS_SECTIONS = [
    { id: 'visao',         icon: 'layout-dashboard',  label: 'Visão Geral' },
    { id: 'pets',          icon: 'paw-print',          label: 'Pets no Brasil' },
    { id: 'economia',      icon: 'trending-up',        label: 'Economia Pet' },
    { id: 'abandono',      icon: 'heart-crack',        label: 'Abandono Animal' },
    { id: 'consumo',       icon: 'utensils',           label: 'Consumo' },
    { id: 'experimentacao',icon: 'flask-conical',      label: 'Experimentação' },
    { id: 'violencia',     icon: 'shield-alert',       label: 'Violência e Maus-Tratos' },
    { id: 'entretenimento',icon: 'monitor',            label: 'Entretenimento' },
    { id: 'pesquisa',      icon: 'microscope',         label: 'Pesquisa' },
    { id: 'educacao',      icon: 'graduation-cap',     label: 'Educação' },
    { id: 'atlas',         icon: 'globe',              label: 'Atlas Global' },
    { id: 'metodo',        icon: 'file-text',          label: 'Metodologia' },
    { id: 'assistente',    icon: 'zap',                label: 'Assistente IA', accent: true },
];

const _obsDescriptions = {
    visao:          'Indicadores de fontes oficiais e institucionais, com escopo e links de pesquisa visíveis em cada dado.',
    pets:           'Presença de cães e gatos nos domicílios brasileiros e estimativas setoriais de população pet, sempre identificadas por fonte e ano.',
    economia:       'Faturamento e composição do mercado pet brasileiro a partir da pesquisa setorial publicada pela ABEMPET/Abinpet.',
    abandono:       'Recorte do levantamento do Instituto Pet Brasil sobre animais sob tutela de ONGs e grupos de protetores, sem extrapolação para o total nacional.',
    consumo:        'Abate sob inspeção sanitária no Brasil e oferta de carne per capita em bases internacionais, com escopos explicitados.',
    experimentacao: 'Relatório do CONCEA e normas oficiais sobre uso de animais em ensino e pesquisa científica.',
    violencia:      'Recortes oficiais de registros e fiscalizações estaduais, apresentados sem soma ou extrapolação nacional.',
    entretenimento: 'Bases regulatórias verificáveis sobre fauna em cativeiro, zoológicos, aquariofilia e rodeios.',
    pesquisa:       'Diretório de Grupos de Pesquisa do CNPq e microdados oficiais de teses e dissertações da CAPES.',
    educacao:       'Marcos legais e publicações acadêmicas em português, separados entre Educação Básica e Ensino Superior.',
    atlas:          'Rede de organizações com endereço institucional, site oficial e fonte de verificação em cada modal.',
    metodo:         'Fontes primárias, critérios de curadoria e limites metodológicos usados pelo Observatório.',
    assistente:     'Agente de pesquisa que apresenta referências clicáveis e sinaliza quando não recupera fonte verificável.',
};

/* Map of Lucide icon names to Material Icons names */
const OBS_MATERIAL_ICONS = {
    'layout-dashboard': 'dashboard',
    'paw-print': 'pets',
    'trending-up': 'trending_up',
    'heart-crack': 'heart_broken',
    'utensils': 'restaurant',
    'flask-conical': 'biotech',
    'shield-alert': 'gpp_bad',
    'monitor': 'live_tv',
    'microscope': 'biotech',
    'graduation-cap': 'school',
    'globe': 'public',
    'file-text': 'description',
    'zap': 'bolt',
};

function initObservatorio(container) {
    const sidebarItemsHTML = OBS_SECTIONS.map(s => `
        <button class="obs2-nav-item ${s.id === 'visao' ? 'active' : ''} ${s.accent ? 'obs2-nav-accent' : ''}"
                data-obs2="${s.id}" title="${s.label}" aria-label="${s.label}">
            <span class="material-icons obs2-nav-icon" aria-hidden="true">${OBS_MATERIAL_ICONS[s.icon] || 'circle'}</span>
            <span class="obs2-nav-label">${s.label}</span>
        </button>
    `).join('');

    container.innerHTML = `
    <div class="obs2-wrapper">
        <!-- Dark Sidebar -->
        <aside class="obs2-sidebar" id="obs2-sidebar">
            <div class="obs2-sidebar-brand">
                <div class="obs2-brand-icon">
                    <span class="material-icons" aria-hidden="true" style="font-size:22px;color:var(--accent-yellow);">telescope</span>
                </div>
                <span class="obs2-brand-label">Observatório</span>
            </div>
            <nav class="obs2-nav-list" id="obs2-nav">
                ${sidebarItemsHTML}
            </nav>
            <div class="obs2-sidebar-footer">
                <div class="obs2-footer-badge">UFSM · CNPq</div>
            </div>
        </aside>

        <!-- Content Area -->
        <main class="obs2-content" id="obs2-content">
            <!-- Dark hero strip -->
            <div class="obs2-hero" id="obs2-hero">
                <span class="page-badge obs2-hero-badge" style="background:rgba(255,255,255,0.12); color:var(--accent-yellow);"><span class="material-icons" aria-hidden="true">telescope</span> Observatório Humano-Animal</span>
                <h1 id="obs2-hero-title">Visão Geral</h1>
                <p id="obs2-hero-desc">Dados, pesquisas e cruzamentos científicos inéditos (UFSM / CNPq).</p>
            </div>
            <!-- Light content -->
            <div class="obs2-display-area">
                <div id="obs-display"></div>
            </div>
        </main>
    </div>
    `;

    // Navigation
    const nav = container.querySelector('#obs2-nav');
    nav.addEventListener('click', e => {
        const btn = e.target.closest('[data-obs2]');
        if (!btn) return;
        nav.querySelectorAll('.obs2-nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const section = OBS_SECTIONS.find(s => s.id === btn.dataset.obs2);
        if (section) {
            document.getElementById('obs2-hero-title').textContent = section.label;
            document.getElementById('obs2-hero-desc').textContent = _obsDescriptions[section.id] || 'Dados e análises do Observatório AlterECO.';
        }
        renderObsSubpage(btn.dataset.obs2);
        document.getElementById('obs2-content').scrollTop = 0;
    });

    renderObsSubpage('visao');
}


/**
 * Source attribution helpers
 * Every factual indicator in the Observatório should point to a real,
 * reviewable source. Generic homepages are deliberately avoided.
 */
function obsNormalizeSourceUrl(url) {
    const raw = String(url || '').trim();
    if (!raw) return '';
    try {
        const parsed = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
        return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
    } catch (_) {
        return '';
    }
}

function researchSourceLink(label, url, meta = '') {
    const safeUrl = obsNormalizeSourceUrl(url);
    if (!safeUrl) return '';
    return `<a class="obs-research-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">
        <span class="material-icons" aria-hidden="true">open_in_new</span>
        <span><strong>Ver pesquisa / fonte</strong>${label ? ` · ${obsEscapeHTML(label)}` : ''}${meta ? ` · ${obsEscapeHTML(meta)}` : ''}</span>
    </a>`;
}

function researchSourceLinks(sources = []) {
    const valid = sources.filter(source => source && obsNormalizeSourceUrl(source.url));
    if (!valid.length) return '';
    return `<div class="obs-research-links">${valid.map(source => researchSourceLink(source.label || source.fonte || 'Fonte verificada', source.url, source.meta || source.ano || '')).join('')}</div>`;
}

function sourceBadge(fonte, ano, url) {
    const safeUrl = obsNormalizeSourceUrl(url);
    if (!safeUrl) return `<div class="obs-source-badge"><span class="material-icons obs-source-icon" aria-hidden="true">verified</span><strong>${obsEscapeHTML(fonte)}</strong>${ano ? ` · ${obsEscapeHTML(ano)}` : ''}</div>`;
    return `<div class="obs-source-badge"><a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="obs-source-link"><span class="material-icons obs-source-icon" aria-hidden="true">open_in_new</span><strong>Ver pesquisa / fonte</strong> · ${obsEscapeHTML(fonte)}${ano ? ` · ${obsEscapeHTML(ano)}` : ''}</a></div>`;
}

function sourcesFooter(sources) {
    const items = (sources || []).filter(s => obsNormalizeSourceUrl(s.url)).map(s =>
        `<a href="${obsNormalizeSourceUrl(s.url)}" target="_blank" rel="noopener noreferrer" class="obs-footer-src-link">
            <span class="material-icons" aria-hidden="true">open_in_new</span>
            <strong>${obsEscapeHTML(s.label)}</strong>${s.ano ? ' · ' + obsEscapeHTML(s.ano) : ''}
        </a>`
    ).join('');
    return `<div class="obs-sources-footer"><span class="obs-sources-label"><span class="material-icons" aria-hidden="true">verified</span> Pesquisas e fontes verificadas:</span>${items}</div>`;
}

function microSource(fonte, ano, url) {
    const safeUrl = obsNormalizeSourceUrl(url);
    const content = safeUrl
        ? `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer"><span class="material-icons" aria-hidden="true">open_in_new</span><strong>Ver pesquisa / fonte</strong> · ${obsEscapeHTML(fonte)}${ano ? ` · ${obsEscapeHTML(ano)}` : ''}</a>`
        : `${obsEscapeHTML(fonte)}${ano ? ` · ${obsEscapeHTML(ano)}` : ''}`;
    return `<div class="obs-micro-source">${content}</div>`;
}

function renderObsSubpage(subId) {
    const main = document.getElementById('obs-display');
    if (!main) return;
    main.innerHTML = '';

    switch (subId) {
        case 'visao': renderObsVisao(main); break;
        case 'pets': renderObsPets(main); break;
        case 'economia': renderObsEconomia(main); break;
        case 'abandono': renderObsAbandono(main); break;
        case 'consumo': renderObsConsumo(main); break;
        case 'experimentacao': renderObsExperimentacao(main); break;
        case 'violencia': renderObsViolencia(main); break;
        case 'entretenimento': renderObsEntretenimento(main); break;
        case 'pesquisa': renderObsPesquisa(main); break;
        case 'educacao': renderObsEducacao(main); break;
        case 'atlas': renderObsAtlas(main); break;
        case 'metodo': renderObsMetodo(main); break;
        case 'assistente': renderObsAssistente(main); break;
    }
}

/** --- Real Content Renderers (Screenshot faithful) --- */

function renderObsAssistente(c) {
    c.innerHTML = `
        <div style="background:var(--primary-navy); padding: 1.5rem 3rem; color:white; border-radius:var(--border-radius); margin-bottom:2rem;">
            <p style="background:rgba(255,255,255,0.15); display:inline-block; padding:6px 15px; border-radius:20px; font-size:0.8rem; margin-bottom:1.5rem; color:var(--accent-yellow);">Assistente de Pesquisa</p>
            <h1 style="font-size:2.8rem; margin-bottom:1.5rem; line-height:1.2;">O que os dados revelam quando você faz as perguntas certas?</h1>
            <p style="max-width:700px; opacity:0.8; font-size:1.25rem;">Um assistente científico que cruza os dados do observatório com literatura acadêmica e fontes institucionais. Cada afirmação factual deve vir acompanhada das referências utilizadas.</p>
        </div>

        <div class="obs-assistente-shell">
            <!-- Coluna Esquerda -->
            <div class="obs-assistente-left">
                <button class="obs-nova-conversa-btn" onclick="obsStartNewConversation()">+ Nova conversa</button>

                <p class="obs-hist-label">Histórico</p>
                <div class="obs-hist-item"><span class="material-icons obs-inline-icon" aria-hidden="true">chat_bubble_outline</span> Nova conversa</div>
                <div class="obs-hist-item"><span class="material-icons obs-inline-icon" aria-hidden="true">chat_bubble_outline</span> Nova conversa</div>

                <div class="obs-nota-cientifica">
                    <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.8rem;">
                        <span class="material-icons obs-inline-icon" aria-hidden="true" style="color:var(--accent-yellow);">info</span>
                        <strong style="color:var(--accent-yellow); font-size:0.85rem;">Nota científica</strong>
                    </div>
                    <p style="font-size:0.82rem; line-height:1.6; color:#c7692a;">A resposta combina dados do Observatório com literatura científica e fontes oficiais recuperadas no momento da pergunta. Os links das referências aparecem em cada resposta. Verifique a fonte primária antes de citar academicamente.</p>
                </div>

                <p class="obs-agente-label">O agente pode:</p>
                <ul class="obs-agente-lista">
                    <li><span class="material-icons" aria-hidden="true">chevron_right</span> Cruzar dados de diferentes seções</li>
                    <li><span class="material-icons" aria-hidden="true">chevron_right</span> Identificar contradições nos dados</li>
                    <li><span class="material-icons" aria-hidden="true">chevron_right</span> Buscar artigos científicos e revisões</li>
                    <li><span class="material-icons" aria-hidden="true">chevron_right</span> Vincular cada análise às referências</li>
                    <li><span class="material-icons" aria-hidden="true">chevron_right</span> Sinalizar subnotificação e limitações</li>
                    <li><span class="material-icons" aria-hidden="true">chevron_right</span> Sugerir perguntas de pesquisa</li>
                </ul>
            </div>

            <!-- Coluna Direita -->
            <div class="obs-assistente-right">
                <div style="text-align:center; margin-bottom:3rem;">
                    <div style="margin-bottom:1rem;"><span class="material-icons" aria-hidden="true" style="font-size:4rem; color:var(--primary-navy);">smart_toy</span></div>
                    <h2 style="color:var(--primary-navy); font-size:1.6rem; margin-bottom:0.5rem;">Assistente de Pesquisa Humano-Animal</h2>
                    <p style="color:var(--text-gray); font-size:0.95rem;">Faça perguntas sobre os dados do observatório ou escolha uma das sugestões abaixo para começar.</p>
                </div>

                    <div class="obs-grid-2" style="margin-bottom:2.5rem;">
                    <div class="obs-card obs-suggestion" onclick="obsAskSuggestion(this)" role="button" tabindex="0">
                        <h4 style="color:var(--primary-navy); margin-bottom:0.8rem; font-size:0.95rem; display:flex; align-items:center; gap:0.4rem;"><span class="material-icons" aria-hidden="true" style="font-size:16px;">trending_up</span> Paradoxo Afetivo-Econômico</h4>
                        <p style="font-size:0.88rem; color:var(--text-gray); line-height:1.5;">Como os dados de mercado pet podem ser analisados ao lado de indicadores de abandono e proteção animal sem misturar recortes ou inventar causalidade?</p>
                    </div>
                    <div class="obs-card obs-suggestion" onclick="obsAskSuggestion(this)" role="button" tabindex="0">
                        <h4 style="color:var(--primary-navy); margin-bottom:0.8rem; font-size:0.95rem; display:flex; align-items:center; gap:0.4rem;"><span class="material-icons" aria-hidden="true" style="font-size:16px;">biotech</span> Experimentação Animal</h4>
                        <p style="font-size:0.88rem; color:var(--text-gray); line-height:1.5;">Quais são as evidências científicas sobre alternativas à experimentação animal? O que os dados do CONCEA revelam sobre a evolução des...</p>
                    </div>
                    <div class="obs-card obs-suggestion" onclick="obsAskSuggestion(this)" role="button" tabindex="0">
                        <h4 style="color:var(--primary-navy); margin-bottom:0.8rem; font-size:0.95rem; display:flex; align-items:center; gap:0.4rem;"><span class="material-icons" aria-hidden="true" style="font-size:16px;">restaurant</span> Senciência e Consumo</h4>
                        <p style="font-size:0.88rem; color:var(--text-gray); line-height:1.5;">Como a literatura científica sobre consciência animal pode ser relacionada aos dados oficiais de abate, respeitando o escopo de cada fonte?</p>
                    </div>
                    <div class="obs-card obs-suggestion" onclick="obsAskSuggestion(this)" role="button" tabindex="0">
                        <h4 style="color:var(--primary-navy); margin-bottom:0.8rem; font-size:0.95rem; display:flex; align-items:center; gap:0.4rem;"><span class="material-icons" aria-hidden="true" style="font-size:16px;">live_tv</span> Animais no Entretenimento</h4>
                        <p style="font-size:0.88rem; color:var(--text-gray); line-height:1.5;">Como comparar o bem-estar animal em zoológicos modernos com o modelo tradicional de circos? Quais os critérios científicos para essa avaliação?</p>
                    </div>
                    <div class="obs-card obs-suggestion" onclick="obsAskSuggestion(this)" role="button" tabindex="0">
                        <h4 style="color:var(--primary-navy); margin-bottom:0.8rem; font-size:0.95rem; display:flex; align-items:center; gap:0.4rem;"><span class="material-icons" aria-hidden="true" style="font-size:16px;">balance</span> Lacunas Legislativas</h4>
                        <p style="font-size:0.88rem; color:var(--text-gray); line-height:1.5;">Quais lacunas legais e institucionais aparecem quando comparamos legislação de proteção animal, registros oficiais e literatura científica?</p>
                    </div>
                    <div class="obs-card obs-suggestion" onclick="obsAskSuggestion(this)" role="button" tabindex="0">
                        <h4 style="color:var(--primary-navy); margin-bottom:0.8rem; font-size:0.95rem; display:flex; align-items:center; gap:0.4rem;"><span class="material-icons" aria-hidden="true" style="font-size:16px;">bar_chart</span> Subnotificação Estrutural</h4>
                        <p style="font-size:0.88rem; color:var(--text-gray); line-height:1.5;">Como pesquisadores tratam subnotificação e bases incompletas em estudos sobre maus-tratos, abandono e uso de animais em pesquisa?</p>
                    </div>
                </div>

                <div class="obs-input-bar" role="search">
                    <input type="text" id="obs-chat-input" placeholder="Faça uma pergunta sobre os dados do observatório..." style="flex:1; background:none; border:none; outline:none; font-size:1rem;" aria-label="Faça uma pergunta ao assistente do Observatório">
                    <button onclick="obsSubmitQuestion()" aria-label="Enviar pergunta" style="background:none; border:none; cursor:pointer; color:var(--primary-navy); flex-shrink:0;">
                        <span class="material-icons" aria-hidden="true">send</span>
                    </button>
                </div>
                <p style="text-align:center; color:var(--text-gray); font-size:0.78rem; margin-top:0.8rem;">Resposta baseada em evidências · referências clicáveis em cada análise · Enter para enviar</p>
            </div>
        </div>
    `;

    const input = c.querySelector('#obs-chat-input');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); obsSubmitQuestion(); }
        });
    }
}

function obsStartNewConversation() {
    obsAIHistory.length = 0;
    const log = document.getElementById('obs-chat-log');
    if (log) log.remove();
    const suggestions = document.querySelector('.obs-grid-suggest');
    if (suggestions) suggestions.style.display = '';
    const input = document.getElementById('obs-chat-input');
    if (input) { input.value = ''; input.focus(); }
}

function obsAskSuggestion(card) {
    const question = card.querySelector('p') ? card.querySelector('p').innerText : '';
    const input = document.getElementById('obs-chat-input');
    if (input) { input.value = question; input.focus(); }
}

const obsAIHistory = [];

function obsEscapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function obsCollectLocalEvidence() {
    const db = window.OBSERVATORIO_DB || {};
    const found = [];
    const seen = new Set();

    function walk(node, path = []) {
        if (!node || typeof node !== 'object') return;
        if (Array.isArray(node)) {
            node.forEach((item, index) => walk(item, path.concat(index)));
            return;
        }

        const url = node.url || node.link || node.fonte_url || node.site || '';
        const source = node.fonte || node.fonte_label || node.ref || node.source || '';
        const year = node.ano || node.year || '';
        const label = node.label || node.title || node.nome || node.especie || node.area || '';
        const value = node.value || node.valor || node.total || node.casos || node.perc || node.porcent || '';

        if (url && !seen.has(url)) {
            seen.add(url);
            found.push({
                title: label || source || 'Dado do Observatório',
                source: source || 'Observatório AlterECO',
                year,
                url,
                snippet: [label, value ? `Valor: ${value}` : '', node.nota || node.limitacao || node.text || ''].filter(Boolean).join(' · ')
            });
        }

        Object.entries(node).forEach(([key, value]) => {
            if (!['url','link','fonte','ref','source','ano','year','label','title','nome','especie','area','value','valor','total','casos','perc','porcent','nota','limitacao','text'].includes(key)) {
                walk(value, path.concat(key));
            }
        });
    }

    walk(db);
    return found.slice(0, 25);
}

function obsRenderScientificAnswer(data) {
    const answer = obsEscapeHTML(data?.answer || 'Não foi possível produzir uma síntese.');
    const sources = Array.isArray(data?.sources) ? data.sources : [];
    const linkedAnswer = answer.replace(/\[(\d{1,2})\]/g, (match, number) => {
        const index = Number(number) - 1;
        if (!sources[index]?.url) return match;
        return `<a class="obs-ai-citation" href="${obsEscapeHTML(sources[index].url)}" target="_blank" rel="noopener" title="Abrir referência ${number}">[${number}]</a>`;
    }).replace(/\n/g, '<br>');

    const sourceHTML = sources.length ? `
        <div class="obs-ai-sources">
            <div class="obs-ai-sources-title"><span class="material-icons" aria-hidden="true">verified</span> Referências usadas nesta resposta</div>
            ${sources.map((source, index) => `
                <a class="obs-ai-source-card" href="${obsEscapeHTML(source.url)}" target="_blank" rel="noopener">
                    <span class="obs-ai-source-number">${index + 1}</span>
                    <span class="obs-ai-source-content">
                        <strong>${obsEscapeHTML(source.title || 'Referência')}</strong>
                        <small>${obsEscapeHTML([source.source, source.journal, source.year].filter(Boolean).join(' · '))}</small>
                        ${source.authors ? `<span>${obsEscapeHTML(source.authors)}</span>` : ''}
                    </span>
                    <span class="material-icons" aria-hidden="true">open_in_new</span>
                </a>
            `).join('')}
        </div>` : `
        <div class="obs-ai-no-sources">Nenhuma referência verificável foi recuperada. Não use esta resposta como fonte acadêmica.</div>`;

    return `
        <div class="obs-ai-answer-text">${linkedAnswer}</div>
        ${sourceHTML}
        <div class="obs-ai-disclaimer">${obsEscapeHTML(data?.disclaimer || 'Verifique as fontes primárias antes de citar academicamente.')}</div>`;
}

async function obsInvokeScientificAI(question) {
    if (!window.alterecoSupabase?.functions) throw new Error('Supabase não está disponível nesta página.');
    const functionName = window.CONFIG?.AI?.OBSERVATORY_FUNCTION_NAME || 'ai-observatorio';
    const { data, error } = await window.alterecoSupabase.functions.invoke(functionName, {
        body: {
            question,
            history: obsAIHistory.slice(-8),
            localEvidence: obsCollectLocalEvidence()
        }
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
}

async function obsSubmitQuestion() {
    const input = document.getElementById('obs-chat-input');
    if (!input || !input.value.trim()) return;
    const q = input.value.trim();
    input.value = '';

    const suggestGrid = document.querySelector('.obs-grid-suggest');
    if (suggestGrid) suggestGrid.style.display = 'none';

    let chatLog = document.getElementById('obs-chat-log');
    if (!chatLog) {
        chatLog = document.createElement('div');
        chatLog.id = 'obs-chat-log';
        chatLog.className = 'obs-chat-log';
        const inputBar = document.querySelector('.obs-input-bar');
        inputBar.parentNode.insertBefore(chatLog, inputBar);
    }
    chatLog.style.display = 'flex';

    const userBubble = document.createElement('div');
    userBubble.className = 'obs-chat-user';
    userBubble.textContent = q;
    chatLog.appendChild(userBubble);
    chatLog.scrollTop = chatLog.scrollHeight;

    const typingBubble = document.createElement('div');
    typingBubble.className = 'obs-chat-typing';
    typingBubble.innerHTML = '<span class="material-icons obs-ai-spin" aria-hidden="true">progress_activity</span> Buscando artigos, bases científicas e fontes oficiais…';
    chatLog.appendChild(typingBubble);
    chatLog.scrollTop = chatLog.scrollHeight;

    try {
        const data = await obsInvokeScientificAI(q);
        typingBubble.remove();

        const aiBubble = document.createElement('div');
        aiBubble.className = 'obs-chat-ai';
        aiBubble.innerHTML = obsRenderScientificAnswer(data);
        chatLog.appendChild(aiBubble);

        obsAIHistory.push({ role: 'user', content: q });
        obsAIHistory.push({ role: 'assistant', content: data.answer || '' });
        if (obsAIHistory.length > 16) obsAIHistory.splice(0, obsAIHistory.length - 16);
    } catch (error) {
        typingBubble.remove();
        const errorBubble = document.createElement('div');
        errorBubble.className = 'obs-chat-error';
        errorBubble.innerHTML = `<strong>Não consegui concluir a pesquisa.</strong><br>${obsEscapeHTML(error?.message || 'Erro ao consultar as fontes científicas.')}`;
        chatLog.appendChild(errorBubble);
    }

    chatLog.scrollTop = chatLog.scrollHeight;
}

function renderObsMetodo(c) {
    const fontes = [
        { label: 'IBGE · Pesquisa Trimestral do Abate 2023', url: 'https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/39452-em-2023-abate-de-bovinos-cresce-e-o-de-suinos-e-frangos-atingem-recordes' },
        { label: 'IBGE · Pesquisa Nacional de Saúde 2019', url: 'https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/28793-pns-2019-sete-em-cada-dez-pessoas-que-procuram-o-mesmo-servico-de-saude-vao-a-rede-publica' },
        { label: 'CONCEA/MCTI · Relatório de uso animal 2019–2023', url: 'https://www.gov.br/mcti/pt-br/composicao/conselhos/concea/paginas/Destaques/relatorio-de-uso-animal-concea-2019_2023-1-1.pdf' },
        { label: 'ABEMPET (Abinpet) · Informações gerais do setor', url: 'https://abinpet.org.br/informacoes-gerais-do-setor/' },
        { label: 'Instituto Pet Brasil via CFMV · população pet, abandono e maus-tratos', url: 'https://www.cfmv.gov.br/combater-os-maus-tratos-aos-animais-e-um-dever-de-todos/comunicacao/noticias/2023/05/04/' },
        { label: 'ISP-RJ · registros de crueldade e maus-tratos 2022', url: 'https://www.rj.gov.br/isp/node/669' },
        { label: 'MCTI/CNPq · Tabela 3.4.1 do Censo DGP 2023', url: 'https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/indicadores/paginas/recursos-humanos/indicadores-dos-grupos-de-pesquisa/arquivos/tab_03_04_01_e_2023.pdf' },
        { label: 'CAPES · Catálogo de Teses e Dissertações', url: 'https://dadosabertos.capes.gov.br/group/catalogo-de-teses-e-dissertacoes-brasil' },
        { label: 'FAO via Our World in Data · oferta de carne per capita', url: 'https://ourworldindata.org/grapher/meat-supply-per-person?tab=table&time=latest' }
    ];

    c.innerHTML = `
        <div class="hero-white" style="background:var(--primary-navy); padding:3.5rem; color:white; border-radius:var(--border-radius); margin-bottom:3rem;">
            <span class="page-badge">Metodologia</span>
            <h1>Como transformamos dados em conhecimento ético?</h1>
            <p style="max-width:760px; opacity:.88;">A regra editorial do Observatório é simples: dado factual sem fonte rastreável não entra. Cada indicador publicado deve apontar para a pesquisa, relatório, legislação ou registro institucional usado.</p>
        </div>

        <div class="obs-method-shell">
            <section class="obs-method-section">
                <div class="obs-section-heading-row">
                    <div>
                        <span class="obs-eyebrow">Rastreabilidade</span>
                        <h2>Pesquisas e bases utilizadas</h2>
                    </div>
                </div>
                <p>Os links abaixo levam diretamente às pesquisas e bases usadas nas páginas do Observatório — não a homepages genéricas.</p>
                ${researchSourceLinks(fontes)}
            </section>

            <section class="obs-method-section">
                <div class="obs-section-heading-row">
                    <div>
                        <span class="obs-eyebrow">Critério de curadoria</span>
                        <h2>Escopo, comparação e ausência de dados</h2>
                    </div>
                </div>
                <p>Não somamos recortes incompatíveis, não transformamos dados estaduais em estimativa nacional e não aplicamos fatores próprios de “correção” sem uma pesquisa publicada que os sustente. Quando uma fonte mede somente estabelecimentos inspecionados, organizações pesquisadas ou registros policiais, esse escopo permanece explícito.</p>
            </section>

            <section class="obs-method-section">
                <div class="obs-section-heading-row">
                    <div>
                        <span class="obs-eyebrow">Senciência</span>
                        <h2>Referência conceitual</h2>
                    </div>
                </div>
                <p>A discussão sobre consciência e estados afetivos em animais não humanos toma como uma das referências históricas a <strong>Cambridge Declaration on Consciousness (2012)</strong>. O Observatório usa essa referência como enquadramento crítico, não como substituto para os dados empíricos de cada seção.</p>
                ${researchSourceLink('Cambridge Declaration on Consciousness · PDF oficial da conferência', 'https://fcmconference.org/img/CambridgeDeclarationOnConsciousness.pdf', '2012')}
            </section>
        </div>`;
}

function renderObsVisao(c) {
    const db = window.OBSERVATORIO_DB.visao_geral;
    const kpisHTML = db.kpis.map(k => `
        <article class="obs-kpi-card obs-kpi-card--sourced">
            <div class="obs-kpi-label">${obsEscapeHTML(k.label)}</div>
            <div class="obs-kpi-value">${obsEscapeHTML(k.value)}</div>
            ${microSource(k.fonte, k.ano, k.url)}
            <span class="material-icons obs-kpi-watermark" aria-hidden="true">${OBS_MATERIAL_ICONS[k.icon] || 'analytics'}</span>
        </article>`).join('');

    c.innerHTML = `
        <div class="obs-overview-hero">
            <span class="page-badge">Visão Geral — Paradoxo Ético</span>
            <h1>O que diferentes pesquisas revelam sobre nossa relação com os animais?</h1>
            <p>${obsEscapeHTML(db.card_narrativo)}</p>
            ${researchSourceLinks([
                {label:'ABEMPET (Abinpet) · mercado pet 2024', url:'https://abinpet.org.br/informacoes-gerais-do-setor/'},
                {label:'IBGE · Pesquisa Trimestral do Abate 2023', url:'https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/39452-em-2023-abate-de-bovinos-cresce-e-o-de-suinos-e-frangos-atingem-recordes'}
            ])}
        </div>

        <div class="obs-kpi-grid">${kpisHTML}</div>

        <div class="obs-crossings-banner">
            <div>
                <h3><span class="material-icons" aria-hidden="true">search</span> Explorar cruzamentos com fontes</h3>
                <p>As análises aproximam bases distintas e mostram, em cada card, quais pesquisas sustentam a comparação.</p>
            </div>
            <button onclick="renderCruzamentosIneditos()">Ver análises</button>
        </div>

        <div class="obs-grid-2">
            <article class="obs-card">
                <span class="obs-eyebrow">Nota metodológica</span>
                <h2>O que fazemos com os dados</h2>
                <p>${obsEscapeHTML(db.nota_metodologica)}</p>
                <button type="button" class="obs-secondary-action" onclick="renderObsSubpage('metodo')"><span class="material-icons" aria-hidden="true">description</span> Ver metodologia e fontes</button>
            </article>
            <article class="obs-card obs-card--dark">
                <h2>A ciência convida ao pensar</h2>
                <p>${obsEscapeHTML(db.card_narrativo)}</p>
                <div class="obs-paradox-actions">
                    <button type="button" class="obs-paradox-btn obs-paradox-btn--primary" onclick="openParadoxoX001()"><span class="material-icons" aria-hidden="true">travel_explore</span><span>Explorar Paradoxo X001</span></button>
                    <button type="button" class="obs-paradox-btn obs-paradox-btn--secondary" onclick="renderObsSubpage('assistente')"><span class="material-icons" aria-hidden="true">smart_toy</span><span>Falar com Assistente</span></button>
                </div>
            </article>
        </div>`;
}

function renderObsPets(c) {
    const db = window.OBSERVATORIO_DB.pets;
    const maxPop = Math.max(...db.populacao.map(item => Number(item.valor) || 0), 1);
    c.innerHTML = `
        <section class="obs-card obs-section-card">
            <span class="obs-eyebrow">IBGE · Pesquisa Nacional de Saúde</span>
            <h1>Animais de companhia nos domicílios brasileiros</h1>
            <div class="obs-grid-3 obs-data-card-grid">
                ${db.domicilios.map(d => `
                    <article class="obs-data-card">
                        <strong>${obsEscapeHTML(d.valor)}</strong>
                        <h3>Domicílios ${obsEscapeHTML(d.label)}</h3>
                        ${researchSourceLink(d.fonte, d.url, '2019')}
                    </article>`).join('')}
            </div>
        </section>

        <div class="obs-grid-2">
            <section class="obs-card">
                <span class="obs-eyebrow">Estimativa setorial · 2021</span>
                <h2>População pet por grupo</h2>
                ${db.populacao.map(p => `
                    <div class="obs-bar-row">
                        <div class="obs-bar-row-label"><span>${obsEscapeHTML(p.especie)}</span><strong>${obsEscapeHTML(p.valor)} mi</strong></div>
                        <div class="obs-bar-track"><div class="obs-bar-fill" style="width:${(Number(p.valor)/maxPop)*100}%"></div></div>
                    </div>`).join('')}
                ${researchSourceLink(db.populacao_fonte.fonte, db.populacao_fonte.url, db.populacao_fonte.ano)}
            </section>

            <section class="obs-card obs-card--dark">
                <span class="obs-eyebrow">PNS 2013 → PNS 2019</span>
                <h2>Mudança na presença nos domicílios</h2>
                ${db.evolucao_domicilios.map(item => `
                    <div class="obs-evolution-row">
                        <h3>${obsEscapeHTML(item.especie)}</h3>
                        <p><strong>${obsEscapeHTML(item.inicial)}</strong> (${item.ano_inicial}) → <strong>${obsEscapeHTML(item.final)}</strong> (${item.ano_final})</p>
                        ${researchSourceLinks([
                            {label:item.fonte_inicial, url:item.url_inicial, meta:item.ano_inicial},
                            {label:item.fonte_final, url:item.url_final, meta:item.ano_final}
                        ])}
                    </div>`).join('')}
            </section>
        </div>`;
}


const OBS_UF_TILE_POSITIONS = {
    AC:[0,3], AM:[1,2], RR:[2,0], AP:[5,0], PA:[4,2], RO:[2,4], TO:[5,4],
    MA:[7,2], PI:[8,3], CE:[10,2], RN:[12,2], PB:[12,3], PE:[11,4], AL:[11,5], SE:[10,6], BA:[8,6],
    MT:[4,6], MS:[4,8], GO:[6,7], DF:[7,7], MG:[8,8], ES:[10,8], RJ:[9,9], SP:[7,9],
    PR:[6,10], SC:[6,11], RS:[5,12]
};

function obsFormatCompact(value) {
    if (value === null || value === undefined) return 'Sigilo/X';
    const n = Number(value);
    if (!Number.isFinite(n)) return String(value);
    if (n >= 1e9) return `${(n/1e9).toLocaleString('pt-BR',{maximumFractionDigits:2})} bi`;
    if (n >= 1e6) return `${(n/1e6).toLocaleString('pt-BR',{maximumFractionDigits:1})} mi`;
    if (n >= 1e3) return `${(n/1e3).toLocaleString('pt-BR',{maximumFractionDigits:1})} mil`;
    return n.toLocaleString('pt-BR');
}

function obsSvgLineChart(series, {valueSuffix='', ariaLabel='Gráfico de linha'} = {}) {
    const width = 760, height = 260, padX = 46, padY = 30;
    const values = series.map(d => Number(d.valor));
    const min = Math.min(...values), max = Math.max(...values);
    const range = Math.max(max-min, 1);
    const x = i => padX + i * ((width-padX*2)/Math.max(series.length-1,1));
    const y = v => height-padY - ((v-min)/range)*(height-padY*2);
    const points = series.map((d,i)=>`${x(i)},${y(Number(d.valor))}`).join(' ');
    return `<svg class="obs-line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${obsEscapeHTML(ariaLabel)}">
        <line x1="${padX}" y1="${height-padY}" x2="${width-padX}" y2="${height-padY}" class="obs-chart-axis" />
        <polyline points="${points}" class="obs-chart-line" />
        ${series.map((d,i)=>`<g class="obs-chart-point"><circle cx="${x(i)}" cy="${y(Number(d.valor))}" r="5"><title>${d.ano}: ${String(d.valor).replace('.',',')}${valueSuffix}</title></circle><text x="${x(i)}" y="${height-8}" text-anchor="middle">${String(d.ano).slice(-2)}</text></g>`).join('')}
    </svg>`;
}

function obsStateTileMap(data, {valueKey='valor', label='Dados por UF', missingLabel='Sem dado comparável'} = {}) {
    const byUf = Object.fromEntries((data||[]).map(item => [item.uf, item]));
    const vals = (data||[]).map(item => item[valueKey]).filter(v => Number.isFinite(Number(v))).map(Number);
    const max = Math.max(...vals, 1);
    const cells = Object.entries(OBS_UF_TILE_POSITIONS).map(([uf,[col,row]]) => {
        const item = byUf[uf];
        const value = item?.[valueKey];
        const has = Number.isFinite(Number(value));
        const intensity = has ? Math.max(.16, Number(value)/max) : 0;
        const text = item ? (item.nome || uf) : uf;
        const detail = has ? obsFormatCompact(value) : (value === 0 ? '0' : missingLabel);
        return `<g class="obs-tile-state ${has ? 'has-data' : 'no-data'}" transform="translate(${col*48+8},${row*38+8})" tabindex="0" role="button" data-uf="${uf}" style="--tile-opacity:${intensity}">
            <rect width="42" height="32" rx="7"><title>${obsEscapeHTML(text)}: ${obsEscapeHTML(detail)}</title></rect>
            <text x="21" y="21" text-anchor="middle">${uf}</text>
        </g>`;
    }).join('');
    return `<svg class="obs-brazil-tile-map" viewBox="0 0 650 520" role="img" aria-label="${obsEscapeHTML(label)}">${cells}</svg>`;
}

function obsHorizontalBars(data, {valueKey='valor', nameKey='nome', limit=40, unit=''} = {}) {
    const valid = (data||[]).filter(d => Number.isFinite(Number(d[valueKey]))).sort((a,b)=>Number(b[valueKey])-Number(a[valueKey])).slice(0,limit);
    const max = Math.max(...valid.map(d=>Number(d[valueKey])),1);
    return `<div class="obs-ranked-bars">${valid.map(d=>`<div class="obs-ranked-row" data-ranked-uf="${d.uf||''}"><div class="obs-ranked-label"><span>${obsEscapeHTML(d[nameKey]||d.uf||'')}</span><strong>${obsFormatCompact(d[valueKey])}${unit}</strong></div><div class="obs-ranked-track"><div class="obs-ranked-fill" style="width:${Number(d[valueKey])/max*100}%"></div></div></div>`).join('')}</div>`;
}

function obsFilterAbateState(uf) {
    document.querySelectorAll('[data-ranked-uf]').forEach(row => {
        row.hidden = !!uf && row.dataset.rankedUf !== uf;
    });
    document.querySelectorAll('.obs-tile-state').forEach(node => {
        node.classList.toggle('is-selected', !!uf && node.dataset.uf === uf);
        node.classList.toggle('is-muted', !!uf && node.dataset.uf !== uf);
    });
}

function obsFilterCiucaRegion(region) {
    document.querySelectorAll('[data-ciuca-region]').forEach(row => {
        row.hidden = !!region && row.dataset.ciucaRegion !== region;
    });
    document.querySelectorAll('[data-ciuca-filter]').forEach(btn => btn.classList.toggle('active', btn.dataset.ciucaFilter === region));
}
function renderObsEconomia(c) {
    const db = window.OBSERVATORIO_DB.economia;
    c.innerHTML = `
        <section class="obs-card obs-section-card">
            <span class="obs-eyebrow">Economia pet · série nacional</span>
            <h1>Faturamento do mercado pet brasileiro</h1>
            <p>Além do recorte de 2024, o gráfico abaixo mantém a série histórica pública divulgada pela Abinpet/ABEMPET.</p>
            <div class="obs-chart-shell">
                ${obsSvgLineChart(db.historico_faturamento, {valueSuffix:' bi', ariaLabel:'Evolução do faturamento do mercado pet brasileiro entre 2013 e 2024'})}
            </div>
            ${researchSourceLinks([
                {label:db.historico_fonte.fonte, url:db.historico_fonte.url, meta:'2013–2023'},
                {label:'ABEMPET · 2024', url:db.historico_fonte.complemento_url, meta:'2024'}
            ])}
            <p class="obs-data-note">${obsEscapeHTML(db.historico_fonte.nota)}</p>
        </section>
        <div class="obs-grid-2 obs-economy-grid">
            <section class="obs-card">
                <span class="obs-eyebrow">Economia pet · 2024</span>
                <h2>${obsEscapeHTML(db.faturamento_total.valor)}</h2>
                <p class="obs-data-highlight">${obsEscapeHTML(db.faturamento_total.variacao)}</p>
                ${researchSourceLink(db.faturamento_total.fonte, db.faturamento_total.url, db.faturamento_total.ano)}
                <div class="obs-grid-2 obs-segment-grid">
                    ${db.faturamento_2024.map(s => `<article class="obs-segment-card"><h3>${obsEscapeHTML(s.segmento)}</h3><strong>${obsEscapeHTML(s.porcent)}</strong><p>R$ ${obsEscapeHTML(s.valor)} bi</p></article>`).join('')}
                </div>
            </section>
            <aside class="obs-stack">${db.cruzamentos.map(cr => `<article class="obs-card"><h3>${obsEscapeHTML(cr.title)}</h3><p>${obsEscapeHTML(cr.text)}</p>${researchSourceLink(cr.fonte, cr.url, 2024)}</article>`).join('')}</aside>
        </div>
        <div class="obs-data-note obs-data-note--prominent"><strong>Recorte territorial:</strong> a ABEMPET informa publicamente a série nacional e os segmentos. O detalhamento de mercado por UF não está aberto nessa fonte; por isso o Observatório não inventa um ranking estadual.</div>`;
}

function renderObsAbandono(c) {
    const db = window.OBSERVATORIO_DB.abandono;
    c.innerHTML = `
        <section class="obs-card obs-section-card"><span class="obs-eyebrow">Escopo do levantamento · ${obsEscapeHTML(db.ano)}</span><h1>Abandono e tutela por ONGs/protetores</h1><p>O dado publicado aqui é o recorte descrito pelo Instituto Pet Brasil e reproduzido pelo CFMV — não uma estimativa de todos os animais abandonados no país.</p>${researchSourceLink(db.fonte, db.url, db.ano)}</section>
        <div class="obs-grid-2 obs-data-card-grid">${db.indicadores.map(item => `<article class="obs-data-card"><span class="obs-eyebrow">${obsEscapeHTML(item.label)}</span><strong>${obsEscapeHTML(item.value)}</strong><p>${obsEscapeHTML(item.desc)}</p>${researchSourceLink(db.fonte, db.url, db.ano)}</article>`).join('')}</div>
        <div class="obs-grid-2">
            <section class="obs-card"><span class="obs-eyebrow">Distribuição por espécie</span><h2>Animais sob tutela no levantamento</h2>${obsHorizontalBars([{nome:'Cães',valor:177562},{nome:'Gatos',valor:7398}],{limit:2})}${researchSourceLink(db.fonte,db.url,db.ano)}</section>
            <section class="obs-card"><span class="obs-eyebrow">Situação de origem</span><h2>Origem dos casos no recorte</h2>${obsHorizontalBars([{nome:'Maus-tratos',valor:60},{nome:'Abandono',valor:40}],{limit:2,unit:'%'})}${researchSourceLink(db.fonte,db.url,db.ano)}</section>
        </div>
        <div class="obs-data-note obs-data-note--prominent"><strong>Limite de interpretação:</strong> ${obsEscapeHTML(db.nota)}</div>`;
}

function renderObsConsumo(c) {
    const db = window.OBSERVATORIO_DB.abate;
    const stateOptions = db.frangos_uf_2025_t3.filter(d=>Number.isFinite(Number(d.valor))).sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));
    c.innerHTML = `
        <section class="obs-card obs-section-card"><span class="obs-eyebrow">IBGE · 2023</span><h1>Abate de animais em estabelecimentos sob inspeção sanitária</h1><div class="obs-grid-3 obs-data-card-grid">${db.dados_2023.map(d => `<article class="obs-data-card"><h3>${obsEscapeHTML(d.especie)}</h3><strong>${obsEscapeHTML(d.valor)}</strong><p>Variação anual: ${obsEscapeHTML(d.variacao)}</p>${researchSourceLink(d.fonte,d.url,2023)}</article>`).join('')}</div></section>
        <section class="obs-card obs-section-card">
            <div class="obs-section-heading-row"><div><span class="obs-eyebrow">IBGE · 3º trimestre de 2025</span><h2>Frangos abatidos por Unidade da Federação</h2><p>Ranking e mapa dos estabelecimentos sob inspeção sanitária. Valores protegidos por sigilo estatístico aparecem como “X” e não são estimados.</p></div><label class="obs-inline-filter">Estado<select onchange="obsFilterAbateState(this.value)"><option value="">Todos</option>${stateOptions.map(d=>`<option value="${d.uf}">${d.nome}</option>`).join('')}</select></label></div>
            <div class="obs-viz-grid"><div>${obsHorizontalBars(db.frangos_uf_2025_t3,{limit:27})}</div><div class="obs-map-shell">${obsStateTileMap(db.frangos_uf_2025_t3,{label:'Mapa por UF do abate de frangos no terceiro trimestre de 2025'})}<p class="obs-data-note">Passe o cursor ou foque cada UF para ver o valor. Este é um mapa esquemático em SVG para comparação, não uma malha cartográfica.</p></div></div>
            ${researchSourceLink(db.frangos_uf_fonte.fonte,db.frangos_uf_fonte.url,'2025.III')}<p class="obs-data-note">${obsEscapeHTML(db.frangos_uf_fonte.nota)}</p>
        </section>
        <div class="obs-grid-2"><section class="obs-card obs-card--dark"><span class="obs-eyebrow">Comparação internacional · 2023</span><h2>Oferta de carne per capita</h2><div class="obs-data-list">${db.oferta_per_capita.map(p=>`<div class="obs-data-list-row"><span>${obsEscapeHTML(p.pais)}</span><strong>${Number(p.kg).toLocaleString('pt-BR',{maximumFractionDigits:2})} kg/ano</strong></div>`).join('')}</div>${researchSourceLink(db.oferta_fonte.fonte,db.oferta_fonte.url,db.oferta_fonte.ano)}<p class="obs-data-note">${obsEscapeHTML(db.oferta_fonte.nota)}</p></section><section class="obs-card"><span class="obs-eyebrow">Leitura de escala</span><h2>O que pode ser afirmado a partir da base</h2><p>${obsEscapeHTML(db.analise_etica)}</p>${researchSourceLink('IBGE · Pesquisa Trimestral do Abate',db.analise_url,2023)}<p class="obs-data-note"><strong>Importante:</strong> abate sob inspeção e oferta alimentar per capita são indicadores diferentes.</p></section></div>`;
}

function renderObsExperimentacao(c) {
    const db = window.OBSERVATORIO_DB.experimentacao;
    const maxTotal = Math.max(...db.ciuca_regioes_2025.map(d=>d.total));
    c.innerHTML = `
        <section class="obs-card obs-section-card"><span class="obs-eyebrow">CONCEA/MCTI · relatório oficial</span><h1>Uso de animais em ensino e pesquisa científica</h1><p class="obs-data-highlight">${obsEscapeHTML(db.total_periodo)}</p>${researchSourceLink('CONCEA/MCTI · Relatório de Uso Animal 2019–2023',db.indicadores[0].url,'2019–2023')}</section>
        <div class="obs-grid-2 obs-data-card-grid">${db.indicadores.map(item=>`<article class="obs-data-card"><span class="obs-eyebrow">${obsEscapeHTML(item.titulo)}</span><strong>${obsEscapeHTML(item.valor)}</strong><p>${obsEscapeHTML(item.texto)}</p>${researchSourceLink(item.fonte,item.url)}</article>`).join('')}</div>
        <section class="obs-card obs-section-card"><div class="obs-section-heading-row"><div><span class="obs-eyebrow">CIUCA · recorte territorial</span><h2>Instituições cadastradas por região</h2><p>O filtro territorial usa instituições do CIUCA. Ele não deve ser lido como quantidade de animais utilizados.</p></div></div><div class="obs-filter-pills"><button class="active" data-ciuca-filter="" onclick="obsFilterCiucaRegion('')">Nacional</button>${db.ciuca_regioes_2025.map(d=>`<button data-ciuca-filter="${d.regiao}" onclick="obsFilterCiucaRegion('${d.regiao}')">${d.regiao}</button>`).join('')}</div><div class="obs-ranked-bars">${db.ciuca_regioes_2025.map(d=>`<div class="obs-ranked-row" data-ciuca-region="${d.regiao}"><div class="obs-ranked-label"><span>${d.regiao}</span><strong>${d.total} cadastradas · ${d.credenciadas} credenciadas</strong></div><div class="obs-ranked-track"><div class="obs-ranked-fill" style="width:${d.total/maxTotal*100}%"></div></div></div>`).join('')}</div>${researchSourceLink(db.ciuca_fonte.fonte,db.ciuca_fonte.url,'21/03/2025')}<p class="obs-data-note">${obsEscapeHTML(db.ciuca_fonte.nota)}</p></section>
        <div class="obs-data-note obs-data-note--prominent"><strong>Critério de publicação:</strong> ${obsEscapeHTML(db.limitacao)}</div>`;
}

function renderObsViolencia(c) {
    const db = window.OBSERVATORIO_DB.maus_tratos;
    const mapData = [{uf:'MG',nome:'Minas Gerais',valor:7644},{uf:'RJ',nome:'Rio de Janeiro',valor:252}];
    c.innerHTML = `
        <section class="obs-card obs-section-card"><span class="obs-eyebrow">Recortes oficiais · não comparáveis diretamente</span><h1>Maus-tratos: registros e fiscalizações</h1><p>${obsEscapeHTML(db.nota)}</p></section>
        <div class="obs-grid-2 obs-data-card-grid">${db.estados.map(e=>`<article class="obs-data-card"><span class="obs-eyebrow">${obsEscapeHTML(e.uf)} · ${obsEscapeHTML(e.ano)}</span><strong>${obsEscapeHTML(e.casos)}</strong><h3>${obsEscapeHTML(e.status)}</h3>${researchSourceLink(e.fonte,e.link,e.ano)}</article>`).join('')}</div>
        <section class="obs-card obs-section-card"><span class="obs-eyebrow">SVG · disponibilidade de recortes estaduais</span><h2>Mapa dos dados oficiais localizados</h2><p>O mapa destaca apenas UFs para as quais o Observatório localizou um recorte oficial com escopo documentado. Os números <strong>não são comparáveis entre si</strong> e não formam um total nacional.</p><div class="obs-map-centered">${obsStateTileMap(mapData,{label:'Mapa esquemático das UFs com recortes oficiais de maus-tratos localizados',missingLabel:'Sem recorte oficial comparável nesta versão'})}</div>${researchSourceLinks(db.estados.map(e=>({label:e.fonte,url:e.link,meta:e.ano})))}</section>
        <section class="obs-card"><span class="obs-eyebrow">Legislação federal</span><h2>${obsEscapeHTML(db.lei.titulo)}</h2><p>${obsEscapeHTML(db.lei.texto)}</p>${researchSourceLink(db.lei.fonte,db.lei.url,2020)}</section>`;
}

const OBS_ATLAS_CATEGORY_META = {
    companheiros: {
        label: 'Causa animal ampla',
        icon: 'pets',
        marker: 'pets',
        color: '#5B4BFF',
        short: 'Pata de gato',
        description: 'ONGs multiespécies, resgate, adoção e proteção ampla.'
    },
    alimentacao: {
        label: 'Animais na alimentação',
        icon: 'restaurant',
        marker: 'restaurant',
        color: '#FF8A3D',
        short: 'Pata de galinha',
        description: 'Organizações veganas ou focadas em animais explorados para alimentação.'
    },
    pesquisa: {
        label: 'Pesquisa e substituição',
        icon: 'biotech',
        marker: 'biotech',
        color: '#00A58A',
        short: 'Pata de coelho',
        description: 'Entidades ligadas à experimentação animal e à substituição por métodos alternativos.'
    },
    entretenimento: {
        label: 'Animais e entretenimento',
        icon: 'live_tv',
        marker: 'live_tv',
        color: '#E0509A',
        short: 'Pata de elefante',
        description: 'ONGs e santuários que enfrentam circo, cativeiro e exploração recreativa.'
    }
};

let obsAtlasLeafletPromise = null;
let obsAtlasController = {
    map: null,
    markers: [],
    lines: [],
    activeCategory: 'all',
    data: []
};

function getObsAtlasData() {
    return (window.OBSERVATORIO_DB?.atlas_global?.organizacoes || []).slice();
}

function obsAtlasEnsureLeaflet() {
    if (window.L) return Promise.resolve(window.L);
    if (obsAtlasLeafletPromise) return obsAtlasLeafletPromise;

    obsAtlasLeafletPromise = new Promise((resolve, reject) => {
        const cssHref = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        if (![...document.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href.includes('leaflet'))) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssHref;
            link.crossOrigin = '';
            document.head.appendChild(link);
        }

        const existingScript = [...document.querySelectorAll('script')].find(script => script.src && script.src.includes('leaflet'));
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(window.L), { once: true });
            existingScript.addEventListener('error', () => reject(new Error('Falha ao carregar Leaflet.')), { once: true });
            if (window.L) resolve(window.L);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.crossOrigin = '';
        script.onload = () => resolve(window.L);
        script.onerror = () => reject(new Error('Falha ao carregar Leaflet.'));
        document.body.appendChild(script);
    });

    return obsAtlasLeafletPromise;
}

function obsAtlasDestroyMap() {
    if (obsAtlasController.map) {
        obsAtlasController.map.remove();
    }
    obsAtlasController = {
        map: null,
        markers: [],
        lines: [],
        activeCategory: 'all',
        data: []
    };
}

function obsAtlasPawIcon(category, className='obs-species-paw') {
    const label = OBS_ATLAS_CATEGORY_META[category]?.label || 'Categoria animal';
    const shapes = {
        companheiros: `<ellipse cx="24" cy="28" rx="10" ry="8"/><circle cx="12" cy="16" r="4"/><circle cx="20" cy="11" r="4"/><circle cx="29" cy="11" r="4"/><circle cx="36" cy="17" r="4"/>`,
        alimentacao: `<path d="M24 8v19M24 27L11 38M24 27l13 11M24 27l-2 14" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
        pesquisa: `<ellipse cx="24" cy="29" rx="10" ry="8"/><ellipse cx="14" cy="15" rx="4" ry="7" transform="rotate(-18 14 15)"/><ellipse cx="23" cy="11" rx="4" ry="7"/><ellipse cx="32" cy="15" rx="4" ry="7" transform="rotate(18 32 15)"/>`,
        entretenimento: `<ellipse cx="24" cy="28" rx="13" ry="10"/><circle cx="9" cy="15" r="5"/><circle cx="19" cy="10" r="5"/><circle cx="30" cy="10" r="5"/><circle cx="40" cy="15" r="5"/>`
    };
    const body = shapes[category] || shapes.companheiros;
    const fillAttr = category === 'alimentacao' ? '' : 'fill="currentColor"';
    return `<svg class="${className}" viewBox="0 0 48 48" role="img" aria-label="${obsEscapeHTML(label)}" ${fillAttr}>${body}</svg>`;
}

function obsAtlasCreateMarkerIcon(category) {
    const meta = OBS_ATLAS_CATEGORY_META[category] || OBS_ATLAS_CATEGORY_META.companheiros;
    return window.L.divIcon({
        className: 'obs-atlas-div-icon-wrapper',
        html: `
            <div class="obs-atlas-div-icon" style="--obs-marker-color:${meta.color};">
                ${obsAtlasPawIcon(category, 'obs-atlas-div-icon-animal')}
            </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 36],
        popupAnchor: [0, -30]
    });
}

function obsAtlasRenderLegend(data) {
    const root = document.getElementById('obs-atlas-filters');
    if (!root) return;

    const counts = data.reduce((acc, item) => {
        acc[item.categoria] = (acc[item.categoria] || 0) + 1;
        return acc;
    }, {});

    root.innerHTML = `
        <button type="button" class="obs-atlas-filter-chip ${obsAtlasController.activeCategory === 'all' ? 'active' : ''}" data-atlas-filter="all">
            <span class="material-icons obs-atlas-filter-icon" aria-hidden="true">public</span>
            <span>Todas</span>
            <strong>${data.length}</strong>
        </button>
        ${Object.entries(OBS_ATLAS_CATEGORY_META).map(([key, meta]) => `
            <button type="button" class="obs-atlas-filter-chip obs-atlas-filter-chip--icon ${obsAtlasController.activeCategory === key ? 'active' : ''}" data-atlas-filter="${key}" style="--atlas-chip-color:${meta.color};" aria-label="${meta.label}: ${counts[key] || 0} organizações" title="${meta.label}">
                ${obsAtlasPawIcon(key, 'obs-atlas-filter-paw')}
                <strong>${counts[key] || 0}</strong>
            </button>
        `).join('')}
    `;

    root.querySelectorAll('[data-atlas-filter]').forEach(button => {
        button.addEventListener('click', () => obsAtlasApplyFilter(button.dataset.atlasFilter));
    });
}

function obsAtlasRenderList() {
    const list = document.getElementById('obs-atlas-list');
    const summary = document.getElementById('obs-atlas-filter-summary');
    if (!list) return;

    const visibleItems = obsAtlasController.data.filter(item =>
        obsAtlasController.activeCategory === 'all' || item.categoria === obsAtlasController.activeCategory
    );

    if (summary) {
        if (obsAtlasController.activeCategory === 'all') {
            summary.textContent = `${visibleItems.length} organizações verificadas em múltiplos continentes.`;
        } else {
            const meta = OBS_ATLAS_CATEGORY_META[obsAtlasController.activeCategory];
            summary.textContent = `${visibleItems.length} organizações em “${meta?.label || 'categoria'}”.`;
        }
    }

    list.innerHTML = visibleItems.map(item => {
        const meta = OBS_ATLAS_CATEGORY_META[item.categoria] || OBS_ATLAS_CATEGORY_META.companheiros;
        return `
            <article class="obs-atlas-list-card" data-atlas-org-card="${item.id}">
                <div class="obs-atlas-list-topline">
                    <span class="obs-atlas-list-badge obs-atlas-list-badge--icon" style="--atlas-badge-color:${meta.color};" title="${meta.label}" aria-label="${meta.label}">${obsAtlasPawIcon(item.categoria, 'obs-atlas-card-paw')}</span>
                    <span class="obs-atlas-list-country">${item.pais}</span>
                </div>
                <h3>${item.nome}</h3>
                <p>${item.foco}</p>
                <div class="obs-atlas-list-meta">
                    <span class="material-icons" aria-hidden="true">location_on</span>
                    <span>${item.cidade}</span>
                </div>
                <div class="obs-atlas-list-actions">
                    <button type="button" class="obs-secondary-action" data-atlas-open="${item.id}">
                        <span class="material-icons" aria-hidden="true">info</span>
                        Ver detalhes e fonte
                    </button>
                </div>
            </article>
        `;
    }).join('');

    list.querySelectorAll('[data-atlas-open], [data-atlas-org-card]').forEach(node => {
        node.addEventListener('click', (event) => {
            const id = node.dataset.atlasOpen || node.dataset.atlasOrgCard;
            if (event.target.closest('a')) return;
            obsAtlasFocusOrg(id, true);
        });
    });
}

function obsAtlasOpenModal(org) {
    const modal = document.getElementById('obs-atlas-modal');
    const body = document.getElementById('obs-atlas-modal-body');
    if (!modal || !body || !org) return;

    const meta = OBS_ATLAS_CATEGORY_META[org.categoria] || OBS_ATLAS_CATEGORY_META.companheiros;
    body.innerHTML = `
        <div class="obs-atlas-modal-header">
            <span class="obs-atlas-modal-badge" style="--atlas-badge-color:${meta.color};"><span class="material-icons" aria-hidden="true">${meta.icon}</span>${meta.label}</span>
            <h3 id="obs-atlas-modal-title">${org.nome}</h3>
            <p>${org.foco}</p>
        </div>
        <div class="obs-atlas-modal-grid">
            <div class="obs-atlas-modal-item">
                <span class="material-icons" aria-hidden="true">location_on</span>
                <div>
                    <strong>Endereço</strong>
                    <p>${org.endereco}</p>
                </div>
            </div>
            <div class="obs-atlas-modal-item">
                <span class="material-icons" aria-hidden="true">public</span>
                <div>
                    <strong>Site oficial</strong>
                    <p><a href="${org.site}" target="_blank" rel="noopener">${org.site}</a></p>
                </div>
            </div>
            <div class="obs-atlas-modal-item">
                <span class="material-icons" aria-hidden="true">verified</span>
                <div>
                    <strong>Fonte de verificação</strong>
                    <p><a href="${org.fonte_url}" target="_blank" rel="noopener">${org.fonte_label}</a></p>
                </div>
            </div>
            <div class="obs-atlas-modal-item">
                <span class="material-icons" aria-hidden="true">travel_explore</span>
                <div>
                    <strong>Localização</strong>
                    <p>${org.cidade}, ${org.pais}</p>
                </div>
            </div>
        </div>
    `;

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('obs-atlas-modal-open');
}

function obsAtlasCloseModal() {
    const modal = document.getElementById('obs-atlas-modal');
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('obs-atlas-modal-open');
}

function obsAtlasFocusOrg(id, openModal = false) {
    const markerEntry = obsAtlasController.markers.find(entry => entry.org.id === id);
    if (!markerEntry || !obsAtlasController.map) return;

    const { marker, org } = markerEntry;
    obsAtlasController.map.flyTo([org.latitude, org.longitude], Math.max(obsAtlasController.map.getZoom(), 4), {
        animate: true,
        duration: 1.1
    });

    document.querySelectorAll('[data-atlas-org-card]').forEach(card => {
        card.classList.toggle('is-highlighted', card.dataset.atlasOrgCard === id);
    });

    if (openModal) obsAtlasOpenModal(org);
}

function obsAtlasApplyFilter(category) {
    obsAtlasController.activeCategory = category;

    obsAtlasController.markers.forEach(({ marker, org }) => {
        const shouldShow = category === 'all' || org.categoria === category;
        if (shouldShow) {
            if (!obsAtlasController.map.hasLayer(marker)) marker.addTo(obsAtlasController.map);
        } else if (obsAtlasController.map.hasLayer(marker)) {
            obsAtlasController.map.removeLayer(marker);
        }
    });

    obsAtlasController.lines.forEach(({ line, category: lineCategory }) => {
        const shouldShow = category === 'all' || lineCategory === category;
        if (shouldShow) {
            if (!obsAtlasController.map.hasLayer(line)) line.addTo(obsAtlasController.map);
        } else if (obsAtlasController.map.hasLayer(line)) {
            obsAtlasController.map.removeLayer(line);
        }
    });

    const visibleMarkers = obsAtlasController.markers
        .filter(({ org }) => category === 'all' || org.categoria === category)
        .map(({ marker }) => marker);

    if (visibleMarkers.length > 1) {
        const group = window.L.featureGroup(visibleMarkers);
        obsAtlasController.map.fitBounds(group.getBounds().pad(0.24), { maxZoom: 4 });
    } else if (visibleMarkers.length === 1) {
        obsAtlasController.map.setView(visibleMarkers[0].getLatLng(), 5);
    } else {
        obsAtlasController.map.setView([18, 0], 2);
    }

    obsAtlasRenderLegend(obsAtlasController.data);
    obsAtlasRenderList();
}

async function initObsAtlasMap() {
    const data = getObsAtlasData();
    const mapEl = document.getElementById('obs-atlas-map');
    const statusEl = document.getElementById('obs-atlas-status');

    obsAtlasDestroyMap();
    obsAtlasController.data = data;

    if (!mapEl) return;

    try {
        if (statusEl) statusEl.textContent = 'Carregando mapa e marcadores globais…';
        await obsAtlasEnsureLeaflet();
        if (!document.getElementById('obs-atlas-map')) return;

        const map = window.L.map(mapEl, {
            zoomControl: true,
            minZoom: 2,
            maxZoom: 8,
            worldCopyJump: true,
            scrollWheelZoom: false
        }).setView([18, 0], 2);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        obsAtlasController.map = map;

        data.forEach(org => {
            const marker = window.L.marker([org.latitude, org.longitude], {
                icon: obsAtlasCreateMarkerIcon(org.categoria),
                keyboard: true,
                title: `${org.nome} — ${org.cidade}, ${org.pais}`
            });

            marker.on('click', () => obsAtlasFocusOrg(org.id, true));
            marker.on('keypress', () => obsAtlasFocusOrg(org.id, true));
            marker.addTo(map);
            obsAtlasController.markers.push({ org, marker });
        });

        Object.entries(OBS_ATLAS_CATEGORY_META).forEach(([category, meta]) => {
            const coords = data
                .filter(item => item.categoria === category)
                .sort((a, b) => a.longitude - b.longitude)
                .map(item => [item.latitude, item.longitude]);

            if (coords.length < 2) return;

            const line = window.L.polyline(coords, {
                color: meta.color,
                weight: 2,
                opacity: 0.4,
                dashArray: '5 7',
                smoothFactor: 1
            }).addTo(map);

            obsAtlasController.lines.push({ category, line });
        });

        obsAtlasRenderLegend(data);
        obsAtlasRenderList();
        obsAtlasApplyFilter('all');

        if (statusEl) statusEl.textContent = 'Clique nos marcadores ou nos cards laterais para abrir o modal com endereço e site oficial.';
        setTimeout(() => map.invalidateSize(), 180);
    } catch (error) {
        if (statusEl) {
            statusEl.textContent = 'Não foi possível carregar o mapa agora. Verifique sua conexão e tente novamente.';
        }
        console.error(error);
    }
}

function renderObsAtlas(c) {
    const data = getObsAtlasData().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    const countries = new Set(data.map(item => item.pais)).size;
    const continents = 6;

    c.innerHTML = `
        <section class="obs-education-shell obs-atlas-shell">
            <div class="obs-section-intro">
                <span class="page-badge"><span class="material-icons" aria-hidden="true">public</span> Atlas Global</span>
                <h1>Mapa-múndi de ONGs da causa animal</h1>
                <p>Uma camada global inicial para localizar organizações verificadas ligadas à causa animal ampla, aos animais explorados na alimentação, à substituição da experimentação animal e à crítica do entretenimento com animais. Clique em cada ponto para abrir o modal com nome, endereço e site oficial.</p>
            </div>

            <div class="obs-atlas-kpis">
                <div class="obs-edu-kpi">
                    <strong>${data.length}</strong>
                    <h2>ONGs verificadas</h2>
                    <p>Curadoria inicial com dados confirmados por sites oficiais e registros institucionais.</p>
                </div>
                <div class="obs-edu-kpi">
                    <strong>${countries}</strong>
                    <h2>Países mapeados</h2>
                    <p>Entradas distribuídas em diferentes regiões do mundo, com foco em endereços institucionais.</p>
                </div>
                <div class="obs-edu-kpi">
                    <strong>${continents}</strong>
                    <h2>Regiões continentais</h2>
                    <p>América do Norte, América do Sul, Europa, África, Ásia e Oceania na curadoria atual.</p>
                </div>
                <div class="obs-edu-kpi">
                    <strong>4</strong>
                    <h2>Camadas temáticas</h2>
                    <p>Quatro ícones de patas distinguem as camadas sem depender apenas de cor.</p>
                </div>
            </div>

            <div class="obs-atlas-icon-key" aria-label="Legenda das camadas do mapa">
                ${Object.entries(OBS_ATLAS_CATEGORY_META).map(([key, meta]) => `<span class="obs-atlas-key-icon" style="--atlas-card-color:${meta.color};" title="${meta.label}" aria-label="${meta.label}">${obsAtlasPawIcon(key, 'obs-atlas-key-paw')}</span>`).join('')}
            </div>

            <div class="obs-atlas-filters" id="obs-atlas-filters" aria-label="Filtrar mapa por categoria"></div>

            <div class="obs-atlas-layout">
                <div class="obs-atlas-map-card">
                    <div class="obs-atlas-map-head">
                        <div>
                            <h2>Rede sobre o mapa</h2>
                            <p id="obs-atlas-status">Preparando a visualização global…</p>
                        </div>
                        <button type="button" class="obs-secondary-action" id="obs-atlas-reset">
                            <span class="material-icons" aria-hidden="true">filter_alt_off</span>
                            Limpar filtro
                        </button>
                    </div>
                    <div id="obs-atlas-map" class="obs-atlas-map" role="application" aria-label="Mapa-múndi com organizações da causa animal"></div>
                </div>

                <aside class="obs-atlas-sidebar">
                    <div class="obs-atlas-sidebar-head">
                        <h2>Rede confirmada</h2>
                        <p id="obs-atlas-filter-summary">${data.length} organizações verificadas em múltiplos continentes.</p>
                    </div>
                    <div class="obs-atlas-list" id="obs-atlas-list"></div>
                </aside>
            </div>

            <div class="obs-atlas-footnote">
                <span class="material-icons" aria-hidden="true">info</span>
                <p>Os pontos indicam endereços institucionais, escritórios ou endereços postais divulgados oficialmente por cada organização. As coordenadas foram aproximadas para visualização cartográfica.</p>
            </div>
        </section>

        <div class="obs-atlas-modal" id="obs-atlas-modal" aria-hidden="true" hidden>
            <div class="obs-atlas-modal-backdrop" data-atlas-close="true"></div>
            <div class="obs-atlas-modal-panel" role="dialog" aria-modal="true" aria-labelledby="obs-atlas-modal-title">
                <button type="button" class="obs-atlas-modal-close" id="obs-atlas-modal-close" aria-label="Fechar modal">
                    <span class="material-icons" aria-hidden="true">close</span>
                </button>
                <div id="obs-atlas-modal-body"></div>
            </div>
        </div>
    `;

    const resetButton = document.getElementById('obs-atlas-reset');
    if (resetButton) {
        resetButton.addEventListener('click', () => obsAtlasApplyFilter('all'));
    }

    const closeButton = document.getElementById('obs-atlas-modal-close');
    if (closeButton) closeButton.addEventListener('click', obsAtlasCloseModal);

    const modal = document.getElementById('obs-atlas-modal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target.closest('[data-atlas-close="true"]')) obsAtlasCloseModal();
        });
    }

    document.removeEventListener('keydown', window.__obsAtlasEscHandler || (() => {}));
    window.__obsAtlasEscHandler = (event) => {
        if (event.key === 'Escape') obsAtlasCloseModal();
    };
    document.addEventListener('keydown', window.__obsAtlasEscHandler);

    initObsAtlasMap();
}

function renderObsEntretenimento(c) {
    const db = window.OBSERVATORIO_DB.entretenimento;
    c.innerHTML = `
        <section class="obs-card obs-section-card"><span class="obs-eyebrow">Bases regulatórias verificáveis</span><h1>Animais, cativeiro e entretenimento</h1><p>${obsEscapeHTML(db.nota)}</p></section>
        <div class="obs-grid-2 obs-data-card-grid">${db.referencias.map(item=>`<article class="obs-data-card"><span class="obs-eyebrow">${obsEscapeHTML(item.titulo)}</span><strong>${obsEscapeHTML(item.valor)}</strong><p>${obsEscapeHTML(item.texto)}</p>${researchSourceLink(item.fonte,item.url)}</article>`).join('')}</div>
        <section class="obs-card obs-section-card"><span class="obs-eyebrow">IBAMA · dados abertos</span><h2>Plantel de fauna silvestre em cativeiro</h2><p>O IBAMA disponibiliza separadamente bases de plantel exato e estimado. Elas incluem mais categorias do que entretenimento; portanto, o Observatório não soma o conjunto bruto como se fosse “animais mantidos para entretenimento”.</p><div class="obs-grid-2">${db.bases_plantel.map(base=>`<article class="obs-segment-card"><span class="material-icons obs-big-data-icon" aria-hidden="true">dataset</span><h3>${obsEscapeHTML(base.nome)}</h3><strong>${obsEscapeHTML(base.tipo)}</strong><p>${obsEscapeHTML(base.descricao)}</p>${researchSourceLink('IBAMA · Dados Abertos',base.url)}</article>`).join('')}</div><div class="obs-data-note obs-data-note--prominent"><strong>Próximo nível de precisão:</strong> para publicar “quantos animais em zoológicos por UF”, é necessário filtrar os microdados do SisFauna pela categoria do empreendimento e combinar plantel exato + estimado sem dupla contagem. Como o portal não oferece esse agregado pronto e verificável, não estou fabricando o número.</div></section>`;
}

const CAPES_BTD_RESOURCES = [
    { year: 2015, id: '2ba5eaae-2e2c-4886-8c5c-0d20bd115ef2' },
    { year: 2016, id: '7403d9ac-0e71-4539-bc44-8d7aa7b8f452' },
    { year: 2017, id: '902bd63b-137f-4090-89e9-cab94f12c41d' },
    { year: 2018, id: '638668a6-07da-4c7e-8aab-9044ae3cc753' },
    { year: 2019, id: '8f4f2bce-2744-460a-8f14-f1648c7a16df' },
    { year: 2020, id: 'e37df31a-f250-4405-8b21-ca7e5c7c1696' },
    { year: 2021, id: '068003e4-196c-41f4-8c35-1f7c94b4e55c' },
    { year: 2022, id: '78f73608-6f5e-463c-ba79-0bff4f8a578d' },
    { year: 2023, id: 'bb0e4a57-ea99-49e1-a859-36391f541797' },
    { year: 2024, id: '87133ba7-ac99-4d87-966e-8f580bc96231' },
];

const CAPES_API_URL = 'https://dadosabertos.capes.gov.br/pt_BR/api/3/action/datastore_search';
const CAPES_PAGE_SIZE = 20;
const capesSearchState = {
    query: '',
    year: 'all',
    type: 'all',
    records: [],
    totals: {},
    offsets: {},
    exhausted: {},
    loading: false,
};

function obsEscapeHTML(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function obsSafeUrl(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    try {
        const parsed = new URL(raw, window.location.origin);
        if (!['http:', 'https:'].includes(parsed.protocol)) return '';
        return parsed.href;
    } catch (_) {
        return '';
    }
}

function firstObsValue(record, keys) {
    for (const key of keys) {
        const value = record?.[key];
        if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
    }
    return '';
}

function normalizeCapesRecord(record, resourceYear) {
    const title = firstObsValue(record, ['NM_PRODUCAO', 'NM_TITULO', 'DS_TITULO', 'TITULO']) || 'Produção sem título informado';
    const author = firstObsValue(record, ['NM_DISCENTE', 'NM_AUTOR', 'AUTOR']);
    const institution = firstObsValue(record, ['NM_ENTIDADE_ENSINO', 'SG_ENTIDADE_ENSINO', 'NM_IES', 'IES']);
    const program = firstObsValue(record, ['NM_PROGRAMA', 'NM_PROGRAMA_IES', 'PROGRAMA']);
    const area = firstObsValue(record, ['NM_AREA_CONHECIMENTO', 'NM_AREA_AVALIACAO', 'NM_AREA_CONCENTRACAO']);
    const type = firstObsValue(record, ['NM_SUBTIPO_PRODUCAO', 'NM_GRAU_ACADEMICO', 'TP_TRABALHO']);
    const summary = firstObsValue(record, ['DS_RESUMO', 'RESUMO']);
    const keywords = firstObsValue(record, ['DS_PALAVRA_CHAVE', 'DS_KEYWORD', 'PALAVRA_CHAVE']);
    const advisor = firstObsValue(record, ['NM_ORIENTADOR', 'ORIENTADOR']);
    const date = firstObsValue(record, ['DT_TITULACAO', 'DT_DEFESA', 'DATA_DEFESA']);
    const year = Number(firstObsValue(record, ['AN_BASE', 'ANO_BASE', 'ANO'])) || resourceYear;
    const url = obsSafeUrl(firstObsValue(record, ['DS_URL_TEXTO_COMPLETO', 'URL_TEXTO_COMPLETO', 'DS_URL']));
    const id = firstObsValue(record, ['ID_PRODUCAO_INTELECTUAL', 'ID_ADD_PRODUCAO_INTELECTUAL', '_id']) || `${resourceYear}-${title}-${author}`;
    return { id, title, author, institution, program, area, type, summary, keywords, advisor, date, year, url, _raw: record };
}

function capesJSONP(params) {
    return new Promise((resolve, reject) => {
        const callbackName = `__alterecoCapes_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const query = new URLSearchParams({ ...params, callback: callbackName });
        const script = document.createElement('script');
        let done = false;
        const timeout = window.setTimeout(() => finish(new Error('A CAPES demorou para responder.')), 18000);

        function cleanup() {
            window.clearTimeout(timeout);
            script.remove();
            try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; }
        }
        function finish(error, data) {
            if (done) return;
            done = true;
            cleanup();
            error ? reject(error) : resolve(data);
        }

        window[callbackName] = data => finish(null, data);
        script.onerror = () => finish(new Error('Não foi possível acessar a API de Dados Abertos da CAPES.'));
        script.src = `${CAPES_API_URL}?${query.toString()}`;
        document.head.appendChild(script);
    });
}

async function fetchCapesResource(resource, searchTerm, offset = 0) {
    const params = {
        resource_id: resource.id,
        limit: String(CAPES_PAGE_SIZE),
        offset: String(offset),
        q: searchTerm,
    };

    // Primeiro tenta fetch normal; se o navegador bloquear CORS, usa o JSONP recomendado pelo CKAN/CAPES.
    try {
        const response = await fetch(`${CAPES_API_URL}?${new URLSearchParams(params).toString()}`, { mode: 'cors' });
        if (!response.ok) throw new Error(`CAPES HTTP ${response.status}`);
        const data = await response.json();
        if (!data?.success) throw new Error(data?.error?.message || 'Resposta inválida da CAPES.');
        return data;
    } catch (_) {
        const data = await capesJSONP(params);
        if (!data?.success) throw new Error(data?.error?.message || 'Resposta inválida da CAPES.');
        return data;
    }
}

function selectedCapesResources() {
    if (capesSearchState.year === 'all') return CAPES_BTD_RESOURCES;
    return CAPES_BTD_RESOURCES.filter(item => String(item.year) === String(capesSearchState.year));
}

function capesTypeMatches(record) {
    if (capesSearchState.type === 'all') return true;
    const value = `${record.type} ${firstObsValue(record._raw, ['NM_GRAU_ACADEMICO'])}`.toLocaleLowerCase('pt-BR');
    return capesSearchState.type === 'tese'
        ? value.includes('tese') || value.includes('doutor')
        : value.includes('disser') || value.includes('mestr');
}

function renderCapesSearchStatus(message, isError = false) {
    const el = document.getElementById('capes-search-status');
    if (!el) return;
    el.className = `obs-capes-status${isError ? ' is-error' : ''}`;
    el.textContent = message;
}

function capesRecordHTML(record) {
    const summary = record.summary ? obsEscapeHTML(record.summary) : 'Resumo não informado neste registro da CAPES.';
    const urlButton = record.url
        ? `<a class="obs-capes-card-link" href="${obsEscapeHTML(record.url)}" target="_blank" rel="noopener noreferrer"><span class="material-icons" aria-hidden="true">open_in_new</span> Texto completo</a>`
        : `<a class="obs-capes-card-link is-secondary" href="https://catalogodeteses.capes.gov.br/catalogo-teses/#!/" target="_blank" rel="noopener noreferrer"><span class="material-icons" aria-hidden="true">search</span> Catálogo CAPES</a>`;

    return `
        <article class="obs-capes-card">
            <div class="obs-capes-card-topline">
                <span class="obs-capes-year">${obsEscapeHTML(record.year)}</span>
                ${record.type ? `<span class="obs-capes-type">${obsEscapeHTML(record.type)}</span>` : ''}
            </div>
            <h4>${obsEscapeHTML(record.title)}</h4>
            <div class="obs-capes-meta">
                ${record.author ? `<span><strong>Autoria:</strong> ${obsEscapeHTML(record.author)}</span>` : ''}
                ${record.institution ? `<span><strong>IES:</strong> ${obsEscapeHTML(record.institution)}</span>` : ''}
                ${record.program ? `<span><strong>Programa:</strong> ${obsEscapeHTML(record.program)}</span>` : ''}
                ${record.area ? `<span><strong>Área:</strong> ${obsEscapeHTML(record.area)}</span>` : ''}
                ${record.advisor ? `<span><strong>Orientação:</strong> ${obsEscapeHTML(record.advisor)}</span>` : ''}
            </div>
            <p class="obs-capes-summary">${summary}</p>
            ${record.keywords ? `<p class="obs-capes-keywords"><strong>Palavras-chave:</strong> ${obsEscapeHTML(record.keywords)}</p>` : ''}
            <div class="obs-capes-card-actions">${urlButton}</div>
        </article>
    `;
}

function renderCapesResults() {
    const list = document.getElementById('capes-results-list');
    const totalEl = document.getElementById('capes-results-total');
    const more = document.getElementById('capes-load-more');
    if (!list || !totalEl) return;

    const visible = capesSearchState.records.filter(capesTypeMatches);
    const unique = [];
    const seen = new Set();
    for (const record of visible) {
        const key = `${record.year}|${record.id}|${record.title.toLocaleLowerCase('pt-BR')}`;
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(record);
    }
    unique.sort((a, b) => (b.year - a.year) || a.title.localeCompare(b.title, 'pt-BR'));

    const rawTotal = Object.values(capesSearchState.totals).reduce((sum, value) => sum + Number(value || 0), 0);
    const heroNumber = document.getElementById('capes-hero-number');
    if (heroNumber && capesSearchState.query) heroNumber.textContent = rawTotal.toLocaleString('pt-BR');
    const selectedTypeLabel = capesSearchState.type === 'tese' ? 'teses' : 'dissertações';
    totalEl.textContent = rawTotal
        ? (capesSearchState.type === 'all'
            ? `${rawTotal.toLocaleString('pt-BR')} registros encontrados nos microdados consultados`
            : `${rawTotal.toLocaleString('pt-BR')} registros brutos encontrados · exibindo apenas ${selectedTypeLabel} entre os resultados carregados`)
        : 'Nenhum registro encontrado para esta busca.';

    list.innerHTML = unique.length
        ? unique.map(capesRecordHTML).join('')
        : `<div class="obs-capes-empty"><span class="material-icons" aria-hidden="true">search_off</span><strong>Nenhum resultado carregado.</strong><span>Tente outro termo, por exemplo “bioética”, “bem-estar animal”, “senciência” ou “métodos substitutivos”.</span></div>`;

    const resources = selectedCapesResources();
    const hasMore = resources.some(resource => !capesSearchState.exhausted[resource.year]);
    if (more) more.hidden = !hasMore || rawTotal === 0;
}

window.searchCapesTheses = async function(reset = true) {
    if (capesSearchState.loading) return;
    const input = document.getElementById('capes-search-input');
    const yearSelect = document.getElementById('capes-year-filter');
    const typeSelect = document.getElementById('capes-type-filter');
    const button = document.getElementById('capes-search-button');
    const term = String(input?.value || '').trim();

    if (term.length < 2) {
        renderCapesSearchStatus('Digite pelo menos 2 caracteres para pesquisar os microdados da CAPES.', true);
        input?.focus();
        return;
    }

    if (reset) {
        capesSearchState.query = term;
        capesSearchState.year = yearSelect?.value || 'all';
        capesSearchState.type = typeSelect?.value || 'all';
        capesSearchState.records = [];
        capesSearchState.totals = {};
        capesSearchState.offsets = {};
        capesSearchState.exhausted = {};
        document.getElementById('capes-results-list').innerHTML = '';
    } else {
        capesSearchState.type = typeSelect?.value || capesSearchState.type;
    }

    const resources = selectedCapesResources();
    capesSearchState.loading = true;
    if (button) button.disabled = true;
    renderCapesSearchStatus(`Consultando ${resources.length} conjunto${resources.length > 1 ? 's' : ''} anual${resources.length > 1 ? 'is' : ''} da CAPES…`);

    try {
        const jobs = resources
            .filter(resource => !capesSearchState.exhausted[resource.year])
            .map(async resource => {
                const offset = capesSearchState.offsets[resource.year] || 0;
                try {
                    const payload = await fetchCapesResource(resource, capesSearchState.query, offset);
                    const result = payload?.result || {};
                    const rows = Array.isArray(result.records) ? result.records : [];
                    capesSearchState.totals[resource.year] = Number(result.total || 0);
                    capesSearchState.offsets[resource.year] = offset + rows.length;
                    capesSearchState.exhausted[resource.year] = rows.length === 0 || capesSearchState.offsets[resource.year] >= Number(result.total || 0);
                    return rows.map(row => normalizeCapesRecord(row, resource.year));
                } catch (error) {
                    console.warn(`AlterECO: CAPES ${resource.year} indisponível`, error);
                    capesSearchState.exhausted[resource.year] = true;
                    return [];
                }
            });

        const batches = await Promise.all(jobs);
        capesSearchState.records.push(...batches.flat());
        renderCapesResults();
        const workingYears = resources.filter(resource => capesSearchState.totals[resource.year] !== undefined).length;
        renderCapesSearchStatus(workingYears
            ? `Microdados CAPES carregados: ${workingYears} ano${workingYears > 1 ? 's' : ''} responderam à consulta.`
            : 'A API da CAPES não respondeu agora. Use o botão do Catálogo CAPES ou tente novamente em alguns instantes.',
            workingYears === 0);
    } finally {
        capesSearchState.loading = false;
        if (button) button.disabled = false;
    }
};

window.loadMoreCapesTheses = function() {
    return window.searchCapesTheses(false);
};

window.updateCapesTypeFilter = function() {
    const select = document.getElementById('capes-type-filter');
    capesSearchState.type = select?.value || 'all';
    renderCapesResults();
};

window.setCapesQuickSearch = function(term) {
    const input = document.getElementById('capes-search-input');
    if (!input) return;
    input.value = term;
    window.searchCapesTheses(true);
};

function getCnpqGroupCatalog(area) {
    const catalog = window.OBSERVATORIO_DB?.pesquisa?.grupos_catalogo || {};
    return Array.isArray(catalog[area]) ? catalog[area] : [];
}

function normalizeCnpqSearch(value) {
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

window.filterCNPqModalGroups = function() {
    const input = document.getElementById('cnpq-modal-search');
    const ufSelect = document.getElementById('cnpq-modal-uf');
    const query = normalizeCnpqSearch(input?.value || '');
    const uf = String(ufSelect?.value || 'all');
    let visible = 0;

    document.querySelectorAll('#cnpq-groups-modal .obs-cnpq-group-card').forEach(card => {
        const haystack = normalizeCnpqSearch(card.dataset.search || '');
        const matchesQuery = !query || haystack.includes(query);
        const matchesUf = uf === 'all' || card.dataset.uf === uf;
        const show = matchesQuery && matchesUf;
        card.hidden = !show;
        if (show) visible += 1;
    });

    const counter = document.getElementById('cnpq-modal-visible-count');
    if (counter) counter.textContent = `${visible} grupo${visible === 1 ? '' : 's'} exibido${visible === 1 ? '' : 's'}`;
};

window.closeCNPqModal = function() {
    const modal = document.getElementById('cnpq-groups-modal');
    if (modal) modal.remove();
    document.body.classList.remove('obs-modal-open');
};

window.openCNPqModal = function(area) {
    window.closeCNPqModal();
    const db = window.OBSERVATORIO_DB.pesquisa;
    const metric = db.grupos.find(group => group.area === area);
    const groups = getCnpqGroupCatalog(area);
    const meta = db.dgp_meta || window.ALTERECO_DGP_2023?.meta || {};
    const officialUrl = meta.consulta_corrente_url || 'https://dgp.cnpq.br/dgp/faces/consulta/consulta_parametrizada.jsf';
    const censusUrl = meta.fonte_censo_url || 'https://lattes.cnpq.br/web/dgp/censos2';
    const ufs = [...new Set(groups.map(group => group.uf).filter(Boolean))].sort();

    const modal = document.createElement('div');
    modal.id = 'cnpq-groups-modal';
    modal.className = 'obs-modal-backdrop';
    modal.innerHTML = `
        <section class="obs-modal-panel" role="dialog" aria-modal="true" aria-labelledby="cnpq-modal-title">
            <div class="obs-modal-header">
                <div>
                    <span class="obs-modal-kicker">Base nominal temática · DGP/CNPq · referência ${obsEscapeHTML(meta.ano_referencia || 2023)}</span>
                    <h2 id="cnpq-modal-title">${obsEscapeHTML(area)}</h2>
                    <p><strong>${obsEscapeHTML(groups.length)} grupos nominais catalogados</strong>. O total é calculado automaticamente a partir da base verificável do AlterECO.</p>
                </div>
                <button class="obs-modal-close" type="button" onclick="closeCNPqModal()" aria-label="Fechar lista de grupos"><span class="material-icons" aria-hidden="true">close</span></button>
            </div>

            <div class="obs-cnpq-context-grid">
                <div><strong>${obsEscapeHTML(meta.total_grupos_brasil || '42.852')}</strong><span>grupos no Brasil no Censo DGP 2023</span></div>
                <div><strong>${obsEscapeHTML(meta.total_instituicoes_brasil || '587')}</strong><span>instituições no Censo DGP 2023</span></div>
                <div><strong>${obsEscapeHTML(groups.length)}</strong><span>grupos desta seleção temática nominal</span></div>
            </div>

            <div class="obs-cnpq-notice">
                <span class="material-icons" aria-hidden="true">verified</span>
                <div><strong>Base nominal, não estimativa.</strong> Os itens abaixo têm fonte identificável no DGP/CNPq ou em página institucional/científica que identifica o grupo. Um mesmo grupo pode aparecer em mais de uma categoria quando sua atuação é interdisciplinar.</div>
            </div>

            <div class="obs-modal-tools">
                <label class="obs-modal-search">
                    <span class="material-icons" aria-hidden="true">search</span>
                    <input id="cnpq-modal-search" type="search" placeholder="Buscar grupo, instituição, liderança ou tema…" oninput="filterCNPqModalGroups()" aria-label="Buscar nesta lista de grupos">
                </label>
                <label class="obs-modal-uf-filter">
                    <span>UF</span>
                    <select id="cnpq-modal-uf" onchange="filterCNPqModalGroups()">
                        <option value="all">Todas</option>
                        ${ufs.map(uf => `<option value="${obsEscapeHTML(uf)}">${obsEscapeHTML(uf)}</option>`).join('')}
                    </select>
                </label>
            </div>
            <div class="obs-modal-results-meta"><span id="cnpq-modal-visible-count">${groups.length} grupos exibidos</span></div>

            <div class="obs-modal-list">
                ${groups.length ? groups.map(group => {
                    const searchData = [group.nome, group.instituicao, group.uf, group.lider, ...(group.temas || [])].filter(Boolean).join(' ');
                    const sourceHref = obsSafeUrl(group.fonte_url) || '';
                    return `
                    <article class="obs-cnpq-group-card" data-uf="${obsEscapeHTML(group.uf || '')}" data-search="${obsEscapeHTML(searchData)}">
                        <div class="obs-cnpq-group-main">
                            <div class="obs-cnpq-group-tags">
                                ${group.aderencia ? `<span>${obsEscapeHTML(group.aderencia)}</span>` : ''}
                                ${group.uf ? `<span>${obsEscapeHTML(group.uf)}</span>` : ''}
                            </div>
                            <h3>${obsEscapeHTML(group.nome)}</h3>
                            <p>${obsEscapeHTML(group.instituicao || '')}</p>
                            ${group.lider ? `<span><strong>Liderança:</strong> ${obsEscapeHTML(group.lider)}</span>` : ''}
                            ${Array.isArray(group.temas) && group.temas.length ? `<div class="obs-cnpq-topic-list">${group.temas.slice(0, 5).map(topic => `<span>${obsEscapeHTML(topic)}</span>`).join('')}</div>` : ''}
                            ${group.fonte ? `<span class="obs-cnpq-source"><strong>Fonte:</strong> ${sourceHref ? `<a href="${obsEscapeHTML(sourceHref)}" target="_blank" rel="noopener noreferrer">${obsEscapeHTML(group.fonte)}</a>` : obsEscapeHTML(group.fonte)}</span>` : ''}
                        </div>
                        <a class="obs-cnpq-open-group" href="${obsEscapeHTML(obsSafeUrl(group.link) || officialUrl)}" target="_blank" rel="noopener noreferrer">Abrir grupo <span class="material-icons" aria-hidden="true">north_east</span></a>
                    </article>`;
                }).join('') : `
                    <div class="obs-capes-empty"><span class="material-icons" aria-hidden="true">manage_search</span><strong>Lista nominal em expansão.</strong><span>Use a consulta oficial do DGP enquanto novos vínculos são conferidos.</span></div>
                `}
            </div>
            <div class="obs-modal-footer">
                <a class="obs-primary-action" href="${obsEscapeHTML(officialUrl)}" target="_blank" rel="noopener noreferrer"><span class="material-icons" aria-hidden="true">travel_explore</span> Buscar na Base Corrente</a>
                <a class="obs-secondary-action" href="${obsEscapeHTML(censusUrl)}" target="_blank" rel="noopener noreferrer"><span class="material-icons" aria-hidden="true">database</span> Censo DGP 2023</a>
                <button type="button" class="obs-secondary-action" onclick="closeCNPqModal()">Fechar</button>
            </div>
        </section>`;
    modal.addEventListener('click', event => { if (event.target === modal) window.closeCNPqModal(); });
    document.body.appendChild(modal);
    document.body.classList.add('obs-modal-open');
    modal.querySelector('#cnpq-modal-search')?.focus();
};

if (!window.__alterecoObsModalEscapeBound) {
    window.__alterecoObsModalEscapeBound = true;
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && document.getElementById('cnpq-groups-modal')) window.closeCNPqModal();
    });
}

function renderObsPesquisa(c) {
    const db = window.OBSERVATORIO_DB.pesquisa;
    c.innerHTML = `
        <div class="obs-research-shell">
            <h1>Pesquisa e Academia</h1>
            <p class="obs-research-intro">Explore grupos de pesquisa relacionados à questão animal e pesquise diretamente os microdados oficiais de teses e dissertações da CAPES.</p>

            <div class="obs-research-top-grid">
                <section class="obs-cnpq-panel">
                    <div class="obs-section-heading-row">
                        <div>
                            <span class="obs-eyebrow">CNPq · Diretório de Grupos de Pesquisa</span>
                            <h2>Grupos de Pesquisa</h2>
                        </div>
                        <a href="https://lattes.cnpq.br/web/dgp" target="_blank" rel="noopener noreferrer">Base Corrente <span class="material-icons" aria-hidden="true">north_east</span></a>
                    </div>
                    <div class="obs-cnpq-summary">
                        <span><strong>${obsEscapeHTML(db.dgp_meta?.total_grupos_brasil || '42.852')}</strong> grupos no Brasil · Censo DGP ${obsEscapeHTML(db.dgp_meta?.ano_referencia || 2023)}</span>
                        <span><strong>${obsEscapeHTML(window.ALTERECO_DGP_2023?.grupos?.length || 0)}</strong> grupos únicos na base nominal temática AlterECO</span>
                    </div>
                    ${researchSourceLink(db.dgp_meta?.fonte_censo || 'CNPq · Censo DGP 2023', db.dgp_meta?.fonte_censo_url || 'https://lattes.cnpq.br/web/dgp/censos2', db.dgp_meta?.ano_referencia || 2023)}
                    <div class="obs-cnpq-metrics">
                        ${db.grupos.map((g, index) => `
                            <button class="obs-cnpq-metric" type="button" data-cnpq-index="${index}" aria-label="Ver ${obsEscapeHTML(g.total)} grupos catalogados em ${obsEscapeHTML(g.area)}">
                                <span>${obsEscapeHTML(g.area)}</span>
                                <strong>${obsEscapeHTML(g.total)} <small>grupos catalogados</small></strong>
                                <span class="material-icons" aria-hidden="true">arrow_forward</span>
                            </button>
                        `).join('')}
                    </div>
                    <p class="obs-data-note"><strong>Nota metodológica:</strong> os números acima correspondem à base nominal temática efetivamente listada no modal — não a estimativas. A referência nacional é o Censo DGP 2023. A base temática é expansível e deriva de uma única lista verificável, portanto o contador se atualiza automaticamente quando um grupo é acrescentado.</p>
                </section>

                <aside class="obs-capes-hero-card">
                    <span class="obs-eyebrow">CAPES · Dados Abertos</span>
                    <h2>Produção Científica</h2>
                    <strong id="capes-hero-number">2015–2024</strong>
                    <p>Pesquisa ao vivo em dez anos de microdados do Catálogo de Teses e Dissertações. O número de resultados passa a ser calculado pela sua busca — não por uma estimativa fixa.</p>
                    <a href="https://dadosabertos.capes.gov.br/group/catalogo-de-teses-e-dissertacoes-brasil" target="_blank" rel="noopener noreferrer">Abrir dados oficiais CAPES <span class="material-icons" aria-hidden="true">north_east</span></a>
                </aside>
            </div>

            <section class="obs-capes-browser" aria-labelledby="capes-browser-title">
                <div class="obs-section-heading-row obs-capes-browser-heading">
                    <div>
                        <span class="obs-eyebrow">Microdados oficiais</span>
                        <h2 id="capes-browser-title">Banco de Teses e Dissertações</h2>
                        <p>Busca em título, resumo, palavras-chave, autoria, programa, instituição e demais campos disponibilizados pela CAPES.</p>
                    </div>
                </div>

                <form class="obs-capes-search-form" onsubmit="event.preventDefault(); searchCapesTheses(true);">
                    <label class="obs-capes-query">
                        <span>Pesquisar</span>
                        <div class="obs-capes-input-wrap">
                            <span class="material-icons" aria-hidden="true">search</span>
                            <input id="capes-search-input" type="search" value="bem-estar animal" placeholder="Ex.: bioética, senciência, métodos substitutivos…" autocomplete="off">
                        </div>
                    </label>
                    <label>
                        <span>Ano</span>
                        <select id="capes-year-filter">
                            <option value="all">2015–2024</option>
                            ${[...CAPES_BTD_RESOURCES].reverse().map(r => `<option value="${r.year}">${r.year}</option>`).join('')}
                        </select>
                    </label>
                    <label>
                        <span>Tipo</span>
                        <select id="capes-type-filter" onchange="updateCapesTypeFilter()">
                            <option value="all">Todos</option>
                            <option value="tese">Teses</option>
                            <option value="dissertacao">Dissertações</option>
                        </select>
                    </label>
                    <button id="capes-search-button" class="obs-capes-search-button" type="submit"><span class="material-icons" aria-hidden="true">database</span> Buscar nos microdados</button>
                </form>

                <div class="obs-capes-quick-searches" aria-label="Buscas sugeridas">
                    ${['bem-estar animal', 'bioética', 'direito animal', 'senciência', 'ética animal', 'métodos substitutivos'].map(term => `<button type="button" onclick='setCapesQuickSearch(${JSON.stringify(term)})'>${obsEscapeHTML(term)}</button>`).join('')}
                </div>

                <div class="obs-capes-results-header">
                    <div>
                        <strong id="capes-results-total">Faça uma busca para consultar a produção.</strong>
                        <span id="capes-search-status" class="obs-capes-status">Fonte: Catálogo de Teses e Dissertações · Dados Abertos CAPES.</span>
                    </div>
                    <a href="https://catalogodeteses.capes.gov.br/catalogo-teses/#!/" target="_blank" rel="noopener noreferrer">Catálogo CAPES <span class="material-icons" aria-hidden="true">north_east</span></a>
                </div>
                <div id="capes-results-list" class="obs-capes-results-list"></div>
                <div class="obs-capes-load-more-wrap">
                    <button id="capes-load-more" class="obs-secondary-action" type="button" onclick="loadMoreCapesTheses()" hidden><span class="material-icons" aria-hidden="true">expand_more</span> Carregar mais resultados</button>
                </div>
            </section>
        </div>
    `;

    c.querySelectorAll('[data-cnpq-index]').forEach(button => {
        button.addEventListener('click', () => {
            const index = Number(button.dataset.cnpqIndex);
            const groupMetric = db.grupos[index];
            if (groupMetric) window.openCNPqModal(groupMetric.area);
        });
    });

    // A primeira busca já deixa a seção útil ao abrir.
    window.setTimeout(() => window.searchCapesTheses(true), 80);
}

function renderObsEducacao(c) {
    const db = window.OBSERVATORIO_DB.educacao;
    const pubs = Array.isArray(db.publicacoes_pt) ? db.publicacoes_pt : [];
    const pubCard = (p) => `
        <article class="obs-edu-pub-card" data-edu-level="${obsEscapeHTML(p.nivel)}">
            <div class="obs-edu-pub-topline">
                <span class="obs-edu-level ${p.nivel === 'basica' ? 'is-basic' : 'is-higher'}">${p.nivel === 'basica' ? 'Educação Básica / Escolar' : 'Ensino Superior / Universidade'}</span>
                <span class="obs-edu-year">${obsEscapeHTML(p.ano)}</span>
            </div>
            <span class="obs-eyebrow">${obsEscapeHTML(p.tipo || 'Publicação em português')}</span>
            <h3>${obsEscapeHTML(p.titulo)}</h3>
            <p class="obs-edu-authors">${obsEscapeHTML(p.autores || '')}</p>
            <p class="obs-edu-venue">${obsEscapeHTML(p.veiculo || '')}</p>
            <p class="obs-edu-summary">${obsEscapeHTML(p.resumo || '')}</p>
            <a class="obs-edu-pub-link" href="${obsEscapeHTML(obsSafeUrl(p.link) || '#')}" target="_blank" rel="noopener noreferrer">
                Abrir publicação <span class="material-icons" aria-hidden="true">north_east</span>
            </a>
        </article>`;

    c.innerHTML = `
        <div class="obs-education-shell">
            <header class="obs-section-intro">
                <span class="obs-eyebrow">Educação · referências em português</span>
                <h1>Educação Humanitária</h1>
                <p>${obsEscapeHTML(db.texto_apoio)}</p>
            </header>

            <div class="obs-edu-kpis">
                ${db.kpis.map(k => `
                    <article class="obs-edu-kpi">
                        <strong>${obsEscapeHTML(k.value)}</strong>
                        <h2>${obsEscapeHTML(k.label)}</h2>
                        <p>${obsEscapeHTML(k.desc)}</p>
                    </article>
                `).join('')}
            </div>
            <a class="obs-secondary-action" href="#obs-edu-publicacoes-title"><span class="material-icons" aria-hidden="true">library_books</span> Ver as ${pubs.length} referências e seus links abaixo</a>

            <section class="obs-edu-milestones" aria-labelledby="obs-edu-marcos-title">
                <div class="obs-section-heading-row">
                    <div>
                        <span class="obs-eyebrow">Políticas, instituições e práticas</span>
                        <h2 id="obs-edu-marcos-title">Marcos da mudança de paradigma</h2>
                    </div>
                </div>
                <div class="obs-edu-milestone-grid">
                    ${db.projetos.map(p => `
                        <article class="obs-edu-milestone-card">
                            <span class="obs-edu-status">${obsEscapeHTML(p.status)}</span>
                            <h3>${obsEscapeHTML(p.nome)}</h3>
                            <p>${obsEscapeHTML(p.alcance)}</p>
                            ${p.link ? `<a href="${obsEscapeHTML(obsSafeUrl(p.link) || '#')}" target="_blank" rel="noopener noreferrer"><span class="material-icons" aria-hidden="true">open_in_new</span> Fonte: ${obsEscapeHTML(p.fonte)}</a>` : ''}
                        </article>
                    `).join('')}
                </div>
            </section>

            <section class="obs-edu-publications" aria-labelledby="obs-edu-publicacoes-title">
                <div class="obs-section-heading-row obs-edu-pubs-heading">
                    <div>
                        <span class="obs-eyebrow">Bibliografia curada</span>
                        <h2 id="obs-edu-publicacoes-title">Publicações em português</h2>
                        <p>As referências estão identificadas pelo nível de ensino para distinguir experiências da escola básica das pesquisas, formações e métodos empregados na universidade.</p>
                    </div>
                </div>

                <div class="obs-edu-filter" role="group" aria-label="Filtrar publicações por nível de ensino">
                    <button type="button" class="active" data-edu-filter="all" onclick="filterObsEducationPublications('all', this)">Todas <span>${pubs.length}</span></button>
                    <button type="button" data-edu-filter="basica" onclick="filterObsEducationPublications('basica', this)">Educação Básica / Escolar <span>${pubs.filter(p => p.nivel === 'basica').length}</span></button>
                    <button type="button" data-edu-filter="superior" onclick="filterObsEducationPublications('superior', this)">Ensino Superior / Universidade <span>${pubs.filter(p => p.nivel === 'superior').length}</span></button>
                </div>

                <div class="obs-edu-publications-grid" id="obs-edu-publications-grid">
                    ${pubs.sort((a,b) => Number(b.ano) - Number(a.ano)).map(pubCard).join('')}
                </div>
                <p class="obs-data-note"><strong>Critério:</strong> esta seleção prioriza textos com título e conteúdo disponíveis em português e vínculo explícito com educação humanitária, ética animal, bem-estar animal ou métodos alternativos/substitutivos no ensino. “Educação Básica / Escolar” reúne Educação Infantil, Ensino Fundamental e Médio; “Ensino Superior / Universidade” reúne graduação, formação docente e práticas acadêmicas.</p>
            </section>
        </div>
    `;
}

window.filterObsEducationPublications = function(level, trigger) {
    const root = document.getElementById('obs-edu-publications-grid');
    if (!root) return;
    document.querySelectorAll('.obs-edu-filter button').forEach(btn => btn.classList.toggle('active', btn === trigger));
    root.querySelectorAll('[data-edu-level]').forEach(card => {
        card.hidden = level !== 'all' && card.dataset.eduLevel !== level;
    });
};

window.openParadoxoX001 = function() {
    renderCruzamentosIneditos();
    requestAnimationFrame(() => {
        const target = document.querySelector('[data-cross-id="X001"]');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.focus({ preventScroll: true });
        }
    });
};

function renderCruzamentosIneditos() {
    const main = document.getElementById('obs-display');
    const db = window.OBSERVATORIO_DB.cruzamentos_ineditos;
    main.innerHTML = `
        <section class="obs-card obs-section-card">
            <div class="obs-section-heading-row">
                <button type="button" class="obs-secondary-action" onclick="renderObsSubpage('visao')"><span class="material-icons" aria-hidden="true">arrow_back</span> Voltar</button>
                <div>
                    <span class="obs-eyebrow">Comparações rastreáveis</span>
                    <h1>Cruzamentos Científicos</h1>
                </div>
            </div>
            <p>As relações abaixo são apresentadas com as pesquisas que sustentam cada variável. Quando as fontes têm escopos diferentes, isso é explicitado no texto em vez de ser ocultado pela visualização.</p>
        </section>
        <div class="obs-grid-3 obs-cross-grid">
            ${db.map(item => `
                <article class="obs-cross-card obs-data-card" data-cross-id="${obsEscapeHTML(item.id)}" tabindex="-1">
                    <span class="obs-eyebrow">${obsEscapeHTML(item.id)}</span>
                    <h3>${obsEscapeHTML(item.title)}</h3>
                    <p>${obsEscapeHTML(item.data)}</p>
                    ${researchSourceLinks((item.fontes || []).map(source => ({label:source.label, url:source.url})))}
                </article>`).join('')}
        </div>
        <div class="obs-data-note obs-data-note--prominent"><strong>Critério:</strong> cruzamento não significa causalidade. O Observatório aproxima indicadores para formular questões comparativas, preservando a fonte e o escopo de cada série.</div>`;
}

function renderObsPlaceholder(main, title) {
    main.innerHTML = `
        <div style="padding:5rem; text-align:center; background:var(--white); border-radius:30px; border:1px solid rgba(128,128,128,0.15);">
            <h2 style="font-size:2.5rem; color:var(--primary-navy); margin-bottom:1.5rem;">${title}</h2>
            <p style="color:var(--text-gray);">Esta seção está sendo populada com microdados do IBGE e CNPq.</p>
        </div>
    `;
}


