"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import styles from "./experience.module.css";

const railSections = [
  { id: "holding", label: { en: "Home", ar: "الرئيسية" } },
  { id: "companies", label: { en: "Companies", ar: "الشركات" } },
  { id: "overview", label: { en: "Sectors", ar: "القطاعات" } },
  { id: "story", label: { en: "Story", ar: "القصة" } },
  { id: "jollaq", label: { en: "JOLLAQ", ar: "جولاق" } },
  { id: "al-maria", label: { en: "Al Maria", ar: "المارية" } },
  { id: "industrial", label: { en: "Industrial", ar: "الصناعة" } },
  { id: "shamco", label: { en: "SHAMCO", ar: "شامكو" } },
  { id: "network", label: { en: "Network", ar: "المنظومة" } },
  { id: "contact", label: { en: "Contact", ar: "التواصل" } },
] as const;

const depthTargetSelector = [
  "#companies a[href^='#']",
  "#overview article",
  "#story article",
  "#principles article",
  "#network a[href^='#']",
  "#contact a[href^='#']",
  "#jollaq article",
  "#al-maria article",
  "#industrial article",
  "#shamco article",
  "#industrial [role='group'] button",
  "#shamco [role='group'] button",
].join(",");

const interactiveText = {
  en: {
    back: "Back to scroll",
    closeScene: "Close focused scene",
    drive: "Scroll to drive the holding system",
    explore: "Explore",
    focusScene: "Focus scene",
    moveEsc: "Move / Esc",
  },
  ar: {
    back: "العودة للتمرير",
    closeScene: "إغلاق المشهد",
    drive: "مرر لتحريك منظومة الشركة القابضة",
    explore: "استكشف",
    focusScene: "تركيز المشهد",
    moveEsc: "حرّك / Esc",
  },
} satisfies Record<Locale, Record<string, string>>;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getDepthLabel(element: HTMLElement, locale: Locale) {
  return (
    element.dataset.cursorLabel ||
    element.querySelector("strong")?.textContent?.trim() ||
    element.textContent?.trim().split(/\s+/).slice(0, 4).join(" ") ||
    interactiveText[locale].explore
  );
}

