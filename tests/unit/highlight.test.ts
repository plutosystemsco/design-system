import { describe, expect, test } from "bun:test";
import path from "node:path";
import {
  findHighlightLanguage,
  highlightCode,
  highlightLanguages,
  type CodeRole,
  type HighlightedLine,
} from "../../src/lib/registry/lib/highlighter.ts";
import { CODE_SAMPLES } from "../../src/lib/preview/code-samples.ts";
import { SPECIMENS } from "../fixtures/highlight/specimens.ts";
import { grid } from "../helpers/accuracy.ts";

/**
 * 013 decision 21: the table, the samples, the fallbacks, the owner's
 * rulings, Meridian's cases, the edges of ALL_CAPS and of broken code, Svelte,
 * the carried comment fault, and the timings.
 */

/** Every character's role, flat, with the code. */
async function roles(code: string, language: string) {
  const lines = (await highlightCode(code, language)) as HighlightedLine[];
  return {
    flat: grid(lines).flatMap((l) => [...l, "text" as CodeRole]),
    lines,
  };
}

/** The distinct roles over the non-whitespace characters of the `nth` occurrence of `needle`. */
async function roleOf(
  code: string,
  language: string,
  needle: string,
  nth = 0,
): Promise<CodeRole[]> {
  const { flat } = await roles(code, language);
  let at = -1;
  for (let i = 0; i <= nth; i++) at = code.indexOf(needle, at + 1);
  if (at < 0) throw new Error(`no ${needle}`);
  const set = new Set<CodeRole>();
  for (let i = at; i < at + needle.length; i++)
    if (!/\s/.test(code[i]!)) set.add(flat[i]!);
  return [...set];
}

/** One span of one role covers the needle whole. */
async function oneSpan(code: string, language: string, needle: string) {
  const { lines } = await roles(code, language);
  const tokens = lines.flatMap((l) => (typeof l === "string" ? [] : l));
  return tokens.some(
    (t) => t.content === needle && t.class === "text-code-number",
  );
}

describe("the table", () => {
  test("26 ids: 21 through tree-sitter and 5 through Shiki, with the aliases", () => {
    expect(highlightLanguages).toHaveLength(26);
    expect(
      highlightLanguages.filter((l) => l.engine === "tree-sitter"),
    ).toHaveLength(21);
    expect(
      highlightLanguages
        .filter((l) => l.engine === "shiki")
        .map((l) => l.id)
        .sort(),
    ).toEqual(["diff", "docker", "markdown", "sql", "swift"]);
    for (const [alias, id] of [
      ["py", "python"],
      ["ts", "typescript"],
      ["sh", "bash"],
      ["zsh", "bash"],
      ["c#", "csharp"],
      ["c++", "cpp"],
      ["yml", "yaml"],
      ["md", "markdown"],
      ["dockerfile", "docker"],
      ["kt", "kotlin"],
      ["rs", "rust"],
      ["rb", "ruby"],
      ["mjs", "javascript"],
    ])
      expect(findHighlightLanguage(alias)?.id, alias).toBe(id);
  });

  test("null for a name the table does not know", async () => {
    expect(findHighlightLanguage("cobol")).toBeNull();
    expect(await highlightCode("x", "cobol")).toBeNull();
  });
});

const SHOWN = CODE_SAMPLES;

describe("the samples", () => {
  test(`${SHOWN.length} gallery samples, each with at least 2 roles besides text (diff: 2 of inserted, deleted, comment)`, async () => {
    expect(SHOWN.length).toBe(26);
    const thin: string[] = [];
    for (const sample of SHOWN) {
      const { flat } = await roles(sample.code, sample.language);
      const present = new Set<CodeRole>(flat.filter((r) => r !== "text"));
      const count =
        sample.language === "diff"
          ? ["inserted", "deleted", "comment"].filter((r) =>
              present.has(r as CodeRole),
            ).length
          : present.size;
      if (count < 2) thin.push(`${sample.language}: ${[...present]}`);
    }
    expect(thin).toEqual([]);
  });

  test("0 font-medium in any output", async () => {
    for (const s of [...CODE_SAMPLES, ...SPECIMENS]) {
      const lines = await highlightCode(s.code, s.language);
      expect(JSON.stringify(lines), s.language).not.toContain("font-medium");
    }
  });

  test("Markdown's fences are coloured in their own language, in the specimen and the sample", async () => {
    const specimen = SPECIMENS.find((s) => s.language === "markdown")!.code;
    const sample = CODE_SAMPLES.find((s) => s.language === "markdown")!.code;
    for (const code of [specimen, sample]) {
      const fence = /^```(\w+)\n([\s\S]*?)^```$/m.exec(code)!;
      expect(fence, "a fence").toBeTruthy();
      const body = fence[2]!.replace(/\n$/, "");
      const { flat } = await roles(code, "markdown");
      const at = code.indexOf(body);
      const own = grid(
        (await highlightCode(body, fence[1]!)) as HighlightedLine[],
      ).flatMap((l) => [...l, "text" as CodeRole]);
      expect(flat.slice(at, at + body.length)).toEqual(
        own.slice(0, body.length),
      );
      expect(
        new Set(own.slice(0, body.length)).size,
        "the fence has colour",
      ).toBeGreaterThan(1);
    }
  });
});

