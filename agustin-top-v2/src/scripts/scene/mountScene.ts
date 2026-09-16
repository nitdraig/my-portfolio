import { getSceneCapability, shouldLoadThree } from "./capabilities";
import type { GraphLabel, IdeaScene, IdeaSceneMode } from "./IdeaScene";

export type MountResult = {
  setMode: (mode: IdeaSceneMode) => void;
  setPointer: (x: number, y: number) => void;
  setScroll: (progress: number) => void;
  setConceptLabels: (labels: GraphLabel[]) => void;
  setExploreActive: (active: boolean) => void;
  resetToRoots: () => void;
  triggerPulse: (strength?: number) => void;
  dispose: () => void;
};

export type MountOptions = {
  mode?: IdeaSceneMode;
  onReady?: () => void;
  /** Called after the first rendered frame is actually pushed to the canvas. */
  onFirstFrame?: () => void;
  /** WebGL context was lost or the render loop stalled. */
  onRenderFailure?: () => void;
  onNodeClick?: (id: string) => void;
  /** Fired when the user zooms far enough out (explore → portfolio). */
  onZoomExit?: () => void;
};

function waitForLayout(el: HTMLElement): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const measure = () => {
      const parent = el.parentElement ?? el;
      const w = parent.clientWidth || window.innerWidth || 1;
      const h = parent.clientHeight || window.innerHeight || 1;
      if (w > 8 && h > 8) {
        resolve({ w, h });
        return true;
      }
      return false;
    };
    if (measure()) return;
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      if (measure() || tries > 40) {
        window.clearInterval(id);
        resolve({
          w: el.parentElement?.clientWidth || window.innerWidth || 800,
          h: el.parentElement?.clientHeight || window.innerHeight || 600,
        });
      }
    }, 50);
  });
}

/**
 * Progressive enhancement entry: only dynamic-imports three when capable.
 */
export async function mountIdeaScene(
  canvas: HTMLCanvasElement,
  opts: MountOptions = {},
): Promise<MountResult | null> {
  const cap = getSceneCapability();
  if (!shouldLoadThree(cap)) {
    console.warn("[scene] WebGL unavailable — keeping 2D fallback");
    return null;
  }

  await waitForLayout(canvas);

  try {
    const { IdeaScene } = await import("./IdeaScene");
    // Prefer continuous motion; only dial density on low-power devices.
    const scene: IdeaScene = new IdeaScene({
      canvas,
      mode: opts.mode ?? "chaos",
      lowPower: cap.lowPower,
      // Still animate under reduced-motion preference (slower), so the hero never looks dead.
      reduceMotion: false,
      onNodeClick: opts.onNodeClick,
      onZoomExit: opts.onZoomExit,
    });

    // Force visibility — Astro scoped CSS / transitions must not hide the canvas.
    canvas.style.opacity = "1";
    canvas.style.visibility = "visible";
    canvas.style.zIndex = "2";
    canvas.classList.add("is-ready");

    opts.onReady?.();

    if (opts.onFirstFrame || opts.onRenderFailure) {
      const onFirst = () => {
        canvas.removeEventListener("scene:first-frame", onFirst);
        opts.onFirstFrame?.();
      };
      canvas.addEventListener("scene:first-frame", onFirst);
    }

    if (opts.onRenderFailure) {
      const onFail = () => {
        canvas.removeEventListener("scene:context-lost", onFail);
        canvas.removeEventListener("scene:stalled", onFail);
        opts.onRenderFailure?.();
      };
      canvas.addEventListener("scene:context-lost", onFail);
      canvas.addEventListener("scene:stalled", onFail);
    }

    return {
      setMode: (mode) => scene.setMode(mode),
      setPointer: (x, y) => scene.setPointer(x, y),
      setScroll: (p) => scene.setScroll(p),
      setConceptLabels: (labels) => scene.setConceptLabels(labels),
      setExploreActive: (a) => scene.setExploreActive(a),
      resetToRoots: () => scene.resetToRoots(),
      triggerPulse: (s) => scene.triggerPulse(s),
      dispose: () => scene.dispose(),
    };
  } catch (err) {
    console.error("[scene] Failed to mount Three.js graph", err);
    return null;
  }
}
