/**
 * `bun scripts/convert-reference.ts [--print]`: converts the hand-labelled
 * reference (`context/research/2026-11-14-highlighting-reference.json`, in
 * the old nineteen slots) to Meridian's roles (013 decision 19), and writes
 * `tests/fixtures/highlight/roles.json`.
 *
 * Two inputs of ours decide the conversion:
 *
 * 1. **The mechanical map**, below: only (language, old slot) pairs that take
 *    one role whatever the span holds.
 * 2. **The hand list**, `tests/fixtures/highlight/roles-hand.json`: every span
 *    the map does not decide or must override, each citing the row of 013
 *    decision 13 that decides it. The hand list always overrides the map.
 *
 * A character the map does not decide and the hand list does not cover is an
 * error. The fixture keeps the reference's span format, `[line, startColumn,
 * endColumn, role]`, lines from 1, columns 0-based UTF-16 offsets, the end
 * exclusive, and any character no span covers is `text`. It carries the
 * reference's SHA-256 and each specimen's code SHA-256.
 *
 * `--print` prints, for every (language, old slot) pair present in either
 * set, the distinct texts of its spans and the rule that covers them: the
 * printout the design lead reads before the fixture is frozen.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export const REFERENCE_PATH =
  "context/research/2026-11-14-highlighting-reference.json";
export const HAND_PATH = "tests/fixtures/highlight/roles-hand.json";
export const FIXTURE_PATH = "tests/fixtures/highlight/roles.json";

/** The fourteen text roles, 013 decision 12's order. */
export const ROLES = [
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
export type Role = (typeof ROLES)[number];

/** The reference's two sets. */
export const SETS = ["workbench", "heldout"] as const;
export type SetName = (typeof SETS)[number];

/** One old slot to one role, in every language. */
const EVERY_LANGUAGE: Record<string, Role> = {
  foreground: "text",
  comment: "comment",
  string: "string",
  number: "number",
  function: "function",
  self: "keyword",
  decorator: "meta",
  invalid: "special",
  link: "link",
  inserted: "inserted",
  deleted: "deleted",
  changed: "changed",
  keyword: "keyword",
  escape: "special",
  builtin: "function",
  type: "type",
  constant: "constant",
};

/** `property`, by language: the languages where it takes one role. */
const PROPERTY: Record<string, Role> = {
  json: "function",
  bash: "meta",
  python: "text",
  typescript: "text",
  javascript: "text",
  rust: "text",
  go: "text",
  java: "text",
  csharp: "text",
  ruby: "text",
  sql: "text",
  toml: "text",
};

/** `tag`, by language. */
const TAG: Record<string, Role> = { toml: "type" };

/** The role the mechanical map gives a (language, old slot) pair, or null where the hand list must decide. */
export function mechanicalRole(language: string, slot: string): Role | null {
  if (slot === "property") return PROPERTY[language] ?? null;
  if (slot === "tag") return TAG[language] ?? null;
  return EVERY_LANGUAGE[slot] ?? null;
}

/**
 * The rows of 013 decision 13 a hand change may cite. A hand change cites
 * one of these, never a highlighter's output. The two "known loss" rows (Go's
 * conversions, C#'s static receivers) are not here: they move no label.
 */
export const ROWS: Record<string, string> = {
  fields:
    "Variables, parameters, fields declared or read, member access, object-literal and hash keys: text",
  modules:
    "Modules, packages and namespaces, in imports and as qualifiers: text; only the type at the end of a path is type",
  self: "self, cls, this, super: keyword",
  "function-definitions":
    "Function and method definitions and calls, getters and setters at their definition: function",
  "built-in-functions": "Built-in functions: function",
  types:
    "Classes, structs, enums, interfaces, traits, type parameters, built-in types, names in type positions: type",
  strings:
    "String and character literals, with their quotes and prefixes: string",
  "regular-expressions": "Regular-expression literals, whole: special",
  escapes: "Escape sequences; interpolation delimiters; HTML entities: special",
  numbers: "Numbers, whole, a unit attached to the number: number",
  "language-constants":
    "true, false, null, None, nil, undefined, iota, ...: constant",
  "all-caps":
    "An identifier matching ^[A-Z][A-Z0-9_]+$ in a reference or assignment position: constant",
  "lowercase-constants":
    "Constants: real constants not in ALL_CAPS (Go const maxLines, a C# const MinElevation) move to text; only ALL_CAPS names, enum members and language constants are constant (decision 13, overrule 9)",
  "enum-members": "Enum members and variants: constant",
  decorators: "Decorators and annotations, marker and name: meta",
  macros:
    "Macros where the grammar marks one, preprocessor directives, Rust lifetimes: meta",
  comments: "Comments, with their markers: comment",
  "json-keys": "JSON: keys, with their quotes: function",
  "yaml-keys": "YAML, TOML: keys: text",
  "yaml-anchors":
    "YAML: anchors and aliases with & and *: meta; the merge key <<: keyword",
  "css-properties": "CSS: property names, media features: keyword",
  "css-at-rules": "CSS: at-rules: keyword",
  "css-selectors":
    "CSS: element, class and id selectors with their . and #; keyframe selectors: type",
  "css-pseudo":
    "CSS: pseudo-classes and pseudo-elements with their colons: meta",
  "css-custom-properties": "CSS: custom properties, also inside var(): meta",
  "css-keyword-values": "CSS: keyword values: constant",
  "markup-tags":
    "HTML, Svelte, JSX: element tag names: keyword; the angle brackets: text",
  "markup-components":
    "HTML, Svelte, JSX: components (a capitalised tag): type",
  "markup-attributes":
    "HTML, Svelte, JSX: attribute names: meta; attribute values: string",
  doctype: "HTML: <!DOCTYPE html>: meta",
  braces:
    "Svelte, JSX: expression braces { }; Svelte's block marks: text; the #if, :else, /if words keyword",
  runes: "Svelte: runes: function",
  "python-built-in-types":
    "Python: str, int, float, … wherever they stand: type",
  "js-globals":
    "JavaScript, TypeScript: global objects that are not classes: text, as namespaces",
  "toml-tables":
    "TOML: table names (`[server]`, `[[bin]]`) with their brackets: type",
  "ruby-classes":
    "Ruby: a capitalised constant that names a class or module (`Ledger.new`, `Float()`): type",
  "capitalised-receivers":
    "Java, Kotlin: a capitalised receiver or callee: type",
};

export type HandEntry = {
  set: SetName;
  specimen: string;
  line: number;
  start: number;
  end: number;
  /** The covered text, checked against the code. */
  text: string;
  /** The reference's slot over the range ("foreground" where it has none). */
  slot: string;
  role: Role;
  /** A key of `ROWS`. */
  row: string;
};

export type Span = [line: number, start: number, end: number, role: string];

type ReferenceSpecimen = {
  language: string;
  sha256: string;
  characters: number;
  spans: Span[];
};
export type Reference = {
  sets: Record<SetName, { specimens: Record<string, ReferenceSpecimen> }>;
};

export type FixtureSpecimen = {
  language: string;
  sha256: string;
  characters: number;
  spans: Span[];
};
export type Fixture = {
  about: string;
  source: { path: string; sha256: string };
  hand: { path: string; sha256: string; entries: number };
  format: Record<string, string>;
  roles: readonly string[];
  sets: Record<SetName, { specimens: Record<string, FixtureSpecimen> }>;
};

const sha256 = (text: string) =>
  new Bun.CryptoHasher("sha256").update(text).digest("hex");

/** Each specimen's code, by set, read from the specimens and the gallery. */
export async function readCodes(
  root = process.cwd(),
): Promise<Record<SetName, Record<string, string>>> {
  const { SPECIMENS } = await import(
    path.join(root, "tests/fixtures/highlight/specimens.ts")
  );
  const { CODE_SAMPLES } = await import(
    path.join(root, "src/lib/preview/code-samples.ts")
  );
  const workbench: Record<string, string> = {};
  for (const s of SPECIMENS as { id: string; code: string }[])
    workbench[s.id] = s.code;
  const heldout: Record<string, string> = {};
  for (const s of CODE_SAMPLES as { language: string; code: string }[])
    heldout[s.language] = s.code;
  return { workbench, heldout };
}

/** One old slot per UTF-16 code unit of each line ("foreground" where no span covers it). */
function slotGrid(code: string, spans: Span[]): string[][] {
  const units = code
    .split("\n")
    .map((line) => Array.from({ length: line.length }, () => "foreground"));
  for (const [line, start, end, slot] of spans)
    for (let c = start; c < end; c++) units[line - 1]![c] = slot;
  return units;
}

export type Conversion = {
  fixture: Fixture;
  /** (set, language, slot) → text → the rule that decided it. */
  pairs: Map<string, Map<string, Set<string>>>;
  errors: string[];
};

/** Converts the reference with the hand list. Pure: reads nothing itself. */
export function convert(
  reference: Reference,
  referenceText: string,
  hand: HandEntry[],
  handText: string,
  codes: Record<SetName, Record<string, string>>,
): Conversion {
  const errors: string[] = [];
  const pairs = new Map<string, Map<string, Set<string>>>();
  const note = (language: string, slot: string, text: string, rule: string) => {
    const key = `${language} ${slot}`;
    if (!pairs.has(key)) pairs.set(key, new Map());
    const texts = pairs.get(key)!;
    if (!texts.has(text)) texts.set(text, new Set());
    texts.get(text)!.add(rule);
  };

  for (const entry of hand) {
    if (!(entry.row in ROWS))
      errors.push(
        `hand entry cites no row of decision 13: ${JSON.stringify(entry)}`,
      );
    if (!(ROLES as readonly string[]).includes(entry.role))
      errors.push(`hand entry names no role: ${JSON.stringify(entry)}`);
  }

  const sets = {} as Fixture["sets"];
  for (const set of SETS) {
    const specimens: Record<string, FixtureSpecimen> = {};
    for (const [id, ref] of Object.entries(reference.sets[set].specimens)) {
      const code = codes[set][id];
      if (code === undefined) {
        errors.push(`${set} ${id}: no code`);
        continue;
      }
      if (sha256(code) !== ref.sha256)
        errors.push(
          `${set} ${id}: the code's SHA-256 differs from the reference's`,
        );
      const lines = code.split("\n");
      const slots = slotGrid(code, ref.spans);
      const roles = slots.map((line) => line.map(() => "" as string));
      // The hand list first: it always overrides the map.
      const handOf = hand.filter((e) => e.set === set && e.specimen === id);
      const byHand = slots.map((line) => line.map(() => "" as string));
      for (const entry of handOf) {
        const text = lines[entry.line - 1]?.slice(entry.start, entry.end);
        if (text !== entry.text)
          errors.push(
            `${set} ${id} ${entry.line}:${entry.start}-${entry.end}: hand text ${JSON.stringify(entry.text)} is ${JSON.stringify(text)} in the code`,
          );
        for (let c = entry.start; c < entry.end; c++) {
          const slot = slots[entry.line - 1]![c]!;
          if (/\s/.test(lines[entry.line - 1]![c]!)) continue;
          if (slot !== entry.slot)
            errors.push(
              `${set} ${id} ${entry.line}:${c}: hand says slot ${entry.slot}, the reference has ${slot}`,
            );
          if (byHand[entry.line - 1]![c])
            errors.push(`${set} ${id} ${entry.line}:${c}: two hand entries`);
          byHand[entry.line - 1]![c] = entry.role;
          roles[entry.line - 1]![c] = entry.role;
        }
        note(
          ref.language,
          entry.slot,
          entry.text,
          `hand: ${entry.role} (${entry.row})`,
        );
      }
      // Then the map, run by run of one old slot, for the printout.
      for (let l = 0; l < lines.length; l++) {
        const line = lines[l]!;
        let c = 0;
        while (c < line.length) {
          const slot = slots[l]![c]!;
          let e = c;
          while (e < line.length && slots[l]![e] === slot) e++;
          const mapped = mechanicalRole(ref.language, slot);
          for (let k = c; k < e; k++) {
            if (byHand[l]![k]) continue;
            if (/\s/.test(line[k]!)) {
              roles[l]![k] = mapped ?? "text";
              continue;
            }
            if (mapped === null) {
              errors.push(
                `${set} ${id} ${l + 1}:${k}: (${ref.language}, ${slot}) is not mechanical and no hand entry covers ${JSON.stringify(line.slice(c, e))}`,
              );
              roles[l]![k] = "text";
            } else roles[l]![k] = mapped;
          }
          // A run the hand list covers whole is noted by its hand entries.
          const free = [...line.slice(c, e)]
            .map((ch, i) => (byHand[l]![c + i] || /\s/.test(ch) ? "" : ch))
            .join("")
            .trim();
          if (free && slot !== "foreground")
            note(
              ref.language,
              slot,
              line.slice(c, e).trim(),
              mapped === null ? "UNCOVERED" : `map: ${mapped}`,
            );
          c = e;
        }
      }
      // The roles as spans: one per run of a role other than text.
      const spans: Span[] = [];
      roles.forEach((line, l) => {
        let c = 0;
        while (c < line.length) {
          const role = line[c]!;
          let e = c;
          while (e < line.length && line[e] === role) e++;
          if (role !== "text") spans.push([l + 1, c, e, role]);
          c = e;
        }
      });
      specimens[id] = {
        language: ref.language,
        sha256: ref.sha256,
        characters: ref.characters,
        spans,
      };
    }
    sets[set] = { specimens };
  }

  const fixture: Fixture = {
    about:
      "The hand-labelled reference converted to Meridian's roles (013 decision 19) by scripts/convert-reference.ts: the mechanical map, overridden by the hand list. Generated; do not edit.",
    source: { path: REFERENCE_PATH, sha256: sha256(referenceText) },
    hand: { path: HAND_PATH, sha256: sha256(handText), entries: hand.length },
    format: {
      span: "[line, startColumn, endColumn, role]",
      line: "1-based",
      columns:
        "0-based UTF-16 code units within the line; endColumn is exclusive",
      unlisted: "Any character no span covers is text.",
      scored: "Only non-whitespace characters are scored.",
      sha256: "Of the specimen's code, as the reference records it.",
    },
    roles: ROLES,
    sets,
  };
  return { fixture, pairs, errors };
}

/**
 * The fixture as written: one span per line, so a diff reads span by span,
 * then formatted by the repository's prettier, so the lint and a re-run agree.
 */
export async function serialise(fixture: Fixture): Promise<string> {
  const json = JSON.stringify(fixture, null, 2).replace(
    /\[\n\s+(\d+),\n\s+(\d+),\n\s+(\d+),\n\s+("[a-z-]+")\n\s+\]/g,
    "[$1, $2, $3, $4]",
  );
  const prettier = await import("prettier");
  return prettier.format(json, { parser: "json", filepath: FIXTURE_PATH });
}

/** Reads the inputs from the repository and converts. */
export async function convertFromFiles(
  root = process.cwd(),
): Promise<Conversion> {
  const referenceText = readFileSync(path.join(root, REFERENCE_PATH), "utf8");
  const handText = readFileSync(path.join(root, HAND_PATH), "utf8");
  return convert(
    JSON.parse(referenceText),
    referenceText,
    JSON.parse(handText).entries,
    handText,
    await readCodes(root),
  );
}

/** The printout: each pair, its distinct texts and what decided them. */
export function printout(conversion: Conversion): string {
  const out: string[] = [];
  for (const key of [...conversion.pairs.keys()].sort()) {
    const texts = conversion.pairs.get(key)!;
    const rules = new Set([...texts.values()].flatMap((r) => [...r]));
    out.push(`${key}: ${[...rules].sort().join("; ")}`);
    for (const [text, rule] of [...texts].sort(([a], [b]) =>
      a.localeCompare(b),
    ))
      out.push(`    ${JSON.stringify(text)}  ${[...rule].sort().join("; ")}`);
  }
  return out.join("\n");
}

if (import.meta.main) {
  const conversion = await convertFromFiles();
  if (process.argv.includes("--print")) console.log(printout(conversion));
  if (conversion.errors.length) {
    for (const e of conversion.errors.slice(0, 50)) console.error(e);
    console.error(
      `${conversion.errors.length} error(s); the fixture is not written`,
    );
    process.exit(1);
  }
  writeFileSync(FIXTURE_PATH, await serialise(conversion.fixture));
  console.log(`convert-reference wrote ${FIXTURE_PATH}`);
}
