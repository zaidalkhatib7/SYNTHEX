(function attachStateModel(root, factory) {
  var api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  root.SynthexState = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createStateModel() {
  "use strict";

  var COMPANY_IDS = ["holding", "jollaq", "al-maria", "industrial", "shamco"];
  var SECTION_IDS = [
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
    "footer"
  ];
  var NESTED_TARGET_IDS = [
    "jollaq-capabilities",
    "jollaq-network",
    "al-maria-capabilities",
    "al-maria-network",
    "industrial-capabilities",
    "industrial-network",
    "shamco-capabilities",
    "shamco-network"
  ];
  var NAV_TARGET_IDS = SECTION_IDS.concat(NESTED_TARGET_IDS);

  function normalizeId(value) {
    var normalized = String(value || "")
      .replace(/^#/, "")
      .trim()
      .toLowerCase();

    return NAV_TARGET_IDS.indexOf(normalized) >= 0 ? normalized : "holding";
  }

  function companyForSection(section) {
    var normalized = normalizeId(section);
    var matchedCompany = COMPANY_IDS.find(function (company) {
      return normalized === company || normalized.indexOf(company + "-") === 0;
    });

    return matchedCompany || "holding";
  }

  function normalizeLocale(locale) {
    return locale === "ar" ? "ar" : "en";
  }

  function createInitialState(options) {
    var section = normalizeId(options && options.hash);
    var locale = normalizeLocale(options && options.locale);

    return {
      locale: locale,
      activeSection: section,
      activeCompany: companyForSection(section),
      navigationSource: "initial"
    };
  }

  function reduce(state, event) {
    var next = {
      locale: state.locale,
      activeSection: state.activeSection,
      activeCompany: state.activeCompany,
      navigationSource: state.navigationSource
    };

    switch (event.type) {
      case "INITIALIZE_FROM_URL":
        return createInitialState({ hash: event.hash, locale: event.locale });

      case "SELECT_COMPANY":
        next.activeSection = companyForSection(event.company);
        next.activeCompany = companyForSection(event.company);
        next.navigationSource = "explicit";
        return next;

      case "NAVIGATE_TO_SECTION":
        next.activeSection = normalizeId(event.section);
        next.activeCompany = companyForSection(next.activeSection);
        next.navigationSource = "explicit";
        return next;

      case "SECTION_BECAME_DOMINANT":
        next.activeSection = normalizeId(event.section);
        next.activeCompany = companyForSection(next.activeSection);
        next.navigationSource = "scroll";
        return next;

      case "HASH_CHANGED":
      case "POPSTATE":
        next.activeSection = normalizeId(event.hash);
        next.activeCompany = companyForSection(next.activeSection);
        next.navigationSource = "history";
        return next;

      case "LOCALE_CHANGED":
        next.locale = normalizeLocale(event.locale);
        next.navigationSource = "locale";
        return next;

      case "ESCAPE_TO_HOLDING":
        next.activeSection = "companies";
        next.activeCompany = "holding";
        next.navigationSource = "explicit";
        return next;

      default:
        return next;
    }
  }

  function historyModeForEvent(event) {
    if (
      event.type === "SELECT_COMPANY" ||
      event.type === "NAVIGATE_TO_SECTION" ||
      event.type === "ESCAPE_TO_HOLDING"
    ) {
      return "push";
    }

    if (event.type === "SECTION_BECAME_DOMINANT" || event.type === "LOCALE_CHANGED") {
      return "replace";
    }

    return "none";
  }

  return {
    COMPANY_IDS: COMPANY_IDS,
    SECTION_IDS: SECTION_IDS,
    NAV_TARGET_IDS: NAV_TARGET_IDS,
    normalizeId: normalizeId,
    normalizeLocale: normalizeLocale,
    companyForSection: companyForSection,
    createInitialState: createInitialState,
    reduce: reduce,
    historyModeForEvent: historyModeForEvent
  };
});
