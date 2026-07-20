/**
 * AlterECO Main Application Logic
 * Author: Debora Gasparetto / UFSM / CNPq
 * Updated: corrections per print audit
 */

let digitalGarden = null;

const CURADORES_DATA = [
    {
        id: "debora",
        name: "Débora Aita Gasparetto",
        image: "assets/debora.jpg",
        desc: "Idealizadora e Curadora da Plataforma AlterECO. Professora do curso de Desenho Industrial da Universidade Federal de Santa Maria (UFSM), atua nas áreas de design centrado no usuário, game design, experiência do usuário (UX), arte digital, história, teria e crítica de arte.",
        tags: ["Design de Interfaces", "Curadoria", "Jogos", "Tecnologias", "AR", "VR"],
        fullBio: "Idealizadora e Curadora da Plataforma AlterECO. Professora do curso de Design Desenho Industrial da Universidade Federal de Santa Maria (UFSM), atua nas áreas de design centrado no usuário, game design, experiência do usuário (UX), arte digital, história, teoria e crítica de arte. Com formação interdisciplinar, tem desenvolvido projetos voltados à ética e inovação no campo educacional e científico. Desde 2015, coordena iniciativas relacionadas aos métodos substitutivos ao uso de animais no ensino e na pesquisa, com destaque para o desenvolvimento do jogo Labchange e a idealização da plataforma AlterECO, que propõe soluções acessíveis, críticas e colaborativas para transformar a educação e a ciência no Brasil.",
        categories: [
            {
                title: "Jogos",
                items: [
                    {
                        title: "Labchange",
                        image: "assets/labchange.png",
                        desc: "Labchange é um jogo digital ficcional e educativo sobre substituição animal na pesquisa científica. Nele, o(a) jogador(a) assume o papel de animais usados em laboratório e resolve missões por meio da empatia e colaboração. A proposta une narrativa imersiva, crítica e design de interfaces para estimular reflexão e transformação.",
                        tags: ["LabChange", "Jogo", "VR", "Materiais Didáticos"],
                        link: "#"
                    }
                ]
            },
            {
                title: "Arte Digital",
                items: [
                    {
                        title: "FlorestAR: Experiência em Realidade Aumentada",
                        image: "assets/florestar.png",
                        desc: "Aplicativo em realidade aumentada que utiliza imagens do satélite do INPE e insere virtualmente alguns dos animais ameaçados pelas queimadas na Amazônia. A proposta consiste em um quebra-cabeças, exposto em uma mesa e um aplicativo que lê as imagens e projeta sobre elas um modelo 3D.",
                        tags: ["Florestar", "AR", "Arte Digital", "Materiais Didáticos"],
                        link: "#"
                    },
                    {
                        title: "Be_FREE",
                        image: "assets/befree.png",
                        desc: "Aplicativo de Realidade Aumentada que utiliza imagens de natureza morta da história da arte, para redesenhar vidas.",
                        tags: ["Be_FREE", "AR", "Materiais Didáticos"],
                        link: "#",
                        bannerText: "Be_FREE\nTodos querem ser livres.\nNatureza Viva."
                    }
                ]
            }
        ]
    },
    {
        id: "aldair",
        name: "Aldair Marins",
        image: "assets/aldair.png",
        desc: "Mestrando em Filosofia pela PUCRS, com bacharelado pela UPF, pesquisa ética animal e da alteridade. Integra grupos interdisciplinares nas áreas de filosofia, linguagem, feminismo e direito dos animais. Atua em redes nacionais de pesquisa crítica e ética.",
        tags: ["Filosofia", "Bioética", "RedEH"]
    },
    {
        id: "daniele",
        name: "Daniele Rubert Nogueira Librelotto",
        image: "assets/daniele.png",
        desc: "Professora da UFSM com atuação em nanotecnologia, toxicologia in vitro e métodos alternativos para avaliação farmacológica. Doutora pela Universitat de Barcelona, desenvolve pesquisas com cultivos celulares, citotoxicidade e formulações nanotecnológicas. Atua no PPG em Ciências Farmacêuticas da UFSM.",
        tags: ["Farmácia", "Nanotecnologia", "Toxologia", "Métodos Alternativos", "Materiais Didáticos", "RedEH"]
    },
    {
        id: "karynn",
        name: "Karynn Vieira Capilé",
        image: "assets/karynn.png",
        desc: "É pós-doutoranda em bem-estar animal na UFPR, pesquisando a atuação da sociedade nas CEUAs. Doutora em Bioética pelo PPGBIOS-UFF e mestre pela UFPR, atua com ética animal, ambiental e métodos alternativos no ensino. Possui formação em Medicina Veterinária e Filosofia. Coordenadora de Bioética do Fórum Animal.",
        tags: ["Veterinária", "Bioética", "Métodos alternativos", "Filosofia", "Forum Animal", "RedEH"]
    },
    {
        id: "marta",
        name: "Marta Luciane Fischer",
        image: "assets/marta.png",
        desc: "Marta Fischer é bióloga, artista e doutora em Zoologia, com pós-doutorado em Ecologia Química. Professora titular da PUCPR, atua em bioética, bem-estar animal e zoologia aplicada, com destaque para sua liderança no Comitê de Ética no Uso de Animais e no Grupo de Pesquisa em Bioética Ambiental.",
        tags: ["Biologia", "Bioética", "Zoologia", "Artes", "Ecologia Química"]
    },
    {
        id: "rita",
        name: "Rita Leal Paixão",
        image: "assets/Rita.png",
        desc: "Especialista em bioética na experimentação animal e autora de obras fundamentais sobre razões materiais para a construção ética nas universidades.",
        tags: ["Bioética", "Autoridade Científica"]
    },
    {
        id: "thales",
        name: "Thales Tréz",
        image: "assets/tales.png",
        desc: "É biólogo com mestrado em Ética Aplicada (KU Leuven) e doutorado em Educação Científica e Tecnológica (UFSC). Professor da UNIFAL-MG, atua na humanização do ensino em engenharias e pesquisa em epistemologia, bioética e métodos substitutivos. É presidente do Instituto 1R e conselheiro titular no CONCEA.",
        tags: ["Biologia", "Bioética", "Instituto 1R"]
    }
];

if (!localStorage.getItem('altereco_forum_posts')) {
    localStorage.setItem('altereco_forum_posts', JSON.stringify([
        { id: '1', author: 'Débora Aita Gasparetto', role: 'admin', title: 'Bem-vindos ao Fórum AlterECO!', body: 'Este é um espaço para compartilharmos experiências e dúvidas sobre métodos substitutivos e ensino humanitário no Brasil.', date: '04/Abril', status: 'approved', replies: [] },
        { id: '2', author: 'Rita Leal Paixão', role: 'curador', title: 'Construção ética na universidade', body: 'Como vocês estão abordando a resistência institucional ao propor novos métodos de ensino sem uso animal?', date: '04/Abril', status: 'approved', replies: [ { author: 'Aldair Marins', body: 'Tenho focado na bioética da alteridade como ponte de diálogo.', date: '04/Abril' } ] }
    ]));
}

