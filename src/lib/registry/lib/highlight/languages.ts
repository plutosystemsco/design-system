/**
 * The twenty-six languages. Twenty-one parse with a
 * tree-sitter grammar and our own queries; five (Markdown, diff, SQL, Swift,
 * Dockerfile) highlight through Shiki, which also holds every language as the
 * fallback. Nothing here loads until a block names a language.
 *
 * Every loader names its file in a static string, so the app's bundler can
 * emit each grammar as an asset of its own build. To keep fewer languages,
 * delete their rows here and remove their packages (`bun remove
 * tree-sitter-kotlin`); they fall back to Shiki, which still holds all 26.
 */

/** A grammar's WASM: a `?url` import for the browser, a package path for the server. */
export type TreeSitterGrammar = {
  /** The package path the server resolves from the app's `node_modules`. */
  path: string;
  /** The browser's URL for it, an asset of the app's build. */
  wasm: () => Promise<{ default: string }>;
};

/** The 24 query files of `highlight/queries/`. */
export const queryFiles = {
  javascript: () => import("./queries/javascript.scm?raw"),
  jsx: () => import("./queries/jsx.scm?raw"),
  "javascript.locals": () => import("./queries/javascript.locals.scm?raw"),
  typescript: () => import("./queries/typescript.scm?raw"),
  "typescript-assertion": () =>
    import("./queries/typescript-assertion.scm?raw"),
  "typescript.locals": () => import("./queries/typescript.locals.scm?raw"),
  python: () => import("./queries/python.scm?raw"),
  rust: () => import("./queries/rust.scm?raw"),
  go: () => import("./queries/go.scm?raw"),
  java: () => import("./queries/java.scm?raw"),
  "c-sharp": () => import("./queries/c-sharp.scm?raw"),
  ruby: () => import("./queries/ruby.scm?raw"),
  "ruby.locals": () => import("./queries/ruby.locals.scm?raw"),
  html: () => import("./queries/html.scm?raw"),
  css: () => import("./queries/css.scm?raw"),
  bash: () => import("./queries/bash.scm?raw"),
  json: () => import("./queries/json.scm?raw"),
  yaml: () => import("./queries/yaml.scm?raw"),
  toml: () => import("./queries/toml.scm?raw"),
  svelte: () => import("./queries/svelte.scm?raw"),
  c: () => import("./queries/c.scm?raw"),
  cpp: () => import("./queries/cpp.scm?raw"),
  php: () => import("./queries/php.scm?raw"),
  kotlin: () => import("./queries/kotlin.scm?raw"),
} satisfies Record<string, () => Promise<{ default: string }>>;

export type QueryFile = keyof typeof queryFiles;

/** The runtime's own WASM. */
export const runtime: TreeSitterGrammar = {
  path: "web-tree-sitter/web-tree-sitter.wasm",
  wasm: () => import("web-tree-sitter/web-tree-sitter.wasm?url"),
};

