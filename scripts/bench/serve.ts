/**
 * Serve `build/` statically, gzipping text, the way the perf suite does
 * (015 decision 23), so the benchmark measures Kuiper as it ships rather than
 * the dev server. Our own code; nothing is copied.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { KUIPER } from "./targets.ts";

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
};

export function serveBuild(dir = "build") {
  const root = path.resolve(dir);
  if (!existsSync(path.join(root, "index.html")))
    throw new Error(
      `No site in ${root}. Build it first (bun run build), at the commit being scored.`,
    );
  const server = Bun.serve({
    port: 0,
    fetch(req) {
      let p = decodeURIComponent(new URL(req.url).pathname);
      if (p.endsWith("/")) p += "index.html";
      const file = path.join(root, p);
      if (
        !file.startsWith(root) ||
        !existsSync(file) ||
        !statSync(file).isFile()
      )
        return new Response("not found", { status: 404 });
      const type = TYPES[path.extname(file)] ?? "application/octet-stream";
      if (/text|javascript|json|svg|xml/.test(type))
        return new Response(Bun.gzipSync(new Uint8Array(readFileSync(file))), {
          headers: { "content-type": type, "content-encoding": "gzip" },
        });
      return new Response(Bun.file(file), {
        headers: { "content-type": type },
      });
    },
  });
  const origin = `http://localhost:${server.port}`;
  return {
    origin,
    resolve: (url: string) =>
      url.startsWith(KUIPER) ? origin + url.slice(KUIPER.length) : url,
    stop: () => server.stop(true),
    built: statSync(path.join(root, "index.html")).mtime.toISOString(),
  };
}

/** Parse `--name value` and `--flag` from argv. */
export function args(argv = process.argv.slice(2)) {
  const out: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      out[a.slice(2)] = next;
      i++;
    } else out[a.slice(2)] = true;
  }
  return out;
}

export const median = (xs: number[]) =>
  xs.length ? [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] : NaN;
