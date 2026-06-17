"use client";

import {
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./experience.module.css";

export interface SceneHotspot {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface ResponsiveSceneImageProps {
  alt: string;
  basePath: string;
  className: string;
  eager?: boolean;
  hotspots: SceneHotspot[];
  label: string;
}

export function ResponsiveSceneImage({
  alt,
  basePath,
  className,
  eager = false,
  hotspots: _hotspots,
  label,
}: ResponsiveSceneImageProps) {
  void _hotspots;

  const sceneRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const pointerFrame = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(
    () => () => {
      if (pointerFrame.current !== null) {
        cancelAnimationFrame(pointerFrame.current);
      }
    },
    [],
  );

  useEffect(() => {
    const image = imageRef.current;

    if (!image) {
      return;
    }

    let cancelled = false;
    let frame: number | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const markLoaded = () => {
      if (!cancelled && image.complete && image.naturalWidth > 0) {
        setLoaded(true);
      }
    };

    setLoaded(false);
    markLoaded();
    image.addEventListener("load", markLoaded);
    image.addEventListener("error", markLoaded);
    frame = requestAnimationFrame(markLoaded);
    timer = setTimeout(markLoaded, 900);

    void image.decode?.().then(markLoaded).catch(() => {
      markLoaded();
    });

    return () => {
      cancelled = true;
      image.removeEventListener("load", markLoaded);
      image.removeEventListener("error", markLoaded);

      if (frame !== null) {
        cancelAnimationFrame(frame);
      }

      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [basePath]);

  function updateDepth(event: PointerEvent<HTMLElement>) {
    if (
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
    const scene = event.currentTarget;

    if (pointerFrame.current !== null) {
      cancelAnimationFrame(pointerFrame.current);
    }

    pointerFrame.current = requestAnimationFrame(() => {
      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;

      scene.style.setProperty("--scene-x", `${x * 100}%`);
      scene.style.setProperty("--scene-y", `${y * 100}%`);
      scene.style.setProperty("--scene-rotate-x", `${rotateX}deg`);
      scene.style.setProperty("--scene-rotate-y", `${rotateY}deg`);
      scene.style.setProperty("--scene-shift-x", `${(x - 0.5) * -10}px`);
      scene.style.setProperty("--scene-shift-y", `${(y - 0.5) * -10}px`);
      pointerFrame.current = null;
    });
  }

  function resetDepth() {
    if (pointerFrame.current !== null) {
      cancelAnimationFrame(pointerFrame.current);
      pointerFrame.current = null;
    }

    const scene = sceneRef.current;
    scene?.style.setProperty("--scene-x", "50%");
    scene?.style.setProperty("--scene-y", "50%");
    scene?.style.setProperty("--scene-rotate-x", "0deg");
    scene?.style.setProperty("--scene-rotate-y", "0deg");
    scene?.style.setProperty("--scene-shift-x", "0px");
    scene?.style.setProperty("--scene-shift-y", "0px");
  }

  const handleImageRef = useCallback((node: HTMLImageElement | null) => {
    imageRef.current = node;

    if (node?.complete && node.naturalWidth > 0) {
      queueMicrotask(() => setLoaded(true));
    }
  }, []);

  return (
    <figure
      ref={sceneRef}
      aria-label={label}
      className={`${styles.renderedScene} ${className}`}
      data-cursor-label={label}
      data-interactive-scene
      data-rendered-scene
      data-scene-loaded={loaded}
      onPointerLeave={resetDepth}
      onPointerMove={updateDepth}
      role="button"
      tabIndex={0}
    >
      <div className={styles.sceneDepth}>
        <picture>
          <source
            srcSet={`${basePath}-640.avif 640w, ${basePath}-960.avif 960w, ${basePath}-1122.avif 1122w`}
            sizes="(max-width: 64rem) 100vw, 46vw"
            type="image/avif"
          />
          <source
            srcSet={`${basePath}-640.webp 640w, ${basePath}-960.webp 960w, ${basePath}-1122.webp 1122w`}
            sizes="(max-width: 64rem) 100vw, 46vw"
            type="image/webp"
          />
          <img
            ref={handleImageRef}
            alt={alt}
            decoding="async"
            fetchPriority={eager ? "high" : "auto"}
            height={1402}
            loading={eager ? "eager" : "lazy"}
            onLoad={() => setLoaded(true)}
            src={`${basePath}-960.webp`}
            width={1122}
          />
        </picture>
        <span className={styles.sceneLoading} aria-hidden="true" />
        <span className={styles.sceneGrid} aria-hidden="true" />
        <span className={styles.sceneGlare} aria-hidden="true" />
      </div>
    </figure>
  );
}
