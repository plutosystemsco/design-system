/**
 * 022 decision 15: what a mutation set must make fail, derived, never
 * written by hand. A test is expected to fail for patch p, under every
 * reader and browser pair, when its `rules` include p's fault and its
 * `hears` matches p's target:
 *
 * - a patch that names a part (`toast:assertive`) matches a `hears` entry
 *   for that part, or for the whole item (`toast`);
 * - a patch that names only an item (`sheet`) matches any `hears` entry for
 *   that item, whole or part.
 */
import type { Declared } from "../declared.ts";

export type Patch = {
  set: string;
  patch: string;
  /** An item, or `item:part`. */
  target: string;
  /** The rule fault id the patch must cause. */
  fault: string;
  why?: string;
  witness: { file: string; title: string };
};

export type Pair = { reader: "voiceover" | "nvda"; browser: string };

/** 022 decision 10 and Q5: the four pairs. */
export const PAIRS: Pair[] = [
  { reader: "voiceover", browser: "webkit" },
  { reader: "voiceover", browser: "chromium" },
  { reader: "nvda", browser: "chromium" },
  { reader: "nvda", browser: "firefox" },
];

export type Entry = Pair & {
  patch: string;
  file: string;
  title: string;
  fault: string;
};

/** A pair where a patch's fault was shown unprovable, with the run that showed it. */
export type NotProvable = Pair & { patch: string; run: string };

export type Expected = {
  set: string;
  patches: { patch: string; target: string; fault: string }[];
  expected: Entry[];
  notProvable: NotProvable[];
};

/** Does a `hears` entry match a patch's target? */
export function reaches(target: string, hears: string): boolean {
  const [ti, tp] = target.split(":");
  const [hi, hp] = hears.split(":");
  if (ti !== hi) return false;
  if (tp === undefined) return true;
  return hp === undefined || hp === tp;
}

function checkParts(tests: Declared[]): void {
  for (const t of tests)
    for (const h of t.hears) {
      const [item, part] = h.split(":");
      if (part === undefined) continue;
      const parts =
        tests.find((x) => x.file === `${item}.sr.ts`)?.parts ??
        (item === t.item ? t.parts : []);
      if (!parts.includes(part))
        throw new Error(
          `${t.file} › ${t.title}: ${h}'s part is not declared for ${item}`,
        );
    }
}

const key = (e: { file: string; title: string } & Pair) =>
  `${e.file} › ${e.title} @ ${e.reader}-${e.browser}`;

/** The set's expected.json. */
export function derive(
  set: string,
  patches: Patch[],
  tests: Declared[],
  notProvable: NotProvable[],
): Expected {
  checkParts(tests);
  const mine = patches.filter((p) => p.set === set);
  const skip = new Set(
    notProvable.map((n) => `${n.patch} ${n.reader}-${n.browser}`),
  );
  const expected: Entry[] = [];
  for (const p of mine)
    for (const t of tests) {
      if (!t.rules.includes(p.fault)) continue;
      if (!t.hears.some((h) => reaches(p.target, h))) continue;
      for (const pair of PAIRS) {
        if (skip.has(`${p.patch} ${pair.reader}-${pair.browser}`)) continue;
        expected.push({
          patch: p.patch,
          file: t.file,
          title: t.title,
          ...pair,
          fault: p.fault,
        });
      }
    }
  expected.sort((a, b) =>
    `${a.patch} ${key(a)}`.localeCompare(`${b.patch} ${key(b)}`),
  );
  return {
    set,
    patches: mine.map(({ patch, target, fault }) => ({ patch, target, fault })),
    expected,
    notProvable,
  };
}

/** Each patch's witness, under every pair not ruled unprovable: why it is missing. */
export function witnessFaults(
  set: string,
  patches: Patch[],
  tests: Declared[],
  notProvable: NotProvable[],
): string[] {
  const { expected } = derive(set, patches, tests, notProvable);
  const faults: string[] = [];
  for (const p of patches.filter((x) => x.set === set))
    for (const pair of PAIRS) {
      if (
        notProvable.some(
          (n) =>
            n.patch === p.patch &&
            n.reader === pair.reader &&
            n.browser === pair.browser,
        )
      )
        continue;
      const w = { ...p.witness, ...pair };
      const mine = expected.find(
        (e) => e.patch === p.patch && key(e) === key(w),
      );
      if (!mine) {
        faults.push(`${p.patch}: its witness ${key(w)} has no expected entry`);
        continue;
      }
      const other = expected.find(
        (e) => e.patch !== p.patch && key(e) === key(w) && e.fault === p.fault,
      );
      if (other)
        faults.push(
          `${p.patch}: its witness ${key(w)} is also reached by another patch, ${other.patch}, with ${p.fault}`,
        );
    }
  return faults;
}

/** The files a unified diff touches. */
export function patchFiles(diff: string): string[] {
  return [...diff.matchAll(/^\+\+\+ b\/(.+)$/gm)].map((m) => m[1]!);
}

/**
 * The mutation run's verdict (decision 15): every expected test failed
 * under its pair with its fault; no other screen-reader test failed; no
 * expected test failed only on set-up (no fault, or X0 alone).
 */
export function verdict(
  expected: Expected,
  results: (Pair & {
    file: string;
    title: string;
    ok: boolean;
    faults: string[];
  })[],
): string[] {
  const out: string[] = [];
  const want = new Map<string, string[]>();
  for (const e of expected.expected)
    want.set(key(e), [...(want.get(key(e)) ?? []), e.fault]);
  for (const r of results) {
    const faults = want.get(key(r));
    if (!faults) {
      if (!r.ok) out.push(`${key(r)} failed, and no patch expects it`);
      continue;
    }
    if (r.ok) {
      out.push(`${key(r)} passed; it must fail with ${faults.join(", ")}`);
      continue;
    }
    for (const f of faults)
      if (!r.faults.includes(f))
        out.push(
          `${key(r)} failed without ${f}${r.faults.length ? ` (its faults: ${r.faults.join(", ")})` : " (a set-up failure)"}`,
        );
  }
  for (const k of want.keys())
    if (!results.some((r) => key(r) === k)) out.push(`${k} did not run`);
  return out;
}
