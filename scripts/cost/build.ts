/**
 * 025 decisions 3, 4 and 7: the size phase. The registry guard; one template
 * app, installed offline from the cost app's own lock; one item app per item,
 * copied from the template with its `node_modules` linked, added to by the
 * repository's locked CLI against `static/r/` served read-only; the build;
 * and its gzipped JS, CSS, lazy JS and assets, with a breakdown by source.
 */
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import { bin, run, type Result } from "../../tests/smoke/process.ts";
import {
  APP_DIR,
  catalogueItems,
  FIXTURES_DIR,
  placeOf,
  REPO,
  routeOf,
  servedItems,
  STATIC_R,
  THEME_ITEM,
  UTILS,
} from "./items.ts";
import { SETTINGS } from "./settings.ts";

/**
 * Decision 3.2: every CLI run is offline. The npm registry is a closed local
 * port, and a failed lookup is not retried, so each of the CLI's font
 * lookups fails in about a second instead of backing off for a minute.
 */
export const OFFLINE_ENV: Record<string, string> = {
  BUN_CONFIG_REGISTRY: "http://127.0.0.1:9/",
  npm_config_registry: "http://127.0.0.1:9/",
  npm_config_fetch_retries: "0",
};

/**
 * Serves `fetch` on the first free port from 5200 to 5899, from a random
 * start. The harness never starts `vite dev`, and never uses port 5199.
 */
export function serveOnFreePort(
  fetch: (req: Request) => Response | Promise<Response>,
): ReturnType<typeof Bun.serve> {
  const span = 700;
  const start = Math.floor(Math.random() * span);
  for (let i = 0; i < span; i++) {
    const port = 5200 + ((start + i) % span);
    try {
      return Bun.serve({ hostname: "127.0.0.1", port, fetch });
    } catch {
      // Taken; try the next.
    }
  }
  throw new Error("cost: no free port from 5200 to 5899");
}

/** A file under `root`, or null when the path leaves it. */
export function within(root: string, urlPath: string): string | null {
  const file = path.join(root, decodeURIComponent(urlPath));
  return file.startsWith(root + path.sep) || file === root ? file : null;
}

/** Serves a built registry (`static/r/`) read-only at `/r/`. */
export function serveRegistry(staticR = STATIC_R) {
  const server = serveOnFreePort(async (req) => {
    const p = new URL(req.url).pathname;
    const file = p.startsWith("/r/") ? within(staticR, p.slice(3)) : null;
    if (!file || !existsSync(file) || statSync(file).isDirectory())
      return new Response("Not found", { status: 404 });
    return new Response(Bun.file(file));
  });
  return {
    url: `http://127.0.0.1:${server.port}/r`,
    stop: () => server.stop(true),
  };
}

/** Every file under a folder, relative to it, sorted. */
export function walk(dir: string, base = dir): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .sort()
    .flatMap((e) => {
      const full = path.join(dir, e);
      return statSync(full).isDirectory()
        ? walk(full, base)
        : [path.relative(base, full)];
    });
}

/**
 * The registry guard (decision 3): a fresh `build:registry --out` must equal
 * `staticR` by content. Returns the files that differ, or are only on one side.
 */
export async function registryGuard(staticR = STATIC_R): Promise<string[]> {
  const out = mkdtempSync(path.join(tmpdir(), "kuiper-cost-registry-"));
  try {
    const r = await run(
      [process.execPath, "scripts/build-registry.ts", "--out", out],
      REPO,
    );
    if (r.code !== 0)
      throw new Error(`cost: build:registry --out failed\n${r.output}`);
    const fresh = path.join(out, "r");
    const a = walk(fresh);
    const b = walk(staticR);
    const differ = [...new Set([...a, ...b])].sort().filter((f) => {
      const x = path.join(fresh, f);
      const y = path.join(staticR, f);
      return (
        !existsSync(x) ||
        !existsSync(y) ||
        !readFileSync(x).equals(readFileSync(y))
      );
    });
    return differ;
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

/**
 * Copies an app without its build output or install, and links its
 * `node_modules` to `nodeModules`.
 */
export function copyApp(from: string, to: string, nodeModules: string): void {
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, {
    recursive: true,
    filter: (src) => {
      const r = path.relative(from, src);
      return !(
        r === "node_modules" ||
        r.startsWith(`node_modules${path.sep}`) ||
        r === "build" ||
        r.startsWith(`build${path.sep}`) ||
        r === path.join(".svelte-kit", "output") ||
        r.startsWith(path.join(".svelte-kit", "output") + path.sep)
      );
    },
  });
  symlinkSync(nodeModules, path.join(to, "node_modules"), "dir");
}

/** One `add`, with the repository's locked CLI under Bun, timed. */
export async function addItem(
  dir: string,
  names: string[],
  registryUrl: string,
  env: Record<string, string> = OFFLINE_ENV,
): Promise<Result & { ms: number }> {
  const t = performance.now();
  const r = await run(
    bin(
      REPO,
      "shadcn-svelte",
      "add",
      ...names,
      "-y",
      "-o",
      "--no-deps-install",
    ),
    dir,
    { ...env, REGISTRY_URL: registryUrl },
  );
  return { ...r, ms: performance.now() - t };
}

/** The package names a package.json lists. */
function listed(file: string): Set<string> {
  const pkg = JSON.parse(readFileSync(file, "utf8"));
  return new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ]);
}

