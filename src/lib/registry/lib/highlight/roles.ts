/**
 * The code roles: Meridian's seven coloured roles, comment
 * and text, `number` of its own, and four the guide does not cover (a link
 * and a diff's three line roles). Each is one `--code-<role>` custom
 * property. A capture in our queries is named for its role, so no
 * capture-to-role map can drift from them.
 */

/** The fourteen text roles, in the code map's order. */
export const CODE_ROLES = [
  "text",
  "comment",
  "keyword",
  "function",
  "type",
  "string",
  "number",
  "constant",
  "meta",
  "special",
  "link",
  "inserted",
  "deleted",
  "changed",
] as const;

export type CodeRole = (typeof CODE_ROLES)[number];

/**
 * Each role's classes, written out so Tailwind's scanner sees every one. A
 * body token carries none: its colour comes from the surface, which reads
 * `text-code-text`. A link is underlined, the one style in the palette; no
 * token is bold or italic.
 */
export const roleClasses: Record<CodeRole, string> = {
  text: "",
  comment: "text-code-comment",
  keyword: "text-code-keyword",
  function: "text-code-function",
  type: "text-code-type",
  string: "text-code-string",
  number: "text-code-number",
  constant: "text-code-constant",
  meta: "text-code-meta",
  special: "text-code-special",
  link: "text-code-link underline",
  inserted: "text-code-inserted",
  deleted: "text-code-deleted",
  changed: "text-code-changed",
};

/** The classes a token of this role renders with; "" for `text`. */
export function tokenClass(role: CodeRole): string {
  return roleClasses[role] ?? "";
}

const ROLE_SET = new Set<string>(CODE_ROLES);

/** True for a name that is a role. */
export function isRole(name: string): name is CodeRole {
  return ROLE_SET.has(name);
}

/** A role's index, 1 to 14; 0 is "not painted". The engines paint into byte arrays. */
export const ROLE_INDEX: Record<CodeRole, number> = Object.fromEntries(
  CODE_ROLES.map((role, i) => [role, i + 1]),
) as Record<CodeRole, number>;

/** The role at an index painted by an engine; `text` for 0. */
export function roleAt(index: number): CodeRole {
  return CODE_ROLES[index - 1] ?? "text";
}

/** One highlighted token. Render it as a `<span>` with this class. */
export type HighlightedToken = {
  content: string;
  /** The token's classes, or "" for a body token. */
  class: string;
};

/** A line of plain text, or the highlighted tokens of a line. */
export type HighlightedLine = string | HighlightedToken[];

/**
 * One edit, in UTF-16 offsets: the replaced range of the old document, then
 * the range that replaced it in the new one. The shape of CodeMirror's
 * `iterChanges`.
 */
export type HighlightChange = {
  fromA: number;
  toA: number;
  fromB: number;
  toB: number;
};

/** A run of one role, in UTF-16 offsets of the document. */
export type HighlightRange = { from: number; to: number; role: CodeRole };

/**
 * The highlighter's state for one changing document. `update` applies every
 * change of one transaction and parses once; `lines` and `ranges` give the
 * current highlighting; `onChange` fires when a grammar the text embeds
 * arrives; `settled` is true when nothing is loading.
 */
export type HighlightSession = {
  update(code: string, changes: HighlightChange[]): void;
  lines(): HighlightedLine[];
  ranges(from: number, to: number): HighlightRange[];
  onChange(listener: () => void): () => void;
  readonly settled: boolean;
  dispose(): void;
};

/** A painted run of text, as a byte per UTF-16 unit: 0 unpainted, else a role's index. */
export type Paint = Uint8Array;

/** The line starts of a text. */
export function lineStarts(text: string): number[] {
  const starts = [0];
  for (let i = text.indexOf("\n"); i !== -1; i = text.indexOf("\n", i + 1))
    starts.push(i + 1);
  return starts;
}

/** The tokens of one line from a paint of the document (`paint[i]` for offset `base + i`). */
export function lineTokens(
  text: string,
  from: number,
  to: number,
  paint: Paint,
  base: number,
): HighlightedToken[] {
  const tokens: HighlightedToken[] = [];
  let start = from;
  while (start < to) {
    const role = roleAt(paint[start - base] ?? 0);
    let end = start + 1;
    while (end < to && roleAt(paint[end - base] ?? 0) === role) end++;
    tokens.push({ content: text.slice(start, end), class: tokenClass(role) });
    start = end;
  }
  return tokens;
}

/** The runs of a paint that carry a role other than `text`. */
export function paintRanges(
  paint: Paint,
  base: number,
  from: number,
  to: number,
): HighlightRange[] {
  const ranges: HighlightRange[] = [];
  let i = from;
  while (i < to) {
    const index = paint[i - base] ?? 0;
    let j = i + 1;
    while (j < to && (paint[j - base] ?? 0) === index) j++;
    const role = roleAt(index);
    if (role !== "text") ranges.push({ from: i, to: j, role });
    i = j;
  }
  return ranges;
}

/** Every line of a text, highlighted from a paint of the whole of it. */
export function paintLines(text: string, paint: Paint): HighlightedLine[] {
  const starts = lineStarts(text);
  return starts.map((start, i) => {
    const end = i + 1 < starts.length ? starts[i + 1]! - 1 : text.length;
    return lineTokens(text, start, end, paint, 0);
  });
}
