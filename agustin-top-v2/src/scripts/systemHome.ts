import { analyzeIdea, type IdeaAnalysis } from "../lib/ai/analyzeIdea";
import { getSceneCapability } from "./scene/capabilities";
import type { MountResult } from "./scene/mountScene";

type Status = "idle" | "thinking" | "complete";
type HeroMode = "explore" | "portfolio";

let sceneHandle: MountResult | null = null;

function getLocale(): "es" | "en" {
  const root = document.querySelector("[data-understand]");
  const loc = root instanceof HTMLElement ? root.dataset.locale : null;
  return loc === "en" ? "en" : "es";
}

function setStatus(status: Status) {
  const el = document.querySelector("[data-system-status]");
  const label = document.querySelector("[data-status-label]");
  if (!(el instanceof HTMLElement) || !(label instanceof HTMLElement)) return;

  el.dataset.status = status;
  if (status === "thinking") {
    label.textContent = el.dataset.labelThinking ?? "THINKING...";
  } else if (status === "complete") {
    label.textContent = el.dataset.labelComplete ?? "ANALYSIS COMPLETE";
  } else {
    label.textContent = el.dataset.labelReady ?? "AI READY";
  }
}

function setReadout(visible: boolean, text?: string) {
  const readout = document.querySelector("[data-ai-readout]");
  const readoutText = document.querySelector("[data-ai-readout-text]");
  if (!(readout instanceof HTMLElement)) return;
  readout.classList.toggle("hidden", !visible);
  if (text && readoutText) readoutText.textContent = text;
}

function renderHeroPanel(result: IdeaAnalysis) {
  const locale = getLocale();
  const panel = document.querySelector("[data-result-panel]");
  const label = document.querySelector("[data-result-label]");
  const chips = document.querySelector("[data-result-chips]");
  const projects = document.querySelector("[data-result-projects]");
  const note = document.querySelector("[data-result-note]");
  const statusEl = document.querySelector("[data-system-status]");

  if (!(panel instanceof HTMLElement)) return;

  if (label instanceof HTMLElement) {
    label.textContent = `● ${statusEl instanceof HTMLElement ? statusEl.dataset.labelComplete ?? "ANALYSIS COMPLETE" : "ANALYSIS COMPLETE"}`;
  }

  if (chips) {
    chips.textContent = "";
    for (const c of result.concepts) {
      const span = document.createElement("span");
      span.textContent = c.label;
      chips.appendChild(span);
    }
  }

  if (projects) {
    const countLabel =
      locale === "es"
        ? `${result.similarProjects.length} proyectos similares a tu idea`
        : `${result.similarProjects.length} projects similar to your idea`;

    projects.textContent = "";

    const countDiv = document.createElement("div");
    countDiv.className = "rp-count";
    countDiv.textContent = countLabel;
    projects.appendChild(countDiv);

    if (result.similarProjects.length === 0) {
      const empty = document.createElement("p");
      empty.style.fontSize = "13px";
      empty.style.color = "var(--text-faint)";
      empty.textContent =
        locale === "es"
          ? "No hay solapamiento claro con el portfolio aún."
          : "No clear overlap with the portfolio yet.";
      projects.appendChild(empty);
    } else {
      for (const p of result.similarProjects) {
        const a = document.createElement("a");
        a.href = `/${locale}/work/${p.slug}`;
        a.textContent = `${p.title[locale]} — ${p.matchedOn[0] ?? "match"}`;
        const arrow = document.createElement("span");
        arrow.textContent = "→";
        a.appendChild(arrow);
        projects.appendChild(a);
      }
    }
  }

  if (note) note.textContent = result.note[locale];
  panel.hidden = false;
}

