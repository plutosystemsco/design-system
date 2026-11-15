import { describe, expect, test } from "bun:test";
import path from "node:path";
import {
  loadHighlighter,
  type HighlightChange,
  type Highlighter,
} from "../../src/lib/registry/lib/highlighter.ts";
import { sameState } from "../../src/lib/registry/lib/highlight/shiki.ts";
import { SPECIMENS } from "../fixtures/highlight/specimens.ts";

/**
 * 013 decision 15 and criterion 8: a session updated by edits colours its
 * document exactly as a fresh session on the same text does, over the whole
 * document and in any window of it.
 */

/** A small seeded generator, so a failure replays. */
function random(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bits of code and noise an edit inserts: words, brackets, quotes, newlines, astral characters. */
const PIECES = [
  "x",
  " ",
  "\n",
  "(",
  ")",
  "{",
  "}",
  "[",
  "]",
  '"',
  "'",
  "`",
  "#",
  "//",
  "/*",
  "*/",
  "😀",
  "é",
  "def f(a):\n    return a\n",
  "count = 0\n",
  "<p>{x}</p>",
  '<script lang="ts">',
  "</script>",
  "{#if a}",
  "{/if}",
  "```python\n",
  "```\n",
  "```bash\n",
  "end\n",
  "  ",
  "= ",
  "1_000",
  "self.",
  "@dataclass\n",
  "$",
  "\\n",
];

type Edit = { at: number; remove: number; insert: string };

/** A random edit of a text, sometimes inside a surrogate pair. */
function edit(next: () => number, text: string): Edit {
  const at = Math.floor(next() * (text.length + 1));
  const kind = next();
  const remove =
    kind < 0.35 ? 0 : Math.min(text.length - at, Math.floor(next() * 12));
  const insert =
    kind > 0.8
      ? ""
      : Array.from(
          { length: 1 + Math.floor(next() * 3) },
          () => PIECES[Math.floor(next() * PIECES.length)]!,
        ).join("");
  return { at, remove, insert };
}

/** Applies non-overlapping edits (given in the old text's offsets), as CodeMirror's iterChanges reports them. */
function apply(
  text: string,
  edits: Edit[],
): { code: string; changes: HighlightChange[] } {
  const sorted = [...edits].sort((a, b) => a.at - b.at);
  const kept: Edit[] = [];
  let end = -1;
  for (const e of sorted)
    if (e.at > end) {
      kept.push(e);
      end = e.at + e.remove;
    }
  let code = "";
  let last = 0;
  let delta = 0;
  const changes: HighlightChange[] = [];
  for (const e of kept) {
    code += text.slice(last, e.at) + e.insert;
    changes.push({
      fromA: e.at,
      toA: e.at + e.remove,
      fromB: e.at + delta,
      toB: e.at + delta + e.insert.length,
    });
    delta += e.insert.length - e.remove;
    last = e.at + e.remove;
  }
  code += text.slice(last);
  return { code, changes };
}

const specimen = (language: string) =>
  SPECIMENS.find((s) => s.language === language)!.code;

/** Clips whole-document ranges to a window. */
function clip(
  ranges: { from: number; to: number; role: string }[],
  from: number,
  to: number,
) {
  return ranges
    .filter((r) => r.to > from && r.from < to)
    .map((r) => ({
      ...r,
      from: Math.max(r.from, from),
      to: Math.min(r.to, to),
    }))
    .filter((r) => r.from < r.to);
}

describe("500 random edits in each of four languages (criterion 8)", () => {
  test.each([
    ["python", 11],
    ["ruby", 23],
    ["svelte", 37],
    ["markdown", 41],
  ] as const)(
    "%s: after every edit, the whole document's ranges and lines equal a fresh session's, and a window equals the whole clipped",
    async (language, seed) => {
      const highlighter = (await loadHighlighter(language)) as Highlighter;
      const next = random(seed);
      let text = specimen(language);
      const session = highlighter.session(text);
      session.lines();
      const wrong: string[] = [];
      for (let i = 0; i < 500; i++) {
        const edits = Array.from({ length: next() < 0.2 ? 3 : 1 }, () =>
          edit(next, text),
        );
        const { code, changes } = apply(text, edits);
        session.update(code, changes);
        text = code;
        const fresh = highlighter.session(text);
        const whole = session.ranges(0, text.length);
        const want = fresh.ranges(0, text.length);
        if (JSON.stringify(whole) !== JSON.stringify(want))
          wrong.push(`edit ${i}: ranges differ (${JSON.stringify(changes)})`);
        if (JSON.stringify(session.lines()) !== JSON.stringify(fresh.lines()))
          wrong.push(`edit ${i}: lines differ (${JSON.stringify(changes)})`);
        const a = Math.floor(next() * text.length);
        const b = Math.min(text.length, a + Math.floor(next() * 400));
        if (
          JSON.stringify(session.ranges(a, b)) !==
          JSON.stringify(clip(want, a, b))
        )
          wrong.push(
            `edit ${i}: window ${a}-${b} differs from the whole clipped`,
          );
        fresh.dispose();
        if (wrong.length > 3) break;
      }
      session.dispose();
      expect(wrong).toEqual([]);
    },
    120_000,
  );
});

describe("the three widened re-queries (decision 15)", () => {
  /** A session's lines after one edit equal a fresh session's. */
  async function agrees(
    language: string,
    before: string,
    at: number,
    insert: string,
    remove = 0,
  ) {
    const highlighter = (await loadHighlighter(language)) as Highlighter;
    const session = highlighter.session(before);
    const first = JSON.stringify(session.lines());
    const { code, changes } = apply(before, [{ at, remove, insert }]);
    session.update(code, changes);
    const fresh = highlighter.session(code);
    const result = {
      equal: JSON.stringify(session.lines()) === JSON.stringify(fresh.lines()),
      changed: JSON.stringify(fresh.lines()) !== first,
    };
    session.dispose();
    fresh.dispose();
    return result;
  }

  test("a Ruby local defined above: a bare name far below re-colours", async () => {
    const before = `def run\n${"  x = 1\n".repeat(40)}  count\nend\n`;
    const result = await agrees(
      "ruby",
      before,
      before.indexOf("  x"),
      "  count = 0\n",
    );
    expect(result).toEqual({ equal: true, changed: true });
  });

  test('a Svelte script switched to lang="ts": every expression re-colours', async () => {
    const before =
      "<script>\n  let n = 1;\n</script>\n\n<p>{n as number}</p>\n";
    const result = await agrees(
      "svelte",
      before,
      "<script".length,
      ' lang="ts"',
    );
    expect(result.equal).toBe(true);
  });

  test("a Markdown fence's language changed from python to bash: the fence re-colours", async () => {
    const before = "Text\n\n```python\necho $HOME\n```\n";
    const at = before.indexOf("python");
    const result = await agrees(
      "markdown",
      before,
      at,
      "bash",
      "python".length,
    );
    expect(result).toEqual({ equal: true, changed: true });
  });
});

describe("the Shiki session's convergence (decision 16)", () => {
  test("the stack-equality guard: getInternalStack().equals exists and tells states apart", async () => {
    const { createHighlighterCore } = await import("shiki/core");
    const { createJavaScriptRegexEngine } =
      await import("shiki/engine/javascript");
    const { shikiTheme } =
      await import("../../src/lib/registry/lib/highlight/shiki.ts");
    const core = await createHighlighterCore({
      themes: [shikiTheme],
      langs: [import("shiki/langs/markdown.mjs")],
      engine: createJavaScriptRegexEngine({ forgiving: false }),
    });
    const state = (code: string) =>
      core.getLastGrammarState(code, { lang: "markdown", theme: "pluto-code" });
    const a = state("plain");
    const b = state("other plain");
    const open = state("```python\nx = 1");
    expect(typeof a.getInternalStack()?.equals).toBe("function");
    expect(sameState(a, b)).toBe(true);
    expect(sameState(a, open)).toBe(false);
  });

  test("a session opened while a fence's grammar loads fires onChange once, then equals highlightCode", async () => {
    const child = Bun.spawn(
      [
        process.execPath,
        "--preload",
        "./tests/helpers/vite-imports.ts",
        path.join("tests/helpers", "late-fence.ts"),
      ],
      { stdout: "pipe", stderr: "pipe" },
    );
    const out = (await new Response(child.stdout).text())
      .trim()
      .split("\n")
      .pop()!;
    await child.exited;
    expect(JSON.parse(out)).toEqual({
      fired: 1,
      pendingAtFirst: true,
      settled: true,
      changed: true,
      equal: true,
    });
  }, 30_000);
});

describe("the streaming budget (decision 20)", () => {
  // A wall-clock budget: one untimed stream first warms the session and the
  // engine, then the best of three timed streams' p95 is held to 4 ms, so one
  // stream slowed by a loaded machine does not fail it (019 change review,
  // finding 6).
  test("a 2,000-line stream in 50 chunks through one session: 4 ms or less per chunk, p95, the best of 3 after a warm-up", async () => {
    const highlighter = (await loadHighlighter("python")) as Highlighter;
    const base = specimen("python");
    let text = "";
    while (text.split("\n").length < 2000) text += base + "\n";
    text = text.split("\n").slice(0, 2000).join("\n");
    const size = Math.ceil(text.length / 50);

    /** One stream through a new session: its per-chunk times, sorted. */
    function stream(): number[] {
      const session = highlighter.session("");
      session.lines();
      const times: number[] = [];
      let shown = "";
      for (let i = 1; i <= 50; i++) {
        const next = text.slice(0, i * size);
        const t0 = performance.now();
        session.update(next, [
          {
            fromA: shown.length,
            toA: shown.length,
            fromB: shown.length,
            toB: next.length,
          },
        ]);
        session.lines();
        times.push(performance.now() - t0);
        shown = next;
      }
      session.dispose();
      return times.sort((a, b) => a - b);
    }

    stream(); // the warm-up, untimed
    const runs = [stream(), stream(), stream()];
    const p95s = runs.map((t) => t[Math.ceil(0.95 * t.length) - 1]!);
    const best = Math.min(...p95s);
    console.log(
      `stream: p95 ${p95s.map((p) => p.toFixed(2)).join(", ")} ms per chunk; best ${best.toFixed(2)}`,
    );
    expect(best).toBeLessThanOrEqual(4);
  }, 60_000);
});
