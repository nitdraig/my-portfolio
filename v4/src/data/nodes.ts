export type NodeKey =
  | "AI"
  | "CODE"
  | "PROJECTS"
  | "MVP"
  | "RESOURCES"
  | "CLIENTS"
  | "ABOUT"
  | "REASONING"
  | "ENVIRONMENT"
  | "AIDEV";

export const CONCEPTS: NodeKey[] = [
  "AI",
  "CODE",
  "PROJECTS",
  "MVP",
  "RESOURCES",
  "CLIENTS",
  "ABOUT",
  "REASONING",
  "ENVIRONMENT",
  "AIDEV",
];

export type ContentItem =
  | { title: string; text: string }
  | { name: string; meta: string; desc: string; links: { label: string; url: string }[] }
  | { title: string; author: string; type: string; link: string }
  | { quote: string; author: string; role: string; companyName?: string; companyUrl?: string }
  | { date: string; role: string; company: string; url?: string };

export type NodeContent =
  | { type: "list"; title: string; items: { title: string; text: string }[] }
  | { type: "tools"; title: string; items: { name: string; meta: string; desc: string; links: { label: string; url: string }[] }[] }
  | { type: "projects" }
  | { type: "resources"; title: string; items: { title: string; author: string; type: string; link: string }[] }
  | { type: "testimonials"; title: string; items: { quote: string; author: string; role: string; companyName?: string; companyUrl?: string }[] }
  | { type: "timeline"; title: string; items: { date: string; role: string; company: string; url?: string }[] };

export type NodeDetail = {
  intro: string;
  sections: { title: string; text: string }[];
  links?: { label: string; url: string }[];
};

export type BilingualText = { es: string; en: string };

export type NodeData = {
  tag: string;
  title: BilingualText;
  desc: string;
  chips: string[];
  content: NodeContent;
  detail: NodeDetail;
};

