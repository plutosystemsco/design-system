/**
 * 020a: the site's CSS reads only code. Tailwind's automatic detection scans
 * every file git tracks, so class names written in `context/`'s prose and
 * exhibits, and in `tests/`' fixtures and assertions, became rules in the
 * site's built CSS. The site's root stylesheet excludes both folders.
 *
 * Tailwind's own scanner (`@tailwindcss/oxide`'s `Scanner`) reads the sources
 * the root layout's stylesheet declares, as `@tailwindcss/vite` does; then
 * `compile(css).build(candidates)` builds the CSS from them.
 */
import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { __unstable__loadDesignSystem, compile } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";
import { generateTokenOutputs } from "../../scripts/build-tokens.ts";

const REPO = path.resolve(import.meta.dir, "../..");
const ROOT_LAYOUT = "src/routes/+layout.svelte";
const EXCLUDED = ["context", "tests"] as const;
const FIXTURES = "tests/unit/fixtures/css-sources";

type Source = { base: string; pattern: string; negated: boolean };

/** The stylesheet the root layout imports, relative to the repository. */
function rootStylesheet(): string {
  const layout = readFileSync(path.join(REPO, ROOT_LAYOUT), "utf8");
  const imports = [...layout.matchAll(/import\s+"([^"]+\.css)";/g)].map(
    (m) => m[1],
  );
  expect(imports).toHaveLength(1);
  return path.relative(
    REPO,
    path.resolve(path.dirname(path.join(REPO, ROOT_LAYOUT)), imports[0]),
  );
}

/** A stylesheet's compiler and its sources, as `@tailwindcss/vite` reads them. */
async function compiled(file: string) {
  const full = path.join(REPO, file);
  const css = readFileSync(full, "utf8");
  const options = { base: path.dirname(full), onDependency: () => {} };
  const compiler = await compile(css, options);
  // `@tailwindcss/vite` 4.3.3: no `source()` means the project root, `**/*`.
  const root: Source[] =
    compiler.root === "none"
      ? []
      : compiler.root === null
        ? [{ base: REPO, pattern: "**/*", negated: false }]
        : [{ ...compiler.root, negated: false }];
  return {
    compiler,
    sources: [...root, ...compiler.sources],
    design: await __unstable__loadDesignSystem(css, { base: options.base }),
  };
}

const scan = (sources: Source[]) => new Set(new Scanner({ sources }).scan());
const all = (dir: string): Source[] => [
  { base: path.join(REPO, dir), pattern: "**/*", negated: false },
];
const not = (dir: string): Source => ({
  base: path.join(REPO, dir),
  pattern: "**/*",
  negated: true,
});

type Compiled = Awaited<ReturnType<typeof compiled>>;

/**
 * The classes a stylesheet's sources yield that make a rule, and that appear
 * in `dir` but in no file outside `context/` and `tests/`.
 */
function onlyIn(sheet: Compiled, dir: string): string[] {
  const read = scan(sheet.sources);
  const code = scan([...sheet.sources, ...EXCLUDED.map(not)]);
  const candidates = [...scan(all(dir))]
    .filter((c) => read.has(c) && !code.has(c))
    .sort();
  const css = sheet.design.candidatesToCss(candidates);
  return candidates.filter((_, i) => css[i] !== null);
}

let site: Compiled;
let unexcluded: Compiled;
let file: string;

beforeAll(async () => {
  file = rootStylesheet();
  site = await compiled(file);
  // `src/app.css` alone, with Tailwind's automatic detection unbounded.
  unexcluded = await compiled("src/app.css");
});

describe("020a: the site's CSS reads only code", () => {
  // The fixtures copy a line of a review under context/ and four lines of a
  // test under tests/. Read through src/app.css alone, whose detection is
  // unbounded, the check names their classes; so it reads the right sources.
  test("the fixtures prove the check reads the right sources", () => {
    expect(onlyIn(unexcluded, FIXTURES)).toEqual(
      expect.arrayContaining([
        "bg-fuchsia-950",
        "inset-shadow-red-500",
        "row-15",
        "row-8",
        "text-shadow-black",
      ]),
    );
  });

  test.each([...EXCLUDED])(
    "no class in the site's CSS is found only under %s/",
    (dir) => {
      expect(onlyIn(site, dir)).toEqual([]);
    },
  );

  test("the site's CSS equals the CSS built from code alone", async () => {
    const code = await compiled(file);
    const codeCandidates = scan([...code.sources, ...EXCLUDED.map(not)]);
    const built = site.compiler.build([...scan(site.sources)]);
    // A boolean, not a diff of two whole stylesheets: the two tests above
    // name the classes that differ.
    expect(built === code.compiler.build([...codeCandidates])).toBe(true);
  });

  test('the root stylesheet holds @source not "../../context" and "../../tests"', () => {
    const css = readFileSync(path.join(REPO, file), "utf8");
    // Without these two lines, Tailwind builds rules from the class names
    // in specs, research exhibits and tests (020's change review, finding 8).
    expect(css.match(/^@source .*$/gm) ?? []).toEqual(
      expect.arrayContaining([
        '@source not "../../context";',
        '@source not "../../tests";',
      ]),
    );
  });

  test("src/app.css, the theme an app installs, is byte-equal to build-tokens' output", async () => {
    const { appCss } = await generateTokenOutputs(REPO);
    expect(readFileSync(path.join(REPO, "src/app.css"), "utf8")).toBe(appCss);
  });
});