function renderUnderstand(result: IdeaAnalysis) {
  const locale = getLocale();
  const panel = document.querySelector("[data-understand-panel]");
  const empty = document.querySelector("[data-understand-empty]");
  const resultEl = document.querySelector("[data-understand-result]");
  const conceptList = document.querySelector("[data-concept-list]");
  const similarList = document.querySelector("[data-similar-list]");
  const similarEmpty = document.querySelector("[data-similar-empty]");
  const countEl = document.querySelector("[data-similar-count]");
  const hintEl = document.querySelector("[data-product-hint]");
  const noteEl = document.querySelector("[data-note-text]");
  const understand = document.querySelector("[data-understand]");
  const tplConcept = document.getElementById(
    "tpl-concept-chip",
  ) as HTMLTemplateElement | null;
  const tplSimilar = document.getElementById(
    "tpl-similar-item",
  ) as HTMLTemplateElement | null;

  if (!(panel instanceof HTMLElement)) return;
  panel.dataset.hasResult = "true";
  empty?.classList.add("hidden");
  resultEl?.classList.remove("hidden");

  const provided =
    understand instanceof HTMLElement
      ? (understand.dataset.labelProvided ?? "Provided")
      : "Provided";
  const inferred =
    understand instanceof HTMLElement
      ? (understand.dataset.labelInferred ?? "Inferred")
      : "Inferred";

  if (conceptList && tplConcept) {
    conceptList.innerHTML = "";
    for (const c of result.concepts) {
      const node = tplConcept.content.cloneNode(true) as DocumentFragment;
      const lab = node.querySelector("[data-concept-label]");
      const source = node.querySelector("[data-concept-source]");
      if (lab) lab.textContent = c.label;
      if (source)
        source.textContent = c.source === "provided" ? provided : inferred;
      conceptList.appendChild(node);
    }
  }

  if (hintEl) hintEl.textContent = result.productHint[locale];
  if (noteEl) noteEl.textContent = result.note[locale];
  if (countEl) countEl.textContent = String(result.similarProjects.length);

  if (similarList && tplSimilar) {
    similarList.innerHTML = "";
    if (result.similarProjects.length === 0) {
      similarEmpty?.classList.remove("hidden");
    } else {
      similarEmpty?.classList.add("hidden");
      for (const p of result.similarProjects) {
        const node = tplSimilar.content.cloneNode(true) as DocumentFragment;
        const link = node.querySelector(
          "[data-similar-link]",
        ) as HTMLAnchorElement | null;
        const title = node.querySelector("[data-similar-title]");
        if (link) link.href = `/${locale}/work/${p.slug}`;
        if (title) title.textContent = p.title[locale];
        similarList.appendChild(node);
      }
    }
  }
}

function dispatchSceneConcepts(result: IdeaAnalysis) {
  const labels = result.concepts.map((c) => ({ id: c.id, label: c.label }));
  if (sceneHandle) {
    sceneHandle.setConceptLabels(labels);
    sceneHandle.setMode("structure");
    sceneHandle.triggerPulse(0.9);
    return;
  }
  const root = document.querySelector("[data-scene-root]");
  if (!root) return;
  root.dispatchEvent(
    new CustomEvent("scene:concepts", { detail: { labels }, bubbles: true }),
  );
}

function getHeroMode(): HeroMode {
  const hero = document.querySelector("[data-hero-stage]");
  if (hero instanceof HTMLElement && hero.dataset.heroMode === "portfolio") {
    return "portfolio";
  }
  return "explore";
}

