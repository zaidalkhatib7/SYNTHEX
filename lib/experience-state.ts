import type {
  CompanyId,
  ExperienceEvent,
  ExperienceState,
  NavigationTarget,
  SectionId,
} from "@/lib/types";
import type { Locale } from "@/lib/i18n";

export const companyIds: CompanyId[] = [
  "holding",
  "jollaq",
  "al-maria",
  "industrial",
  "shamco",
];

export const sectionIds: SectionId[] = [
  "holding",
  "companies",
  "overview",
  "story",
  "principles",
  "jollaq",
  "al-maria",
  "industrial",
  "shamco",
  "network",
  "contact",
  "footer",
];

export const nestedTargetIds: NavigationTarget[] = [
  "jollaq-capabilities",
  "jollaq-network",
  "al-maria-capabilities",
  "al-maria-network",
  "industrial-capabilities",
  "industrial-network",
  "shamco-capabilities",
  "shamco-network",
];

export const navigationTargets = [
  ...sectionIds,
  ...nestedTargetIds,
] as NavigationTarget[];

export function normalizeTarget(value: string): NavigationTarget {
  const normalized = value.replace(/^#/, "").trim().toLowerCase();
  return navigationTargets.includes(normalized as NavigationTarget)
    ? (normalized as NavigationTarget)
    : "holding";
}

export function companyForTarget(target: NavigationTarget): CompanyId {
  const company = companyIds.find(
    (candidate) =>
      candidate !== "holding" &&
      (target === candidate || target.startsWith(`${candidate}-`)),
  );

  return company ?? "holding";
}

export function createInitialState(
  locale: Locale,
  hash = "",
): ExperienceState {
  const activeSection = normalizeTarget(hash);

  return {
    locale,
    activeSection,
    activeCompany: companyForTarget(activeSection),
    source: "initial",
  };
}

export function experienceReducer(
  state: ExperienceState,
  event: ExperienceEvent,
): ExperienceState {
  switch (event.type) {
    case "INITIALIZE": {
      return createInitialState(event.locale, event.hash);
    }
    case "NAVIGATE": {
      return {
        ...state,
        activeSection: event.target,
        activeCompany: companyForTarget(event.target),
        source: "explicit",
      };
    }
    case "OBSERVE": {
      return {
        ...state,
        activeSection: event.target,
        activeCompany: companyForTarget(event.target),
        source: "scroll",
      };
    }
    case "RESTORE": {
      const activeSection = normalizeTarget(event.hash);
      return {
        ...state,
        activeSection,
        activeCompany: companyForTarget(activeSection),
        source: "history",
      };
    }
  }
}
