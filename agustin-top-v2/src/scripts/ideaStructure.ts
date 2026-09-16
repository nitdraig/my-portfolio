/**
 * Lightweight, deterministic idea structuring for Phase 1.
 * Labels inferences clearly — no external model, no invented case studies.
 */

export type IdeaStructure = {
  provided: string;
  product: string;
  users: string;
  problem: string;
  hypothesis: string;
  mvp: string;
  next: string;
};

type Locale = "es" | "en";

const PRODUCT_HINTS: Array<{ re: RegExp; es: string; en: string }> = [
  { re: /app|aplicación|aplicacion|mobile/i, es: "aplicación digital", en: "digital application" },
  { re: /plataforma|platform|marketplace/i, es: "plataforma digital", en: "digital platform" },
  { re: /saas|software|dashboard|panel/i, es: "producto SaaS / software", en: "SaaS / software product" },
  { re: /web|landing|sitio|website/i, es: "producto web", en: "web product" },
  { re: /automatiz|bot|ia\b|ai\b/i, es: "sistema con automatización / IA", en: "automation / AI-assisted system" },
];

function detectProduct(text: string, locale: Locale): string {
  for (const hint of PRODUCT_HINTS) {
    if (hint.re.test(text)) return hint[locale];
  }
  return locale === "es" ? "producto digital (tipo por confirmar)" : "digital product (type to confirm)";
}

function extractUsers(text: string, locale: Locale): string {
  const forMatch = text.match(
    /(?:para|for|conectar|connect(?:ing)?)\s+([^.!?,]{3,60})/i,
  );
  if (forMatch?.[1]) {
    return forMatch[1].trim();
  }
  return locale === "es"
    ? "Usuarios no especificados — a validar en discovery"
    : "Users not specified — to validate in discovery";
}

function extractProblem(text: string, locale: Locale): string {
  const wantMatch = text.match(
    /(?:quiero|necesito|i want|i need|busco)\s+(.+)/i,
  );
  if (wantMatch?.[1]) {
    const slice = wantMatch[1].trim().slice(0, 160);
    return locale === "es"
      ? `Necesidad expresada: ${slice}`
      : `Expressed need: ${slice}`;
  }
  return locale === "es"
    ? "Problema implícito en la idea — requiere discovery"
    : "Problem implied by the idea — requires discovery";
}

export function structureIdea(raw: string, locale: Locale): IdeaStructure {
  const text = raw.trim().replace(/\s+/g, " ");
  const product = detectProduct(text, locale);
  const users = extractUsers(text, locale);
  const problem = extractProblem(text, locale);

  return {
    provided: text,
    product,
    users,
    problem,
    hypothesis:
      locale === "es"
        ? "Hipótesis: existe una oportunidad si el problema es frecuente y el canal de adquisición es claro. Debe validarse con usuarios reales."
        : "Hypothesis: there is an opportunity if the problem is frequent and the acquisition channel is clear. Must be validated with real users.",
    mvp:
      locale === "es"
        ? "MVP sugerido (estimación inicial): 1) registro básico, 2) flujo principal de valor, 3) un canal de feedback. Alcance sujeto a discovery."
        : "Suggested MVP (initial estimate): 1) basic signup, 2) core value flow, 3) one feedback channel. Scope subject to discovery.",
    next:
      locale === "es"
        ? "Próximo paso: una llamada corta de discovery para contrastar hipótesis, usuarios y alcance del MVP."
        : "Next step: a short discovery call to challenge hypotheses, users, and MVP scope.",
  };
}
