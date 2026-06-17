import assert from "node:assert/strict";
import { createServer } from "node:http";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "out",
);
const artifactDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "artifacts",
  "browser",
);

const contentTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function edgeExecutable() {
  const candidates = [
    process.env.EDGE_PATH,
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/microsoft-edge",
    "/usr/bin/microsoft-edge-stable",
  ].filter(Boolean);

  return candidates;
}

async function findExecutable() {
  for (const candidate of edgeExecutable()) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue through platform-specific candidates.
    }
  }

  throw new Error(
    "Microsoft Edge was not found. Set EDGE_PATH to run browser verification.",
  );
}

async function resolveFile(requestPath) {
  const decodedPath = decodeURIComponent(requestPath.split("?")[0]);
  const relativePath = decodedPath.replace(/^\/+/, "");
  let candidate = path.resolve(root, relativePath);

  if (!candidate.startsWith(root)) {
    return null;
  }

  try {
    const fileStat = await stat(candidate);
    if (fileStat.isDirectory()) {
      candidate = path.join(candidate, "index.html");
    }
  } catch {
    if (!path.extname(candidate)) {
      candidate = path.join(candidate, "index.html");
    }
  }

  try {
    await access(candidate);
    return candidate;
  } catch {
    const baseName = path.basename(candidate);
    const dottedRscMatch = baseName.match(/^(__next\.[^.]+)\.(.+)\.txt$/);

    if (!dottedRscMatch) {
      return null;
    }

    const nestedCandidate = path.join(
      path.dirname(candidate),
      dottedRscMatch[1],
      ...dottedRscMatch[2].split("."),
    ) + ".txt";

    try {
      await access(nestedCandidate);
      return nestedCandidate;
    } catch {
      return null;
    }
  }
}

