"use client";

import type { Locale } from "@/lib/i18n";
import type { CompanyConfig } from "@/lib/types";
import { ResponsiveSceneImage } from "./ResponsiveSceneImage";
import styles from "./experience.module.css";

interface JollaqWorldProps {
  company: CompanyConfig;
  locale: Locale;
}

function localize(value: { en: string; ar: string }, locale: Locale) {
  return value[locale];
}

export function JollaqWorld({ company, locale }: JollaqWorldProps) {
  const commodityGroups = [
    {
      code: "01",
      title: { en: "Grains", ar: "الحبوب" },
      items: { en: "Wheat / corn / barley", ar: "القمح / الذرة / الشعير" },
    },
    {
      code: "02",
      title: { en: "Food commodities", ar: "السلع الغذائية" },
      items: {
        en: "Green coffee / sugar / tuna / sardines",
        ar: "القهوة الخضراء / السكر / التونة / السردين",
      },
    },
    {
      code: "03",
      title: { en: "Energy supply", ar: "إمدادات الطاقة" },
      items: {
        en: "Petroleum derivatives / disclosure requires verification",
        ar: "المشتقات النفطية / يتطلب الإفصاح التحقق",
      },
    },
    {
      code: "04",
      title: { en: "Commercial materials", ar: "المواد التجارية" },
      items: { en: "Aluminum profiles", ar: "مقاطع الألمنيوم" },
    },
  ];

  return (
    <section
      className={`${styles.section} ${styles.companySection} ${styles.jollaqWorld}`}
      id="jollaq"
      data-section
    >
      <div className={styles.jollaqOpening}>
        <div>
          <p className={styles.eyebrow}>
            {company.displayName} / SYNTHEX Holding
          </p>
          <h2 tabIndex={-1}>{localize(company.heading, locale)}</h2>
          <p className={styles.lead}>{localize(company.overview, locale)}</p>
        </div>
        <div className={styles.jollaqOpeningMeta}>
          <p>
            {locale === "ar"
              ? "عالم تشغيلي للسلع والحركة والتوريد، مبني من هندسة الشحن وتدفق المواد."
              : "An operating world of commodities, movement, and supply, built from cargo geometry and material flow."}
          </p>
        </div>
      </div>

      <div className={styles.jollaqStage}>
        <div className={styles.jollaqContent}>
          <div
            className={styles.jollaqCapabilities}
            id="jollaq-capabilities"
          >
            <p className={styles.jollaqModuleLabel}>
              {locale === "ar" ? "نطاق السلع" : "Commodity scope"}
            </p>
            {commodityGroups.map((group) => (
              <article key={group.code}>
                <div>
                  <h3>{localize(group.title, locale)}</h3>
                  <p>{localize(group.items, locale)}</p>
                </div>
              </article>
            ))}
          </div>

          <aside
            className={styles.jollaqProof}
            aria-label={localize(company.proof, locale)}
          >
            <span>{locale === "ar" ? "حالة الإثبات" : "Proof status"}</span>
            <strong>
              {locale === "ar"
                ? "يلزم تقديم قصة توريد أو عقد موثق"
                : "Verified supply evidence required"}
            </strong>
            <p>{localize(company.proof, locale)}</p>
          </aside>

          <div className={styles.jollaqNetwork} id="jollaq-network">
            <p className={styles.jollaqModuleLabel}>
              {locale === "ar" ? "صلة المنظومة" : "Holding connection"}
            </p>
            <h3>
              {locale === "ar"
                ? "من المنتجات الاستراتيجية إلى منظومة التوزيع الأوسع"
                : "From strategic products into the wider distribution system"}
            </h3>
            <p>{localize(company.relationship, locale)}</p>
            <a href="#contact">
              {locale === "ar" ? "استفسار التوريد" : "Discuss supply"}
            </a>
          </div>
        </div>

        <div className={styles.jollaqStickyScene}>
          <ResponsiveSceneImage
            alt={
              locale === "ar"
                ? "المجسم الثلاثي الأبعاد المرسل لعالم JOLLAQ للسلع والتجارة"
                : "Supplied JOLLAQ 3D render combining commodities and international trade"
            }
            basePath="/media/jollaq/jollaq-commodities"
            className={styles.jollaqRender}
            hotspots={[
              {
                id: "grains",
                label: locale === "ar" ? "الحبوب الاستراتيجية" : "Strategic grains",
                x: 52,
                y: 24,
              },
              {
                id: "trade",
                label:
                  locale === "ar"
                    ? "التجارة ومسارات الإمداد"
                    : "Trade and supply routes",
                x: 55,
                y: 47,
              },
              {
                id: "energy",
                label:
                  locale === "ar"
                    ? "إمدادات مشتقات الطاقة"
                    : "Energy derivative supply",
                x: 25,
                y: 49,
              },
              {
                id: "food",
                label:
                  locale === "ar"
                    ? "السلع الغذائية الأساسية"
                    : "Essential food commodities",
                x: 48,
                y: 70,
              },
            ]}
            label="JOLLAQ / SUPPLIED 3D COMMODITY WORLD"
          />
        </div>
      </div>
    </section>
  );
}
