"use client";

import type { Locale } from "@/lib/i18n";
import { ResponsiveSceneImage } from "./ResponsiveSceneImage";
import styles from "./experience.module.css";

interface Props {
  locale: Locale;
}

const companies = [
  { href: "#jollaq", index: "01", name: "JOLLAQ", en: "Strategic supply", ar: "التوريد الاستراتيجي" },
  { href: "#al-maria", index: "02", name: "Al Maria", en: "Institutional trade", ar: "التجارة المؤسسية" },
  { href: "#industrial", index: "03", name: "SYNTHEX Industrial", en: "Materials and manufacturing", ar: "المواد والتصنيع" },
  { href: "#shamco", index: "04", name: "SHAMCO LLC", en: "Logistics and distribution", ar: "الخدمات اللوجستية والتوزيع" },
];

const sectors = [
  { code: "01", en: "Strategic supply", ar: "التوريد الاستراتيجي", enText: "Food commodities, grains, petroleum derivatives, and commercial materials.", arText: "السلع الغذائية والحبوب والمشتقات النفطية والمواد التجارية." },
  { code: "02", en: "Institutional trade", ar: "التجارة المؤسسية", enText: "International procurement, institutional supply, edible oils, and phosphate activity subject to verification.", arText: "المشتريات الدولية والتوريد المؤسسي والزيوت الغذائية وأنشطة الفوسفات الخاضعة للتحقق." },
  { code: "03", en: "Industrial materials", ar: "المواد الصناعية", enText: "Chemicals, paint raw materials, aluminum, cement, rebar, billets, and steel.", arText: "المواد الكيميائية والمواد الأولية للدهانات والألمنيوم والإسمنت وحديد التسليح والبيليت والفولاذ." },
  { code: "04", en: "Manufacturing", ar: "التصنيع", enText: "Paint-manufacturing expansion is described in the brief; stage and location require approval.", arText: "توسع تصنيع الدهانات مذكور في الملف؛ تتطلب المرحلة والموقع الاعتماد." },
  { code: "05", en: "Distribution", ar: "التوزيع", enText: "Domestic logistics and market distribution; network scale and coverage require evidence.", arText: "الخدمات اللوجستية المحلية والتوزيع؛ يتطلب حجم الشبكة والتغطية أدلة." },
];

export function HoldingOverview({ locale }: Props) {
  return (
    <section className={`${styles.section} ${styles.holdingOverview}`} id="overview" data-section>
      <div className={styles.holdingSectionHeading}>
        <div>
          <p className={styles.eyebrow}>{locale === "ar" ? "نموذج الشركة القابضة" : "Holding model"}</p>
          <h2 tabIndex={-1}>{locale === "ar" ? "قدرات مترابطة عبر التوريد والتجارة والصناعة والتوزيع" : "Connected capability across supply, trade, industry, and distribution"}</h2>
        </div>
        <p>{locale === "ar" ? "تنظم SYNTHEX Holding أربع شركات تشغيلية ضمن منظومة واحدة. تمثل الفئات نطاق العمل المذكور في الملف، وتبقى الصياغة القانونية والتجارية النهائية خاضعة للاعتماد." : "SYNTHEX Holding coordinates four operating companies within one system. These categories reflect the supplied brief; final legal and commercial wording remains subject to approval."}</p>
      </div>
      <div className={styles.holdingOverviewGrid}>
        <div className={styles.sectorList}>
          {sectors.map((sector) => (
            <article key={sector.code}>
              <div>
                <h3>{locale === "ar" ? sector.ar : sector.en}</h3>
                <p>{locale === "ar" ? sector.arText : sector.enText}</p>
              </div>
            </article>
          ))}
        </div>
        <ResponsiveSceneImage
          alt={locale === "ar" ? "مجسم تصوري مرسل لشبكة SYNTHEX Holding العالمية" : "Supplied conceptual render of the SYNTHEX Holding global network"}
          basePath="/media/holding/holding-global"
          className={styles.holdingOverviewRender}
          hotspots={[
            { id: "trade", label: locale === "ar" ? "التجارة الدولية" : "International trade", x: 52, y: 34 },
            { id: "supply", label: locale === "ar" ? "شبكات التوريد" : "Supply networks", x: 40, y: 52 },
            { id: "industry", label: locale === "ar" ? "المواد والصناعة" : "Materials and industry", x: 62, y: 58 },
            { id: "distribution", label: locale === "ar" ? "قنوات التوزيع" : "Distribution channels", x: 51, y: 74 },
          ]}
          label="SYNTHEX HOLDING / CONNECTED CAPABILITIES"
        />
      </div>
    </section>
  );
}

