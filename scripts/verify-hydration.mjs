import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { access } from "node:fs/promises";
import { chromium } from "playwright-core";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

async function availablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : null;
  await new Promise((resolve) => server.close(resolve));

  if (!port) {
    throw new Error("Could not allocate a port for hydration verification.");
  }

  return port;
}

async function edgeExecutable() {
  const candidates = [
    process.env.EDGE_PATH,
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/microsoft-edge",
    "/usr/bin/microsoft-edge-stable",
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue through platform candidates.
    }
  }

  throw new Error(
    "Microsoft Edge was not found. Set EDGE_PATH to run hydration verification.",
  );
}

async function waitForServer(url, timeoutMs = 60_000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // The development server may still be compiling.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Development server did not become ready: ${url}`);
}

async function existingDevelopmentServer() {
  const baseUrl =
    process.env.HYDRATION_BASE_URL ?? "http://127.0.0.1:3000";

  try {
    const response = await fetch(`${baseUrl}/ar/`);
    const html = await response.text();
    const isSynthexDevelopmentServer =
      response.ok &&
      html.includes("SYNTHEX Holding") &&
      html.includes("development") &&
      html.includes("turbopack");

    return isSynthexDevelopmentServer ? baseUrl : null;
  } catch {
    return null;
  }
}

const existingBaseUrl = await existingDevelopmentServer();
let server = null;
let serverOutput = "";
let url;

if (existingBaseUrl) {
  url = `${existingBaseUrl}/ar/#companies`;
} else {
  const port = await availablePort();
  const nextBin = path.join(
    projectRoot,
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );
  server = spawn(
    process.execPath,
    [nextBin, "dev", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: projectRoot,
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );
  server.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  url = `http://127.0.0.1:${port}/ar/#companies`;
}

let browser;

try {
  await waitForServer(url);
  browser = await chromium.launch({
    executablePath: await edgeExecutable(),
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1024, height: 768 },
  });
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.addInitScript(() => {
    const applyExtensionHeadScript = () => {
      if (!document.head) {
        return false;
      }

      if (window.__synthexExtensionScriptInjected === true) {
        return true;
      }

      if (
        document.querySelector(
          "script[data-dynamic-id='extension-test-script']",
        )
      ) {
        return true;
      }

      window.__synthexExtensionScriptInjected = true;
      const script = document.createElement("script");
      script.type = "application/x-extension-placeholder";
      script.charset = "utf-8";
      script.setAttribute("bis_use", "true");
      script.setAttribute("data-dynamic-id", "extension-test-script");
      script.src =
        "chrome-extension://eppiocemhmnlbhjplcgkofciiegomcon/executors/200.js";
      document.head.insertBefore(script, document.head.firstChild);
      return true;
    };

    const applyExtensionAttributes = () => {
      if (!document.body) {
        return false;
      }

      window.__synthexExtensionAttributesInjected = true;
      document.body.setAttribute(
        "__processed_67012a90-f8d6-4c88-b6a8-2530ef4d96c9__",
        "true",
      );
      document.body.setAttribute("bis_register", "extension-test-payload");
      document.querySelectorAll("div").forEach((element) => {
        element.setAttribute("bis_skin_checked", "1");
      });
      return true;
    };

    const observer = new MutationObserver(() => {
      applyExtensionHeadScript();
      applyExtensionAttributes();
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });
    applyExtensionHeadScript();
    applyExtensionAttributes();
  });

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(750);

  const bodyAttributes = await page.evaluate(() => ({
    checkedDivs: document.querySelectorAll("div[bis_skin_checked='1']").length,
    extensionHeadScripts: document.querySelectorAll(
      "script[src^='chrome-extension://'],script[bis_use],script[data-dynamic-id='extension-test-script']",
    ).length,
    guardPresent: Boolean(
      document.querySelector("script[data-extension-hydration-guard]"),
    ),
    injectionAttempted:
      window.__synthexExtensionAttributesInjected === true,
    scriptInjectionAttempted:
      window.__synthexExtensionScriptInjected === true,
    processed: document.body.getAttribute(
      "__processed_67012a90-f8d6-4c88-b6a8-2530ef4d96c9__",
    ),
    registered: document.body.getAttribute("bis_register"),
  }));

  assert.equal(bodyAttributes.injectionAttempted, true);
  assert.equal(bodyAttributes.scriptInjectionAttempted, true);
  assert.equal(bodyAttributes.guardPresent, true);
  assert.equal(bodyAttributes.processed, null);
  assert.equal(bodyAttributes.registered, null);
  assert.equal(bodyAttributes.checkedDivs, 0);
  assert.equal(bodyAttributes.extensionHeadScripts, 0);
  assert.equal(
    errors.some((message) =>
      /hydrated|hydration|didn't match|did not match/i.test(message),
    ),
    false,
    `Hydration warning detected:\n${errors.join("\n")}`,
  );

  console.log(
    JSON.stringify(
      {
        route: "/ar/#companies",
        injectedAttributes: bodyAttributes,
        hydrationWarnings: 0,
      },
      null,
      2,
    ),
  );
} catch (error) {
  if (serverOutput) {
    console.error(serverOutput);
  }
  throw error;
} finally {
  if (browser) {
    await browser.close();
  }

  if (server) {
    server.kill();
    await new Promise((resolve) => {
      const timeout = setTimeout(resolve, 5_000);
      server.once("exit", () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }
}
