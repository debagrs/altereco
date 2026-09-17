/**
 * Observatório AlterECO - Dados Reais e Ciência de Dados
 * Baseado na Data Specification v1.0 (UFSM/CNPq)
 */

window.OBSERVATORIO_DB = {
    visao_geral: {
        kpis: [
            {
                label: "Faturamento Mercado Pet",
                value: "R$ 75,4 bi",
                fonte: "ABEMPET (Abinpet)",
                ano: 2024,
                url: "https://abinpet.org.br/informacoes-gerais-do-setor/",
                icon: "trending-up"
            },
            {
                label: "Frangos abatidos",
                value: "6,28 bi",
                fonte: "IBGE · Pesquisa Trimestral do Abate",
                ano: 2023,
                url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/39452-em-2023-abate-de-bovinos-cresce-e-o-de-suinos-e-frangos-atingem-recordes",
                icon: "skull"
            },
            {
                label: "Uso em ensino e pesquisa",
                value: "> 11,3 mi",
                fonte: "CONCEA/MCTI",
                ano: "2019–2023",
                url: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea/paginas/Destaques/relatorio-de-uso-animal-concea-2019_2023-1-1.pdf",
                icon: "microscope"
            },
            {
                label: "Sob tutela de ONGs/protetores",
                value: "184.960",
                fonte: "Instituto Pet Brasil via CFMV",
                ano: 2021,
                url: "https://www.cfmv.gov.br/combater-os-maus-tratos-aos-animais-e-um-dever-de-todos/comunicacao/noticias/2023/05/04/",
                icon: "home"
            },
            {
                label: "Registros de maus-tratos no RJ",
                value: "252",
                fonte: "Instituto de Segurança Pública do RJ",
                ano: 2022,
                url: "https://www.rj.gov.br/isp/node/669",
                icon: "alert-triangle"
            },
            {
                label: "Grupos no Censo DGP",
                value: "42.852",
                fonte: "CNPq · Censo DGP",
                ano: 2023,
                url: "https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/indicadores/paginas/recursos-humanos/indicadores-dos-grupos-de-pesquisa/arquivos/tab_03_04_01_e_2023.pdf",
                icon: "graduation-cap"
            }
        ],
        nota_metodologica: "Cada indicador mantém o escopo da fonte original. Não aplicamos fatores próprios de correção nem extrapolamos recortes estaduais para o país. Quando a base é parcial, institucional ou setorial, isso é informado no próprio card e no link da pesquisa.",
        card_narrativo: "Em 2024, o mercado pet brasileiro registrou R$ 75,4 bilhões. Em outra base, o IBGE registrou 6,28 bilhões de frangos abatidos em estabelecimentos sob inspeção sanitária em 2023. O Observatório aproxima esses dados sem tratá-los como equivalentes, tornando visíveis diferentes formas de relação humano-animal."
    },

    pets: {
        domicilios: [
            {
                label: "com cães",
                valor: "46,1%",
                fonte: "IBGE · PNS 2019",
                url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/28793-pns-2019-sete-em-cada-dez-pessoas-que-procuram-o-mesmo-servico-de-saude-vao-a-rede-publica"
            },
            {
                label: "com gatos",
                valor: "19,3%",
                fonte: "IBGE · PNS 2019",
                url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/28793-pns-2019-sete-em-cada-dez-pessoas-que-procuram-o-mesmo-servico-de-saude-vao-a-rede-publica"
            },
            {
                label: "com cão ou gato",
                valor: "39,4 mi",
                fonte: "IBGE · PNS 2019",
                url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/28793-pns-2019-sete-em-cada-dez-pessoas-que-procuram-o-mesmo-servico-de-saude-vao-a-rede-publica"
            }
        ],
        populacao: [
            { especie: "Cães", valor: 58.1 },
            { especie: "Aves canoras", valor: 41.0 },
            { especie: "Gatos", valor: 27.1 },
            { especie: "Peixes ornamentais", valor: 20.8 },
            { especie: "Pequenos répteis e mamíferos", valor: 2.5 }
        ],
        populacao_fonte: {
            fonte: "Instituto Pet Brasil via CFMV",
            ano: 2021,
            url: "https://www.cfmv.gov.br/combater-os-maus-tratos-aos-animais-e-um-dever-de-todos/comunicacao/noticias/2023/05/04/"
        },
        evolucao_domicilios: [
            {
                especie: "Domicílios com cães",
                inicial: "44,3%",
                ano_inicial: 2013,
                final: "46,1%",
                ano_final: 2019,
                fonte_inicial: "IBGE · PNS 2013",
                url_inicial: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/10138-pns-2013-tres-em-cada-quatro-brasileiros-costumam-buscar-atendimento-medico-na-rede-publica-de-saude",
                fonte_final: "IBGE · PNS 2019",
                url_final: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/28793-pns-2019-sete-em-cada-dez-pessoas-que-procuram-o-mesmo-servico-de-saude-vao-a-rede-publica"
            },
            {
                especie: "Domicílios com gatos",
                inicial: "17,7%",
                ano_inicial: 2013,
                final: "19,3%",
                ano_final: 2019,
                fonte_inicial: "IBGE · PNS 2013",
                url_inicial: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/10138-pns-2013-tres-em-cada-quatro-brasileiros-costumam-buscar-atendimento-medico-na-rede-publica-de-saude",
                fonte_final: "IBGE · PNS 2019",
                url_final: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/28793-pns-2019-sete-em-cada-dez-pessoas-que-procuram-o-mesmo-servico-de-saude-vao-a-rede-publica"
            }
        ]
    },

    economia: {
        faturamento_total: {
            valor: "R$ 75,4 bilhões",
            variacao: "+9,6% em relação a 2023",
            fonte: "ABEMPET (Abinpet)",
            ano: 2024,
            url: "https://abinpet.org.br/informacoes-gerais-do-setor/"
        },
        faturamento_2024: [
            { segmento: "Pet Food", valor: 40.8, porcent: "54,1%" },
            { segmento: "Venda de animais por criadores", valor: 8.1, porcent: "10,8%" },
            { segmento: "Produtos veterinários", valor: 7.8, porcent: "10,4%" },
            { segmento: "Serviços veterinários", valor: 7.7, porcent: "10,2%" }
        ],
        historico_faturamento: [
            { ano: 2013, valor: 24.3 }, { ano: 2014, valor: 26.7 }, { ano: 2015, valor: 28.9 },
            { ano: 2016, valor: 31.1 }, { ano: 2017, valor: 32.9 }, { ano: 2018, valor: 34.4 },
            { ano: 2019, valor: 35.3 }, { ano: 2020, valor: 40.9 }, { ano: 2021, valor: 51.7 },
            { ano: 2022, valor: 60.2 }, { ano: 2023, valor: 68.7 }, { ano: 2024, valor: 75.4 }
        ],
        historico_fonte: {
            fonte: "ABEMPET/Abinpet · Dados de Mercado",
            url: "https://abinpet.org.br/wp-content/uploads/2024/10/abinpet_apresentacao_dados_mercado_2024_completo_draft5.pdf",
            complemento_url: "https://abinpet.org.br/informacoes-gerais-do-setor/",
            nota: "Série de 2013 a 2023 publicada pela Abinpet; 2024 atualizado pela ABEMPET. Valores nominais em bilhões de reais."
        },
        cruzamentos: [
            {
                title: "Crescimento em 2024",
                text: "O faturamento de R$ 75,4 bilhões representou aumento de 9,6% em relação a 2023, segundo a entidade setorial.",
                fonte: "ABEMPET (Abinpet)",
                url: "https://abinpet.org.br/informacoes-gerais-do-setor/"
            },
            {
                title: "Concentração em alimentação",
                text: "Pet Food respondeu por R$ 40,8 bilhões, equivalentes a 54,1% do faturamento informado para o setor em 2024.",
                fonte: "ABEMPET (Abinpet)",
                url: "https://abinpet.org.br/informacoes-gerais-do-setor/"
            }
        ]
    },

    abate: {
        dados_2023: [
            {
                especie: "Frangos",
                valor: "6,28 bilhões",
                variacao: "+2,8%",
                fonte: "IBGE · Pesquisa Trimestral do Abate",
                url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/39452-em-2023-abate-de-bovinos-cresce-e-o-de-suinos-e-frangos-atingem-recordes"
            },
            {
                especie: "Suínos",
                valor: "57,17 milhões",
                variacao: "+1,3%",
                fonte: "IBGE · Pesquisa Trimestral do Abate",
                url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/39452-em-2023-abate-de-bovinos-cresce-e-o-de-suinos-e-frangos-atingem-recordes"
            },
            {
                especie: "Bovinos",
                valor: "34,06 milhões",
                variacao: "+13,7%",
                fonte: "IBGE · Pesquisa Trimestral do Abate",
                url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/39452-em-2023-abate-de-bovinos-cresce-e-o-de-suinos-e-frangos-atingem-recordes"
            }
        ],
        frangos_uf_2025_t3: [
            {uf:"RO", nome:"Rondônia", valor:4549582}, {uf:"AC", nome:"Acre", valor:null},
            {uf:"AM", nome:"Amazonas", valor:null}, {uf:"RR", nome:"Roraima", valor:null},
            {uf:"PA", nome:"Pará", valor:13073558}, {uf:"AP", nome:"Amapá", valor:0},
            {uf:"TO", nome:"Tocantins", valor:6525231}, {uf:"MA", nome:"Maranhão", valor:294848},
            {uf:"PI", nome:"Piauí", valor:1707304}, {uf:"CE", nome:"Ceará", valor:10155931},
            {uf:"RN", nome:"Rio Grande do Norte", valor:null}, {uf:"PB", nome:"Paraíba", valor:7247187},
            {uf:"PE", nome:"Pernambuco", valor:19771590}, {uf:"AL", nome:"Alagoas", valor:null},
            {uf:"SE", nome:"Sergipe", valor:null}, {uf:"BA", nome:"Bahia", valor:34652159},
            {uf:"MG", nome:"Minas Gerais", valor:125355848}, {uf:"ES", nome:"Espírito Santo", valor:15001102},
            {uf:"RJ", nome:"Rio de Janeiro", valor:8822269}, {uf:"SP", nome:"São Paulo", valor:190618828},
            {uf:"PR", nome:"Paraná", valor:578989973}, {uf:"SC", nome:"Santa Catarina", valor:231979000},
            {uf:"RS", nome:"Rio Grande do Sul", valor:183923726}, {uf:"MS", nome:"Mato Grosso do Sul", valor:46522075},
            {uf:"MT", nome:"Mato Grosso", valor:54739970}, {uf:"GO", nome:"Goiás", valor:135683657},
            {uf:"DF", nome:"Distrito Federal", valor:null}
        ],
        frangos_uf_fonte: {
            fonte: "IBGE · Pesquisa Trimestral do Abate de Animais · 3º trimestre de 2025",
            url: "https://ftp.ibge.gov.br/Producao_Pecuaria/Fasciculo_Indicadores_IBGE/abate-leite-couro-ovos_202503caderno.pdf",
            nota: "X = dado desidentificado por sigilo estatístico; Amapá não possuía registro de abate de frangos sob inspeção sanitária no período. Dados de 2025 preliminares."
        },
        oferta_per_capita: [
            { pais: "Estados Unidos", kg: 122.06 },
            { pais: "Argentina", kg: 114.95 },
            { pais: "Brasil", kg: 104.57 },
            { pais: "China", kg: 73.54 }
        ],
        oferta_fonte: {
            fonte: "FAO via Our World in Data",
            ano: 2023,
            url: "https://ourworldindata.org/grapher/meat-supply-per-person?tab=table&time=latest",
            nota: "O indicador mede oferta disponível de carne per capita, e não ingestão efetivamente consumida."
        },
        analise_etica: "Na Pesquisa Trimestral do Abate, o número de frangos abatidos em 2023 (6,28 bilhões) é numericamente muito superior aos registros de suínos (57,17 milhões) e bovinos (34,06 milhões) em estabelecimentos sob inspeção sanitária.",
        analise_url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/39452-em-2023-abate-de-bovinos-cresce-e-o-de-suinos-e-frangos-atingem-recordes"
    },

    experimentacao: {
        total_periodo: "mais de 11,3 milhões (2019–2023)",
        indicadores: [
            {
                titulo: "Relatório nacional",
                valor: "> 11,3 mi",
                texto: "O CONCEA publicou o relatório de uso de animais em atividades de ensino e pesquisa científica referente ao período de 2019 a 2023.",
                fonte: "CONCEA/MCTI · Relatório 2019–2023",
                url: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea/paginas/Destaques/relatorio-de-uso-animal-concea-2019_2023-1-1.pdf"
            },
            {
                titulo: "Registro institucional",
                valor: "Novo CIUCA",
                texto: "O Novo CIUCA registra instituições que criam ou utilizam animais para ensino e pesquisa, protocolos e solicitações de credenciamento no CONCEA.",
                fonte: "CONCEA/MCTI · Manual do Novo CIUCA",
                url: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea/paginas/credenciamento-institucional/novo-ciuca"
            },
            {
                titulo: "Capacitação obrigatória",
                valor: "RN 49/2021",
                texto: "Desde 31 de maio de 2023, a normativa exige comprovação de capacitação das pessoas envolvidas em atividades de ensino ou pesquisa científica que utilizam animais.",
                fonte: "CONCEA/MCTI e CFBio · Nota Conjunta",
                url: "https://www.gov.br/mcti/pt-br/composicao/conselhos/concea/nota-conjunta-concea-e-cfbio"
            },
            {
                titulo: "Planejamento e redução",
                valor: "ARRIVE + PREPARE",
                texto: "O CONCEA recomenda ARRIVE e PREPARE como ferramentas complementares para melhorar o planejamento e contribuir para a redução do uso de animais.",
                fonte: "CONCEA/MCTI",
                url: "https://www.gov.br/mcti/pt-br/composicao/colegiados/concea/paginas/Destaques/concea-recomenda-o-uso-do-arrive-e-do-prepare"
            }
        ],
        ciuca_regioes_2025: [
            {regiao:"Centro-Oeste", credenciadas:61, total:103},
            {regiao:"Nordeste", credenciadas:74, total:150},
            {regiao:"Norte", credenciadas:42, total:76},
            {regiao:"Sudeste", credenciadas:382, total:574},
            {regiao:"Sul", credenciadas:138, total:194}
        ],
        ciuca_fonte: {
            fonte: "MCTI · Relatório Integrado de Gestão 2024 / CIUCA",
            url: "https://www.gov.br/mcti/pt-br/acesso-a-informacao/prestacao-de-contas/2024/2025-04-18_rgi-mcti-2024_parte-i_vf.pdf",
            nota: "Dados extraídos do Power BI em 21/03/2025. São instituições cadastradas/credenciadas no CIUCA, não quantidade de animais utilizados."
        },
        limitacao: "O total de animais utilizados é apresentado nacionalmente no relatório do CONCEA. Para recorte territorial, o Observatório usa a distribuição de instituições do CIUCA, porque não foi localizada no relatório oficial uma série pública comparável de animais utilizados por UF."
    },

    maus_tratos: {
        estados: [
            {
                uf: "Minas Gerais",
                casos: "7.644",
                status: "Ocorrências fiscalizadas FAU-33",
                ano: 2023,
                fonte: "SEMAD/MG · Diagnóstico Ambiental 2024",
                link: "https://meioambiente.mg.gov.br/documents/d/semad/diagnostico_ambiental_do_estado-2024-pdf"
            },
            {
                uf: "Rio de Janeiro",
                casos: "252",
                status: "Registros de crueldade e maus-tratos",
                ano: 2022,
                fonte: "Instituto de Segurança Pública do RJ",
                link: "https://www.rj.gov.br/isp/node/669"
            }
        ],
        nota: "Os recortes estaduais usam sistemas, conceitos e escopos diferentes; por isso, os valores não são somados nem extrapolados para uma estimativa nacional.",
        lei: {
            titulo: "Lei nº 14.064/2020 (Lei Sansão)",
            texto: "Para maus-tratos contra cão ou gato, a Lei nº 14.064/2020 estabeleceu pena de reclusão de 2 a 5 anos, multa e proibição da guarda.",
            fonte: "Presidência da República · Planalto",
            url: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l14064.htm"
        }
    },

    abandono: {
        titulo: "Animais abandonados ou resgatados sob tutela de organizações",
        total: "184.960",
        ano: 2021,
        fonte: "Instituto Pet Brasil via CFMV",
        url: "https://www.cfmv.gov.br/combater-os-maus-tratos-aos-animais-e-um-dever-de-todos/comunicacao/noticias/2023/05/04/",
        indicadores: [
            {
                label: "Animais sob tutela",
                value: "184.960",
                desc: "Animais abandonados ou resgatados após maus-tratos que estavam sob tutela de ONGs ou grupos de protetores no levantamento citado pelo CFMV."
            },
            {
                label: "Distribuição por espécie",
                value: "96% cães · 4% gatos",
                desc: "No mesmo recorte, 177.562 eram cães e 7.398 eram gatos."
            },
            {
                label: "ONGs pesquisadas",
                value: "400",
                desc: "O estudo do Instituto Pet Brasil citado pelo CFMV reuniu informações de 400 organizações."
            },
            {
                label: "Situação de origem",
                value: "60% maus-tratos · 40% abandono",
                desc: "Entre os animais do estudo, cerca de 60% foram vítimas de maus-tratos e 40% foram encontrados em situação de abandono."
            }
        ],
        nota: "Este dado descreve o universo sob tutela das organizações e protetores incluídos no levantamento; não deve ser apresentado como estimativa do total de animais abandonados nas ruas do Brasil."
    },

    entretenimento: {
        referencias: [
            {
                titulo: "Fauna silvestre em cativeiro",
                valor: "SisFauna",
                texto: "O SisFauna é o sistema eletrônico federal de gestão e controle de empreendimentos e atividades relacionados ao uso e manejo de fauna silvestre em cativeiro.",
                fonte: "IBAMA · SisFauna",
                url: "https://www.gov.br/ibama/pt-br/servicos/sistemas/sisfauna/mais-informacoes-sobre-o-sisfauna"
            },
            {
                titulo: "Jardins zoológicos",
                valor: "Categoria regulada",
                texto: "O IBAMA inclui jardim zoológico entre as categorias de empreendimentos utilizadores de fauna silvestre e mantém normas específicas de autorização e controle.",
                fonte: "IBAMA · Empreendimentos utilizadores de fauna",
                url: "https://www.gov.br/ibama/pt-br/servicos/autorizacoes/fauna/empreendimentos-utilizadores-de-fauna-silvestre"
            },
            {
                titulo: "Aquariofilia",
                valor: "Base normativa IBAMA",
                texto: "O IBAMA mantém uma página específica de normas e orientações para aquariofilia e biodiversidade aquática.",
                fonte: "IBAMA · Aquariofilia",
                url: "https://www.gov.br/ibama/pt-br/assuntos/biodiversidade/biodiversidade-aquatica/aquariofilia"
            },
            {
                titulo: "Rodeios",
                valor: "Lei nº 10.519/2002",
                texto: "A Lei nº 10.519/2002 estabelece normas gerais para a realização de rodeios de animais e regras de defesa sanitária animal.",
                fonte: "Presidência da República · Planalto",
                url: "https://www.planalto.gov.br/ccivil_03/leis/2002/l10519.htm"
            }
        ],
        bases_plantel: [
            { nome: "SisFauna · Plantel Exato", tipo: "Contagem precisa", url: "https://dadosabertos.ibama.gov.br/dataset/sisfauna-plantel-exato", descricao: "Registra plantel de criadouros, zoológicos e comerciantes quando a contagem individual é possível." },
            { nome: "SisFauna · Plantel Estimado", tipo: "Contagem estimada", url: "https://dadosabertos.ibama.gov.br/dataset/sisfauna-plantel-estimado", descricao: "Registra plantel quando as características do recinto ou manejo impedem a contagem precisa." }
        ],
        nota: "O IBAMA disponibiliza bases públicas de plantel exato e estimado. Elas incluem zoológicos, criadouros e comerciantes; por isso, não é metodologicamente correto somar tudo e chamar o resultado de 'animais em entretenimento'. O Observatório mantém os links das bases e só publicará um total por UF após filtrar especificamente a categoria de jardim zoológico/empreendimento recreativo."
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
            {
                nome: "Projeto Escola Amiga dos Animais — Rio Grande do Sul",
                alcance: "A Lei nº 15.337/2019 instituiu o Projeto Escola Amiga dos Animais na rede pública escolar estadual, com ações voltadas à educação ambiental, bem-estar de animais domésticos, adoção consciente e guarda responsável.",
                status: "Lei estadual",
                fonte: "Diário Oficial do Estado do RS · Lei nº 15.337/2019",
                link: "https://www.pge.rs.gov.br/upload/arquivos/201910/03092402-doe-ultimo-03102019.pdf"
            },
            {
                nome: "Articulação nacional da OAB em defesa dos animais",
                alcance: "A Comissão Especial de Proteção e Defesa dos Animais do Conselho Federal da OAB realizou reunião com presidentes de comissões seccionais para alinhar estratégias e fortalecer a atuação nacional.",
                status: "Articulação institucional",
                fonte: "Conselho Federal da OAB",
                link: "https://www.oab.org.br/noticia/63741/comissao-especial-da-oab-articula-acoes-nacionais-para-a-defesa-dos-direitos-dos-animais"
            },
            {
                nome: "Bem-estar animal nas Diretrizes de Medicina Veterinária",
                alcance: "A Resolução CNE/CES nº 3/2019 inclui, entre as competências da formação veterinária, avaliar o grau de bem-estar animal por indicadores e planejar estratégias de melhoria com ênfase na bioética.",
                status: "Diretrizes Curriculares Nacionais",
                fonte: "MEC/CNE · Resolução CNE/CES nº 3/2019",
                link: "https://portal.mec.gov.br/docman/agosto-2019-pdf/120701-rces003-19/file"
            }
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
            data: "O cruzamento coloca lado a lado dois recortes de naturezas diferentes: o faturamento de R$ 75,4 bilhões do setor pet em 2024 e o registro de 6,28 bilhões de frangos abatidos em 2023 em estabelecimentos sob inspeção sanitária. A aproximação é analítica e não transforma esses indicadores em uma mesma métrica.",
            fontes: [
                { label: "ABEMPET (Abinpet) · Mercado pet 2024", url: "https://abinpet.org.br/informacoes-gerais-do-setor/" },
                { label: "IBGE · Pesquisa Trimestral do Abate 2023", url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/39452-em-2023-abate-de-bovinos-cresce-e-o-de-suinos-e-frangos-atingem-recordes" }
            ]
        },
        {
            id: "X009",
            title: "Mudança na presença de cães e gatos nos domicílios",
            data: "Entre a PNS 2013 e a PNS 2019, a proporção de domicílios com cães passou de 44,3% para 46,1%, enquanto a proporção de domicílios com gatos passou de 17,7% para 19,3%. O Observatório apresenta a mudança sem atribuir causalidade urbana ou econômica não demonstrada pelas pesquisas.",
            fontes: [
                { label: "IBGE · PNS 2013", url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/10138-pns-2013-tres-em-cada-quatro-brasileiros-costumam-buscar-atendimento-medico-na-rede-publica-de-saude" },
                { label: "IBGE · PNS 2019", url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/28793-pns-2019-sete-em-cada-dez-pessoas-que-procuram-o-mesmo-servico-de-saude-vao-a-rede-publica" }
            ]
        },
        {
            id: "X010",
            title: "Escala do abate formal em 2023",
            data: "O IBGE registrou crescimento de 13,7% no abate de bovinos em 2023, além de recordes no abate de suínos e frangos. O cruzamento serve para comparar escalas entre espécies dentro da mesma pesquisa oficial, sem inferir consumo individual ou exportações a partir desses números.",
            fontes: [
                { label: "IBGE · Pesquisa Trimestral do Abate 2023", url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/39452-em-2023-abate-de-bovinos-cresce-e-o-de-suinos-e-frangos-atingem-recordes" }
            ]
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
    // O KPI nacional permanece vinculado ao Censo DGP 2023 (42.852 grupos).
    // `uniqueCount` é usado apenas na seção Pesquisa para indicar a seleção temática AlterECO.
    db.pesquisa.total_grupos_tematicos = uniqueCount;
})();
