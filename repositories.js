/**
 * AlterECO Central Repository - Dados completos conforme os prints
 * Author: Debora Gasparetto / UFSM / CNPq
 */

/* ═══════════════════════════════════════════════
   MÉTODOS SUBSTITUTIVOS
═══════════════════════════════════════════════ */
var METODOS = [
    {
        name: "Irritação e corrosão ocular",
        oecd: "OECD TG 494 (Vitrigel) e TG 496",
        description: "Modelos in vitro que simulam olho humano para avaliar irritação e dano.",
        howToUse: "Exposição à substância em membrana ocular reconstituída e avaliação de viabilidade celular.",
        purpose: "Evita testes dolorosos em coelhos.",
        source: "Fonte oficial: RN 56/2022",
        url: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea"
    },
    {
        name: "Fotorreatividade / Fototoxicidade",
        oecd: "OECD TG 432",
        description: "Ensaio para identificar se substâncias em contato com luz UV causam danos celulares.",
        howToUse: "Modo prático: cultura celular exposta à luz e ao composto; depois avalia viabilidade.",
        purpose: "Finalidade: substituir testes em animais expostos à luz e à substância.",
        source: "Referência na RN 56/2022",
        url: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea"
    },
    {
        name: "Atividade Estrogênica",
        oecd: "OECD TG 456",
        description: "Células H295R testam se substâncias influenciam produção hormonal por esteroides.",
        howToUse: "Uso: cultivar células humanas com o composto e medir hormônios produzidos.",
        purpose: "Quando aplicar: segurança endócrina, sem uso de animais.",
        source: "Referência: RN 56/2022",
        url: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea"
    },
    {
        name: "Atividade Androgênica",
        oecd: "OECD TG 458",
        description: "Avalia interação com receptor androgênico usando linha celular humana.",
        howToUse: "Como utilizar: exposição de células à substância, análise de sinal via reporter gene.",
        purpose: "Objetivo: substituir testes hormonais masculinos em animais.",
        source: "Base legal: RN 56/2022",
        url: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea"
    },
    {
        name: "Mutagenicidade in vitro",
        oecd: "OECD TG 471, 473, 476 e 490",
        description: "Ensaios clássicos como Ames (471) e aberrações cromossômicas ou mutações em células.",
        howToUse: "Aplicação: testar se substâncias causam mutação ou dano genético.",
        purpose: "Visão cidadã: segurança sem teste em animais vivos.",
        source: "Detalhes: RN 56/2022",
        url: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea"
    }
];

