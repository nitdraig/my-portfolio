import type { Project } from "./projects";

export type GraphGroup =
  | "saas"
  | "fintech"
  | "social"
  | "automation"
  | "platforms"
  | "other";

export type ProjectGraphMeta = {
  concepts: string[];
  capabilities: string[];
  graphGroup: GraphGroup;
};

/** Graph metadata keyed by project slug — factual enrichment only. */
export const projectGraphMeta: Record<string, ProjectGraphMeta> = {
  ate: {
    concepts: ["memberships", "payments", "profiles", "qr", "admin", "access"],
    capabilities: ["fullstack", "realtime", "auth", "platforms"],
    graphGroup: "platforms",
  },
  flowfolio: {
    concepts: ["projects", "clients", "tasks", "dashboard", "briefs", "ai"],
    capabilities: ["ai", "fullstack", "saas", "automation"],
    graphGroup: "saas",
  },
  "experimental-global-app-landing": {
    concepts: ["hackathons", "talent", "organizations", "matching", "global"],
    capabilities: ["fullstack", "platforms", "product"],
    graphGroup: "platforms",
  },
  "meet-my-race": {
    concepts: ["runners", "events", "travel", "matching", "profiles", "races"],
    capabilities: ["fullstack", "platforms", "product", "social"],
    graphGroup: "social",
  },
  "around-notes-blog": {
    concepts: ["content", "healthcare", "seo", "blog", "education"],
    capabilities: ["fullstack", "content", "seo"],
    graphGroup: "other",
  },
  "around-notes-app": {
    concepts: ["notes", "healthcare", "ai", "profiles", "productivity"],
    capabilities: ["ai", "fullstack", "product", "ux"],
    graphGroup: "saas",
  },
  "around-notes-landing": {
    concepts: ["landing", "healthcare", "conversion", "seo"],
    capabilities: ["frontend", "seo", "performance"],
    graphGroup: "other",
  },
  "sigii-app": {
    concepts: ["education", "management", "admin", "profiles", "workflows"],
    capabilities: ["fullstack", "platforms", "product"],
    graphGroup: "platforms",
  },
  "mining-talent-net": {
    concepts: ["talent", "mining", "matching", "profiles", "jobs"],
    capabilities: ["fullstack", "platforms", "matching"],
    graphGroup: "platforms",
  },
  "excelso-tech-group": {
    concepts: ["agency", "services", "brand", "landing"],
    capabilities: ["frontend", "product"],
    graphGroup: "other",
  },
  "jema-ai-impact": {
    concepts: ["ai", "sustainability", "impact", "data", "automation"],
    capabilities: ["ai", "fullstack", "automation"],
    graphGroup: "automation",
  },
  "huellitasctg-webapp": {
    concepts: ["animals", "nonprofit", "cms", "profiles", "community"],
    capabilities: ["fullstack", "cms", "platforms"],
    graphGroup: "social",
  },
  "dc-landing-page": {
    concepts: ["consulting", "landing", "brand", "conversion"],
    capabilities: ["frontend", "seo"],
    graphGroup: "other",
  },
  "fuddy-app": {
    concepts: ["food", "mvp", "orders", "profiles"],
    capabilities: ["mvp", "fullstack", "product"],
    graphGroup: "saas",
  },
  mailprex: {
    concepts: ["email", "api", "devtools", "automation", "forms"],
    capabilities: ["fullstack", "api", "automation", "devtools"],
    graphGroup: "automation",
  },
};

export type EnrichedProject = Project & ProjectGraphMeta;

export function enrichProject(project: Project): EnrichedProject {
  const meta = projectGraphMeta[project.slug] ?? {
    concepts: [],
    capabilities: ["fullstack"],
    graphGroup: "other" as GraphGroup,
  };
  return { ...project, ...meta };
}
