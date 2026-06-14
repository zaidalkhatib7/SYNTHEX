(function runPrototype() {
  "use strict";

  var model = window.SynthexState;
  var html = document.documentElement;
  var nav = document.querySelector("[data-navbar]");
  var companyLabel = document.querySelector("[data-company-label]");
  var navLinks = document.querySelector("[data-context-links]");
  var cta = document.querySelector("[data-context-cta]");
  var localeButton = document.querySelector("[data-locale-toggle]");
  var selectorLinks = Array.prototype.slice.call(
    document.querySelectorAll("[data-company-option]")
  );
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-section]"));
  var pendingTarget = null;
  var pendingTimer = null;

  var copy = {
    en: {
      companyNames: {
        holding: "SYNTHEX Holding",
        jollaq: "JOLLAQ",
        "al-maria": "Al Maria",
        industrial: "SYNTHEX Industrial",
        shamco: "SHAMCO LLC"
      },
      locale: "AR",
      holdingReturn: "Holding",
      nav: {
        holding: [
          ["Companies", "companies"],
          ["About", "overview"],
          ["Story", "story"],
          ["Contact", "contact"]
        ],
        jollaq: [
          ["Overview", "jollaq"],
          ["Commodities", "jollaq-capabilities"],
          ["Network", "jollaq-network"]
        ],
        "al-maria": [
          ["Overview", "al-maria"],
          ["Public sector", "al-maria-capabilities"],
          ["Trade", "al-maria-network"]
        ],
        industrial: [
          ["Overview", "industrial"],
          ["Materials", "industrial-capabilities"],
          ["Manufacturing", "industrial-network"]
        ],
        shamco: [
          ["Overview", "shamco"],
          ["Distribution", "shamco-capabilities"],
          ["Coverage", "shamco-network"]
        ]
      },
      cta: {
        holding: "Start a conversation",
        jollaq: "Discuss supply",
        "al-maria": "Institutional enquiry",
        industrial: "Industrial enquiry",
        shamco: "Distribution enquiry"
      }
    },
    ar: {
      companyNames: {
        holding: "SYNTHEX Holding",
        jollaq: "JOLLAQ",
        "al-maria": "Al Maria",
        industrial: "SYNTHEX Industrial",
        shamco: "SHAMCO LLC"
      },
      locale: "EN",
      holdingReturn: "الشركة القابضة",
      nav: {
        holding: [
          ["الشركات", "companies"],
          ["نبذة", "overview"],
          ["المسيرة", "story"],
          ["تواصل", "contact"]
        ],
        jollaq: [
          ["نظرة عامة", "jollaq"],
          ["السلع", "jollaq-capabilities"],
          ["الشبكة", "jollaq-network"]
        ],
        "al-maria": [
          ["نظرة عامة", "al-maria"],
          ["القطاع العام", "al-maria-capabilities"],
          ["التجارة", "al-maria-network"]
        ],
        industrial: [
          ["نظرة عامة", "industrial"],
          ["المواد", "industrial-capabilities"],
          ["التصنيع", "industrial-network"]
        ],
        shamco: [
          ["نظرة عامة", "shamco"],
          ["التوزيع", "shamco-capabilities"],
          ["التغطية", "shamco-network"]
        ]
      },
      cta: {
        holding: "بدء التواصل",
        jollaq: "استفسار التوريد",
        "al-maria": "استفسار مؤسساتي",
        industrial: "استفسار صناعي",
        shamco: "استفسار التوزيع"
      }
    }
  };

  var url = new URL(window.location.href);
  var initialLocale = url.searchParams.get("lang") === "ar" ? "ar" : "en";
  var state = model.createInitialState({
    hash: window.location.hash,
    locale: initialLocale
  });

  if (window.location.hash) {
    pendingTarget = state.activeSection;
  }

  function getTargetElement(id) {
    return document.getElementById(id) || document.getElementById(model.normalizeId(id));
  }

  function setLocalizedVisibility(locale) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-lang]"), function (element) {
      element.hidden = element.getAttribute("data-lang") !== locale;
    });
  }

  function render() {
    var localeCopy = copy[state.locale];
    var company = state.activeCompany;

    html.lang = state.locale;
    html.dir = state.locale === "ar" ? "rtl" : "ltr";
    html.setAttribute("data-company", company);
    html.setAttribute("data-active-section", state.activeSection);
    html.setAttribute("data-navigation-source", state.navigationSource);
    nav.setAttribute("data-company", company);
    companyLabel.textContent = localeCopy.companyNames[company];
    localeButton.textContent = localeCopy.locale;
    localeButton.setAttribute(
      "aria-label",
      state.locale === "en" ? "Switch prototype to Arabic" : "تبديل النموذج إلى الإنجليزية"
    );

    navLinks.replaceChildren();

    if (company !== "holding") {
      var holdingLink = document.createElement("a");
      holdingLink.href = "#companies";
      holdingLink.textContent = localeCopy.holdingReturn;
      holdingLink.setAttribute("data-nav-target", "companies");
      holdingLink.className = "holding-return";
      navLinks.appendChild(holdingLink);
    }

    localeCopy.nav[company].forEach(function (item) {
      var link = document.createElement("a");
      link.href = "#" + item[1];
      link.textContent = item[0];
      link.setAttribute("data-nav-target", item[1]);
      navLinks.appendChild(link);
    });

    cta.textContent = localeCopy.cta[company];
    cta.href = "#contact";
    cta.setAttribute("data-nav-target", "contact");

    selectorLinks.forEach(function (link) {
      var selected = link.getAttribute("data-company-option") === company;
      link.setAttribute("aria-current", selected ? "true" : "false");
      link.tabIndex = selected || company === "holding" && link === selectorLinks[0] ? 0 : -1;
    });

    sections.forEach(function (section) {
      section.classList.toggle(
        "is-active",
        section.getAttribute("data-section") === state.activeSection
      );
    });

    setLocalizedVisibility(state.locale);
  }

  function updateUrl(targetId, mode) {
    var targetHash = "#" + targetId;
    var nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("lang", state.locale);
    nextUrl.hash = targetHash;

    if (mode === "push") {
      window.history.pushState({ target: targetId }, "", nextUrl);
    } else if (mode === "replace") {
      window.history.replaceState({ target: targetId }, "", nextUrl);
    }
  }

  function scrollToTarget(targetId, shouldFocus) {
    var target = getTargetElement(targetId);
    if (!target) {
      return;
    }

    pendingTarget = targetId;
    window.clearTimeout(pendingTimer);
    pendingTimer = window.setTimeout(function () {
      pendingTarget = null;
    }, 1300);

    var navHeight = nav.getBoundingClientRect().height;
    var targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"
    });

    if (shouldFocus) {
      window.setTimeout(function () {
        var heading = target.querySelector("h1, h2");
        if (heading) {
          heading.focus({ preventScroll: true });
        }
      }, 700);
    }
  }

  function dispatch(event, options) {
    var settings = options || {};
    var historyMode = settings.historyMode || model.historyModeForEvent(event);
    state = model.reduce(state, event);
    render();

    if (historyMode !== "none") {
      updateUrl(state.activeSection, historyMode);
    }

    if (settings.scroll) {
      scrollToTarget(state.activeSection, Boolean(settings.focus));
    }
  }

  document.addEventListener("click", function (event) {
    var companyOption = event.target.closest("[data-company-option]");
    var navTarget = event.target.closest("[data-nav-target]");

    if (companyOption) {
      event.preventDefault();
      dispatch(
        {
          type: "SELECT_COMPANY",
          company: companyOption.getAttribute("data-company-option")
        },
        { scroll: true, focus: true }
      );
      return;
    }

    if (navTarget) {
      event.preventDefault();
      dispatch(
        {
          type: "NAVIGATE_TO_SECTION",
          section: navTarget.getAttribute("data-nav-target")
        },
        { scroll: true, focus: true }
      );
    }
  });

  document.querySelector("[data-company-selector]").addEventListener("keydown", function (event) {
    var currentIndex = selectorLinks.indexOf(document.activeElement);
    if (currentIndex < 0) {
      return;
    }

    var nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % selectorLinks.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + selectorLinks.length) % selectorLinks.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = selectorLinks.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    selectorLinks.forEach(function (link, index) {
      link.tabIndex = index === nextIndex ? 0 : -1;
    });
    selectorLinks[nextIndex].focus();
  });

  localeButton.addEventListener("click", function () {
    var nextLocale = state.locale === "en" ? "ar" : "en";
    dispatch({ type: "LOCALE_CHANGED", locale: nextLocale }, { historyMode: "replace" });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && state.activeCompany !== "holding") {
      dispatch({ type: "ESCAPE_TO_HOLDING" }, { scroll: true, focus: false });
      window.setTimeout(function () {
        var activeOption = document.querySelector(
          '[data-company-option="' + state.activeCompany + '"]'
        );
        (activeOption || selectorLinks[0]).focus({ preventScroll: true });
      }, 700);
    }
  });

  window.addEventListener("popstate", function () {
    dispatch(
      { type: "POPSTATE", hash: window.location.hash },
      { historyMode: "none", scroll: true, focus: false }
    );
  });

  window.addEventListener("hashchange", function () {
    if (pendingTarget) {
      return;
    }
    dispatch(
      { type: "HASH_CHANGED", hash: window.location.hash },
      { historyMode: "none", scroll: true, focus: false }
    );
  });

  var observer = new IntersectionObserver(
    function (entries) {
      if (pendingTarget) {
        var reached = entries.some(function (entry) {
          return (
            entry.isIntersecting &&
            entry.target.getAttribute("data-section") === pendingTarget &&
            entry.intersectionRatio >= 0.35
          );
        });

        if (reached) {
          pendingTarget = null;
          window.clearTimeout(pendingTimer);
        }
        return;
      }

      var dominant = entries
        .filter(function (entry) {
          return entry.isIntersecting;
        })
        .sort(function (a, b) {
          return b.intersectionRatio - a.intersectionRatio;
        })[0];

      if (!dominant) {
        return;
      }

      var sectionId = dominant.target.getAttribute("data-section");
      if (sectionId === state.activeSection) {
        return;
      }

      dispatch(
        { type: "SECTION_BECAME_DOMINANT", section: sectionId },
        { historyMode: "replace" }
      );
    },
    {
      rootMargin: "-22% 0px -52% 0px",
      threshold: [0.15, 0.35, 0.55, 0.75]
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });

  render();
})();
