"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  detectWebGL,
  readGraphicsProfile,
  selectGraphicsTier,
  type GraphicsTier,
} from "@/lib/graphics-tier";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import styles from "./experience.module.css";

const MolecularHeroCanvas = dynamic(
  () =>
    import("./MolecularHeroCanvas").then(
      (module) => module.MolecularHeroCanvas,
    ),
  { ssr: false },
);

interface HeroSceneProps {
  label: string;
}

function HeroFallback({ label }: HeroSceneProps) {
  return (
    <div
      className={styles.heroFallback}
      data-scene-fallback
      role="img"
      aria-label={label}
    >
      <div className={styles.fallbackOrbit} aria-hidden="true" />
      <div className={styles.fallbackOrbitSecondary} aria-hidden="true" />
      <div className={styles.fallbackMolecule} aria-hidden="true">
        {Array.from({ length: 15 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}

export function HeroScene({ label }: HeroSceneProps) {
  const sceneRoot = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<GraphicsTier>(0);
  const [webglStatus, setWebglStatus] = useState<
    "checking" | "available" | "unavailable" | "failed"
  >("checking");
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const webglAvailable = detectWebGL();
    const updateProfile = () => {
      const profile = readGraphicsProfile(webglAvailable);
      setWebglStatus(profile.webglAvailable ? "available" : "unavailable");
      setTier(selectGraphicsTier(profile));
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    updateProfile();
    reducedMotion.addEventListener("change", updateProfile);
    window.addEventListener("resize", updateProfile);

    return () => {
      reducedMotion.removeEventListener("change", updateProfile);
      window.removeEventListener("resize", updateProfile);
    };
  }, []);

  useEffect(() => {
    const root = sceneRoot.current;
    if (!root) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const fallback = <HeroFallback label={label} />;
  const activeTier = tier === 0 ? null : tier;
  const showCanvas =
    activeTier !== null && webglStatus === "available" && visible;

  return (
    <div
      ref={sceneRoot}
      className={`${styles.heroScene} ${ready && showCanvas ? styles.heroSceneReady : ""}`}
      data-holding-scene
      data-render-tier={tier}
      data-scene-active={showCanvas}
      data-scene-ready={ready && showCanvas}
      data-webgl-status={webglStatus}
    >
      <div className={styles.heroSceneGrid} aria-hidden="true" />
      {fallback}
      {showCanvas ? (
        <div className={styles.heroCanvas} aria-hidden="true">
          <SceneErrorBoundary
            fallback={null}
            onError={() => {
              setReady(false);
              setTier(0);
              setWebglStatus("failed");
            }}
          >
            <MolecularHeroCanvas
              onReady={() => setReady(true)}
              tier={activeTier}
            />
          </SceneErrorBoundary>
        </div>
      ) : null}
      <div className={styles.sceneReadout} aria-hidden="true">
        <span>SYNTHEX / MOLECULAR SYSTEM</span>
        <span>RENDER TIER 0{tier}</span>
      </div>
    </div>
  );
}