/* ═══════════════════════════════════════════════
   BASES DE DADOS
═══════════════════════════════════════════════ */
var BASES_DADOS = {
    nacional: [
        {
            id: "concea",
            name: "CONCEA/MCTI",
            logo: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea/++theme++padrao-mcti/img/logo.png",
            description: "O CONCEA (Conselho Nacional de Controle de Experimentação Animal) é o órgão ligado ao Ministério da Ciência, Tecnologia e Inovação (MCTI) responsável por normatizar, avaliar e fiscalizar o uso de animais em atividades de ensino e pesquisa científica no Brasil. Atua promovendo a substituição, redução e refinamento do uso de animais, por meio da regulamentação e do incentivo ao desenvolvimento de métodos alternativos.",
            url: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea",
            tag: "Brasil"
        },
        {
            id: "renama",
            name: "RENAMA – Rede Nacional de Métodos Alternativos",
            logo: "",
            description: "A RENAMA é uma rede nacional voltada à pesquisa, desenvolvimento, validação e disseminação de métodos alternativos ao uso de animais em ensino, pesquisa e testes. Articula laboratórios e centros de referência para fortalecer a ciência ética no Brasil.",
            url: "https://www.gov.br/mcti/pt-br/rede-federal-de-biotecnologia/renama",
            tag: "Brasil"
        }
    ],
    internacional: [
        {
            id: "interniche",
            name: "InterNICHE",
            logo: "https://via.placeholder.com/120x40?text=InterNICHE",
            description: "A International Network for Humane Education (InterNICHE) é a maior rede global focada na educação humanitária, biológica e médica. Eles mantêm bancos de dados massivos de softwares de simulação, vídeos, manequins e outras ferramentas substitutivas. Promovem a substituição integral de experimentos prejudiciais aos animais no ensino acadêmico em todo o mundo, com forte presença na Europa, Ásia e América Latina.",
            url: "http://www.interniche.org/",
            tag: "Global / Europa"
        },
        {
            id: "altbib",
            name: "ALTBIB (Alternatives to Animal Testing)",
            logo: "https://via.placeholder.com/120x40?text=ALTBIB",
            description: "Portal mantido pela National Library of Medicine (NLM/EUA), focado em literatura biomédica pertinente a alternativas ao uso de animais em pesquisa. Fornece acesso direto ao PubMed/MEDLINE para recuperar referências essenciais na toxicolologia, métodos in vitro, in silico e modelos éticos.",
            url: "https://toxnet.nlm.nih.gov/altbib.html",
            tag: "EUA / América do Norte"
        },
        {
            id: "eurl-ecvam",
            name: "EURL ECVAM",
            logo: "https://via.placeholder.com/120x40?text=EURL+ECVAM",
            description: "O Laboratório de Referência da União Europeia para Alternativas à Experimentação Animal (EURL ECVAM) é o principal órgão europeu para validação de métodos in vitro. Seu banco de dados, DB-ALM, consolida milhares de protocolos validados para testes toxicológicos sem uso de animais.",
            url: "https://joint-research-centre.ec.europa.eu/eu-reference-laboratory-alternatives-animal-testing-eurl-ecvam_en",
            tag: "União Europeia"
        },
        {
            id: "norina",
            name: "NORINA",
            logo: "https://via.placeholder.com/120x40?text=NORINA",
            description: "A Norwegian Inventory of Alternatives (NORINA) é um banco de dados abrangente criado na Noruega, contendo milhares de produtos audiovisuais, simuladores de computador, modelos 3D físicos e manequins projetados para substituir o uso de animais dissecados no ensino em todos os níveis escolares e universitários.",
            url: "https://norecopa.no/norina",
            tag: "Noruega / Europa"
        },
        {
            id: "caat",
            name: "CAAT (Johns Hopkins Center for Alternatives)",
            logo: "https://via.placeholder.com/120x40?text=CAAT",
            description: "O Center for Alternatives to Animal Testing da Johns Hopkins University atua mundialmente, incluindo a versão europeia (CAAT-Europe), focado na promoção do conceito dos 3Rs e financiamento de pesquisas pioneiras para novas abordagens metodológicas (NAMs) na biologia de sistemas.",
            url: "https://caat.jhsph.edu/",
            tag: "EUA / Europa"
        },
        {
            id: "jsaae",
            name: "JSAAE",
            logo: "https://via.placeholder.com/120x40?text=JSAAE",
            description: "A Japanese Society for Alternatives to Animal Experiments é uma das maiores referências na Ásia. Facilita o desenvolvimento e validação de alternativas em testes de toxicidade farmacêutica e cosmética em alinhamento com as normas do JaCVAM.",
            url: "http://www.jsaae.jp/",
            tag: "Japão / Ásia"
        },
        {
            id: "ksaae",
            name: "KoCVAM / KSAAE",
            logo: "https://via.placeholder.com/120x40?text=KoCVAM",
            description: "A Sociedade Coreana para Alternativas em Conjunto com o Centro Coreano de Validação (KoCVAM) representa o hub na Coreia do Sul dedicado ao rápido desenvolvimento da ciência in vitro e cosméticos sem crueldade no mercado asiático.",
            url: "https://www.nifds.go.kr/kocvam/",
            tag: "Coreia do Sul / Ásia"
        },
        {
            id: "afsae",
            name: "AfSAE",
            logo: "https://via.placeholder.com/120x40?text=AfSAE",
            description: "A African Society for Alternatives to Animal Experimentation é a instituição pioneira na África, colaborando para estabelecer os 3Rs em instituições do continente e fomentar redes de pesquisadores pan-africanos voltados a métodos humanitários e inovação laboratorial.",
            url: "https://panafrican-csa.org/",
            tag: "África Continental"
        },
        {
            id: "afsa-aus",
            name: "AFSA (Animal Free Science Advocacy)",
            logo: "https://via.placeholder.com/120x40?text=AFSA",
            description: "Baseada na Austrália, a AFSA (antiga Humane Research Australia) atua focada em advocacy e suporte educacional na Oceania para demonstrar a ineficácia e os problemas éticos dos testes em animais, compilando um banco de estudos e publicações científicas australianas para alternativas biomédicas.",
            url: "https://www.animalfreescienceadvocacy.org.au/",
            tag: "Austrália / Oceania"
        },
        {
            id: "premasul",
            name: "PREMASUL",
            logo: "https://via.placeholder.com/80x40?text=PReMASUL",
            description: "Iniciativa voltada à capacitação e promoção de métodos alternativos ao uso de animais em ensino, pesquisa e testes. A PREMASUL visa estimular a adoção dos 3Rs no MERCOSUL, alinhando-se às exigências éticas e ao mercado internacional.",
            url: "https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/premasul",
            tag: "América do Sul (MERCOSUL)"
        },
        {
            id: "sciencebank",
            name: "THE SCIENCE BANK",
            logo: "https://thesciencebank.org/wp-content/uploads/2021/01/science-bank-logo.png",
            description: "Mantida pela Animalearn, fornece mais de 650 recursos (softwares, modelos anatômicos, simulações) para estudantes e professores da biologia e medicina substituírem dissecações físicas em todo o currículo escolar.",
            url: "https://thesciencebank.org/",
            tag: "EUA / Internacional"
        },
        {
            id: "replacinganimalresearch",
            name: "Replacing Animal Research",
            logo: "https://via.placeholder.com/120x40?text=RAR",
            description: "Plataforma britânica que congrega cientistas no desenvolvimento de organoides e métodos computacionais, focando num roadmap político para abandonar testes de toxicidade in vivo no Reino Unido.",
            url: "https://replacinganimalresearch.org.uk/",
            tag: "Reino Unido"
        },
        {
            id: "altex",
            name: "ALTEX Proceedings",
            logo: "https://via.placeholder.com/80x40?text=ALTEX",
            description: "Uma das principais revistas científicas sobre os 3Rs em nível mundial. Publicada na Suíça, engloba bioética e ciência baseada em mecanismos in vitro.",
            url: "https://proceedings.altex.org/",
            tag: "Suíça / Global"
        },
        {
            id: "lushprize",
            name: "Lush Prize",
            logo: "https://via.placeholder.com/120x40?text=LUSH+PRIZE",
            description: "O maior fundo global de prêmios focado exclusivamente no fomento da ciência sem animais, apoiando jovens pesquisadores em cinco continentes na transição para metodologias humanitárias.",
            url: "https://lushprize.org",
            tag: "Global"
        }
    ]
};