const COMPRESSIBLE = /\.(js|mjs|css|wasm|svg|json|txt|html|xml|map|scm)$/;
const FONT = /\.(woff2?|ttf|otf)$/;

export type Sizes = {
  js: number;
  css: number;
  lazy: number;
  assets: number;
  brotli: { js: number; css: number };
  /** The initial JS and CSS files, relative to `build/`. */
  initial: string[];
  /** Raw bytes of each font file, relative to `build/`. */
  fonts: Record<string, number>;
};

const gz = (b: Buffer) => gzipSync(b, { level: SETTINGS.gzipLevel }).length;
const br = (b: Buffer) =>
  brotliCompressSync(b, {
    params: { [constants.BROTLI_PARAM_QUALITY]: SETTINGS.brotliQuality },
  }).length;

/** The prerendered page of a route, as a path under `build/`. */
function pageFile(build: string, route: string): string {
  if (route === "/") return path.join(build, "index.html");
  const flat = path.join(build, `${route.slice(1)}.html`);
  return existsSync(flat)
    ? flat
    : path.join(build, route.slice(1), "index.html");
}

/**
 * Decision 4: the initial set is what the route's prerendered HTML loads
 * (its modulepreload links, the start script's `import()`s, its
 * stylesheets) with their static imports from the client manifest.
 */
export function initialSet(dir: string, route: string): string[] {
  const build = path.join(dir, "build");
  const html = readFileSync(pageFile(build, route), "utf8");
  const base = new URL(route === "/" ? "/" : route, "http://cost.invalid");
  const files = new Set<string>();
  const add = (href: string) => {
    const p = new URL(href, base).pathname.slice(1);
    files.add(decodeURIComponent(p));
  };
  for (const tag of html.match(/<link\b[^>]*>/g) ?? []) {
    const rel = tag.match(/\brel="([^"]+)"/)?.[1];
    const href = tag.match(/\bhref="([^"]+)"/)?.[1];
    if (href && (rel === "modulepreload" || rel === "stylesheet")) add(href);
  }
  for (const m of html.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g))
    add(m[1]!);
  const manifest: Record<
    string,
    { file: string; imports?: string[]; css?: string[] }
  > = JSON.parse(
    readFileSync(
      path.join(
        dir,
        ".svelte-kit",
        "output",
        "client",
        ".vite",
        "manifest.json",
      ),
      "utf8",
    ),
  );
  const byFile = new Map(Object.values(manifest).map((e) => [e.file, e]));
  // SvelteKit's client loads the root error page's node with the root
  // layout's at every start (`client.js`: `default_error_loader`), though the
  // HTML names neither; the layout's comes through the start script's import.
  for (const [key, entry] of Object.entries(manifest))
    if (/\/client-optimized\/nodes\/1\.js$/.test(key)) files.add(entry.file);
  const visit = (file: string) => {
    const entry = byFile.get(file);
    for (const css of entry?.css ?? []) files.add(css);
    for (const key of entry?.imports ?? []) {
      const next = manifest[key]?.file;
      if (next && !files.has(next)) {
        files.add(next);
        visit(next);
      }
    }
  };
  for (const f of [...files]) visit(f);
  return [...files].filter((f) => /\.(js|css)$/.test(f)).sort();
}

