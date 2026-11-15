/**
 * The fallback (013 decisions 4 and 14): Shiki, with the JavaScript engine,
 * strict, and one theme written by role, every colour `var(--code-<role>)`.
 * It highlights Markdown, diff, SQL, Swift and Dockerfile, and any language
 * whose tree-sitter path is removed or fails. Shiki is imported lazily, so a
 * page that renders highlighted lines it was given loads none of it.
 *
 * A Markdown fence is not Shiki's: its lines take the fence language's
 * highlighting, found by `chat-text`'s rule, so the fence the chat shows as
 * a block is the fence the highlighter colours.
 */
import type {
  GrammarState,
  HighlighterCore,
  ThemeRegistrationRaw,
  ThemedToken,
} from "shiki/core";
import { shikiLanguages } from "./languages";
import {
  isRole,
  lineStarts,
  lineTokens,
  paintRanges,
  ROLE_INDEX,
  type CodeRole,
  type HighlightChange,
  type HighlightedLine,
  type HighlightRange,
  type HighlightSession,
  type Paint,
} from "./roles";
import {
  embeddedPaint,
  loadNeeds,
  type Needs,
  type RegionTrees,
} from "./tree-sitter";

/** The theme's name, as Shiki registers it. */
const THEME = "pluto-code";

const role = (name: CodeRole) => "var(--code-" + name + ")";
const rule = (scope: string[], name: CodeRole) => ({
  scope,
  settings: { foreground: role(name) },
});

/**
 * The theme, by role: Meridian's TextMate column, with `number` apart from
 * `constant`, and the rules the workbench and the accuracy memo found where
 * a grammar's scopes allow. A deeper selector beats a shallower one. Nothing
 * is bold or italic.
 */