document.addEventListener('DOMContentLoaded', () => {
    const initialPage = window.location.hash.replace('#', '') || 'home';
    renderPage(initialPage);

    if (!digitalGarden && window.DigitalGarden) {
        digitalGarden = new DigitalGarden('three-container');
    }

    const menuBtn = document.getElementById('menu-trigger');
    const closeBtn = document.getElementById('close-menu');
    const overlay = document.getElementById('nav-overlay');
    const sideMenu = document.getElementById('side-menu');

    const toggleMenu = () => {
        if (sideMenu) sideMenu.classList.toggle('open');
        if (overlay) overlay.classList.toggle('visible');
    };

    if (menuBtn) menuBtn.onclick = toggleMenu;
    if (closeBtn) closeBtn.onclick = toggleMenu;
    if (overlay) overlay.onclick = toggleMenu;

    // Bot nav button is now handled purely via dataset.page="ai-eco" in document.onclick

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-page], [data-tag], [data-tab]');
        if (!btn) return;
        if (btn.dataset.page) {
            handleNavigation(btn.dataset.page, btn);
            if (sideMenu && sideMenu.classList.contains('open')) toggleMenu();
        } else if (btn.dataset.tag) {
            handleTagFilter(btn.dataset.tag, btn);
        } else if (btn.dataset.tab) {
            const t = btn.dataset.tabType;
            if (t === 'db') switchDatabaseTab(btn.dataset.tab, btn);
            else if (t === 'legis') switchLegisTab(btn.dataset.tab, btn);
            else if (t === 'materiais') switchMateriaisTab(btn.dataset.tab, btn);
            else if (t === 'publicacoes') switchPublicacoesTab(btn.dataset.tab, btn);
        }
    });

    document.addEventListener('input', (e) => {
        const ids = ['main-search', 'search-input', 'metodos-search', 'materiais-search', 'pub-search'];
        if (!ids.includes(e.target.id)) return;
        const query = e.target.value.toLowerCase();
        const container = document.getElementById('content-area');
        if (!container) return;
        container.querySelectorAll('.mockup-section,.db-card,.legis-card,.materiais-card,.metodo-card,.pub-card,.sub-section')
            .forEach(item => { item.style.display = item.innerText.toLowerCase().includes(query) ? '' : 'none'; });
    });
});

/* ─── Shared Helpers ─────────────────────────────────── */

function getSearchHTML(placeholder, id = 'main-search') {
    return `<div class="search-section" style="padding-bottom:1.5rem;">
        <div class="search-bar-wrapper">
            <input type="text" id="${id}" placeholder="${placeholder}">
            <i data-lucide="search" class="search-icon"></i>
        </div>
    </div>`;
}

function getFilterDropdownHTML(id = 'filter-areas') {
    return `<div class="filter-dropdown-wrapper">
        <select id="${id}" class="filter-dropdown">
            <option value="">Filtre Áreas</option>
            <option>Biologia</option>
            <option>Medicina</option>
            <option>Veterinária</option>
            <option>Farmacologia</option>
            <option>Toxicologia</option>
            <option>Bioética</option>
        </select>
        <i data-lucide="chevron-down" class="dropdown-icon"></i>
    </div>`;
}

function getSearchFilterBarHTML(searchId, filterId, placeholder = 'Busque mé...') {
    return `<div class="search-filter-bar">
        <div class="search-bar-wrapper flex-1">
            <input type="text" id="${searchId}" placeholder="${placeholder}">
            <i data-lucide="search" class="search-icon"></i>
        </div>
        ${getFilterDropdownHTML(filterId)}
    </div>`;
}

function getTabsHTML(tabs, activeValue, type) {
    return `<div class="unified-tabs-wrapper">
        <div class="unified-tabs-container">
            ${tabs.map(t => `<button class="unified-tab-btn ${t.value === activeValue ? 'active' : ''}" data-tab="${t.value}" data-tab-type="${type}">${t.label}</button>`).join('')}
        </div>
    </div>`;
}

function pillsHTML(pills) {
    if (!pills || !pills.length) return '';
    return `<div class="pills-row">${pills.map((p, i) => `<span class="pill-tag ${i === 0 ? 'dark' : ''}">${p}</span>`).join('')}</div>`;
}

/* ─── Navigation ─────────────────────────────────────── */

function handleNavigation(pageId, btn) {
    window.location.hash = pageId;
    document.querySelectorAll('.nav-btn, .drawer-link').forEach(b => {
        b.classList.toggle('active', b.dataset.page === pageId);
    });
    renderPage(pageId);
}

function renderPage(pageId) {
    const contentArea = document.getElementById('content-area');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (!contentArea) return;

    contentArea.setAttribute('aria-live', 'polite');

    if (header) header.style.display = 'flex';
    if (footer) footer.style.display = 'block';
    contentArea.style.paddingTop = '0';

    contentArea.innerHTML = '';
    const section = document.createElement('div');
    section.className = 'page-container';
    section.id = 'main-content';
    section.setAttribute('role', 'main');
    section.tabIndex = -1;
    contentArea.appendChild(section);

    switch (pageId) {
        case 'home': renderHomePage(section); break;
        case 'sobre': renderSobrePage(section); break;
        case 'metodos': renderMetodosPage(section); break;
        case 'materiais': renderMaterialsPage(section); break;
        case 'publicacoes': renderPublicacoesPage(section); break;
        case 'legislacao': renderLegislacaoPage(section); break;
        case 'bases-dados': renderBasesDadosPage(section); break;
        case 'curadoria': renderCuradoriaPage(section); break;
        case 'eventos': renderEventosPage(section); break;
        case 'forum': renderForumPage(section); break;
        case 'observatorio': if (window.initObservatorio) window.initObservatorio(section); break;
        case 'ai-eco': if (window.initAIECOInterface) window.initAIECOInterface(section); break;
        default: 
            if (pageId.startsWith('curador-')) {
                const id = pageId.replace('curador-', '');
                renderCuradorProfilePage(id, section);
            } else {
                renderHomePage(section); 
            }
            break;
    }

    if (window.lucide) window.lucide.createIcons();
    window.scrollTo(0, 0);
}

/* ══════════════════════════════════════════════════════
   HOME PAGE — 8 Cards + Pills conforme prints
══════════════════════════════════════════════════════ */