/** Decision 4: an app's gzipped initial JS and CSS, lazy JS and assets. */
export function sizesOf(dir: string, route: string): Sizes {
  const initial = initialSet(dir, route);
  const set = new Set(initial);
  const out: Sizes = {
    js: 0,
    css: 0,
    lazy: 0,
    assets: 0,
    brotli: { js: 0, css: 0 },
    initial,
    fonts: {},
  };
  const build = path.join(dir, "build");
  for (const rel of walk(path.join(build, "_app"))) {
    const file = path.join("_app", rel);
    const bytes = readFileSync(path.join(build, file));
    if (set.has(file)) {
      const kind = file.endsWith(".css") ? "css" : "js";
      out[kind] += gz(bytes);
      out.brotli[kind] += br(bytes);
    } else if (file.endsWith(".js")) out.lazy += gz(bytes);
    else {
      out.assets += COMPRESSIBLE.test(file) ? gz(bytes) : bytes.length;
      if (FONT.test(file)) out.fonts[file] = bytes.length;
    }
  }
  return out;
}

/** The SHA-256 of every JS and CSS file an app built, by path (criterion 15). */
export function fileHashes(dir: string): Record<string, string> {
  const build = path.join(dir, "build");
  return Object.fromEntries(
    walk(build)
      .filter((f) => /\.(js|css)$/.test(f))
      .map((f) => [
        f,
        createHash("sha256")
          .update(readFileSync(path.join(build, f)))
          .digest("hex"),
      ]),
  );
}

export type AppKind =
  | "empty"
  | "themeFloor"
  | "floor"
  | "calibrate"
  | "item"
  | "case"
  | "block"
  | "catalogue";

export type Built = {
  key: string;
  kind: AppKind;
  dir: string;
  route: string;
  add: (Result & { ms: number }) | null;
  sizes: Sizes;
  /** Each client chunk's modules and their rendered lengths. */
  modules: Record<string, Record<string, number>>;
  buildMs: number;
};

/** A page that renders the floor's page and then each fixture, in order. */
function wrapper(parts: string[]): string {
  const imports = parts
    .map((p, i) => `  import Part${i} from "./${p}";`)
    .join("\n");
  const body = parts.map((_, i) => `<Part${i} />`).join("\n");
  return `<script lang="ts">\n${imports}\n</script>\n\n${body}\n`;
}

const fixture = (name: string) =>
  readFileSync(path.join(FIXTURES_DIR, `${name}.svelte`), "utf8");

/** The prepared work folder: the base install, the template, the registry. */
export class Harness {
  private constructor(
    readonly work: string,
    readonly base: string,
    readonly template: string,
    readonly nodeModules: string,
    readonly registryUrl: string,
    private readonly stopRegistry: () => void,
  ) {}

  /**
   * Decision 3.3: copy the cost app, install it from its lock (Bun's cache
   * only), sync, and add the theme item and `utils` into a template.
   */
  static async prepare(work: string, staticR = STATIC_R): Promise<Harness> {
    mkdirSync(work, { recursive: true });
    const registry = serveRegistry(staticR);
    try {
      const base = path.join(work, "base");
      rmSync(base, { recursive: true, force: true });
      cpSync(APP_DIR, base, {
        recursive: true,
        filter: (src) =>
          !/[\\/](node_modules|\.svelte-kit|build)([\\/]|$)/.test(
            path.relative(APP_DIR, src),
          ),
      });
      // Not under OFFLINE_ENV: Bun keys its cache by registry, so a closed
      // registry address would miss a warm cache. A frozen install from a
      // warm cache asks the network nothing.
      const install = await run(
        [process.execPath, "install", "--frozen-lockfile"],
        base,
      );
      if (install.code !== 0)
        throw new Error(
          `cost: \`bun install --frozen-lockfile\` failed in the cost app. It reads only Bun's cache, offline; a cold cache needs the network once: run \`bun install --frozen-lockfile\` in scripts/cost/app with the network, then delete its node_modules.\n${install.output}`,
        );
      const sync = await run(bin(base, "svelte-kit", "sync"), base);
      if (sync.code !== 0)
        throw new Error(`cost: svelte-kit sync failed\n${sync.output}`);
      const nodeModules = path.join(base, "node_modules");
      const template = path.join(work, "template");
      copyApp(base, template, nodeModules);
      const h = new Harness(
        work,
        base,
        template,
        nodeModules,
        registry.url,
        registry.stop,
      );
      await h.add(template, [THEME_ITEM, UTILS], "the template");
      return h;
    } catch (error) {
      registry.stop();
      throw error;
    }
  }