export const shikiTheme: ThemeRegistrationRaw = {
  name: THEME,
  type: "light",
  colors: {
    "editor.foreground": role("text"),
    "editor.background": "var(--code-background)",
  },
  settings: [
    rule(
      [
        "variable",
        "meta.property",
        "entity.name.namespace",
        "keyword.operator",
        "punctuation",
        "meta.brace",
        "variable.other.object",
        "variable.parameter",
      ],
      "text",
    ),
    rule(
      [
        "comment",
        "punctuation.definition.comment",
        "markup.quote",
        "meta.diff.header",
        "meta.diff.index",
        "comment entity.name.tag",
        "comment punctuation.definition.tag",
      ],
      "comment",
    ),
    rule(
      [
        "keyword",
        "storage.type",
        "storage.modifier",
        "keyword.operator.word",
        "keyword.operator.expression",
        "keyword.operator.new",
        "keyword.operator.logical.python",
        "variable.language",
        "entity.name.tag",
        "support.type.property-name.css",
        "keyword.other.unit.css-not",
        "meta.diff.range",
        "punctuation.definition.heading",
        "punctuation.definition.list.begin.markdown",
        "punctuation.definition.bold",
        "punctuation.definition.italic",
        "punctuation.definition.strikethrough",
        "punctuation.definition.markdown",
        "keyword.control.at-rule",
      ],
      "keyword",
    ),
    rule(
      [
        "entity.name.function",
        "support.function",
        "meta.function-call entity.name.function",
        "meta.function-call.generic",
        "support.type.property-name.json",
        "punctuation.support.type.property-name.json",
      ],
      "function",
    ),
    rule(
      [
        "entity.name.type",
        "entity.name.class",
        "support.type",
        "support.class",
        "storage.type.primitive",
        "storage.type.built-in",
        "entity.other.attribute-name.class.css",
        "entity.other.attribute-name.id.css",
        "entity.other.inherited-class",
        "storage.type.sql",
        "storage.type.swift",
        "entity.name.section.toml",
      ],
      "type",
    ),
    rule(
      [
        "string",
        "string.quoted",
        "markup.inline.raw",
        "string.quoted.docstring",
        "string.quoted.docstring punctuation.definition.string",
      ],
      "string",
    ),
    rule(
      [
        "constant.numeric",
        "keyword.other.unit",
        "constant.other.color",
        "storage.type.number",
        "storage.type.imaginary.number",
        "punctuation.separator.constant.numeric",
        "punctuation.separator.dot.decimal",
        "punctuation.separator.decimal",
      ],
      "number",
    ),
    rule(
      [
        "constant.language",
        "constant.other",
        "variable.other.constant",
        "variable.other.enummember",
        "support.constant",
        "constant.other.symbol",
        "constant.other.caps",
        "support.constant.property-value.css",
        "support.constant.font-name",
      ],
      "constant",
    ),
    rule(
      [
        "meta.decorator",
        "entity.name.function.decorator",
        "punctuation.definition.decorator",
        "meta.attribute",
        "storage.type.annotation",
        "entity.name.function.macro",
        "support.function.macro",
        "meta.preprocessor",
        "keyword.control.directive",
        "entity.other.attribute-name",
        "entity.name.type.lifetime",
        "storage.modifier.lifetime",
        "variable.other.normal.shell",
        "variable.other.positional.shell",
        "variable.other.special.shell",
        "variable.language.special.shell",
        "punctuation.definition.variable.shell",
        "entity.other.attribute-name.pseudo-class.css",
        "entity.other.attribute-name.pseudo-element.css",
        "variable.css",
        "variable.argument.css",
        "entity.name.tag.doctype",
        "meta.tag.sgml.doctype",
      ],
      "meta",
    ),
    rule(
      [
        "constant.character.escape",
        "string.regexp",
        "punctuation.definition.template-expression",
        "punctuation.section.embedded",
        "constant.character.entity",
        "constant.character.format.placeholder",
        "constant.other.placeholder",
        "invalid",
        "invalid.illegal",
      ],
      "special",
    ),
    rule(
      [
        "markup.underline.link",
        "string.other.link.title",
        "string.other.link.description",
        "string.other.link.destination",
        "markup.underline.link.image",
      ],
      "link",
    ),
    rule(["markup.inserted"], "inserted"),
    rule(["markup.deleted"], "deleted"),
    rule(["markup.changed"], "changed"),
    // The workbench's three rules: a shell command's bare arguments and flags
    // are the body (the owner's ruling); a number's parts are the number.
    rule(
      [
        "string.unquoted.argument.shell",
        "constant.other.option.dash.shell",
        "source.shell string.unquoted.argument",
        "source.shell constant.other.option",
        "string.regexp.unquoted.shell",
        "meta.for.in.shell string.unquoted.shell",
      ],
      "text",
    ),
    // Headings and bold text keep the body: no weight, no colour.
    rule(
      [
        "markup.heading",
        "entity.name.section.markdown",
        "markup.bold",
        "markup.italic",
      ],
      "text",
    ),
    // A Markdown link's brackets are the body.
    rule(
      [
        "punctuation.definition.link.title.begin.markdown",
        "punctuation.definition.link.title.end.markdown",
        "punctuation.definition.metadata.markdown",
        "punctuation.definition.link.markdown",
      ],
      "text",
    ),
    // A tag's angle brackets are the body.
    rule(["punctuation.definition.tag"], "text"),
  ],
};

let shiki: Promise<HighlighterCore> | undefined;
let shikiNow: HighlighterCore | undefined;

/** Core and the JavaScript engine, loaded once, on first use. Strict: every grammar compiles under it. */
function getShiki(): Promise<HighlighterCore> {
  shiki ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] =
      await Promise.all([
        import("shiki/core"),
        import("shiki/engine/javascript"),
      ]);
    const core = await createHighlighterCore({
      themes: [shikiTheme],
      langs: [],
      engine: createJavaScriptRegexEngine({ forgiving: false }),
    });
    shikiNow = core;
    return core;
  })();
  return shiki;
}

/** Shiki's name for a language id. */
const SHIKI_NAME: Record<string, string> = { bash: "shellscript" };
const shikiName = (id: string) => SHIKI_NAME[id] ?? id;

/** Loads a language into Shiki; false for one it does not hold. */
export async function loadShikiLanguage(id: string): Promise<boolean> {
  const loader = (shikiLanguages as Record<string, () => Promise<unknown>>)[id];
  if (!loader) return false;
  const core = await getShiki();
  if (!core.getLoadedLanguages().includes(shikiName(id)))
    await core.loadLanguage(loader as never);
  return true;
}

/** True when Shiki holds a language now. */
function shikiHas(id: string): boolean {
  return !!shikiNow && shikiNow.getLoadedLanguages().includes(shikiName(id));
}

const COLOUR = /^var\(--code-([a-z-]+)\)$/i;
/** A Shiki token's role, from its colour. */
function tokenRole(token: Pick<ThemedToken, "color">): number {
  const name = COLOUR.exec(token.color ?? "")?.[1]?.toLowerCase();
  return name && isRole(name) ? ROLE_INDEX[name] : 0;
}

