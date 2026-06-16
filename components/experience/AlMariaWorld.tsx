"use client";

import type { Locale } from "@/lib/i18n";
import type { CompanyConfig } from "@/lib/types";
import { ResponsiveSceneImage } from "./ResponsiveSceneImage";
import styles from "./experience.module.css";

interface AlMariaWorldProps {
  company: CompanyConfig;
  locale: Locale;
}

function localize(value: { en: string; ar: string }, locale: Locale) {
  return value[locale];
}

export function AlMariaWorld({ company, locale }: AlMariaWorldProps) {
  const operatingAreas = [
    {
      code: "01",
      title: { en: "Institutional supply", ar: "التوريد المؤسساتي" },
      text: {
        en: "Government and institutional scope / permitted wording requires verification",
        ar: "النطاق الحكومي والمؤسساتي / تتطلب الصياغة المسموح بها التحقق",
      },
    },
    {
      code: "02",
      title: { en: "International procurement", ar: "المشتريات الدولية" },
      text: {
        en: "Cross-border sourcing and trade capability",
        ar: "قدرات التوريد والتجارة عبر الحدود",
      },
    },
    {
      code: "03",
      title: { en: "Edible oils", ar: "الزيوت الغذائية" },
      text: {
        en: "International sourcing categories / suppliers not disclosed",
        ar: "فئات توريد دولية / لا يتم الإفصاح عن الموردين",
      },
    },
    {
      code: "04",
      title: { en: "Phosphate exports", ar: "صادرات الفوسفات" },
      text: {
        en: "Contracts, dates, parties, and disclosure require verification",
        ar: "تتطلب العقود والتواريخ والأطراف والإفصاح التحقق",
      },
    },
  ];

  return (
    <section
      className={`${styles.section} ${styles.companySection} ${styles.alMariaWorld}`}
      id="al-maria"
      data-section
    >
      <div className={styles.alMariaOpening}>
        <div>
          <p className={styles.eyebrow}>
            {company.displayName} / SYNTHEX Holding
          </p>
          <h2 tabIndex={-1}>{localize(company.heading, locale)}</h2>
          <p className={styles.lead}>{localize(company.overview, locale)}</p>
        </div>
        <div className={styles.alMariaOpeningMeta}>
          <p>
            {locale === "ar"
              ? "سياق رسمي للتوريد والمشتريات والتجارة الدولية، دون تمثيل عقود أو جهات غير موثقة."
              : "A formal context for supply, procurement, and international trade without depicting unverified agreements or institutions."}
          </p>
        </div>
      </div>

      <div className={styles.alMariaStage}>
        <div className={styles.alMariaStickyScene}>
          <ResponsiveSceneImage
            alt={
              locale === "ar"
                ? "المجسم الثلاثي الأبعاد المرسل لعالم Al Maria للتجارة الدولية والزيوت"
                : "Supplied Al Maria 3D render for international trade and edible oils"
            }
            basePath="/media/al-maria/al-maria-trade"
            className={styles.alMariaRender}
            hotspots={[
              {
                id: "routes",
                label:
                  locale === "ar"
                    ? "مسارات التجارة الدولية"
                    : "International trade routes",
                x: 50,
                y: 30,
              },
              {
                id: "oils",
                label:
                  locale === "ar"
                    ? "توريد الزيوت الغذائية"
                    : "Edible oil procurement",
                x: 28,
                y: 56,
              },
              {
                id: "institutional",
                label:
                  locale === "ar"
                    ? "التوريد المؤسسي"
                    : "Institutional supply",
                x: 66,
                y: 59,
              },
              {
                id: "agreements",
                label:
                  locale === "ar"
                    ? "المشتريات والاتفاقيات"
                    : "Procurement and agreements",
                x: 50,
                y: 73,
              },
            ]}
            label="AL MARIA / SUPPLIED 3D TRADE WORLD"
          />
        </div>

        <div className={styles.alMariaContent}>
          <div
            className={styles.alMariaCapabilities}
            id="al-maria-capabilities"
          >
            <p className={styles.alMariaModuleLabel}>
              {locale === "ar" ? "مجالات العمل" : "Operating areas"}
            </p>
            {operatingAreas.map((area) => (
              <article key={area.code}>
                <div>
                  <h3>{localize(area.title, locale)}</h3>
                  <p>{localize(area.text, locale)}</p>
                </div>
              </article>
            ))}
          </div>

          <aside
            className={styles.alMariaProof}
            aria-label={localize(company.proof, locale)}
          >
            <span>{locale === "ar" ? "حالة السجل" : "Track record status"}</span>
            <strong>
              {locale === "ar"
                ? "يلزم اعتماد قصة مؤسساتية أو تجارية"
                : "Approved institutional evidence required"}
            </strong>
            <p>{localize(company.proof, locale)}</p>
          </aside>

          <div className={styles.alMariaNetwork} id="al-maria-network">
            <p className={styles.alMariaModuleLabel}>
              {locale === "ar" ? "صلة المنظومة" : "Holding connection"}
            </p>
            <h3>
              {locale === "ar"
                ? "توسيع قدرات التوريد إلى العلاقات الرسمية والتجارة الدولية"
                : "Extending supply capability into formal relationships and international trade"}
            </h3>
            <p>{localize(company.relationship, locale)}</p>
            <a href="#contact">
              {locale === "ar" ? "استفسار مؤسساتي" : "Institutional enquiry"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
