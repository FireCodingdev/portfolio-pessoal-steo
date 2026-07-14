// Conteúdo padrão do site. Usado como valor inicial (seed) e como
// fallback caso o banco de dados ainda não tenha sido configurado.

export type HeroStat = { number: string; label: string };

export type HeroContent = {
  badge: string;
  saudacao: string;
  nome: string;
  cargo: string;
  descricao: string;
  fotoUrl: string;
  stats: HeroStat[];
  botaoPrimarioTexto: string;
  botaoPrimarioLink: string;
  botaoSecundarioTexto: string;
  botaoSecundarioLink: string;
};

export type AboutContent = {
  nome: string;
  curso: string;
  localizacao: string;
  status: string;
  foco: string;
  ingles: string;
  paragrafo1: string;
  paragrafo2: string;
  paragrafo3: string;
  curriculoUrl: string;
};

export type SkillCategory = {
  id: string;
  icone: string; // classe font-awesome, ex: fa-solid fa-code
  titulo: string;
  tags: string[];
};

export type Project = {
  id: string;
  emoji: string;
  tags: string[];
  nome: string;
  descricao: string;
  linkCodigo: string;
  linkDemo: string;
};

export type ExperienceItem = {
  id: string;
  cargo: string;
  empresa: string;
  descricao: string;
};

export type EducationItem = {
  id: string;
  icone: string;
  periodo: string;
  titulo: string;
  instituicao: string;
};

export type ContactContent = {
  textoIntro: string;
  email: string;
  linkedin: string;
  linkedinLabel: string;
  github: string;
  githubLabel: string;
  whatsapp: string;
  whatsappLabel: string;
};

export type SiteMeta = {
  tituloAba: string;
  logoTexto: string;
  logoDestaque: string;
  rodapeTexto: string;
};

export const defaultHero: HeroContent = {
  badge: "Disponível para oportunidades",
  saudacao: "Olá, eu sou",
  nome: "Stefanny Ferreira",
  cargo: "Analista e Desenvolvedor de Sistemas",
  descricao:
    "Profissional de ADS apaixonada por criar soluções digitais inovadoras. Transformo ideias complexas em experiências simples, funcionais e elegantes.",
  fotoUrl: "/imagens/foto-da-ste.jpeg",
  stats: [
    { number: "3+", label: "Anos de Estudo" },
    { number: "10+", label: "Projetos" },
    { number: "5+", label: "Tecnologias" },
  ],
  botaoPrimarioTexto: "Ver Projetos",
  botaoPrimarioLink: "#projects",
  botaoSecundarioTexto: "Entrar em Contato",
  botaoSecundarioLink: "#contact",
};

export const defaultAbout: AboutContent = {
  nome: "Stefanny Ferreira",
  curso: "ADS",
  localizacao: "Brasil",
  status: "Disponível",
  foco: "Dev & Análise",
  ingles: "Intermediário",
  paragrafo1:
    "Sou estudante de Análise e Desenvolvimento de Sistemas, com grande interesse em desenvolvimento web, banco de dados e soluções tecnológicas para o dia a dia.",
  paragrafo2:
    "Durante minha formação, adquiri experiência prática com projetos acadêmicos e pessoais, sempre buscando aplicar as melhores práticas de programação e design.",
  paragrafo3:
    "Meu objetivo é me tornar um profissional completo, capaz de atuar desde a análise de requisitos até a entrega de software funcional e de qualidade.",
  curriculoUrl: "/curriculo.pdf",
};

export const defaultSkills: SkillCategory[] = [
  {
    id: "front",
    icone: "fa-solid fa-code",
    titulo: "Front-end",
    tags: ["HTML5", "CSS3", "JavaScript", "React", "Bootstrap", "Tailwind"],
  },
  {
    id: "back",
    icone: "fa-solid fa-server",
    titulo: "Back-end",
    tags: ["Python", "Java", "Node.js", "PHP", "REST APIs"],
  },
  {
    id: "db",
    icone: "fa-solid fa-database",
    titulo: "Banco de Dados",
    tags: ["MySQL", "PostgreSQL", "SQL Server", "MongoDB", "Firebase"],
  },
  {
    id: "ux",
    icone: "fa-solid fa-diagram-project",
    titulo: "Análise & UX",
    tags: ["UML", "BPMN", "Figma", "Requisitos", "Prototipação"],
  },
  {
    id: "devops",
    icone: "fa-brands fa-git-alt",
    titulo: "Ferramentas & DevOps",
    tags: ["Git", "GitHub", "VS Code", "Postman", "Docker"],
  },
  {
    id: "soft",
    icone: "fa-solid fa-brain",
    titulo: "Soft Skills",
    tags: ["Trabalho em equipe", "Comunicação", "Proatividade", "Resolução de problemas"],
  },
];

