"use client";

import Link from "next/link";
import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  companyById,
  companyConfigs,
  holdingNavigation,
  text,
} from "@/lib/content";
import {
  companyForTarget,
  createInitialState,
  experienceReducer,
  normalizeTarget,
  sectionIds,
} from "@/lib/experience-state";
import { otherLocale, type Locale } from "@/lib/i18n";
import type {
  CompanyId,
  NavigationItem,
  NavigationTarget,
  SectionId,
} from "@/lib/types";
import { AlMariaWorld } from "./AlMariaWorld";
import {
  HoldingContact,
  HoldingFooter,
  HoldingNetwork,
  HoldingOverview,
  HoldingPrinciples,
  HoldingStory,
} from "./HoldingSections";
import { IndustrialWorld } from "./IndustrialWorld";
import { InteractionLayer } from "./InteractionLayer";
import { JollaqWorld } from "./JollaqWorld";
import { ResponsiveSceneImage } from "./ResponsiveSceneImage";
import { ScenePlaceholder } from "./ScenePlaceholder";
import { ShamcoWorld } from "./ShamcoWorld";
import styles from "./experience.module.css";

interface ExperiencePageProps {
  locale: Locale;
}

function localize(value: { en: string; ar: string }, locale: Locale) {
  return value[locale];
}

const heroCommandItems = [
  {
    code: "01",
    label: { en: "Holding-led narrative", ar: "الهوية القابضة" },
    text: {
      en: "SYNTHEX anchors the experience while each operating company keeps a clear role.",
      ar: "تتصدر SYNTHEX Holding السرد المؤسسي الرئيسي.",
    },
  },
  {
    code: "02",
    label: { en: "Distinct operating worlds", ar: "أربعة مجالات" },
    text: {
      en: "Supply, institutions, industry, and distribution each carry their own visual language.",
      ar: "لكل ذراع تشغيلي نظام بصري مستقل.",
    },
  },
  {
    code: "03",
    label: { en: "Review-ready content", ar: "ادعاءات موثقة" },
    text: {
      en: "Unconfirmed legal, contact, and achievement claims remain clearly marked.",
      ar: "تبقى الادعاءات غير المعتمدة موضحة للمراجعة.",
    },
  },
];

const companyPreviewAssets: Record<
  Exclude<CompanyId, "holding">,
  { image: string; meta: { en: string; ar: string } }
> = {
  jollaq: {
    image: "/media/jollaq/jollaq-commodities-640.avif",
    meta: {
      en: "Commodity flow / cargo system",
      ar: "تدفق السلع / منظومة الشحن",
    },
  },
  "al-maria": {
    image: "/media/al-maria/al-maria-trade-640.avif",
    meta: {
      en: "Institutional planes / trade routes",
      ar: "مستويات مؤسسية / مسارات التجارة",
    },
  },
  industrial: {
    image: "/media/industrial/industrial-paint-640.avif",
    meta: {
      en: "Materials / paint manufacturing",
      ar: "المواد / تصنيع الدهانات",
    },
  },
  shamco: {
    image: "/media/shamco/shamco-network-640.avif",
    meta: {
      en: "Distribution network / route system",
      ar: "شبكة توزيع / منظومة مسارات",
    },
  },
};