/** One line tokenised from a grammar state: its paint and the state it ends in. */
function tokeniseLine(
  id: string,
  line: string,
  state: GrammarState | undefined,
): { paint: Paint; state: GrammarState | undefined } {
  const core = shikiNow!;
  const result = core.codeToTokens(line, {
    lang: shikiName(id),
    theme: THEME,
    grammarState: state,
  });
  const paint = new Uint8Array(line.length);
  let at = 0;
  for (const token of result.tokens[0] ?? []) {
    paint.fill(tokenRole(token), at, at + token.content.length);
    at += token.content.length;
  }
  return { paint, state: core.getLastGrammarState(result.tokens) };
}

/** A text painted by Shiki, synchronously, when Shiki holds the language now; else null. */
export function shikiPaintSync(id: string, text: string): Paint | null {
  if (!shikiHas(id)) return null;
  const core = shikiNow!;
  const result = core.codeToTokens(text, { lang: shikiName(id), theme: THEME });
  const paint = new Uint8Array(text.length);
  const starts = lineStarts(text);
  result.tokens.forEach((tokens, line) => {
    let at = starts[line] ?? text.length;
    for (const token of tokens) {
      paint.fill(tokenRole(token), at, at + token.content.length);
      at += token.content.length;
    }
  });
  return paint;
}

/**
 * Two grammar states are one when their stacks are. Shiki 4.5.0's
 * `GrammarState` has no `equals`; its stack, reached through the `@internal`
 * `getInternalStack()`, is vscode-textmate's `StateStack`, whose `equals` is
 * public. `highlight-session.test.ts` guards it.
 */
export function sameState(
  a: GrammarState | undefined,
  b: GrammarState | undefined,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const x = a.getInternalStack();
  const y = b.getInternalStack();
  return !!x && !!y && x.equals(y);
}

/** A fenced block: its opener and closer lines, and its language ("" for none). */
type Fence = { open: number; close: number; language: string };

