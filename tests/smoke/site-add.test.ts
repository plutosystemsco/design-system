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
    const host = new URL(SITE_ORIGIN).host;
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

// 017 criterion 12: the install guide's own blocks, run. The page's code is
// read from its built Markdown twin, in order. Four substitutions, and no
// more: the locked CLI for `bunx --bun shadcn-svelte@1.7.1`, a local server
// for SITE_ORIGIN, a scratch copy of kit3 for the app-creation step, and the
// page's two file blocks written where `init` would write them. A second run
// on kit2 applies the page's SvelteKit 2 sentence as well.
describe("017 criterion 12: the install guide is true", () => {
  const CLI_SHOWN = "bunx --bun shadcn-svelte@1.7.1";
  const CLI_LOCKED = `${process.execPath} --bun ${REPO}/node_modules/.bin/shadcn-svelte`;
  const guide = path.join(scratch, "guide");
  let local = "";
  let guideServer: ReturnType<typeof Bun.serve> | undefined;
  type Block = { lang: string; code: string };
  let blocks: Block[] = [];
  const runs: Record<
    string,
    {
      /** What the run wrote and ran, read back: the imports block in package.json, components.json, and each command given to the shell. */
      ran: { imports: unknown; components: string; commands: string[] };
      adds: Result[];
      written: string[];
      build: Result;
      check: Result;
      app: string;
    }
  > = {};

  /** The page's blocks, as its twin fences them. */
  function readBlocks(): Block[] {
    const md = readFileSync(path.join(BUILD, "start/install/index.md"), "utf8");
    return [...md.matchAll(/^```(\w*)\n([\s\S]*?)\n```$/gm)].map((m) => ({
      lang: m[1],
      code: m[2],
    }));
  }

  /** The files the page says `add button` writes. */
  function listed(): string[] {
    const html = readFileSync(
      path.join(BUILD, "start/install/index.html"),
      "utf8",
    );
    const list =
      /<ul[^>]*data-files="button"[^>]*>([\s\S]*?)<\/ul>/.exec(html)?.[1] ?? "";
    return [...list.matchAll(/<li[^>]*>([^<]+)<\/li>/g)].map((m) =>
      m[1].trim(),
    );
  }

  const sub = (code: string) =>
    code.replaceAll(CLI_SHOWN, CLI_LOCKED).replaceAll(SITE_ORIGIN, local);

  async function guideRun(kit: "kit3" | "kit2") {
    const app = path.join(guide, kit);
    cpSync(path.join(REPO, "tests", "smoke", "fixtures", kit), app, {
      recursive: true,
      filter: (src) =>
        !/[\\/](node_modules|\.svelte-kit|build)([\\/]|$)/.test(src),
    });
    const [, imports, components, , ...adds] = blocks;
    // The page's SvelteKit 2 sentence: #lib read as $lib, no imports block.
    const kit2 = (code: string) =>
      kit === "kit2" ? code.replaceAll("#lib", "$lib") : code;
    if (kit === "kit3") {
      const pkg = JSON.parse(
        readFileSync(path.join(app, "package.json"), "utf8"),
      );
      pkg.imports = JSON.parse(`{${imports.code}}`).imports;
      await Bun.write(
        path.join(app, "package.json"),
        JSON.stringify(pkg, null, 2) + "\n",
      );
    }
    await Bun.write(
      path.join(app, "components.json"),
      kit2(sub(components.code)) + "\n",
    );
    const install = await run(
      [process.execPath, "install", "--frozen-lockfile"],
      app,
    );
    if (install.code !== 0)
      throw new Error(`bun install failed:\n${install.output}`);
    await run(bin(app, "svelte-kit", "sync"), app);
    const ran = {
      imports: JSON.parse(readFileSync(path.join(app, "package.json"), "utf8"))
        .imports,
      components: readFileSync(path.join(app, "components.json"), "utf8"),
      commands: [] as string[],
    };
    const results: Result[] = [];
    let before = new Set<string>();
    for (const a of adds) {
      before = new Set(files(app));
      const command = sub(a.code);
      ran.commands.push(command);
      results.push(await run(["sh", "-c", command], app));
    }
    const written = files(app).filter((f) => !before.has(f));
    runs[kit] = {
      ran,
      app,
      adds: results,
      written,
      build: await run(bin(app, "vite", "build"), app),
      check: await run(
        bin(
          app,
          "svelte-check",
          "--tsconfig",
          "./tsconfig.json",
          "--output",
          "machine",
        ),
        app,
      ),
    };
  }

  beforeAll(async () => {
    blocks = readBlocks();
    guideServer = Bun.serve({
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
    local = `http://localhost:${guideServer.port}`;
    await guideRun("kit3");
    await guideRun("kit2");
    guideServer.stop(true);
  }, 590_000);

  afterAll(() => guideServer?.stop(true));

  test("the page shows six blocks, in order: create, imports, components.json, init, add the theme, add the button", async () => {
    const { ADD_BUTTON, ADD_THEME, COMPONENTS, CREATE, IMPORTS, INIT } =
      await import("../../src/lib/site/start/install.ts");
    expect(blocks.map((b) => b.code)).toEqual([
      CREATE,
      IMPORTS,
      COMPONENTS,
      INIT,
      ADD_THEME,
      ADD_BUTTON,
    ]);
    expect(blocks.map((b) => b.lang)).toEqual([
      "bash",
      "json",
      "json",
      "bash",
      "bash",
      "bash",
    ]);
  });

  // The page's blocks with the four substitutions, and for kit2 the page's
  // SvelteKit 2 sentence, applied here and nowhere else: what each run
  // wrote and ran must equal them, so any fifth difference fails.
  for (const kit of ["kit3", "kit2"] as const) {
    test(`${kit}: after the named substitutions, what the run wrote and ran equals the page's blocks`, () => {
      const [create, imports, components, init, ...adds] = blocks;
      expect(create.code).toContain("sv create");
      expect(init.code).toBe(`${CLI_SHOWN} init`);
      const origin = (code: string) => code.replaceAll(SITE_ORIGIN, local);
      const want = {
        imports:
          kit === "kit3" ? JSON.parse(`{${imports.code}}`).imports : undefined,
        components:
          (kit === "kit3"
            ? origin(components.code)
            : origin(components.code).replaceAll("#lib", "$lib")) + "\n",
        commands: adds.map((a) =>
          origin(a.code.replaceAll(CLI_SHOWN, CLI_LOCKED)),
        ),
      };
      expect(runs[kit].ran).toEqual(want);
    });
  }

  for (const kit of ["kit3", "kit2"] as const) {
    test(`${kit}: each add exits 0, and the app's vite build and svelte-check pass with 0 errors`, () => {
      const r = runs[kit];
      for (const a of r.adds) expect(a.code, a.output).toBe(0);
      expect(r.build.code, r.build.output).toBe(0);
      expect(r.check.code, r.check.output).toBe(0);
      expect(r.check.output).toMatch(/COMPLETED .* 0 ERRORS/);
    });
  }

  test("kit3: the files the page says add button writes are the files written, under src/lib/, importing #lib", () => {
    const r = runs.kit3;
    const want = listed();
    expect(want.length).toBeGreaterThan(0);
    expect(r.written.filter((f) => f.startsWith("src/lib/")).sort()).toEqual(
      [...want].sort(),
    );
    for (const f of want) {
      const text = readFileSync(path.join(r.app, f), "utf8");
      expect(text, f).not.toContain("$lib");
      if (/from "[#$]lib/.test(text)) expect(text, f).toMatch(/from "#lib\//);
    }
  });
});
