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
    visao:          'O paradoxo ético central: enquanto investimos R$ 75,4 bilhões em algumas espécies, institucionalizamos o sofrimento de bilhões de outras.',
    pets:           'Mais de 149 milhões de animais domésticos no Brasil — a segunda maior população pet do mundo.',
    economia:       'O mercado pet brasileiro movimentou R$ 75,4 bilhões em 2024, o 3º maior do mundo.',
    abandono:       'Estima-se que 30 mil animais são abandonados por dia no Brasil — um colapso estrutural de tutoria responsável.',
    consumo:        'O Brasil abateu 5,9 bilhões de animais em 2023. A escala torna o fenômeno praticamente invisível ao debate público.',
    experimentacao: 'O CONCEA registrou uso de 3,89 milhões de animais no ensino e pesquisa entre 2019-2023.',
    violencia:      'Registros estaduais indicam ~49 mil casos anuais de maus-tratos. Subnotificação estimada em mais de 50%.',
    entretenimento: 'Do cativeiro em zoológicos às tradições dos rodeios — o Brasil apresenta diversidade de uso animal recreativo.',
    pesquisa:       'Grupos de pesquisa, teses e produção acadêmica sobre bem-estar animal e bioética no Brasil.',
    educacao:       'A base para a mudança de paradigma reside no sistema educacional, da alfabetização ao ensino superior.',
    atlas:          'Posicionando o Brasil frente aos benchmarks internacionais de proteção, consumo e bem-estar animal.',
    metodo:         'Como transformamos dados brutos em conhecimento ético? Fontes, curadoria e critérios metodológicos.',
    assistente:     'Um agente de IA treinado com os dados do observatório para ajudar pesquisadores a identificar padrões e lacunas.',
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
                <span class="page-badge" style="background:rgba(255,255,255,0.12); color:var(--accent-yellow);">🔭 Observatório Humano-Animal</span>
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
 */
function sourceBadge(fonte, ano, url) {
    const linkOpen  = url ? `<a href="https://${url.replace(/^https?:\/\//,'')}" target="_blank" rel="noopener" class="obs-source-link">` : '<span>';
    const linkClose = url ? '</a>' : '</span>';
    return `<div class="obs-source-badge">${linkOpen}<span class="material-icons obs-source-icon" aria-hidden="true" style="font-size:11px;">storage</span><strong>${fonte}</strong> · ${ano}${linkClose}</div>`;
}

function sourcesFooter(sources) {
    const items = sources.map(s =>
        `<a href="${s.url || '#'}" target="_blank" rel="noopener" class="obs-footer-src-link">
            <span class="material-icons" aria-hidden="true" style="font-size:12px;">open_in_new</span>
            <strong>${s.label}</strong>${s.ano ? ' · ' + s.ano : ''}
        </a>`
    ).join('');
    return `<div class="obs-sources-footer"><span class="obs-sources-label"><span class="material-icons" aria-hidden="true" style="font-size:13px;">verified</span> Fontes verificadas:</span>${items}</div>`;
}

function microSource(fonte, ano, url) {
    const content = url
        ? `<a href="${url.startsWith('http') ? url : 'https://'+url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;">${fonte} · ${ano} ↗</a>`
        : `${fonte} · ${ano}`;
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
    if (window.lucide) window.lucide.createIcons();
}

/** --- Real Content Renderers (Screenshot faithful) --- */

