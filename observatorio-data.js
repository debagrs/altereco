/**
 * Observatório AlterECO - Dados Reais e Ciência de Dados
 * Baseado na Data Specification v1.0 (UFSM/CNPq)
 */

window.OBSERVATORIO_DB = {
    visao_geral: {
        kpis: [
            { label: "Faturamento Mercado Pet", value: "R$ 75,4 bi", fonte: "ABINPET", ano: 2024, url: "abinpet.org.br", icon: "trending-up" },
            { label: "Animais Abatidos (Frangos)", value: "6,28 bi", fonte: "IBGE/ABATE", ano: 2023, url: "ibge.gov.br", icon: "skull" },
            { label: "Uso em Experimentação", value: "11,3 mi", fonte: "CONCEA", ano: "2019-23", url: "gov.br/mcti", icon: "microscope" },
            { label: "Taxa de Abandono Estimada", value: "4,2%", fonte: "CFMV", ano: 2022, url: "cfmv.gov.br", icon: "home" },
            { label: "Denúncias de Maus-Tratos", value: "~49k", fonte: "Agregado SSP", ano: 2022, url: "isp.rj.gov.br", icon: "alert-triangle" },
            { label: "Grupos de Pesquisa", value: "89", fonte: "CNPq/Lattes", ano: 2023, url: "cnpq.br", icon: "graduation-cap" }
        ],
        nota_metodologica: "O paradoxo central: O Brasil investe bilhões no bem-estar de animais domésticos enquanto institucionaliza o uso de bilhões de outras espécies. Dados de abate referem-se apenas ao sistema formal (SIF/SIE/SIM). Maus-tratos e abandono apresentam subnotificação sistemática estrutural.",
        card_narrativo: "Os dados demonstram um paradoxo profundo: enquanto investimos R$ 75,4 bilhões no bem-estar de algumas espécies, institucionalizamos o uso e o sofrimento de outras. A ciência nos convida a repensar nossa ética através de evidências."
    },
    
    pets: {
        populacao: [
            { especie: "Cães", valor: 68 },
            { especie: "Aves", valor: 42 },
            { especie: "Gatos", valor: 34 },
            { especie: "Peixes", valor: 19.9 },
            { especie: "Répteis/Pequenos", valor: 2.5 }
        ],
        domicilios: [
            { label: "Com pelo menos 1 pet", valor: "57,8%" },
            { label: "Com cães", valor: "46,1%" },
            { label: "Com gatos", valor: "19,3%" }
        ],
        evolucao: [
            { ano: 2013, caes: 52.2, gatos: 22.1 },
            { ano: 2019, caes: 54.2, gatos: 24.0 },
            { ano: 2021, caes: 55.9, gatos: 25.5 },
            { ano: 2022, caes: 68.0, gatos: 34.0 }
        ]
    },

    economia: {
        faturamento_2024: [
            { segmento: "Pet Food", valor: 40.8, porcent: "54,1%" },
            { segmento: "Venda Animais", valor: 8.1, porcent: "10,8%" },
            { segmento: "Prod. Vet", valor: 7.8, porcent: "10,4%" },
            { segmento: "Serv. Vet", valor: 7.7, porcent: "10,2%" },
            { segmento: "Acessórios", valor: 5.5, porcent: "7,3%" },
            { segmento: "Banho/Tosa", valor: 5.5, porcent: "7,3%" }
        ],
        cruzamentos: [
            { title: "Crescimento vs PIB", text: "O mercado pet cresceu média de 14,2% ao ano (2013-23), superando o PIB de 3,8%, indicando resiliência extrema a ciclos econômicos." },
            { title: "Paradoxo de Acesso", text: "Apesar dos R$ 75,4 bi, menos de 40% dos tutores levam animais ao veterinário regularmente, revelando desigualdade no acesso à saúde." }
        ]
    },

    abate: {
        dados_2023: [
            { especie: "Frangos", valor: "6,28 Bilhões", variacao: "+2,8%" },
            { especie: "Suínos", valor: "57,17 Milhões", variacao: "+1,3%" },
            { especie: "Bovinos", valor: "34,06 Milhões", variacao: "+13,7%" }
        ],
        consumo_per_capita: [
            { pais: "EUA", kg: 99 },
            { pais: "Argentina", kg: 98 },
            { pais: "Brasil", kg: 89 },
            { pais: "França", kg: 83 },
            { pais: "China", kg: 65 }
        ],
        analise_etica: "Frangos representam a maior concentração quantitativa de sofrimento: 6,28 bi de indivíduos vivendo em média 42 dias sob confinamento intensivo."
    },

    experimentacao: {
        total_periodo: "11,3 Milhões (2019-2023)",
        especies_relativo: [
            { nome: "Camundongo", perc: "65%" },
            { nome: "Rato", perc: "20%" },
            { nome: "Peixe", perc: "10%" },
            { nome: "Coelho", perc: "5%" }
        ],
        finalidade: [
            { label: "Pesquisa Básica", perc: "68%" },
            { label: "Farmacologia", perc: "20%" },
            { label: "Biomédica", perc: "10%" },
            { label: "Ensino", perc: "2%" }
        ],
        limitacao: "Subnotificação crítica: Estima-se que apenas 40-60% das instituições estão registradas no CONCEA. Laboratórios privados não têm obrigação de registro."
    },

    maus_tratos: {
        estados: [
            { uf: "Minas Gerais", casos: "3.774", variacao: "+48,7%", ano: 2021, link: "https://www.agenciaminas.mg.gov.br/noticia/denuncias-de-maus-tratos-contra-animais-aumentam-em-minas-gerais" },
            { uf: "Rio de Janeiro", casos: "252", status: "Formais (ISP)", ano: 2022, link: "https://www.ispvisualizacao.rj.gov.br/" },
            { uf: "Rio Grande do Norte", variacao: "+95,8%", periodo: "2021-23", link: "https://www.ssp.rn.gov.br/" }
        ],
        causa_abandono: [
            { causa: "Financeiras", perc: "35%", ref: "CFMV Inquérito 2022" },
            { causa: "Comportamento", perc: "20%", ref: "CFMV Inquérito 2022" },
            { causa: "Mudança", perc: "15%", ref: "CFMV Inquérito 2022" }
        ],
        nota: "O aumento nas denúncias reflete maior consciência social e o agravamento da Lei 14.064/2020 (Pena de 2 a 5 anos para cães e gatos)."
    },

    entretenimento: {
        zoos: { total: 140, status: "Registrados (IBAMA/SISPASS)", link: "https://www.gov.br/ibama/pt-br/assuntos/biodiversidade-e-fauna" },
        rodeios: { total: 2000, periodo: "Anual (Estimativa)", ref: "CNAR - Confederação Nacional do Rodeio", link: "https://cnar.com.br/" },
        aquarios: { total: 12, principais: ["AquaRio", "Aquário de SP"], ref: "IBAMA" }
    },

    pesquisa: {
        grupos: [
            { area: "Bem-estar Animal", total: 47, fonte: "levantamento AlterECO a partir do DGP/CNPq 2023" },
            { area: "Direito Animal", total: 22, fonte: "levantamento AlterECO a partir do DGP/CNPq 2023" },
            { area: "Ética e Senciência", total: 20, fonte: "levantamento AlterECO a partir do DGP/CNPq 2023" }
        ],
        grupos_catalogo: {
            "Bem-estar Animal": [
                {
                    nome: "Laboratório de Bem-estar Animal (LABEA)",
                    instituicao: "Universidade Federal do Paraná (UFPR)",
                    uf: "PR",
                    fonte: "Página institucional do LABEA / consulta CNPq",
                    link: "http://dgp.cnpq.br/buscaoperacional/detalhepesq.jsp?pesq=0305722196403558"
                },
                {
                    nome: "Laboratório de Etologia Aplicada e Bem-Estar Animal (LETA)",
                    instituicao: "Universidade Federal de Santa Catarina (UFSC)",
                    uf: "SC",
                    fonte: "Associação Brasileira de Zootecnistas / DGP-CNPq",
                    link: "https://abz.org.br/grupos-pesquisa-zootecnia/"
                },
                {
                    nome: "Saúde, diagnóstico e bem-estar animal na Fronteira Sul (SADBEM)",
                    instituicao: "Universidade Federal da Fronteira Sul (UFFS)",
                    uf: "SC",
                    lider: "Vanessa Silva Retuci",
                    fonte: "UFFS · grupos cadastrados no DGP/CNPq",
                    link: "https://www.uffs.edu.br/uffs/grupos-de-pesquisa/grupos-de-pesquisa-cadastrados-no-diretorio-do-cnpq"
                },
                {
                    nome: "Grupo de Pesquisa em Produção e Bem-Estar Animal",
                    instituicao: "Universidade Regional do Noroeste do Estado do Rio Grande do Sul (UNIJUÍ)",
                    uf: "RS",
                    fonte: "UNIJUÍ",
                    link: "https://www.unijui.edu.br/comunica/pesquisa?start=20"
                },
                {
                    nome: "Instalações, Ambiência e Bem-Estar Animal (BAIA)",
                    instituicao: "Universidade Estadual Paulista (UNESP)",
                    uf: "SP",
                    fonte: "Associação Brasileira de Zootecnistas / DGP-CNPq",
                    link: "https://abz.org.br/grupos-pesquisa-zootecnia/"
                }
            ],
            "Direito Animal": [
                {
                    nome: "Grupo de Pesquisa em Direitos Animais (GPDA)",
                    instituicao: "Universidade Federal de Santa Maria (UFSM)",
                    uf: "RS",
                    lider: "Nina Trícia Disconzi Rodrigues",
                    fonte: "PPGD/UFSM · grupo certificado pelo CNPq",
                    link: "https://www.ufsm.br/cursos/pos-graduacao/santa-maria/ppgd/grupos-de-pesquisa"
                },
                {
                    nome: "Núcleo Interdisciplinar de Pesquisa e Extensão em Direito Ambiental e Direito Animal (NIPEDA)",
                    instituicao: "Universidade Federal da Bahia (UFBA)",
                    uf: "BA",
                    lider: "Heron José de Santana Gordilho",
                    fonte: "PPGD/UFBA",
                    link: "https://ppgd.direito.ufba.br/pt-br/linhas-e-grupos-de-pesquisa"
                },
                {
                    nome: "Núcleo Interdisciplinar de Ensino, Pesquisa e Extensão em Direitos dos Animais, Meio Ambiente e Pós-Humanismo",
                    instituicao: "Universidade Federal da Bahia (UFBA)",
                    uf: "BA",
                    lider: "Tagore Trajano de Almeida Silva",
                    fonte: "PPGD/UFBA",
                    link: "https://ppgd.direito.ufba.br/pt-br/linhas-e-grupos-de-pesquisa"
                }
            ],
            "Ética e Senciência": [
                {
                    nome: "Laboratório de Etologia Aplicada e Bem-Estar Animal (LETA)",
                    instituicao: "Universidade Federal de Santa Catarina (UFSC)",
                    uf: "SC",
                    fonte: "Associação Brasileira de Zootecnistas / DGP-CNPq",
                    link: "https://abz.org.br/grupos-pesquisa-zootecnia/"
                },
                {
                    nome: "Laboratório de Bem-estar Animal (LABEA)",
                    instituicao: "Universidade Federal do Paraná (UFPR)",
                    uf: "PR",
                    fonte: "Página institucional do LABEA / consulta CNPq",
                    link: "http://dgp.cnpq.br/buscaoperacional/detalhepesq.jsp?pesq=0305722196403558"
                },
                {
                    nome: "Grupo de Pesquisa em Direitos Animais (GPDA)",
                    instituicao: "Universidade Federal de Santa Maria (UFSM)",
                    uf: "RS",
                    lider: "Nina Trícia Disconzi Rodrigues",
                    fonte: "PPGD/UFSM · grupo certificado pelo CNPq",
                    link: "https://www.ufsm.br/cursos/pos-graduacao/santa-maria/ppgd/grupos-de-pesquisa"
                }
            ]
        },
        publicacoes: {
            periodo: "2015-2024",
            fonte: "CAPES/Dados Abertos · Catálogo de Teses e Dissertações",
            link: "https://dadosabertos.capes.gov.br/group/catalogo-de-teses-e-dissertacoes-brasil"
        }
    },

    educacao: {
        projetos: [
            { nome: "Educação Humanitária na Base Escolar", alcance: "Estados como RS e SP possuem leis que inserem a proteção animal no currículo. Contudo, a ausência do tema como diretriz clara na BNCC (Base Nacional Comum Curricular) gera assimetria.", status: "Leis Estaduais em expansão", fonte: "Lei RS 15.254/19", link: "https://al-rs.jusbrasil.com.br/legislacao/667503738/lei-15254-19-rio-grande-do-sul-rs" },
            { nome: "Institucionalização: OAB e Direito Animal", alcance: "O Conselho Federal da OAB e todas as suas 27 seccionais estaduais possuem agora Comissões de Defesa dos Animais, refletindo o boom do ensino da matéria nas IES de Direito.", status: "Consolidação Jurídica", fonte: "CFOAB", link: "https://www.oab.org.br/comissoes/comissao/102/comissao-nacional-de-protecao-e-defesa-dos-animais" },
            { nome: "Ciências Agrárias: A Virada da Bioética", alcance: "Novas Diretrizes Curriculares (DCNs) do MEC, impulsionadas pelo CFMV, tornaram o ensino de Bem-Estar Animal obrigatório nas graduações de Medicina Veterinária.", status: "Diretrizes Nacionais do MEC", fonte: "CFMV e MEC", link: "https://www.cfmv.gov.br/" }
        ],
        kpis: [
            { label: "Níveis de ensino separados", value: "2", desc: "Educação Básica / Escolar e Ensino Superior / Universidade são apresentados separadamente para evitar generalizações entre contextos pedagógicos distintos." },
            { label: "Referências em português", value: "11", desc: "Seleção inicial curada nesta versão do Observatório, com acesso à publicação ou ao registro acadêmico original." }
        ],
        texto_apoio: "A educação humanitária articula ética, ciência, cidadania e cuidado em diferentes etapas da formação. No AlterECO, as referências são separadas por nível de ensino para não confundir experiências da Educação Básica com práticas, pesquisas e métodos substitutivos do Ensino Superior.",
        publicacoes_pt: [
            {
                nivel: "superior",
                tipo: "Artigo científico",
                ano: 2025,
                titulo: "Métodos alternativos ao uso animal em aulas práticas no curso de Biologia da UNEB: estratégias didáticas replacement dos 3R’s",
                autores: "Cunha, E. C. S.; Santos, C. L. A.; Meira, J. S.",
                veiculo: "Revista de Educação do Vale do São Francisco",
                resumo: "Relato docente sobre simuladores virtuais, modelos em gesso e modelagem de órgãos como estratégias de substituição de animais em aulas práticas de Biologia.",
                link: "https://www.periodicos.univasf.edu.br/revasf/article/view/3099"
            },
            {
                nivel: "superior",
                tipo: "Artigo científico",
                ano: 2025,
                titulo: "Tecnologia e Bioética no Ensino: Etapas da Produção de um Modelo Substitutivo Realista",
                autores: "Adami, E. R. et al.",
                veiculo: "Revista de Gestão e Secretariado",
                resumo: "Descreve o desenvolvimento e a validação de um modelo anatômico para treinamento veterinário, articulando bioética, tecnologia e substituição do uso de animais vivos.",
                link: "https://ojs.revistagesec.org.br/secretariado/article/view/5207"
            },
            {
                nivel: "superior",
                tipo: "Artigo científico",
                ano: 2022,
                titulo: "A representação do animal como recurso didático: a etapa 2 do Modelo de Reconstrução Educacional",
                autores: "Fischer, M. L.; Furlan, A. L. D.",
                veiculo: "Ensaio Pesquisa em Educação em Ciências",
                resumo: "Analisa a representação do animal como recurso didático e a percepção de métodos alternativos/substitutivos entre licenciados, bacharéis e graduandos de Ciências Biológicas.",
                link: "https://periodicos.ufmg.br/index.php/ensaio/article/view/35665"
            },
            {
                nivel: "superior",
                tipo: "Artigo científico",
                ano: 2020,
                titulo: "Métodos alternativos ao uso de animais como recurso didático: um novo paradigma bioético para o ensino da Zoologia",
                autores: "Furlan, A. L. D.; Fischer, M. L.",
                veiculo: "Educação em Revista",
                resumo: "Mapeia métodos alternativos no contexto acadêmico e pedagógico, incluindo a formação de professores de Ciências e Biologia e experiências no ensino superior.",
                link: "https://www.scielo.br/j/edur/a/SvzX4qmqNKh7JFSZppbz6WJ/?lang=pt"
            },
            {
                nivel: "superior",
                tipo: "Dissertação",
                ano: 2018,
                titulo: "Métodos substitutivos ao uso de animais vivos no ensino de graduação em Medicina Veterinária: procedimentos em roedores de laboratório",
                autores: "Zanatto, D. A.",
                veiculo: "Universidade de São Paulo",
                resumo: "Investiga alternativas como vídeos, simuladores e outros recursos para substituir animais vivos no ensino de procedimentos em graduação veterinária.",
                link: "https://teses.usp.br/teses/disponiveis/10/10133/tde-11062019-145628/pt-br.html"
            },
            {
                nivel: "basica",
                tipo: "Artigo científico",
                ano: 2025,
                titulo: "Do conhecimento à ação: o impacto de uma oficina pedagógica no combate ao abandono de animais",
                autores: "Oliveira, R. B.; Nascimento, L. F. C.; Dias, M. M.",
                veiculo: "Contribuciones a las Ciencias Sociales",
                resumo: "Avalia uma oficina pedagógica com estudantes do 4º ano do Ensino Fundamental sobre abandono, guarda responsável e bem-estar animal.",
                link: "https://ojs.revistacontribuciones.com/ojs/index.php/clcs/article/view/16756"
            },
            {
                nivel: "basica",
                tipo: "Artigo científico",
                ano: 2023,
                titulo: "O ensino da ética animal: bioética no ensino de ciências",
                autores: "Albuquerque, N. F.; Rocha Filho, J. B.",
                veiculo: "Cuadernos de Educación y Desarrollo",
                resumo: "Discute a presença ainda reduzida da ética animal no ensino de Ciências e defende o aprofundamento do tema na educação científica.",
                link: "https://ojs.cuadernoseducacion.com/ojs/index.php/ced/article/view/1722"
            },
            {
                nivel: "basica",
                tipo: "Artigo científico",
                ano: 2022,
                titulo: "Percepção de alunos de escola pública sobre bem-estar animal e a ocorrência do tema nos livros didáticos",
                autores: "Sitton, H. A. et al.",
                veiculo: "Research, Society and Development",
                resumo: "Investiga conhecimentos de estudantes do Ensino Fundamental e Médio e a presença do bem-estar animal em materiais didáticos.",
                link: "https://rsdjournal.org/rsd/article/view/25166"
            },
            {
                nivel: "basica",
                tipo: "Artigo científico",
                ano: 2021,
                titulo: "Conscientização sobre Bem-Estar Animal e Guarda Responsável em escola de Educação Fundamental localizada na Região Sul-Fluminense do estado do Rio de Janeiro",
                autores: "Fernandes, G. T. M. et al.",
                veiculo: "Revista Fluminense de Extensão Universitária",
                resumo: "Relata atividades de educação em bem-estar animal, guarda responsável e prevenção de zoonoses com turmas do 1º ao 6º ano.",
                link: "https://editora.univassouras.edu.br/index.php/RFEU/article/view/2258"
            },
            {
                nivel: "basica",
                tipo: "Artigo científico",
                ano: 2018,
                titulo: "Educação, ética animal e ambiental: destituindo o paradigma antropocêntrico",
                autores: "Oliveira, F. A. G.; Dias, M. C.",
                veiculo: "Revista Espaço do Currículo",
                resumo: "Propõe revisar o viés antropocêntrico presente nos conteúdos programáticos escolares e ampliar a reflexão ética sobre animais não humanos na educação formal.",
                link: "https://periodicos.ufpb.br/index.php/rec/article/view/ufpb.1983-1579.2018v3n11.40557"
            },
            {
                nivel: "basica",
                tipo: "Trabalho acadêmico",
                ano: 2018,
                titulo: "Educação no ensino fundamental para o bem-estar animal",
                autores: "Muller, C. A. S.",
                veiculo: "Universidade Tecnológica Federal do Paraná",
                resumo: "Pesquisa a presença do tema bem-estar e guarda responsável no Ensino Fundamental e o repertório de professores para abordá-lo em sala de aula.",
                link: "https://riut.utfpr.edu.br/jspui/handle/1/11048"
            }
        ]
    },

    atlas_global: {
        protecao: [
            { pais: "Brasil", nota: "D", ref: "Animal Protection Index (WAP)", link: "https://api.worldanimalprotection.org/country/brazil" },
            { pais: "Reino Unido", nota: "B", ref: "WAP API" },
            { pais: "Alemanha", nota: "B", ref: "WAP API" },
            { pais: "EUA", nota: "D", ref: "WAP API" }
        ],
        abate_global: [
            { pais: "China", bi: 9.3, especie: "Frangos", fonte: "FAOSTAT 2022", link: "https://www.fao.org/faostat/en/#data/QCL" },
            { pais: "Brasil", bi: 6.2, especie: "Frangos", fonte: "FAOSTAT 2022" },
            { pais: "EUA", bi: 9.1, especie: "Frangos", fonte: "FAOSTAT 2022" }
        ]
    },

    cruzamentos_ineditos: [
        {
            id: "X009",
            title: "A Gatificação das Cidades",
            data: "O crescimento de 100% na população de gatos em 10 anos correlaciona-se com a verticalização urbana. Gatos ocupam 30% menos espaço e custo que cães em apartamentos.",
            link: "https://www.ibge.gov.br/estatisticas/sociais/saude/9160-pesquisa-nacional-de-saude.html"
        },
        {
            id: "X010",
            title: "Exportação vs. Prato Brasileiro",
            data: "Recordes de abate bovino (+13%) em 2023 não reduziram o consumo per capita interno, pois 30% da produção é drenada pelo mercado externo (China/EUA).",
            link: "https://www.gov.br/agricultura/pt-br"
        }
    ]
};

