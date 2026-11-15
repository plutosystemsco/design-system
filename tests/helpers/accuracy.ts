/**
 * 013 decision 19: scores the highlighter against the converted reference,
 * the memo's way. Each specimen is highlighted with `highlightCode`, read as
 * one role per character, and compared with the fixture on every
 * non-whitespace character.
 */
import { readFileSync } from "node:fs";
import {
  CODE_ROLES,
  highlightCode,
  type CodeRole,
  type HighlightedLine,
} from "../../src/lib/registry/lib/highlighter.ts";
import { SPECIMENS } from "../fixtures/highlight/specimens.ts";
import { CODE_SAMPLES } from "../../src/lib/preview/code-samples.ts";

type Span = [line: number, start: number, end: number, role: CodeRole];
export type FixtureSet = {
  specimens: Record<
    string,
    { language: string; sha256: string; characters: number; spans: Span[] }
  >;
};
export const fixture = JSON.parse(
  readFileSync("tests/fixtures/highlight/roles.json", "utf8"),
) as { sets: { workbench: FixtureSet; heldout: FixtureSet } };

const sha256 = (text: string) =>
  new Bun.CryptoHasher("sha256").update(text).digest("hex");

/** The role a token's classes name. */
const BY_CLASS = new Map<string, CodeRole>(
  CODE_ROLES.filter((r) => r !== "text").map((r) => [`text-code-${r}`, r]),
);
export function roleOfClass(cls: string): CodeRole {
  for (const c of cls.split(/\s+/)) {
    const role = BY_CLASS.get(c);
    if (role) return role;
  }
  return "text";
}

/** One role per character of each line. */
export function grid(lines: HighlightedLine[]): CodeRole[][] {
  return lines.map((line) =>
    typeof line === "string"
      ? [...Array(line.length)].map(() => "text" as CodeRole)
      : line.flatMap((t) =>
          [...Array(t.content.length)].map(() => roleOfClass(t.class)),
        ),
  );
}

/** The fixture's role per character. */
export function expected(code: string, spans: Span[]): CodeRole[][] {
  const lines = code
    .split("\n")
    .map((l) => [...Array(l.length)].map(() => "text" as CodeRole));
  for (const [line, start, end, role] of spans)
    for (let c = start; c < end; c++) lines[line - 1]![c] = role;
  return lines;
}

export type Score = {
  id: string;
  language: string;
  scored: number;
  right: number;
  shaMatches: boolean;
  /** Each wrong character: line, column, the character, expected and got. */
  misses: [
    line: number,
    column: number,
    char: string,
    want: CodeRole,
    got: CodeRole,
  ][];
};

/** The code of each specimen in a set. */
export function codeOf(set: "workbench" | "heldout", id: string): string {
  if (set === "workbench") return SPECIMENS.find((s) => s.id === id)!.code;
  return CODE_SAMPLES.find((s) => s.language === id)!.code;
}

/** Scores one specimen. */
export async function scoreOne(
  set: "workbench" | "heldout",
  id: string,
): Promise<Score> {
  const specimen = fixture.sets[set].specimens[id]!;
  const code = codeOf(set, id);
  const lines =
    (await highlightCode(code, specimen.language)) ?? code.split("\n");
  const got = grid(lines);
  const want = expected(code, specimen.spans);
  const text = code.split("\n");
  let scored = 0;
  let right = 0;
  const misses: Score["misses"] = [];
  text.forEach((line, l) => {
    for (let c = 0; c < line.length; c++) {
      if (/\s/.test(line[c]!)) continue;
      scored++;
      const w = want[l]![c]!;
      const g = got[l]?.[c] ?? "text";
      if (w === g) right++;
      else misses.push([l + 1, c, line[c]!, w, g]);
    }
  });
  return {
    id,
    language: specimen.language,
    scored,
    right,
    shaMatches: sha256(code) === specimen.sha256,
    misses,
  };
}

/** Scores every specimen of a set. */
export async function scoreSet(set: "workbench" | "heldout"): Promise<Score[]> {
  const out: Score[] = [];
  for (const id of Object.keys(fixture.sets[set].specimens))
    out.push(await scoreOne(set, id));
  return out;
}

/** The share right, as a percentage to one decimal, over several scores. */
export function percent(scores: Score[]): number {
  const scored = scores.reduce((a, s) => a + s.scored, 0);
  const right = scores.reduce((a, s) => a + s.right, 0);
  return Math.round((1000 * right) / Math.max(1, scored)) / 10;
}
