import { createServer } from "node:http";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "out",
);
const port = Number(process.env.PORT ?? 3000);

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

    const nestedCandidate =
      path.join(
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
  const filePath = await resolveFile(request.url ?? "/");

  if (!filePath) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const body = await readFile(filePath);
  response.writeHead(200, {
    "content-type":
      contentTypes[path.extname(filePath)] ?? "application/octet-stream",
  });
  response.end(body);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`SYNTHEX static preview: http://127.0.0.1:${port}`);
});