  /**
   * Decision 3.4–3.5: one offline `add`; an `add` over the time limit, or
   * one that names a package the template lacks, fails; then the template's
   * `package.json` is restored, so the built tree is the hashed one.
   */
  async add(dir: string, names: string[], key: string) {
    let r = await addItem(dir, names, this.registryUrl);
    if (r.code !== 0)
      throw new Error(`cost: ${key}: add exited ${r.code}\n${r.output}`);
    // A busy machine can push one add past the limit; a missing OFFLINE_ENV
    // pushes every add to about 72 s. So a slow add is tried once more.
    if (r.ms > SETTINGS.timeouts.addFailMs)
      r = await addItem(dir, names, this.registryUrl);
    if (r.ms > SETTINGS.timeouts.addFailMs)
      throw new Error(
        `cost: ${key}: add took ${Math.round(r.ms)} ms, over ${SETTINGS.timeouts.addFailMs}. Every CLI run needs OFFLINE_ENV (scripts/cost/build.ts): a closed registry port and npm_config_fetch_retries=0.`,
      );
    const pkg = path.join(dir, "package.json");
    const original = path.join(APP_DIR, "package.json");
    const extra = [...listed(pkg)].filter((n) => !listed(original).has(n));
    if (extra.length)
      throw new Error(
        `cost: ${key}: the add named ${extra.join(", ")}, which the cost app does not list. Add it to scripts/cost/app/package.json at the version bun.lock resolves, and update its lock.`,
      );
    cpSync(original, pkg);
    return r;
  }

  /** Builds one app: an item, a case `<item>.<case>`, a block, or one of the harness's. */
  async build(
    key: string,
    options: { kind?: AppKind; folder?: string } = {},
  ): Promise<Built> {
    const [item, kase] = key.split(".") as [string, string | undefined];
    const items = servedItems();
    const kind: AppKind =
      options.kind ??
      (kase
        ? "case"
        : items.get(item)?.type === "registry:block"
          ? "block"
          : "item");
    const dir = path.join(this.work, "apps", options.folder ?? key);
    copyApp(
      kind === "empty" ? this.base : this.template,
      dir,
      this.nodeModules,
    );
    const routes = path.join(dir, "src", "routes");
    const write = (file: string, text: string) =>
      writeFileSync(path.join(routes, file), text);
    let add: Built["add"] = null;
    let route = "/";
    if (kind === "item" || kind === "case" || kind === "block")
      add = await this.add(dir, [item], key);
    if (kind === "catalogue") add = await this.add(dir, catalogueItems(), key);
    switch (kind) {
      case "empty":
      case "themeFloor":
        write("+page.svelte", fixture("_theme-floor"));
        break;
      case "floor":
        write("floor.svelte", fixture("_floor"));
        write("+page.svelte", wrapper(["floor.svelte"]));
        break;
      case "calibrate":
        write("floor.svelte", fixture("_floor"));
        write("fixture.svelte", fixture("_calibrate"));
        write("+page.svelte", wrapper(["floor.svelte", "fixture.svelte"]));
        break;
      case "item":
      case "case":
        if (item === UTILS) {
          // utils' base is the theme floor: its page is its fixture alone.
          write("+page.svelte", fixture(key));
          break;
        }
        write("floor.svelte", fixture("_floor"));
        write("fixture.svelte", fixture(key));
        write("+page.svelte", wrapper(["floor.svelte", "fixture.svelte"]));
        break;
      case "block":
        write("floor.svelte", fixture("_floor"));
        write("+page.svelte", wrapper(["floor.svelte"]));
        route = routeOf(item);
        break;
      case "catalogue": {
        write("floor.svelte", fixture("_floor"));
        const parts = ["floor.svelte"];
        for (const name of catalogueItems()) {
          write(`fixture-${name}.svelte`, fixture(name));
          parts.push(`fixture-${name}.svelte`);
        }
        write("+page.svelte", wrapper(parts));
        break;
      }
    }
    const modulesFile = path.join(
      this.work,
      "modules",
      `${options.folder ?? key}.json`,
    );
    mkdirSync(path.dirname(modulesFile), { recursive: true });
    const t = performance.now();
    const built = await run(bin(dir, "vite", "build"), dir, {
      COST_MODULES: modulesFile,
    });
    const buildMs = performance.now() - t;
    if (built.code !== 0)
      throw new Error(`cost: ${key}: vite build failed\n${built.output}`);
    return {
      key,
      kind,
      dir,
      route,
      add,
      sizes: sizesOf(dir, route),
      modules: JSON.parse(readFileSync(modulesFile, "utf8")),
      buildMs,
    };
  }

  async close() {
    this.stopRegistry();
  }
}

/** Runs `tasks` with at most `limit` at once, keeping their order. */
export async function pool<T, R>(
  tasks: T[],
  limit: number,
  fn: (task: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(tasks.length);
  let next = 0;
  const worker = async () => {
    while (next < tasks.length) {
      const i = next++;
      out[i] = await fn(tasks[i]!);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, tasks.length) }, worker),
  );
  return out;
}

