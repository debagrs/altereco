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
        ],
        organizacoes: [
            {
                id: "cat-aspca",
                nome: "ASPCA",
                categoria: "companheiros",
                foco: "Proteção animal ampla e cuidado de animais de companhia",
                cidade: "Nova York",
                pais: "Estados Unidos",
                endereco: "424 E. 92nd St, New York, NY 10128-6804, EUA",
                latitude: 40.7829,
                longitude: -73.9431,
                site: "https://www.aspca.org/",
                fonte_url: "https://www.aspca.org/about-us/contact-us",
                fonte_label: "ASPCA · Contact Us"
            },
            {
                id: "cat-four-paws",
                nome: "FOUR PAWS International",
                categoria: "companheiros",
                foco: "Bem-estar animal internacional e campanhas multiespécies",
                cidade: "Viena",
                pais: "Áustria",
                endereco: "Linke Wienzeile 236, A-1150 Vienna, Austria",
                latitude: 48.1910,
                longitude: 16.3349,
                site: "https://www.four-paws.org/",
                fonte_url: "https://www.four-paws.org/about-us/contact",
                fonte_label: "FOUR PAWS · Contact"
            },
            {
                id: "cat-spca-singapore",
                nome: "SPCA Singapore",
                categoria: "companheiros",
                foco: "Resgate, adoção e proteção de animais em Singapura",
                cidade: "Singapura",
                pais: "Singapura",
                endereco: "50 Sungei Tengah Road, Singapore 699012",
                latitude: 1.3919,
                longitude: 103.7075,
                site: "https://spca.org.sg/",
                fonte_url: "https://spca.org.sg/contact-us/",
                fonte_label: "SPCA Singapore · Contact Us"
            },
            {
                id: "cat-wap-brasil",
                nome: "World Animal Protection Brasil",
                categoria: "companheiros",
                foco: "Proteção animal internacional com escritório no Brasil",
                cidade: "São Paulo",
                pais: "Brasil",
                endereco: "Rua Vergueiro, 875, Sala 93, São Paulo - SP, CEP 01504-001, Brasil",
                latitude: -23.5741,
                longitude: -46.6393,
                site: "https://www.worldanimalprotection.org.br/",
                fonte_url: "https://www.worldanimalprotection.org/about-us/contact-us/",
                fonte_label: "World Animal Protection · Contact Us"
            },
            {
                id: "cat-wap-africa",
                nome: "World Animal Protection Africa",
                categoria: "companheiros",
                foco: "Proteção animal internacional na África",
                cidade: "Nairóbi",
                pais: "Quênia",
                endereco: "Westside Tower, 9th Floor – No. 901, Lower Kabete Road, Westlands, Nairobi, Kenya",
                latitude: -1.2676,
                longitude: 36.8033,
                site: "https://www.worldanimalprotection.org/",
                fonte_url: "https://api.worldanimalprotection.org/contact",
                fonte_label: "World Animal Protection · International offices"
            },
            {
                id: "cat-animal-advocates-intl",
                nome: "Animal Advocates International",
                categoria: "companheiros",
                foco: "Advocacy e proteção animal com atuação internacional",
                cidade: "Harare",
                pais: "Zimbábue",
                endereco: "194/12 Horgerty Hill, Borrowdale, Harare, Zimbabwe",
                latitude: -17.7717,
                longitude: 31.1067,
                site: "https://animaladvocatesinternational.org/",
                fonte_url: "https://animaladvocatesinternational.org/contact/contact-us/",
                fonte_label: "Animal Advocates International · Contact"
            },
            {
                id: "chicken-mercy-for-animals",
                nome: "Mercy For Animals",
                categoria: "alimentacao",
                foco: "Animais explorados para alimentação e transição alimentar",
                cidade: "Los Angeles",
                pais: "Estados Unidos",
                endereco: "8033 Sunset Blvd., Suite 864, Los Angeles, CA 90046, EUA",
                latitude: 34.0970,
                longitude: -118.3657,
                site: "https://mercyforanimals.org/",
                fonte_url: "https://mercyforanimals.org/contact/",
                fonte_label: "Mercy For Animals · Contact"
            },
            {
                id: "chicken-ciwf",
                nome: "Compassion in World Farming International",
                categoria: "alimentacao",
                foco: "Animais de fazenda e combate ao sistema de criação intensiva",
                cidade: "Godalming",
                pais: "Reino Unido",
                endereco: "River Court, Mill Lane, Godalming, Surrey GU7 1EZ, United Kingdom",
                latitude: 51.1866,
                longitude: -0.6149,
                site: "https://www.ciwf.org.uk/",
                fonte_url: "https://www.ciwf.org/about-compassion/contact-us/",
                fonte_label: "Compassion in World Farming · Contact Us"
            },
            {
                id: "chicken-animal-equality",
                nome: "Animal Equality",
                categoria: "alimentacao",
                foco: "Direitos dos animais explorados para alimentação",
                cidade: "Los Angeles",
                pais: "Estados Unidos",
                endereco: "8581 Santa Monica Blvd., Suite 350, Los Angeles, CA 90069, EUA",
                latitude: 34.0905,
                longitude: -118.3857,
                site: "https://animalequality.org/",
                fonte_url: "https://animalequality.org/contact/",
                fonte_label: "Animal Equality · Contact"
            },
            {
                id: "chicken-proveg",
                nome: "ProVeg e.V.",
                categoria: "alimentacao",
                foco: "Promoção da alimentação baseada em plantas e redução do uso de animais",
                cidade: "Berlim",
                pais: "Alemanha",
                endereco: "Genthiner Straße 48, 10785 Berlin, Germany",
                latitude: 52.5071,
                longitude: 13.3642,
                site: "https://proveg.org/",
                fonte_url: "https://proveg.org/de/impressum",
                fonte_label: "ProVeg Deutschland · Impressum"
            },
            {
                id: "chicken-l214",
                nome: "L214",
                categoria: "alimentacao",
                foco: "Defesa dos animais usados na produção alimentar",
                cidade: "Paris",
                pais: "França",
                endereco: "Association L214, CS 30082, 75935 Paris Cedex 19, France",
                latitude: 48.8791,
                longitude: 2.3899,
                site: "https://www.l214.com/",
                fonte_url: "https://www.l214.com/contact/",
                fonte_label: "L214 · Contact"
            },
            {
                id: "chicken-humane-league",
                nome: "The Humane League",
                categoria: "alimentacao",
                foco: "Combate à pecuária industrial e advocacy por animais de fazenda",
                cidade: "Rockville",
                pais: "Estados Unidos",
                endereco: "P.O. Box 10476, Rockville, MD 20849, EUA",
                latitude: 39.0808,
                longitude: -77.1464,
                site: "https://thehumaneleague.org/",
                fonte_url: "https://thehumaneleague.org/privacy-policy",
                fonte_label: "The Humane League · Contact information"
            },
            {
                id: "rabbit-peta",
                nome: "PETA",
                categoria: "pesquisa",
                foco: "Experimentação animal, testes e substituição por métodos alternativos",
                cidade: "Norfolk",
                pais: "Estados Unidos",
                endereco: "501 Front St., Norfolk, VA 23510, EUA",
                latitude: 36.8519,
                longitude: -76.2911,
                site: "https://www.peta.org/",
                fonte_url: "https://www.peta.org/about-peta/contact-peta/",
                fonte_label: "PETA · Contact PETA"
            },
            {
                id: "rabbit-aavs",
                nome: "American Anti-Vivisection Society",
                categoria: "pesquisa",
                foco: "Fim do uso de animais na ciência e desenvolvimento de alternativas",
                cidade: "Jenkintown",
                pais: "Estados Unidos",
                endereco: "801 Old York Road, Suite 204, Jenkintown, PA 19046, EUA",
                latitude: 40.0957,
                longitude: -75.1277,
                site: "https://aavs.org/",
                fonte_url: "https://aavs.org/about/contact-us/",
                fonte_label: "AAVS · Contact Us"
            },
            {
                id: "rabbit-afsa",
                nome: "Animal-Free Science Advocacy",
                categoria: "pesquisa",
                foco: "Ciência sem animais e políticas de substituição",
                cidade: "Melbourne / Fitzroy",
                pais: "Austrália",
                endereco: "PO Box 15, Fitzroy, VIC 3065, Australia",
                latitude: -37.7989,
                longitude: 144.9760,
                site: "https://animalfreescienceadvocacy.org.au/",
                fonte_url: "https://animalfreescienceadvocacy.org.au/contact/",
                fonte_label: "Animal-Free Science Advocacy · Contact"
            },
            {
                id: "rabbit-ifer",
                nome: "International Foundation for Ethical Research",
                categoria: "pesquisa",
                foco: "Métodos científicos inovadores para substituir animais em pesquisa, testes e ensino",
                cidade: "Chicago",
                pais: "Estados Unidos",
                endereco: "444 N. Wells St., Suite 406, Chicago, IL 60654, EUA",
                latitude: 41.8901,
                longitude: -87.6348,
                site: "https://ifer.org/",
                fonte_url: "https://ifer.org/contact",
                fonte_label: "IFER · Contact Us"
            },
            {
                id: "rabbit-cfi",
                nome: "Cruelty Free International",
                categoria: "pesquisa",
                foco: "Fim dos testes em animais em escala global",
                cidade: "Londres",
                pais: "Reino Unido",
                endereco: "16A Crane Grove, London, N7 8NN, United Kingdom",
                latitude: 51.5488,
                longitude: -0.1179,
                site: "https://www.crueltyfreeinternational.org/",
                fonte_url: "https://find-and-update.company-information.service.gov.uk/company/04115167",
                fonte_label: "UK Companies House · Cruelty Free International"
            },
            {
                id: "elephant-born-free",
                nome: "Born Free Foundation",
                categoria: "entretenimento",
                foco: "Fauna silvestre, cativeiro e campanhas contra exploração para entretenimento",
                cidade: "Horsham",
                pais: "Reino Unido",
                endereco: "2nd Floor, Frazer House, 14 Carfax, Horsham, West Sussex RH12 1ER, UK",
                latitude: 51.0649,
                longitude: -0.3262,
                site: "https://www.bornfree.org.uk/",
                fonte_url: "https://www.bornfree.org.uk/contact-us/",
                fonte_label: "Born Free · Contact Us"
            },
            {
                id: "elephant-adi",
                nome: "Animal Defenders International",
                categoria: "entretenimento",
                foco: "Circos, cativeiro e exploração de animais em entretenimento",
                cidade: "Londres",
                pais: "Reino Unido",
                endereco: "Vox Studios North, 1 Durham Street, London SE11 5JH, UK",
                latitude: 51.4928,
                longitude: -0.1084,
                site: "https://www.ad-international.org/",
                fonte_url: "https://antipoachingfund.org/contact/",
                fonte_label: "Animal Defenders International · Contact"
            },
            {
                id: "elephant-wildlife-sos",
                nome: "Wildlife SOS",
                categoria: "entretenimento",
                foco: "Resgate de vida silvestre e campanhas ligadas a elefantes e uso recreativo",
                cidade: "Nova Délhi",
                pais: "Índia",
                endereco: "D-210, Defence Colony, New Delhi-110024, India",
                latitude: 28.5738,
                longitude: 77.2315,
                site: "https://wildlifesos.org/",
                fonte_url: "https://wildlifesos.org/contact-us/",
                fonte_label: "Wildlife SOS · Contact"
            },
            {
                id: "elephant-paws",
                nome: "Performing Animal Welfare Society (PAWS)",
                categoria: "entretenimento",
                foco: "Santuários e bem-estar de animais anteriormente usados em performances",
                cidade: "Galt",
                pais: "Estados Unidos",
                endereco: "P.O. Box 849, Galt, CA 95632, EUA",
                latitude: 38.2544,
                longitude: -121.2990,
                site: "https://pawsweb.org/",
                fonte_url: "https://pawsweb.org/paws-march-2026-newsletter/",
                fonte_label: "PAWS · Contact us"
            },
            {
                id: "elephant-ida",
                nome: "In Defense of Animals",
                categoria: "entretenimento",
                foco: "Campanhas por animais em entretenimento, vida silvestre e santuários",
                cidade: "San Rafael",
                pais: "Estados Unidos",
                endereco: "1020 B Street, San Rafael, CA 94901, EUA",
                latitude: 37.9716,
                longitude: -122.5311,
                site: "https://www.idausa.org/",
                fonte_url: "https://www.idausa.org/about/contacts/",
                fonte_label: "In Defense of Animals · Contacts"
            }
        ]
    },

    cruzamentos_ineditos: [
        {
            id: "X001",
            title: "Paradoxo Afetivo-Econômico",
            data: "O Observatório coloca lado a lado o crescimento do investimento e do cuidado direcionado aos animais de companhia e a escala massiva de uso de outras espécies. O cruzamento torna visível uma assimetria ética que costuma aparecer fragmentada em bases econômicas, demográficas e de produção.",
            link: "https://www.ibge.gov.br/estatisticas/economicas/agricultura-e-pecuaria/9203-pesquisas-trimestrais-do-abate-de-animais.html"
        },
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
