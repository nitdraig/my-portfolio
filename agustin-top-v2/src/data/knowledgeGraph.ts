import { projects } from "./projects";
import { enrichProject, type EnrichedProject, type GraphGroup } from "./projectGraph";

export type GraphNodeKind = "root" | "group" | "concept" | "project";

export type GraphNode = {
  id: string;
  label: string;
  kind: GraphNodeKind;
  /** Optional link for project nodes */
  href?: string;
  group?: GraphGroup;
  slug?: string;
};

export type GraphEdge = {
  from: string;
  to: string;
  reason: "taxonomy" | "capability" | "concept" | "root";
};

/** Conceptual roots of the AI Core — always present. */
export const ROOT_NODES: GraphNode[] = [
  { id: "root-ai", label: "AI", kind: "root" },
  { id: "root-code", label: "CODE", kind: "root" },
  { id: "root-product", label: "PRODUCT", kind: "root" },
  { id: "root-mvp", label: "MVP", kind: "root" },
  { id: "root-projects", label: "PROJECTS", kind: "root" },
  { id: "root-systems", label: "SYSTEMS", kind: "root" },
];

export const GROUP_NODES: GraphNode[] = [
  { id: "group-saas", label: "SaaS", kind: "group", group: "saas" },
  { id: "group-fintech", label: "Fintech", kind: "group", group: "fintech" },
  { id: "group-social", label: "Social", kind: "group", group: "social" },
  { id: "group-automation", label: "Automation", kind: "group", group: "automation" },
  { id: "group-platforms", label: "Platforms", kind: "group", group: "platforms" },
  { id: "group-other", label: "Other", kind: "group", group: "other" },
];

const GROUP_TO_ROOT: Record<GraphGroup, string> = {
  saas: "root-product",
  fintech: "root-systems",
  social: "root-projects",
  automation: "root-ai",
  platforms: "root-systems",
  other: "root-code",
};

export function getEnrichedProjects(): EnrichedProject[] {
  return projects.map(enrichProject);
}

export function buildKnowledgeGraph(locale: "es" | "en" = "es"): {
  nodes: GraphNode[];
  edges: GraphEdge[];
} {
  const enriched = getEnrichedProjects();
  const nodes: GraphNode[] = [...ROOT_NODES, ...GROUP_NODES];
  const edges: GraphEdge[] = [];

  // Connect groups to roots
  for (const g of GROUP_NODES) {
    if (!g.group) continue;
    edges.push({
      from: GROUP_TO_ROOT[g.group],
      to: g.id,
      reason: "taxonomy",
    });
  }

  // Root mesh (thinking system)
  const rootIds = ROOT_NODES.map((n) => n.id);
  for (let i = 0; i < rootIds.length; i++) {
    edges.push({
      from: rootIds[i],
      to: rootIds[(i + 1) % rootIds.length],
      reason: "root",
    });
  }

  const conceptIds = new Set<string>();

  for (const project of enriched) {
    const projectId = `project-${project.slug}`;
    nodes.push({
      id: projectId,
      label: project.title[locale],
      kind: "project",
      href: `/${locale}/work/${project.slug}`,
      group: project.graphGroup,
      slug: project.slug,
    });

    const groupId = `group-${project.graphGroup}`;
    edges.push({ from: groupId, to: projectId, reason: "taxonomy" });

    for (const concept of project.concepts.slice(0, 4)) {
      const conceptId = `concept-${concept}`;
      if (!conceptIds.has(conceptId)) {
        conceptIds.add(conceptId);
        nodes.push({
          id: conceptId,
          label: concept.toUpperCase(),
          kind: "concept",
        });
        edges.push({ from: "root-product", to: conceptId, reason: "concept" });
      }
      edges.push({ from: conceptId, to: projectId, reason: "concept" });
    }

    if (project.capabilities.includes("ai")) {
      edges.push({ from: "root-ai", to: projectId, reason: "capability" });
    }
    if (project.deliveryType === "mvp") {
      edges.push({ from: "root-mvp", to: projectId, reason: "capability" });
    }
  }

  return { nodes, edges };
}