function renderHomePage(container) {
    const cards = [
        { page: 'publicacoes', icon: 'assets/publicações.png', title: 'Acesse o repositório de Publicações', text: 'Acesse uma seleção de publicações sobre métodos substitutivos, incluindo livros, artigos científicos, notícias e conteúdos atualizados, organizados por tema e tipo de material.' },
        { page: 'metodos', icon: 'assets/métodos_validados.png', title: 'Acesse o repositório de Métodos', text: 'Explore um repositório aberto e colaborativo com métodos substitutivos ao uso de animais no ensino e na pesquisa, organizado por área, nível de ensino e tipo de recurso.' },
        { page: 'materiais', icon: 'assets/materiais.png', title: 'Busque Materiais Didáticos', text: 'Encontre materiais didáticos como simuladores, jogos e experiências interativas voltados à substituição animal, organizados por área, tipo e nível de ensino.' },
        { page: 'bases-dados', icon: 'assets/base_internacional_(1).png', title: 'Pesquise bases de dados nacionais e internacionais', text: 'Pesquise bases de dados nacionais e internacionais sobre métodos substitutivos e amplie o acesso a recursos validados e atualizados ao redor do mundo.' },
        { page: 'legislacao', icon: 'assets/leis.png', title: 'Acompanhe a Legislação', text: 'Acompanhe legislações, normas e diretrizes relacionadas aos métodos substitutivos, com foco no ensino, pesquisa e ética no uso animal.' },
        { page: 'eventos', icon: 'assets/eventos.png', title: 'Eventos sobre Substituição Animal', text: 'Confira eventos, cursos e encontros dedicados aos métodos substitutivos no ensino e na pesquisa, e fique por dentro das principais iniciativas na área.' },
        { page: 'forum', icon: 'assets/forum.png', title: 'Fórum', text: 'Participe do fórum da plataforma e troque experiências, dúvidas e sugestões sobre métodos substitutivos com outros docentes, pesquisadores(as) e estudantes.' },
        { page: 'curadoria', icon: 'assets/curadoria_(2).png', title: 'Curadoria de conteúdo', text: 'Conheça os curadores da plataforma — especialistas em diferentes áreas de ensino e pesquisa que selecionam e organizam os conteúdos sobre métodos substitutivos.' },
    ];

    container.innerHTML = `
        <div class="page-dark-hero">
            <span class="page-badge">Visão Geral</span>
            <h1>Plataforma AlterECO</h1>
            <p>Plataforma colaborativa com métodos substitutivos ao uso de animais no ensino e na pesquisa.</p>
        </div>

        ${getSearchHTML('Busque leis, métodos, materiais...')}

        <div class="tags-row" style="margin-bottom:3rem;">
            <button class="pill-tag dark" data-tag="Escolas">Escolas</button>
            <button class="pill-tag" data-page="metodos">Métodos</button>
            <button class="pill-tag" data-page="publicacoes">Publicações</button>
            <button class="pill-tag" data-tag="Legislação">Legislação</button>
            <button class="pill-tag" data-tag="Tecnologia">Tecnologia</button>
            <button class="pill-tag" data-page="observatorio">Monitoramento</button>
        </div>

        <div class="home-cards-grid">
            ${cards.map(c => `
            <div class="home-card home-card-dynamic" data-page="${c.page}" style="cursor:pointer; display:flex; flex-direction:column; padding:1.5rem; background:#EDF0F2; border-radius:16px;">
                <h3 class="home-card-title" style="font-size:1.45rem; font-weight:700; color:var(--text-gray); margin-bottom:1.5rem; text-align:left; line-height:1.4;">${c.title}</h3>
                
                <div style="display:flex; gap:1.2rem; align-items:center; margin-bottom:2rem;">
                    <img src="${c.icon}" alt="" style="width:135px; border-radius:20px; flex-shrink:0; object-fit:contain;">
                    <p class="home-card-text" style="font-size:0.95rem; color:var(--text-gray); line-height:1.7; text-align:left; margin:0; flex:1;">${c.text}</p>
                </div>
                
                <div class="home-card-footer" style="margin-top:auto; text-align:center; width: 100%;">
                    <button style="background:#2C2F33; color:white; border:none; padding:12px 28px; border-radius:8px; font-weight:700; font-size:1rem; display:inline-flex; align-items:center; justify-content:center; gap:8px; cursor:pointer;">Acessar <i data-lucide="arrow-right" style="width:20px;"></i></button>
                </div>
            </div>`).join('')}
        </div>

        <div class="observatorio-banner" data-page="observatorio" style="cursor:pointer; background:#2C2C33; border-radius:24px; padding:3.5rem; margin-top:2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.15); border:none; display:flex; gap:3rem; align-items:center;">
            <div style="flex:1;">
                <h3 style="color:white; font-size:1.8rem; font-weight:700; margin-bottom:1.2rem; text-align:left;">Conheça o Observatório Humano-Animal</h3>
                <p style="color:rgba(255,255,255,0.8); font-size:1.05rem; line-height:1.6; margin-bottom:2rem; text-align:left; max-width:850px;">
                    Explore nosso monitoramento nacional sobre economia pet, abandono animal e experimentação baseada em dados estatísticos oficiais. Lá você encontra alternativas éticas, modernas e acessíveis que já foram analisadas e reconhecidas oficialmente no Brasil.
                </p>
                <div style="text-align:left;">
                    <button style="background:var(--accent-yellow); color:var(--on-accent); border:none; padding:15px 45px; border-radius:12px; font-weight:700; font-size:1.1rem; cursor:pointer; box-shadow:0 4px 15px rgba(250,205,95,0.35); transition: transform 0.2s ease;">
                        Acessar
                    </button>
                </div>
            </div>
            <img src="assets/observatório.png" alt="Ícone Observatório" style="width:200px; height:auto; opacity:0.9; filter: drop-shadow(0 0 20px rgba(255,255,255,0.1)); border-radius:20px;">
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}

/* ══════════════════════════════════════════════════════
   SOBRE
══════════════════════════════════════════════════════ */

function renderSobrePage(c) {
    c.innerHTML = `
    <div class="page-dark-hero">
        <span class="page-badge">Sobre a Plataforma</span>
        <h1>Educação Humanitária</h1>
        <p>Iniciativa interdisciplinar brasileira para Substituição do Uso de Animais na Ciência.</p>
    </div>
    <div class="cards-grid-4" style="margin-top: 20px; margin-bottom: 4rem;">
        <div class="home-card" style="grid-column: 1 / -1; padding: 4rem; text-align: left; max-width: 900px; margin: 0 auto;">
            <p style="font-size:1.15rem;line-height:1.8;color:var(--text-gray);margin-bottom:2.5rem;">
                Criado a partir de uma rede interdisciplinar nacional, o <strong>AlterECO</strong> reúne alternativas ao uso de animais em um ambiente digital intuitivo e educativo — apoiado por curadoria científica e uma inteligência artificial própria voltada a projetar futuros mais humanitários para a pesquisa e o ensino.
            </p>
            <p style="font-size:1.15rem;line-height:1.8;color:var(--text-gray);margin-bottom:2.5rem;">
                Uma iniciativa brasileira de design, arte, ciência e tecnologia que conecta educadores, estudantes e pesquisadores a métodos substitutivos éticos, acessíveis e inovadores.
            </p>
            <p style="font-size:1.15rem;line-height:1.8;color:var(--text-gray);">
                Desde 2015, atuamos na promoção da educação humanitária e da substituição do uso de animais, por meio de pesquisa, design, arte digital, eventos públicos e materiais educacionais. Em 2023–2025, o AlterECO tornou-se o núcleo dessa trajetória: uma plataforma digital construída para transformar a relação entre educação, ciência e ética.
            </p>
            <p style="margin-top:3rem;font-size:0.95rem;color:var(--text-gray);text-align:center;">Grupo de Pesquisa Design, Ciência e Tecnologia · UFSM / CNPq</p>
        </div>
    </div>`;
    if (window.lucide) window.lucide.createIcons();
}

/* ══════════════════════════════════════════════════════
   MÉTODOS SUBSTITUTIVOS — Busca + filtros + 4 campos + CTA
══════════════════════════════════════════════════════ */

function renderMetodosPage(c) {
    const dynamic = window.getDynamicPostsForArea ? getDynamicPostsForArea('metodos') : [];
    const allMetodos = [...METODOS, ...dynamic.map(d => ({ name: d.title + (d.author ? ' (Por: ' + d.author + ')' : ''), description: d.description, url: d.url }))];
    const metodosHTML = allMetodos.map(m => `
    <div class="metodo-card">
        <h3 class="metodo-title">${m.name}</h3>
        ${m.oecd ? `<p class="metodo-oecd">${m.oecd}</p>` : ''}
        <p class="metodo-desc">${m.description}</p>
        ${m.howToUse ? `<p class="metodo-field"><strong>${m.howToUse}</strong></p>` : ''}
        ${m.purpose ? `<p class="metodo-field">${m.purpose}</p>` : ''}
        ${m.source ? `<p class="metodo-source">${m.source}</p>` : ''}
        <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center;">
            <a href="${m.url}" target="_blank" style="background:#2C2F33; color:white; border:none; padding:10px 22px; border-radius:8px; font-weight:700; font-size:0.9rem; display:inline-flex; align-items:center; gap:8px; text-decoration:none; cursor:pointer;">Acessar <i data-lucide="arrow-right" style="width:18px;"></i></a>
            <button onclick="shareCard(this)" title="Compartilhar" style="background:none; border:none; cursor:pointer;"><i data-lucide="share-2" style="width:18px; color:var(--text-gray);"></i></button>
        </div>
    </div>`).join('');

    const ctaHTML = `
    <div class="metodo-cta-card">
        <h3>Conheça os Métodos Substitutivos Reconhecidos no Repositório do CONCEA</h3>
        <p>Você sabia que é possível ensinar e pesquisar sem usar animais vivos? O Conselho Nacional de Controle de Experimentação Animal (CONCEA) disponibiliza um Repositório Nacional de Métodos Substitutivos ao Uso de Animais no Ensino. Lá, você encontra diversas alternativas éticas, modernas e acessíveis que já foram analisadas e reconhecidas oficialmente no Brasil.</p>
        <a href="https://www.gov.br/mcti/pt-br/composicao/conselhos/concea" target="_blank" class="acessar-btn">Acessar <i data-lucide="arrow-right"></i></a>
    </div>`;

    c.innerHTML = `
    <div class="page-dark-hero">
        <span class="page-badge">Métodos Substitutivos</span>
        <h1>Métodos Substitutivos Reconhecidos</h1>
        <p>Repositório Nacional conforme a RN 56/2022 do CONCEA.</p>
    </div>
    <div class="content-white-section">
        ${getSearchFilterBarHTML('metodos-search', 'metodos-filter')}
        <div class="cards-grid-4">
            ${metodosHTML}
        </div>
        ${ctaHTML}
    </div>`;
    if (window.lucide) window.lucide.createIcons();
}

/* ══════════════════════════════════════════════════════
   MATERIAIS DIDÁTICOS — Busca + filtro em ambas as abas
══════════════════════════════════════════════════════ */

function renderMaterialsPage(c) {
    c.innerHTML = `
    <div class="page-dark-hero">
        <span class="page-badge">Materiais Didáticos</span>
        <h1>Materiais Didáticos</h1>
        <p>Encontre materiais, simuladores e jogos voltados à substituição animal.</p>
    </div>
    <div class="content-white-section">
        ${getTabsHTML([{ label: 'Universidades', value: 'univ' }, { label: 'Escolas', value: 'escolas' }], 'univ', 'materiais')}
        ${getSearchFilterBarHTML('materiais-search', 'materiais-filter', 'Busque materiais...')}
        <div id="materiais-content" class="cards-grid-4"></div>
    </div>`;
    switchMateriaisTab('univ');
}

function switchMateriaisTab(val, btn) {
    const list = val === 'univ' ? MATERIAIS.universidades : MATERIAIS.escolas;
    const grid = document.getElementById('materiais-content');
    if (!grid) return;
    if (btn) { document.querySelectorAll('[data-tab-type="materiais"]').forEach(t => t.classList.remove('active')); btn.classList.add('active'); }

    const dynamic = window.getDynamicPostsForArea ? getDynamicPostsForArea('materiais').map(d => ({ name: d.title + ' (Por: ' + d.author + ')', description: d.description, url: d.url, tags: d.tags })) : [];
    const allItems = [...list, ...dynamic];
    grid.innerHTML = allItems.map(item => {
        const imageHTML = item.image ? `<div class="materiais-img-wrap"><img src="${item.image}" alt="${item.name}" class="materiais-img"></div>` : '';
        const featuredHTML = item.featured ? `<div class="materiais-featured-badge">${item.featuredTitle}</div>` : '';
        const isEdu = (t) => ['Escolas', 'Ensino Médio', 'IES', 'Universidades', 'Educação Básica', 'Ensino Superior'].includes(t);
        const tagsHTML = (item.tags && item.tags.length > 0) ? `<div class="pills-row">${item.tags.map((t, i) => {
            const eduStyle = isEdu(t) ? 'background-color: var(--mint-teal); color: var(--primary-navy); font-weight: 800;' : '';
            return `<span class="pill-tag ${i === 0 && !isEdu(t) ? 'dark' : ''}" style="${eduStyle}">${t}</span>`;
        }).join('')}</div>` : '';
        return `
        <div class="materiais-card">
            ${featuredHTML}
            ${imageHTML}
            <h3 class="materiais-card-title">${item.name}</h3>
            <p class="materiais-card-desc">${item.description}</p>
            ${tagsHTML}
            <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center;">
                <a href="${item.url}" target="_blank" style="background:#2C2F33; color:white; border:none; padding:10px 22px; border-radius:8px; font-weight:700; font-size:0.9rem; display:inline-flex; align-items:center; gap:8px; text-decoration:none; cursor:pointer;">Acessar <i data-lucide="arrow-right" style="width:18px;"></i></a>
                <button onclick="shareCard(this)" title="Compartilhar" style="background:none; border:none; cursor:pointer;"><i data-lucide="share-2" style="width:18px; color:var(--text-gray);"></i></button>
            </div>
        </div>`;
    }).join('');
    if (window.lucide) window.lucide.createIcons();
}

/* ══════════════════════════════════════════════════════
   PUBLICAÇÕES — Sub-seções com título + pills por categoria
══════════════════════════════════════════════════════ */

function renderPublicacoesPage(c) {
    c.innerHTML = `
    <div class="page-dark-hero">
        <span class="page-badge">Publicações</span>
        <h1>Publicações e Artigos</h1>
        <p>Acesse o repositório de pesquisas atualizadas organizadas por tema e área.</p>
    </div>
    <div class="content-white-section">
        ${getTabsHTML([{ label: 'Universidades', value: 'univ' }, { label: 'Escolas', value: 'escolas' }], 'univ', 'publicacoes')}
        ${getSearchFilterBarHTML('pub-search', 'pub-filter', 'Busque publicações...')}
        <div id="publicacoes-content"></div>
    </div>`;
    switchPublicacoesTab('univ');
}

function switchPublicacoesTab(val, btn) {
    const staticData = val === 'univ' ? PUBLICACOES.universidades : PUBLICACOES.escolas;
    const grid = document.getElementById('publicacoes-content');
    if (!grid) return;
    if (btn) { document.querySelectorAll('[data-tab-type="publicacoes"]').forEach(t => t.classList.remove('active')); btn.classList.add('active'); }

    const dynamic = window.getDynamicPostsForArea ? getDynamicPostsForArea('publicacoes') : [];
    
    // Combine static and dynamic content
    let allItems = [];
    
    // Flatten static items if they are grouped by category
    staticData.forEach(section => {
        if (section.items) {
            section.items.forEach(item => {
                allItems.push({
                    ...item,
                    category: section.category,
                    pills: section.pills
                });
            });
        } else {
            allItems.push(section);
        }
    });

    // Add dynamic items
    dynamic.forEach(d => {
        allItems.push({
            title: d.title,
            author: d.author,
            desc: d.description,
            url: d.url || '#',
            image: d.image || 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=400',
            tags: d.tags
        });
    });

    if (allItems.length === 0) {
        grid.innerHTML = `
        <div class="pub-login-cta">
            <div style="background:var(--bg-light); width:80px; height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--primary-navy); margin-bottom:1rem;">
                <i data-lucide="book-open" style="width:40px; height:40px;"></i>
            </div>
            <h3>Nenhuma publicação cadastrada ainda</h3>
            <p>Esta área será preenchida com livros, artigos e resumos científicos. Se você é um curador, acesse o painel para adicionar novos conteúdos.</p>
            <div style="display:flex; gap:1rem; margin-top:1rem;">
                <button onclick="renderLogin('curador')" class="pub-login-btn">Entrar como Curador</button>
                <button onclick="renderLogin('admin')" class="pub-login-btn" style="background:var(--accent-orange);">Administração</button>
            </div>
        </div>`;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    grid.innerHTML = `
        <div class="pub-cards-container">
            ${allItems.map(item => `
            <div class="pub-book-card">
                <div class="pub-book-img-wrapper">
                    <img src="${item.image || 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=400'}" alt="${item.title}" class="pub-book-img">
                </div>
                <div class="pub-book-content">
                    <h3 class="pub-book-title">${item.title}</h3>
                    <div class="pub-book-author">${item.author || 'Autor Desconhecido'}</div>
                    <p class="pub-book-desc">${item.desc || 'Um resumo sobre esta publicação está sendo preparado pela nossa curadoria inteligente...'}</p>
                    
                    <div class="pub-book-footer">
                        <a href="${item.url}" target="_blank" class="acessar-btn">Acessar <i data-lucide="arrow-right"></i></a>
                        <button onclick="shareCard(this)" title="Compartilhar" style="background:none; border:none; cursor:pointer;" class="share-btn-ui">
                            <i data-lucide="share-2" style="width:20px; color:var(--text-gray);"></i>
                        </button>
                    </div>
                </div>
            </div>
            `).join('')}
        </div>
    `;
    
    if (window.lucide) window.lucide.createIcons();
}

/* ══════════════════════════════════════════════════════
   BASES DE DADOS — Com logo + descrição completa
══════════════════════════════════════════════════════ */

function renderBasesDadosPage(c) {
    c.innerHTML = `
    <div class="page-dark-hero">
        <span class="page-badge">Bases de Dados</span>
        <h1>Bases de Dados</h1>
        <p>Pesquise em referências consolidadas do Brasil e do mundo.</p>
    </div>
    <div class="content-white-section">
        ${getTabsHTML([{ label: 'Brasil', value: 'nac' }, { label: 'Internacionais', value: 'inter' }], 'nac', 'db')}
        <div id="db-content" class="cards-grid-4"></div>
    </div>`;
    switchDatabaseTab('nac');
}

function switchDatabaseTab(val, btn) {
    const list = val === 'nac' ? BASES_DADOS.nacional : BASES_DADOS.internacional;
    const grid = document.getElementById('db-content');
    if (!grid) return;
    if (btn) { document.querySelectorAll('[data-tab-type="db"]').forEach(t => t.classList.remove('active')); btn.classList.add('active'); }
    const dynamic = window.getDynamicPostsForArea ? getDynamicPostsForArea('bases').map(d => ({ name: d.title + ' (Por: ' + d.author + ')', description: d.description, url: d.url })) : [];
    const allItems = [...list, ...dynamic];
    grid.innerHTML = allItems.map(db => `
    <div class="db-card">
        ${db.logo ? `<div class="db-card-logo-row"><img src="${db.logo}" alt="${db.name}" class="db-logo" onerror="this.style.display='none'"><span class="db-card-name-inline">${db.name}</span></div>` : `<h3 class="db-card-name">${db.name}</h3>`}
        <p class="db-card-desc">${db.description}</p>
        <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center;">
            <a href="${db.url}" target="_blank" style="background:#2C2F33; color:white; border:none; padding:10px 22px; border-radius:8px; font-weight:700; font-size:0.9rem; display:inline-flex; align-items:center; gap:8px; text-decoration:none; cursor:pointer;">Acessar <i data-lucide="arrow-right" style="width:18px;"></i></a>
            <button onclick="shareCard(this)" title="Compartilhar" style="background:none; border:none; cursor:pointer;"><i data-lucide="share-2" style="width:18px; color:var(--text-gray);"></i></button>
        </div>
    </div>`).join('');
    if (window.lucide) window.lucide.createIcons();
}

/* ══════════════════════════════════════════════════════
   LEGISLAÇÃO — Texto intro + 5 entradas Brasil
══════════════════════════════════════════════════════ */

function renderLegislacaoPage(c) {
    c.innerHTML = `
    <div class="page-dark-hero">
        <span class="page-badge">Legislação</span>
        <h1>Legislação e Normativas</h1>
        <p>Acompanhe textos legais para regulamentação de pesquisa e ética.</p>
    </div>
    <div class="content-white-section">
        ${getTabsHTML([{ label: 'Brasil', value: 'br' }, { label: 'Internacional', value: 'world' }], 'br', 'legis')}
        <div id="legis-content"></div>
    </div>`;
    switchLegisTab('br');
}

function switchLegisTab(val, btn) {
    const list = val === 'br' ? LEGISLACAO.brasil : LEGISLACAO.internacional;
    const grid = document.getElementById('legis-content');
    if (!grid) return;
    if (btn) { document.querySelectorAll('[data-tab-type="legis"]').forEach(t => t.classList.remove('active')); btn.classList.add('active'); }

    const introHTML = val === 'br' ? `<p class="legis-intro">${LEGISLACAO_INTRO}</p>` : '';

    const dynamic = window.getDynamicPostsForArea ? getDynamicPostsForArea('legislacao').map(d => ({ name: d.title + ' (Por: ' + d.author + ')', description: d.description, url: d.url })) : [];
    const allItems = [...list, ...dynamic];

    grid.innerHTML = introHTML + `<div class="cards-grid-4">${allItems.map(item => `
    <div class="legis-card">
        <h3 class="legis-card-title">${item.name}</h3>
        <p class="legis-card-desc">${item.description}</p>
        <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center;">
            <a href="${item.url}" target="_blank" style="background:#2C2F33; color:white; border:none; padding:10px 22px; border-radius:8px; font-weight:700; font-size:0.9rem; display:inline-flex; align-items:center; gap:8px; text-decoration:none; cursor:pointer;">Acessar <i data-lucide="arrow-right" style="width:18px;"></i></a>
            <button onclick="shareCard(this)" title="Compartilhar" style="background:none; border:none; cursor:pointer;"><i data-lucide="share-2" style="width:18px; color:var(--text-gray);"></i></button>
        </div>
    </div>`).join('')}</div>`;
    if (window.lucide) window.lucide.createIcons();
}

/* ══════════════════════════════════════════════════════
   CURADORIA — Página conforme print "Sobre"
══════════════════════════════════════════════════════ */

function renderCuradoriaPage(c) {
    const organizers = [
        {
            name: 'Dr. Adair Roberto Santos',
            role: 'Curadoria Metodológica',
            area: 'Neurobiologia / Toxicologia',
            inst: 'UFSC - Farmacologia',
            desc: 'Especialista em métodos alternativos in vitro e modelos computacionais aplicados à toxicologia e neurociência.'
        },
        {
            name: 'Dra. Karin Werther',
            role: 'Curadoria Científica',
            area: 'Animais Selvagens / Bioética',
            inst: 'UNESP - Jaboticabal',
            desc: 'Docente com ampla atuação em patologia e bem-estar de animais selvagens, liderando transições éticas no ensino.'
        },
        {
            name: 'Dra. Isabel Silva',
            role: 'Curadoria de Conteúdo',
            area: 'Bem-estar Animal',
            inst: 'UFRGS',
            desc: 'Coordena a validação de materiais didáticos substitutivos e roteiros de ensino baseados nos 3Rs.'
        },
        {
            name: 'Dra. Debora Gasparetto',
            role: 'Coordenação Executiva',
            area: 'Tecnologia / Design Ético',
            inst: 'UFSM',
            desc: 'Lidera o projeto AlterECO e o desenvolvimento da plataforma observatória de métodos substitutivos.'
        }
    ];

    c.innerHTML = `
    <div class="page-dark-hero">
        <span class="page-badge">Curadoria</span>
        <h1>Rede de Especialistas</h1>
        <p>A curadoria da AlterECO é formada por docentes e pesquisadores(as) de diferentes áreas do conhecimento e regiões do país, conectados em uma rede interdisciplinar.</p>
    </div>
    <div class="content-white-section" style="background:#F7F8FA; padding-top: 4rem; padding-bottom: 6rem;">
        <div style="max-width:1200px; margin:0 auto; width:95%;">
            <div class="cards-grid-3">
                ${organizers.map(p => `
                    <div style="background:var(--white); padding:2rem; border-radius:24px; box-shadow:0 10px 30px rgba(0,0,0,0.05); text-align:center; border:1px solid rgba(128,128,128,0.15);">
                        <div style="width:100px; height:100px; background:#f0f7ff; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem; color:var(--mint-teal);">
                            <i data-lucide="user" style="width:40px; height:40px;"></i>
                        </div>
                        <h3 style="color:var(--primary-navy); margin-bottom:0.5rem; font-size:1.3rem;">${p.name}</h3>
                        <div style="color:var(--accent-orange); font-weight:bold; font-size:0.9rem; margin-bottom:1rem; text-transform:uppercase;">${p.role}</div>
                        <p style="color:var(--text-gray); font-size:0.95rem; line-height:1.6; margin-bottom:1.5rem;">${p.desc}</p>
                        <div style="background:#f8f9fa; padding:0.8rem; border-radius:12px; font-size:0.85rem; color:var(--text-gray);">
                            <strong>Instituição:</strong> ${p.inst}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 5rem; padding: 3rem; background:var(--white); border-radius:24px; text-align:center;">
                <h2 style="color:var(--primary-navy); margin-bottom:1.5rem;">Sobre a Seleção de Conteúdo</h2>
                <p style="max-width:800px; margin:0 auto; color:var(--text-gray); line-height:1.9; font-size:1.1rem;">
                    Nossa rede seleciona, organiza e valida os conteúdos da plataforma, garantindo qualidade, ética e atualização constante nos materiais sobre métodos substitutivos aplicados ao ensino e à pesquisa. Esta seção reúne perfis de curadores(as), suas áreas de atuação, produções indicadas e materiais organizados.
                </p>
            </div>
        </div>
    </div>`;
    if (window.lucide) window.lucide.createIcons();
    window.scrollTo(0, 0);
}

/* ══════════════════════════════════════════════════════
   EVENTOS (placeholder com aviso)
══════════════════════════════════════════════════════ */

window.calendarOffset = window.calendarOffset || 0;

function renderEventosPage(c) {
    const dynamicEvents = window.getDynamicPostsForArea ? getDynamicPostsForArea('eventos') : [];
    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() + window.calendarOffset);

    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const monthName = baseDate.toLocaleString('default', { month: 'long' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDaysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();

    const hasEvent = (day) => {
        // Simple logic: check if any event date string contains the day
        // In a real app, this would be a proper date comparison
        return dynamicEvents.some(ev => ev.date && ev.date.includes(String(day).padStart(2, '0')));
    };

    let calendarDaysHTML = '';

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        calendarDaysHTML += `<div style="color:var(--text-gray); font-size:1.1rem; padding:10px;">${prevDaysInMonth - i}</div>`;
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
        const marked = hasEvent(d);

        calendarDaysHTML += `
            <div style="position:relative; font-size:1.1rem; padding:10px; color:${isToday ? 'white' : '#666'};">
                <div style="${isToday ? 'background:var(--mint-teal); color:white; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto; font-weight:bold; box-shadow:0 4px 10px rgba(0,229,255,0.3);' : ''}">
                    ${d}
                </div>
                ${marked ? `<div style="position:absolute; bottom:5px; left:50%; transform:translateX(-50%); width:6px; height:6px; background:#ccc; border-radius:50%;" title="Evento cadastrado neste dia"></div>` : ''}
            </div>
        `;
    }

    // Next month days
    const totalCells = firstDay + daysInMonth;
    const padding = (7 - (totalCells % 7)) % 7;
    for (let j = 1; j <= padding; j++) {
        calendarDaysHTML += `<div style="color:var(--text-gray); font-size:1.1rem; padding:10px;">${j}</div>`;
    }

    const calendarHTML = `
        <div style="background:#F2F4F8; padding:3rem 2rem; border-radius:15px 15px 0 0; position:relative;">
            <div style="max-width:800px; margin:0 auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
                    <h2 style="color:var(--text-gray); font-size:1.8rem; text-transform:capitalize;">${monthName} ${year}</h2>
                    <div style="display:flex; gap:1rem; align-items:center; color:var(--mint-teal);">
                        <button onclick="window.calendarOffset--; renderPage('eventos')" style="background:none; border:none; color:inherit; cursor:pointer;" title="Mês Anterior"><i data-lucide="chevron-left" style="width:28px; height:28px;"></i></button>
                        <button onclick="window.calendarOffset = 0; renderPage('eventos')" style="background:none; border:none; color:inherit; cursor:pointer;" title="Mês Atual"><i data-lucide="calendar" style="width:28px; height:28px;"></i></button>
                        <button onclick="window.calendarOffset++; renderPage('eventos')" style="background:none; border:none; color:inherit; cursor:pointer;" title="Próximo Mês"><i data-lucide="chevron-right" style="width:28px; height:28px;"></i></button>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(7, 1fr); text-align:center; row-gap:1rem;">
                    <div style="color:var(--text-gray); font-weight:600; padding-bottom:1rem;">Dom</div>
                    <div style="color:var(--text-gray); font-weight:600; padding-bottom:1rem;">Seg</div>
                    <div style="color:var(--text-gray); font-weight:600; padding-bottom:1rem;">Ter</div>
                    <div style="color:var(--text-gray); font-weight:600; padding-bottom:1rem;">Qua</div>
                    <div style="color:var(--text-gray); font-weight:600; padding-bottom:1rem;">Qui</div>
                    <div style="color:var(--text-gray); font-weight:600; padding-bottom:1rem;">Sex</div>
                    <div style="color:var(--text-gray); font-weight:600; padding-bottom:1rem;">Sáb</div>
                    ${calendarDaysHTML}
                </div>
            </div>
            <div style="position:absolute; bottom:0; left:0; width:100%; height:3px; background:var(--accent-yellow);"></div>
        </div>
    `;

    const eventsToRender = dynamicEvents.length > 0 ? dynamicEvents : [{
        title: 'WC13 Rio - 13th World Congress on Alternatives and Animal Use',
        date: '31/08/2025',
        description: 'Rio de Janeiro',
        image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=400',
        url: 'https://wc13rio.org'
    }];

    const eventsHTML = eventsToRender.map(ev => `
        <div style="background:var(--white); border-radius:12px; overflow:hidden; display:flex; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin-bottom:1.5rem; border:1px solid rgba(128,128,128,0.15);">
            <div style="width:250px; height:200px; flex-shrink:0; position:relative;">
                ${ev.image ? `<img src="${ev.image}" alt="${ev.title}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="background:#ddd; width:100%; height:100%;"></div>`}
                <div style="position:absolute; left:0; top:0; width:5px; height:100%; background:var(--accent-yellow);"></div>
            </div>
            <div style="padding:1.5rem; display:flex; flex-direction:column; justify-content:center; flex:1;">
                <h3 style="color:var(--text-gray); font-size:1.3rem; margin-bottom:1rem; font-weight:700;">${ev.title.split(' - ')[0]}</h3>
                <p style="color:var(--text-gray); font-size:1rem; margin-bottom:0.3rem;">${ev.date}</p>
                <p style="color:var(--text-gray); font-size:1rem; margin-bottom:1.5rem;">${ev.description}</p>
                <a href="${ev.url}" target="_blank" style="background:#2C2F33; color:white; border:none; padding:10px 24px; border-radius:8px; font-weight:bold; text-decoration:none; display:inline-flex; align-items:center; gap:8px; width:fit-content;">Ver Mais <i data-lucide="arrow-right" style="width:18px;"></i></a>
            </div>
        </div>
    `).join('');

    c.innerHTML = `
    <div class="page-dark-hero">
        <span class="page-badge">Eventos</span>
        <h1>Prazos, Prêmios e Inscrições</h1>
        <p>Acompanhe datas limites e grandes encontros. As notificações são varridas do mundo inteiro pela nossa inteligência artificial para o Brasil.</p>
    </div>
    <div class="content-white-section" style="background:var(--bg-light); padding:0;">
        <div style="max-width:800px; margin:0 auto; padding-top:2rem; padding-bottom:4rem;">
            ${calendarHTML}
            <div style="padding:2rem; background:#F2F4F8; border-radius: 0 0 15px 15px; border-top:1px solid rgba(128,128,128,0.15);">
                ${eventsHTML}
            </div>
        </div>
    </div>`;
    if (window.lucide) window.lucide.createIcons();
}

/* ══════════════════════════════════════════════════════
   FÓRUM (placeholder com aviso)
══════════════════════════════════════════════════════ */

function renderForumPage(c) {
    const session = JSON.parse(sessionStorage.getItem('altereco_session'));
    const allPosts = JSON.parse(localStorage.getItem('altereco_forum_posts')) || [];
    const activePosts = allPosts.filter(p => p.status === 'approved');

    const threadsHTML = activePosts.map(post => `
        <div class="forum-thread" style="background:var(--white); border-radius:20px; padding:2rem; margin-bottom:1.5rem; border:1px solid rgba(128,128,128,0.15); box-shadow:0 4px 15px rgba(0,0,0,0.03);">
            <div style="display:flex; justify-content:space-between; margin-bottom:1rem; align-items:flex-start;">
                <div>
                     <h3 style="color:var(--primary-navy); margin:0 0 0.5rem; font-size:1.3rem; font-weight:800;">${post.title}</h3>
                     <span style="font-size:0.8rem; color:var(--text-gray);">Por <strong>${post.author}</strong> • ${post.date}</span>
                </div>
                <span class="page-badge" style="background:#f0f7f4; color:var(--mint-teal); text-transform:uppercase; font-size:0.7rem;">Discussão</span>
            </div>
            <p style="color:var(--text-gray); line-height:1.6; margin-bottom:1.5rem; font-size:1rem;">${post.body}</p>
            
            <div style="background:#f9f9f9; border-radius:15px; padding:1.2rem; margin-bottom:1.5rem;">
                ${post.replies.length > 0 ? post.replies.map(r => `
                    <div style="border-bottom:1px solid rgba(128,128,128,0.15); padding:1rem 0; last-child:border-none;">
                        <span style="font-size:0.8rem; display:block; color:var(--text-gray); margin-bottom:0.4rem;"><strong>${r.author}</strong> disse:</span>
                        <p style="margin:0; font-size:0.95rem; color:#444;">${r.body}</p>
                    </div>
                `).join('') : '<p style="color:var(--text-gray); font-style:italic; font-size:0.9rem; margin:0;">Nenhuma resposta ainda.</p>'}
            </div>

            ${session ? `
                <div style="display:flex; gap:0.8rem;">
                    <input type="text" id="reply-to-${post.id}" placeholder="Escreva uma resposta..." style="flex:1; border:1px solid rgba(128,128,128,0.2); border-radius:10px; padding:0.8rem 1.2rem; outline:none; font-size:0.9rem;">
                    <button onclick="submitForumReply('${post.id}')" style="background:var(--primary-navy); color:white; border:none; padding:10px 20px; border-radius:10px; font-weight:bold; cursor:pointer;">Enviar</button>
                </div>
            ` : `<p style="font-size:0.8rem; color:var(--text-gray); text-align:center;">Faça login para participar da conversa.</p>`}
        </div>
    `).reverse().join('');

    c.innerHTML = `
    <div class="page-dark-hero">
        <span class="page-badge" style="background:#FACD5F; color:#2C2C33;">Comunidade</span>
        <h1>Fórum Humanitário AlterECO</h1>
        <p>Espaço colaborativo para troca de saberes éticos e tecnológicos.</p>
    </div>

    <div class="content-white-section" style="background:var(--bg-light); padding:4rem 0;">
        <div style="max-width:800px; margin:0 auto; padding:0 1.5rem;">
            
            ${session ? `
                <div style="background:var(--white); border-radius:25px; padding:2rem; margin-bottom:3rem; border:2px dashed var(--mint-teal); text-align:center;">
                    <h2 style="color:var(--primary-navy); font-size:1.4rem; margin-bottom:1.5rem;">Deseja iniciar um debate, ${session.name.split(' ')[0]}?</h2>
                    <div style="display:flex; flex-direction:column; gap:1rem; text-align:left;">
                        <input type="text" id="new-forum-title" placeholder="Título da discussão" style="width:100%; border:1px solid rgba(128,128,128,0.2); border-radius:10px; padding:1rem; font-weight:700;">
                        <textarea id="new-forum-body" placeholder="O que você quer compartilhar ou perguntar?" style="width:100%; height:100px; border:1px solid rgba(128,128,128,0.2); border-radius:10px; padding:1rem; font-family:inherit; resize:none;"></textarea>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:0.8rem; color:var(--text-gray);"><i data-lucide="info" style="width:14px; vertical-align:middle;"></i> Novos tópicos passam por moderação.</span>
                            <button onclick="submitForumTopic()" style="background:var(--accent-orange); color:white; border:none; padding:12px 30px; border-radius:12px; font-weight:bold; cursor:pointer; font-size:1.1rem;">Publicar Tópico</button>
                        </div>
                    </div>
                </div>
            ` : `
                <div style="background:#deebf7; padding:2rem; border-radius:20px; text-align:center; margin-bottom:3rem; border:1px solid var(--primary-navy);">
                    <h2 style="color:var(--primary-navy); margin-bottom:1rem;">Entre na conversa!</h2>
                    <p style="color:#2C2C33; margin-bottom:1.5rem;">Faça login como curador(a) ou admin para postar no fórum.</p>
                    <button onclick="renderAdminDashboard()" style="background:var(--primary-navy); color:white; border:none; padding:12px 24px; border-radius:10px; font-weight:bold; cursor:pointer;">Fazer Login</button>
                </div>
            `}

            <div id="forum-threads-list">
                ${activePosts.length > 0 ? threadsHTML : '<p style="text-align:center; color:var(--text-gray); padding:4rem;">Ainda não há tópicos aprovados. Seja o primeiro a postar!</p>'}
            </div>
        </div>
    </div>`;
    if (window.lucide) window.lucide.createIcons();
    window.scrollTo(0,0);
}

window.submitForumTopic = function() {
    const session = JSON.parse(sessionStorage.getItem('altereco_session'));
    const title = document.getElementById('new-forum-title').value.trim();
    const body = document.getElementById('new-forum-body').value.trim();
    if(!title || !body) return alert("Por favor, preencha o título e o corpo da mensagem.");

    const posts = JSON.parse(localStorage.getItem('altereco_forum_posts'));
    const newPost = {
        id: Date.now().toString(),
        author: session.name,
        role: session.role,
        title,
        body,
        date: new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'}).replace('.',''),
        status: 'pending', // Requer moderação
        replies: []
    };
    
    posts.push(newPost);
    localStorage.setItem('altereco_forum_posts', JSON.stringify(posts));
    alert("✅ Seu tópico foi enviado com sucesso e está aguardando a moderação da Débora (Adm).");
    renderForumPage(document.getElementById('content-area'));
};

window.submitForumReply = function(postId) {
    const session = JSON.parse(sessionStorage.getItem('altereco_session'));
    const replyInput = document.getElementById('reply-to-' + postId);
    const body = replyInput.value.trim();
    if(!body) return;

    let posts = JSON.parse(localStorage.getItem('altereco_forum_posts'));
    const postIndex = posts.findIndex(p => p.id === postId);
    if(postIndex > -1){
        posts[postIndex].replies.push({
            author: session.name,
            body,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('altereco_forum_posts', JSON.stringify(posts));
        renderForumPage(document.getElementById('content-area'));
    }
};

/* ══════════════════════════════════════════════════════
   CURADORIA
══════════════════════════════════════════════════════ */

function renderCuradoriaPage(c) {
    const curadores = CURADORES_DATA;

    const htmlCards = curadores.map(cur => `
        <div style="background:#e8ecee; border-radius:15px; padding:2rem; display:flex; gap:2rem; align-items:flex-start; position:relative; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding-bottom:5rem;">
            <div style="width:140px; height:140px; border-radius:50%; overflow:hidden; flex-shrink:0; background:#ddd;">
                <img src="${cur.image}" alt="${cur.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='assets/debora.jpg'; this.style.opacity='0.5';">
            </div>
            <div style="border-left:3px solid var(--accent-yellow); padding-left:1.5rem; flex:1;">
                <h2 style="color:var(--text-gray); margin-bottom:1rem; font-size:1.6rem; font-weight:700;">${cur.name}</h2>
                <p style="color:var(--text-gray); line-height:1.6; font-size:1rem; margin-bottom:2rem;">${cur.desc}</p>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                    <span style="background:#5a6268; color:white; padding:6px 16px; border-radius:20px; font-size:0.85rem; font-weight:600; border:2px solid #edc200;">${cur.tags[0]}</span>
                    ${cur.tags.slice(1).map(tag => `<span style="background:var(--mint-teal); color:#005555; padding:6px 16px; border-radius:20px; font-size:0.85rem;">${tag}</span>`).join('')}
                </div>
            </div>
            <a href="#curador-${cur.id || 'missing'}" class="dark-btn" style="position:absolute; bottom:1.5rem; right:1.5rem; border-radius:8px; padding:10px 20px; text-decoration:none; display:flex; align-items:center; gap:8px;">Acessar Perfil <i data-lucide="arrow-right" style="width:18px;"></i></a>
        </div>
    `).join('');

    c.innerHTML = `
    <div class="page-dark-hero">
        <span class="page-badge">Equipe</span>
        <h1>Conheça Nossos Curadores Científicos</h1>
        <p>Especialistas responsáveis pela validação do conteúdo humanitário.</p>
    </div>
    <div class="content-white-section" style="background:var(--bg-light); padding:4rem 0;">
        <div style="max-width:800px; margin:0 auto; display:flex; flex-direction:column; gap:2rem;">
            ${htmlCards}
        </div>
    </div>`;
    if (window.lucide) window.lucide.createIcons();
}

function renderCuradorProfilePage(id, container) {
    const curadores = CURADORES_DATA;

    const cur = curadores.find(c => c.id === id);
    if (!cur) {
        container.innerHTML = "<h2>Curador não encontrado.</h2>";
        return;
    }

    const htmlCategories = cur.categories ? cur.categories.map(cat => `
        <div class="profile-category-title" style="background:#eee; padding:1.5rem; text-align:center; margin-top:3rem; border-top:4px solid var(--accent-yellow);">
            <h2 style="color:var(--primary-navy); margin:0; font-size:2rem; font-weight:800;">${cat.title}</h2>
        </div>
        <div style="padding: 2rem 1rem;">
            ${cat.items.map(item => `
                <div class="project-card" style="background:#e8ecee; border-radius:20px; overflow:hidden; margin-bottom:2rem; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
                    ${item.bannerText ? `
                        <div style="background:var(--primary-navy); padding:4rem 2rem; text-align:center; color:white;">
                            <h2 style="font-size:4rem; font-weight:900; margin:0; line-height:1;">${item.bannerText.split('\n')[0]}</h2>
                            <p style="font-size:1.5rem; margin-top:1rem; opacity:0.9;">${item.bannerText.split('\n')[1]}</p>
                            <p style="font-size:1.2rem; font-style:italic; opacity:0.8;">${item.bannerText.split('\n')[2]}</p>
                        </div>
                    ` : `
                        <div style="height:250px; position:relative; overflow:hidden;">
                            <img src="${item.image}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;">
                        </div>
                    `}
                    <div style="padding:2rem;">
                        <h3 style="font-size:1.6rem; color:var(--text-gray); font-weight:800; margin-bottom:1.5rem;">${item.title}</h3>
                        <div style="border-left:4px solid var(--accent-yellow); padding-left:1.5rem; margin-bottom:2rem;">
                            <p style="color:var(--text-gray); line-height:1.6; font-size:1.05rem;">${item.desc}</p>
                        </div>
                        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:2rem;">
                            <span style="background:#5a6268; color:white; padding:8px 18px; border-radius:20px; font-size:0.9rem; font-weight:700; border:2px solid #edc200;">${item.tags[0]}</span>
                            ${item.tags.slice(1).map(tag => `<span style="background:var(--mint-teal); color:#005555; padding:8px 18px; border-radius:20px; font-size:0.9rem;">${tag}</span>`).join('')}
                        </div>
                        <div style="display:flex; justify-content:flex-end;">
                            <a href="${item.link}" class="dark-btn" style="border-radius:10px; padding:12px 24px; font-weight:700; display:flex; align-items:center; gap:8px;">Ver mais <i data-lucide="arrow-right" style="width:18px;"></i></a>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('') : '';

    container.innerHTML = `
        <div class="page-dark-hero" style="padding:2rem 1.5rem; display:flex; align-items:center; gap:1rem;">
             <button onclick="window.history.back()" style="background:none; border:none; color:white; cursor:pointer;"><i data-lucide="arrow-left"></i></button>
             <h1 style="font-size:1.5rem; margin:0; font-weight:800;">${cur.name}</h1>
        </div>
        
        <div style="background:var(--white); padding:3rem 2rem;">
            <div style="text-align:center; margin-bottom:2rem;">
                <div style="width:180px; height:180px; border-radius:50%; overflow:hidden; margin:0 auto 1.5rem; border:6px solid #f4f7f9; background:#ddd;">
                    <img src="${cur.image}" alt="${cur.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='assets/debora.jpg'; this.style.opacity='0.5';">
                </div>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; margin-bottom:1.5rem;">
                    <span style="background:#5a6268; color:white; padding:8px 18px; border-radius:20px; font-size:0.9rem; font-weight:700; border:2px solid #edc200;">${cur.tags[0]}</span>
                    ${cur.tags.slice(1).map(tag => `<span style="background:var(--mint-teal); color:#005555; padding:8px 18px; border-radius:20px; font-size:0.9rem;">${tag}</span>`).join('')}
                </div>
                <p style="color:var(--text-gray); line-height:1.8; text-align:left; font-size:1.1rem; max-width:800px; margin:0 auto;">${cur.fullBio || cur.desc}</p>
            </div>
            
            ${htmlCategories}
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();
}

/* ─── Misc ──────────────────────────────────────────── */

function handleTagFilter(tag, btn) {
    document.querySelectorAll('[data-tag]').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

/* ------------------------------------------------------
   THEME TOGGLE LOGIC (CLARO / ESCURO)
   Now uses Material Icons span (textContent) instead of Lucide
------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Check saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = 'light_mode';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.body.removeAttribute('data-theme');
                if (themeIcon) themeIcon.textContent = 'dark_mode';
                localStorage.setItem('theme', 'light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                if (themeIcon) themeIcon.textContent = 'light_mode';
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});