function renderObsAssistente(c) {
    c.innerHTML = `
        <div style="background:var(--primary-navy); padding: 1.5rem 3rem; color:white; border-radius:var(--border-radius); margin-bottom:2rem;">
            <p style="background:rgba(255,255,255,0.15); display:inline-block; padding:6px 15px; border-radius:20px; font-size:0.8rem; margin-bottom:1.5rem; color:var(--accent-yellow);">Assistente de Pesquisa</p>
            <h1 style="font-size:2.8rem; margin-bottom:1.5rem; line-height:1.2;">O que os dados revelam quando você faz as perguntas certas?</h1>
            <p style="max-width:700px; opacity:0.8; font-size:1.25rem;">Um agente de IA treinado com os dados do observatório para ajudar pesquisadores a identificar padrões, paradoxos e lacunas na relação humano-animal.</p>
        </div>

        <div class="obs-assistente-shell">
            <!-- Coluna Esquerda -->
            <div class="obs-assistente-left">
                <button class="obs-nova-conversa-btn">+ Nova conversa</button>

                <p class="obs-hist-label">Histórico</p>
                <div class="obs-hist-item"><i data-lucide="message-circle" style="width:14px;"></i> Nova conversa</div>
                <div class="obs-hist-item"><i data-lucide="message-circle" style="width:14px;"></i> Nova conversa</div>

                <div class="obs-nota-cientifica">
                    <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.8rem;">
                        <i data-lucide="info" style="width:16px; color:var(--accent-yellow);"></i>
                        <strong style="color:var(--accent-yellow); font-size:0.85rem;">Nota científica</strong>
                    </div>
                    <p style="font-size:0.82rem; line-height:1.6; color:#c7692a;">As respostas são geradas por IA com base nos dados do observatório. Sempre verifique as fontes primárias antes de citar em trabalhos acadêmicos.</p>
                </div>

                <p class="obs-agente-label">O agente pode:</p>
                <ul class="obs-agente-lista">
                    <li><span>›</span> Cruzar dados de diferentes seções</li>
                    <li><span>›</span> Identificar contradições nos dados</li>
                    <li><span>›</span> Contextualizar com bases científicas</li>
                    <li><span>›</span> Sinalizar subnotificação e limitações</li>
                    <li><span>›</span> Sugerir perguntas de pesquisa</li>
                </ul>
            </div>

            <!-- Coluna Direita -->
            <div class="obs-assistente-right">
                <div style="text-align:center; margin-bottom:3rem;">
                    <div style="margin-bottom:1rem;"><span class="material-icons" style="font-size:4rem; color:var(--primary-navy);">smart_toy</span></div>
                    <h2 style="color:var(--primary-navy); font-size:1.6rem; margin-bottom:0.5rem;">Assistente de Pesquisa Humano-Animal</h2>
                    <p style="color:var(--text-gray); font-size:0.95rem;">Faça perguntas sobre os dados do observatório ou escolha uma das sugestões abaixo para começar.</p>
                </div>

                    <div class="obs-grid-2" style="margin-bottom:2.5rem;">
                    <div class="obs-card obs-suggestion" onclick="obsAskSuggestion(this)" role="button" tabindex="0">
                        <h4 style="color:var(--primary-navy); margin-bottom:0.8rem; font-size:0.95rem; display:flex; align-items:center; gap:0.4rem;"><span class="material-icons" aria-hidden="true" style="font-size:16px;">trending_up</span> Paradoxo Afetivo-Econômico</h4>
                        <p style="font-size:0.88rem; color:var(--text-gray); line-height:1.5;">Como é possível que o Brasil invista R$ 68 bilhões no mercado pet enquanto abandona 30 mil animais por dia? Que fatores culturais e econômicos...</p>
                    </div>
                    <div class="obs-card obs-suggestion" onclick="obsAskSuggestion(this)" role="button" tabindex="0">
                        <h4 style="color:var(--primary-navy); margin-bottom:0.8rem; font-size:0.95rem; display:flex; align-items:center; gap:0.4rem;"><span class="material-icons" aria-hidden="true" style="font-size:16px;">biotech</span> Experimentação Animal</h4>
                        <p style="font-size:0.88rem; color:var(--text-gray); line-height:1.5;">Quais são as evidências científicas sobre alternativas à experimentação animal? O que os dados do CONCEA revelam sobre a evolução des...</p>
                    </div>
                    <div class="obs-card obs-suggestion" onclick="obsAskSuggestion(this)" role="button" tabindex="0">
                        <h4 style="color:var(--primary-navy); margin-bottom:0.8rem; font-size:0.95rem; display:flex; align-items:center; gap:0.4rem;"><span class="material-icons" aria-hidden="true" style="font-size:16px;">restaurant</span> Senciência e Consumo</h4>
                        <p style="font-size:0.88rem; color:var(--text-gray); line-height:1.5;">Se a Declaração de Cambridge (2012) reconhece a consciência em animais não-humanos, como isso se relaciona com os 5,9 bilhões de animais abatid...</p>
                    </div>
                    <div class="obs-card obs-suggestion" onclick="obsAskSuggestion(this)" role="button" tabindex="0">
                        <h4 style="color:var(--primary-navy); margin-bottom:0.8rem; font-size:0.95rem; display:flex; align-items:center; gap:0.4rem;"><span class="material-icons" aria-hidden="true" style="font-size:16px;">live_tv</span> Animais no Entretenimento</h4>
                        <p style="font-size:0.88rem; color:var(--text-gray); line-height:1.5;">Como comparar o bem-estar animal em zoológicos modernos com o modelo tradicional de circos? Quais os critérios científicos para essa avaliação?</p>
                    </div>
                    <div class="obs-card obs-suggestion" onclick="obsAskSuggestion(this)" role="button" tabindex="0">
                        <h4 style="color:var(--primary-navy); margin-bottom:0.8rem; font-size:0.95rem; display:flex; align-items:center; gap:0.4rem;"><span class="material-icons" aria-hidden="true" style="font-size:16px;">balance</span> Lacunas Legislativas</h4>
                        <p style="font-size:0.88rem; color:var(--text-gray); line-height:1.5;">Com 47 leis de proteção animal no Brasil e 42 mil denúncias formais de maus-tratos registradas, onde estão as principais falhas no sistema de...</p>
                    </div>
                    <div class="obs-card obs-suggestion" onclick="obsAskSuggestion(this)" role="button" tabindex="0">
                        <h4 style="color:var(--primary-navy); margin-bottom:0.8rem; font-size:0.95rem; display:flex; align-items:center; gap:0.4rem;"><span class="material-icons" aria-hidden="true" style="font-size:16px;">bar_chart</span> Subnotificação Estrutural</h4>
                        <p style="font-size:0.88rem; color:var(--text-gray); line-height:1.5;">Três dos indicadores do observatório (maus-tratos, abandono, experimentação) têm subnotificação estimada acima de 50%. Que metodologias os...</p>
                    </div>
                </div>

                <div class="obs-input-bar" role="search">
                    <input type="text" id="obs-chat-input" placeholder="Faça uma pergunta sobre os dados do observatório..." style="flex:1; background:none; border:none; outline:none; font-size:1rem;" aria-label="Faça uma pergunta ao assistente do Observatório">
                    <button onclick="obsSubmitQuestion()" aria-label="Enviar pergunta" style="background:none; border:none; cursor:pointer; color:var(--primary-navy); flex-shrink:0;">
                        <span class="material-icons" aria-hidden="true">send</span>
                    </button>
                </div>
                <p style="text-align:center; color:var(--text-gray); font-size:0.78rem; margin-top:0.8rem;">Respostas geradas por IA · sempre verifique as fontes primárias · Enter para enviar, Shift+Enter para quebra de linha</p>
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

function obsAskSuggestion(card) {
    const question = card.querySelector('p') ? card.querySelector('p').innerText : '';
    const input = document.getElementById('obs-chat-input');
    if (input) { input.value = question; input.focus(); }
}

async function obsSubmitQuestion() {
    const input = document.getElementById('obs-chat-input');
    if (!input || !input.value.trim()) return;
    const q = input.value.trim();
    input.value = '';
    
    // Hide suggestions
    const suggestGrid = document.querySelector('.obs-grid-suggest');
    if (suggestGrid) suggestGrid.style.display = 'none';

    // Ensure chat log container exists
    let chatLog = document.getElementById('obs-chat-log');
    if (!chatLog) {
        chatLog = document.createElement('div');
        chatLog.id = 'obs-chat-log';
        chatLog.style = 'flex:1; overflow-y:auto; padding-bottom:2rem; display:flex; flex-direction:column; gap:1.5rem; max-height:450px; scroll-behavior:smooth; margin-bottom: 2rem;';
        const inputBar = document.querySelector('.obs-input-bar');
        inputBar.parentNode.insertBefore(chatLog, inputBar);
    }
    chatLog.style.display = 'flex';

    // User message bubble
    const userBubble = document.createElement('div');
    userBubble.style = 'align-self:flex-end; background:var(--accent-orange); color:white; padding:1rem 1.5rem; border-radius:20px 20px 0 20px; max-width:85%; font-size:0.95rem; line-height:1.5; box-shadow:0 4px 10px rgba(250,205,95,0.2);';
    userBubble.innerText = q;
    chatLog.appendChild(userBubble);
    chatLog.scrollTop = chatLog.scrollHeight;

    // Typing bubble
    const typId = 'typing-' + Date.now();
    const typingBubble = document.createElement('div');
    typingBubble.id = typId;
    typingBubble.style = 'align-self:flex-start; background:var(--bg-light); color:var(--text-gray); padding:1rem 1.5rem; border-radius:20px 20px 20px 0; max-width:85%; font-size:0.95rem; font-style:italic; border:1px solid rgba(128,128,128,0.15);';
    typingBubble.innerHTML = '<span style="display:flex; align-items:center; gap:8px;"><i data-lucide="loader" style="animation: spin 1s linear infinite; width:16px;"></i> Processando no banco do Observatório...</span>';
    chatLog.appendChild(typingBubble);
    if(window.lucide) window.lucide.createIcons();
    chatLog.scrollTop = chatLog.scrollHeight;

    // Fake AI Response logic (Fallback if no Gemini)
    setTimeout(() => {
        const node = document.getElementById(typId);
        if(node) node.remove();
        
        const aiBubble = document.createElement('div');
        aiBubble.style = 'align-self:flex-start; background:var(--white); color:var(--text-dark); padding:1.5rem; border-radius:20px 20px 20px 0; max-width:85%; font-size:0.95rem; line-height:1.6; border:1px solid var(--mint-teal); box-shadow:0 4px 10px rgba(128,222,234,0.1);';
        aiBubble.innerHTML = `Com base nos nossos dados estruturados e na modelagem de senciência: <br><br><b>Análise:</b> Evidenciamos forte subnotificação dos parâmetros que você pesquisou. Aproximadamente 50% dos casos de maus-tratos ou envolvimento científico escapam ao censo oficial. O "Paradoxo Afetivo-Econômico" suporta a ideia de que os gastos no mercado pet mascaram a deficiência estrutural em legislação efetiva.<br><br><em style="font-size:0.85rem; color:var(--text-gray);">Para uma auditoria de dados completa, utilize a aba de Metodologia e referencie o relatório do Instituto Pet Brasil de 2023.</em>`;
        chatLog.appendChild(aiBubble);
        chatLog.scrollTop = chatLog.scrollHeight;
    }, 1800);
}

function renderObsMetodo(c) {
    c.innerHTML = `
         <div class="hero-white" style="background:var(--primary-navy); padding: 3.5rem; color:white; border-radius:var(--border-radius); margin-bottom:3rem;">
            <span class="page-badge" style="background:rgba(255,255,255,0.1); color:var(--accent-yellow); font-size:0.8rem; font-weight:700; padding:6px 15px; border-radius:20px; margin-bottom:1.5rem; display:inline-block;">Metodologia</span>
            <h1 style="font-size:3.2rem; margin-bottom:1.5rem; font-weight:800;">Como transformamos dados em conhecimento ético?</h1>
            <p style="max-width:700px; opacity:0.8; font-size:1.15rem; line-height:1.6;">A transparência é fundamental para a credibilidade científica. Conheça as fontes, processos de curadoria e critérios utilizados neste observatório.</p>
        </div>

        <div style="background:var(--white); padding:5rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15);">
             <div style="margin-bottom:5rem;">
                <div style="display:flex; align-items:center; gap:1.5rem; margin-bottom:2rem;">
                    <i data-lucide="database" style="color:var(--accent-yellow); width:35px; height:35px;"></i>
                    <h2 style="font-size:1.8rem; color:var(--primary-navy); font-weight:800;">Fontes de Dados Primárias</h2>
                </div>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem; color:var(--primary-navy); font-weight:600;">
                    <div>• IBGE/ABATE: Pesquisa Trimestral do Abate</div>
                    <div>• IBGE/PNS: Pesquisa Nacional de Saúde (Pets)</div>
                    <div>• MAPA/SIF: Sistema de Inspeção Federal</div>
                    <div>• CONCEA: Relatórios de Experimentação 2019-2023</div>
                    <div>• ABINPET: Faturamento do Mercado Pet 2024</div>
                    <div>• CFMV: Inquéritos de Bem-Estar e Abandono</div>
                    <div>• FAOSTAT: Dados Globais de Consumo</div>
                    <div>• SSPs: Registros de Maus-Tratos Estaduais</div>
                </div>
             </div>

             <div style="margin-bottom:5rem;">
                <div style="display:flex; align-items:center; gap:1.5rem; margin-bottom:2rem;">
                    <i data-lucide="file-text" style="color:var(--accent-yellow); width:35px; height:35px;"></i>
                    <h2 style="font-size:1.8rem; color:var(--primary-navy); font-weight:800;">Tratamento e Subnotificação</h2>
                </div>
                <p style="color:var(--text-gray); line-height:1.8; font-size:1.25rem;">Os microdados passam por um processo de limpeza. Para indicadores onde há sabida subnotificação (como casos de crueldade ou abandono), aplicamos notas metodológicas específicas. A subnotificação estrutural é estimada em >50% para maus-tratos e abandono.</p>
             </div>

             <div>
                <div style="display:flex; align-items:center; gap:1.5rem; margin-bottom:2rem;">
                    <i data-lucide="scale" style="color:var(--accent-yellow); width:35px; height:35px;"></i>
                    <h2 style="font-size:1.8rem; color:var(--primary-navy); font-weight:800;">Perspectiva de Senciência</h2>
                </div>
                <p style="color:var(--text-gray); line-height:1.8; margin-bottom:2rem; font-size:1.25rem;">Este observatório baseia-se na <strong>Declaração de Cambridge sobre Consciência (2012)</strong>. O objetivo é fomentar a reflexão crítica sobre a objetificação dos animais não humanos.</p>
                
                <div style="background:rgba(252,163,17,0.05); padding:3rem; border-radius:25px; border-left:10px solid var(--accent-orange);">
                    <p style="font-size:1.2rem; font-style:italic; color:var(--primary-navy); margin-bottom:1rem; line-height:1.6;">"A ausência de neocórtex não parece impedir que um organismo experimente estados afetivos... animais não humanos possuem os substratos neuroanatômicos dos estados de consciência."</p>
                    <p style="font-weight:700; color:var(--accent-yellow);">— The Cambridge Declaration on Consciousness</p>
                </div>
             </div>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}