function enterPortfolio(targetHref = "#understand") {
  const hero = document.querySelector("[data-hero-stage]");
  const veil = document.querySelector("[data-transition-veil]");
  if (!(hero instanceof HTMLElement) || getHeroMode() !== "explore") {
    const target = document.querySelector(targetHref);
    target?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  sceneHandle?.setExploreActive(false);
  hero.dataset.heroMode = "portfolio";
  document.documentElement.classList.remove("locked");
  veil?.classList.add("show");

  window.setTimeout(() => {
    hero.classList.add("exited");
    window.scrollTo(0, 0);
    window.setTimeout(() => {
      hero.dataset.heroMode = "portfolio";
      hero.style.display = "none";
      veil?.classList.remove("show");
      const narrative = document.querySelector("[data-narrative-root]");
      if (narrative instanceof HTMLElement) {
        narrative.hidden = false;
        narrative.style.visibility = "visible";
      }
      const target = document.querySelector(targetHref);
      if (target) target.scrollIntoView({ behavior: "auto" });
    }, 480);
  }, 260);
}

function initNavExplore() {
  document.querySelectorAll<HTMLAnchorElement>("[data-nav]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const hash = a.dataset.nav;
      if (!hash) return;
      e.preventDefault();
      if (getHeroMode() === "explore") enterPortfolio(hash);
      else document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function sceneDebug(lines: string[]) {
  const el = document.querySelector("[data-scene-debug]");
  if (el) el.textContent = lines.join("\n");
}

async function mountHeroScene() {
  const root = document.querySelector("[data-scene-root]");
  const canvas = root?.querySelector("[data-scene-canvas]");
  const fallback = root?.querySelector("[data-scene-fallback]");
  if (!(canvas instanceof HTMLCanvasElement) || !(root instanceof HTMLElement)) {
    console.warn("[scene] Missing canvas root");
    sceneDebug(["scene: missing canvas root"]);
    return;
  }

  const cap = getSceneCapability();
  sceneDebug([
    `webgl: ${cap.webgl ? "yes" : "no"}`,
    `lowPower: ${cap.lowPower ? "yes" : "no"}`,
    "mounted: checking...",
  ]);

  try {
    const { mountIdeaScene } = await import("./scene/mountScene");
    sceneHandle = await mountIdeaScene(canvas, {
      mode: "chaos",
      onReady: () => {
        root.dataset.sceneActive = "true";
        sceneDebug([
          `webgl: ${cap.webgl ? "yes" : "no"}`,
          `lowPower: ${cap.lowPower ? "yes" : "no"}`,
          "mounted: yes",
          "firstFrame: waiting...",
        ]);
      },
      onFirstFrame: () => {
        fallback?.classList.add("is-replaced");
        const rootH = root instanceof HTMLElement ? root.clientHeight : 0;
        sceneDebug([
          `webgl: ${cap.webgl ? "yes" : "no"}`,
          `lowPower: ${cap.lowPower ? "yes" : "no"}`,
          "mounted: yes",
          `firstFrame: yes`,
          `canvas: ${canvas.clientWidth}x${canvas.clientHeight}`,
          `root: ${root.clientWidth}x${rootH}`,
          `viewport: ${window.innerWidth}x${window.innerHeight}`,
          "fallback: hidden",
        ]);
      },
      onRenderFailure: () => {
        fallback?.classList.remove("is-replaced");
        fallback?.classList.add("is-animated");
        const rootH = root instanceof HTMLElement ? root.clientHeight : 0;
        sceneDebug([
          `webgl: ${cap.webgl ? "yes" : "no"}`,
          `lowPower: ${cap.lowPower ? "yes" : "no"}`,
          "mounted: yes",
          "firstFrame: yes (then failed)",
          `canvas: ${canvas.clientWidth}x${canvas.clientHeight}`,
          `root: ${root.clientWidth}x${rootH}`,
          `viewport: ${window.innerWidth}x${window.innerHeight}`,
          "fallback: restored",
          "error: context-lost or stalled",
        ]);
      },
      onNodeClick: (id) => {
        root.dispatchEvent(
          new CustomEvent("scene:node-click", { detail: { id }, bubbles: true }),
        );
      },
    });
  } catch (err) {
    console.error("[scene] mountHeroScene failed", err);
    sceneHandle = null;
  }

  if (!sceneHandle) {
    fallback?.classList.add("is-animated");
    sceneDebug([
      `webgl: ${cap.webgl ? "yes" : "no"}`,
      `lowPower: ${cap.lowPower ? "yes" : "no"}`,
      "mounted: no",
      "firstFrame: n/a",
      "fallback: visible (WebGL unavailable)",
    ]);
    return;
  }

  const hero = document.querySelector("[data-hero-stage]");
  if (hero) {
    const obs = new MutationObserver(() => {
      sceneHandle?.setExploreActive(
        hero.getAttribute("data-hero-mode") === "explore",
      );
    });
    obs.observe(hero, { attributes: true, attributeFilter: ["data-hero-mode"] });
  }
}

export function initSystemHome() {
  document.documentElement.classList.add("locked");

  const form = document.getElementById("system-command-form");
  const skip = document.querySelector("[data-skip-portfolio]");
  const narrative = document.querySelector("[data-narrative-root]");
  const hero = document.querySelector("[data-hero-stage]");

  if (hero instanceof HTMLElement) {
    hero.dataset.heroMode = "explore";
    hero.style.display = "";
    hero.classList.remove("exited");
  }

  if (narrative instanceof HTMLElement) {
    narrative.hidden = true;
  }

  skip?.addEventListener("click", () => enterPortfolio("#understand"));
  initNavExplore();

  (window as Window & { __enterPortfolio?: typeof enterPortfolio }).__enterPortfolio =
    enterPortfolio;

  void mountHeroScene();

  if (!(form instanceof HTMLFormElement)) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("[data-idea-input]");
    if (!(input instanceof HTMLInputElement)) return;
    const text = input.value.trim();
    if (!text) return;

    const panel = document.querySelector("[data-result-panel]");
    if (panel instanceof HTMLElement) panel.hidden = true;

    setStatus("thinking");
    setReadout(true);
    sceneHandle?.setMode("listen");
    sceneHandle?.triggerPulse(1);

    window.setTimeout(() => {
      const result = analyzeIdea(text);
      setReadout(false);
      renderHeroPanel(result);
      renderUnderstand(result);
      dispatchSceneConcepts(result);
      setStatus("complete");
    }, 1100);
  });
}

