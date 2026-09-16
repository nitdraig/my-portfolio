import type { EnrichedProject } from "../../data/projectGraph";
import { getEnrichedProjects } from "../../data/knowledgeGraph";

export type AnalyzeStatus = "idle" | "thinking" | "complete";

export type IdeaConcept = {
  id: string;
  label: string;
  source: "provided" | "inferred";
};

export type SimilarProject = {
  slug: string;
  title: { en: string; es: string };
  shortDescription: { en: string; es: string };
  score: number;
  matchedOn: string[];
  image: string;
};

export type IdeaAnalysis = {
  provided: string;
  concepts: IdeaConcept[];
  productHint: { en: string; es: string };
  similarProjects: SimilarProject[];
  /** Explicit: inferences are hypotheses, not facts */
  note: { en: string; es: string };
};

const STOP = new Set([
  "a", "an", "the", "and", "or", "for", "to", "of", "in", "on", "with", "my", "i",
  "want", "need", "build", "create", "make", "que", "una", "un", "de", "la", "el",
  "los", "las", "para", "con", "quiero", "necesito", "crear", "hacer", "plataforma",
  "app", "aplicacion", "aplicación", "something", "algo",
]);

const CONCEPT_HINTS: Array<{ re: RegExp; id: string; label: string }> = [
  { re: /runner|corredor|race|carrera|maraton|maratón/i, id: "runners", label: "RUNNERS" },
  { re: /event|evento/i, id: "events", label: "EVENTS" },
  { re: /profile|perfil|usuario|user|member|socio/i, id: "profiles", label: "PROFILES" },
  { re: /match|matching|conectar|connect/i, id: "matching", label: "MATCHING" },
  { re: /platform|plataforma|marketplace/i, id: "platform", label: "PLATFORM" },
  { re: /saas|subscription|suscrip/i, id: "saas", label: "SAAS" },
  { re: /ai|ia\b|inteligencia|automat/i, id: "ai", label: "AI" },
  { re: /pay|pago|billing|fintech|invoice/i, id: "payments", label: "PAYMENTS" },
  { re: /health|salud|clinic|medico|médico/i, id: "healthcare", label: "HEALTHCARE" },
  { re: /food|comida|restaurant|pedido/i, id: "food", label: "FOOD" },
  { re: /talent|empleo|job|recruit|mineria|minería/i, id: "talent", label: "TALENT" },
  { re: /email|form|api|devtools/i, id: "devtools", label: "API" },
  { re: /dashboard|admin|panel|gesti[oó]n/i, id: "admin", label: "ADMIN" },
  { re: /social|community|comunidad/i, id: "social", label: "SOCIAL" },
  { re: /mvp|startup|launch|lanzar/i, id: "mvp", label: "MVP" },
  { re: /travel|viaje|trip/i, id: "travel", label: "TRAVEL" },
  { re: /task|tarea|client|cliente|freelance/i, id: "projects", label: "PROJECTS" },
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

function detectConcepts(text: string): IdeaConcept[] {
  const found: IdeaConcept[] = [];
  const seen = new Set<string>();

  for (const hint of CONCEPT_HINTS) {
    if (hint.re.test(text) && !seen.has(hint.id)) {
      seen.add(hint.id);
      found.push({ id: hint.id, label: hint.label, source: "provided" });
    }
  }

  // Always add PLATFORM if talking about building a product-like thing
  if (!seen.has("platform") && /platform|plataforma|app|sistema|system/i.test(text)) {
    found.push({ id: "platform", label: "PLATFORM", source: "inferred" });
  }

  if (found.length === 0) {
    found.push(
      { id: "product", label: "PRODUCT", source: "inferred" },
      { id: "users", label: "USERS", source: "inferred" },
      { id: "mvp", label: "MVP", source: "inferred" },
    );
  }

  return found.slice(0, 8);
}

function productHint(text: string): { en: string; es: string } {
  if (/platform|plataforma|marketplace/i.test(text)) {
    return { en: "Digital platform", es: "Plataforma digital" };
  }
  if (/saas|subscription/i.test(text)) {
    return { en: "SaaS product", es: "Producto SaaS" };
  }
  if (/mvp/i.test(text)) {
    return { en: "MVP", es: "MVP" };
  }
  if (/app|aplicación|aplicacion/i.test(text)) {
    return { en: "Digital application", es: "Aplicación digital" };
  }
  return { en: "Digital product (to confirm)", es: "Producto digital (por confirmar)" };
}

function scoreProject(
  project: EnrichedProject,
  tokens: string[],
  conceptIds: string[],
): { score: number; matchedOn: string[] } {
  let score = 0;
  const matchedOn: string[] = [];
  const haystack = [
    ...project.concepts,
    ...project.capabilities,
    ...project.tags.map((t) => t.toLowerCase()),
    project.industry,
    project.deliveryType,
    project.graphGroup,
    project.title.en.toLowerCase(),
    project.shortDescription.en.toLowerCase(),
  ].join(" ");

  for (const conceptId of conceptIds) {
    if (
      project.concepts.includes(conceptId) ||
      haystack.includes(conceptId) ||
      project.capabilities.includes(conceptId)
    ) {
      score += 3;
      matchedOn.push(conceptId);
    }
  }

  for (const token of tokens) {
    if (haystack.includes(token)) {
      score += 1;
      if (!matchedOn.includes(token)) matchedOn.push(token);
    }
  }

  // Soft boost for featured / platforms when idea mentions platform
  if (conceptIds.includes("platform") && project.deliveryType === "platform") {
    score += 1;
  }

  return { score, matchedOn: matchedOn.slice(0, 5) };
}

/**
 * Local idea analysis against structured portfolio data.
 * Never invents projects or metrics.
 */
export function analyzeIdea(raw: string): IdeaAnalysis {
  const provided = raw.trim().replace(/\s+/g, " ");
  const tokens = tokenize(provided);
  const concepts = detectConcepts(provided);
  const conceptIds = concepts.map((c) => c.id);

  const ranked = getEnrichedProjects()
    .map((project) => {
      const { score, matchedOn } = scoreProject(project, tokens, conceptIds);
      return { project, score, matchedOn };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const similarProjects: SimilarProject[] = ranked.map(({ project, score, matchedOn }) => ({
    slug: project.slug,
    title: project.title,
    shortDescription: project.shortDescription,
    score,
    matchedOn,
    image: project.image,
  }));

  return {
    provided,
    concepts,
    productHint: productHint(provided),
    similarProjects,
    note: {
      en: "Inferences are hypotheses from your text, not facts. Projects listed are real portfolio entries matched by overlap.",
      es: "Las inferencias son hipótesis a partir de tu texto, no hechos. Los proyectos listados son casos reales del portfolio con solapamiento.",
    },
  };
}
