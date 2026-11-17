/**
 * 024i: an all-digit commit hash is still a commit. The footer's commit is
 * SvelteKit's version name, made in `vite.config.ts`. The readers (the
 * app-shell and product-home blocks, the site's footer) take an all-digit
 * name for SvelteKit's default, a timestamp, and show no commit. So the name
 * must never be all digits.
 *
 * Each source's own lines are run: the name this repository's
 * `vite.config.ts` makes, and the name the app-shell page's snippet makes,
 * with the host's variable and git stubbed. Then the blocks' own reader line
 * reads it.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

/** A real commit of this repository whose short hash is all digits. */
const DIGITS = "648273658dc01aabe929905e3020106f23d2214f";
const LETTERED = "db8fb65a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f";
/** The full hash at worst: no letter in 40 characters. */
const ALL = "1234567890".repeat(4);

const config = readFileSync("vite.config.ts", "utf8");
const page = readFileSync(
  "src/routes/(site)/components/app-shell/+page.svelte",
  "utf8",
);
const snippet = (() => {
  const start = page.indexOf(
    '{`import { execSync } from "node:child_process";',
  );
  const end = page.indexOf("`}</code", start);
  // The text the page shows: the template literal, evaluated, so `\\d` is `\d`.
  return new Function(`return \`${page.slice(start + 2, end)}\`;`)() as string;
})();

/** Short hashes as `git rev-parse --short HEAD` prints them in a small repository. */
const short = (sha: string) => sha.slice(0, 7);

/**
 * Runs a source's `commitName` helper, if it has one, and its `const name`
 * statement, with `process.env` and `git` stubbed.
 */
function nameFrom(
  source: string,
  env: Record<string, string | undefined>,
  head: string | undefined,
): string | undefined {
  const helper = /\nfunction commitName\([\s\S]*?\n\}\n/.exec(source)?.[0];
  const statement = /\nconst name =[\s\S]*?;\n/.exec(source)?.[0];
  expect(statement, "a `const name =` statement").toBeDefined();
  const js = new Bun.Transpiler({ loader: "ts" }).transformSync(
    `export function run(process, git) {${helper ?? ""}${statement}return name;}`,
  );
  const body = js.replace(/^export /m, "").replace(/;\s*$/, "");
  const run = new Function(`${body}; return run;`)() as (
    p: { env: Record<string, string | undefined> },
    g: (args: string) => string | undefined,
  ) => string | undefined;
  return run({ env }, (args) => {
    if (head === undefined) return undefined;
    if (args === "rev-parse HEAD") return head;
    if (args === "rev-parse --short HEAD") return short(head);
    throw new Error(`unexpected git ${args}`);
  });
}

/** The blocks' reader, as each ships it. */
const readers = [
  "src/lib/registry/blocks/app-shell/+layout.svelte",
  "src/lib/registry/blocks/product-home/+page.svelte",
].map((file) => {
  const line =
    /commit: (\/\^\\d\+\$\/\.test\(version\) \? undefined : version),/.exec(
      readFileSync(file, "utf8"),
    )?.[1];
  return {
    file,
    line,
    read: new Function("version", `return ${line};`) as (
      v: string,
    ) => string | undefined,
  };
});

describe("024i: an all-digit commit hash is still a commit", () => {
  test("both blocks read an all-digit version as no commit", () => {
    for (const r of readers) expect(r.line, r.file).toBeDefined();
  });

  for (const [label, source] of [
    ["vite.config.ts", config],
    ["the app-shell page's snippet", snippet],
  ] as const) {
    describe(label, () => {
      test("6482736, from git or from the host, is shown as a commit that starts 6482736", () => {
        for (const name of [
          nameFrom(source, {}, DIGITS),
          nameFrom(source, { WORKERS_CI_COMMIT_SHA: DIGITS }, undefined),
        ]) {
          expect(name).toBeDefined();
          expect(name!.startsWith("6482736")).toBe(true);
          for (const r of readers) expect(r.read(name!), r.file).toBe(name);
        }
      });

      test("takes characters until one is a letter: 648273658d", () => {
        expect(nameFrom(source, {}, DIGITS)).toBe("648273658d");
      });

      test("a hash with a letter in its first 7 keeps 7: db8fb65", () => {
        expect(nameFrom(source, {}, LETTERED)).toBe("db8fb65");
        expect(
          nameFrom(source, { WORKERS_CI_COMMIT_SHA: LETTERED }, DIGITS),
        ).toBe("db8fb65");
      });

      test("the host's variable wins over git", () => {
        expect(
          nameFrom(source, { WORKERS_CI_COMMIT_SHA: DIGITS }, LETTERED),
        ).toBe("648273658d");
      });

      test("the full hash at worst", () => {
        expect(nameFrom(source, {}, ALL)).toBe(ALL);
      });

      test("with no git and no variable, or an empty one, no name: SvelteKit's default, which the blocks read as no commit", () => {
        expect(nameFrom(source, {}, undefined)).toBeUndefined();
        expect(
          nameFrom(source, { WORKERS_CI_COMMIT_SHA: "" }, undefined),
        ).toBeFalsy();
        const timestamp = String(Date.UTC(2026, 10, 17));
        for (const r of readers)
          expect(r.read(timestamp), r.file).toBeUndefined();
      });
    });
  }
});