/* ═══════════════════════════════════════════════
   LEGISLAÇÃO
═══════════════════════════════════════════════ */
var LEGISLACAO_INTRO = "Nesta seção, você encontrará compilação das principais leis, resoluções e diretrizes brasileiras que regulamentam o uso de animais em ensino e pesquisa, com foco na promoção dos princípios dos 3Rs (substituição, redução e refinamento). O conteúdo inclui normativas do CONCEA, resoluções do CFMV, orientações do RENAMA e outros marcos legais que orientam instituições públicas e docentes em práticas éticas e alternativas ao uso animal.";

var LEGISLACAO = {
    brasil: [
        {
            id: "arouca",
            name: "Lei nº 11.794/2008 (Lei Arouca)",
            description: "O uso de métodos alternativos ao emprego de animais é previsto na legislação brasileira. A Lei nº 11.794/2008, conhecida como Lei Arouca, determina que o uso de animais em atividades científicas só é permitido quando não houver métodos substitutivos validados disponíveis (BRASIL, 2008).",
            url: "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11794.htm"
        },
        {
            id: "rn56",
            name: "Resolução Normativa CONCEA nº 56, de 05.10.2022",
            description: "A RN 56/2022 do CONCEA reconhece oficialmente os métodos alternativos ao uso de animais em ensino e pesquisa no Brasil, tornando obrigatória a adoção dessas alternativas quando disponíveis e validadas.",
            url: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea"
        },
        {
            id: "compendio",
            name: "Compêndio 'Métodos alternativos ao uso de animais em pesquisas reconhecidos no Brasil'",
            description: "Com protocolos traduzidos e orientações detalhadas (set-2024). Publicação oficial do CONCEA com todos os métodos substitutivos reconhecidos, incluindo as diretrizes das OECD TG traduzidas para o português e adaptadas ao contexto regulatório brasileiro.",
            url: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea"
        },
        {
            id: "concea-contexto",
            name: "Página CONCEA sobre métodos alternativos: contexto regulamentar, prazo de adesão e penalidades por descumprimento",
            description: "Portal oficial com informações sobre o prazo de adaptação das instituições às normativas vigentes, critérios de fiscalização e penalidades administrativas aplicáveis em casos de não cumprimento da substituição obrigatória.",
            url: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea"
        },
        {
            id: "lei15182025",
            name: "Lei Nº 15.183, de 30 de julho de 2025",
            description: "A Lei nº 15.183, de 30 de julho de 2025, representa um avanço pioneiro na legislação brasileira ao vedar o uso de animais vertebrados vivos em testes para cosméticos, perfumes e produtos de higiene pessoal. Ela altera dispositivos da Lei Arouca (11.794/2008) e da Lei nº 6.360/1976, consolidando o compromisso nacional com métodos científicos que não envolvem sofrimento animal. A nova norma estabelece um prazo de até dois anos para que indústrias e instituições se adaptem às exigências, consolidando o princípio da substituição obrigatória, conforme previsto no regime dos 3Rs e na normativa do CONCEA.",
            url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15183.htm"
        }
    ],
    internacional: [
        {
            id: "eu-directive",
            name: "Diretiva 2010/63/EU",
            description: "Diretiva do Parlamento Europeu e do Conselho relativa à proteção dos animais utilizados para fins científicos. Estabelece normas mínimas para o bem-estar dos animais e promove o princípio dos 3Rs em toda a União Europeia.",
            url: "https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX%3A32010L0063"
        },
        {
            id: "animal-welfare-uk",
            name: "Animal Welfare Act 2006 (Reino Unido)",
            description: "Lei britânica que consolida e moderniza a legislação de bem-estar animal no Reino Unido, tornando ilegal causar dano desnecessário a qualquer animal e impondo obrigações de cuidado.",
            url: "https://www.legislation.gov.uk/ukpga/2006/45/contents"
        }
    ]
};

