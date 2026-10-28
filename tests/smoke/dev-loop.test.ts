/**
 * The dev loop (decision 23), on a temporary copy of this repository, so a
 * crash never leaves this repository's files modified.
 */
import { afterAll, beforeAll, expect, test } from "bun:test";
import {
  copyFileSync,
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
import { freePort, run, startDevServer, until, waitFor200 } from "./process.ts";

const REPO = process.cwd();
const scratch = mkdtempSync(path.join(tmpdir(), "pluto-dev-loop-"));
const copy = path.join(scratch, "repo");
const port = freePort();
const built = (file: string) =>
  path.join(copy, "static", "r", "styles", "maia", file);
let server: ReturnType<typeof startDevServer> | undefined;

beforeAll(async () => {
  // The files git does not ignore, committed or not.
  const listed = await run(
    ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    REPO,
  );
  if (listed.code !== 0) throw new Error(listed.output);
  for (const file of listed.output.split("\0").map((f) => f.trim())) {
    if (!file || !existsSync(path.join(REPO, file))) continue;
    mkdirSync(path.dirname(path.join(copy, file)), { recursive: true });
    copyFileSync(path.join(REPO, file), path.join(copy, file));
  }
  // node_modules links to this repository's packages, one link per entry, so
  // that what Kit generates there ($app) stays in the copy.
  mkdirSync(path.join(copy, "node_modules"));
  for (const entry of readdirSync(path.join(REPO, "node_modules"))) {
    if (entry === "$app" || entry === ".vite" || entry === ".cache") continue;
    symlinkSync(
      path.join(REPO, "node_modules", entry),
      path.join(copy, "node_modules", entry),
    );
  }
  server = startDevServer(copy, port, path.join(scratch, "vite-dev.log"));
  await waitFor200(
    `http://localhost:${port}/r/styles/maia/index.json`,
    60_000,
    server,
  );
}, 90_000);

afterAll(async () => {
  server?.kill();
  await server?.exited;
  rmSync(scratch, { recursive: true, force: true });
});

test("touching registry.json rewrites index.json within 10 s", async () => {
  const before = statSync(built("index.json")).mtimeMs;
  const file = path.join(copy, "registry.json");
  writeFileSync(file, readFileSync(file));
  expect(
    await until(() => statSync(built("index.json")).mtimeMs > before, 10_000),
  ).toBe(true);
}, 15_000);

test("a token change rewrites src/app.css and pluto-theme.json within 10 s", async () => {
  const css = () => readFileSync(path.join(copy, "src", "app.css"), "utf8");
  const theme = () => readFileSync(built("pluto-theme.json"), "utf8");
  const cssBefore = css();
  const themeBefore = theme();
  expect(cssBefore).toContain("--motion-micro: 200ms");

  const tokensFile = path.join(copy, "tokens", "pluto.tokens.json");
  const tokens = JSON.parse(readFileSync(tokensFile, "utf8"));
  tokens.motion.microMs = 250;
  writeFileSync(tokensFile, JSON.stringify(tokens, null, 2));

  expect(await until(() => css() !== cssBefore, 10_000)).toBe(true);
  expect(css()).toContain("--motion-micro: 250ms");
  expect(
    await until(
      () => theme() !== themeBefore && theme().includes("250ms"),
      10_000,
    ),
  ).toBe(true);
}, 25_000);