/** Runs a helper in a fresh Bun process, with the Vite-import preload, and parses its JSON line. */
async function fresh(script: string, ...args: string[]) {
  const child = Bun.spawn(
    [
      process.execPath,
      "--preload",
      "./tests/helpers/vite-imports.ts",
      path.join("tests/helpers", script),
      ...args,
    ],
    { stdout: "pipe", stderr: "pipe" },
  );
  const [out, err] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  const line = out.trim().split("\n").pop()!;
  try {
    return JSON.parse(line);
  } catch {
    throw new Error(`${script} ${args.join(" ")}: ${out}\n${err}`);
  }
}

describe("the five fallbacks (decision 4)", () => {
  test.each([
    "removed row",
    "resolver throws",
    "fetch fails",
    "grammar fails to instantiate",
    "query fails to compile",
  ])(
    "%s: falls back to Shiki with 1 warning and no throw",
    async (cause) => {
      const result = await fresh("fallbacks.ts", cause);
      expect(result.threw).toBe(false);
      expect(result.engine).toBe("shiki");
      expect(result.highlighted).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain(result.id);
    },
    30_000,
  );
});

describe("the owner's rulings (4 cases)", () => {
  test("pip install --upgrade x: pip is function, the rest the body", async () => {
    const code = "pip install --upgrade x\n";
    expect(await roleOf(code, "bash", "pip")).toEqual(["function"]);
    expect(await roleOf(code, "bash", "install --upgrade x")).toEqual(["text"]);
  });

  test("0x2A, 3j, 2_500 and 30_000L are each one number span", async () => {
    expect(await oneSpan("x = 0x2A + 3j\n", "python", "0x2A")).toBe(true);
    expect(await oneSpan("x = 0x2A + 3j\n", "python", "3j")).toBe(true);
    expect(await oneSpan("const gap = 2_500;\n", "typescript", "2_500")).toBe(
      true,
    );
    expect(
      await oneSpan("class A { long b = 30_000L; }\n", "java", "30_000L"),
    ).toBe(true);
  });

  test("font: bold 0.75rem: bold is constant, 0.75rem one number span", async () => {
    const code = "p { font: bold 0.75rem monospace; }\n";
    expect(await roleOf(code, "css", "bold")).toEqual(["constant"]);
    expect(await oneSpan(code, "css", "0.75rem")).toBe(true);
  });

  test("a docstring is a string", async () => {
    const code = 'def f():\n    """Docs, quoted."""\n    return 1\n';
    expect(await roleOf(code, "python", '"""Docs, quoted."""')).toEqual([
      "string",
    ]);
  });
});

describe("Meridian's cases (13)", () => {
  const PY =
    "from x import Body\nMAX_LINES = 3\n\nclass P:\n    def parse(self, line: str) -> Body | None:\n        print(line)\n        return None\n";
  test.each([
    ["Body in -> Body | None is type", PY, "python", "Body", 1, "type"],
    [
      "a JSON key is function, with its quotes",
      '{"name": 1}\n',
      "json",
      '"name"',
      0,
      "function",
    ],
    [
      "an HTML attribute is meta",
      '<a href="/x">x</a>\n',
      "html",
      "href",
      0,
      "meta",
    ],
    [
      "a CSS property is keyword",
      "p { color: red; }\n",
      "css",
      "color",
      0,
      "keyword",
    ],
    [
      "a CSS selector is type",
      ".board > p { color: red; }\n",
      "css",
      ".board",
      0,
      "type",
    ],
    [":hover is meta", "a:hover { color: red; }\n", "css", ":hover", 0, "meta"],
    ["$HOME is meta", 'cd "$HOME"\necho $HOME\n', "bash", "$HOME", 1, "meta"],
    ["MAX_LINES is constant", PY, "python", "MAX_LINES", 0, "constant"],
    ["self is keyword", PY, "python", "self", 0, "keyword"],
    [
      "this is keyword",
      "class A { f() { return this.x; } }\n",
      "typescript",
      "this",
      0,
      "keyword",
    ],
    ["print is function", PY, "python", "print", 0, "function"],
    ["str is type", PY, "python", "str", 0, "type"],
    [
      "fmt. is text",
      'package main\n\nfunc main() { fmt.Println("x") }\n',
      "go",
      "fmt.",
      0,
      "text",
    ],
  ] as const)("%s", async (_, code, language, needle, nth, role) => {
    expect(await roleOf(code, language, needle, nth)).toEqual([role]);
  });
});

