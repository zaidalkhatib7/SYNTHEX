import type { Locale } from "@/lib/i18n";

export type CompanyId =
  | "holding"
  | "jollaq"
  | "al-maria"
  | "industrial"
  | "shamco";

export type SectionId =
  | "holding"
  | "companies"
  | "overview"
  | "story"
  | "principles"
  | "jollaq"
  | "al-maria"
  | "industrial"
  | "shamco"
  | "network"
  | "contact"
  | "footer";

export type NestedSectionId =
  | "jollaq-capabilities"
  | "jollaq-network"
  | "al-maria-capabilities"
  | "al-maria-network"
  | "industrial-capabilities"
  | "industrial-network"
  | "shamco-capabilities"
  | "shamco-network";

export type NavigationTarget = SectionId | NestedSectionId;

export type ContentStatus =
  | "draft"
  | "verification-required"
  | "missing";

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface NavigationItem {
  label: LocalizedText;
  target: NavigationTarget;
}

export interface CompanyConfig {
  id: Exclude<CompanyId, "holding">;
  displayName: string;
  eyebrow: LocalizedText;
  heading: LocalizedText;
  overview: LocalizedText;
  capabilities: LocalizedText[];
  proof: LocalizedText;
  relationship: LocalizedText;
  nav: NavigationItem[];
  cta: LocalizedText;
  sceneLabel: LocalizedText;
}

export interface ExperienceState {
  locale: Locale;
  activeCompany: CompanyId;
  activeSection: NavigationTarget;
  source: "initial" | "explicit" | "scroll" | "history";
}

export type ExperienceEvent =
  | { type: "INITIALIZE"; hash: string; locale: Locale }
  | { type: "NAVIGATE"; target: NavigationTarget }
  | { type: "OBSERVE"; target: SectionId }
  | { type: "RESTORE"; hash: string };
