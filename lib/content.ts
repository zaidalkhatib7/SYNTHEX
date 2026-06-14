import type {
  CompanyConfig,
  CompanyId,
  LocalizedText,
  NavigationItem,
  SectionId,
} from "@/lib/types";

export const text = {
  holdingName: "SYNTHEX Holding",
  prototypeNotice: {
    en: "Phase 2 foundation / provisional content",
    ar: "المرحلة الثانية / محتوى مؤقت",
  },
  holdingEyebrow: {
    en: "A connected holding structure",
    ar: "هيكل قابض مترابط",
  },
  holdingHeading: {
    en: "One holding system. Four operating worlds.",
    ar: "منظومة قابضة واحدة. أربعة مجالات تشغيل.",
  },
  holdingOverview: {
    en: "SYNTHEX Holding brings together strategic supply, institutional trade, industrial materials and manufacturing, and domestic distribution. Final executive positioning remains subject to the approved corporate profile.",
    ar: "تجمع SYNTHEX Holding بين التوريد الاستراتيجي والتجارة المؤسساتية والمواد والتصنيع الصناعي والتوزيع المحلي. تبقى الصياغة التنفيذية النهائية مرتبطة بالملف التعريفي المعتمد.",
  },
  companiesHeading: {
    en: "Four companies, one connected system",
    ar: "أربع شركات ضمن منظومة مترابطة واحدة",
  },
  companiesOverview: {
    en: "Select a company to move directly to its operating context. The company theme, navigation, URL, and section state remain synchronized.",
    ar: "اختر شركة للانتقال مباشرة إلى مجال عملها. تتم مزامنة هوية الشركة والتنقل والرابط والقسم النشط.",
  },
  overviewHeading: {
    en: "A coordinated operating model",
    ar: "نموذج تشغيلي منسّق",
  },
  storyHeading: {
    en: "Experience, milestones, and expansion",
    ar: "خبرة ومحطات وتوسع",
  },
  principlesHeading: {
    en: "Corporate principles require approved source text",
    ar: "تتطلب المبادئ المؤسسية نصوصاً معتمدة",
  },
  networkHeading: {
    en: "Four capabilities reconnect under SYNTHEX Holding",
    ar: "تتكامل أربع قدرات تحت مظلة SYNTHEX Holding",
  },
  contactHeading: {
    en: "Route each conversation to the right operating company",
    ar: "توجيه كل محادثة إلى الشركة التشغيلية المناسبة",
  },
} satisfies Record<string, string | LocalizedText>;

export const holdingNavigation: NavigationItem[] = [
  { label: { en: "Companies", ar: "الشركات" }, target: "companies" },
  { label: { en: "About", ar: "نبذة" }, target: "overview" },
  { label: { en: "Story", ar: "المسيرة" }, target: "story" },
  { label: { en: "Contact", ar: "تواصل" }, target: "contact" },
];

