/**
 * Structured identity content for SEO / GEO.
 * Factual source of truth — AI and pages must not invent beyond this.
 */
export const person = {
  name: "Agustín Avellaneda",
  shortName: "Agustín",
  url: "https://www.agustin.top",
  email: "me@agustin.top",
  jobTitle: {
    es: "Product builder · desarrollo full-stack, diseño y IA",
    en: "Product builder · full-stack development, design & AI",
  },
  location: {
    locality: "Catamarca",
    country: "AR",
    label: {
      es: "Catamarca, Argentina",
      en: "Catamarca, Argentina",
    },
  },
  languages: ["es", "en"] as const,
  sameAs: [
    "https://github.com/nitdraig",
    "https://www.linkedin.com/in/avellaneda-agustin/",
  ],
  company: {
    name: "Excelso",
    url: "https://www.excelso.xyz",
  },
  positioning: {
    es: "Agustín convierte ideas de producto en productos digitales reales, usando software, diseño, automatización e IA para validar y lanzar rápido.",
    en: "Agustín turns product ideas into real digital products—using software, design, automation, and AI to validate and launch fast.",
  },
  whatHeDoes: {
    es: "Construye MVPs, plataformas SaaS y productos digitales de punta a punta: estrategia, UX/UI, arquitectura, desarrollo e integración de IA.",
    en: "Builds MVPs, SaaS platforms, and digital products end to end: strategy, UX/UI, architecture, development, and AI integration.",
  },
  forWhom: {
    es: "Fundadores, equipos de producto y organizaciones que necesitan pasar de una idea ambigua a un producto concreto.",
    en: "Founders, product teams, and organizations that need to go from an ambiguous idea to a concrete product.",
  },
  capabilities: [
    { id: "ai", label: { es: "IA aplicada", en: "Applied AI" } },
    { id: "fullstack", label: { es: "Fullstack", en: "Fullstack" } },
    { id: "product", label: { es: "Producto", en: "Product" } },
    { id: "pm", label: { es: "Project management", en: "Project management" } },
  ],
  systemChips: ["AI READY", "20+ PROJECTS", "AI × PRODUCT", "FULLSTACK"] as const,
} as const;

export const services = [
  {
    id: "mvp",
    title: { es: "MVP potenciado con IA", en: "AI-powered MVP" },
    description: {
      es: "Definición y construcción de una primera versión lanzable, con hipótesis claras y aceleración asistida por IA donde aporta valor real.",
      en: "Definition and build of a shippable first version, with clear hypotheses and AI acceleration where it adds real value.",
    },
  },
  {
    id: "launch",
    title: { es: "Lanzamiento completo", en: "Complete launch" },
    description: {
      es: "Del discovery al go-live: producto, diseño, desarrollo, QA y puesta en producción.",
      en: "From discovery to go-live: product, design, development, QA, and production launch.",
    },
  },
  {
    id: "scale",
    title: { es: "Iteración y escala", en: "Iteration & scale" },
    description: {
      es: "Mejora continua del producto, automatización e integración de IA para acelerar el proceso sin reemplazarlo.",
      en: "Continuous product improvement, automation, and AI integration to accelerate the process without replacing it.",
    },
  },
] as const;