/** The node_modules package a module id comes from, or null. */
function packageOf(id: string): string | null {
  const m = id.match(/.*\/node_modules\/((?:@[^/]+\/)?[^/]+)\//);
  return m ? m[1]! : null;
}

/** The path under the app's `src/` a module id names, or null. */
function sourceOf(id: string): string | null {
  const clean = id.split("?")[0]!;
  const at = clean.lastIndexOf("/src/");
  return at === -1 || clean.includes("/node_modules/")
    ? null
    : clean.slice(at + 1);
}

/** Every item file's path in an app (`src/lib/…`, `src/routes/…`), to its item. */
function fileOwners(): Map<string, string> {
  const out = new Map<string, string>();
  for (const item of servedItems().values())
    for (const f of item.files ?? []) {
      const target = placeOf(f);
      const at =
        f.type === "registry:ui"
          ? `src/lib/components/ui/${target}`
          : f.type === "registry:hook"
            ? `src/lib/hooks/${target}`
            : f.type === "registry:lib"
              ? `src/lib/${target}`
              : f.type === "registry:component"
                ? `src/lib/components/${target}`
                : f.type === "registry:page"
                  ? `src/routes/${target}`
                  : null;
      if (at) out.set(at, item.name);
    }
  return out;
}

const RUNTIME = new Set(["svelte", "@sveltejs/kit", "devalue"]);

/** Rendered bytes of an app's initial chunks, by breakdown source. */
function renderedBySource(
  name: string,
  app: Built,
  owners: Map<string, string>,
): Map<string, number> {
  const initial = new Set(app.sizes.initial);
  const out = new Map<string, number>();
  for (const [chunk, modules] of Object.entries(app.modules)) {
    if (!initial.has(chunk)) continue;
    for (const [id, length] of Object.entries(modules)) {
      let source = "runtime";
      const pkg = packageOf(id);
      const src = sourceOf(id);
      if (pkg) {
        if (name === UTILS && pkg === "cn") source = "own";
        else if (!RUNTIME.has(pkg)) source = `package:${pkg}`;
      } else if (src) {
        const owner = owners.get(src);
        if (owner) source = owner === name ? "own" : `item:${owner}`;
        else if (
          src.startsWith("src/routes/") &&
          src !== "src/routes/floor.svelte" &&
          src !== "src/routes/+layout.svelte"
        )
          source = "own";
      }
      out.set(source, (out.get(source) ?? 0) + length);
    }
  }
  return out;
}

/**
 * Decision 7: an item's initial JS by source. Each source's rendered bytes
 * over its base's are apportioned the alone gzipped total, by share, with
 * the remainder going to the largest fractions, so the groups sum to it.
 */
export function breakdownOf(
  name: string,
  app: Built,
  base: Built,
  aloneJs: number,
): { source: string; js: number }[] {
  const owners = fileOwners();
  const mine = renderedBySource(name, app, owners);
  const theirs = renderedBySource(name, base, owners);
  const deltas = [...mine]
    .map(([source, n]) => ({ source, d: n - (theirs.get(source) ?? 0) }))
    .filter((g) => g.d > 0);
  const total = deltas.reduce((a, g) => a + g.d, 0);
  if (aloneJs <= 0 || total === 0) return [{ source: "runtime", js: aloneJs }];
  const shares = deltas.map((g) => {
    const exact = (aloneJs * g.d) / total;
    return { source: g.source, js: Math.floor(exact), rest: exact % 1 };
  });
  let left = aloneJs - shares.reduce((a, g) => a + g.js, 0);
  for (const g of [...shares].sort((a, b) => b.rest - a.rest)) {
    if (left <= 0) break;
    g.js++;
    left--;
  }
  return shares
    .filter((g) => g.js > 0)
    .map(({ source, js }) => ({ source, js }))
    .sort((a, b) => b.js - a.js || a.source.localeCompare(b.source));
}

/** The theme floor's font bytes, by font item: each font's files by its family's name. */
export function fontsByItem(sizes: Sizes): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of servedItems().values()) {
    const pkg = item.font?.dependency;
    if (!pkg) continue;
    const family = pkg.split("/").pop()!;
    out[item.name] = Object.entries(sizes.fonts)
      .filter(([f]) => path.basename(f).startsWith(`${family}-`))
      .reduce((a, [, n]) => a + n, 0);
  }
  return out;
}