export function ExperiencePage({ locale }: ExperiencePageProps) {
  const [state, dispatch] = useReducer(
    experienceReducer,
    createInitialState(locale),
  );
  const pendingTarget = useRef<NavigationTarget | null>(null);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectorRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [previewCompany, setPreviewCompany] = useState<
    Exclude<CompanyId, "holding"> | "none"
  >("none");

  const activeConfig =
    state.activeCompany === "holding"
      ? null
      : companyById[state.activeCompany];

  const navigation: NavigationItem[] = activeConfig
    ? activeConfig.nav
    : holdingNavigation;

  const ctaLabel = activeConfig
    ? localize(activeConfig.cta, locale)
    : locale === "ar"
      ? "بدء التواصل"
      : "Start a conversation";

  const activeCompanyName = activeConfig?.displayName ?? text.holdingName;

  const localeHref = `/${otherLocale(locale)}/`;

  const sectionElements = useMemo(
    () => sectionIds.map((id) => ({ id })),
    [],
  );

  useEffect(() => {
    const initialTarget = normalizeTarget(window.location.hash);
    pendingTarget.current = window.location.hash ? initialTarget : null;
    dispatch({
      type: "INITIALIZE",
      locale,
      hash: window.location.hash,
    });
  }, [locale]);

  useEffect(() => {
    document.documentElement.dataset.company = state.activeCompany;
    document.documentElement.dataset.activeSection = state.activeSection;
    document.documentElement.dataset.navigationSource = state.source;
  }, [state]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]:not([hidden])"),
    );

    document.documentElement.dataset.motion = reducedMotion
      ? "reduced"
      : "full";

    revealElements.forEach((element) => {
      element.dataset.reveal = "true";
      if (reducedMotion) {
        element.dataset.visible = "true";
      }
    });

    if (reducedMotion) {
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          (entry.target as HTMLElement).dataset.visible = "true";
          revealObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      },
    );

    revealElements.forEach((element) => revealObserver.observe(element));
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const restoreFromUrl = () => {
      const target = normalizeTarget(window.location.hash);
      pendingTarget.current = target;
      dispatch({ type: "RESTORE", hash: window.location.hash });

      const element = document.getElementById(target);
      element?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    };

    window.addEventListener("popstate", restoreFromUrl);
    window.addEventListener("hashchange", restoreFromUrl);

    return () => {
      window.removeEventListener("popstate", restoreFromUrl);
      window.removeEventListener("hashchange", restoreFromUrl);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (pendingTarget.current) {
          const pendingSection = sectionIds.includes(
            pendingTarget.current as SectionId,
          )
            ? pendingTarget.current
            : companyForTarget(pendingTarget.current);
          const reached = entries.some(
            (entry) =>
              entry.isIntersecting &&
              entry.target.id === pendingSection &&
              entry.intersectionRatio >= 0.25,
          );

          if (reached) {
            pendingTarget.current = null;
            if (pendingTimer.current) {
              clearTimeout(pendingTimer.current);
            }
          }
          return;
        }

        const dominant = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!dominant) {
          return;
        }

        const target = dominant.target.id as SectionId;
        dispatch({ type: "OBSERVE", target });
        window.history.replaceState(null, "", `#${target}`);
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.15, 0.3, 0.5, 0.7],
      },
    );

    sectionElements.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sectionElements]);

  useEffect(() => {
    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape" || state.activeCompany === "holding") {
        return;
      }

      event.preventDefault();
      const target = document.getElementById("companies");
      pendingTarget.current = "companies";
      dispatch({ type: "NAVIGATE", target: "companies" });
      window.history.pushState(null, "", "#companies");
      target?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });

      window.setTimeout(() => selectorRefs.current[0]?.focus(), 650);
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [state.activeCompany]);

  function navigate(
    target: NavigationTarget,
    options: { focus?: boolean } = {},
  ) {
    const element = document.getElementById(target);
    if (!element) {
      return;
    }

    pendingTarget.current = target;
    if (pendingTimer.current) {
      clearTimeout(pendingTimer.current);
    }
    pendingTimer.current = setTimeout(() => {
      pendingTarget.current = null;
    }, 1400);

    dispatch({ type: "NAVIGATE", target });
    window.history.pushState(null, "", `#${target}`);
    element.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });

    if (options.focus) {
      window.setTimeout(() => {
        element.querySelector<HTMLElement>("h1, h2")?.focus({
          preventScroll: true,
        });
      }, 650);
    }
  }

  function handleNavigationClick(
    event: MouseEvent<HTMLAnchorElement>,
    target: NavigationTarget,
  ) {
    event.preventDefault();
    navigate(target, { focus: true });
  }

  function handleLocaleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const hash = window.location.hash;
    window.location.assign(`${localeHref}${hash}`);
  }

  function handleSelectorKeyDown(event: KeyboardEvent<HTMLElement>) {
    const currentIndex = selectorRefs.current.findIndex(
      (element) => element === document.activeElement,
    );

    if (currentIndex < 0) {
      return;
    }

    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % companyConfigs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex =
        (currentIndex - 1 + companyConfigs.length) % companyConfigs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = companyConfigs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    selectorRefs.current[nextIndex]?.focus();
  }

  return (
    <>
      <a className={styles.skipLink} href="#holding">
        {locale === "ar" ? "تجاوز إلى المحتوى" : "Skip to content"}
      </a>

      <header
        className={styles.navbar}
        data-company={state.activeCompany}
        data-navigation-source={state.source}
      >
        <div className={styles.navbarInner}>
          <a
            className={styles.brand}
            href="#companies"
            onClick={(event) => handleNavigationClick(event, "companies")}
            aria-label={
              locale === "ar"
                ? "العودة إلى محدد الشركات"
                : "Return to the company selector"
            }
          >
            <span>{text.holdingName}</span>
            <strong>{activeCompanyName}</strong>
          </a>

          <nav
            className={styles.contextNavigation}
            aria-label={
              locale === "ar" ? "التنقل ضمن السياق" : "Context navigation"
            }
          >
            {activeConfig ? (
              <a
                className={styles.holdingReturn}
                href="#companies"
                onClick={(event) =>
                  handleNavigationClick(event, "companies")
                }
              >
                {locale === "ar" ? "الشركة القابضة" : "Holding"}
              </a>
            ) : null}

            {navigation.map((item) => (
              <a
                key={item.target}
                href={`#${item.target}`}
                aria-current={
                  state.activeSection === item.target ? "location" : undefined
                }
                onClick={(event) =>
                  handleNavigationClick(event, item.target)
                }
              >
                {localize(item.label, locale)}
              </a>
            ))}
          </nav>

          <Link
            className={styles.localeLink}
            href={localeHref}
            hrefLang={otherLocale(locale)}
            onClick={handleLocaleClick}
            aria-label={
              locale === "ar"
                ? "Switch to English"
                : "التبديل إلى اللغة العربية"
            }
          >
            {locale === "ar" ? "EN" : "AR"}
          </Link>

          <a
            className={styles.navCta}
            href="#contact"
            onClick={(event) => handleNavigationClick(event, "contact")}
          >
            {ctaLabel}
          </a>
        </div>
      </header>

      <main>
        <section
          className={`${styles.section} ${styles.hero}`}
          id="holding"
          data-section
        >
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                {localize(text.holdingEyebrow, locale)}
              </p>
              <h1 tabIndex={-1}>
                {localize(text.holdingHeading, locale)}
              </h1>
              <p className={styles.lead}>
                {localize(text.holdingOverview, locale)}
              </p>
              <div className={styles.actions}>
                <a
                  className={styles.primaryButton}
                  href="#companies"
                  onClick={(event) =>
                    handleNavigationClick(event, "companies")
                  }
                >
                  {locale === "ar" ? "استكشف الشركات" : "Explore the companies"}
                </a>
                <a
                  className={styles.secondaryButton}
                  href="#overview"
                  onClick={(event) =>
                    handleNavigationClick(event, "overview")
                  }
                >
                  {locale === "ar"
                    ? "تعرّف على الشركة القابضة"
                    : "Understand the holding"}
                </a>
              </div>
              <div
                className={styles.heroCommandRail}
                aria-label={
                  locale === "ar"
                    ? "ملخص نظام SYNTHEX"
                    : "SYNTHEX system summary"
                }
              >
                {heroCommandItems.map((item) => (
                  <article key={item.code}>
                    <strong>{localize(item.label, locale)}</strong>
                    <p>{localize(item.text, locale)}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className={styles.heroVisualStack}>
              <ResponsiveSceneImage
              alt={
                locale === "ar"
                  ? "مجسم ثلاثي الأبعاد لهوية SYNTHEX Holding الجزيئية"
                  : "Supplied 3D render of the SYNTHEX Holding molecular identity"
              }
              basePath="/media/holding/synthex-holding"
              className={styles.holdingRender}
              eager
              hotspots={[
                {
                  id: "network",
                  label:
                    locale === "ar"
                      ? "شبكة جزيئية موحدة"
                      : "Unified molecular network",
                  x: 55,
                  y: 31,
                },
                {
                  id: "identity",
                  label:
                    locale === "ar"
                      ? "هوية SYNTHEX المعدنية"
                      : "Engineered SYNTHEX identity",
                  x: 49,
                  y: 53,
                },
                {
                  id: "foundation",
                  label:
                    locale === "ar"
                      ? "منصة الشركة القابضة"
                      : "Holding company foundation",
                  x: 51,
                  y: 78,
                },
              ]}
              label="SYNTHEX / SUPPLIED 3D IDENTITY"
              />
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.selectorSection}`}
          id="companies"
          data-section
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>
                {locale === "ar" ? "الشركات التشغيلية" : "Operating companies"}
              </p>
              <h2 tabIndex={-1}>
                {localize(text.companiesHeading, locale)}
              </h2>
            </div>
            <p>{localize(text.companiesOverview, locale)}</p>
          </div>

          <nav
            className={styles.companySelector}
            data-preview-company={previewCompany}
            aria-label={
              locale === "ar" ? "شركات SYNTHEX" : "SYNTHEX companies"
            }
            onKeyDown={handleSelectorKeyDown}
          >
            {companyConfigs.map((company, index) => {
              const selected = state.activeCompany === company.id;
              const preview = companyPreviewAssets[company.id];
              return (
                <a
                  key={company.id}
                  ref={(element) => {
                    selectorRefs.current[index] = element;
                  }}
                  className={styles.companyOption}
                  data-company={company.id}
                  href={`#${company.id}`}
                  aria-current={selected ? "location" : undefined}
                  style={
                    {
                      "--company-preview-image": `url(${preview.image})`,
                    } as CSSProperties
                  }
                  tabIndex={selected || state.activeCompany === "holding" && index === 0 ? 0 : -1}
                  onBlur={() => setPreviewCompany("none")}
                  onClick={(event) =>
                    handleNavigationClick(event, company.id)
                  }
                  onFocus={() => setPreviewCompany(company.id)}
                  onMouseEnter={() => setPreviewCompany(company.id)}
                  onMouseLeave={() => setPreviewCompany("none")}
                >
                  <span className={styles.companyPreviewArt} aria-hidden="true" />
                  <span className={styles.companyPortal} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <b />
                  </span>
                  <span className={styles.companySignal}>
                    {localize(preview.meta, locale)}
                  </span>
                  <strong>{company.displayName}</strong>
                  <small>{localize(company.eyebrow, locale)}</small>
                </a>
              );
            })}
          </nav>
        </section>

        <HoldingOverview locale={locale} />
        <HoldingStory locale={locale} />
        <HoldingPrinciples locale={locale} />

        <section hidden className={styles.section} id="overview-legacy">
          <p className={styles.eyebrow}>
            {locale === "ar" ? "نموذج الشركة القابضة" : "Holding model"}
          </p>
          <h2 tabIndex={-1}>{localize(text.overviewHeading, locale)}</h2>
          <div className={styles.operatingGrid}>
            {companyConfigs.map((company) => (
              <article key={company.id} className={styles.operatingCard}>
                <span aria-hidden="true" />
                <h3>{company.displayName}</h3>
                <p>{localize(company.eyebrow, locale)}</p>
              </article>
            ))}
          </div>
        </section>

        <section hidden className={styles.section} id="story-legacy">
          <p className={styles.eyebrow}>
            {locale === "ar" ? "المسيرة" : "Holding story"}
          </p>
          <h2 tabIndex={-1}>{localize(text.storyHeading, locale)}</h2>
          <div className={styles.timeline}>
            <article>
              <strong>35+</strong>
              <p>
                {locale === "ar"
                  ? "يتطلب التحقق من سنة البداية والكيان القانوني المعني."
                  : "Starting year and applicable legal entity require verification."}
              </p>
            </article>
            <article>
              <strong>2012</strong>
              <p>
                {locale === "ar"
                  ? "تتطلب محطة الفوسفات وصياغة الإفصاح اعتماداً."
                  : "The phosphate milestone and disclosure language require approval."}
              </p>
            </article>
            <article>
              <strong>{locale === "ar" ? "حالياً" : "Current"}</strong>
              <p>
                {locale === "ar"
                  ? "تتطلب مرحلة مشروع الدهانات وموقعه تأكيداً."
                  : "The paint project stage and location require confirmation."}
              </p>
            </article>
          </div>
        </section>

        <section hidden className={styles.section} id="principles-legacy">
          <p className={styles.eyebrow}>
            {locale === "ar" ? "اعتماد المحتوى" : "Content dependency"}
          </p>
          <h2 tabIndex={-1}>{localize(text.principlesHeading, locale)}</h2>
          <div className={styles.principles}>
            {[
              { en: "Vision", ar: "الرؤية" },
              { en: "Mission", ar: "الرسالة" },
              { en: "Values", ar: "القيم" },
            ].map((item) => (
              <article key={item.en}>
                <h3>{localize(item, locale)}</h3>
                <p>{locale === "ar" ? "نص معتمد مطلوب" : "Approved copy required"}</p>
              </article>
            ))}
          </div>
        </section>

        {companyConfigs.map((company) =>
          company.id === "jollaq" ? (
            <JollaqWorld
              company={company}
              key={company.id}
              locale={locale}
            />
          ) : company.id === "al-maria" ? (
            <AlMariaWorld
              company={company}
              key={company.id}
              locale={locale}
            />
          ) : company.id === "industrial" ? (
            <IndustrialWorld
              company={company}
              key={company.id}
              locale={locale}
            />
          ) : company.id === "shamco" ? (
            <ShamcoWorld
              company={company}
              key={company.id}
              locale={locale}
            />
          ) : (
            <section
              className={`${styles.section} ${styles.companySection}`}
              id={company.id}
              key={company.id}
              data-section
            >
            <div className={styles.companyGrid}>
              <div>
                <p className={styles.eyebrow}>
                  {company.displayName} / {text.holdingName}
                </p>
                <h2 tabIndex={-1}>{localize(company.heading, locale)}</h2>
                <p className={styles.lead}>
                  {localize(company.overview, locale)}
                </p>

                <div
                  className={styles.capabilities}
                  id={`${company.id}-capabilities`}
                >
                  {company.capabilities.map((capability) => (
                    <p key={capability.en}>
                      {localize(capability, locale)}
                    </p>
                  ))}
                </div>

                <aside className={styles.proof} aria-label={localize(company.proof, locale)}>
                  <strong>
                    {locale === "ar" ? "حالة الإثبات" : "Proof status"}
                  </strong>
                  <p>{localize(company.proof, locale)}</p>
                </aside>

                <div
                  className={styles.relationship}
                  id={`${company.id}-network`}
                >
                  <h3>
                    {locale === "ar"
                      ? "العلاقة مع SYNTHEX Holding"
                      : "Connection to SYNTHEX Holding"}
                  </h3>
                  <p>{localize(company.relationship, locale)}</p>
                </div>
              </div>

              <div className={styles.stickyScene}>
                <ScenePlaceholder
                  label={localize(company.sceneLabel, locale)}
                  variant={company.id}
                />
              </div>
            </div>
            </section>
          ),
        )}

        <HoldingNetwork locale={locale} />
        <HoldingContact locale={locale} />

        <section hidden className={styles.section} id="network-legacy">
          <div className={styles.networkGrid}>
            <div>
              <p className={styles.eyebrow}>
                {locale === "ar" ? "المنظومة الموحدة" : "Unified holding"}
              </p>
              <h2 tabIndex={-1}>{localize(text.networkHeading, locale)}</h2>
              <p className={styles.lead}>
                {locale === "ar"
                  ? "تعيد الخاتمة SYNTHEX Holding إلى الواجهة وتوضح العلاقة بين التوريد والتجارة والصناعة والتوزيع."
                  : "The conclusion restores SYNTHEX Holding as the primary identity and clarifies the relationship between supply, trade, industry, and distribution."}
              </p>
            </div>
            <ScenePlaceholder
              label={
                locale === "ar"
                  ? "أساس مشهد توحيد الشركات"
                  : "Unified company-system scene foundation"
              }
              variant="network"
            />
          </div>
        </section>

        <section hidden className={styles.section} id="contact-legacy">
          <div className={styles.contactPanel}>
            <p className={styles.eyebrow}>
              {locale === "ar" ? "هيكل التواصل" : "Contact structure"}
            </p>
            <h2 tabIndex={-1}>{localize(text.contactHeading, locale)}</h2>
            <p>
              {locale === "ar"
                ? "لا يتم جمع أي بيانات في هذه المرحلة. يلزم توفير البريد والهاتف والعنوان وشروط الخصوصية وقواعد توجيه الطلبات."
                : "No data is collected in this phase. Approved email, phone, address, privacy terms, and enquiry-routing rules are still required."}
            </p>
            <span className={styles.status}>
              {locale === "ar" ? "معلومات مطلوبة" : "Content required"}
            </span>
          </div>
        </section>
      </main>

      <HoldingFooter locale={locale} />
      <InteractionLayer locale={locale} />
      <footer hidden className={styles.footer} id="footer-legacy">
        <strong>{text.holdingName}</strong>
        <p>
          {locale === "ar"
            ? "التفاصيل القانونية وبيانات التواصل غير متوفرة بعد."
            : "Legal and contact details are not yet supplied."}
        </p>
        <span>{localize(text.prototypeNotice, locale)}</span>
      </footer>
    </>
  );
}
