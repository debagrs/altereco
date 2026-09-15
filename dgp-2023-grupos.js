/**
 * AlterECO · Base nominal temática DGP/CNPq
 * Referência estatística: Censo DGP 2023.
 *
 * Importante: o CNPq informa que o Censo 2023 reúne 42.852 grupos no país,
 * mas a página oficial que deveria disponibilizar o XML de 2023 atualmente
 * redireciona para o painel Power BI. Por isso, esta NÃO é uma cópia integral
 * dos 42.852 registros: é uma base nominal temática, verificável e expansível,
 * construída com espelhos DGP e páginas institucionais que identificam os grupos.
 *
 * Para ampliar a lista: adicione um objeto em `grupos` e informe uma ou mais
 * categorias em `areas`. Os totais e os modais do Observatório são calculados
 * automaticamente a partir deste único arquivo.
 */
window.ALTERECO_DGP_2023 = {
    meta: {
        ano_referencia: 2023,
        total_grupos_brasil: 42852,
        total_instituicoes_brasil: 587,
        fonte_censo: "CNPq · Censo DGP 2023",
        fonte_censo_url: "https://lattes.cnpq.br/web/dgp/censos2",
        consulta_corrente_url: "https://dgp.cnpq.br/dgp/faces/consulta/consulta_parametrizada.jsf",
        painel_2023_url: "https://app.powerbi.com/view?pageName=ReportSectionaf31612e05234cb0b779&r=eyJrIjoiYTg4MGFmNWQtMjQ4Yi00ZmFhLTgzMmMtMDFiMmI3YzFmNmEwIiwidCI6IjkyYzBjZmE5LTdlOTEtNGVhZC1hYzI5LWNkNDRhMjM4OWIwMSJ9",
        atualizado_em: "2026-08-20",
        metodologia: "Seleção nominal temática consolidada a partir de espelhos do DGP/CNPq, páginas institucionais e associações científicas. Um mesmo grupo pode integrar mais de uma categoria."
    },
    areas: ["Bem-estar Animal", "Direito Animal", "Ética e Senciência"],
    grupos: [
        {
            id: "labea-ufpr",
            nome: "Laboratório de Bem-estar Animal (LABEA)",
            instituicao: "Universidade Federal do Paraná (UFPR)",
            uf: "PR",
            areas: ["Bem-estar Animal", "Ética e Senciência"],
            temas: ["bem-estar animal", "dor", "maus-tratos", "interação humano-animal"],
            aderencia: "núcleo central",
            fonte: "UFPR · grupo de pesquisa do CNPq",
            fonte_url: "https://agrarias.ufpr.br/agronomia/linhas-de-pesquisa-2/",
            link: "https://dgp.cnpq.br/dgp/espelhogrupo/4960173352345646"
        },
        {
            id: "leta-ufsc",
            nome: "Laboratório de Etologia Aplicada e Bem-Estar Animal (LETA)",
            instituicao: "Universidade Federal de Santa Catarina (UFSC)",
            uf: "SC",
            lider: "Maria José Hötzel; Luiz Carlos Pinheiro Machado Filho",
            areas: ["Bem-estar Animal", "Ética e Senciência"],
            temas: ["etologia aplicada", "comportamento animal", "bem-estar animal", "agroecologia"],
            aderencia: "núcleo central",
            fonte: "ABZ / DGP-CNPq",
            fonte_url: "https://abz.org.br/grupos-pesquisa-zootecnia/",
            link: "https://dgp.cnpq.br/dgp/espelhogrupo/32333"
        },
        {
            id: "baia-unesp",
            nome: "Instalações, Ambiência e Bem-Estar Animal (BAIA)",
            instituicao: "Universidade Estadual Paulista (UNESP)",
            uf: "SP",
            lider: "Danilo Florentino Pereira; Leda Gobbo de Freitas Bueno",
            areas: ["Bem-estar Animal"],
            temas: ["ambiência", "instalações", "bem-estar animal"],
            aderencia: "núcleo central",
            fonte: "ABZ / DGP-CNPq",
            fonte_url: "https://abz.org.br/grupos-pesquisa-zootecnia/",
            link: "https://dgp.cnpq.br/dgp/espelhogrupo/5534"
        },
        {
            id: "bioclimatologia-udesc",
            nome: "Bioclimatologia, Etologia, Ambiência e Produção Animal",
            instituicao: "Universidade do Estado de Santa Catarina (UDESC)",
            uf: "SC",
            lider: "Ana Luiza Bachmann Schogor; Diovani Paiano",
            areas: ["Bem-estar Animal"],
            temas: ["bioclimatologia", "etologia", "ambiência", "produção animal"],
            aderencia: "núcleo central",
            fonte: "UDESC / DGP-CNPq",
            fonte_url: "https://www.udesc.br/ceo/ppgzoo",
            link: "https://dgp.cnpq.br/dgp/espelhogrupo/369791"
        },
        {
            id: "producao-animal-ifes",
            nome: "Produção Animal",
            instituicao: "Instituto Federal do Espírito Santo (IFES) · Campus Alegre",
            uf: "ES",
            lider: "Aparecida de Fátima Madella de Oliveira",
            areas: ["Bem-estar Animal"],
            temas: ["comportamento e bem-estar animal", "produção animal", "etologia"],
            aderencia: "linha temática",
            fonte: "IFES SigPesq / DGP-CNPq",
            fonte_url: "https://sigpesq.ifes.edu.br/publico/GrupoPesquisa.aspx?cod=72",
            link: "https://dgp.cnpq.br/dgp/espelhogrupo/5665228540020869"
        },
        {
            id: "ruminantia-ifes",
            nome: "Ruminantia",
            instituicao: "Instituto Federal do Espírito Santo (IFES) · Campus Santa Teresa",
            uf: "ES",
            lider: "Alberto Chambela Neto",
            areas: ["Bem-estar Animal"],
            temas: ["bem-estar e sanidade animal", "ruminantes", "etologia"],
            aderencia: "linha temática",
            fonte: "IFES SigPesq / DGP-CNPq",
            fonte_url: "https://sigpesq.ifes.edu.br/publico/GrupoPesquisa.aspx?cod=310",
            link: "https://dgp.cnpq.br/dgp/espelhogrupo/2442319522214267"
        },
        {
            id: "aquicultura-ambiencia-ifes",
            nome: "Aquicultura e Ambiência Animal",
            instituicao: "Instituto Federal do Espírito Santo (IFES) · Campus Itapina",
            uf: "ES",
            lider: "Marcelo Gomes de Araujo",
            areas: ["Bem-estar Animal"],
            temas: ["ambiência", "bem-estar animal", "aquicultura", "avicultura"],
            aderencia: "linha temática",
            fonte: "IFES SigPesq / DGP-CNPq",
            fonte_url: "https://sigpesq.ifes.edu.br/publico/GrupoPesquisa.aspx?cod=267",
            link: "https://dgp.cnpq.br/dgp/espelhogrupo/6311525826740169"
        },
        {
            id: "sadbem-uffs",
            nome: "Saúde, Diagnóstico e Bem-Estar Animal na Fronteira Sul (SADBEM)",
            instituicao: "Universidade Federal da Fronteira Sul (UFFS) · Campus Realeza",
            uf: "PR",
            lider: "Vanessa Silva Retuci",
            areas: ["Bem-estar Animal"],
            temas: ["saúde animal", "diagnóstico", "bem-estar animal"],
            aderencia: "núcleo central",
            fonte: "UFFS · grupos cadastrados no DGP/CNPq",
            fonte_url: "https://www.uffs.edu.br/uffs/grupos-de-pesquisa/grupos-de-pesquisa-cadastrados-no-diretorio-do-cnpq",
            link: "https://www.uffs.edu.br/uffs/grupos-de-pesquisa/grupos-de-pesquisa-cadastrados-no-diretorio-do-cnpq"
        },
        {
            id: "producao-bem-estar-unijui",
            nome: "Grupo de Pesquisa em Produção e Bem-Estar Animal",
            instituicao: "Universidade Regional do Noroeste do Estado do Rio Grande do Sul (UNIJUÍ)",
            uf: "RS",
            lider: "Denize da Rosa Fraga",
            areas: ["Bem-estar Animal"],
            temas: ["etologia", "produção e bem-estar animal", "nutrição", "saúde animal"],
            aderencia: "núcleo central",
            fonte: "UNIJUÍ",
            fonte_url: "https://www.unijui.edu.br/comunica/pesquisa/36426-grupo-de-pesquisa-da-unijui-desenvolve-estudo-visando-bem-estar-animal",
            link: "https://www.unijui.edu.br/comunica/pesquisa/36426-grupo-de-pesquisa-da-unijui-desenvolve-estudo-visando-bem-estar-animal"
        },
        {
            id: "neambe-ufc",
            nome: "Núcleo de Estudos em Ambiência Agrícola e Bem-Estar Animal (NEAMBE)",
            instituicao: "Universidade Federal do Ceará (UFC)",
            uf: "CE",
            areas: ["Bem-estar Animal"],
            temas: ["ambiência agrícola", "bem-estar animal", "engenharia agrícola"],
            aderencia: "núcleo central",
            fonte: "PPGEA/UFC / DGP-CNPq",
            fonte_url: "https://ppgea.ufc.br/",
            link: "https://dgp.cnpq.br/dgp/espelhogrupo/2446906955557977"
        },
        {
            id: "bioetica-ambiental-pucpr",
            nome: "Grupo de Pesquisa Bioética Ambiental",
            instituicao: "Pontifícia Universidade Católica do Paraná (PUCPR)",
            uf: "PR",
            lider: "Marta Luciane Fischer",
            areas: ["Bem-estar Animal", "Ética e Senciência"],
            temas: ["bioética ambiental", "ética no uso de animais", "bem-estar animal", "relações humano-animal"],
            aderencia: "núcleo central",
            fonte: "PUCPR · grupo CNPq/PUCPR",
            fonte_url: "https://www.pucpr.br/docente-graduacao/marta-luciane-fischer-373",
            link: "https://www.pucpr.br/docente-graduacao/marta-luciane-fischer-373"
        },
        {
            id: "animais-silvestres-uesc",
            nome: "Grupo de Pesquisas em Animais Silvestres",
            instituicao: "Universidade Estadual de Santa Cruz (UESC)",
            uf: "BA",
            lider: "Selene Siqueira da Cunha Nogueira; Sérgio Luiz Gama Nogueira Filho",
            areas: ["Bem-estar Animal", "Ética e Senciência"],
            temas: ["comportamento animal", "bem-estar animal", "animais silvestres", "etologia"],
            aderencia: "linha temática",
            fonte: "Sociedade Brasileira de Etologia · Etologia no Brasil",
            fonte_url: "https://www.etologiabrasil.org.br/etologia/",
            link: "https://www.etologiabrasil.org.br/etologia/"
        },
        {
            id: "gpda-ufsm",
            nome: "Grupo de Pesquisa em Direitos Animais (GPDA)",
            instituicao: "Universidade Federal de Santa Maria (UFSM)",
            uf: "RS",
            lider: "Nina Trícia Disconzi Rodrigues",
            areas: ["Direito Animal", "Ética e Senciência"],
            temas: ["direito animal", "ética e direitos animais", "constitucionalismo", "bioética"],
            aderencia: "núcleo central",
            fonte: "PPGD/UFSM · grupo certificado pelo CNPq",
            fonte_url: "https://www.ufsm.br/cursos/pos-graduacao/santa-maria/ppgd/grupos-de-pesquisa",
            link: "https://www.ufsm.br/cursos/pos-graduacao/santa-maria/ppgd/grupos-de-pesquisa"
        },
        {
            id: "zoopolis-ufpr",
            nome: "ZOOPOLIS · Núcleo de Pesquisas em Direito Animal",
            instituicao: "Universidade Federal do Paraná (UFPR)",
            uf: "PR",
            lider: "Vicente de Paula Ataide Junior",
            areas: ["Direito Animal", "Ética e Senciência"],
            temas: ["direito animal", "tutela jurisdicional dos animais", "senciência", "pós-humanismo"],
            aderencia: "núcleo central",
            fonte: "PPGD/UFPR / DGP-CNPq",
            fonte_url: "https://ppgd.ufpr.br/category/pesquisa/",
            link: "https://dgp.cnpq.br/dgp/espelhogrupo/5107852604232656"
        },
        {
            id: "nipeda-ufba",
            nome: "Núcleo de Pesquisa e Extensão em Pós-Humanismo, Meio Ambiente e Direito Animal (NIPEDA)",
            instituicao: "Universidade Federal da Bahia (UFBA)",
            uf: "BA",
            lider: "Heron José de Santana Gordilho",
            areas: ["Direito Animal", "Ética e Senciência"],
            temas: ["direito animal", "pós-humanismo", "bioética", "meio ambiente"],
            aderencia: "núcleo central",
            fonte: "PPGD/UFBA",
            fonte_url: "https://ppgd.direito.ufba.br/pt-br/linhas-e-grupos-de-pesquisa",
            link: "https://ppgd.direito.ufba.br/pt-br/linhas-e-grupos-de-pesquisa"
        },
        {
            id: "nieda-ufba",
            nome: "Núcleo Interdisciplinar de Ensino, Pesquisa e Extensão em Direitos dos Animais, Meio Ambiente e Pós-Humanismo",
            instituicao: "Universidade Federal da Bahia (UFBA)",
            uf: "BA",
            lider: "Tagore Trajano de Almeida Silva",
            areas: ["Direito Animal", "Ética e Senciência"],
            temas: ["direitos dos animais", "pós-humanismo", "meio ambiente", "ensino"],
            aderencia: "núcleo central",
            fonte: "PPGD/UFBA",
            fonte_url: "https://ppgd.direito.ufba.br/pt-br/linhas-e-grupos-de-pesquisa",
            link: "https://ppgd.direito.ufba.br/pt-br/linhas-e-grupos-de-pesquisa"
        },
        {
            id: "ekoa-ufpr",
            nome: "EKOA · Direito, Movimentos Sociais e Natureza",
            instituicao: "Universidade Federal do Paraná (UFPR)",
            uf: "PR",
            lider: "Katya Regina Isaguirre",
            areas: ["Direito Animal"],
            temas: ["direito animal", "direito ambiental", "natureza", "direitos territoriais"],
            aderencia: "interface temática",
            fonte: "PPGD/UFPR",
            fonte_url: "https://direito.ufpr.br/?page_id=43934",
            link: "https://direito.ufpr.br/?page_id=43934"
        },
        {
            id: "margens-direito-fdsm",
            nome: "Margens do Direito",
            instituicao: "Faculdade de Direito do Sul de Minas (FDSM)",
            uf: "MG",
            lider: "Rafael Lazzarotto Simioni",
            areas: ["Direito Animal"],
            temas: ["direito animal", "animais como sujeitos", "teoria do direito"],
            aderencia: "interface temática",
            fonte: "PPGD/FDSM/CNPq",
            fonte_url: "https://www.fdsm.edu.br/noticia?cod=8626",
            link: "https://www.fdsm.edu.br/noticia?cod=8626"
        },
        {
            id: "bioetica-biotecnologia-pucpr",
            nome: "Grupo de Pesquisa Bioética e Biotecnologia",
            instituicao: "Pontifícia Universidade Católica do Paraná (PUCPR)",
            uf: "PR",
            lider: "Anor Sganzerla",
            areas: ["Ética e Senciência"],
            temas: ["bioética", "bioética animal", "biotecnologia", "ética"],
            aderencia: "interface temática",
            fonte: "PUCPR / grupo de pesquisa CNPq",
            fonte_url: "https://www.pucpress.com.br/publicacoes/bioetica-de-v-r-potter-conceitos-usos-e-significado/",
            link: "https://www.pucpress.com.br/publicacoes/bioetica-de-v-r-potter-conceitos-usos-e-significado/"
        }
    ]
};
