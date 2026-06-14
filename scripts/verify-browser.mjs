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
const executablePath = await findExecutable();
const browser = await chromium.launch({ executablePath, headless: true });

try {
  await import("node:fs/promises").then(({ mkdir }) =>
    mkdir(artifactDirectory, { recursive: true }),
  );

  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const desktopErrors = [];
  const desktopFailedResponses = [];
  desktop.on("console", (message) => {
    if (message.type() === "error") {
      const location = message.location();
      desktopErrors.push(
        `${message.text()}${location.url ? ` (${location.url})` : ""}`,
      );
    }
  });
  desktop.on("pageerror", (error) => desktopErrors.push(error.message));
  desktop.on("response", (response) => {
    if (response.status() >= 400) {
      desktopFailedResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  await desktop.goto(`${baseUrl}/en/`, {
    waitUntil: "networkidle",
  });
  await desktop.waitForFunction(
    () =>
      document
        .querySelector("[data-holding-scene]")
        ?.getAttribute("data-webgl-status") !== "checking",
  );

  const sceneStatus = await desktop
    .locator("[data-holding-scene]")
    .getAttribute("data-webgl-status");
  if (sceneStatus === "available") {
    await desktop.waitForFunction(
      () =>
        document
          .querySelector("[data-holding-scene]")
          ?.getAttribute("data-scene-ready") === "true",
    );
  }

  const heroState = await desktop.evaluate(() => {
    const scene = document.querySelector("[data-holding-scene]");
    return {
      canvasCount: scene?.querySelectorAll("canvas").length ?? 0,
      fallbackCount:
        scene?.querySelectorAll("[data-scene-fallback]").length ?? 0,
      ready: scene?.getAttribute("data-scene-ready"),
      tier: scene?.getAttribute("data-render-tier"),
      webgl: scene?.getAttribute("data-webgl-status"),
    };
  });

  assert.equal(heroState.fallbackCount, 1);
  assert.notEqual(heroState.webgl, "checking");
  if (heroState.webgl === "available") {
    assert.match(heroState.tier ?? "", /^[12]$/);
    assert.equal(heroState.ready, "true");
    assert.equal(heroState.canvasCount, 1);
  } else {
    assert.equal(heroState.tier, "0");
    assert.equal(heroState.canvasCount, 0);
  }

  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-hero.png"),
    fullPage: false,
  });

  await desktop.locator('main a[href="#companies"]').click();
  await desktop.waitForTimeout(800);
  await desktop
    .locator('[class*="companyOption"][data-company="jollaq"]')
    .hover();
  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-companies.png"),
    fullPage: false,
  });

  await desktop.goto(`${baseUrl}/en/#jollaq`, {
    waitUntil: "networkidle",
  });
  await desktop.waitForTimeout(250);

  const directState = await desktop.evaluate(() => ({
    company: document.documentElement.dataset.company,
    section: document.documentElement.dataset.activeSection,
    hash: window.location.hash,
    scrollY: Math.round(window.scrollY),
    h1Count: document.querySelectorAll("h1").length,
    heroCanvasCount:
      document.querySelector("[data-holding-scene]")?.querySelectorAll("canvas")
        .length ?? 0,
    heroSceneActive: document
      .querySelector("[data-holding-scene]")
      ?.getAttribute("data-scene-active"),
    mainCount: document.querySelectorAll("main").length,
    navCount: document.querySelectorAll("nav").length,
    heading: document.querySelector("#jollaq h2")?.textContent?.trim(),
  }));

  assert.equal(directState.company, "jollaq");
  assert.equal(directState.section, "jollaq");
  assert.equal(directState.hash, "#jollaq");
  assert.ok(directState.scrollY > 1000);
  assert.equal(directState.h1Count, 1);
  assert.equal(directState.heroCanvasCount, 0);
  assert.equal(directState.heroSceneActive, "false");
  assert.equal(directState.mainCount, 1);
  assert.ok(directState.navCount >= 2);
  assert.ok(directState.heading?.length);
  assert.deepEqual(
    desktopFailedResponses,
    [],
    `Failed desktop responses:\n${desktopFailedResponses.join("\n")}`,
  );
  assert.deepEqual(
    desktopErrors,
    [],
    `Desktop console errors:\n${desktopErrors.join("\n")}`,
  );

  await desktop.screenshot({
    path: path.join(artifactDirectory, "desktop-jollaq.png"),
    fullPage: false,
  });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  const mobileErrors = [];
  const mobileFailedResponses = [];
  mobile.on("console", (message) => {
    if (message.type() === "error") {
      const location = message.location();
      mobileErrors.push(
        `${message.text()}${location.url ? ` (${location.url})` : ""}`,
      );
    }
  });
  mobile.on("pageerror", (error) => mobileErrors.push(error.message));
  mobile.on("response", (response) => {
    if (response.status() >= 400) {
      mobileFailedResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  await mobile.goto(`${baseUrl}/en/`, {
    waitUntil: "networkidle",
  });
  await mobile.waitForTimeout(1000);
  const mobileHero = await mobile.evaluate(() => {
    const scene = document.querySelector("[data-holding-scene]");
    return {
      canvasCount: scene?.querySelectorAll("canvas").length ?? 0,
      documentWidth: document.documentElement.scrollWidth,
      ready: scene?.getAttribute("data-scene-ready"),
      tier: scene?.getAttribute("data-render-tier"),
      viewportWidth: window.innerWidth,
    };
  });
  assert.equal(mobileHero.documentWidth, mobileHero.viewportWidth);
  assert.equal(mobileHero.tier, "1");
  assert.equal(mobileHero.ready, "true");
  assert.equal(mobileHero.canvasCount, 1);
  await mobile.screenshot({
    path: path.join(artifactDirectory, "mobile-hero.png"),
    fullPage: false,
  });

  await mobile.goto(`${baseUrl}/en/#companies`, {
    waitUntil: "networkidle",
  });
  await mobile.waitForTimeout(1000);

  const mobileLayout = await mobile.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    company: document.documentElement.dataset.company,
    section: document.documentElement.dataset.activeSection,
  }));

  assert.equal(mobileLayout.documentWidth, mobileLayout.viewportWidth);
  assert.equal(mobileLayout.company, "holding");
  assert.equal(mobileLayout.section, "companies");

  await mobile.locator('a[href="#jollaq"]').last().focus();
  await mobile.keyboard.press("ArrowRight");
  assert.equal(
    await mobile.evaluate(
      () => document.activeElement?.getAttribute("href"),
    ),
    "#al-maria",
  );

  await mobile.keyboard.press("Enter");
  await mobile.waitForTimeout(1500);
  assert.equal(await mobile.evaluate(() => window.location.hash), "#al-maria");
  assert.equal(
    await mobile.evaluate(() => document.documentElement.dataset.company),
    "al-maria",
  );

  await mobile.goBack({ waitUntil: "networkidle" });
  await mobile.waitForTimeout(300);
  assert.equal(await mobile.evaluate(() => window.location.hash), "#companies");
  assert.equal(
    await mobile.evaluate(() => document.documentElement.dataset.company),
    "holding",
  );

  await mobile.goto(`${baseUrl}/en/#industrial`, {
    waitUntil: "networkidle",
  });
  await mobile.keyboard.press("Escape");
  await mobile.waitForTimeout(750);
  assert.equal(await mobile.evaluate(() => window.location.hash), "#companies");
  assert.equal(
    await mobile.evaluate(() => document.documentElement.dataset.company),
    "holding",
  );

  await mobile.goto(`${baseUrl}/en/#companies`, {
    waitUntil: "networkidle",
  });
  await mobile.screenshot({
    path: path.join(artifactDirectory, "mobile-companies.png"),
    fullPage: false,
  });

  await mobile.goto(`${baseUrl}/ar/#industrial`, {
    waitUntil: "networkidle",
  });
  await mobile.waitForTimeout(250);

  const rtlState = await mobile.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    company: document.documentElement.dataset.company,
    section: document.documentElement.dataset.activeSection,
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    heading: document.querySelector("#industrial h2")?.textContent?.trim(),
  }));

  assert.equal(rtlState.lang, "ar");
  assert.equal(rtlState.dir, "rtl");
  assert.equal(rtlState.company, "industrial");
  assert.equal(rtlState.section, "industrial");
  assert.equal(rtlState.documentWidth, rtlState.viewportWidth);
  assert.match(rtlState.heading ?? "", /[\u0600-\u06ff]/);
  assert.deepEqual(
    mobileFailedResponses,
    [],
    `Failed mobile responses:\n${mobileFailedResponses.join("\n")}`,
  );
  assert.deepEqual(
    mobileErrors,
    [],
    `Mobile console errors:\n${mobileErrors.join("\n")}`,
  );

  await mobile.screenshot({
    path: path.join(artifactDirectory, "mobile-industrial-ar.png"),
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
  const reducedScene = await reducedMotion.evaluate(() => {
    const scene = document.querySelector("[data-holding-scene]");
    return {
      canvasCount: scene?.querySelectorAll("canvas").length ?? 0,
      fallbackCount:
        scene?.querySelectorAll("[data-scene-fallback]").length ?? 0,
      tier: scene?.getAttribute("data-render-tier"),
    };
  });
  assert.equal(reducedScene.tier, "0");
  assert.equal(reducedScene.canvasCount, 0);
  assert.equal(reducedScene.fallbackCount, 1);
  await reducedMotion.locator('main a[href="#companies"]').click();
  await reducedMotion.waitForTimeout(100);
  assert.equal(
    await reducedMotion.evaluate(() => window.location.hash),
    "#companies",
  );

  const tablet = await browser.newPage({
    viewport: { width: 820, height: 1024 },
  });
  await tablet.goto(`${baseUrl}/en/#overview`, {
    waitUntil: "networkidle",
  });
  const tabletLayout = await tablet.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    columns: getComputedStyle(
      document.querySelector('[class*="operatingGrid"]'),
    ).gridTemplateColumns.split(" ").length,
  }));
  assert.equal(tabletLayout.documentWidth, tabletLayout.viewportWidth);
  assert.equal(tabletLayout.columns, 2);
  await tablet.screenshot({
    path: path.join(artifactDirectory, "tablet-overview.png"),
    fullPage: false,
  });

  const wide = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });
  await wide.goto(`${baseUrl}/en/`, { waitUntil: "networkidle" });
  const wideLayout = await wide.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    heroColumns: getComputedStyle(
      document.querySelector('[class*="heroGrid"]'),
    ).gridTemplateColumns.split(" ").length,
  }));
  assert.equal(wideLayout.documentWidth, wideLayout.viewportWidth);
  assert.equal(wideLayout.heroColumns, 2);

  const noWebgl = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  await noWebgl.addInitScript(() => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function getContext(
      type,
      ...args
    ) {
      if (
        type === "webgl" ||
        type === "webgl2" ||
        type === "experimental-webgl"
      ) {
        return null;
      }
      return originalGetContext.call(this, type, ...args);
    };
  });
  await noWebgl.goto(`${baseUrl}/en/`, { waitUntil: "networkidle" });
  await noWebgl.waitForFunction(
    () =>
      document
        .querySelector("[data-holding-scene]")
        ?.getAttribute("data-webgl-status") === "unavailable",
  );
  const fallbackState = await noWebgl.evaluate(() => {
    const scene = document.querySelector("[data-holding-scene]");
    return {
      canvasCount: scene?.querySelectorAll("canvas").length ?? 0,
      fallbackCount:
        scene?.querySelectorAll("[data-scene-fallback]").length ?? 0,
      tier: scene?.getAttribute("data-render-tier"),
      webgl: scene?.getAttribute("data-webgl-status"),
    };
  });
  assert.deepEqual(fallbackState, {
    canvasCount: 0,
    fallbackCount: 1,
    tier: "0",
    webgl: "unavailable",
  });

  console.log(
    JSON.stringify(
      {
        directState,
        fallbackState,
        heroState,
        mobileHero,
        mobileLayout,
        reducedScene,
        rtlState,
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
