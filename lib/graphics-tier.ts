export type GraphicsTier = 0 | 1 | 2;

export interface GraphicsProfile {
  coarsePointer: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  reducedMotion: boolean;
  viewportWidth: number;
  webglAvailable: boolean;
}

export function selectGraphicsTier(profile: GraphicsProfile): GraphicsTier {
  if (!profile.webglAvailable || profile.reducedMotion) {
    return 0;
  }

  if (
    profile.coarsePointer ||
    profile.viewportWidth < 768 ||
    (profile.deviceMemory !== undefined && profile.deviceMemory <= 4) ||
    (profile.hardwareConcurrency !== undefined &&
      profile.hardwareConcurrency <= 4)
  ) {
    return 1;
  }

  return 2;
}

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");

    if (!context) {
      return false;
    }

    const loseContext = (
      context as WebGLRenderingContext
    ).getExtension?.("WEBGL_lose_context");
    loseContext?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function readGraphicsProfile(
  webglAvailable = detectWebGL(),
): GraphicsProfile {
  const navigatorWithMemory = navigator as Navigator & {
    deviceMemory?: number;
  };

  return {
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    deviceMemory: navigatorWithMemory.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    reducedMotion: window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches,
    viewportWidth: window.innerWidth,
    webglAvailable,
  };
}