/** The 20 grammar files, by name. */
const grammars = {
  javascript: {
    path: "tree-sitter-javascript/tree-sitter-javascript.wasm",
    wasm: () =>
      import("tree-sitter-javascript/tree-sitter-javascript.wasm?url"),
  },
  typescript: {
    path: "tree-sitter-typescript/tree-sitter-typescript.wasm",
    wasm: () =>
      import("tree-sitter-typescript/tree-sitter-typescript.wasm?url"),
  },
  tsx: {
    path: "tree-sitter-typescript/tree-sitter-tsx.wasm",
    wasm: () => import("tree-sitter-typescript/tree-sitter-tsx.wasm?url"),
  },
  python: {
    path: "tree-sitter-python/tree-sitter-python.wasm",
    wasm: () => import("tree-sitter-python/tree-sitter-python.wasm?url"),
  },
  rust: {
    path: "tree-sitter-rust/tree-sitter-rust.wasm",
    wasm: () => import("tree-sitter-rust/tree-sitter-rust.wasm?url"),
  },
  go: {
    path: "tree-sitter-go/tree-sitter-go.wasm",
    wasm: () => import("tree-sitter-go/tree-sitter-go.wasm?url"),
  },
  java: {
    path: "tree-sitter-java/tree-sitter-java.wasm",
    wasm: () => import("tree-sitter-java/tree-sitter-java.wasm?url"),
  },
  csharp: {
    path: "tree-sitter-c-sharp/tree-sitter-c_sharp.wasm",
    wasm: () => import("tree-sitter-c-sharp/tree-sitter-c_sharp.wasm?url"),
  },
  ruby: {
    path: "tree-sitter-ruby/tree-sitter-ruby.wasm",
    wasm: () => import("tree-sitter-ruby/tree-sitter-ruby.wasm?url"),
  },
  html: {
    path: "tree-sitter-html/tree-sitter-html.wasm",
    wasm: () => import("tree-sitter-html/tree-sitter-html.wasm?url"),
  },
  css: {
    path: "tree-sitter-css/tree-sitter-css.wasm",
    wasm: () => import("tree-sitter-css/tree-sitter-css.wasm?url"),
  },
  bash: {
    path: "tree-sitter-bash/tree-sitter-bash.wasm",
    wasm: () => import("tree-sitter-bash/tree-sitter-bash.wasm?url"),
  },
  json: {
    path: "tree-sitter-json/tree-sitter-json.wasm",
    wasm: () => import("tree-sitter-json/tree-sitter-json.wasm?url"),
  },
  yaml: {
    path: "@tree-sitter-grammars/tree-sitter-yaml/tree-sitter-yaml.wasm",
    wasm: () =>
      import("@tree-sitter-grammars/tree-sitter-yaml/tree-sitter-yaml.wasm?url"),
  },
  toml: {
    path: "@tree-sitter-grammars/tree-sitter-toml/tree-sitter-toml.wasm",
    wasm: () =>
      import("@tree-sitter-grammars/tree-sitter-toml/tree-sitter-toml.wasm?url"),
  },
  svelte: {
    path: "@tree-sitter-grammars/tree-sitter-svelte/tree-sitter-svelte.wasm",
    wasm: () =>
      import("@tree-sitter-grammars/tree-sitter-svelte/tree-sitter-svelte.wasm?url"),
  },
  c: {
    path: "tree-sitter-c/tree-sitter-c.wasm",
    wasm: () => import("tree-sitter-c/tree-sitter-c.wasm?url"),
  },
  cpp: {
    path: "tree-sitter-cpp/tree-sitter-cpp.wasm",
    wasm: () => import("tree-sitter-cpp/tree-sitter-cpp.wasm?url"),
  },
  php: {
    path: "tree-sitter-php/tree-sitter-php.wasm",
    wasm: () => import("tree-sitter-php/tree-sitter-php.wasm?url"),
  },
  kotlin: {
    path: "@tree-sitter-grammars/tree-sitter-kotlin/tree-sitter-kotlin.wasm",
    wasm: () =>
      import("@tree-sitter-grammars/tree-sitter-kotlin/tree-sitter-kotlin.wasm?url"),
  },
} satisfies Record<string, TreeSitterGrammar>;

/**
 * Shiki's grammar for each of the 26: the engine of the five without a
 * tree-sitter row, and the fallback of every other. Keep all 26: a language
 * whose tree-sitter row is removed, or fails to load, falls back here.
 */