export function InteractionLayer({ locale }: { locale: Locale }) {
  const [activeSection, setActiveSection] = useState<(typeof railSections)[number]["id"]>(
    "holding",
  );
  const [focusedScene, setFocusedScene] = useState<{
    alt: string;
    label: string;
    src: string;
  } | null>(null);
  const [sceneExpanded, setSceneExpanded] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLSpanElement>(null);
  const focusedPanelRef = useRef<HTMLElement>(null);
  const activeDepthRef = useRef<HTMLElement | null>(null);
  const activeSceneRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousBodyOverflowRef = useRef("");

  const closeExpandedScene = useCallback(() => {
    const scene = activeSceneRef.current;

    if (!scene) {
      return;
    }

    scene.removeAttribute("data-scene-expanded");
    scene.removeAttribute("aria-modal");
    scene.setAttribute("role", "button");
    document.documentElement.removeAttribute("data-synthex-scene-expanded");
    document.body.style.overflow = previousBodyOverflowRef.current;
    activeSceneRef.current = null;
    setFocusedScene(null);
    setSceneExpanded(false);

    previousFocusRef.current?.focus({ preventScroll: true });
    previousFocusRef.current = null;
  }, []);

  const expandScene = useCallback(
    (scene: HTMLElement) => {
      if (activeSceneRef.current === scene) {
        return;
      }

      closeExpandedScene();
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      previousBodyOverflowRef.current = document.body.style.overflow;
      activeSceneRef.current = scene;
      const image = scene.querySelector("img");
      const label =
        scene.dataset.cursorLabel ||
        scene.getAttribute("aria-label") ||
        interactiveText[locale].focusScene;
      scene.setAttribute("data-scene-expanded", "true");
      scene.setAttribute("role", "button");
      document.documentElement.dataset.synthexSceneExpanded = "true";
      document.body.style.overflow = "hidden";
      setFocusedScene({
        alt: image?.alt || label,
        label,
        src: image?.currentSrc || image?.src || "",
      });
      setSceneExpanded(true);
    },
    [closeExpandedScene, locale],
  );

  useEffect(() => {
    if (focusedScene) {
      focusedPanelRef.current?.focus({ preventScroll: true });
    }
  }, [focusedScene]);

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let lastScrollY = window.scrollY;
    let scrollFrame: number | null = null;
    let cursorFrame: number | null = null;
    let cursorX = -120;
    let cursorY = -120;
    let targetCursorX = -120;
    let targetCursorY = -120;
    let currentSection: (typeof railSections)[number]["id"] = "holding";

    root.dataset.synthexInteractions = "ready";

    const markInteractiveTargets = () => {
      document
        .querySelectorAll<HTMLElement>(depthTargetSelector)
        .forEach((element) => {
          element.dataset.depthCard = "true";
          element.dataset.cursorLabel = getDepthLabel(element, locale);
        });

      document.querySelectorAll<HTMLElement>("[data-rendered-scene]").forEach((scene) => {
        scene.dataset.cursorLabel = interactiveText[locale].focusScene;
      });
    };

    const resetDepth = () => {
      const activeDepth = activeDepthRef.current;

      if (!activeDepth) {
        return;
      }

      activeDepth.removeAttribute("data-depth-active");
      activeDepth.style.removeProperty("transform");
      activeDepth.style.removeProperty("--depth-light-x");
      activeDepth.style.removeProperty("--depth-light-y");
      activeDepthRef.current = null;
    };

    const updateRailState = () => {
      scrollFrame = null;

      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      const progress = clamp(scrollY / maxScroll, 0, 1);
      let nextSection: (typeof railSections)[number]["id"] = currentSection;
      let closestDistance = Number.POSITIVE_INFINITY;
      const anchorPoint = window.innerHeight * 0.36;

      for (const section of railSections) {
        const element = document.getElementById(section.id);

        if (!element || element.hasAttribute("hidden")) {
          continue;
        }

        const bounds = element.getBoundingClientRect();

        if (bounds.bottom < 0 || bounds.top > window.innerHeight) {
          continue;
        }

        const distance = Math.abs(bounds.top - anchorPoint);

        if (distance < closestDistance) {
          closestDistance = distance;
          nextSection = section.id;
        }
      }

      root.style.setProperty("--synthex-scroll-progress", progress.toFixed(4));
      root.dataset.scrollDirection = scrollY >= lastScrollY ? "down" : "up";
      root.dataset.activeRail = nextSection;
      lastScrollY = scrollY;

      if (nextSection !== currentSection) {
        currentSection = nextSection;
        setActiveSection(nextSection);
      }
    };

    const requestRailUpdate = () => {
      if (scrollFrame === null) {
        scrollFrame = requestAnimationFrame(updateRailState);
      }
    };

    const animateCursor = () => {
      const cursor = cursorRef.current;

      if (!cursor || reducedMotion.matches || !finePointer.matches) {
        cursorFrame = null;
        return;
      }

      cursorX += (targetCursorX - cursorX) * 0.22;
      cursorY += (targetCursorY - cursorY) * 0.22;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      cursorFrame = requestAnimationFrame(animateCursor);
    };

    const updateCursorLabel = (target: EventTarget | null) => {
      const labelNode = cursorLabelRef.current;

      if (!labelNode || !(target instanceof Element)) {
        root.dataset.cursorState = "idle";
        return;
      }

      if (target.closest("[data-native-cursor], [data-rail-link]")) {
        root.dataset.cursorState = "idle";
        return;
      }

      const scene = target.closest<HTMLElement>("[data-rendered-scene]");
      const depthTarget = target.closest<HTMLElement>("[data-depth-card]");
      const control = target.closest<HTMLElement>("a, button");
      const source = scene ?? depthTarget ?? control;

      if (!source) {
        root.dataset.cursorState = "idle";
        return;
      }

      if (scene?.getAttribute("data-scene-expanded") === "true") {
        root.dataset.cursorState = "scene";
        labelNode.textContent = interactiveText[locale].moveEsc;
      } else if (scene) {
        root.dataset.cursorState = "scene";
        labelNode.textContent = interactiveText[locale].focusScene;
      } else {
        root.dataset.cursorState = "active";
        labelNode.textContent = getDepthLabel(source, locale);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (finePointer.matches && !reducedMotion.matches) {
        targetCursorX = event.clientX;
        targetCursorY = event.clientY;

        if (cursorFrame === null) {
          cursorFrame = requestAnimationFrame(animateCursor);
        }

        updateCursorLabel(event.target);
      }

      if (reducedMotion.matches || event.pointerType === "touch") {
        return;
      }

      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-depth-card]")
          : null;

      if (!target) {
        resetDepth();
        return;
      }

      if (activeDepthRef.current && activeDepthRef.current !== target) {
        resetDepth();
      }

      activeDepthRef.current = target;
      const bounds = target.getBoundingClientRect();
      const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
      const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
      const rotateX = (0.5 - y) * 7;
      const rotateY = (x - 0.5) * 9;
      const shiftX = (x - 0.5) * 10;
      const shiftY = (y - 0.5) * 10;

      target.dataset.depthActive = "true";
      target.style.setProperty("--depth-light-x", `${x * 100}%`);
      target.style.setProperty("--depth-light-y", `${y * 100}%`);
      target.style.transform = `perspective(900px) translate3d(${shiftX}px, ${shiftY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handlePointerLeave = () => {
      resetDepth();
      root.dataset.cursorState = "idle";
    };

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const scene = event.target.closest<HTMLElement>("[data-rendered-scene]");

      if (!scene || event.target.closest("a, button")) {
        return;
      }

      event.preventDefault();
      expandScene(scene);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeExpandedScene();
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      const activeElement = document.activeElement;

      if (!(activeElement instanceof HTMLElement)) {
        return;
      }

      const scene = activeElement.closest<HTMLElement>("[data-rendered-scene]");

      if (!scene) {
        return;
      }

      event.preventDefault();
      expandScene(scene);
    };

    markInteractiveTargets();
    updateRailState();
    window.addEventListener("scroll", requestRailUpdate, { passive: true });
    window.addEventListener("resize", requestRailUpdate);
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", requestRailUpdate);
      window.removeEventListener("resize", requestRailUpdate);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
      resetDepth();
      closeExpandedScene();
      root.removeAttribute("data-synthex-interactions");
      root.removeAttribute("data-cursor-state");
      root.removeAttribute("data-scroll-direction");
      root.removeAttribute("data-active-rail");
      root.style.removeProperty("--synthex-scroll-progress");

      if (scrollFrame !== null) {
        cancelAnimationFrame(scrollFrame);
      }

      if (cursorFrame !== null) {
        cancelAnimationFrame(cursorFrame);
      }
    };
  }, [closeExpandedScene, expandScene, locale]);

  return (
    <div className={styles.interactionLayer} data-interaction-layer>
      <div
        className={styles.interactionCursor}
        data-interaction-cursor
        ref={cursorRef}
        aria-hidden="true"
      >
        <span className={styles.interactionCursorCore} />
        <span className={styles.interactionCursorLabel} ref={cursorLabelRef}>
          {interactiveText[locale].explore}
        </span>
      </div>

      <nav
        className={styles.scrollProgressRail}
        aria-label={locale === "ar" ? "ملاحة تجربة SYNTHEX" : "SYNTHEX experience navigation"}
      >
        <span className={styles.scrollProgressTrack} aria-hidden="true" />
        {railSections.map((section) => (
          <a
            aria-current={activeSection === section.id ? "true" : undefined}
            className={styles.railLink}
            data-active={activeSection === section.id ? "true" : undefined}
            data-rail-link
            href={`#${section.id}`}
            key={section.id}
          >
            <span>{section.label[locale]}</span>
          </a>
        ))}
      </nav>

      <p className={styles.verticalDriveHint}>{interactiveText[locale].drive}</p>

      <figure
        className={styles.focusedScenePanel}
        data-active={focusedScene ? "true" : undefined}
        data-focused-scene-panel
        role="dialog"
        aria-modal={focusedScene ? "true" : undefined}
        aria-label={focusedScene?.label || interactiveText[locale].focusScene}
        ref={focusedPanelRef}
        tabIndex={focusedScene ? -1 : undefined}
      >
        {focusedScene ? (
          // eslint-disable-next-line @next/next/no-img-element -- Reuses the already-loaded optimized scene source for the focus overlay.
          <img
            alt={focusedScene.alt}
            decoding="async"
            draggable={false}
            src={focusedScene.src}
          />
        ) : null}
      </figure>

      <button
        type="button"
        className={styles.sceneFocusScrim}
        data-active={sceneExpanded ? "true" : undefined}
        aria-hidden={!sceneExpanded}
        aria-label={interactiveText[locale].closeScene}
        onClick={closeExpandedScene}
        tabIndex={sceneExpanded ? 0 : -1}
      />

      <button
        type="button"
        className={styles.sceneBackButton}
        data-active={sceneExpanded ? "true" : undefined}
        onClick={closeExpandedScene}
      >
        {interactiveText[locale].back}
      </button>
    </div>
  );
}