export const defaultProjects: Project[] = [
  {
    id: "p1",
    emoji: "🛒",
    tags: ["Web", "Full Stack"],
    nome: "Sistema de E-commerce",
    descricao:
      "Plataforma completa de vendas online com carrinho, autenticação de usuários e painel administrativo para gerenciamento de produtos e pedidos.",
    linkCodigo: "#",
    linkDemo: "#",
  },
  {
    id: "p2",
    emoji: "📊",
    tags: ["Dashboard", "Data"],
    nome: "Dashboard Analítico",
    descricao:
      "Painel de visualização de dados com gráficos interativos, relatórios em tempo real e integração com APIs externas para monitoramento de KPIs.",
    linkCodigo: "#",
    linkDemo: "#",
  },
  {
    id: "p3",
    emoji: "📱",
    tags: ["Mobile", "App"],
    nome: "App de Tarefas",
    descricao:
      "Aplicativo de gerenciamento de tarefas com categorias, notificações e sincronização em nuvem para produtividade diária.",
    linkCodigo: "#",
    linkDemo: "#",
  },
  {
    id: "p4",
    emoji: "🏥",
    tags: ["Sistema", "BD"],
    nome: "Sistema de Clínica",
    descricao:
      "Sistema de agendamentos e prontuário eletrônico com controle de pacientes, consultas, receitas e relatórios gerenciais.",
    linkCodigo: "#",
    linkDemo: "#",
  },
  {
    id: "p5",
    emoji: "🤖",
    tags: ["Python", "IA"],
    nome: "Chatbot Inteligente",
    descricao:
      "Bot de atendimento automatizado com NLP, integração com WhatsApp e painel de analytics de conversas.",
    linkCodigo: "#",
    linkDemo: "#",
  },
  {
    id: "p6",
    emoji: "🌐",
    tags: ["Landing Page", "UI/UX"],
    nome: "Landing Page Moderna",
    descricao:
      "Página de alta conversão com design responsivo, animações CSS avançadas e integração com ferramentas de marketing digital.",
    linkCodigo: "#",
    linkDemo: "#",
  },
];

export const defaultExperience: ExperienceItem[] = [
  {
    id: "e1",
    cargo: "Next Call Center Ltda. – São Paulo, SP",
    empresa: "Teleatendente",
    descricao:
      "Atendimento ao cliente via telefone, e-mail e chat e Registro e atualização de dados em sistemas internos.",
  },
  {
    id: "e2",
    cargo: "Supermercado Boa – São Paulo, SP",
    empresa: "Operadora de caixa",
    descricao: "Atendimento ao público e controle de vendas no ponto de caixa.",
  },
];

export const defaultEducation: EducationItem[] = [
  {
    id: "ed1",
    icone: "fa-solid fa-graduation-cap",
    periodo: "2025 – 2026",
    titulo: "Análise e Desenvolvimento de Sistemas",
    instituicao: "Universidade Cidade de São Paulo – UNICID · Tecnólogo",
  },
  {
    id: "ed2",
    icone: "fa-solid fa-certificate",
    periodo: "",
    titulo: "Pacote Office Avançado",
    instituicao: "Curso · Certificação",
  },
  {
    id: "ed3",
    icone: "fa-solid fa-shield-halved",
    periodo: "",
    titulo: "Introdução à Programação com Python e HTML",
    instituicao: "Curso em andamento · Certificação",
  },
  {
    id: "ed4",
    icone: "fa-brands fa-python",
    periodo: "",
    titulo: "Conhecimentos em ERP, CRM e SCR",
    instituicao: "Nível iniciante",
  },
];

export const defaultContact: ContactContent = {
  textoIntro:
    "Seja para um projeto, uma vaga ou apenas para trocar uma ideia sobre tecnologia — fico feliz em receber sua mensagem.",
  email: "lealstefany508@gmail.com",
  linkedin:
    "https://www.linkedin.com/in/stefany-ferreira-6176b7173?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  linkedinLabel: "https://www.linkedin.com/in/stefany-ferreira",
  github: "https://github.com/lealstefany508-del",
  githubLabel: "https://github.com/lealstefany508-del",
  whatsapp: "+5511932056685",
  whatsappLabel: "+55 (11) 932056685",
};

export const defaultSiteMeta: SiteMeta = {
  tituloAba: "Meu Portfólio",
  logoTexto: "Meu",
  logoDestaque: "Portfólio",
  rodapeTexto: "© 2025 · Feito com ♥ e muito código",
};

export const defaultContentMap = {
  hero: defaultHero,
  about: defaultAbout,
  skills: defaultSkills,
  projects: defaultProjects,
  experience: defaultExperience,
  education: defaultEducation,
  contact: defaultContact,
  siteMeta: defaultSiteMeta,
};

export type ContentMap = typeof defaultContentMap;
export type ContentSection = keyof ContentMap;

export const CONTENT_SECTIONS: ContentSection[] = [
  "hero",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "contact",
  "siteMeta",
];
