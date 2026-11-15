/**
 * 013 decision 4's five failure causes, each in its own fresh process (run by
 * `highlight.test.ts`): a failure falls back for the life of the process, so
 * it must not leak into the other tests. Prints one JSON line: the engine
 * the language ended on, the warnings logged, and whether anything threw.
 */
import {
  queryFiles,
  treeSitterLanguages,
} from "../../src/lib/registry/lib/highlight/languages.ts";
import { testing } from "../../src/lib/registry/lib/highlight/tree-sitter.ts";
import {
  highlightCode,
  loadHighlighter,
} from "../../src/lib/registry/lib/highlighter.ts";

const cause = process.argv[2];
const warnings: string[] = [];
console.warn = (...args: unknown[]) => void warnings.push(args.join(" "));

const LANGUAGE: Record<string, string> = {
  "removed row": "python",
  "resolver throws": "ruby",
  "fetch fails": "go",
  "grammar fails to instantiate": "java",
  "query fails to compile": "rust",
};
const id = LANGUAGE[cause]!;
const row = treeSitterLanguages[id]!;
if (cause === "removed row") delete treeSitterLanguages[id];
if (cause === "resolver throws")
  treeSitterLanguages[id] = {
    ...row,
    grammar: { ...row.grammar, path: "no-such-grammar/x.wasm" },
  };
if (cause === "fetch fails") {
  testing.browser = true;
  treeSitterLanguages[id] = {
    ...row,
    grammar: {
      ...row.grammar,
      wasm: async () => ({
        default: "http://127.0.0.1:9/no-such-grammar.wasm",
      }),
    },
  };
}
if (cause === "grammar fails to instantiate")
  treeSitterLanguages[id] = {
    ...row,
    grammar: { ...row.grammar, path: "tree-sitter-java/package.json" },
  };
if (cause === "query fails to compile") {
  (queryFiles as Record<string, () => Promise<{ default: string }>>).broken =
    async () => ({
      default: "(no_such_node_type) @keyword",
    });
  treeSitterLanguages[id] = { ...row, files: ["broken" as never] };
}

let threw = false;
let engine: string | undefined;
let lines: unknown = null;
try {
  engine = (await loadHighlighter(id))?.engine;
  lines = await highlightCode("x = 1\n", id);
} catch {
  threw = true;
}
console.log(
  JSON.stringify({
    cause,
    id,
    engine,
    warnings,
    threw,
    highlighted: Array.isArray(lines),
  }),
);