describe("the ALL_CAPS limits (3)", () => {
  test("class API: keeps type", async () => {
    expect(await roleOf("class API:\n    pass\n", "python", "API")).toEqual([
      "type",
    ]);
  });
  test("API() keeps type", async () => {
    expect(await roleOf("x = API()\n", "python", "API")).toEqual(["type"]);
  });
  test("C's MAX(a, b) is function", async () => {
    expect(
      await roleOf("int f(int a, int b) { return MAX(a, b); }\n", "c", "MAX"),
    ).toEqual(["function"]);
  });
});

describe("broken code paints no red (9)", () => {
  /** The special characters of a text that are not inside an escape sequence. */
  async function stray(code: string, language: string) {
    const { flat } = await roles(code, language);
    const escapes = /\\./g;
    const inEscape = new Set<number>();
    for (const m of code.matchAll(escapes))
      for (let i = m.index!; i < m.index! + m[0].length; i++) inEscape.add(i);
    return [...code].filter(
      (c, i) => flat[i] === "special" && !inEscape.has(i) && !/\s/.test(c),
    ).length;
  }
  test.each([
    ["python", "an unclosed call", "def parse(\n    x = 1\n"],
    ["python", "an unclosed dict", "x = {\n    'a': 1,\n"],
    ["python", "an unclosed string", 'x = "abc\ny = 2\n'],
    ["typescript", "an unclosed call", "const x = parse(a,\nlet y = 2;\n"],
    ["typescript", "an unclosed object", "const x = {\n  a: 1,\n"],
    ["typescript", "an unclosed string", 'const x = "abc\nlet y = 2;\n'],
    ["bash", "an unclosed call", "echo $(date\nls -l\n"],
    ["bash", "an unclosed array", "files=(a b\necho done\n"],
    ["bash", "an unclosed string", 'echo "abc\nls\n'],
  ] as const)(
    "%s, %s: 0 special characters outside escapes",
    async (language, _, code) => {
      expect(await stray(code, language)).toBe(0);
    },
  );
});

describe("Svelte (2)", () => {
  test("{#each items as item, i (item.id)}: item and i text, items and the key expressions, as keyword", async () => {
    const code =
      '<script lang="ts">\n  let items = [{ id: 1 }];\n</script>\n\n{#each items as item, i (item.id)}\n  <p>{i}</p>\n{/each}\n';
    const head = "{#each items as item, i (item.id)}";
    const at = code.indexOf(head);
    const { flat } = await roles(code, "svelte");
    const role = (needle: string) => {
      const i = at + head.indexOf(needle);
      return [...new Set(flat.slice(i, i + needle.length))];
    };
    expect(role("as")).toEqual(["keyword"]);
    expect(role("item,")).toEqual(["text"]);
    expect(role("i (")[0]).toBe("text");
    // The key parses as an expression: `item.id` is a member access, not a call.
    expect(role("(item.id)").includes("function")).toBe(false);
    expect(role("items")).toEqual(["text"]);
  });

  test("{#await p then value}: p an expression, then keyword, value text", async () => {
    const code = "{#await p then value}\n  {value}\n{/await}\n";
    const head = "{#await p then value}";
    const { flat } = await roles(code, "svelte");
    const role = (needle: string) => {
      const i = head.indexOf(needle);
      return [...new Set(flat.slice(i, i + needle.length))];
    };
    expect(role("then")).toEqual(["keyword"]);
    expect(role("value")).toEqual(["text"]);
    expect(role(" p ")).toEqual(["text"]);
  });
});

describe("the carried fault", () => {
  test("an apostrophe inside a TypeScript // comment leaves the following lines right", async () => {
    const code =
      '// it\'s a comment\nconst name: string = "x";\nfunction f() { return 1; }\n';
    expect(await roleOf(code, "typescript", "// it's a comment")).toEqual([
      "comment",
    ]);
    expect(await roleOf(code, "typescript", "const")).toEqual(["keyword"]);
    expect(await roleOf(code, "typescript", '"x"')).toEqual(["string"]);
    expect(await roleOf(code, "typescript", "function")).toEqual(["keyword"]);
  });
});

describe("timings (decision 20)", () => {
  test("the 18 specimens in a fresh process: 1.5 s or less first pass, 50 ms or less warm", async () => {
    const { first, warm } = await fresh("timings.ts");
    console.log(
      `timings: first pass ${(first / 1000).toFixed(2)} s, warm ${warm.toFixed(1)} ms (tree-sitter and Shiki, mixed)`,
    );
    expect(first).toBeLessThanOrEqual(1500);
    expect(warm).toBeLessThanOrEqual(50);
  }, 60_000);
});
