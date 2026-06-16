"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { CompanyConfig } from "@/lib/types";
import {
  ResponsiveSceneImage,
  type SceneHotspot,
} from "./ResponsiveSceneImage";
import styles from "./experience.module.css";

interface ShamcoWorldProps {
  company: CompanyConfig;
  locale: Locale;
}

type ShamcoSceneId = "identity" | "network" | "warehouse";

interface ShamcoScene {
  alt: { en: string; ar: string };
  basePath: string;
  hotspots: SceneHotspot[];
  id: ShamcoSceneId;
  label: string;
  title: { en: string; ar: string };
}

function localize(value: { en: string; ar: string }, locale: Locale) {
  return value[locale];
}

export function ShamcoWorld({ company, locale }: ShamcoWorldProps) {
  const scenes: ShamcoScene[] = [
    {
      id: "identity",
      title: { en: "Distribution identity", ar: "هوية التوزيع" },
      alt: {
        en: "Supplied SHAMCO concept render combining distribution identity, freight, and network imagery",
        ar: "المجسم التصوري المرسل لـ SHAMCO ويجمع هوية التوزيع والشحن وصورة الشبكة",
      },
      basePath: "/media/shamco/shamco-identity",
      label: "SHAMCO / SUPPLIED DISTRIBUTION CONCEPT",
      hotspots: [
        { id: "freight", label: locale === "ar" ? "حركة الشحن" : "Freight movement", x: 38, y: 75 },
        { id: "distribution", label: locale === "ar" ? "منظومة التوزيع" : "Distribution system", x: 53, y: 49 },
        { id: "nodes", label: locale === "ar" ? "عقد شبكة تصورية" : "Conceptual network nodes", x: 74, y: 72 },
      ],
    },
    {
      id: "network",
      title: { en: "Route network", ar: "شبكة المسارات" },
      alt: {
        en: "Supplied conceptual 3D logistics network render; geography is illustrative and not a coverage claim",
        ar: "مجسم تصوري مرسل لشبكة لوجستية ثلاثية الأبعاد؛ الجغرافيا توضيحية ولا تمثل ادعاء تغطية",
      },
      basePath: "/media/shamco/shamco-network",
      label: "SHAMCO / CONCEPTUAL ROUTE NETWORK",
      hotspots: [
        { id: "origin", label: locale === "ar" ? "نقطة انطلاق تصورية" : "Conceptual origin node", x: 27, y: 40 },
        { id: "hub", label: locale === "ar" ? "مركز توزيع تصوري" : "Conceptual distribution hub", x: 50, y: 43 },
        { id: "route", label: locale === "ar" ? "مسار نقل تصوري" : "Conceptual transport route", x: 69, y: 35 },
        { id: "market", label: locale === "ar" ? "وصول إلى السوق" : "Market delivery", x: 50, y: 70 },
      ],
    },
    {
      id: "warehouse",
      title: { en: "Warehouse flow", ar: "تدفق المستودع" },
      alt: {
        en: "Supplied conceptual 3D warehouse and distribution flow render",
        ar: "المجسم التصوري المرسل لتدفق المستودع والتوزيع ثلاثي الأبعاد",
      },
      basePath: "/media/shamco/shamco-warehouse",
      label: "SHAMCO / SUPPLIED WAREHOUSE FLOW",
      hotspots: [
        { id: "inbound", label: locale === "ar" ? "استلام الشحنات" : "Inbound freight", x: 25, y: 45 },
        { id: "handling", label: locale === "ar" ? "مناولة المنتجات" : "Product handling", x: 55, y: 49 },
        { id: "storage", label: locale === "ar" ? "تجهيز المستودع" : "Warehouse staging", x: 73, y: 45 },
        { id: "outbound", label: locale === "ar" ? "مسارات التوزيع" : "Outbound distribution", x: 53, y: 66 },
      ],
    },
  ];
  const [activeSceneId, setActiveSceneId] =
    useState<ShamcoSceneId>("identity");
  const activeScene =
    scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0];

  const capabilityGroups = [
    {
      code: "01",
      title: { en: "Domestic logistics", ar: "الخدمات اللوجستية المحلية" },
      text: { en: "Movement, handling, and domestic delivery", ar: "الحركة والمناولة والتسليم المحلي" },
    },
    {
      code: "02",
      title: { en: "Distribution channels", ar: "قنوات التوزيع" },
      text: { en: "Agent and distributor structure requires verification", ar: "يتطلب هيكل الوكلاء والموزعين التحقق" },
    },
    {
      code: "03",
      title: { en: "Product reach", ar: "وصول المنتجات" },
      text: { en: "Food, commercial, and industrial product categories", ar: "فئات المنتجات الغذائية والتجارية والصناعية" },
    },
    {
      code: "04",
      title: { en: "Coverage evidence", ar: "أدلة التغطية" },
      text: { en: "Routes, locations, scale, and nationwide claims require proof", ar: "تتطلب المسارات والمواقع والحجم وادعاءات التغطية أدلة" },
    },
  ];

  return (
    <section
      className={`${styles.section} ${styles.companySection} ${styles.shamcoWorld}`}
      id="shamco"
      data-section
    >
      <div className={styles.shamcoOpening}>
        <div>
          <p className={styles.eyebrow}>
            {company.displayName} / SYNTHEX Holding
          </p>
          <h2 tabIndex={-1}>{localize(company.heading, locale)}</h2>
          <p className={styles.lead}>{localize(company.overview, locale)}</p>
        </div>
        <div className={styles.shamcoOpeningMeta}>
          <p>
            {locale === "ar"
              ? "عالم توزيع يربط حركة المنتجات بالمستودعات وقنوات السوق دون افتراض تغطية جغرافية غير موثقة."
              : "A distribution world connecting product movement, warehouses, and market channels without assuming unverified geographic coverage."}
          </p>
        </div>
      </div>

      <div className={styles.shamcoStage}>
        <div className={styles.shamcoStickyScene}>
          <div
            className={styles.shamcoSceneSelector}
            aria-label={locale === "ar" ? "مشاهد عالم SHAMCO" : "SHAMCO world scenes"}
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
            className={styles.shamcoRender}
            hotspots={activeScene.hotspots}
            label={activeScene.label}
          />
          <p className={styles.shamcoMapNotice}>
            {locale === "ar"
              ? "الجغرافيا في المشاهد تصورية فقط ولا تمثل تغطية أو مواقع تشغيل مؤكدة."
              : "Geography shown in these concepts is illustrative only and does not represent verified coverage or operating locations."}
          </p>
        </div>

        <div className={styles.shamcoContent}>
          <div
            className={styles.shamcoCapabilities}
            id="shamco-capabilities"
          >
            <p className={styles.shamcoModuleLabel}>
              {locale === "ar" ? "قدرات التوزيع" : "Distribution capabilities"}
            </p>
            {capabilityGroups.map((group) => (
              <article key={group.code}>
                <div>
                  <h3>{localize(group.title, locale)}</h3>
                  <p>{localize(group.text, locale)}</p>
                </div>
              </article>
            ))}
          </div>

          <aside
            className={styles.shamcoProof}
            aria-label={localize(company.proof, locale)}
          >
            <span>{locale === "ar" ? "حالة التغطية" : "Coverage status"}</span>
            <strong>
              {locale === "ar"
                ? "يلزم اعتماد أدلة الشبكة والتوزيع"
                : "Verified distribution evidence required"}
            </strong>
            <p>{localize(company.proof, locale)}</p>
          </aside>

          <div className={styles.shamcoNetwork} id="shamco-network">
            <p className={styles.shamcoModuleLabel}>
              {locale === "ar" ? "صلة المنظومة" : "Holding connection"}
            </p>
            <h3>
              {locale === "ar"
                ? "إكمال السلسلة من شركات التشغيل إلى قنوات السوق"
                : "Completing the chain from operating companies to market channels"}
            </h3>
            <p>{localize(company.relationship, locale)}</p>
            <a href="#contact">
              {locale === "ar" ? "استفسار التوزيع" : "Distribution enquiry"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
