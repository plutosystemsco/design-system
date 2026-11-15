import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  convertFromFiles,
  FIXTURE_PATH,
  HAND_PATH,
  mechanicalRole,
  ROWS,
  serialise,
  type HandEntry,
} from "../../scripts/convert-reference.ts";

/**
 * 013 decision 19 and criterion 17: the fixture is provably the reference
 * plus the hand list, and the hand list cites decision 13 for every change.
 */
const conversion = await convertFromFiles();
const hand = JSON.parse(readFileSync(HAND_PATH, "utf8")) as {
  entries: HandEntry[];
};
const fixture = JSON.parse(readFileSync(FIXTURE_PATH, "utf8"));

describe("the converted reference", () => {
  test("the converter runs with 0 errors", () => {
    expect(conversion.errors).toEqual([]);
  });

  test("a re-run gives a byte-identical fixture", async () => {
    expect(await serialise(conversion.fixture)).toBe(
      readFileSync(FIXTURE_PATH, "utf8"),
    );
  });

  test("holds 18 workbench specimens and 10 held-out samples, each with its code SHA-256, and the source's and the hand list's SHA-256", () => {
    expect(Object.keys(fixture.sets.workbench.specimens)).toHaveLength(18);
    expect(Object.keys(fixture.sets.heldout.specimens)).toHaveLength(10);
    const sha = (text: string) =>
      new Bun.CryptoHasher("sha256").update(text).digest("hex");
    expect(fixture.source.sha256).toBe(
      sha(readFileSync(fixture.source.path, "utf8")),
    );
    expect(fixture.hand.sha256).toBe(sha(readFileSync(HAND_PATH, "utf8")));
    for (const set of ["workbench", "heldout"])
      for (const specimen of Object.values(fixture.sets[set].specimens) as {
        sha256: string;
      }[])
        expect(specimen.sha256).toMatch(/^[0-9a-f]{64}$/);
  });

  test("every (language, old slot) pair present in either set is covered by the map or by the hand list", () => {
    const uncovered = [...conversion.pairs]
      .filter(([, texts]) =>
        [...texts.values()].some((rules) => rules.has("UNCOVERED")),
      )
      .map(([pair]) => pair);
    expect(uncovered).toEqual([]);
    // The pairs the map leaves to the hand list are covered by it alone.
    for (const pair of [
      "css property",
      "css tag",
      "html property",
      "html tag",
      "svelte property",
      "svelte tag",
      "tsx property",
      "tsx tag",
      "yaml property",
    ]) {
      const [language, slot] = pair.split(" ") as [string, string];
      expect(mechanicalRole(language, slot), pair).toBeNull();
      expect(conversion.pairs.has(pair), pair).toBe(true);
    }
  });

  test("every hand change cites a row of decision 13, and the text it names", () => {
    expect(hand.entries.length).toBeGreaterThan(0);
    for (const entry of hand.entries) {
      expect(Object.keys(ROWS), JSON.stringify(entry)).toContain(entry.row);
      expect(entry.text.length, JSON.stringify(entry)).toBe(
        entry.end - entry.start,
      );
    }
  });

  // Decision 13's two known losses move no label (decision 19, rule 3).
  test("0 known-loss rows applied: the held-out C# Console stays type, and no hand entry cites a known loss", () => {
    expect(Object.keys(ROWS).filter((row) => /known|loss/.test(row))).toEqual(
      [],
    );
    const code = (readFileSync("src/lib/preview/code-samples.ts", "utf8").match(
      /namespace Sandbox;[\s\S]*?Console\.WriteLine/,
    ) ?? [""])[0];
    expect(code).not.toBe("");
    const spans = fixture.sets.heldout.specimens.csharp.spans as [
      number,
      number,
      number,
      string,
    ][];
    const consoleSpan = spans.find(
      ([line, start]) => line === 14 && start === 0,
    );
    expect(consoleSpan).toEqual([14, 0, 7, "type"]);
    expect(
      hand.entries.filter(
        (e) => e.specimen === "csharp" && e.text === "Console",
      ),
    ).toEqual([]);
  });

  test("the hand list's count per specimen, printed", () => {
    const counts: Record<string, number> = {};
    for (const e of hand.entries)
      counts[`${e.set} ${e.specimen}`] =
        (counts[`${e.set} ${e.specimen}`] ?? 0) + 1;
    console.log(
      `hand list: ${hand.entries.length} entries; ${Object.entries(counts)
        .map(([k, v]) => `${k} ${v}`)
        .join(", ")}`,
    );
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(
      hand.entries.length,
    );
  });
});
