"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { CompanyConfig } from "@/lib/types";
import {
  ResponsiveSceneImage,
  type SceneHotspot,
} from "./ResponsiveSceneImage";
import styles from "./experience.module.css";

interface IndustrialWorldProps {
  company: CompanyConfig;
  locale: Locale;
}

type IndustrialSceneId = "identity" | "metals" | "paint";

interface IndustrialScene {
  alt: { en: string; ar: string };
  basePath: string;
  hotspots: SceneHotspot[];
  id: IndustrialSceneId;
  label: string;
  title: { en: string; ar: string };
}

function localize(value: { en: string; ar: string }, locale: Locale) {
  return value[locale];
}

export function IndustrialWorld({ company, locale }: IndustrialWorldProps) {
  const scenes: IndustrialScene[] = [
    {
      id: "identity",
      title: { en: "Industrial system", ar: "المنظومة الصناعية" },
      alt: {
        en: "Supplied SYNTHEX Industrial 3D identity render with factory and metal materials",
        ar: "المجسم الثلاثي الأبعاد المرسل لهوية SYNTHEX Industrial مع المصنع والمواد المعدنية",
      },
      basePath: "/media/industrial/industrial-identity",
      label: "SYNTHEX INDUSTRIAL / SUPPLIED 3D IDENTITY",
      hotspots: [
        { id: "factory", label: locale === "ar" ? "القدرة الصناعية" : "Industrial capability", x: 72, y: 29 },
        { id: "identity", label: locale === "ar" ? "هوية الذراع الصناعي" : "Industrial arm identity", x: 52, y: 53 },
        { id: "materials", label: locale === "ar" ? "مجموعة المواد" : "Materials portfolio", x: 50, y: 78 },
      ],
    },
    {
      id: "metals",
      title: { en: "Construction materials", ar: "مواد البناء" },
      alt: {
        en: "Supplied 3D render of steel, aluminum profiles, rebar, and construction materials",
        ar: "المجسم الثلاثي الأبعاد المرسل للفولاذ ومقاطع الألمنيوم وحديد التسليح ومواد البناء",
      },
      basePath: "/media/industrial/industrial-metals",
      label: "SYNTHEX INDUSTRIAL / SUPPLIED METALS WORLD",
      hotspots: [
        { id: "profiles", label: locale === "ar" ? "مقاطع الألمنيوم والفولاذ" : "Aluminum and steel profiles", x: 31, y: 39 },
        { id: "rebar", label: locale === "ar" ? "حديد التسليح" : "Rebar", x: 57, y: 25 },
        { id: "cement", label: locale === "ar" ? "الإسمنت ومواد الإنشاء" : "Cement and construction materials", x: 48, y: 53 },
        { id: "billets", label: locale === "ar" ? "البيليت ومنتجات الفولاذ" : "Billets and steel products", x: 67, y: 64 },
      ],
    },
    {
      id: "paint",
      title: { en: "Chemicals and paint", ar: "الكيماويات والدهانات" },
      alt: {
        en: "Supplied 3D render of industrial chemicals and paint manufacturing materials",
        ar: "المجسم الثلاثي الأبعاد المرسل للمواد الكيميائية الصناعية ومواد تصنيع الدهانات",
      },
      basePath: "/media/industrial/industrial-paint",
      label: "SYNTHEX INDUSTRIAL / SUPPLIED PAINT WORLD",
      hotspots: [
        { id: "chemicals", label: locale === "ar" ? "المواد الكيميائية الصناعية" : "Industrial chemicals", x: 28, y: 65 },
        { id: "raw-materials", label: locale === "ar" ? "المواد الأولية للدهانات" : "Paint raw materials", x: 48, y: 45 },
        { id: "production", label: locale === "ar" ? "توسع التصنيع قيد التحقق" : "Manufacturing expansion requires verification", x: 58, y: 64 },
        { id: "color", label: locale === "ar" ? "منظومة الدهانات" : "Paint system", x: 74, y: 48 },
      ],
    },
  ];
  const [activeSceneId, setActiveSceneId] =
    useState<IndustrialSceneId>("identity");
  const activeScene =
    scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0];

  const materialGroups = [
    {
      code: "01",
      title: { en: "Industrial chemicals", ar: "المواد الكيميائية الصناعية" },
      text: { en: "Chemical categories and paint raw materials", ar: "فئات كيميائية ومواد أولية للدهانات" },
    },
    {
      code: "02",
      title: { en: "Aluminum profiles", ar: "مقاطع الألمنيوم" },
      text: { en: "Commercial and industrial profile supply", ar: "توريد المقاطع التجارية والصناعية" },
    },
    {
      code: "03",
      title: { en: "Cement and steel", ar: "الإسمنت والفولاذ" },
      text: { en: "Cement, rebar, billets, and steel categories", ar: "الإسمنت وحديد التسليح والبيليت وفئات الفولاذ" },
    },
    {
      code: "04",
      title: { en: "Paint manufacturing", ar: "تصنيع الدهانات" },
      text: { en: "Project stage, location, and timing require confirmation", ar: "تتطلب مرحلة المشروع وموقعه وتوقيته التأكيد" },
    },
  ];

  return (
    <section
      className={`${styles.section} ${styles.companySection} ${styles.industrialWorld}`}
      id="industrial"
      data-section
    >
      <div className={styles.industrialOpening}>
        <div>
          <p className={styles.eyebrow}>
            {company.displayName} / SYNTHEX Holding
          </p>
          <h2 tabIndex={-1}>{localize(company.heading, locale)}</h2>
          <p className={styles.lead}>{localize(company.overview, locale)}</p>
        </div>
        <div className={styles.industrialOpeningMeta}>
          <p>
            {locale === "ar"
              ? "عالم صناعي يجمع المواد والمعادن والكيماويات ومسار الانتقال المدروس نحو التصنيع."
              : "An industrial world connecting materials, metals, chemicals, and the controlled move toward manufacturing."}
          </p>
        </div>
      </div>

      <div className={styles.industrialStage}>
        <div className={styles.industrialContent}>
          <div
            className={styles.industrialCapabilities}
            id="industrial-capabilities"
          >
            <p className={styles.industrialModuleLabel}>
              {locale === "ar" ? "نطاق المواد" : "Materials scope"}
            </p>
            {materialGroups.map((group) => (
              <article key={group.code}>
                <div>
                  <h3>{localize(group.title, locale)}</h3>
                  <p>{localize(group.text, locale)}</p>
                </div>
              </article>
            ))}
          </div>

          <aside
            className={styles.industrialProof}
            aria-label={localize(company.proof, locale)}
          >
            <span>{locale === "ar" ? "حالة المشروع" : "Project status"}</span>
            <strong>
              {locale === "ar"
                ? "يلزم اعتماد مواد المشروع أو المنشأة"
                : "Approved project evidence required"}
            </strong>
            <p>{localize(company.proof, locale)}</p>
          </aside>

          <div className={styles.industrialNetwork} id="industrial-network">
            <p className={styles.industrialModuleLabel}>
              {locale === "ar" ? "صلة المنظومة" : "Holding connection"}
            </p>
            <h3>
              {locale === "ar"
                ? "من توريد المواد إلى قدرة تصنيع مختارة"
                : "From material supply toward selected manufacturing capability"}
            </h3>
            <p>{localize(company.relationship, locale)}</p>
            <a href="#contact">
              {locale === "ar" ? "استفسار صناعي" : "Industrial enquiry"}
            </a>
          </div>
        </div>

        <div className={styles.industrialStickyScene}>
          <div
            className={styles.industrialSceneSelector}
            aria-label={locale === "ar" ? "مشاهد العالم الصناعي" : "Industrial world scenes"}
            role="group"
          >
            {scenes.map((scene) => (
              <button
                key={scene.id}
                type="button"
                data-active={scene.id === activeSceneId}
                onClick={() => setActiveSceneId(scene.id)}
                aria-pressed={scene.id === activeSceneId}
              >
                {localize(scene.title, locale)}
              </button>
            ))}
          </div>
          <ResponsiveSceneImage
            key={activeScene.id}
            alt={localize(activeScene.alt, locale)}
            basePath={activeScene.basePath}
            className={styles.industrialRender}
            hotspots={activeScene.hotspots}
            label={activeScene.label}
          />
        </div>
      </div>
    </section>
  );
}
