/* Label layer — HTML overlay for 3D node labels */
/* Runs inline, accesses global THREE */

export function createLabelLayer(
  parent: HTMLElement,
  concepts: string[],
  hubPositions: THREE.Vector3[],
  group: THREE.Group,
  camera: THREE.PerspectiveCamera
): HTMLDivElement[] {
  const labelLayer = document.createElement("div");
  labelLayer.style.cssText = "position:absolute; inset:0; pointer-events:none; z-index:1;";
  parent.appendChild(labelLayer);

  const labelEls = concepts.map((text) => {
    const el = document.createElement("div");
    el.textContent = text;
    el.style.cssText =
      "position:absolute; font-family:var(--font-mono); font-size:11px; color:var(--text-dim); letter-spacing:0.04em; transform:translate(-50%,-50%); white-space:nowrap; transition:opacity .3s;";
    labelLayer.appendChild(el);
    return el;
  });

  function updateLabels() {
    const rect = parent.getBoundingClientRect();
    hubPositions.forEach((pos, i) => {
      const v = pos.clone().applyMatrix4(group.matrixWorld).project(camera);
      const x = (v.x * 0.5 + 0.5) * rect.width;
      const y = (-v.y * 0.5 + 0.5) * rect.height;
      const visible = v.z < 1;
      labelEls[i].style.opacity = visible ? "1" : "0";
      labelEls[i].style.left = x + "px";
      labelEls[i].style.top = y - 14 + "px";
    });
  }

  return labelEls;
}
