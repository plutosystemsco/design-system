/**
 * 021 tests T7 and T8, and criterion 6: the DTCG source lowers to the object
 * the build read before 021, so every byte the build writes is unchanged.
 *
 * The fixtures under tests/fixtures/021-before/ were recorded at 020's
 * landing, before any 021 change. They are deleted by the first
 * specification that changes a token's value on purpose.
 */
import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { generateTokenOutputs } from "../../scripts/build-tokens.ts";
import * as tokensModule from "../../scripts/tokens.ts";
import { readTokens } from "../../scripts/tokens.ts";

const FIXTURES = "tests/fixtures/021-before";
const fixture = (name: string) =>
  readFileSync(path.join(FIXTURES, name), "utf8");
const sha = (text: string) => createHash("sha256").update(text).digest("hex");

describe("021 T7: the lowering returns today's object", () => {
  // Read in each test, so a lowering that throws fails the test that reads it.
  const lowered = () => readTokens() as unknown as Record<string, unknown>;

  test("readTokens(), less descriptions and expressiveDarkMarks, equals the fixture in structure and key order", () => {
    const tokens = lowered();
    const {
      descriptions: _descriptions,
      expressiveDarkMarks: _marks,
      ...rest
    } = tokens;
    expect(JSON.stringify(rest)).toBe(
      JSON.stringify(JSON.parse(fixture("tokens.json"))),
    );
  });

  test("its two new fields: expressiveDarkMarks, the lifted four; descriptions, of 61 roles and 16 slots", () => {
    const tokens = lowered();
    expect(tokens.expressiveDarkMarks).toEqual([
      "blue-lifted",
      "red-lifted",
      "yellow-lifted",
      "green-lifted",
    ]);
    const words = JSON.parse(fixture("words.json"));
    expect(tokens.descriptions).toEqual(words);
  });
});

describe("021 criterion 6: one lowering", () => {
  test("readTokens(root) and lowerTokens(files) return the same object", () => {
    const { lowerTokens, readTokenFiles } = tokensModule as unknown as {
      lowerTokens: (files: unknown) => unknown;
      readTokenFiles: (root?: string) => unknown;
    };
    expect(typeof lowerTokens).toBe("function");
    expect(typeof readTokenFiles).toBe("function");
    const root = process.cwd();
    expect(JSON.stringify(lowerTokens(readTokenFiles(root)))).toBe(
      JSON.stringify(readTokens(root)),
    );
  });

  test("readTokens takes the repository root, not a file", () => {
    expect(JSON.stringify(readTokens(process.cwd()))).toBe(
      JSON.stringify(readTokens()),
    );
  });
});

describe("021 T8: the built CSS is byte-identical", () => {
  const hashes = JSON.parse(fixture("hashes.json")) as Record<string, string>;
  const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
    items: { name: string }[];
  };
  const item = (name: string) =>
    JSON.stringify(
      registry.items.find((i) => i.name === name),
      null,
      2,
    );

  test("src/app.css and the published theme item hash as before", () => {
    expect(sha(readFileSync("src/app.css", "utf8"))).toBe(
      hashes["src/app.css"],
    );
    for (const file of [
      "static/r/styles/maia/kuiper-theme.json",
      "static/v0.13.0/r/styles/maia/kuiper-theme.json",
    ])
      expect(sha(readFileSync(file, "utf8")), file).toBe(hashes[file]);
  });

  test("the theme item and the three font items in registry.json hash as before", () => {
    for (const name of [
      "kuiper-theme",
      "font-geist",
      "font-heading-ibm-plex-sans",
      "font-jetbrains-mono",
    ])
      expect(sha(item(name)), name).toBe(hashes[`registry.json#${name}`]);
  });

  test("a fresh build equals the files on disk", async () => {
    const out = await generateTokenOutputs();
    expect(out.appCss).toBe(readFileSync("src/app.css", "utf8"));
    expect(out.registryJson).toBe(readFileSync("registry.json", "utf8"));
  });
});