export const NODE_DATA: Record<NodeKey, NodeData> = {
  AI: {
    tag: "CAPABILITY",
    title: { es: "Inteligencia Artificial", en: "Artificial Intelligence" },
    desc: "No uso la IA para generar más rápido. La uso para pensar con más disciplina. Diseñé Lexis, un ecosistema propio de agentes para desarrollo de software.",
    chips: ["Lexis", "Agents", "Context Engineering", "Anti-prompt-theater"],
    content: {
      type: "list",
      title: "Cómo uso la IA",
      items: [
        { title: "Disciplina sobre velocidad", text: "La IA no es un mago al que le pedís un deseo, es un colaborador técnico al que hay que darle contexto, roles, restricciones y criterios de revisión." },
        { title: "Ecosistema Lexis", text: "Ecosistema propio de agentes especializados que no premia la velocidad ciega sino el criterio. Cada agente tiene un rol definido y boundaries claros." },
        { title: "Context Engineering", text: "No importa tanto qué le pedís a la IA, importa cómo se lo pedís y qué controles le ponés alrededor. Escribí un ebook completo sobre esto." },
        { title: "La escalera", text: "¿Esto necesita existir? ¿Ya lo resuelve el lenguaje? ¿Ya lo resuelve algo instalado? ¿Puede ser una sola línea? Solo si nada alcanza, se construye código nuevo." },
      ],
    },
    detail: {
      intro: "Acá es donde probablemente me diferencio más, y prefiero ser honesto en vez de vendedor: no uso la IA para generar más rápido. La uso para pensar con más disciplina. Le llamo anti-teatro de prompts: la IA no es un mago, es un colaborador técnico.",
      sections: [
        { title: "Anti-teatro de prompts", text: "La IA no es un mago al que le pedís un deseo, es un colaborador técnico al que hay que darle contexto, roles, restricciones y criterios de revisión, igual que a cualquier persona del equipo. Antes de que un agente escriba una sola línea, tiene que pasar por una escalera de decisión." },
        { title: "La escalera", text: "¿Esto necesita existir? (YAGNI). ¿Stdlib lo hace? ¿La plataforma lo resuelve? ¿Ya hay algo instalado? ¿Puede ser una sola línea? Solo si nada de eso alcanza, se construye código nuevo — el mínimo que funciona bajo condiciones reales." },
        { title: "Context Engineering", text: "No importa tanto qué le pedís a la IA, importa cómo se lo pedís y qué controles le ponés alrededor. Escribí un ebook completo sobre esto porque me lo preguntan seguido. El criterio no se delega." },
      ],
      links: [
        { label: "Ebook Context Engineering", url: "https://skipy.click/wj3l7p" },
        { label: "Ecosistema Lexis", url: "https://lexis-two.excelso.xyz" },
      ],
    },
  },
  CODE: {
    tag: "STACK",
    title: { es: "Código", en: "Code" },
    desc: "Stack moderno, pero la tecnología nunca es el punto de partida. El punto de partida es siempre: qué es lo mínimo que resuelve esto de verdad.",
    chips: ["TypeScript", "React", "Next.js", "Node.js"],
    content: {
      type: "tools",
      title: "Herramientas open source",
      items: [
        { name: "Lexis", meta: "Multi-agent ecosystem · TypeScript", desc: "Ecosistema de agentes para shipping de apps web con disciplina de ingeniería. Planificación, implementación, review, refactor y seguridad coordinados.", links: [{ label: "GitHub", url: "https://github.com/nitdraig/lexis-two" }] },
        { name: "Encrypt-D", meta: "Folder encryption · Windows", desc: "Gestor profesional de carpetas encriptadas con AES-256-GCM. Parte de Excelso Open.", links: [{ label: "GitHub", url: "https://github.com/nitdraig/encrypt-d" }] },
        { name: "Skipy", meta: "Developer multi-tool · Web", desc: "Multi-tool web open-source para simplificar tareas repetitivas de developers, QA, DevOps e IT.", links: [{ label: "GitHub", url: "https://github.com/nitdraig/skipy" }] },
      ],
    },
    detail: {
      intro: "Stack moderno — React, Next.js, Node.js, TypeScript, Python — pero la tecnología nunca es el punto de partida. El punto de partida es siempre: qué es lo mínimo que resuelve esto de verdad. Prefiero un one-liner aburrido a una abstracción elegante que nadie pidió.",
      sections: [
        { title: "Frontend", text: "React, Next.js, Tailwind CSS, TanStack Query. Server components cuando aportan, client components solo cuando hay interactividad. Componentes compostables, nada más." },
        { title: "Backend", text: "Node.js con Express o Fastify, TypeScript estricto. APIs REST limpias, validación en boundary, error handling centralizado. MongoDB/Mongoose o Prisma según el caso." },
        { title: "Cómo código", text: "Reviso mis propios cambios buscando sobre-ingeniería antes de que alguien más tenga que hacerlo. Y cuando tomo un atajo consciente, lo dejo marcado en el código para volver después — no escondido, documentado." },
      ],
      links: [
        { label: "GitHub", url: "https://github.com/nitdraig" },
      ],
    },
  },
  PROJECTS: {
    tag: "PORTFOLIO",
    title: { es: "Proyectos", en: "Projects" },
    desc: "20+ productos shippeados. Cada proyecto aporta patrones que se reutilizan en el siguiente. Filtrá por lo que necesites.",
    chips: ["SaaS", "Fintech", "Social", "Automation"],
    content: { type: "projects" },
    detail: {
      intro: "Cada proyecto es un caso de resolución de problemas reales. No hago demos; construyo productos que la gente usa y paga. Aquí van los patrones que más se repiten.",
      sections: [
        { title: "Qué puedo construir", text: "Onboarding en simples pasos, dashboards con métricas accionables, sistemas de notificación por eventos, y MVPs que shippean en semanas, páginas de aterrizaje para tu idea/proyecto/empresa." },
        { title: "Industrias", text: "Healthcare, fintech, education, sustainability, developer tools, management. La industria define las constraints; el patrón de producto se reutiliza." },
        { title: "Cómo trabajo", text: "Descubrimiento → validación → MVP → iteración. Cada fase tiene un entregable tangible. No sigo adelante sin validar la hipótesis clave." },
      ],
      links: [
        { label: "Desarrollar mi idea", url: "#" },
      ],
    },
  },
  MVP: {
    tag: "PROCESS",
    title: { es: "MVP", en: "MVP" },
    desc: "No entrego código: entrego un proceso. Discovery antes de especificación, especificación antes de implementación, revisión antes de cerrar.",
    chips: ["Lean", "Validation", "Ship", "Iterate"],
    content: {
      type: "list",
      title: "Por qué MVP primero",
      items: [
        { title: "Reducir riesgo", text: "Validás la hipótesis clave antes de invertir meses en features no prioritarias." },
        { title: "Rapidez para aprender", text: "En 2-4 semanas tenés usuarios reales dando feedback sobre algo tangible." },
        { title: "Enfoque", text: "Obliga a definir el loop de valor central y descartar lo demás." },
        { title: "Disciplina", text: "Discovery → validación → MVP → iteración. Cada fase tiene un entregable tangible. No sigo adelante sin validar la hipótesis clave." },
      ],
    },
    detail: {
      intro: "Un MVP exitoso no es el que shippea más rápido, sino el que aprende más con menos. No entrego código: entrego un proceso. Discovery antes de especificación, especificación antes de implementación, revisión antes de cerrar. Esa disciplina viene de años colaborando con equipos reales.",
      sections: [
        { title: "El proceso", text: "Week 1: Discovery + hipótesis. Week 2-3: Build el loop central. Week 4: Release a early users + instrumentar. Week 5+: Iterar con datos reales. Cada fase tiene un entregable tangible." },
        { title: "Qué se descarta", text: "Perfiles de usuario elaborados, dashboards admin, settings avanzados, integración con 3ros, y todo lo que no contribuye a validar la hipótesis central." },
        { title: "Métrica de éxito", text: "No es features shipped; es aprendizaje por semana. Si después de 4 semanas no sabés más que al inicio, el MVP falló. Un MVP no es un producto roto; es la versión mínima que permite aprender algo real." },
      ],
    },
  },
  RESOURCES: {
    tag: "LIBRARY",
    title: { es: "Recursos", en: "Resources" },
    desc: "Ebooks gratuitos, blog, publicaciones en LinkedIn y artículos. Context Engineering y Método Freelance, disponibles para descarga.",
    chips: ["Context Engineering", "Método Freelance", "Blog", "LinkedIn"],
    content: {
      type: "resources",
      title: "Recursos",
      items: [
        { title: "Context Engineering: El Arte de Comunicar con IA", author: "Agustín Avellaneda", type: "Ebook · 2025", link: "https://skipy.click/wj3l7p" },
        { title: "Método Freelance: Exportar Soluciones Digitales", author: "Agustín Avellaneda", type: "Ebook · 2026", link: "https://skipy.click/bjgmya" },
        { title: "Blog", author: "Agustín Avellaneda", type: "Artículos", link: "https://blog.agustin.top" },
        { title: "LinkedIn Articles", author: "Agustín Avellaneda", type: "Publicaciones", link: "https://www.linkedin.com/in/avellaneda-agustin/recent-activity/articles/" },
      ],
    },
    detail: {
      intro: "Dos ebooks gratuitos nacidos de proyectos reales, un blog y publicaciones en LinkedIn donde comparto artículos sobre product engineering, IA aplicada y lecciones de proyectos reales.",
      sections: [
        { title: "Context Engineering", text: "Después de aplicar IA en proyectos reales como Fuddy, Mining Talent Net y otros, descubrí que lo que marca la diferencia no es el prompt, es el contexto. Framework paso a paso, templates de uso diario, ejemplos reales y checklist personal." },
        { title: "Método Freelance", text: "Nace de errores reales y proyectos para diversas startups. Cómo construir una forma de trabajar profesional para que tu trabajo viaje más lejos que vos. Las cuatro bases del método, cobros con Payoneer/Stripe/DolarApp, y estrategias para conseguir proyectos." },
        { title: "Blog", text: "Artículos sobre product engineering, IA aplicada, lecciones de proyectos reales y reflections sobre el trabajo como developer y PM." },
        { title: "LinkedIn", text: "Publicaciones periódicas sobre tecnología, product engineering y experiencias reales de desarrollo. Artículos cortos con insights accionables." },
      ],
      links: [
        { label: "Context Engineering (descarga)", url: "https://skipy.click/wj3l7p" },
        { label: "Método Freelance (descarga)", url: "https://skipy.click/bjgmya" },
        { label: "Blog", url: "https://blog.agustin.top" },
        { label: "LinkedIn Articles", url: "https://www.linkedin.com/in/avellaneda-agustin/recent-activity/articles/" },
      ],
    },
  },
  CLIENTS: {
    tag: "TESTIMONIALS",
    title: { es: "Clientes", en: "Clients" },
    desc: "Años colaborando con equipos reales: IcarisTech, InkuA, Fuddy, Experimental Global, Around notes, Cliniweb, Excelso. Los retrabajos justos, sorpresas acordes, plazos que se cumplen.",
    chips: ["Founders", "Teams", "Products"],
    content: {
      type: "testimonials",
      title: "Qué dicen mis clientes",
      items: [
        { quote: "Trabajar con Agustín es una de esas experiencias que confirman que el talento joven está más vivo que nunca. Lo conocí en una charla, le compartí una idea, y al toque estábamos trabajando juntos con una sintonía que no es fácil de lograr. Lo que más destaco no es solo su capacidad de materializar cualquier visión, sino el cuidado estético con el que lo hace: limpio, moderno, con criterio.", author: "Emiliano Salas Porta", role: "CEO", companyName: "MeetMyRace", companyUrl: "https://meetmyrace.com" },
        { quote: "Excepcionalmente talentoso, flexible, buen ojo para frontend y sus detalles. Confiable.", author: "Mike Massoud", role: "CEO", companyName: "AroundNotes", companyUrl: "https://aroundnotes.com" },
        { quote: "Agustín ha demostrado una notoria habilidad para transformar visiones complejas en productos tangibles. Su enfoque es práctico y orientado a resultados, con una responsabilidad y disciplina que garantizan el cumplimiento de los plazos.", author: "Pablo Vegvarel", role: "CEO", companyName: "Experimental Global", companyUrl: "https://experimental.global" },
        { quote: "Agustín es un individuo excepcionalmente inteligente y estratégico, capaz de abordar los desafíos más complejos con claridad y precisión. Su profesionalismo y su capacidad para pensar a largo plazo lo convierten en un contribuyente invaluable a cualquier equipo.", author: "Manuel Esteban Florez Lopez", role: "CTO", companyName: "InkuA", companyUrl: "https://inkua.de" },
      ],
    },
    detail: {
      intro: "El trabajo con clientes se mide en resultados, no en líneas de código. Años colaborando con equipos reales — IcarisTech, InkuA, Fuddy, Experimental Global, Around notes, Cliniweb, Excelso — y se nota en algo simple: los retrabajos justos, sorpresas acordes, plazos que se cumplen.",
      sections: [
        { title: "Cómo colaboro", text: "Trabajo directo con founders y product leads. No necesito un PM intermedio; hablo el lenguaje del negocio y del código. Reuniones cortas, entregables claros, iteración constante." },
        { title: "Modelo de trabajo", text: "De discovery a deploy: scope acotado, milestone-based, comunicación semanal con demos funcionales. Sin sorpresas, sin scope creep." },
        { title: "Post-lanzamiento", text: "Soporte post-launch incluido en el alcance. No desaparezco después del deploy. Si algo rompe, lo arreglo. Si hay learnings, los documentamos." },
      ],
    },
  },
  ABOUT: {
    tag: "BIO",
    title: { es: "Sobre mí", en: "About" },
    desc: "PM y Fullstack Developer, fundador de Excelso. Catamarca, Argentina.",
    chips: ["Experiencia", "Trayectoria", "Contacto"],
    content: {
      type: "timeline",
      title: "Experiencia",
      items: [
        { date: "2025 — Present", role: "Founder, Developer & PM", company: "Excelso", url: "https://excelso.xyz" },
        { date: "Jul 2026 — Present", role: "Fullstack Developer SSR", company: "Cliniweb", url: "https://www.cliniweb.com" },
        { date: "Jan 2026 - Present", role: "PartTime CTO", company: "Experimental Global", url: "https://experimental.global" },
        { date: "Jul 2025 — Ago 2026", role: "Front-end Developer SSR", company: "Around Notes", url: "https://aroundnotes.ai" },
        { date: "Sep 2024 — Jan 2025", role: "Web Dev Project Manager", company: "IcarisTech", url: "" },
        { date: "Apr 2024 - Sep 2024", role: "Product Owner & IT PM", company: "InkuA", url: "https://inkua.eu" },
        { date: "Ago 2023 — Mar 2024", role: "Founder, PM & Fullstack Dev", company: "Fuddy", url: "https://fuddy.click" },
        { date: "Apr 2018 — Dic 2023", role: "Multimedia Editor & Dev", company: "Tinta Negra Studios", url: "https://tns.agustin.top" },
        { date: "Jan 2023 - May 2023", role: "Front-End Developer", company: "Advance Valley", url: "" },
      ],
    },
    detail: {
      intro: "Empecé lejos de donde se supone que empiezan estas historias: Catamarca, Argentina, con un título de Técnico Minero y meses de trabajo de campo en el Salar del Hombre Muerto. Nada de eso suena a developer. Y sin embargo es exactamente ahí donde aprendí lo que hoy uso todos los días: que un sistema complejo no se entiende mirando una sola pieza, sino las relaciones entre todas.",
      sections: [
        { title: "Qué me mueve", text: "Resolver problemas reales con herramientas simples. No me interesa la tecnología por la tecnología; me interesa qué cambia en la vida de alguien cuando el producto funciona. Soy PM porque necesito ordenar. Soy developer porque necesito poder ejecutar lo que ordeno." },
        { title: "Cómo trabajo", text: "Discovery antes de especificación, especificación antes de implementación, revisión antes de cerrar. Trabajo directo con founders y product leads, sin PM intermedio. Reuniones cortas, entregables claros, iteración constante." },
        { title: "Qué busco", text: "Problemas interesantes, equipos que valoran la claridad, y productos donde la calidad técnica importa porque el producto importa. Si buscás a alguien que ordene el problema, construya con criterio y te acompañe con la cabeza puesta en el resultado, hablemos." },
      ],
      links: [
        { label: "me@agustin.top", url: "#" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/avellaneda-agustin/" },
        { label: "GitHub", url: "https://github.com/nitdraig" },
      ],
    },
  },
  REASONING: {
    tag: "MINDSET",
    title: { es: "Mentalidad", en: "Reasoning" },
    desc: "No creo en las instrucciones perfectas. Mi trabajo es traducir caos en alcance claro, antes de escribir la primera línea de código.",
    chips: ["First Principles", "Simplicity", "Measurement"],
    content: {
      type: "list",
      title: "Cómo pienso",
      items: [
        { title: "Primeros principios", text: "Desarmo el problema hasta sus partes irreducibles antes de elegir solución." },
        { title: "Aburrido sobre inteligente", text: "Prefiero un one-liner aburrido a una abstracción elegante que nadie pidió. Reviso mis propios cambios buscando sobre-ingeniería." },
        { title: "Medir primero", text: "No optimizo por intuición. Agrego instrumentación antes de cambiar cualquier sistema." },
        { title: "Lanzar para aprender", text: "El feedback real vale más que cualquier debate de arquitectura en una sala." },
      ],
    },
    detail: {
      intro: "Los clientes y la realidad casi nunca dan instrucciones perfectas. Mi trabajo es traducir caos en alcance claro, antes de escribir la primera línea de código. Eso es más gestión que programación, pero es lo que hace que un producto llegue a destino sin explotar en el camino.",
      sections: [
        { title: "PM + Developer", text: "Soy PM porque necesito ordenar. Soy developer porque necesito poder ejecutar lo que ordeno. Un perfil no reemplaza al otro: se sostienen. La gestión sin ejecución es un PowerPoint; la ejecución sin gestión es código huérfano." },
        { title: "Decisiones", text: "Cada decisión técnica tiene un costo: complejidad, tiempo, deuda. Elijo la opción que maximiza aprendizaje por esfuerzo. Si no sé cuál es, mido antes de decidir. Y cuando tomo un atajo consciente, lo dejo marcado en el código para volver después." },
        { title: "Iteración", text: "No planifico 6 meses adelante. Planifico 2 semanas, shippeo, aprendo, y replanifico. La iteración corta es mi herramienta de gestión principal. Los retrabajos justos, sorpresas acordes, plazos que se cumplen." },
      ],
    },
  },
  ENVIRONMENT: {
    tag: "SCIENCE",
    title: { es: "Medio Ambiente", en: "Environment" },
    desc: "Técnico Minero y Licenciado en Ciencias Ambientales. Aprendí en el Salar del Hombre Muerto que un sistema complejo no se entiende mirando una sola pieza.",
    chips: ["Sustainability", "Systems thinking", "JEMA", "Impact"],
    content: {
      type: "list",
      title: "Mirada ambiental",
      items: [
        { title: "Experiencia de campo", text: "Trabajo de campo en el Salar del Hombre Muerto. Ese cambio de mirada — ver relaciones entre piezas, no piezas aisladas — nunca lo abandoné." },
        { title: "Pensamiento sistémico", text: "Abordo los problemas como sistemas interconectados, no como síntomas aislados. Esto aplica a ecosistemas, proyectos de software y equipos." },
        { title: "JEMA", text: "Agente de IA para transparencia ambiental en industrias extractivas. Monitorea compliance, detecta anomalías y genera reportes ejecutivos." },
        { title: "Sustainability by design", text: "Considero impacto ambiental y social en las decisiones de producto. En mi investigación sobre IA aplicada a auditoría ambiental, la IA acelera y detecta, pero el juicio final no se delega." },
      ],
    },
    detail: {
      intro: "Empecé lejos de donde se supone que empiezan estas historias: Catamarca, Argentina, con un título de Técnico Minero y meses de trabajo de campo en el Salar del Hombre Muerto. Nada de eso suena a developer. Y sin embargo es exactamente ahí donde aprendí lo que hoy uso todos los días: que un sistema complejo — un ecosistema, un proyecto de software, un equipo — no se entiende mirando una sola pieza, sino las relaciones entre todas.",
      sections: [
        { title: "JEMA", text: "Agente de IA diseñado para monitorear y reportar compliance ambiental en industrias extractivas. Automatiza la recopilación de datos, detecta anomalías y genera reportes ejecutivos." },
        { title: "Enfoque sistémico", text: "Aplico pensamiento sistémico a productos digitales: no optimizo un componente sin entender su impacto en el sistema completo. Esto evita soluciones que rompen otra parte. Solo cambié el terreno." },
        { title: "Investigación", text: "Investigación académica sobre IA aplicada a auditoría ambiental. La IA acelera y detecta, pero el juicio final — técnico, ético, humano — no se delega. Eso no es una limitación de la tecnología. Es una decisión de diseño." },
      ],
      links: [{ label: "JEMA project", url: "https://jema.excelso.xyz" }],
    },
  },
  AIDEV: {
    tag: "AGENTS",
    title: { es: "Soluciones IA", en: "AI Development" },
    desc: "Construyo agentes, automatizaciones y tools que amplifican la capacidad de los equipos. Parte de Excelso Open, disponible públicamente.",
    chips: ["Lexis-Two", "Agents", "Automation", "Excelso Open"],
    content: {
      type: "list",
      title: "Soluciones de IA",
      items: [
        { title: "Lexis-One", text: "Lead agent fullstack: planifica, arquitecta e implementa features de punta a punta." },
        { title: "Lexis-Two", text: "Lazy senior developer: el camino más corto que funciona. Stdlib primero, código nuevo como último recurso." },
        { title: "Lexis-Review", text: "Quality gate: revisa código buscando sobre-ingeniería, bugs y breaking changes antes de merge." },
        { title: "Lexis ecosystem", text: "6 agentes especializados coordinándose: One, Two, Review, Security, UI, Tutor. Cada uno con un skillset acotado." },
      ],
    },
    detail: {
      intro: "No vendo chatbots. Construyo agentes que ejecutan trabajos reales: código, análisis, decisiones, flujos. Cada agente tiene un rol definido, boundaries claros y supervisión humana. Parte de Excelso Open, disponible públicamente.",
      sections: [
        { title: "Lexis ecosystem", text: "Lexis-One (fullstack lead), Lexis-Two (lazy senior), Lexis-Review (quality gate), Lexis-Security, Lexis-UI, Lexis-Tutor. Cada agente tiene un skillset acotado y trabaja en coordinación. No premia la velocidad ciega sino el criterio." },
        { title: "Qué construyo", text: "Agentes de código que implementan features, agentes de análisis que procesan datos, agentes de soporte que responden con contexto, y pipelines de automatización que conectan servicios." },
        { title: "Enfoque", text: "Empiezo con el flujo manual más simple, lo automatizo, y solo después agrego complejidad. Un agente que falla el 5% de las veces es peor que un humano que falla el 5%." },
      ],
      links: [
        { label: "Lexis ecosystem", url: "https://lexis-two.excelso.xyz" },
        { label: "Excelso Open", url: "https://www.excelso.xyz" },
      ],
    },
  },
};

export type NodeEnrichment = {
  title: BilingualText;
  lens: string;
  angle: string;
  verbs: string[];
};

export const NODE_ENRICHMENT: Record<NodeKey, NodeEnrichment> = {
  AI: { title: { es: "Inteligencia Artificial", en: "Artificial Intelligence" }, lens: "AI-native", angle: "Use AI to automate a core decision or workflow, not as a chat layer.", verbs: ["automate", "predict", "generate", "rank"] },
  CODE: { title: { es: "Código", en: "Code" }, lens: "Technical product", angle: "Define the stack, data model and critical APIs first.", verbs: ["build", "integrate", "deploy", "scale"] },
  PROJECTS: { title: { es: "Proyectos", en: "Projects" }, lens: "Portfolio-style", angle: "Reuse proven patterns from similar shipped products.", verbs: ["match", "adapt", "launch", "grow"] },
  MVP: { title: { es: "MVP", en: "MVP" }, lens: "MVP", angle: "Cut everything except the one loop that proves value.", verbs: ["ship", "test", "learn", "iterate"] },
  RESOURCES: { title: { es: "Recursos", en: "Resources" }, lens: "Knowledge-driven", angle: "Turn proven mental models into a repeatable product process.", verbs: ["apply", "teach", "share", "scale"] },
  CLIENTS: { title: { es: "Clientes", en: "Clients" }, lens: "Client-backed", angle: "Build something that earns trust and delivers measurable outcomes.", verbs: ["deliver", "earn", "satisfy", "grow"] },
  ABOUT: { title: { es: "Sobre mí", en: "About" }, lens: "Founder-led", angle: "Lead product and execution end-to-end with clear ownership.", verbs: ["lead", "ship", "own", "scale"] },
  REASONING: { title: { es: "Mentalidad", en: "Reasoning" }, lens: "Systems-thinking", angle: "Design the simplest system that solves the real problem.", verbs: ["simplify", "connect", "measure", "iterate"] },
  ENVIRONMENT: { title: { es: "Medio Ambiente", en: "Environment" }, lens: "Sustainability-driven", angle: "Design products that account for systemic impact and long-term resilience.", verbs: ["measure", "reduce", "balance", "sustain"] },
  AIDEV: { title: { es: "Soluciones IA", en: "AI Development" }, lens: "AI-native solution", angle: "Build agents and automations that multiply team output.", verbs: ["automate", "orchestrate", "generate", "reason"] },
};