/* ═══════════════════════════════════════════════════════════════
   DGP/CNPq 2023 · sincronização da base nominal temática
   A fonte única é dgp-2023-grupos.js. Totais e listas são derivados
   automaticamente, evitando divergência entre o número e o modal.
═══════════════════════════════════════════════════════════════ */
(function syncAlterEcoDgp2023() {
    const source = window.ALTERECO_DGP_2023;
    const db = window.OBSERVATORIO_DB;
    if (!source || !db?.pesquisa || !Array.isArray(source.grupos)) return;

    const areas = Array.isArray(source.areas) && source.areas.length
        ? source.areas
        : ["Bem-estar Animal", "Direito Animal", "Ética e Senciência"];

    const byArea = {};
    areas.forEach(area => {
        byArea[area] = source.grupos
            .filter(group => Array.isArray(group.areas) && group.areas.includes(area))
            .sort((a, b) => String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR'));
    });

    db.pesquisa.grupos_catalogo = byArea;
    db.pesquisa.grupos = areas.map(area => ({
        area,
        total: byArea[area].length,
        fonte: `Base nominal temática AlterECO · referência Censo DGP ${source.meta?.ano_referencia || 2023}`,
        tipo_total: "nominal_catalogado"
    }));
    db.pesquisa.dgp_meta = source.meta || {};

    const uniqueCount = new Set(source.grupos.map(group => group.id || group.nome)).size;
    const kpi = db.visao_geral?.kpis?.find(item => item.label === 'Grupos de Pesquisa');
    if (kpi) {
        kpi.value = String(uniqueCount);
        kpi.fonte = 'Base nominal AlterECO / DGP-CNPq';
        kpi.ano = source.meta?.ano_referencia || 2023;
        kpi.url = 'lattes.cnpq.br/web/dgp/censos2';
    }
})();