export const shikiLanguages = {
  bash: () => import("shiki/langs/shellscript.mjs"),
  c: () => import("shiki/langs/c.mjs"),
  cpp: () => import("shiki/langs/cpp.mjs"),
  csharp: () => import("shiki/langs/csharp.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
  docker: () => import("shiki/langs/docker.mjs"),
  go: () => import("shiki/langs/go.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  java: () => import("shiki/langs/java.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  kotlin: () => import("shiki/langs/kotlin.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  php: () => import("shiki/langs/php.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  ruby: () => import("shiki/langs/ruby.mjs"),
  rust: () => import("shiki/langs/rust.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  svelte: () => import("shiki/langs/svelte.mjs"),
  swift: () => import("shiki/langs/swift.mjs"),
  toml: () => import("shiki/langs/toml.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
} satisfies Record<string, () => Promise<unknown>>;

/** A tree-sitter row: the grammar and the query files, in order (later files win). */
export type TreeSitterRow = { grammar: TreeSitterGrammar; files: QueryFile[] };

/**
 * The 21 tree-sitter rows. Delete a row (and its package) to keep a language
 * on Shiki. `jsx` is the JavaScript grammar; `tsx` is the TypeScript
 * package's second file. `typescript.scm` is written for TypeScript's node
 * types, which include JavaScript's, so it does not load `javascript.scm`.
 */
export const treeSitterLanguages: Record<string, TreeSitterRow> = {
  bash: { grammar: grammars.bash, files: ["bash"] },
  c: { grammar: grammars.c, files: ["c"] },
  cpp: { grammar: grammars.cpp, files: ["cpp"] },
  csharp: { grammar: grammars.csharp, files: ["c-sharp"] },
  css: { grammar: grammars.css, files: ["css"] },
  go: { grammar: grammars.go, files: ["go"] },
  html: { grammar: grammars.html, files: ["html"] },
  java: { grammar: grammars.java, files: ["java"] },
  javascript: {
    grammar: grammars.javascript,
    files: ["javascript", "javascript.locals"],
  },
  json: { grammar: grammars.json, files: ["json"] },
  jsx: {
    grammar: grammars.javascript,
    files: ["javascript", "jsx", "javascript.locals"],
  },
  kotlin: { grammar: grammars.kotlin, files: ["kotlin"] },
  php: { grammar: grammars.php, files: ["php"] },
  python: { grammar: grammars.python, files: ["python"] },
  ruby: { grammar: grammars.ruby, files: ["ruby", "ruby.locals"] },
  rust: { grammar: grammars.rust, files: ["rust"] },
  svelte: { grammar: grammars.svelte, files: ["svelte"] },
  toml: { grammar: grammars.toml, files: ["toml"] },
  tsx: {
    grammar: grammars.tsx,
    files: ["typescript", "jsx", "typescript.locals"],
  },
  typescript: {
    grammar: grammars.typescript,
    files: ["typescript", "typescript-assertion", "typescript.locals"],
  },
  yaml: { grammar: grammars.yaml, files: ["yaml"] },
};

/** The 26 ids and the other names a block may pass for each. */
const NAMES: [id: string, aliases: string[]][] = [
  ["bash", ["sh", "shell", "shellscript", "zsh"]],
  ["c", []],
  ["cpp", ["c++"]],
  ["csharp", ["c#", "cs"]],
  ["css", []],
  ["diff", []],
  ["docker", ["dockerfile"]],
  ["go", []],
  ["html", []],
  ["java", []],
  ["javascript", ["js", "cjs", "mjs"]],
  ["json", []],
  ["jsx", []],
  ["kotlin", ["kt", "kts"]],
  ["markdown", ["md"]],
  ["php", []],
  ["python", ["py"]],
  ["ruby", ["rb"]],
  ["rust", ["rs"]],
  ["sql", []],
  ["svelte", []],
  ["swift", []],
  ["toml", []],
  ["tsx", []],
  ["typescript", ["ts", "cts", "mts"]],
  ["yaml", ["yml"]],
];

/** One language: its id, the names a block may also pass, and the engine its table row names. */
export type HighlightLanguage = {
  id: string;
  aliases: string[];
  engine: "tree-sitter" | "shiki";
};

/** The table of 26: 21 through tree-sitter (while their rows stand) and 5 through Shiki. */
export const highlightLanguages: HighlightLanguage[] = NAMES.map(
  ([id, aliases]) => ({
    id,
    aliases,
    engine: id in treeSitterLanguages ? "tree-sitter" : "shiki",
  }),
);

/** The row for an id or an alias, or null for a name the table does not know. */
export function findHighlightLanguage(name: string): HighlightLanguage | null {
  const wanted = name.toLowerCase();
  return (
    highlightLanguages.find(
      (language) => language.id === wanted || language.aliases.includes(wanted),
    ) ?? null
  );
}
