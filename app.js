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
        desc: "Idealizadora e Curadora da Plataforma AlterECO. Professora do curso de Desenho Industrial da Universidade Federal de Santa Maria (UFSM), atua nas áreas de design centrado no usuário, game design, experiência do usuário (UX), arte digital, história, teoria e crítica de arte.",
        tags: ["Design de Interfaces", "Curadoria", "Jogos", "Tecnologias", "AR", "VR"],
        fullBio: "Idealizadora e Curadora da Plataforma AlterECO. Professora do curso de Design Desenho Industrial da Universidade Federal de Santa Maria (UFSM), atua nas áreas de design centrado no usuário, game design, experiência do usuário (UX), arte digital, história, teoria e crítica de arte. Com formação interdisciplinar, tem desenvolvido projetos voltados à ética e inovação no campo educacional e científico. Desde 2015, coordena iniciativas relacionadas aos métodos substitutivos ao uso de animais no ensino e na pesquisa, com destaque para o desenvolvimento do jogo Labchange e a idealização da plataforma AlterECO, que propõe soluções acessíveis, críticas e colaborativas para transformar a educação e a ciência no Brasil.",
        categories: [
            {
                title: "Jogos",
                items: [
                    {
                        title: "Labchange",
                        icon: "rabbit",
                        mediaClass: "labchange",
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
                        icon: "trees",
                        mediaClass: "florestar",
                        desc: "Aplicativo em realidade aumentada que utiliza imagens do satélite do INPE e insere virtualmente alguns dos animais ameaçados pelas queimadas na Amazônia. A proposta consiste em um quebra-cabeças, exposto em uma mesa e um aplicativo que lê as imagens e projeta sobre elas um modelo 3D.",
                        tags: ["Florestar", "AR", "Arte Digital", "Materiais Didáticos"],
                        link: "#"
                    },
                    {
                        title: "Be_FREE",
                        icon: "bird",
                        mediaClass: "befree",
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
    const nextHash = `#${pageId}`;
    if (window.location.hash !== nextHash) {
        window.location.hash = pageId;
    } else {
        renderPage(pageId);
    }
}

function syncNavigationState(pageId) {
    const activePage = pageId.startsWith('curador-') ? 'curadoria' : pageId;
    document.querySelectorAll('.nav-btn, .drawer-link').forEach((b) => {
        const isActive = b.dataset.page === activePage;
        b.classList.toggle('active', isActive);
        if (isActive) b.setAttribute('aria-current', 'page');
        else b.removeAttribute('aria-current');
    });
}

function updateProfileHeaderContext(pageId) {
    const header = document.getElementById('main-header');
    const headerLeft = document.querySelector('.header-left');
    if (!header || !headerLeft) return;

    let title = document.getElementById('profile-page-title');
    if (!title) {
        title = document.createElement('div');
        title.id = 'profile-page-title';
        title.className = 'profile-page-title';
        headerLeft.appendChild(title);
    }

    const isProfile = pageId.startsWith('curador-');
    header.classList.toggle('curator-profile-active', isProfile);

    if (isProfile) {
        const id = pageId.replace('curador-', '');
        const curator = CURADORES_DATA.find((item) => item.id === id);
        title.textContent = curator?.name || 'Perfil';
    } else {
        title.textContent = '';
    }
}

window.addEventListener('hashchange', () => {
    const pageId = window.location.hash.replace('#', '') || 'home';
    renderPage(pageId);
});

function renderPage(pageId) {
    syncNavigationState(pageId);
    updateProfileHeaderContext(pageId);
    const contentArea = document.getElementById('content-area');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const floatingEco = document.querySelector('.fixed-icons');
    if (!contentArea) return;

    // O atalho flutuante some dentro da própria página da ECO para não duplicar a interface.
    if (floatingEco) {
        floatingEco.classList.toggle('fixed-icons--hidden', pageId === 'ai-eco');
    }

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
    const allMetodos = [...METODOS, ...dynamic.map(d => ({ name: d.title, description: d.description, url: d.url }))];
    const metodosHTML = allMetodos.map(m => `
    <div class="metodo-card">
        <h3 class="metodo-title">${m.name}</h3>
        ${m.oecd ? `<p class="metodo-oecd">${m.oecd}</p>` : ''}
        <p class="metodo-desc">${m.description}</p>
        ${m.howToUse ? `<p class="metodo-field"><strong>${m.howToUse}</strong></p>` : ''}
        ${m.purpose ? `<p class="metodo-field">${m.purpose}</p>` : ''}
        ${m.source ? `<p class="metodo-source">${m.source}</p>` : ''}
        <div class="metodo-actions">
            <a href="${m.url}" target="_blank" rel="noopener noreferrer" class="metodo-access-btn">Acessar <i data-lucide="arrow-right" aria-hidden="true"></i></a>
            <button onclick="shareCard(this)" title="Compartilhar" aria-label="Compartilhar este método" class="metodo-share-btn"><i data-lucide="share-2" aria-hidden="true"></i></button>
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

    const dynamic = window.getDynamicPostsForArea ? getDynamicPostsForArea('materiais').map(d => ({ name: d.title, description: d.description, url: d.url, tags: d.tags })) : [];
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
            image: d.image || '',
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
            <div class="pub-book-card ${item.image ? '' : 'pub-book-card--no-image'}">
                ${item.image ? `
                <div class="pub-book-img-wrapper">
                    <img src="${item.image}" alt="" class="pub-book-img" loading="lazy" onerror="this.parentElement.remove(); this.closest('.pub-book-card')?.classList.add('pub-book-card--no-image');">
                </div>` : ''}
                <div class="pub-book-content">
                    <h3 class="pub-book-title">${item.title}</h3>
                    <div class="pub-book-author">${item.author || 'Autor Desconhecido'}</div>
                    <p class="pub-book-desc">${item.desc || 'Acesse a fonte original para consultar os detalhes desta publicação.'}</p>
                    
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
    const dynamic = window.getDynamicPostsForArea ? getDynamicPostsForArea('bases').map(d => ({ name: d.title, description: d.description, url: d.url })) : [];
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

    const dynamic = window.getDynamicPostsForArea ? getDynamicPostsForArea('legislacao').map(d => ({ name: d.title, description: d.description, url: d.url })) : [];
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

function curatorTagsHTML(tags = []) {
    if (!tags.length) return '';
    return `
        <div class="curator-tags" aria-label="Áreas de atuação">
            ${tags.map((tag, index) => `
                <span class="curator-tag ${index === 0 ? 'curator-tag--primary' : ''}">${tag}</span>
            `).join('')}
        </div>
    `;
}

function renderCuradoriaPage(c) {
    const htmlCards = CURADORES_DATA.map(cur => `
        <article class="curator-card">
            <div class="curator-card-photo">
                <img
                    src="${cur.image}"
                    alt="Retrato de ${cur.name}"
                    loading="lazy"
                    onerror="this.src='assets/debora.jpg'; this.style.opacity='0.45';"
                >
            </div>

            <div class="curator-card-content">
                <h2>${cur.name}</h2>
                <p>${cur.desc}</p>
                ${curatorTagsHTML(cur.tags)}

                <button
                    type="button"
                    class="curator-profile-link"
                    data-page="curador-${cur.id}"
                    aria-label="Acessar perfil de ${cur.name}"
                >
                    <span>Acessar Perfil</span>
                    <i data-lucide="arrow-right" aria-hidden="true"></i>
                </button>
            </div>
        </article>
    `).join('');

    c.innerHTML = `
        <div class="page-dark-hero">
            <span class="page-badge">Equipe</span>
            <h1>Conheça Nossos Curadores Científicos</h1>
            <p>Especialistas responsáveis pela validação do conteúdo humanitário.</p>
        </div>

        <section class="curators-list-section" aria-label="Curadores AlterECO">
            <div class="curators-list">
                ${htmlCards}
            </div>
        </section>
    `;

    if (window.lucide) window.lucide.createIcons();
}

function curatorProjectMediaHTML(item) {
    if (item.bannerText) {
        const lines = item.bannerText.split('\n');
        return `
            <div class="curator-project-media curator-project-media--${item.mediaClass || 'default'} curator-project-banner">
                <strong>${lines[0] || item.title}</strong>
                ${lines[1] ? `<span>${lines[1]}</span>` : ''}
                ${lines[2] ? `<em>${lines[2]}</em>` : ''}
            </div>
        `;
    }

    if (item.image) {
        return `
            <div class="curator-project-media">
                <img
                    src="${item.image}"
                    alt=""
                    loading="lazy"
                    onerror="this.parentElement.classList.add('curator-project-media--fallback'); this.remove();"
                >
                <i data-lucide="${item.icon || 'sparkles'}" aria-hidden="true"></i>
            </div>
        `;
    }

    return `
        <div class="curator-project-media curator-project-media--${item.mediaClass || 'default'}">
            <i data-lucide="${item.icon || 'sparkles'}" aria-hidden="true"></i>
        </div>
    `;
}

function renderCuradorProfilePage(id, container) {
    const cur = CURADORES_DATA.find(c => c.id === id);

    if (!cur) {
        container.innerHTML = `
            <section class="curator-profile-shell">
                <div class="curator-profile-empty">
                    <h1>Curador não encontrado.</h1>
                    <button class="curator-back-link" data-page="curadoria">
                        <i data-lucide="arrow-left" aria-hidden="true"></i>
                        Voltar para Curadoria
                    </button>
                </div>
            </section>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    const categoriesHTML = (cur.categories || []).map(cat => `
        <section class="curator-category" aria-labelledby="category-${cur.id}-${cat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">
            <div class="curator-category-heading">
                <h2 id="category-${cur.id}-${cat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">${cat.title}</h2>
            </div>

            <div class="curator-projects-grid">
                ${cat.items.map(item => `
                    <article class="curator-project-card">
                        ${curatorProjectMediaHTML(item)}
                        <div class="curator-project-body">
                            <h3>${item.title}</h3>
                            <p>${item.desc}</p>
                            ${curatorTagsHTML(item.tags || [])}
                            ${item.link && item.link !== '#' ? `
                                <a class="curator-project-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
                                    Ver mais
                                    <i data-lucide="arrow-up-right" aria-hidden="true"></i>
                                </a>
                            ` : ''}
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>
    `).join('');

    container.innerHTML = `
        <div class="curator-profile-page">
            <div class="curator-profile-actions">
                <button type="button" class="curator-back-link" data-page="curadoria">
                    <i data-lucide="arrow-left" aria-hidden="true"></i>
                    <span>Curadoria</span>
                </button>
            </div>

            <section class="curator-profile-shell" aria-labelledby="curator-profile-name">
                <article class="curator-profile-card">
                    <div class="curator-profile-photo">
                        <img
                            src="${cur.image}"
                            alt="Retrato de ${cur.name}"
                            onerror="this.src='assets/debora.jpg'; this.style.opacity='0.45';"
                        >
                    </div>

                    <div class="curator-profile-main">
                        <h1 id="curator-profile-name" class="curator-profile-name">${cur.name}</h1>
                        ${curatorTagsHTML(cur.tags)}
                        <p class="curator-profile-bio">${cur.fullBio || cur.desc}</p>
                    </div>
                </article>
            </section>

            ${categoriesHTML ? `
                <div class="curator-profile-categories">
                    ${categoriesHTML}
                </div>
            ` : `
                <section class="curator-profile-coming-soon">
                    <i data-lucide="sparkles" aria-hidden="true"></i>
                    <h2>Perfil em expansão</h2>
                    <p>Projetos e materiais deste curador serão adicionados progressivamente à plataforma.</p>
                </section>
            `}
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