/* ═══════════════════════════════════════════════
   MATERIAIS DIDÁTICOS
═══════════════════════════════════════════════ */
var MATERIAIS = {
    universidades: [
        {
            name: "AiVets – Inteligência Artificial Veterinária",
            featured: true,
            featuredTitle: "Tecnologia de apoio ao estudo e à prática veterinária",
            description: "Plataforma brasileira de inteligência artificial especializada em Medicina Veterinária, voltada a estudantes e profissionais. Oferece apoio a raciocínio clínico, estudo, pesquisa científica conversacional e consulta a literatura veterinária. É uma tecnologia educacional e de apoio profissional; não é apresentada aqui como método substitutivo validado.",
            tags: ["Veterinária", "IA", "Pesquisa científica"],
            url: "https://aivets.com.br/",
            buttonLabel: "Acessar AiVets"
        },
        {
            name: "Synthea™ – Pacientes Sintéticos para Pesquisa em Saúde",
            featured: false,
            description: "Simulador de população de pacientes da MITRE que gera prontuários e dados clínicos sintéticos, realistas e fictícios. Pode ser utilizado em ensino, pesquisa, desenvolvimento e testes de sistemas em saúde sem expor dados pessoais de pacientes reais.",
            tags: ["Medicina", "Dados sintéticos", "Saúde Digital"],
            url: "https://synthea.mitre.org/",
            buttonLabel: "Acessar Synthea"
        },
        {
            name: "Froggipedia by Embibe",
            featured: false,
            description: "Aplicativo educacional de realidade aumentada que permite explorar o ciclo de vida, a anatomia e realizar uma dissecção virtual de sapos. Funciona como alternativa digital para atividades didáticas de anatomia que tradicionalmente podem envolver dissecção.",
            tags: ["Biologia", "RA", "3D", "Dissecção virtual"],
            url: "https://play.google.com/store/apps/details?id=com.embibe.froggipedia",
            buttonLabel: "Abrir no Google Play",
            image: "https://valianttechnosoft.com/wp-content/uploads/2020/02/ezgif-7-e517b359b04c.jpg"
        },
        {
            name: "Human Organs-on-Chips – Wyss Institute",
            description: "Dispositivos microfluídicos revestidos com células humanas vivas que reproduzem aspectos da estrutura e da função de órgãos humanos para modelagem de doenças, desenvolvimento de fármacos e pesquisa human-relevant.",
            tags: ["Fisiologia", "Organ-on-chip", "Microfluídica", "NAMs"],
            url: "https://wyss.harvard.edu/technology/human-organs-on-chips/",
            buttonLabel: "Conhecer tecnologia",
            image: "https://wyss-prod.imgix.net/app/uploads/2017/03/02152851/Human-Organs-on-Chips.jpg?auto=format%2Ccompress&crop=faces%2Centropy&fit=crop&q=50&s=8a3d0132e7e6d2eb5f454acda79f5f69&w=800"
        },
        {
            name: "EpiDerm™ – Epiderme Humana Reconstruída",
            description: "Modelo 3D de epiderme humana reconstruída da MatTek/Sartorius utilizado em aplicações in vitro de toxicologia e avaliação de segurança. Possui ensaios aceitos em diretrizes OECD, incluindo irritação e corrosão cutânea.",
            tags: ["Toxicologia", "Pele 3D", "OECD", "In vitro"],
            url: "https://www.mattek.com/mattek-product/epiderm/",
            buttonLabel: "Conhecer EpiDerm"
        },
        {
            name: "SimMan® 3G PLUS – Simulação Clínica",
            description: "Simulador de paciente de alta fidelidade da Laerdal para treinamento imersivo em medicina de emergência e cuidado clínico. Permite praticar tomada de decisão, comunicação em equipe e procedimentos em cenários simulados.",
            tags: ["Medicina", "Simulação clínica", "Alta fidelidade"],
            url: "https://laerdal.com/us/SimMan3G",
            buttonLabel: "Conhecer simulador",
            image: "https://laerdal.com/cdn-cgi/image/width%3D1200%2Cheight%3D630%2Cfit%3Dcrop%2Cquality%3D75%2Cformat%3Dauto/https%3A/laerdal.com/cdn-493721/globalassets/images--blocks/products/training-products/simman-3g-plus/simman-3g-plus-listing-image.jpg"
        }
    ],
    escolas: [
        {
            name: "Eco Quest Game",
            description: "Jogo digital criado por estudantes do 6º ano no Scratch a partir de conteúdos de Ciências sobre fauna, flora, impactos antrópicos e preservação de ecossistemas. O artigo descreve o processo de criação e uso do jogo como objeto de aprendizagem.",
            tags: ["Ecologia", "Gamificação", "Educação Básica", "Scratch"],
            url: "https://atenaeditora.com.br/catalogo/post/eco-quest-game",
            buttonLabel: "Ver publicação",
            image: "https://cdn.atenaeditora.com.br/atenaeditora/documentos/ebook_imagem/202012/cfdadc57e35099b5893c6ce8e42dc7ce331bfe95.PNG"
        },
        {
            name: "LabXchange – 3D Virtual Frog Dissection Lab",
            description: "Simulação 3D gratuita do LabXchange/Harvard para explorar anatomia de sapos, aprender técnicas de dissecção e relacionar estrutura e função sem a necessidade de um espécime animal real.",
            tags: ["Biologia", "Dissecção virtual", "3D", "Educação Básica"],
            url: "https://about.labxchange.org/sim-landing-page/3d-virtual-frog-dissection-lab",
            buttonLabel: "Abrir simulação",
            image: "https://cdn.prod.website-files.com/642c503cbd04708343968443/69cebdb4274ef6dcf1ef1379_Screenshot%202026-04-02%20at%202.45.57%E2%80%AFPM.png"
        },
        {
            name: "Podcast Biologia In Situ",
            description: "Podcast brasileiro de divulgação científica em Biologia que aproxima o conhecimento científico do cotidiano e do público por meio de episódios, entrevistas e séries temáticas.",
            tags: ["Biologia", "Divulgação científica", "Podcast"],
            url: "https://biologiainsitu.com.br/",
            buttonLabel: "Ouvir e acessar",
            image: "https://i.scdn.co/image/ab6765630000ba8ac6659946fecb91e59f73d1f1"
        },
        {
            name: "AR3D Arthropoda",
            description: "Aplicativo gratuito de realidade aumentada criado no ProfBio/UFPA para o ensino de artrópodes na Educação Básica. Combina modelos virtuais 3D de animais com o ambiente real em dispositivos Android.",
            tags: ["Artrópodes", "RA", "3D", "Biologia"],
            url: "https://ufpa.br/alunos-da-ufpa-sao-premiados-em-evento-nacional-de-ensino-de-biologia/",
            buttonLabel: "Conhecer projeto"
        }
    ]
};

