/**
 * Interactive knowledge-graph AI Core (explore stage).
 * Continuous motion + drag orbit + zoom — not a static backdrop.
 */
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  FogExp2,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

export type IdeaSceneMode = "chaos" | "listen" | "structure";

export type GraphLabel = { id: string; label: string };

export type IdeaSceneOptions = {
  canvas: HTMLCanvasElement;
  mode?: IdeaSceneMode;
  lowPower?: boolean;
  reduceMotion?: boolean;
  labels?: GraphLabel[];
  onNodeClick?: (id: string) => void;
  /** Fired when the user zooms far enough out (explore → portfolio). */
  onZoomExit?: () => void;
};

type Hub = {
  id: string;
  label: string;
  base: Vector3;
  mesh: Mesh;
  halo: Sprite;
};

const DEFAULT_LABELS: GraphLabel[] = [
  { id: "AI", label: "AI" },
  { id: "CODE", label: "CODE" },
  { id: "PRODUCT", label: "PRODUCT" },
  { id: "MVP", label: "MVP" },
  { id: "PROJECTS", label: "PROJECTS" },
  { id: "SYSTEMS", label: "SYSTEMS" },
];

function easeOutExpo(x: number) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export class IdeaScene {
  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private root = new Group();
  private grid = new Group();
  private labelLayer: HTMLDivElement | null = null;
  private hubs: Hub[] = [];
  private hubGeo: SphereGeometry;
  private hubMat!: MeshBasicMaterial;
  private haloMat!: SpriteMaterial;
  private lineMats: LineBasicMaterial[] = [];
  private mode: IdeaSceneMode;
  private lowPower: boolean;
  private reduceMotion: boolean;
  private raf = 0;
  private running = false;
  private start = performance.now();
  private pulse = 0;
  private decomposeActive = false;
  private disposed = false;
  private ro?: ResizeObserver;
  private visible = true;
  private hasRendered = false;

  private accent = new Color("#e8ff47");
  private dim = new Color(0x3a3b3e);

  private hoverRot = new Vector2(0, 0);
  private dragRot = new Vector2(0, 0);
  private isDragging = false;
  private dragStart = new Vector2(0, 0);
  private dragStartRot = new Vector2(0, 0);
  private dragMoved = 0;
  private keys: Record<string, boolean> = {};
  private zoomZ = 9;
  private exploreActive = true;
  private contextLost = false;
  private frameCount = 0;
  private lastFrameTime = 0;
  private stallCheck?: number;

  private onNodeClick?: (id: string) => void;
  private onZoomExit?: () => void;
  private labels: GraphLabel[];

  constructor(private options: IdeaSceneOptions) {
    this.mode = options.mode ?? "chaos";
    this.lowPower = options.lowPower ?? false;
    this.reduceMotion = options.reduceMotion ?? false;
    this.onNodeClick = options.onNodeClick;
    this.onZoomExit = options.onZoomExit;
    this.labels = options.labels ?? DEFAULT_LABELS;

    const { canvas } = options;
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: !this.lowPower,
      alpha: true,
      powerPreference: this.lowPower ? "low-power" : "high-performance",
    });
    // Slight tint so a live frame is obvious even before nodes settle
    this.renderer.setClearColor(0x0a0a0b, 0);
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, this.lowPower ? 1.25 : 2),
    );

    this.scene = new Scene();
    this.scene.fog = new FogExp2(0x0a0a0b, 0.012);
    this.camera = new PerspectiveCamera(50, 1, 0.1, 100);
    this.camera.position.set(0, 0.4, 11);

    this.hubGeo = new SphereGeometry(0.32, 20, 20);
    this.buildHaloMaterial();
    this.buildGraph(this.labels);
    this.buildAmbient(this.lowPower ? 45 : 90);
    this.buildGrid();
    this.scene.add(this.root);
    this.scene.add(this.grid);
    // Offset graph to the right so it sits beside left-aligned copy
    this.root.position.set(2.4, 0.15, 0);
    this.grid.position.x = 2.4;
    this.mountLabels(canvas);
    this.bindExplore(canvas);

    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      this.contextLost = true;
      this.options.canvas.dispatchEvent(
        new CustomEvent("scene:context-lost", { bubbles: true }),
      );
    });
    canvas.addEventListener("webglcontextrestored", () => {
      this.contextLost = false;
      this.lastFrameTime = performance.now();
      this.resize();
      if (!this.running) this.play();
    });

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas.parentElement ?? canvas);

    this.resize();
    this.lastFrameTime = performance.now();
    this.stallCheck = window.setInterval(() => this.checkStalled(), 1000);
    this.play();
  }

  setMode(mode: IdeaSceneMode) {
    this.mode = mode;
    this.decomposeActive = mode === "structure" || mode === "listen";
  }

  setPointer(x: number, y: number) {
    this.hoverRot.set(
      Math.max(-1, Math.min(1, y)) * 0.06,
      Math.max(-1, Math.min(1, x)) * 0.12,
    );
  }

  setScroll(_progress: number) {
    /* Zoom is driven by wheel in explore mode */
  }

  setExploreActive(active: boolean) {
    this.exploreActive = active;
  }

  triggerPulse(strength = 1) {
    this.pulse = Math.min(1.8, this.pulse + strength);
  }

  setConceptLabels(labels: GraphLabel[]) {
    const next = labels.length ? labels.slice(0, 8) : DEFAULT_LABELS;
    this.labels = next;
    next.forEach((item, i) => {
      if (!this.hubs[i]) return;
      this.hubs[i].id = item.id;
      this.hubs[i].label = item.label;
      this.hubs[i].mesh.material = this.hubMat.clone();
      (this.hubs[i].mesh.material as MeshBasicMaterial).color.set(0xffffff);
      this.hubs[i].halo.material = this.haloMat.clone();
      this.hubs[i].halo.material.color.set(0xffffff);
    });
    this.syncLabelDom();
    this.decomposeActive = true;
    this.triggerPulse(1);
    window.setTimeout(() => {
      if (this.disposed) return;
      this.hubs.forEach((h, i) => {
        if (DEFAULT_LABELS[i]) {
          h.id = DEFAULT_LABELS[i].id;
          h.label = DEFAULT_LABELS[i].label;
        }
        (h.mesh.material as MeshBasicMaterial).color.copy(this.accent);
        h.halo.material.color.copy(this.accent);
      });
      this.labels = DEFAULT_LABELS;
      this.syncLabelDom();
      this.decomposeActive = false;
    }, 4200);
  }

  resetToRoots() {
    this.setConceptLabels(DEFAULT_LABELS);
    this.mode = "chaos";
  }

  play() {
    if (this.disposed || this.running) return;
    this.running = true;
    this.loop();
  }

  pause() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private checkStalled() {
    if (!this.running || this.disposed || this.contextLost) return;
    if (this.frameCount > 0 && performance.now() - this.lastFrameTime > 2000) {
      this.options.canvas.dispatchEvent(
        new CustomEvent("scene:stalled", { bubbles: true }),
      );
      window.clearInterval(this.stallCheck);
    }
  }

  dispose() {
    this.disposed = true;
    this.pause();
    window.clearInterval(this.stallCheck);
    this.ro?.disconnect();
    this.unbindExplore(this.options.canvas);
    this.labelLayer?.remove();
    this.renderer.dispose();
  }

  private buildHaloMaterial() {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(232,255,71,0.9)");
    g.addColorStop(0.4, "rgba(232,255,71,0.28)");
    g.addColorStop(1, "rgba(232,255,71,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new CanvasTexture(c);
    this.haloMat = new SpriteMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      color: this.accent,
    });
    this.hubMat = new MeshBasicMaterial({ color: this.accent });
  }

  private fibonacci(i: number, total: number, r: number): Vector3 {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / total);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return new Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    );
  }

  private buildGraph(labels: GraphLabel[]) {
    this.hubs = [];
    const positions = labels.map((_, i) => this.fibonacci(i, labels.length, 3.1));

    labels.forEach((item, i) => {
      const pos = positions[i];
      const mesh = new Mesh(this.hubGeo, this.hubMat.clone());
      mesh.position.copy(pos);
      mesh.userData.nodeId = item.id;
      this.root.add(mesh);

      const halo = new Sprite(this.haloMat.clone());
      halo.scale.set(1.8, 1.8, 1);
      halo.position.copy(pos);
      this.root.add(halo);

      this.hubs.push({ id: item.id, label: item.label, base: pos.clone(), mesh, halo });
    });

    // Center node
    const center = new Mesh(
      new SphereGeometry(0.06, 16, 16),
      new MeshBasicMaterial({ color: 0xffffff }),
    );
    this.root.add(center);
    const centerHalo = new Sprite(this.haloMat.clone());
    centerHalo.material.color = new Color(0xffffff);
    centerHalo.scale.set(0.85, 0.85, 1);
    this.root.add(centerHalo);

    const lineMat = new LineBasicMaterial({
      color: this.dim,
      transparent: true,
      opacity: 0.9,
    });
    this.lineMats.push(lineMat);

    positions.forEach((pos) => {
      const geo = new BufferGeometry().setFromPoints([new Vector3(0, 0, 0), pos]);
      this.root.add(new Line(geo, lineMat));
    });
    for (let i = 0; i < positions.length; i++) {
      const geo = new BufferGeometry().setFromPoints([
        positions[i],
        positions[(i + 1) % positions.length],
      ]);
      this.root.add(new Line(geo, lineMat));
    }
  }

  private buildAmbient(count: number) {
    const positions: Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions.push(
        new Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ),
      );
    }
    const geo = new BufferGeometry().setFromPoints(positions);
    const pts = new Points(
      geo,
      new PointsMaterial({
        color: 0xd9dadd,
        size: 0.14,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true,
      }),
    );
    this.root.add(pts);

    const ambLine = new LineBasicMaterial({
      color: this.dim,
      transparent: true,
      opacity: 0.5,
    });
    this.lineMats.push(ambLine);
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (positions[i].distanceTo(positions[j]) < 1.2 && Math.random() < 0.28) {
          const g = new BufferGeometry().setFromPoints([positions[i], positions[j]]);
          this.root.add(new Line(g, ambLine));
        }
      }
    }
  }

  private buildGrid() {
    const gridMat = new LineBasicMaterial({
      color: 0x45464b,
      transparent: true,
      opacity: 0.65,
    });
    this.lineMats.push(gridMat);
    const size = 14;
    const div = 14;
    for (let i = 0; i <= div; i++) {
      const p = -size / 2 + (size / div) * i;
      this.grid.add(
        new Line(
          new BufferGeometry().setFromPoints([
            new Vector3(p, 0, -size / 2),
            new Vector3(p, 0, size / 2),
          ]),
          gridMat,
        ),
      );
      this.grid.add(
        new Line(
          new BufferGeometry().setFromPoints([
            new Vector3(-size / 2, 0, p),
            new Vector3(size / 2, 0, p),
          ]),
          gridMat,
        ),
      );
    }
    this.grid.position.y = -3.6;
  }

  private mountLabels(canvas: HTMLCanvasElement) {
    this.labelLayer?.remove();
    const parent = canvas.parentElement;
    if (!parent) return;
    parent.style.position = parent.style.position || "relative";
    const layer = document.createElement("div");
    layer.className = "kg-labels";
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText =
      "position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1;";
    parent.appendChild(layer);
    this.labelLayer = layer;
    this.syncLabelDom();
  }

  private syncLabelDom() {
    if (!this.labelLayer) return;
    this.labelLayer.innerHTML = "";
    for (const h of this.hubs) {
      const el = document.createElement("div");
      el.dataset.node = h.id;
      el.textContent = h.label;
      el.style.cssText =
        "position:absolute;transform:translate(-50%,-50%);font-family:IBM Plex Mono,monospace;font-size:11px;letter-spacing:0.04em;color:#c9cacc;white-space:nowrap;transition:opacity .3s,color .25s;";
      this.labelLayer.appendChild(el);
    }
  }

  private bindExplore(canvas: HTMLCanvasElement) {
    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("wheel", this.onWheel, { passive: false });
    window.addEventListener("mousemove", this.onMouseMove);
  }

  private unbindExplore(canvas: HTMLCanvasElement) {
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("mousemove", this.onMouseMove);
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.exploreActive) return;
    const mx = (e.clientX / window.innerWidth) * 2 - 1;
    const my = (e.clientY / window.innerHeight) * 2 - 1;
    this.hoverRot.set(my * 0.06, mx * 0.12);
  };

  private onPointerDown = (e: PointerEvent) => {
    if (!this.exploreActive) return;
    this.isDragging = true;
    this.dragMoved = 0;
    this.dragStart.set(e.clientX, e.clientY);
    this.dragStartRot.copy(this.dragRot);
    this.options.canvas.setPointerCapture?.(e.pointerId);
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging) return;
    const dx = e.clientX - this.dragStart.x;
    const dy = e.clientY - this.dragStart.y;
    this.dragMoved = Math.max(this.dragMoved, Math.abs(dx) + Math.abs(dy));
    this.dragRot.y = this.dragStartRot.y + dx * 0.006;
    this.dragRot.x = Math.max(-0.9, Math.min(0.9, this.dragStartRot.x + dy * 0.004));
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.dragMoved < 6) this.pickNode(e.clientX, e.clientY);
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.exploreActive) return;
    this.keys[e.key.toLowerCase()] = true;
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = false;
  };

  private onWheel = (e: WheelEvent) => {
    if (!this.exploreActive || this.reduceMotion) return;
    const hero = this.options.canvas.closest("[data-hero-mode='explore']");
    if (!hero) return;

    // Only zoom when the pointer is over the stage (not while using the command bar).
    const t = e.target;
    if (
      t instanceof Element &&
      (t.closest("form") ||
        t.closest("button") ||
        t.closest("input") ||
        t.closest("a") ||
        t.closest("[data-command-palette]"))
    ) {
      return;
    }

    // Ignore residual trackpad inertia right after load (false exits).
    if (performance.now() - this.start < 2500) return;

    e.preventDefault();
    // Gentle dolly only — never auto-exit to portfolio (Skip / nav handle that).
    this.zoomZ = Math.max(6.5, Math.min(14, this.zoomZ + e.deltaY * 0.004));
  };

  private pickNode(clientX: number, clientY: number) {
    if (!this.onNodeClick) return;
    const rect = this.options.canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    const y = -((clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
    let best: Hub | null = null;
    let bestDist = 0.2;
    for (const h of this.hubs) {
      const v = h.base.clone().applyMatrix4(this.root.matrixWorld).project(this.camera);
      const d = Math.hypot(v.x - x, v.y - y);
      if (d < bestDist) {
        bestDist = d;
        best = h;
      }
    }
    if (best) {
      this.triggerPulse(0.6);
      this.onNodeClick(best.id);
    }
  }

  private resize() {
    const canvas = this.options.canvas;
    const parent = canvas.parentElement ?? canvas;
    const w = parent.clientWidth || window.innerWidth || 1;
    const h = parent.clientHeight || window.innerHeight || 1;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  private loop = () => {
    if (!this.running || this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    if (!this.visible || this.contextLost) return;

    const now = performance.now();
    const t = (now - this.start) / 1000;
    // Always keep some motion so the hero never looks frozen.
    const motion = this.reduceMotion ? 0.35 : 1;
    this.pulse *= 0.94;

    const pan = 0.012 * motion;
    if (this.keys["w"] || this.keys["arrowup"])
      this.dragRot.x = Math.max(-0.9, this.dragRot.x - pan);
    if (this.keys["s"] || this.keys["arrowdown"])
      this.dragRot.x = Math.min(0.9, this.dragRot.x + pan);
    if (this.keys["a"] || this.keys["arrowleft"]) this.dragRot.y -= pan;
    if (this.keys["d"] || this.keys["arrowright"]) this.dragRot.y += pan;

    this.root.rotation.y =
      t * 0.28 * motion + this.dragRot.y + this.hoverRot.y * 0.5;
    this.root.rotation.x =
      Math.sin(t * 0.55 * motion) * 0.12 +
      this.dragRot.x +
      this.hoverRot.x * 0.35;

    const intro = easeOutExpo(Math.min((now - this.start) / 1800, 1));
    const thinkZoom = this.decomposeActive ? -0.7 : 0;
    this.camera.position.z = 12 - intro * (12 - this.zoomZ) + thinkZoom;
    this.camera.position.y = 0.35;

    const pulse =
      this.decomposeActive || this.pulse > 0.05
        ? 1 + Math.sin(t * 18) * 0.045 + this.pulse * 0.08
        : 1 + Math.sin(t * 1.6) * 0.015;
    this.root.scale.setScalar(pulse);

    const haloPulse = this.decomposeActive
      ? 1.9 + Math.sin(t * 28) * 0.45
      : 1.5 + Math.sin(t * 2.2) * 0.28;
    this.hubs.forEach((h) => h.halo.scale.setScalar(haloPulse));

    this.grid.rotation.y = t * 0.2 * motion;
    this.grid.position.y = -3.6 - (this.zoomZ - 9) * 0.05;
    this.grid.position.x = 2.4;

    this.root.updateMatrixWorld();
    this.projectLabels();
    this.renderer.render(this.scene, this.camera);

    this.frameCount += 1;
    this.lastFrameTime = performance.now();

    if (!this.hasRendered) {
      this.hasRendered = true;
      this.options.canvas.dispatchEvent(
        new CustomEvent("scene:first-frame", { bubbles: true }),
      );
    }
  };

  private projectLabels() {
    if (!this.labelLayer) return;
    const width = this.options.canvas.clientWidth;
    const height = this.options.canvas.clientHeight;
    const els = this.labelLayer.querySelectorAll<HTMLElement>("[data-node]");

    this.hubs.forEach((hub) => {
      const el = [...els].find((e) => e.dataset.node === hub.id);
      if (!el) return;
      const v = hub.base.clone().applyMatrix4(this.root.matrixWorld);
      v.project(this.camera);
      if (v.z > 1) {
        el.style.opacity = "0";
        return;
      }
      el.style.opacity = "1";
      el.style.left = `${(v.x * 0.5 + 0.5) * width}px`;
      el.style.top = `${(-v.y * 0.5 + 0.5) * height - 16}px`;
      el.style.color = this.decomposeActive
        ? "rgba(232,255,71,0.95)"
        : "rgba(201,202,204,0.9)";
    });
  }
}
