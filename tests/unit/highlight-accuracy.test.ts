import { describe, expect, test } from "bun:test";
import {
  expected,
  fixture,
  percent,
  scoreSet,
  codeOf,
  type Score,
} from "../helpers/accuracy.ts";

/**
 * 013 decision 19 and criteria 4 and 5: accuracy against the hand-labelled
 * reference, converted to roles. The bars are INFERRED targets, confirmed or
 * reset at checkpoint 1 before the held-out set is first scored.
 */

/** The three languages Shiki highlights among the specimens. */
const SHIKI = ["markdown", "diff", "sql"];
const BARS = {
  workbench: { all: 94.0, treeSitter: 95.0, each: 90.0 },
  heldout: { all: 92.0, treeSitter: 93.5, each: 85.0 },
  shiki: { markdown: 90.0, diff: 90.0, sql: 75.0 } as Record<string, number>,
};

function report(set: string, scores: Score[]) {
  console.log(
    `${set}: ${percent(scores).toFixed(1)}% overall; ${scores
      .map((s) => `${s.id} ${percent([s]).toFixed(1)}`)
      .join(", ")}`,
  );
}

describe("accuracy, the workbench set (criterion 4)", async () => {
  const scores = await scoreSet("workbench");
  report("workbench", scores);
  const treeSitter = scores.filter((s) => !SHIKI.includes(s.language));

  test("18 of 18 specimens scored, each SHA-256 matching the fixture's", () => {
    expect(scores).toHaveLength(18);
    expect(scores.filter((s) => s.shaMatches)).toHaveLength(18);
  });

  test("the specimens put every one of the 14 text roles on screen", () => {
    const roles = new Set<string>();
    for (const [id, s] of Object.entries(fixture.sets.workbench.specimens))
      for (const line of expected(codeOf("workbench", id), s.spans))
        for (const role of line) roles.add(role);
    expect(roles.size).toBe(14);
  });

  test(`overall at ${BARS.workbench.all}% or more`, () => {
    expect(percent(scores)).toBeGreaterThanOrEqual(BARS.workbench.all);
  });

  test(`the 15 tree-sitter languages at ${BARS.workbench.treeSitter}% or more, and each at ${BARS.workbench.each}% or more`, () => {
    expect(treeSitter).toHaveLength(15);
    expect(percent(treeSitter)).toBeGreaterThanOrEqual(
      BARS.workbench.treeSitter,
    );
    for (const s of treeSitter)
      expect(percent([s]), s.id).toBeGreaterThanOrEqual(BARS.workbench.each);
  });

  test("Markdown and diff at 90.0% or more, SQL at 75.0% or more (Shiki)", () => {
    for (const s of scores.filter((s) => SHIKI.includes(s.language)))
      expect(percent([s]), s.id).toBeGreaterThanOrEqual(BARS.shiki[s.id]!);
  });
});

/**
 * The held-out set, scored first by the design lead at checkpoint 1
 * (2026-11-15: 97.7%), and on every run since. `query-lock.json` records
 * any query change made after that, with both sets' figures.
 */
describe("accuracy, the held-out set (criterion 5)", async () => {
  const scores = await scoreSet("heldout");
  report("held-out", scores);
  const treeSitter = scores.filter((s) => !SHIKI.includes(s.language));

  test("10 of 10 scored, each SHA-256 matching", () => {
    expect(scores).toHaveLength(10);
    expect(scores.filter((s) => s.shaMatches)).toHaveLength(10);
  });

  test(`overall at ${BARS.heldout.all}% or more; the 9 tree-sitter languages at ${BARS.heldout.treeSitter}% or more; each at ${BARS.heldout.each}% or more`, () => {
    expect(percent(scores)).toBeGreaterThanOrEqual(BARS.heldout.all);
    expect(treeSitter).toHaveLength(9);
    expect(percent(treeSitter)).toBeGreaterThanOrEqual(BARS.heldout.treeSitter);
    for (const s of treeSitter)
      expect(percent([s]), s.id).toBeGreaterThanOrEqual(BARS.heldout.each);
  });
});