export const companyConfigs: CompanyConfig[] = [
  {
    id: "jollaq",
    displayName: "JOLLAQ",
    eyebrow: {
      en: "Strategic commodities and essential supply",
      ar: "السلع الاستراتيجية والتوريد الأساسي",
    },
    heading: {
      en: "Commodity supply supported by movement and trade capability",
      ar: "توريد السلع مدعوماً بقدرات الحركة والتجارة",
    },
    overview: {
      en: "The supplied brief positions JOLLAQ across food commodities, petroleum derivatives, and aluminum profiles. Contract-specific language remains marked for verification.",
      ar: "يضع الملف المتاح JOLLAQ ضمن السلع الغذائية والمشتقات النفطية ومقاطع الألمنيوم. تبقى الصياغات المتعلقة بالعقود بحاجة إلى التحقق.",
    },
    capabilities: [
      { en: "Wheat, corn, and barley", ar: "القمح والذرة والشعير" },
      {
        en: "Green coffee, sugar, tuna, and sardines",
        ar: "القهوة الخضراء والسكر والتونة والسردين",
      },
      {
        en: "Petroleum derivatives / verification required",
        ar: "المشتقات النفطية / تتطلب التحقق",
      },
      { en: "Aluminum profiles", ar: "مقاطع الألمنيوم" },
    ],
    proof: {
      en: "Verified supply or contract story required before publication.",
      ar: "يلزم تقديم قصة توريد أو عقد موثقة قبل النشر.",
    },
    relationship: {
      en: "JOLLAQ connects strategic products and supply activity to the holding's wider commercial and distribution system.",
      ar: "تربط JOLLAQ المنتجات الاستراتيجية وأنشطة التوريد بالمنظومة التجارية والتوزيعية الأوسع للشركة القابضة.",
    },
    nav: [
      { label: { en: "Overview", ar: "نظرة عامة" }, target: "jollaq" },
      {
        label: { en: "Commodities", ar: "السلع" },
        target: "jollaq-capabilities",
      },
      {
        label: { en: "Network", ar: "الشبكة" },
        target: "jollaq-network",
      },
    ],
    cta: { en: "Discuss supply", ar: "استفسار التوريد" },
    sceneLabel: {
      en: "Static scene foundation / commodity flow",
      ar: "أساس المشهد الثابت / تدفق السلع",
    },
  },
  {
    id: "al-maria",
    displayName: "Al Maria",
    eyebrow: {
      en: "Institutional supply and international trade",
      ar: "التوريد المؤسساتي والتجارة الدولية",
    },
    heading: {
      en: "A formal operating context for procurement and agreements",
      ar: "سياق تشغيلي رسمي للمشتريات والاتفاقيات",
    },
    overview: {
      en: "Al Maria is described across government and institutional supply, international procurement, edible oils, and phosphate exports. Public-sector claims remain subject to approval.",
      ar: "توصف Al Maria ضمن التوريد الحكومي والمؤسساتي والمشتريات الدولية والزيوت الغذائية وصادرات الفوسفات. تبقى ادعاءات القطاع العام خاضعة للاعتماد.",
    },
    capabilities: [
      {
        en: "Government and institutional supply / verification required",
        ar: "التوريد الحكومي والمؤسساتي / يتطلب التحقق",
      },
      {
        en: "International procurement and trade",
        ar: "المشتريات والتجارة الدولية",
      },
      { en: "Edible oils", ar: "الزيوت الغذائية" },
      {
        en: "Phosphate exports / verification required",
        ar: "صادرات الفوسفات / تتطلب التحقق",
      },
    ],
    proof: {
      en: "An approved institutional or international-trade story is still required.",
      ar: "لا تزال هناك حاجة إلى قصة مؤسساتية أو تجارية دولية معتمدة.",
    },
    relationship: {
      en: "Al Maria extends the holding's supply capability into formal procurement and institutional relationships.",
      ar: "توسّع Al Maria قدرات التوريد لدى الشركة القابضة نحو المشتريات الرسمية والعلاقات المؤسساتية.",
    },
    nav: [
      { label: { en: "Overview", ar: "نظرة عامة" }, target: "al-maria" },
      {
        label: { en: "Public sector", ar: "القطاع العام" },
        target: "al-maria-capabilities",
      },
      {
        label: { en: "Trade", ar: "التجارة" },
        target: "al-maria-network",
      },
    ],
    cta: { en: "Institutional enquiry", ar: "استفسار مؤسساتي" },
    sceneLabel: {
      en: "Static scene foundation / formal planes and routes",
      ar: "أساس المشهد الثابت / مستويات ومسارات رسمية",
    },
  },
  {
    id: "industrial",
    displayName: "SYNTHEX Industrial",
    eyebrow: {
      en: "Industrial materials and manufacturing",
      ar: "المواد الصناعية والتصنيع",
    },
    heading: {
      en: "Materials capability moving toward production",
      ar: "قدرات في المواد تتجه نحو الإنتاج",
    },
    overview: {
      en: "The industrial arm spans chemicals, paint raw materials, aluminum, cement, and steel categories. The paint manufacturing project's stage and location require confirmation.",
      ar: "يشمل الذراع الصناعي المواد الكيميائية والمواد الأولية للدهانات والألمنيوم والإسمنت ومنتجات الصلب. تتطلب مرحلة مشروع تصنيع الدهانات وموقعه تأكيداً.",
    },
    capabilities: [
      {
        en: "Industrial chemicals and paint raw materials",
        ar: "المواد الكيميائية الصناعية والمواد الأولية للدهانات",
      },
      { en: "Aluminum profiles", ar: "مقاطع الألمنيوم" },
      {
        en: "Cement, rebar, billets, and steel",
        ar: "الإسمنت وحديد التسليح والبيليت والصلب",
      },
      {
        en: "Paint manufacturing expansion / verification required",
        ar: "التوسع في تصنيع الدهانات / يتطلب التحقق",
      },
    ],
    proof: {
      en: "Approved project or facility material is required for the proof module.",
      ar: "يلزم توفير مواد معتمدة عن المشروع أو المنشأة لوحدة الإثبات.",
    },
    relationship: {
      en: "SYNTHEX Industrial moves the holding from material supply toward selected manufacturing capability.",
      ar: "ينقل SYNTHEX Industrial الشركة القابضة من توريد المواد نحو قدرات تصنيع مختارة.",
    },
    nav: [
      { label: { en: "Overview", ar: "نظرة عامة" }, target: "industrial" },
      {
        label: { en: "Materials", ar: "المواد" },
        target: "industrial-capabilities",
      },
      {
        label: { en: "Manufacturing", ar: "التصنيع" },
        target: "industrial-network",
      },
    ],
    cta: { en: "Industrial enquiry", ar: "استفسار صناعي" },
    sceneLabel: {
      en: "Static scene foundation / metal and paint transition",
      ar: "أساس المشهد الثابت / انتقال المعدن والدهان",
    },
  },
  {
    id: "shamco",
    displayName: "SHAMCO LLC",
    eyebrow: {
      en: "Domestic logistics and distribution",
      ar: "الخدمات اللوجستية والتوزيع المحلي",
    },
    heading: {
      en: "Connecting the holding's products to the market",
      ar: "ربط منتجات الشركة القابضة بالسوق",
    },
    overview: {
      en: "SHAMCO is described as the holding's domestic logistics and distribution arm. Nationwide coverage and network scale require supporting evidence.",
      ar: "توصف SHAMCO بأنها ذراع الخدمات اللوجستية والتوزيع المحلي للشركة القابضة. تتطلب التغطية على مستوى البلاد وحجم الشبكة أدلة داعمة.",
    },
    capabilities: [
      { en: "Domestic logistics", ar: "الخدمات اللوجستية المحلية" },
      {
        en: "Agent and distributor network / verification required",
        ar: "شبكة الوكلاء والموزعين / تتطلب التحقق",
      },
      {
        en: "Food, commercial, and industrial distribution",
        ar: "توزيع المنتجات الغذائية والتجارية والصناعية",
      },
    ],
    proof: {
      en: "Approved warehouse, route, or distribution evidence is still required.",
      ar: "لا تزال هناك حاجة إلى أدلة معتمدة عن المستودعات أو المسارات أو التوزيع.",
    },
    relationship: {
      en: "SHAMCO completes the operating chain by moving holding products through domestic distribution channels.",
      ar: "تكمل SHAMCO السلسلة التشغيلية عبر نقل منتجات الشركة القابضة ضمن قنوات التوزيع المحلية.",
    },
    nav: [
      { label: { en: "Overview", ar: "نظرة عامة" }, target: "shamco" },
      {
        label: { en: "Distribution", ar: "التوزيع" },
        target: "shamco-capabilities",
      },
      {
        label: { en: "Coverage", ar: "التغطية" },
        target: "shamco-network",
      },
    ],
    cta: { en: "Distribution enquiry", ar: "استفسار التوزيع" },
    sceneLabel: {
      en: "Static scene foundation / routes and network nodes",
      ar: "أساس المشهد الثابت / المسارات وعقد الشبكة",
    },
  },
];

export const companyById = Object.fromEntries(
  companyConfigs.map((company) => [company.id, company]),
) as Record<Exclude<CompanyId, "holding">, CompanyConfig>;

export const holdingOwnedSections: SectionId[] = [
  "holding",
  "companies",
  "overview",
  "story",
  "principles",
  "network",
  "contact",
  "footer",
];
