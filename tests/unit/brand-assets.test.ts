/**
 * 017 criteria 5 to 7: the six downloads, from `downloadSvg`'s output. No
 * test here reads build/; the built files are checked in build-output.spec.ts.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { readTokens, resolveColor, type Tokens } from "../../scripts/tokens.ts";
import {
  DOWNLOADS,
  downloadSvg,
  wordWidth,
} from "../../src/lib/site/brand/downloads.ts";

// The files draw at 100 units to the word's em: the word's origin at x 0, its
// baseline at y 0. The mark alone is drawn at 100 units to its own em.
const EM = 100;

const tokens = readTokens();
const fixture = JSON.parse(
  readFileSync("tests/fixtures/lockup-word-width.json", "utf8"),
) as { px: number; width: number };

type Circle = { cx: number; cy: number; r: number; fill: string };
function circles(svg: string): Circle[] {
  return [...svg.matchAll(/<circle ([^>]*)\/>/g)].map((m) => {
    const a = (n: string) => m[1].match(new RegExp(`${n}="([^"]+)"`))![1];
    return { cx: +a("cx"), cy: +a("cy"), r: +a("r"), fill: a("fill") };
  });
}
function paths(svg: string): { fill: string }[] {
  return [...svg.matchAll(/<path ([^>]*)\/>/g)].map((m) => ({
    fill: m[1].match(/fill="([^"]+)"/)![1],
  }));
}

describe("017 criterion 5: the downloads exist", () => {
  test("6 files: the mark and the lockup, in colour, paper and ink", () => {
    expect(DOWNLOADS.map((d) => d.file)).toEqual([
      "pluto-mark-colour.svg",
      "pluto-mark-paper.svg",
      "pluto-mark-ink.svg",
      "pluto-lockup-colour.svg",
      "pluto-lockup-paper.svg",
      "pluto-lockup-ink.svg",
    ]);
  });

  test.each(DOWNLOADS.map((d) => d.file))(
    "%s parses as SVG with its title, role and viewBox, in at most 4 kB",
    async (file) => {
      const svg = await downloadSvg(tokens, file);
      expect(svg).toStartWith('<svg xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toEndWith("</svg>\n");
      expect(svg).toContain("<title>Pluto Systems</title>");
      expect(svg).toContain('role="img"');
      expect(svg).toMatch(/viewBox="[\d. -]+"/);
      expect(new TextEncoder().encode(svg).length).toBeLessThanOrEqual(4096);
      // Well formed: every element closes.
      const open = (svg.match(/<(svg|title|g)\b/g) ?? []).length;
      const close = (svg.match(/<\/(svg|title|g)>/g) ?? []).length;
      expect(open).toBe(close);
    },
  );
});

describe("017 criterion 6: the downloads are drawn from the tokens", () => {
  const ink = tokens.primitives.ink;
  const paper = tokens.primitives.paper;
  const marks = ["mark-1", "mark-2", "mark-3", "mark-4"].map((m) =>
    resolveColor(tokens, "light", m),
  );

  function expectGeometry(cs: Circle[], unit: number, x0: number, y0: number) {
    const { dot, gap } = tokens.mark;
    expect(cs).toHaveLength(4);
    const want = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ].map(([i, j]) => ({
      cx: x0 + (dot / 2 + i * (dot + gap)) * unit,
      cy: y0 + (dot / 2 + j * (dot + gap)) * unit,
    }));
    cs.forEach((c, k) => {
      expect(Math.abs(c.r * 2 - dot * unit)).toBeLessThanOrEqual(0.01 * unit);
      expect(Math.abs(c.cx - want[k].cx)).toBeLessThanOrEqual(0.01 * unit);
      expect(Math.abs(c.cy - want[k].cy)).toBeLessThanOrEqual(0.01 * unit);
    });
  }

  test.each(DOWNLOADS)(
    "$file: 4 dots at the mark's geometry, filled as its colourway says",
    async (d) => {
      const svg = await downloadSvg(tokens, d.file);
      const cs = circles(svg);
      const { dot, gap, rise, lockupGap, lockupScale } = tokens.mark;
      if (d.kind === "mark") expectGeometry(cs, EM, 0, 0);
      else
        expectGeometry(
          cs,
          EM * lockupScale,
          (await wordWidth(tokens, EM)) + lockupGap * EM,
          -(rise + 2 * dot + gap) * lockupScale * EM,
        );
      const fills = cs.map((c) => c.fill.toUpperCase());
      if (d.colourway === "colour")
        expect(fills).toEqual(marks.map((m) => m.toUpperCase()));
      else
        expect(fills).toEqual(
          Array(4).fill((d.colourway === "paper" ? paper : ink).toUpperCase()),
        );
    },
  );

  test.each(DOWNLOADS.filter((d) => d.kind === "lockup"))(
    "$file: 1 path for the word, filled ink or paper",
    async (d) => {
      const ps = paths(await downloadSvg(tokens, d.file));
      expect(ps).toHaveLength(1);
      expect(ps[0].fill.toUpperCase()).toBe(
        (d.colourway === "paper" ? paper : ink).toUpperCase(),
      );
    },
  );

  test("changing mark.dot in a copy of the token file changes the circles", async () => {
    const copy = structuredClone(tokens) as Tokens;
    copy.mark.dot = 0.4;
    const before = circles(await downloadSvg(tokens, "pluto-mark-colour.svg"));
    const after = circles(await downloadSvg(copy, "pluto-mark-colour.svg"));
    expect(after[0].r).not.toBe(before[0].r);
    expect(after[0].r * 2).toBeCloseTo(0.4 * EM, 2);
  });
});

describe("017 criterion 7: the outline matches the lockup", () => {
  test("the outlined word's width at 100 px is within 1% of the committed fixture", async () => {
    expect(fixture.px).toBe(100);
    const w = await wordWidth(tokens, 100);
    expect(Math.abs(w - fixture.width) / fixture.width).toBeLessThanOrEqual(
      0.01,
    );
  });
});
