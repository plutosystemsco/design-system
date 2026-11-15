/**
 * 015 decisions 15 and 16, criteria 17 and 18: an app installs from the
 * site's own versioned registry path, the files land where the page says,
 * and the app builds with the site out of reach. It reads `build/`, which
 * the e2e stage builds first (`bun run test` runs unit, e2e, then smoke).
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { SITE_ORIGIN } from "../../src/lib/site/site.ts";
import { bin, run, type Result } from "./process.ts";

const REPO = process.cwd();
const BUILD = path.join(REPO, "build");
const VERSION = JSON.parse(readFileSync("package.json", "utf8")).version;
const scratch = mkdtempSync(path.join(tmpdir(), "pluto-site-add-"));
let server: ReturnType<typeof Bun.serve> | undefined;
let origin = "";

/** build/ served as the worker serves it. */
function serve() {
  server = Bun.serve({
    port: 0,
    fetch(req) {
      let p = decodeURIComponent(new URL(req.url).pathname);
      if (p.includes("..")) return new Response("", { status: 400 });
      if (p.endsWith("/")) p += "index.html";
      const file = path.join(BUILD, p);
      return existsSync(file) && statSync(file).isFile()
        ? new Response(Bun.file(file))
        : new Response("not found", { status: 404 });
    },
  });
  origin = `http://localhost:${server.port}`;
}

function files(dir: string, root = dir): string[] {
  return readdirSync(dir).flatMap((e) => {
    const full = path.join(dir, e);
    if (/^(node_modules|\.svelte-kit|build)$/.test(e)) return [];
    return statSync(full).isDirectory()
      ? files(full, root)
      : [path.relative(root, full).split(path.sep).join("/")];
  });
}

/** A built page's "Files you own" list. */
function pageFiles(name: string): string[] {
  const html = readFileSync(
    path.join(BUILD, "components", name, "index.html"),
    "utf8",
  );
  const section =
    /<section aria-labelledby="files"[\s\S]*?<\/section>/.exec(html)?.[0] ?? "";
  const list = /<ul[\s\S]*?<\/ul>/.exec(section)?.[0] ?? "";
  return [...list.matchAll(/<li[^>]*>([^<]+)<\/li>/g)].map((m) => m[1].trim());
}

let app = "";
const adds: Record<string, { result: Result; written: string[] }> = {};
let build: Result;
let check: Result;

beforeAll(async () => {
  if (!existsSync(path.join(BUILD, "index.html")))
    throw new Error(
      "build/ is missing: run `bun run build` (the e2e stage does) first",
    );
  serve();
  app = path.join(scratch, "kit3");
  cpSync(path.join(REPO, "tests", "smoke", "fixtures", "kit3"), app, {
    recursive: true,
    filter: (src) =>
      !/[\\/](node_modules|\.svelte-kit|build)([\\/]|$)/.test(src),
  });
  const install = await run(
    [process.execPath, "install", "--frozen-lockfile"],
    app,
  );
  if (install.code !== 0)
    throw new Error(`bun install failed:\n${install.output}`);
  await run(bin(app, "svelte-kit", "sync"), app);
  // Criterion 18's one command, then product-home, each from the site's
  // versioned registry path. The CLI installs the packages they name.
  for (const names of ["pluto-theme button dialog", "product-home"]) {
    const before = new Set(files(app));
    const result = await run(
      bin(REPO, "shadcn-svelte", "add", ...names.split(" "), "-y", "-o"),
      app,
      { REGISTRY_URL: `${origin}/v${VERSION}/r` },
    );
    adds[names] = { result, written: files(app).filter((f) => !before.has(f)) };
  }
  // The site is out of reach from here on.
  server?.stop(true);
  build = await run(bin(app, "vite", "build"), app);
  check = await run(
    bin(
      app,
      "svelte-check",
      "--tsconfig",
      "./tsconfig.json",
      "--output",
      "machine",
    ),
    app,
  );
}, 290_000);

afterAll(() => {
  server?.stop(true);
  rmSync(scratch, { recursive: true, force: true });
});

describe("015: install from the site, then offline", () => {
  test("criterion 18: add from the site's versioned path exits 0, for the theme, button, dialog and product-home", () => {
    for (const [names, r] of Object.entries(adds))
      expect(r.result.code, `${names}\n${r.result.output}`).toBe(0);
  });

  test("criterion 17: for button, dialog and product-home, every file on the page's list is one the CLI wrote, at that path", () => {
    for (const name of ["button", "dialog", "product-home"]) {
      const listed = pageFiles(name);
      expect(listed.length, name).toBeGreaterThan(0);
      // Each listed path is where add wrote the file: present now, absent
      // from the fixture before.
      const written = Object.values(adds).flatMap((a) => a.written);
      for (const f of listed) {
        expect(existsSync(path.join(app, f)), `${name}: ${f}`).toBe(true);
        expect(written, `${name}: ${f}`).toContain(f);
      }
    }
  });

  test("criterion 18: with the site stopped, the app's vite build and svelte-check pass with 0 errors", () => {
    expect(build.code, build.output).toBe(0);
    expect(check.code, check.output).toBe(0);
    expect(check.output).toMatch(/COMPLETED .* 0 ERRORS/);
  });

  test("criterion 18: the installed files name neither the local origin, nor the site's host, nor GitHub's raw files", () => {
    const host = new URL(
      SITE_ORIGIN.replace("<account>", "account"),
    ).host.replace("account", "");
    const hits: string[] = [];
    for (const f of files(path.join(app, "src"))) {
      const text = readFileSync(path.join(app, "src", f), "utf8");
      if (
        text.includes(origin) ||
        text.includes("raw.githubusercontent.com") ||
        text.includes(host.split(".")[0])
      )
        hits.push(f);
    }
    expect(hits).toEqual([]);
  });
});