/* ═══════════════════════════════════════════════
   PUBLICAÇÕES
═══════════════════════════════════════════════ */
var PUBLICACOES = {
    universidades: [],
    escolas: []
};

/* ═══════════════════════════════════════════════
   OBSERVATÓRIO — ONGs e LEGISLAÇÃO INTERNACIONAL
═══════════════════════════════════════════════ */
var OBSERVATORIO = {
    ongs: [
        { name: "ARCA Brasil", type: "ONG Nacional", location: "Brasil", focus: "Proteção animal, educação" },
        { name: "Animais na Rua", type: "ONG Nacional", location: "Brasil", focus: "Resgate, adoção" },
        { name: "Animal Equality", type: "ONG Internacional", location: "Espanha", focus: "Animais de fazenda, investigação" },
        { name: "AnimalKind International", type: "ONG Internacional", location: "Canadá", focus: "Apoio institucional, capacitação" },
        { name: "Born Free Foundation", type: "ONG Internacional", location: "Reino Unido", focus: "Vida selvagem, conservação" },
        { name: "CETFA - Canada", type: "ONG Internacional", location: "Canadá", focus: "Bem-estar, transporte animal" },
        { name: "Four Paws International", type: "ONG Internacional", location: "Áustria", focus: "Animais domésticos e selvagens" },
        { name: "HSI – Brasil", type: "ONG Nacional", location: "Brasil", focus: "Políticas, bem-estar animal" },
        { name: "Humane Society International", type: "ONG Internacional", location: "EUA", focus: "Bem-estar animal, políticas públicas" },
        { name: "Instituto Nina Rosa", type: "ONG Nacional", location: "Brasil", focus: "Educação humanitária" },
        { name: "L214 Éthique & Animaux", type: "ONG Internacional", location: "França", focus: "Animais de fazenda, indústria" },
        { name: "Mercy For Animals", type: "ONG Internacional", location: "EUA", focus: "Animais de fazenda, abolicionismo" },
        { name: "PETA – People for the Ethical Treatment of Animals", type: "ONG Internacional", location: "EUA", focus: "Direitos animais, abolicionismo" },
        { name: "Projeto GAP – Great Apes Project", type: "ONG Nacional", location: "Brasil", focus: "Primatas, direitos animais" },
        { name: "World Animal Protection", type: "ONG Internacional", location: "Reino Unido", focus: "Proteção, bem-estar" }
    ],
    legislacao: [
        { name: "Prevention of Cruelty to Animals Act", country: "Índia", year: 1960, level: "Baixo" },
        { name: "Animal Welfare Act", country: "EUA", year: 1966, level: "Médio" },
        { name: "Lei de Proteção à Fauna (Lei 5.197/67)", country: "Brasil", year: 1967, level: "Médio" },
        { name: "Lei de Crimes Ambientais (Lei 9.605/98) - Art. 32", country: "Brasil", year: 1998, level: "Alto" },
        { name: "Animal Welfare Act 1999", country: "Nova Zelândia", year: 1999, level: "Alto" },
        { name: "Tierschutzgesetz", country: "Alemanha", year: 2002, level: "Muito Alto" },
        { name: "Animal Welfare Act 2006", country: "Reino Unido", year: 2006, level: "Muito Alto" }
    ]
};

/* ═══════════════════════════════════════════════
   OBSERVATÓRIO — ESTATÍSTICAS (Visão Geral)
═══════════════════════════════════════════════ */
var OBSERVATORIO_DATA = {
    hero_stats: {
        total_pets: "167,6 Mi",
        homes_with_pets: "47,9 Mi",
        pet_revenue: "R$ 68,9 Bi",
        abandoned_est: "30 Mi",
        slaughtered_year: "5,9 Bi",
        research_animals: "11,3 Mi",
        violence_reports: "42k"
    }
};
