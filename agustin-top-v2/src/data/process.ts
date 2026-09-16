/**
 * Work process stages — citation-friendly, factual methodology content.
 */
export type ProcessStep = {
  id: string;
  number: string;
  title: { es: string; en: string };
  whatHappens: { es: string; en: string };
  clientReceives: { es: string; en: string };
  decisions: { es: string; en: string };
  outcome: { es: string; en: string };
};

export const processSteps: ProcessStep[] = [
  {
    id: "discovery",
    number: "01",
    title: { es: "Discovery", en: "Discovery" },
    whatHappens: {
      es: "Entendemos el problema, los usuarios, el contexto de negocio y las restricciones reales.",
      en: "We understand the problem, users, business context, and real constraints.",
    },
    clientReceives: {
      es: "Resumen de hallazgos, preguntas abiertas y alcance tentativo.",
      en: "Findings summary, open questions, and tentative scope.",
    },
    decisions: {
      es: "Qué problema vale la pena resolver primero y qué queda fuera.",
      en: "Which problem is worth solving first and what is out of scope.",
    },
    outcome: {
      es: "Una dirección de producto compartida y verificable.",
      en: "A shared, verifiable product direction.",
    },
  },
  {
    id: "product-strategy",
    number: "02",
    title: { es: "Estrategia de producto", en: "Product strategy" },
    whatHappens: {
      es: "Definimos hipótesis, propuesta de valor, usuarios prioritarios y criterios de éxito del MVP.",
      en: "We define hypotheses, value proposition, priority users, and MVP success criteria.",
    },
    clientReceives: {
      es: "Brief de producto y priorización inicial.",
      en: "Product brief and initial prioritization.",
    },
    decisions: {
      es: "Qué construir ahora vs. qué validar después.",
      en: "What to build now vs. what to validate later.",
    },
    outcome: {
      es: "Un MVP con propósito claro, no una lista infinita de features.",
      en: "An MVP with a clear purpose—not an endless feature list.",
    },
  },
  {
    id: "ux-ui",
    number: "03",
    title: { es: "UX / UI", en: "UX / UI" },
    whatHappens: {
      es: "Diseñamos flujos, estructura de información e interfaz orientada a comprensión y conversión.",
      en: "We design flows, information architecture, and UI focused on clarity and conversion.",
    },
    clientReceives: {
      es: "Wireframes o prototipos navegables según la etapa.",
      en: "Wireframes or navigable prototypes depending on the stage.",
    },
    decisions: {
      es: "Jerarquía, estados de vacío/error y tono visual del producto.",
      en: "Hierarchy, empty/error states, and the product’s visual tone.",
    },
    outcome: {
      es: "Una experiencia usable antes de invertir en desarrollo pesado.",
      en: "A usable experience before investing in heavy development.",
    },
  },
  {
    id: "architecture",
    number: "04",
    title: { es: "Arquitectura", en: "Architecture" },
    whatHappens: {
      es: "Elegimos stack, límites del sistema, datos y consideraciones de seguridad y escalabilidad.",
      en: "We choose stack, system boundaries, data model, and security/scalability considerations.",
    },
    clientReceives: {
      es: "Decisiones técnicas documentadas y trade-offs visibles.",
      en: "Documented technical decisions and visible trade-offs.",
    },
    decisions: {
      es: "Qué es simple ahora y qué debe prepararse para crecer.",
      en: "What stays simple now and what should prepare for growth.",
    },
    outcome: {
      es: "Una base técnica alineada al MVP, sin sobre-ingeniería.",
      en: "A technical base aligned to the MVP—without over-engineering.",
    },
  },
  {
    id: "development",
    number: "05",
    title: { es: "Desarrollo", en: "Development" },
    whatHappens: {
      es: "Implementamos el producto de forma incremental, con entregas revisables.",
      en: "We implement the product incrementally, with reviewable deliveries.",
    },
    clientReceives: {
      es: "Versiones parciales desplegadas y feedback continuo.",
      en: "Partial deployed versions and continuous feedback.",
    },
    decisions: {
      es: "Prioridad de bugs vs. features y ajustes de alcance.",
      en: "Bug vs. feature priority and scope adjustments.",
    },
    outcome: {
      es: "Software funcionando que se puede probar con usuarios reales.",
      en: "Working software that can be tested with real users.",
    },
  },
  {
    id: "ai-integration",
    number: "06",
    title: { es: "Integración de IA", en: "AI integration" },
    whatHappens: {
      es: "Integramos IA donde acelera research, prototipado, desarrollo, testing o automatización—sin claims vacíos.",
      en: "We integrate AI where it accelerates research, prototyping, development, testing, or automation—without empty claims.",
    },
    clientReceives: {
      es: "Casos de uso de IA concretos, límites y supuestos.",
      en: "Concrete AI use cases, limits, and assumptions.",
    },
    decisions: {
      es: "Qué automatizar, qué revisar con humanos y qué no conviene.",
      en: "What to automate, what humans must review, and what not to do.",
    },
    outcome: {
      es: "La IA multiplica el proceso; no lo reemplaza.",
      en: "AI multiplies the process—it does not replace it.",
    },
  },
  {
    id: "qa",
    number: "07",
    title: { es: "QA", en: "QA" },
    whatHappens: {
      es: "Probamos flujos críticos, estados de error, accesibilidad básica y regresiones.",
      en: "We test critical flows, error states, basic accessibility, and regressions.",
    },
    clientReceives: {
      es: "Lista de issues priorizados y criterios de aceptación verificados.",
      en: "Prioritized issue list and verified acceptance criteria.",
    },
    decisions: {
      es: "Qué bloquea el lanzamiento y qué puede iterarse después.",
      en: "What blocks launch and what can iterate after.",
    },
    outcome: {
      es: "Confianza suficiente para salir a producción.",
      en: "Enough confidence to ship to production.",
    },
  },
  {
    id: "launch",
    number: "08",
    title: { es: "Lanzamiento", en: "Launch" },
    whatHappens: {
      es: "Despliegue, monitoreo básico, dominio, analytics esenciales y handoff operativo.",
      en: "Deployment, basic monitoring, domain, essential analytics, and operational handoff.",
    },
    clientReceives: {
      es: "Producto en producción y checklist de go-live.",
      en: "Product in production and a go-live checklist.",
    },
    decisions: {
      es: "Ventana de lanzamiento y comunicación al usuario.",
      en: "Launch window and user communication.",
    },
    outcome: {
      es: "El producto existe en el mundo real.",
      en: "The product exists in the real world.",
    },
  },
  {
    id: "iteration",
    number: "09",
    title: { es: "Iteración", en: "Iteration" },
    whatHappens: {
      es: "Medimos uso, aprendemos y priorizamos la siguiente versión con evidencia.",
      en: "We measure usage, learn, and prioritize the next version with evidence.",
    },
    clientReceives: {
      es: "Backlog priorizado y recomendaciones de mejora.",
      en: "Prioritized backlog and improvement recommendations.",
    },
    decisions: {
      es: "Qué doblar, qué cortar y qué medir mejor.",
      en: "What to double down on, what to cut, and what to measure better.",
    },
    outcome: {
      es: "Un ciclo de producto sostenible después del MVP.",
      en: "A sustainable product cycle after the MVP.",
    },
  },
];

export const aiMultiplierMessage = {
  es: "La IA no reemplaza el proceso de producto. Lo acelera y amplifica.",
  en: "AI does not replace the product process. It accelerates and amplifies it.",
};

export const aiUseCases = {
  es: [
    "Análisis de requisitos",
    "Research",
    "Generación de hipótesis",
    "Prototipado",
    "Arquitectura asistida",
    "Desarrollo",
    "Testing",
    "Documentación",
    "Automatización",
    "Análisis de datos",
  ],
  en: [
    "Requirements analysis",
    "Research",
    "Hypothesis generation",
    "Prototyping",
    "Assisted architecture",
    "Development",
    "Testing",
    "Documentation",
    "Automation",
    "Data analysis",
  ],
} as const;