function renderObsVisao(c) {
    const db = window.OBSERVATORIO_DB.visao_geral;
    const kpisHTML = db.kpis.map(k => `
        <div class="obs-kpi-card" style="background:#2C2C33; border-radius:20px; padding:1.5rem; text-align:left; border:1px solid rgba(255,255,255,0.05); position:relative; overflow:hidden;">
            <div style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700; text-transform:uppercase; margin-bottom:0.5rem; letter-spacing:1px;">${k.label}</div>
            <div style="font-size:1.8rem; color:white; font-weight:800; font-family:'Source Serif 4';">${k.value}</div>
            <div class="obs-micro-source">
                <a href="https://${k.url}" target="_blank" rel="noopener" style="color:var(--accent-yellow);text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:4px;margin-top:8px;">
                    <span class="material-icons" aria-hidden="true" style="font-size:14px;">${OBS_MATERIAL_ICONS[k.icon] || 'analytics'}</span> ${k.fonte} · ${k.ano} ↗
                </a>
            </div>
            <span class="material-icons" aria-hidden="true" style="position:absolute; right: -10px; bottom: -10px; font-size:80px; color:rgba(255,255,255,0.15); line-height:1;">${OBS_MATERIAL_ICONS[k.icon] || 'circle'}</span>
        </div>
    `).join('');

    c.innerHTML = `
        <div style="background:var(--primary-navy); padding: 5rem 3.5rem; color:white; border-radius:30px; margin-bottom:2.5rem; border:1px solid rgba(255,255,255,0.05); position:relative; overflow:hidden;">
            <div style="position:relative; z-index:2;">
                <span class="page-badge" style="background:rgba(255,255,255,0.08); color:var(--accent-yellow); font-size:0.8rem; font-weight:700; padding:8px 20px; border-radius:30px; margin-bottom:1.5rem; display:inline-block;">Visão Geral — Paradoxo Ético</span>
                <h1 style="font-size:3.2rem; line-height:1.1; margin-bottom:1.5rem; font-weight:800; max-width:850px;">O que a ciência nos diz sobre nossa relação ética com os animais?</h1>
                <p style="font-size:1.25rem; opacity:0.85; max-width:750px; line-height:1.6; font-weight:400;">O observatório apresenta o paradoxo central: enquanto investimos R$ 75,4 bilhões no bem-estar de algumas espécies, institucionalizamos o uso e o sofrimento de bilhões de outras.</p>
            </div>
            <div style="position:absolute; right: -10%; top: -10%; width: 50% ; height:120% ; background: radial-gradient(circle, rgba(252,163,17,0.1) 0%, rgba(26,28,48,0) 70%); filter:blur(40px); z-index:1;"></div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1.5rem; margin-bottom:3rem;">
            ${kpisHTML}
        </div>

        <div style="background:var(--accent-yellow); color:var(--on-accent); padding:2rem 3rem; border-radius:20px; display:flex; align-items:center; justify-content:space-between; margin-bottom:3rem;">
            <div>
                 <h3 style="margin:0; font-weight:800; display:flex; align-items:center; gap:0.5rem;"><span class="material-icons" aria-hidden="true" style="font-size:22px;">search</span> Explorar Cruzamentos Inéditos</h3>
                 <p style="margin:0.5rem 0 0; color:var(--on-accent); opacity:0.85;">Analises exclusivas do AlterECO correlacionando economia, demografia e ética.</p>
            </div>
            <button onclick="renderCruzamentosIneditos()" style="background:var(--primary-navy); color:white; border:none; padding:12px 30px; border-radius:15px; cursor:pointer; font-weight:700;">Ver Análises</button>
        </div>

        ${sourcesFooter([
            {label:'ABINPET 2024', url:'https://abinpet.org.br', ano:2024},
            {label:'IBGE/ABATE', url:'https://ibge.gov.br', ano:2023},
            {label:'CONCEA', url:'https://gov.br/mcti', ano:'2019-23'},
            {label:'CFMV', url:'https://cfmv.gov.br', ano:2022},
            {label:'CNPq/Lattes', url:'https://cnpq.br', ano:2023}
        ])}

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:2.5rem; align-items:flex-start;">
            <div style="background:var(--white); padding:3rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15); box-shadow:0 10px 40px rgba(0,0,0,0.03);">
                <h2 style="color:var(--primary-navy); margin-bottom:1.5rem; font-size:1.8rem; font-weight:800;">Nota Metodológica Global</h2>
                <p style="color:var(--text-gray); line-height:1.8; font-size:1.05rem;">${db.nota_metodologica}</p>
            </div>

            <div style="background:#2C2C33; padding:3rem; border-radius:30px; color:white; display:flex; flex-direction:column; justify-content:center;">
                <h2 style="color:var(--accent-yellow); margin-bottom:1.5rem; font-size:1.8rem; font-weight:800;">A ciência convida ao pensar</h2>
                <p style="font-size:1.15rem; opacity:0.9; line-height:1.7;">${db.card_narrativo}</p>
                <div style="margin-top:2.5rem; display:flex; gap:1rem;">
                    <button class="obs-nova-conversa-btn" style="background:var(--accent-orange); color:white; width:auto; padding:12px 30px;">Explorar Paradoxo X001</button>
                    <button class="obs-nav-assistente" style="background:transparent; border:1px solid rgba(255,255,255,0.2) ; color:white; padding:12px 30px; border-radius:15px; cursor:pointer;" onclick="renderObsSubpage('assistente')">Falar com Assistente</button>
                </div>
            </div>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}

function renderObsPets(c) {
    const db = window.OBSERVATORIO_DB.pets;
    c.innerHTML = `
        <div style="background:var(--white); padding:3.5rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15); margin-bottom:2rem;">
            <h1 style="color:var(--primary-navy); font-size:2.5rem; font-weight:800;">Animais Domésticos no Brasil</h1>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1.5rem; margin-top:3rem;">
                ${db.domicilios.map(d => `
                    <div style="background:var(--bg-light); padding:1.5rem; border-radius:20px; text-align:center;">
                        <div style="font-size:2.2rem; font-weight:800; color:var(--primary-navy);">${d.valor}</div>
                        <div style="font-size:0.85rem; color:var(--text-gray); font-weight:700;">Domicílios ${d.label}</div>
                    </div>
                `).join('')}
            </div>
            ${sourceBadge('IBGE/PNS', 2022, 'ibge.gov.br')}
        </div>

        <div style="display:grid; grid-template-columns: 1.5fr 1fr; gap:2rem;">
            <div style="background:var(--white); padding:3rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15);">
                <h3 style="margin-bottom:2rem; font-weight:800; color:var(--primary-navy);">População Total (Milhões)</h3>
                ${sourceBadge('IBGE/PNS', 2022, 'ibge.gov.br')}
                ${db.populacao.map(p => `
                    <div style="margin-bottom:1.5rem;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-weight:700;">
                            <span>${p.especie}</span>
                            <span>${p.valor} mi</span>
                        </div>
                        <div style="height:12px; background:var(--bg-gray); border-radius:6px; overflow:hidden;">
                            <div style="width:${(p.valor/68)*100}%; height:100%; background:var(--accent-orange);"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="background:var(--primary-navy); border-radius:30px; padding:3rem; color:white; display:flex; align-items:center;">
                <div>
                    <h3 style="color:var(--accent-yellow); margin-bottom:1.5rem; font-weight:800;">Evolução 2013-2022</h3>
                    <p style="opacity:0.8; line-height:1.7; font-size:1.25rem;">O número de cães saltou de 52 mi para 68 mi em uma década. Gatos dobraram sua presença, evidenciando uma "gatificação" dos lares urbanos brasileiros.</p>
                </div>
            </div>
        </div>
    `;
}

function renderObsEconomia(c) {
    const db = window.OBSERVATORIO_DB.economia;
    c.innerHTML = `
        <div style="display:grid; grid-template-columns: 2fr 1.2fr; gap:2rem; margin-bottom:2rem;">
            <div style="background:var(--white); border-radius:30px; padding:4rem; border:1px solid rgba(128,128,128,0.15);">
                <h1 style="color:var(--primary-navy); font-size:2.5rem; font-weight:800; margin-bottom:1rem;">Economia Pet 2024</h1>
                <h2 style="color:var(--accent-yellow); font-size:4rem; font-weight:800; margin-bottom:3rem;">R$ 75,4 Bilhões</h2>
                
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:2.5rem;">
                    ${db.faturamento_2024.map(s => `
                        <div style="border-bottom:1px solid rgba(128,128,128,0.15); padding-bottom:1.2rem;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                                <span style="font-weight:800; font-size:1.4rem; color:var(--primary-navy);">${s.segmento}</span>
                                <span style="color:var(--primary-navy); font-size:2.2rem; font-weight:900;">${s.porcent}</span>
                            </div>
                            <div style="color:var(--text-gray); font-size:1rem; font-weight:500;">Faturamento: R$ ${s.valor} bi</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:1.5rem;">
                ${db.cruzamentos.map(cr => `
                    <div style="background:#2C2C33; color:white; padding:2.5rem; border-radius:25px; border-left:6px solid var(--accent-orange);">
                        <h4 style="color:var(--accent-yellow); margin-bottom:1rem; font-size:1.2rem; font-weight:800;">${cr.title}</h4>
                        <p style="font-size:1rem; line-height:1.6; opacity:0.9;">${cr.text}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderObsAbandono(c) {
    const db = window.OBSERVATORIO_DB.maus_tratos;
    c.innerHTML = `
        <div style="background:#F2DEDE; color:#A94442; padding:3rem; border-radius:30px; margin-bottom:2rem; border:1px solid #EBCCD1;">
             <h1 style="font-size:2.5rem; font-weight:800; margin-bottom:1rem;">Abandono Animal Estrutural</h1>
             <p style="font-size:1.2rem; opacity:0.9;">Estima-se que 4,2% de todos os animais domesticados no Brasil sofrerão abandono em algum momento da vida.</p>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:2.5rem;">
            <div style="background:var(--white); padding:3rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15);">
                <h3 style="color:var(--primary-navy); font-weight:800; margin-bottom:2rem;">Causas do Abandono</h3>
                ${db.causa_abandono.map(ca => `
                    <div style="margin-bottom:1.8rem;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem;">
                            <span>${ca.causa}</span>
                            <span style="font-weight:800;">${ca.perc}</span>
                        </div>
                        <div style="height:10px; background:var(--bg-gray); border-radius:5px;">
                            <div style="width:${ca.perc}; height:100%; background:#D32F2F;"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="background:var(--primary-navy); border-radius:30px; padding:4rem; color:white;">
                <h2 style="color:var(--accent-yellow); margin-bottom:1.5rem; font-weight:800;">O Impacto da Pandemia</h2>
                <p style="font-size:1.15rem; line-height:1.7; opacity:0.9;">O "boom" de adoções em 2020 foi seguido por uma onda de abandonos em 2021-22, refletindo a falta de preparo para a tutoria responsável e a precarização econômica pós-isolamento.</p>
                <div style="margin-top:2.5rem; padding:1.5rem; background:rgba(255,255,255,0.05); border-radius:15px; font-size:0.9rem; border-left:4px solid white;">
                    <strong>DADO CRÍTICO:</strong> Municípios com estrutura de controle populacional (castração pública) representam menos de 30% do total nacional.
                </div>
            </div>
        </div>
    `;
}

function renderObsConsumo(c) {
    const db = window.OBSERVATORIO_DB.abate;
    c.innerHTML = `
        <div style="background:var(--white); padding:4rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15); margin-bottom:2rem;">
            <h1 style="color:var(--primary-navy); font-size:2.5rem; font-weight:800; margin-bottom:3rem;">Animais para Consumo (Abate 2023)</h1>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1.5rem;">
                ${db.dados_2023.map(d => `
                    <div style="background:var(--bg-light); padding:2.5rem; border-radius:20px; border:1px solid rgba(128,128,128,0.15); text-align:center;">
                        <div style="font-size:0.9rem; color:var(--text-gray); font-weight:800; text-transform:uppercase;">${d.especie}</div>
                        <div style="font-size:2.2rem; font-weight:900; color:var(--primary-navy); margin:1rem 0;">${d.valor}</div>
                        <div style="display:inline-block; padding:5px 12px; background:rgba(211,47,47,0.1) ; color:#D32F2F; border-radius:10px; font-weight:800; font-size:0.85rem;">Variação: ${d.variacao}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:2.5rem;">
            <div style="background:#2C2C33; color:white; padding:3rem; border-radius:30px;">
                <h3 style="color:var(--accent-yellow); margin-bottom:2.5rem; font-weight:800;">Consumo per Capita Global</h3>
                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                    ${db.consumo_per_capita.map(p => `
                        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.8rem;">
                            <span style="font-size:1.25rem;">${p.pais}</span>
                            <span style="font-weight:900; color:var(--accent-yellow); font-size:1.2rem;">${p.kg} kg/ano</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="background:var(--white); padding:4rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15); display:flex; flex-direction:column; justify-content:center;">
                <h3 style="color:var(--primary-navy); margin-bottom:1.5rem; font-size:1.6rem; font-weight:800;">Escala e Invisibilidade</h3>
                <p style="color:var(--text-gray); line-height:1.8; font-size:1.15rem;">${db.analise_etica}</p>
                <div style="margin-top:2rem; padding:1.5rem; background:rgba(0,0,0,0.02); border-radius:15px; font-size:0.85rem; color:var(--text-gray);">
                    <strong>Metodologia:</strong> Consumo aparente consolidado. A escala logarítmica é necessária para visualizar bovinos junto ao colossal volume de aves.
                </div>
            </div>
        </div>
    `;
}

function renderObsExperimentacao(c) {
    const db = window.OBSERVATORIO_DB.experimentacao;
    c.innerHTML = `
        <div style="background:#E5F8ED; padding:4rem; border-radius:30px; margin-bottom:2rem; border:1px solid #C8E6C9; position:relative;">
            <div style="position:absolute; top:2rem; right:2rem;">
                ${sourceBadge('CONCEA', '2019-2023', 'gov.br/mcti/pt-br/composicao/conselhos/concea/relatorios-de-uso-de-animais-em-ensino-e-pesquisa')}
            </div>
            <h1 style="color:#2E7D32; font-weight:800; font-size:2.5rem; margin-bottom:1rem;">Uso em Ensino e Pesquisa (Brasil)</h1>
            <h2 style="color:#1B5E20 ; font-size:2rem; margin:0;">CONCEA: ${db.total_periodo} indivíduos</h2>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:2.5rem;">
             <div style="background:var(--white); padding:3.5rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15);">
                <h3 style="margin-bottom:2rem; font-weight:800; color:var(--primary-navy);">Distribuição por Espécie</h3>
                ${db.especies_relativo.map(e => `
                    <div style="margin-bottom:1.8rem;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem;">
                            <span style="font-weight:700;">${e.nome}</span>
                            <span style="font-weight:800; color:var(--mint-teal);">${e.perc}</span>
                        </div>
                        <div style="height:10px; background:var(--bg-gray); border-radius:5px; overflow:hidden;">
                            <div style="width:${e.perc}; height:100%; background:var(--mint-teal);"></div>
                        </div>
                    </div>
                `).join('')}
             </div>

             <div style="background:var(--white); padding:3.5rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15);">
                <h3 style="margin-bottom:2.5rem; font-weight:800; color:var(--primary-navy);">Finalidade Declarada</h3>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem;">
                    ${db.finalidade.map(f => `
                        <div style="padding:2rem 1.5rem; background:var(--bg-light); border-radius:20px; text-align:center;">
                            <div style="font-size:2.2rem; font-weight:900; color:var(--primary-navy);">${f.perc}</div>
                            <div style="font-size:0.85rem; font-weight:800; color:var(--text-gray); text-transform:uppercase;">${f.label}</div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top:2.5rem; padding:1.5rem; background:#FFF4E5; border-radius:15px; border-left:6px solid #FCA311;">
                    <p style="font-size:0.9rem; color:#664d03; margin:0; line-height:1.5;"><strong>LIMITAÇÃO:</strong> ${db.limitacao}</p>
                </div>
             </div>
        </div>
    `;
}

function renderObsViolencia(c) {
    const db = window.OBSERVATORIO_DB.maus_tratos;
    c.innerHTML = `
        <div style="background:var(--white); padding:4rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15); margin-bottom:2rem;">
            <h1 style="color:var(--primary-navy); font-size:2.5rem; font-weight:800; margin-bottom:1rem;">Maus-Tratos e Insegurança Animal</h1>
            <p style="color:var(--text-gray); font-size:1.15rem; margin-bottom:3.5rem;">Não existe base nacional consolidada. Os dados abaixo refletem recortes estaduais agregados.</p>
            
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1.5rem;">
                ${db.estados.map(e => `
                    <div style="background:var(--bg-light); border:1px solid rgba(128,128,128,0.15); padding:2.5rem; border-radius:25px; display:flex; flex-direction:column;">
                        <div style="font-size:0.85rem; font-weight:800; color:var(--text-gray); text-transform:uppercase; letter-spacing:1px;">${e.uf}</div>
                        <div style="font-size:2.2rem; font-weight:900; color:var(--primary-navy); margin:1rem 0;">${e.casos || e.variacao}</div>
                        <div style="font-size:0.8rem; color:#D32F2F; font-weight:800; margin-bottom:1.5rem;">${e.status || 'Cruzamento Histórico'}</div>
                        ${e.link ? `<a href="${e.link}" target="_blank" rel="noopener" style="margin-top:auto; font-size:0.85rem; color:var(--primary-navy); font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:4px;"><span class="material-icons" style="font-size:14px;">open_in_new</span> Fonte de Dados</a>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div style="background:var(--primary-navy); padding:4rem; border-radius:30px; color:white; border:1px solid rgba(255,255,255,0.05);">
            <h2 style="color:var(--accent-yellow); margin-bottom:1.5rem; font-weight:800; font-size:1.8rem;">O Despertar Legislativo: Lei Sansão</h2>
            <p style="font-size:1.2rem; line-height:1.7; opacity:0.9; max-width:850px;">A Lei 14.064/2020 elevou a pena para 2 a 5 anos de reclusão. Este rigor causou um aumento de 95% nas notificações formais em estados como RN, indicando que a sociedade está mais vigilante e os criminosos mais expostos.</p>
            <div style="margin-top:2.5rem; padding:1.5rem; background:rgba(255,255,255,0.05); border-radius:15px; font-size:0.9rem; color:var(--text-gray);">
                *Estimativa agregada de 49.275 registros anuais baseada em dados parciais das SSPs de 2022.
            </div>
        </div>
    `;
}

function renderObsAtlas(c) {
    c.innerHTML = `
        <div style="padding:5rem; background:var(--white); border-radius:30px; border:1px solid rgba(128,128,128,0.15); text-align:center;">
             <h1 style="color:var(--primary-navy); font-size:3.5rem; font-weight:800; margin-bottom:1rem;">Atlas Global de Bem-Estar</h1>
             <p style="color:var(--text-gray); font-size:1.25rem; max-width:850px; margin:0 auto 4rem;">Posicionando o Brasil frente aos grandes benchmarks internacionais de proteção e consumo.</p>
             
             <div style="background:#2C2C33; border-radius:30px; padding:6rem 3rem; margin-bottom:4rem; position:relative; overflow:hidden;">
                <div style="position:relative; z-index:2;">
                    <i data-lucide="globe" style="width:100px; height:100px; color:var(--accent-yellow); margin-bottom:2rem; opacity:0.5;"></i>
                    <h2 style="color:white; font-size:2rem; margin-bottom:1rem;">Camadas Geográficas em Processamento</h2>
                    <p style="color:rgba(255,255,255,0.6); font-size:1.25rem; max-width:600px; margin:0 auto;">Integrando bases da FAOSTAT (Consumo), CITES (Tráfico) e WAP (Legislação) para visualização em mapa de calor (Heatmap).</p>
                </div>
                <div style="position:absolute; top:0; left:0; width:100%; height:100%; background:url('https://www.transparenttextures.com/patterns/carbon-fibre.png'); opacity:0.1;"></div>
             </div>
             
             <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:2.5rem; text-align:left;">
                <div style="background:var(--bg-light); padding:3.5rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15);">
                    <h4 style="color:var(--primary-navy); margin-bottom:1.5rem; font-size:1.4rem; font-weight:800;">Animal Protection Index (D)</h4>
                    <p style="color:var(--text-gray); line-height:1.7; font-size:1.25rem;">O Brasil ocupa a categoria D. Embora reconheça a senciência em sua Constituição e em leis recentes, a ausência de um órgão federal exclusivo de proteção animal e a escala industrial do abate impedem o avanço para categorias A ou B.</p>
                </div>
                <div style="background:var(--bg-light); padding:3.5rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15);">
                    <h4 style="color:var(--primary-navy); margin-bottom:1.5rem; font-size:1.4rem; font-weight:800;">Consumo per Capita (Brasil vs Mundo)</h4>
                    <p style="color:var(--text-gray); line-height:1.7; font-size:1.25rem;">Com 89kg/hab/ano, o brasileiro consome 2.5x mais proteína animal que a média global da FAO, evidenciando que a relação é baseada em uma forte cultura de consumo industrializado.</p>
                </div>
             </div>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}

function renderObsEntretenimento(c) {
    const db = window.OBSERVATORIO_DB.entretenimento;
    c.innerHTML = `
        <div style="background:var(--white); padding:4rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15); margin-bottom:2rem;">
            <h1 style="color:var(--primary-navy); font-size:3rem; font-weight:800; margin-bottom:1rem;">Animais no Entretenimento</h1>
            <p style="color:var(--text-gray); font-size:1.25rem; max-width:800px; margin-bottom:3rem;">Do cativeiro em zoológicos às tradições culturais dos rodeios, o Brasil apresenta uma diversidade de situações de uso animal recreativo.</p>
            
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1.5rem;">
                <div style="background:var(--bg-light); padding:2rem; border-radius:25px; text-align:center;">
                    <div style="font-size:3.2rem; font-weight:900; color:var(--primary-navy);">${db.zoos.total}</div>
                    <div style="font-size:1.05rem; font-weight:800; color:var(--text-gray);">Zoológicos e Criadouros</div>
                    <a href="${db.zoos.link}" target="_blank" style="font-size:0.7rem; color:var(--primary-navy); text-decoration:underline; display:inline-block; margin-top:1rem;">Fonte: IBAMA/SISPASS →</a>
                </div>
                <div style="background:var(--bg-light); padding:2rem; border-radius:25px; text-align:center;">
                    <div style="font-size:2.8rem; font-weight:900; color:var(--primary-navy);">${db.rodeios.total}</div>
                    <div style="font-size:0.85rem; font-weight:800; color:var(--text-gray);">Rodeios Estimados/Ano</div>
                    <a href="${db.rodeios.link}" target="_blank" style="font-size:0.7rem; color:var(--primary-navy); text-decoration:underline; display:inline-block; margin-top:1rem;">Fonte: CNAR →</a>
                </div>
                <div style="background:var(--bg-light); padding:2rem; border-radius:25px; text-align:center;">
                    <div style="font-size:2.8rem; font-weight:900; color:var(--primary-navy);">${db.aquarios.total}</div>
                    <div style="font-size:0.85rem; font-weight:800; color:var(--text-gray);">Aquários Principais</div>
                    <p style="font-size:0.7rem; color:var(--text-gray); margin-top:1rem;">Ref: IBAMA (Grandes Estruturas)</p>
                </div>
            </div>
        </div>

        <div style="background:#2C2C33; color:white; padding:4rem; border-radius:30px;">
            <h2 style="color:var(--accent-yellow); margin-bottom:2rem; font-weight:800;">Análise de Bem-Estar em Zoológicos</h2>
            <p style="font-size:1.15rem; line-height:1.7; opacity:0.9; margin-bottom:2rem;">O conceito moderno de zoológico migrou da exibição puramente recreativa para a conservação e pesquisa. No entanto, o confinamento de espécies de largo território (grandes felinos, primatas e elefantes) continua sendo o ponto de maior tensão ética e científica.</p>
            <div style="padding:20px; background:rgba(255,255,255,0.05); border-radius:20px; border-left:4px solid var(--accent-orange);">
                <strong>Controversia:</strong> Modelos virtuais e realidade aumentada estão sendo propostos como substitutos para a exibição de animais vivos em ambientes confinados.
            </div>
        </div>
    `;
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

window.filterCNPqModalGroups = function(value) {
    const query = String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    document.querySelectorAll('#cnpq-groups-modal .obs-cnpq-group-card').forEach(card => {
        const haystack = String(card.dataset.search || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        card.hidden = Boolean(query) && !haystack.includes(query);
    });
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
    const officialUrl = 'https://lattes.cnpq.br/web/dgp';

    const modal = document.createElement('div');
    modal.id = 'cnpq-groups-modal';
    modal.className = 'obs-modal-backdrop';
    modal.innerHTML = `
        <section class="obs-modal-panel" role="dialog" aria-modal="true" aria-labelledby="cnpq-modal-title">
            <div class="obs-modal-header">
                <div>
                    <span class="obs-modal-kicker">Diretório dos Grupos de Pesquisa · CNPq</span>
                    <h2 id="cnpq-modal-title">${obsEscapeHTML(area)}</h2>
                    <p>${metric?.total ? `${obsEscapeHTML(groups.length)} links nominais validados de ${obsEscapeHTML(metric.total)} ocorrências registradas no levantamento do Observatório.` : 'Grupos relacionados ao tema.'}</p>
                </div>
                <button class="obs-modal-close" type="button" onclick="closeCNPqModal()" aria-label="Fechar lista de grupos"><span class="material-icons">close</span></button>
            </div>
            <div class="obs-cnpq-notice">
                <span class="material-icons" aria-hidden="true">verified</span>
                <div><strong>Grupos com fonte identificada.</strong> Cada item abaixo leva ao registro do grupo ou à página institucional que o identifica como grupo de pesquisa. A Base Corrente do DGP é dinâmica; o botão ao final abre também a consulta oficial do CNPq.</div>
            </div>
            ${groups.length > 1 ? `
                <label class="obs-modal-search">
                    <span class="material-icons" aria-hidden="true">search</span>
                    <input type="search" placeholder="Buscar grupo, instituição, UF ou liderança…" oninput="filterCNPqModalGroups(this.value)" aria-label="Buscar nesta lista de grupos">
                </label>` : ''}
            <div class="obs-modal-list">
                ${groups.length ? groups.map(group => `
                    <article class="obs-cnpq-group-card" data-search="${obsEscapeHTML([group.nome, group.instituicao, group.uf, group.lider].filter(Boolean).join(' '))}">
                        <div>
                            <h3>${obsEscapeHTML(group.nome)}</h3>
                            <p>${obsEscapeHTML(group.instituicao || '')}${group.uf ? ` · ${obsEscapeHTML(group.uf)}` : ''}</p>
                            ${group.lider ? `<span><strong>Liderança:</strong> ${obsEscapeHTML(group.lider)}</span>` : ''}
                            ${group.fonte ? `<span><strong>Fonte:</strong> ${obsEscapeHTML(group.fonte)}</span>` : ''}
                        </div>
                        <a href="${obsEscapeHTML(obsSafeUrl(group.link) || officialUrl)}" target="_blank" rel="noopener noreferrer">Abrir grupo <span class="material-icons" aria-hidden="true">north_east</span></a>
                    </article>
                `).join('') : `
                    <div class="obs-capes-empty"><span class="material-icons" aria-hidden="true">manage_search</span><strong>Lista nominal em validação.</strong><span>Use a consulta oficial do DGP enquanto novos vínculos são conferidos para este tema.</span></div>
                `}
            </div>
            <div class="obs-modal-footer">
                <a class="obs-primary-action" href="${officialUrl}" target="_blank" rel="noopener noreferrer"><span class="material-icons" aria-hidden="true">travel_explore</span> Buscar na Base Corrente do CNPq</a>
                <button type="button" class="obs-secondary-action" onclick="closeCNPqModal()">Fechar</button>
            </div>
        </section>`;
    modal.addEventListener('click', event => { if (event.target === modal) window.closeCNPqModal(); });
    document.body.appendChild(modal);
    document.body.classList.add('obs-modal-open');
    modal.querySelector('.obs-modal-close')?.focus();
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
                    <div class="obs-cnpq-metrics">
                        ${db.grupos.map((g, index) => `
                            <button class="obs-cnpq-metric" type="button" data-cnpq-index="${index}" aria-label="Ver grupos de pesquisa em ${obsEscapeHTML(g.area)}">
                                <span>${obsEscapeHTML(g.area)}</span>
                                <strong title="Abrir lista">${obsEscapeHTML(g.total)} <small>grupos</small></strong>
                                <span class="material-icons" aria-hidden="true">arrow_forward</span>
                            </button>
                        `).join('')}
                    </div>
                    <p class="obs-data-note"><strong>Nota metodológica:</strong> estes quantitativos pertencem ao levantamento que originou o Observatório. Como a Base Corrente do DGP é atualizada diariamente e não é disponibilizada via API pública, a lista nominal do modal é expandida somente com grupos que conseguimos validar.</p>
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
            const group = db.grupos[index];
            if (group) window.openCNPqModal(group.area);
        });
    });

    // A primeira busca já deixa a seção útil ao abrir.
    window.setTimeout(() => window.searchCapesTheses(true), 80);
}

function renderObsEducacao(c) {
    const db = window.OBSERVATORIO_DB.educacao;
    c.innerHTML = `
        <div style="background:var(--white); padding:4rem; border-radius:30px; margin-bottom:2rem; border:1px solid rgba(128,128,128,0.15);">
            <h1 style="color:var(--primary-navy); font-size:2.8rem; font-weight:800; margin-bottom:1.5rem;">Educação Humanitária</h1>
            <p style="color:var(--text-gray); font-size:1.15rem; line-height:1.8; max-width:900px; margin-bottom:3rem;">${db.texto_apoio}</p>
            
            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:2rem; margin-bottom:3.5rem;">
                ${db.kpis.map(k => `
                    <div style="background:var(--bg-light); border-left:6px solid var(--accent-orange); padding:2rem; border-radius:15px;">
                        <div style="font-size:2.8rem; font-weight:900; color:var(--primary-navy); margin-bottom:0.5rem; line-height:1;">${k.value}</div>
                        <div style="font-size:1rem; font-weight:800; color:var(--text-dark); margin-bottom:0.5rem;">${k.label}</div>
                        <div style="font-size:0.95rem; color:var(--text-gray);">${k.desc}</div>
                    </div>
                `).join('')}
            </div>

            <h3 style="color:var(--primary-navy); font-size:1.6rem; font-weight:800; margin-bottom:2rem;">Marcos da Mudança de Paradigma</h3>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:2rem;">
                ${db.projetos.map(p => `
                    <div style="background:var(--bg-light); padding:2.5rem; border-radius:25px; box-shadow:0 5px 20px rgba(0,0,0,0.02); display:flex; flex-direction:column;">
                        <div style="font-size:0.85rem; font-weight:800; color:var(--text-gray); text-transform:uppercase; margin-bottom:1rem;">${p.status}</div>
                        <h4 style="color:var(--primary-navy); font-size:1.35rem; font-weight:800; margin-bottom:1rem; line-height:1.3;">${p.nome}</h4>
                        <p style="color:var(--text-gray); font-size:1rem; line-height:1.6; margin-bottom:2rem;">${p.alcance}</p>
                        ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener" style="margin-top:auto; font-size:0.9rem; color:var(--primary-navy); font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px;"><span class="material-icons" style="font-size:16px;">open_in_new</span> Fonte: ${p.fonte}</a>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderCruzamentosIneditos() {
    const main = document.getElementById('obs-display');
    const db = window.OBSERVATORIO_DB.cruzamentos_ineditos;
    
    main.innerHTML = `
        <div style="background:var(--white); padding:4rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15);">
            <div style="display:flex; align-items:center; gap:1.5rem; margin-bottom:3rem;">
                <button onclick="renderObsSubpage('visao')" style="background:var(--bg-light); border:none; width:55px; height:55px; border-radius:50%; cursor:pointer;" aria-label="Voltar para visão geral"><i data-lucide="arrow-left"></i></button>
                <h1 style="color:var(--primary-navy); font-size:2.8rem; font-weight:800; margin:0;">Cruzamentos Científicos Inéditos</h1>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:2.5rem;">
                ${db.map(c => `
                    <div style="background:var(--bg-light); padding:3rem; border-radius:30px; border:1px solid rgba(128,128,128,0.15); position:relative; overflow:hidden;">
                        <span style="position:absolute; top:20px; right:20px; font-weight:900; color:rgba(0,0,0,0.05); font-size:4rem;">${c.id}</span>
                        <h3 style="color:var(--primary-navy); font-size:1.8rem; font-weight:800; margin-bottom:1.5rem; position:relative; z-index:2;">${c.title}</h3>
                        <p style="color:var(--text-gray); line-height:1.7; font-size:1.2rem; margin-bottom:2rem; position:relative; z-index:2;">${c.data}</p>
                        <a href="${c.link}" target="_blank" style="color:var(--primary-navy); font-size:1.1rem; font-weight:800; text-decoration:underline; display:flex; align-items:center; gap:0.5rem;">
                            <i data-lucide="external-link" style="width:22px;"></i> Acessar Base Primária
                        </a>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top:3rem; background:var(--primary-navy); color:white; padding:3rem; border-radius:30px; text-align:center;">
                <h2 style="color:var(--accent-yellow); margin-bottom:1rem;">Nossa Metodologia de Cruzamento</h2>
                <p style="opacity:0.8; max-width:750px; margin:0 auto; line-height:1.6;">Utilizamos técnicas de triângulação de dados entre censos demográficos (IBGE), registros de faturamento (ABINPET) e indicadores de bem-estar animal para identificar tendências invisíveis em relatórios isolados.</p>
            </div>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}

function renderObsPlaceholder(main, title) {
    main.innerHTML = `
        <div style="padding:5rem; text-align:center; background:var(--white); border-radius:30px; border:1px solid rgba(128,128,128,0.15);">
            <h2 style="font-size:2.5rem; color:var(--primary-navy); margin-bottom:1.5rem;">${title}</h2>
            <p style="color:var(--text-gray);">Esta seção está sendo populada com microdados do IBGE e CNPq.</p>
        </div>
    `;
}


