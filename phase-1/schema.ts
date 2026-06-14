export type Locale = "en" | "ar";

export type CompanyId =
  | "holding"
  | "jollaq"
  | "al-maria"
  | "industrial"
  | "shamco";

export type CompanySectionId =
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

export type ContentStatus =
  | "approved"
  | "draft"
  | "verification-required"
  | "missing"
  | "prohibited";

export type MotionTier = 0 | 1 | 2;

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface ContentField<T> {
  value: T;
  status: ContentStatus;
  source?: string;
  note?: string;
}

export interface ThemeTokens {
  background: string;
  surface: string;
  surfaceStrong: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSecondary: string;
  metal: string;
  focus: string;
}

export interface NavigationItem {
  label: LocalizedText;
  targetId: CompanySectionId | string;
}

export interface NavigationModel {
  links: NavigationItem[];
  cta: NavigationItem;
  iconFamily:
    | "molecular"
    | "commodity"
    | "institutional"
    | "industrial"
    | "logistics";
}

export interface SceneQuality {
  tier: MotionTier;
  maxDpr: number;
  maxDrawCalls: number;
  particleCount: number;
  shadows: boolean;
  postprocessing: boolean;
}

export interface SceneModel {
  key:
    | "holding-core"
    | "company-selector"
    | "jollaq-flow"
    | "al-maria-planes"
    | "industrial-transform"
    | "shamco-network";
  fallbackAsset?: string;
  quality: Record<MotionTier, SceneQuality>;
  reducedMotionBehavior: "static" | "crossfade" | "short-transition";
}

export interface CapabilityGroup {
  title: ContentField<LocalizedText>;
  items: Array<ContentField<LocalizedText>>;
}

export interface CompanyContent {
  openingStatement: ContentField<LocalizedText>;
  overview: ContentField<LocalizedText>;
  capabilities: CapabilityGroup[];
  proofModule: ContentField<LocalizedText>;
  holdingRelationship: ContentField<LocalizedText>;
}

export interface CompanyConfig {
  id: CompanyId;
  hash: `#${CompanyId}` | "#holding";
  displayName: LocalizedText;
  legalName: ContentField<LocalizedText>;
  relationshipLabel: LocalizedText;
  theme: ThemeTokens;
  navigation: NavigationModel;
  scene: SceneModel;
  content: CompanyContent;
  contactIntent: "general" | "supply" | "institutional" | "industrial" | "distribution";
}

export interface ExperienceState {
  locale: Locale;
  activeCompany: CompanyId;
  activeSection: CompanySectionId;
  navigationSource:
    | "initial"
    | "explicit"
    | "scroll"
    | "history"
    | "locale";
  motionTier: MotionTier;
  reducedMotion: boolean;
  webglAvailable: boolean;
}

export type ExperienceEvent =
  | { type: "INITIALIZE_FROM_URL"; hash: string; locale: Locale }
  | { type: "SELECT_COMPANY"; company: CompanyId }
  | { type: "NAVIGATE_TO_SECTION"; section: CompanySectionId }
  | { type: "SECTION_BECAME_DOMINANT"; section: CompanySectionId }
  | { type: "HASH_CHANGED"; hash: string }
  | { type: "POPSTATE"; hash: string }
  | { type: "LOCALE_CHANGED"; locale: Locale }
  | { type: "ESCAPE_TO_HOLDING" };

