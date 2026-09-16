/**
 * Device / preference checks before loading WebGL.
 */

export type SceneCapability = {
  webgl: boolean;
  reduceMotion: boolean;
  saveData: boolean;
  coarsePointer: boolean;
  lowPower: boolean;
};

export function getSceneCapability(): SceneCapability {
  if (typeof window === "undefined") {
    return {
      webgl: false,
      reduceMotion: true,
      saveData: false,
      coarsePointer: true,
      lowPower: true,
    };
  }

  const canvas = document.createElement("canvas");
  // Do not use failIfMajorPerformanceCaveat — it blocks many Windows GPUs.
  const gl =
    canvas.getContext("webgl2") ||
    canvas.getContext("webgl") ||
    canvas.getContext("experimental-webgl");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData =
    "connection" in navigator &&
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const cores =
    typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : 4;
  const lowPower =
    window.innerWidth < 768 || coarsePointer || saveData || cores <= 4;

  return {
    webgl: Boolean(gl),
    reduceMotion,
    saveData: Boolean(saveData),
    coarsePointer,
    lowPower,
  };
}

/** Load Three whenever WebGL exists. Reduced-motion still gets a static frame path later. */
export function shouldLoadThree(cap: SceneCapability = getSceneCapability()): boolean {
  return cap.webgl;
}