const server = createServer(async (request, response) => {
  const requestPath = request.url ?? "/";
  const filePath = await resolveFile(requestPath);

  if (!filePath) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const body = await readFile(filePath);
  const contentType =
    contentTypes[path.extname(filePath)] ?? "application/octet-stream";
  response.writeHead(200, { "content-type": contentType });
  response.end(body);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();

if (!address || typeof address === "string") {
  throw new Error("Static verification server did not start.");
}

const baseUrl = `http://127.0.0.1:${address.port}`;
const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
assert.equal(robotsResponse.status, 200);
assert.match(await robotsResponse.text(), /Allow: \//);
const executablePath = await findExecutable();
const browser = await chromium.launch({ executablePath, headless: true });

try {
  await import("node:fs/promises").then(({ mkdir }) =>
    mkdir(artifactDirectory, { recursive: true }),
  );

  function trackPage(page) {
    const errors = [];
    const failedResponses = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text());
      }
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400) {
        failedResponses.push(`${response.status()} ${response.url()}`);
      }
    });
    return { errors, failedResponses };
  }

  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const desktopTracking = trackPage(desktop);

  await desktop.goto(`${baseUrl}/en/`, { waitUntil: "networkidle" });
  await desktop.waitForFunction(
    () => document.documentElement.dataset.synthexInteractions === "ready",
  );
  const heroState = await desktop.evaluate(() => {
    const figure = document.querySelector("[data-rendered-scene]");
    const image = figure?.querySelector("img");
    return {
      canvasCount: document.querySelectorAll("canvas").length,
      currentSrc: image?.currentSrc,
      loaded: figure?.getAttribute("data-scene-loaded"),
      motion: document.documentElement.dataset.motion,
      naturalWidth: image?.naturalWidth,
      navbarCompany: document.querySelector("header")?.getAttribute("data-company"),
      sourceCount: figure?.querySelectorAll("source").length,
      sceneRole: figure?.getAttribute("role"),
      sceneTabIndex: figure?.getAttribute("tabindex"),
    };
  });
  assert.equal(heroState.canvasCount, 0);
  assert.match(heroState.currentSrc ?? "", /synthex-holding-/);
  assert.equal(heroState.loaded, "true");
  assert.equal(heroState.motion, "full");
  assert.equal(heroState.navbarCompany, "holding");
  assert.ok((heroState.naturalWidth ?? 0) >= 640);
  assert.equal(heroState.sourceCount, 2);
  assert.equal(heroState.sceneRole, "button");
  assert.equal(heroState.sceneTabIndex, "0");
  const interactionLayerState = await desktop.evaluate(() => ({
    cursorCount: document.querySelectorAll("[data-interaction-cursor]").length,
    railCount: document.querySelectorAll(
      '[data-interaction-layer] nav a[href^="#"]',
    ).length,
    ready: document.documentElement.dataset.synthexInteractions,
  }));
  assert.equal(interactionLayerState.ready, "ready");
  assert.equal(interactionLayerState.cursorCount, 1);
  assert.equal(interactionLayerState.railCount, 10);
  const metadataState = await desktop.evaluate(() => {
    const schema = document.querySelector('script[type="application/ld+json"]');
    return {
      alternateCount: document.querySelectorAll('link[rel="alternate"][hreflang]')
        .length,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute(
        "href",
      ),
      description: document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content"),
      ogTitle: document
        .querySelector('meta[property="og:title"]')
        ?.getAttribute("content"),
      organization: schema ? JSON.parse(schema.textContent).name : null,
      subOrganizationCount: schema
        ? JSON.parse(schema.textContent).subOrganization.length
        : 0,
    };
  });
  assert.match(metadataState.canonical ?? "", /\/en\/$/);
  assert.equal(metadataState.alternateCount, 2);
  assert.match(metadataState.description ?? "", /four operating companies/i);
  assert.equal(metadataState.ogTitle, "SYNTHEX Holding");
  assert.equal(metadataState.organization, "SYNTHEX Holding");
  assert.equal(metadataState.subOrganizationCount, 4);
  const accessibilityState = await desktop.evaluate(() => {
    const unnamedInteractive = Array.from(
      document.querySelectorAll("a, button"),
    ).filter(
      (element) =>
        !element.textContent?.trim() &&
        !element.getAttribute("aria-label") &&
        !element.getAttribute("aria-labelledby"),
    );
    return {
      footerCount: document.querySelectorAll("footer:not([hidden])").length,
      h1Count: document.querySelectorAll("h1").length,
      imageWithoutAlt: document.querySelectorAll("img:not([alt])").length,
      mainCount: document.querySelectorAll("main").length,
      navigationCount: document.querySelectorAll("nav").length,
      unnamedInteractive: unnamedInteractive.length,
    };
  });
  assert.equal(accessibilityState.mainCount, 1);
  assert.equal(accessibilityState.h1Count, 1);
  assert.equal(accessibilityState.footerCount, 1);
  assert.ok(accessibilityState.navigationCount >= 3);
  assert.equal(accessibilityState.imageWithoutAlt, 0);
  assert.equal(accessibilityState.unnamedInteractive, 0);
  const resourceState = await desktop.evaluate(() => {
    const totals = { css: 0, image: 0, js: 0, other: 0 };
    for (const entry of performance.getEntriesByType("resource")) {
      const resource = entry;
      const bytes = resource.transferSize || resource.encodedBodySize || 0;
      if (resource.initiatorType === "script") {
        totals.js += bytes;
      } else if (
        resource.initiatorType === "img" ||
        /\.(?:avif|webp|png|jpe?g)(?:\?|$)/.test(resource.name)
      ) {
        totals.image += bytes;
      } else if (
        resource.initiatorType === "css" ||
        /\.css(?:\?|$)/.test(resource.name)
      ) {
        totals.css += bytes;
      } else {
        totals.other += bytes;
      }
    }
    return totals;
  });
  assert.ok(resourceState.js > 0);
  assert.ok(resourceState.css > 0);
  assert.ok(resourceState.image > 0);

  await desktop.keyboard.press("Tab");
  assert.match(
    (await desktop.evaluate(() => document.activeElement?.textContent)) ?? "",
    /Skip to content/,
  );
  const heroScene = desktop.locator("[data-interactive-scene]").first();
  const heroBounds = await heroScene.boundingBox();
  assert.ok(heroBounds);
  await desktop.mouse.move(
    heroBounds.x + heroBounds.width * 0.8,
    heroBounds.y + heroBounds.height * 0.25,
  );
  const heroInteraction = await heroScene.evaluate((scene) => ({
    rotateX: scene.style.getPropertyValue("--scene-rotate-x"),
    rotateY: scene.style.getPropertyValue("--scene-rotate-y"),
    captionCount: scene.querySelectorAll("figcaption").length,
    overlayControlCount: scene.querySelectorAll("button").length,
  }));
  assert.notEqual(heroInteraction.rotateX, "0deg");
  assert.notEqual(heroInteraction.rotateY, "0deg");
  assert.equal(heroInteraction.captionCount, 0);
  assert.equal(heroInteraction.overlayControlCount, 0);
  const heroCursorState = await desktop.evaluate(() => ({
    cursorState: document.documentElement.dataset.cursorState,
    label: document.querySelector('[class*="interactionCursorLabel"]')
      ?.textContent,
  }));
  assert.equal(heroCursorState.cursorState, "scene");
  assert.match(heroCursorState.label ?? "", /Focus scene/);
  await heroScene.click({
    position: {
      x: heroBounds.width * 0.5,
      y: heroBounds.height * 0.5,
    },
  });
  await desktop.waitForFunction(
    () => document.documentElement.dataset.synthexSceneExpanded === "true",
  );
  await desktop.waitForFunction(() => {
    const panel = document.querySelector("[data-focused-scene-panel]");
    const bounds = panel?.getBoundingClientRect();
    return (
      bounds &&
      bounds.height > window.innerHeight * 0.75 &&
      getComputedStyle(panel).opacity === "1"
    );
  });
  const focusedSceneState = await desktop.evaluate(() => ({
    backOpacity: getComputedStyle(
      document.querySelector('[class*="sceneBackButton"]'),
    ).opacity,
    dialogRole: document
      .querySelector("[data-focused-scene-panel]")
      ?.getAttribute("role"),
    expanded: document
      .querySelector("[data-rendered-scene]")
      ?.getAttribute("data-scene-expanded"),
    focusedImageSrc: document
      .querySelector("[data-focused-scene-panel] img")
      ?.getAttribute("src"),
    height: document
      .querySelector("[data-focused-scene-panel]")
      ?.getBoundingClientRect().height,
    originalRole: document
      .querySelector("[data-rendered-scene]")
      ?.getAttribute("role"),
    rootExpanded: document.documentElement.dataset.synthexSceneExpanded,
  }));
  assert.equal(focusedSceneState.expanded, "true");
  assert.ok((focusedSceneState.height ?? 0) > 750);
  assert.equal(focusedSceneState.backOpacity, "1");
  assert.equal(focusedSceneState.dialogRole, "dialog");
  assert.match(focusedSceneState.focusedImageSrc ?? "", /synthex-holding-/);
  assert.equal(focusedSceneState.originalRole, "button");
  assert.equal(focusedSceneState.rootExpanded, "true");
  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-focused-scene.png"),
    fullPage: false,
  });
  await desktop.keyboard.press("Escape");
  await desktop.waitForFunction(
    () => document.documentElement.dataset.synthexSceneExpanded !== "true",
  );
  await desktop.waitForFunction(
    () => {
      const button = document.querySelector('[class*="sceneBackButton"]');
      return button && getComputedStyle(button).opacity === "0";
    },
  );
  assert.equal(
    await desktop
      .locator("[data-rendered-scene]")
      .first()
      .evaluate((scene) => scene.getAttribute("role")),
    "button",
  );
  await desktop.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-hero.png"),
    fullPage: false,
  });

  await desktop.goto(`${baseUrl}/en/#companies`, {
    waitUntil: "networkidle",
  });
  await desktop.locator("#companies").scrollIntoViewIfNeeded();
  const companyCard = desktop.locator('#companies a[href="#jollaq"]').first();
  const companyCardBounds = await companyCard.boundingBox();
  assert.ok(companyCardBounds);
  await desktop.mouse.move(
    companyCardBounds.x + companyCardBounds.width * 0.7,
    companyCardBounds.y + companyCardBounds.height * 0.35,
  );
  const selectorInteractionState = await companyCard.evaluate((card) => ({
    active: card.getAttribute("data-depth-active"),
    label: card.getAttribute("data-cursor-label"),
    transform: card.style.transform,
  }));
  assert.equal(selectorInteractionState.active, "true");
  assert.match(selectorInteractionState.label ?? "", /JOLLAQ/);
  assert.match(selectorInteractionState.transform, /perspective/);
  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-company-selector.png"),
    fullPage: false,
  });

  await desktop.goto(`${baseUrl}/en/#overview`, {
    waitUntil: "networkidle",
  });
  await desktop
    .locator("#overview [data-interactive-scene]")
    .scrollIntoViewIfNeeded();
  const holdingOverviewState = await desktop.evaluate(() => ({
    company: document.documentElement.dataset.company,
    currentSrc: document.querySelector(
      "#overview [data-interactive-scene] img",
    )?.currentSrc,
    sectorCount: document.querySelectorAll(
      '#overview [class*="sectorList"] article',
    ).length,
  }));
  assert.equal(holdingOverviewState.company, "holding");
  assert.match(holdingOverviewState.currentSrc ?? "", /holding-global-/);
  assert.equal(holdingOverviewState.sectorCount, 5);
  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-holding-overview.png"),
    fullPage: false,
  });

  await desktop.goto(`${baseUrl}/en/#story`, { waitUntil: "networkidle" });
  const storyState = await desktop.evaluate(() => ({
    approvalCount: document.querySelectorAll(
      '#story [class*="timelineDetailed"] article span',
    ).length,
    currentSrc: document.querySelector("#story [data-interactive-scene] img")
      ?.currentSrc,
    leadership: document
      .querySelector('#story [class*="leadershipNotice"]')
      ?.textContent?.trim(),
    timelineCount: document.querySelectorAll(
      '#story [class*="timelineDetailed"] article',
    ).length,
  }));
  assert.equal(storyState.timelineCount, 3);
  assert.equal(storyState.approvalCount, 3);
  assert.match(storyState.currentSrc ?? "", /holding-structure-/);
  assert.match(storyState.leadership ?? "", /Hisham Abdeen/);
  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-holding-story.png"),
    fullPage: false,
  });

  await desktop.goto(`${baseUrl}/en/#principles`, {
    waitUntil: "networkidle",
  });
  assert.equal(
    await desktop.locator("#principles article").count(),
    3,
  );
  assert.equal(
    await desktop
      .locator("#principles article")
      .filter({ hasText: "Approved copy required" })
      .count(),
    3,
  );

  await desktop.goto(`${baseUrl}/en/#jollaq`, { waitUntil: "networkidle" });
  await desktop.locator("#jollaq [data-rendered-scene]").scrollIntoViewIfNeeded();
  const jollaqState = await desktop.evaluate(() => {
    const image = document.querySelector("#jollaq [data-rendered-scene] img");
    return {
      company: document.documentElement.dataset.company,
      currentSrc: image?.currentSrc,
      hash: window.location.hash,
      loading: image?.getAttribute("loading"),
      canvasCount: document.querySelectorAll("canvas").length,
      placeholders: ["#shamco"].filter((selector) =>
        document.querySelector(`${selector} [role="img"]`),
      ).length,
    };
  });
  assert.equal(jollaqState.company, "jollaq");
  assert.equal(jollaqState.hash, "#jollaq");
  assert.match(jollaqState.currentSrc ?? "", /jollaq-commodities-/);
  assert.equal(jollaqState.loading, "lazy");
  assert.equal(jollaqState.canvasCount, 0);
  assert.equal(jollaqState.placeholders, 0);
  const jollaqScene = desktop.locator("#jollaq [data-interactive-scene]");
  assert.equal(await jollaqScene.locator("button").count(), 0);
  assert.equal(await jollaqScene.locator("figcaption").count(), 0);
  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-jollaq-scene.png"),
    fullPage: false,
  });

  await desktop.goto(`${baseUrl}/en/#al-maria`, { waitUntil: "networkidle" });
  await desktop
    .locator("#al-maria [data-rendered-scene]")
    .scrollIntoViewIfNeeded();
  const alMariaState = await desktop.evaluate(() => {
    const image = document.querySelector("#al-maria [data-rendered-scene] img");
    return {
      company: document.documentElement.dataset.company,
      currentSrc: image?.currentSrc,
      hash: window.location.hash,
      loading: image?.getAttribute("loading"),
    };
  });
  assert.equal(alMariaState.company, "al-maria");
  assert.equal(alMariaState.hash, "#al-maria");
  assert.match(alMariaState.currentSrc ?? "", /al-maria-trade-/);
  assert.equal(alMariaState.loading, "lazy");
  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-al-maria-scene.png"),
    fullPage: false,
  });

  await desktop.goto(`${baseUrl}/en/#industrial`, {
    waitUntil: "networkidle",
  });
  await desktop
    .locator("#industrial [data-interactive-scene]")
    .scrollIntoViewIfNeeded();
  const industrialScene = desktop.locator(
    "#industrial [data-interactive-scene]",
  );
  const industrialInitial = await desktop.evaluate(() => {
    const section = document.querySelector("#industrial");
    const image = section?.querySelector("[data-interactive-scene] img");
    return {
      company: document.documentElement.dataset.company,
      currentSrc: image?.currentSrc,
      hash: window.location.hash,
      selectorCount: section?.querySelectorAll(
        '[role="group"] button',
      ).length,
      overlayControlCount: section?.querySelectorAll(
        "[data-interactive-scene] button",
      ).length,
    };
  });
  assert.equal(industrialInitial.company, "industrial");
  assert.equal(industrialInitial.hash, "#industrial");
  assert.match(industrialInitial.currentSrc ?? "", /industrial-identity-/);
  assert.equal(industrialInitial.selectorCount, 3);
  assert.equal(industrialInitial.overlayControlCount, 0);

  await desktop
    .locator('#industrial [role="group"] button')
    .nth(1)
    .click();
  await desktop.waitForTimeout(300);
  assert.match(
    (await industrialScene.locator("img").getAttribute("src")) ?? "",
    /industrial-metals-/,
  );
  assert.equal(await industrialScene.locator("button").count(), 0);
  assert.match(
    await industrialScene.evaluate(
      (scene) => getComputedStyle(scene).animationName,
    ),
    /sceneArrival/,
  );

  await desktop
    .locator('#industrial [role="group"] button')
    .nth(2)
    .click();
  await desktop.waitForTimeout(300);
  assert.match(
    (await industrialScene.locator("img").getAttribute("src")) ?? "",
    /industrial-paint-/,
  );
  assert.equal(await industrialScene.locator("button").count(), 0);
  assert.equal(await industrialScene.locator("figcaption").count(), 0);
  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-industrial-scene.png"),
    fullPage: false,
  });

  await desktop.goto(`${baseUrl}/en/#shamco`, {
    waitUntil: "networkidle",
  });
  await desktop
    .locator("#shamco [data-interactive-scene]")
    .scrollIntoViewIfNeeded();
  const shamcoScene = desktop.locator("#shamco [data-interactive-scene]");
  const shamcoInitial = await desktop.evaluate(() => {
    const section = document.querySelector("#shamco");
    const image = section?.querySelector("[data-interactive-scene] img");
    return {
      company: document.documentElement.dataset.company,
      currentSrc: image?.currentSrc,
      disclosure: section
        ?.querySelector('[class*="shamcoMapNotice"]')
        ?.textContent?.trim(),
      hash: window.location.hash,
      overlayControlCount: section?.querySelectorAll(
        "[data-interactive-scene] button",
      ).length,
      selectorCount: section?.querySelectorAll('[role="group"] button')
        .length,
    };
  });
  assert.equal(shamcoInitial.company, "shamco");
  assert.equal(shamcoInitial.hash, "#shamco");
  assert.match(shamcoInitial.currentSrc ?? "", /shamco-identity-/);
  assert.match(shamcoInitial.disclosure ?? "", /illustrative only/);
  assert.equal(shamcoInitial.selectorCount, 3);
  assert.equal(shamcoInitial.overlayControlCount, 0);

  await desktop.locator('#shamco [role="group"] button').nth(1).click();
  await desktop.waitForFunction(
    () =>
      document
        .querySelector("#shamco [data-interactive-scene] img")
        ?.currentSrc.includes("shamco-network-") === true,
  );
  assert.equal(await shamcoScene.locator("button").count(), 0);

  await desktop.locator('#shamco [role="group"] button').nth(2).click();
  await desktop.waitForFunction(
    () =>
      document
        .querySelector("#shamco [data-interactive-scene] img")
        ?.currentSrc.includes("shamco-warehouse-") === true,
  );
  assert.equal(await shamcoScene.locator("button").count(), 0);
  assert.equal(await shamcoScene.locator("figcaption").count(), 0);
  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-shamco-scene.png"),
    fullPage: false,
  });

  await desktop.goto(`${baseUrl}/en/#network`, {
    waitUntil: "networkidle",
  });
  await desktop
    .locator("#network [data-interactive-scene]")
    .scrollIntoViewIfNeeded();
  const networkState = await desktop.evaluate(() => ({
    company: document.documentElement.dataset.company,
    companyLinks: document.querySelectorAll(
      '#network [class*="networkCompanies"] a',
    ).length,
    currentSrc: document.querySelector("#network [data-interactive-scene] img")
      ?.currentSrc,
    overlayControlCount: document.querySelectorAll(
      "#network [data-interactive-scene] button",
    ).length,
    visible: document.querySelector("#network")?.getAttribute("data-visible"),
  }));
  assert.equal(networkState.company, "holding");
  assert.equal(networkState.companyLinks, 4);
  assert.equal(networkState.overlayControlCount, 0);
  assert.equal(networkState.visible, "true");
  assert.match(networkState.currentSrc ?? "", /holding-network-/);
  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-holding-network.png"),
    fullPage: false,
  });

  await desktop.goto(`${baseUrl}/en/#contact`, {
    waitUntil: "networkidle",
  });
  const contactState = await desktop.evaluate(() => ({
    company: document.documentElement.dataset.company,
    formCount: document.querySelectorAll("#contact form").length,
    routeCount: document.querySelectorAll(
      '#contact [class*="contactRoutes"] a',
    ).length,
    requiredText: document
      .querySelector('#contact [class*="contactDependency"]')
      ?.textContent?.trim(),
  }));
  assert.equal(contactState.company, "holding");
  assert.equal(contactState.formCount, 0);
  assert.equal(contactState.routeCount, 4);
  assert.match(contactState.requiredText ?? "", /Required before launch/);
  assert.equal(
    await desktop.locator("#footer nav a").count(),
    4,
  );
  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-holding-contact.png"),
    fullPage: false,
  });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  const mobileTracking = trackPage(mobile);
  await mobile.goto(`${baseUrl}/en/#companies`, { waitUntil: "networkidle" });
  const mobileLayout = await mobile.evaluate(() => ({
    company: document.documentElement.dataset.company,
    documentWidth: document.documentElement.scrollWidth,
    section: document.documentElement.dataset.activeSection,
    viewportWidth: window.innerWidth,
  }));
  assert.equal(mobileLayout.documentWidth, mobileLayout.viewportWidth);
  assert.equal(mobileLayout.company, "holding");
  assert.equal(mobileLayout.section, "companies");

  await mobile
    .locator('#companies [class*="companySelector"] a[href="#jollaq"]')
    .focus();
  await mobile.keyboard.press("ArrowRight");
  assert.equal(
    await mobile.evaluate(() => document.activeElement?.getAttribute("href")),
    "#al-maria",
  );
  await mobile.keyboard.press("Enter");
  await mobile.waitForTimeout(1200);
  assert.equal(await mobile.evaluate(() => window.location.hash), "#al-maria");
  await mobile.goBack({ waitUntil: "networkidle" });
  assert.equal(await mobile.evaluate(() => window.location.hash), "#companies");
  await mobile.goForward({ waitUntil: "networkidle" });
  assert.equal(await mobile.evaluate(() => window.location.hash), "#al-maria");
  await mobile.keyboard.press("Escape");
  await mobile.waitForTimeout(750);
  assert.equal(await mobile.evaluate(() => window.location.hash), "#companies");
  assert.equal(
    await mobile.evaluate(() => document.activeElement?.getAttribute("href")),
    "#jollaq",
  );

  await mobile.goto(`${baseUrl}/en/#jollaq`, { waitUntil: "networkidle" });
  await mobile.locator("#jollaq [data-rendered-scene]").scrollIntoViewIfNeeded();
  const mobileJollaq = await mobile.evaluate(() => ({
    currentSrc: document.querySelector("#jollaq [data-rendered-scene] img")
      ?.currentSrc,
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  assert.equal(mobileJollaq.documentWidth, mobileJollaq.viewportWidth);
  assert.match(mobileJollaq.currentSrc ?? "", /jollaq-commodities-/);
  const mobileJollaqScene = mobile.locator(
    "#jollaq [data-interactive-scene]",
  );
  assert.equal(await mobileJollaqScene.locator("button").count(), 0);
  assert.equal(await mobileJollaqScene.locator("figcaption").count(), 0);
  await mobile.screenshot({
    path: path.join(artifactDirectory, "mobile-jollaq.png"),
    fullPage: false,
  });

  await mobile.goto(`${baseUrl}/en/#industrial`, {
    waitUntil: "networkidle",
  });
  await mobile
    .locator("#industrial [data-interactive-scene]")
    .scrollIntoViewIfNeeded();
  await mobile
    .locator('#industrial [role="group"] button')
    .nth(1)
    .click();
  await mobile.waitForFunction(
    () =>
      document
        .querySelector("#industrial [data-interactive-scene] img")
        ?.currentSrc.includes("industrial-metals-") === true,
  );
  const mobileIndustrial = await mobile.evaluate(() => ({
    company: document.documentElement.dataset.company,
    currentSrc: document.querySelector(
      "#industrial [data-interactive-scene] img",
    )?.currentSrc,
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  assert.equal(mobileIndustrial.company, "industrial");
  assert.equal(mobileIndustrial.documentWidth, mobileIndustrial.viewportWidth);
  assert.match(mobileIndustrial.currentSrc ?? "", /industrial-metals-/);
  await mobile.screenshot({
    path: path.join(artifactDirectory, "mobile-industrial.png"),
    fullPage: false,
  });

  await mobile.goto(`${baseUrl}/en/#shamco`, {
    waitUntil: "networkidle",
  });
  await mobile
    .locator("#shamco [data-interactive-scene]")
    .scrollIntoViewIfNeeded();
  await mobile.locator('#shamco [role="group"] button').nth(2).click();
  await mobile.waitForFunction(
    () =>
      document
        .querySelector("#shamco [data-interactive-scene] img")
        ?.currentSrc.includes("shamco-warehouse-") === true,
  );
  const mobileShamco = await mobile.evaluate(() => ({
    company: document.documentElement.dataset.company,
    currentSrc: document.querySelector(
      "#shamco [data-interactive-scene] img",
    )?.currentSrc,
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  assert.equal(mobileShamco.company, "shamco");
  assert.equal(mobileShamco.documentWidth, mobileShamco.viewportWidth);
  assert.match(mobileShamco.currentSrc ?? "", /shamco-warehouse-/);
  await mobile.screenshot({
    path: path.join(artifactDirectory, "mobile-shamco.png"),
    fullPage: false,
  });

  await mobile.goto(`${baseUrl}/ar/#al-maria`, { waitUntil: "networkidle" });
  const rtlState = await mobile.evaluate(() => ({
    currentSrc: document.querySelector("#al-maria [data-rendered-scene] img")
      ?.currentSrc,
    dir: document.documentElement.dir,
    documentWidth: document.documentElement.scrollWidth,
    heading: document.querySelector("#al-maria h2")?.textContent?.trim(),
    lang: document.documentElement.lang,
    viewportWidth: window.innerWidth,
  }));
  assert.equal(rtlState.lang, "ar");
  assert.equal(rtlState.dir, "rtl");
  assert.equal(rtlState.documentWidth, rtlState.viewportWidth);
  assert.match(rtlState.heading ?? "", /[\u0600-\u06ff]/);
  assert.match(rtlState.currentSrc ?? "", /al-maria-trade-/);
  await mobile.screenshot({
    path: path.join(artifactDirectory, "mobile-al-maria-ar.png"),
    fullPage: false,
  });

  await mobile.goto(`${baseUrl}/ar/#industrial`, {
    waitUntil: "networkidle",
  });
  await mobile
    .locator("#industrial [data-interactive-scene]")
    .scrollIntoViewIfNeeded();
  await mobile
    .locator('#industrial [role="group"] button')
    .nth(2)
    .click();
  await mobile.waitForFunction(
    () =>
      document
        .querySelector("#industrial [data-interactive-scene] img")
        ?.currentSrc.includes("industrial-paint-") === true,
  );
  const industrialRtlState = await mobile.evaluate(() => ({
    company: document.documentElement.dataset.company,
    currentSrc: document.querySelector(
      "#industrial [data-interactive-scene] img",
    )?.currentSrc,
    dir: document.documentElement.dir,
    documentWidth: document.documentElement.scrollWidth,
    heading: document.querySelector("#industrial h2")?.textContent?.trim(),
    lang: document.documentElement.lang,
    viewportWidth: window.innerWidth,
  }));
  assert.equal(industrialRtlState.company, "industrial");
  assert.equal(industrialRtlState.lang, "ar");
  assert.equal(industrialRtlState.dir, "rtl");
  assert.equal(
    industrialRtlState.documentWidth,
    industrialRtlState.viewportWidth,
  );
  assert.match(industrialRtlState.heading ?? "", /[\u0600-\u06ff]/);
  assert.match(
    industrialRtlState.currentSrc ?? "",
    /industrial-paint-/,
  );
  await mobile.screenshot({
    path: path.join(artifactDirectory, "mobile-industrial-ar.png"),
    fullPage: false,
  });

  await mobile.goto(`${baseUrl}/ar/#shamco`, {
    waitUntil: "networkidle",
  });
  await mobile
    .locator("#shamco [data-interactive-scene]")
    .scrollIntoViewIfNeeded();
  await mobile.locator('#shamco [role="group"] button').nth(1).click();
  await mobile.waitForFunction(
    () =>
      document
        .querySelector("#shamco [data-interactive-scene] img")
        ?.currentSrc.includes("shamco-network-") === true,
  );
  const shamcoRtlState = await mobile.evaluate(() => ({
    company: document.documentElement.dataset.company,
    currentSrc: document.querySelector(
      "#shamco [data-interactive-scene] img",
    )?.currentSrc,
    dir: document.documentElement.dir,
    documentWidth: document.documentElement.scrollWidth,
    heading: document.querySelector("#shamco h2")?.textContent?.trim(),
    lang: document.documentElement.lang,
    viewportWidth: window.innerWidth,
  }));
  assert.equal(shamcoRtlState.company, "shamco");
  assert.equal(shamcoRtlState.lang, "ar");
  assert.equal(shamcoRtlState.dir, "rtl");
  assert.equal(shamcoRtlState.documentWidth, shamcoRtlState.viewportWidth);
  assert.match(shamcoRtlState.heading ?? "", /[\u0600-\u06ff]/);
  assert.match(shamcoRtlState.currentSrc ?? "", /shamco-network-/);
  await mobile.screenshot({
    path: path.join(artifactDirectory, "mobile-shamco-ar.png"),
    fullPage: false,
  });

  await mobile.goto(`${baseUrl}/ar/#network`, {
    waitUntil: "networkidle",
  });
  await mobile
    .locator("#network [data-interactive-scene]")
    .scrollIntoViewIfNeeded();
  const holdingRtlState = await mobile.evaluate(() => ({
    company: document.documentElement.dataset.company,
    currentSrc: document.querySelector("#network [data-interactive-scene] img")
      ?.currentSrc,
    dir: document.documentElement.dir,
    documentWidth: document.documentElement.scrollWidth,
    heading: document.querySelector("#network h2")?.textContent?.trim(),
    lang: document.documentElement.lang,
    viewportWidth: window.innerWidth,
  }));
  assert.equal(holdingRtlState.company, "holding");
  assert.equal(holdingRtlState.lang, "ar");
  assert.equal(holdingRtlState.dir, "rtl");
  assert.equal(holdingRtlState.documentWidth, holdingRtlState.viewportWidth);
  assert.match(holdingRtlState.heading ?? "", /[\u0600-\u06ff]/);
  assert.match(holdingRtlState.currentSrc ?? "", /holding-network-/);
  await mobile.screenshot({
    path: path.join(artifactDirectory, "mobile-holding-network-ar.png"),
    fullPage: false,
  });

  const reducedMotion = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await reducedMotion.goto(`${baseUrl}/en/`, { waitUntil: "networkidle" });
  assert.equal(
    await reducedMotion.evaluate(
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    true,
  );
  assert.equal(await reducedMotion.locator("canvas").count(), 0);
  assert.equal(
    await reducedMotion.locator("[data-rendered-scene] img").first().count(),
    1,
  );
  assert.equal(
    await reducedMotion
      .locator("[data-interactive-scene]")
      .first()
      .locator('[class*="sceneDepth"]')
      .evaluate((element) => getComputedStyle(element).transform),
    "none",
  );
  const reducedMotionState = await reducedMotion.evaluate(() => {
    const scene = document.querySelector("[data-interactive-scene]");
    const loader = scene?.querySelector('[class*="sceneLoading"]');
    return {
      motion: document.documentElement.dataset.motion,
      sceneAnimation: scene ? getComputedStyle(scene).animationName : null,
      loaderDisplay: loader ? getComputedStyle(loader).display : null,
      overlayControlCount: scene?.querySelectorAll("button").length,
    };
  });
  assert.equal(reducedMotionState.motion, "reduced");
  assert.equal(reducedMotionState.sceneAnimation, "none");
  assert.equal(reducedMotionState.loaderDisplay, "none");
  assert.equal(reducedMotionState.overlayControlCount, 0);

  const noScript = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 900 },
  });
  await noScript.goto(`${baseUrl}/en/`, { waitUntil: "load" });
  const noScriptState = await noScript.evaluate(() => ({
    companyNames: Array.from(
      document.querySelectorAll('#companies [class*="companyOption"] strong'),
    ).map((element) => element.textContent?.trim()),
    h1: document.querySelector("h1")?.textContent?.trim(),
    imageCount: document.querySelectorAll("[data-rendered-scene] img").length,
    mainTextLength: document.querySelector("main")?.textContent?.trim().length,
  }));
  assert.match(noScriptState.h1 ?? "", /One holding system/);
  assert.deepEqual(noScriptState.companyNames, [
    "JOLLAQ",
    "Al Maria",
    "SYNTHEX Industrial",
    "SHAMCO LLC",
  ]);
  assert.ok((noScriptState.mainTextLength ?? 0) > 2000);
  assert.ok(noScriptState.imageCount >= 7);

  const constrained = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await constrained.route("**/media/**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.continue();
  });
  await constrained.goto(`${baseUrl}/en/`, {
    waitUntil: "domcontentloaded",
  });
  const constrainedScene = constrained.locator("[data-interactive-scene]").first();
  assert.equal(
    await constrainedScene.getAttribute("data-scene-loaded"),
    "false",
  );
  assert.equal(
    await constrainedScene
      .locator('[class*="sceneLoading"]')
      .evaluate((element) => getComputedStyle(element).opacity),
    "1",
  );
  await constrainedScene.locator("img").waitFor({ state: "visible" });
  await constrained.waitForFunction(
    () =>
      document
        .querySelector("[data-interactive-scene]")
        ?.getAttribute("data-scene-loaded") === "true",
  );
  assert.equal(await constrained.locator("canvas").count(), 0);

  const tablet = await browser.newPage({
    viewport: { width: 820, height: 1024 },
  });
  await tablet.goto(`${baseUrl}/en/#overview`, { waitUntil: "networkidle" });
  const tabletLayout = await tablet.evaluate(() => ({
    columns: getComputedStyle(
      document.querySelector('#overview [class*="holdingOverviewGrid"]'),
    ).gridTemplateColumns.split(" ").length,
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  assert.equal(tabletLayout.documentWidth, tabletLayout.viewportWidth);
  assert.equal(tabletLayout.columns, 1);

  const wide = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });
  await wide.goto(`${baseUrl}/en/`, { waitUntil: "networkidle" });
  const wideLayout = await wide.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    heroColumns: getComputedStyle(
      document.querySelector('[class*="heroGrid"]'),
    ).gridTemplateColumns.split(" ").length,
    viewportWidth: window.innerWidth,
  }));
  assert.equal(wideLayout.documentWidth, wideLayout.viewportWidth);
  assert.equal(wideLayout.heroColumns, 2);

  assert.deepEqual(desktopTracking.failedResponses, []);
  assert.deepEqual(desktopTracking.errors, []);
  assert.deepEqual(mobileTracking.failedResponses, []);
  assert.deepEqual(mobileTracking.errors, []);

  console.log(
    JSON.stringify(
      {
        alMariaState,
        accessibilityState,
        heroState,
        metadataState,
        resourceState,
        holdingOverviewState,
        holdingRtlState,
        jollaqState,
        industrialInitial,
        industrialRtlState,
        mobileIndustrial,
        mobileJollaq,
        mobileShamco,
        mobileLayout,
        rtlState,
        networkState,
        noScriptState,
        contactState,
        storyState,
        shamcoInitial,
        shamcoRtlState,
        tabletLayout,
        wideLayout,
        screenshots: artifactDirectory,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