export function HoldingStory({ locale }: Props) {
  const timeline = [
    { marker: "35+", en: "Operating experience", ar: "خبرة تشغيلية", enText: "The brief states more than 35 years of activity. The starting year and applicable legal entity require confirmation.", arText: "يشير الملف إلى أكثر من 35 عاماً من النشاط. تتطلب سنة البداية والكيان القانوني المعني التأكيد." },
    { marker: "2012", en: "Phosphate milestone", ar: "محطة الفوسفات", enText: "A phosphate milestone is identified for 2012. Parties, scope, wording, and disclosure permission remain unverified.", arText: "تم تحديد محطة متعلقة بالفوسفات لعام 2012. لا تزال الأطراف والنطاق والصياغة وإذن الإفصاح غير موثقة." },
    { marker: "NOW", en: "Toward production", ar: "نحو الإنتاج", enText: "The current direction expands from paint raw-material supply toward manufacturing. Stage, timing, and location require confirmation.", arText: "يتجه المسار الحالي من توريد المواد الأولية للدهانات نحو التصنيع. تتطلب المرحلة والتوقيت والموقع التأكيد." },
  ];

  return (
    <section className={`${styles.section} ${styles.holdingStory}`} id="story" data-section>
      <div className={styles.storyVisual}>
        <ResponsiveSceneImage
          alt={locale === "ar" ? "مجسم تصوري مرسل لهيكل SYNTHEX Holding والنمو المؤسسي" : "Supplied conceptual render of SYNTHEX Holding structure and institutional growth"}
          basePath="/media/holding/holding-structure"
          className={styles.storyRender}
          hotspots={[
            { id: "foundation", label: locale === "ar" ? "أساس تشغيلي" : "Operating foundation", x: 50, y: 78 },
            { id: "coordination", label: locale === "ar" ? "تنسيق الشركات" : "Company coordination", x: 51, y: 49 },
            { id: "expansion", label: locale === "ar" ? "مسار التوسع" : "Expansion direction", x: 51, y: 24 },
          ]}
          label="SYNTHEX HOLDING / STORY FRAME"
        />
        <aside className={styles.leadershipNotice}>
          <span>{locale === "ar" ? "اعتماد القيادة" : "Leadership approval"}</span>
          <p>{locale === "ar" ? "ينسب الملف القيادة إلى السيد هشام عابدين. يلزم تأكيد التهجئة والمسمى والسيرة وإذن النشر قبل إبرازها." : "The brief attributes leadership to Mr. Hisham Abdeen. Spelling, title, biography, and publication permission must be confirmed before featuring it."}</p>
        </aside>
      </div>
      <div className={styles.storyContent}>
        <p className={styles.eyebrow}>{locale === "ar" ? "المسيرة" : "Holding story"}</p>
        <h2 tabIndex={-1}>{locale === "ar" ? "خبرة ومحطات واتجاه توسع موضوعة بوضوح تحت التحقق" : "Experience, milestones, and expansion with clear verification status"}</h2>
        <div className={styles.timelineDetailed}>
          {timeline.map((item) => (
            <article key={item.marker}>
              <strong>{item.marker}</strong>
              <div>
                <h3>{locale === "ar" ? item.ar : item.en}</h3>
                <p>{locale === "ar" ? item.arText : item.enText}</p>
                <span>{locale === "ar" ? "يتطلب اعتماد العميل" : "Client verification required"}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HoldingPrinciples({ locale }: Props) {
  const principles = [
    { en: "Vision", ar: "الرؤية", enText: "Define the long-term position SYNTHEX intends to hold across trade, industry, and distribution.", arText: "تحديد الموقع طويل الأمد الذي تستهدفه SYNTHEX في التجارة والصناعة والتوزيع." },
    { en: "Mission", ar: "الرسالة", enText: "Define whom the holding serves, what it coordinates, and how value is delivered.", arText: "تحديد الجهات التي تخدمها الشركة القابضة وما الذي تنسقه وكيف تقدم القيمة." },
    { en: "Values", ar: "القيم", enText: "No integrity, quality, partnership, or reliability claims will be published without confirmation.", arText: "لن تنشر ادعاءات النزاهة أو الجودة أو الشراكة أو الموثوقية دون تأكيد." },
  ];
  return (
    <section className={`${styles.section} ${styles.holdingPrinciples}`} id="principles" data-section>
      <div className={styles.holdingSectionHeading}>
        <div>
          <p className={styles.eyebrow}>{locale === "ar" ? "المبادئ المؤسسية" : "Corporate principles"}</p>
          <h2 tabIndex={-1}>{locale === "ar" ? "هيكل جاهز للنصوص المعتمدة، دون اختراع لغة مؤسسية" : "A finished structure awaiting approved corporate language"}</h2>
        </div>
        <p>{locale === "ar" ? "لم يتضمن المصدر نصوصاً معتمدة للرؤية أو الرسالة أو القيم. يوضح القسم ما يلزم اعتماده قبل النشر." : "No approved vision, mission, or values copy was supplied. This section states what must be approved before publication."}</p>
      </div>
      <div className={styles.principleGrid}>
        {principles.map((principle) => (
          <article key={principle.en}>
            <h3>{locale === "ar" ? principle.ar : principle.en}</h3>
            <p>{locale === "ar" ? principle.arText : principle.enText}</p>
            <strong>{locale === "ar" ? "نص معتمد مطلوب" : "Approved copy required"}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HoldingNetwork({ locale }: Props) {
  return (
    <section className={`${styles.section} ${styles.holdingNetwork}`} id="network" data-section>
      <div className={styles.networkConclusion}>
        <div>
          <p className={styles.eyebrow}>{locale === "ar" ? "المنظومة الموحدة" : "Unified holding"}</p>
          <h2 tabIndex={-1}>{locale === "ar" ? "أربع قدرات تشغيلية تعود إلى مركز واحد" : "Four operating capabilities reconnect under one holding system"}</h2>
          <p className={styles.lead}>{locale === "ar" ? "تربط SYNTHEX Holding التوريد الاستراتيجي والتجارة المؤسسية والمواد والتصنيع والتوزيع المحلي ضمن سرد مؤسسي واحد." : "SYNTHEX Holding connects strategic supply, institutional trade, materials and manufacturing, and domestic distribution within one corporate narrative."}</p>
          <div className={styles.networkCompanies}>
            {companies.map((company) => (
              <a href={company.href} key={company.href}>
                <strong>{company.name}</strong><small>{locale === "ar" ? company.ar : company.en}</small>
              </a>
            ))}
          </div>
        </div>
        <ResponsiveSceneImage
          alt={locale === "ar" ? "مجسم تصوري مرسل للشبكة الموحدة لشركات SYNTHEX Holding" : "Supplied conceptual render of the unified SYNTHEX Holding company network"}
          basePath="/media/holding/holding-network"
          className={styles.networkRender}
          hotspots={companies.map((company, index) => ({ id: company.href.slice(1), label: `${company.name} / ${locale === "ar" ? company.ar : company.en}`, x: [32, 68, 38, 65][index], y: [32, 36, 67, 70][index] }))}
          label="SYNTHEX HOLDING / FOUR SYSTEMS RECONNECTED"
        />
      </div>
    </section>
  );
}

export function HoldingContact({ locale }: Props) {
  return (
    <section className={`${styles.section} ${styles.holdingContact}`} id="contact" data-section>
      <div className={styles.contactIntro}>
        <p className={styles.eyebrow}>{locale === "ar" ? "مسار الشراكة" : "Partnership routing"}</p>
        <h2 tabIndex={-1}>{locale === "ar" ? "اختر مجال المحادثة المناسب" : "Route the conversation to the right operating context"}</h2>
        <p>{locale === "ar" ? "لا يتم جمع بيانات أو إرسال نموذج حالياً. يلزم توفير بريد وهاتف وعنوان وقواعد توجيه معتمدة قبل تفعيل التواصل." : "No data is collected or submitted yet. Approved email, phone, address, and routing rules are required before contact activation."}</p>
      </div>
      <div className={styles.contactRoutes}>
        {companies.map((company) => (
          <a href={company.href} key={company.href}>
            <div><strong>{company.name}</strong><small>{locale === "ar" ? company.ar : company.en}</small></div><b aria-hidden="true">↗</b>
          </a>
        ))}
      </div>
      <aside className={styles.contactDependency}>
        <strong>{locale === "ar" ? "بيانات مطلوبة قبل الإطلاق" : "Required before launch"}</strong>
        <p>{locale === "ar" ? "البريد الإلكتروني ورقم الهاتف والعنوان القانوني وسياسة الخصوصية ووجهة كل نوع من الاستفسارات." : "Email, phone, legal address, privacy policy, and the destination for each enquiry type."}</p>
      </aside>
    </section>
  );
}

export function HoldingFooter({ locale }: Props) {
  return (
    <footer className={styles.corporateFooter} id="footer" data-section>
      <div><strong>SYNTHEX Holding</strong><p>{locale === "ar" ? "منظومة قابضة للتوريد والتجارة والصناعة والتوزيع." : "A holding system spanning supply, trade, industry, and distribution."}</p></div>
      <nav aria-label={locale === "ar" ? "روابط الشركات" : "Company links"}>{companies.map((company) => <a href={company.href} key={company.href}>{company.name}</a>)}</nav>
      <div className={styles.footerStatus}><span>{locale === "ar" ? "اعتماد مطلوب" : "Approval required"}</span><p>{locale === "ar" ? "الأسماء القانونية والتسجيلات وبيانات التواصل والسياسات غير متوفرة بعد." : "Legal names, registrations, contact details, and policies are not yet supplied."}</p></div>
    </footer>
  );
}