/** Fences by `chat-text`'s rule: an opener is exactly three backticks and any info; a closer three alone. */
export function findFences(lines: string[]): Fence[] {
  const fences: Fence[] = [];
  let open = -1;
  let language = "";
  lines.forEach((raw, i) => {
    const line = raw.replace(/\r$/, "");
    if (open === -1) {
      const opener = /^```([^`]*)$/.exec(line);
      if (opener) {
        open = i;
        language = opener[1]!.trim().split(/\s+/)[0] ?? "";
      }
    } else if (/^```\s*$/.test(line)) {
      fences.push({ open, close: i, language });
      open = -1;
    }
  });
  if (open !== -1) fences.push({ open, close: lines.length, language });
  return fences;
}

/** The language id a fence names, or null for none or one the table does not know. */
type FenceLookup = (name: string) => string | null;

/** A session over Shiki: each line's tokens and the state it ends in, re-tokenised from the first changed line. */
export class ShikiSession implements HighlightSession {
  #id: string;
  #text: string;
  #lines: string[];
  #paints: Paint[] = [];
  #states: (GrammarState | undefined)[] = [];
  #cache: (HighlightedLine | null)[] = [];
  #fences: (name: string) => string | null;
  #regions: RegionTrees = new Map();
  #loading = new Set<string>();
  #listeners = new Set<() => void>();
  #disposed = false;

  constructor(id: string, code: string, fences: FenceLookup) {
    this.#id = id;
    this.#text = code;
    this.#lines = code.split("\n");
    this.#fences = fences;
    this.#tokenise(0, -1, [], []);
  }

  get settled(): boolean {
    return this.#loading.size === 0;
  }

  onChange(listener: () => void): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  dispose(): void {
    this.#disposed = true;
    this.#listeners.clear();
    for (const { tree } of this.#regions.values()) tree.delete();
    this.#regions.clear();
  }

  /**
   * Tokenises from line `from`. After line `last` (the last changed one), it
   * stops at the first line whose end state equals the old one at `old`
   * offset, and keeps the old lines from there.
   */
  #tokenise(
    from: number,
    last: number,
    oldPaints: Paint[],
    oldStates: (GrammarState | undefined)[],
    shift = 0,
  ): void {
    const count = this.#lines.length;
    const paints = this.#paints.slice(0, from);
    const states = this.#states.slice(0, from);
    let i = from;
    for (; i < count; i++) {
      const { paint, state } = tokeniseLine(
        this.#id,
        this.#lines[i]!,
        states[i - 1],
      );
      paints.push(paint);
      states.push(state);
      const old = i - shift;
      if (
        i > last &&
        old >= 0 &&
        old < oldStates.length &&
        sameState(state, oldStates[old])
      ) {
        for (let k = i + 1; k < count; k++) {
          paints.push(oldPaints[k - shift]!);
          states.push(oldStates[k - shift]);
        }
        break;
      }
    }
    this.#paints = paints;
    this.#states = states;
  }

  update(code: string, changes: HighlightChange[]): void {
    if (this.#disposed) return;
    const oldStarts = lineStarts(this.#text);
    const oldCount = this.#lines.length;
    this.#text = code;
    this.#lines = code.split("\n");
    if (!changes.length) return;
    const starts = lineStarts(code);
    const fromB = Math.min(...changes.map((c) => c.fromB));
    const fromA = Math.min(...changes.map((c) => c.fromA));
    const toB = Math.max(...changes.map((c) => c.toB));
    const first = Math.min(lineAt(starts, fromB), lineAt(oldStarts, fromA));
    const last = lineAt(starts, toB);
    const oldPaints = this.#paints;
    const oldStates = this.#states;
    this.#paints = oldPaints.slice(0, first);
    this.#states = oldStates.slice(0, first);
    this.#tokenise(
      first,
      last,
      oldPaints,
      oldStates,
      this.#lines.length - oldCount,
    );
    this.#cache = [];
  }

  /** Every line's paint, with the fences painted in their own language. */
  #paint(): Paint[] {
    const paints = this.#paints.map((p) => p.slice());
    const needs: Needs = new Set();
    if (this.#id === "markdown") {
      for (const fence of findFences(this.#lines)) {
        const keyword = ROLE_INDEX.keyword;
        paints[fence.open]!.fill(keyword);
        if (fence.close < this.#lines.length)
          paints[fence.close]!.fill(keyword);
        const body = this.#lines.slice(fence.open + 1, fence.close);
        const id = fence.language ? this.#fences(fence.language) : null;
        let paint: Paint | null;
        if (!id) {
          paint = new Uint8Array(body.join("\n").length).fill(
            ROLE_INDEX.string,
          );
        } else {
          paint = embeddedPaint(
            id,
            "whole",
            body.join("\n"),
            needs,
            this.#regions,
          );
          // Until the fence's grammar arrives, its lines are plain.
          if (!paint) paint = new Uint8Array(body.join("\n").length);
        }
        let at = 0;
        body.forEach((line, k) => {
          paints[fence.open + 1 + k] = paint!.slice(at, at + line.length);
          at += line.length + 1;
        });
      }
    }
    for (const language of needs) this.#load(language);
    return paints;
  }

  #load(language: string): void {
    if (this.#loading.has(language)) return;
    this.#loading.add(language);
    void loadNeeds(new Set([language])).then(() => {
      this.#loading.delete(language);
      if (this.#disposed) return;
      this.#cache = [];
      for (const listener of [...this.#listeners]) listener();
    });
  }

  lines(): HighlightedLine[] {
    if (this.#cache.length === this.#lines.length)
      return this.#cache as HighlightedLine[];
    const paints = this.#paint();
    this.#cache = this.#lines.map((line, i) =>
      lineTokens(line, 0, line.length, paints[i]!, 0),
    );
    return this.#cache as HighlightedLine[];
  }

  ranges(from: number, to: number): HighlightRange[] {
    const paints = this.#paint();
    const starts = lineStarts(this.#text);
    const ranges: HighlightRange[] = [];
    const first = lineAt(starts, Math.max(0, from));
    for (let i = first; i < this.#lines.length && starts[i]! < to; i++) {
      const start = starts[i]!;
      const end = start + this.#lines[i]!.length;
      const lo = Math.max(from, start);
      const hi = Math.min(to, end);
      if (lo < hi) ranges.push(...paintRanges(paints[i]!, start, lo, hi));
    }
    return ranges;
  }
}

function lineAt(starts: number[], index: number): number {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid]! <= index) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** Opens a Shiki session once its grammar is loaded; null for a language Shiki does not hold. */
export async function openShiki(
  id: string,
  fences: FenceLookup,
): Promise<((code: string) => ShikiSession) | null> {
  if (!(await loadShikiLanguage(id))) return null;
  return (code: string) => new ShikiSession(id, code, fences);
}
