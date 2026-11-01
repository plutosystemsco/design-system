import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";

/**
 * The editor's chrome and its highlight, from the tokens (004 decision 9).
 * Every value is a `var()`, read from `:root` wherever a name exists there.
 * Five names live only in `@theme inline`: `--spacing`, `--text-sm`,
 * `--text-sm--line-height`, `--font-mono` and `--font-weight-medium`. They
 * resolve because Tailwind emits an inline theme variable whose name appears
 * in a scanned source file, and this file is one; an app that narrows its
 * `@source` must keep this folder among its sources.
 *
 * Selection and caret are the browser's own: no `drawSelection`, so no tint.
 */
export const codeTheme = EditorView.theme({
  "&": {
    color: "var(--code-foreground)",
    backgroundColor: "var(--code-background)",
    borderRadius: "var(--radius)",
  },
  // 001's focus recipe, around the whole editor, gutter included.
  "&.cm-focused": {
    outline: "var(--focus-width) solid var(--ring)",
    outlineOffset: "var(--focus-offset)",
  },
  ".cm-content": {
    caretColor: "var(--code-foreground)",
    padding: "calc(var(--spacing) * 3) 0",
  },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--text-sm--line-height)",
    // Code shows the characters that were typed (the checkpoint's call).
    fontVariantLigatures: "none",
    borderRadius: "var(--radius)",
    scrollbarColor: "var(--input) var(--muted)",
    scrollbarWidth: "thin",
  },
  ".cm-gutters": {
    backgroundColor: "var(--code-background)",
    color: "var(--muted-foreground)",
    borderRight: "var(--line-width) solid var(--border)",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 calc(var(--spacing) * 2) 0 calc(var(--spacing) * 3)",
  },
  // The active line is the opaque card step, not a tint.
  ".cm-activeLine": { backgroundColor: "var(--code-active-line)" },
  ".cm-activeLineGutter": { backgroundColor: "var(--code-active-line)" },
  // The base theme tints matched brackets; the tint is cleared and a hairline
  // drawn around each tells the pair.
  "&.cm-focused .cm-matchingBracket": {
    backgroundColor: "transparent",
    outline: "var(--line-width) solid var(--input)",
  },
  "&.cm-focused .cm-nonmatchingBracket": {
    backgroundColor: "transparent",
    color: "var(--destructive)",
    textDecoration: "underline wavy",
  },
  ".cm-placeholder": { color: "var(--muted-foreground)" },
  ".cm-specialChar": { color: "var(--destructive)" },
});

const slot = (name: string) => `var(--code-${name})`;

/**
 * The highlight, by role (007 decision 6): the same twenty-one code slots
 * Shiki reads in `code-block`, so the editor and the block colour the same
 * code the same way in every language with a Lezer grammar. A rule on a
 * parent tag catches its children and a child's rule wins. A definition is
 * also told by weight; headings and bold text by weight alone. Operators,
 * brackets, separators, names and parameters take the editor's own colour.
 */
export const codeHighlight = syntaxHighlighting(
  HighlightStyle.define([
    {
      tag: [
        tags.comment,
        tags.docString,
        tags.quote,
        tags.contentSeparator,
        tags.documentMeta,
      ],
      color: slot("comment"),
    },
    {
      tag: [
        tags.string,
        tags.special(tags.string),
        tags.regexp,
        tags.character,
        tags.attributeValue,
        tags.monospace,
      ],
      color: slot("string"),
    },
    { tag: [tags.escape, tags.special(tags.brace)], color: slot("escape") },
    { tag: [tags.number, tags.unit, tags.color], color: slot("number") },
    {
      tag: [
        tags.bool,
        tags.null,
        tags.atom,
        tags.constant(tags.variableName),
        tags.literal,
      ],
      color: slot("constant"),
    },
    {
      tag: [tags.keyword, tags.modifier, tags.processingInstruction, tags.list],
      color: slot("keyword"),
    },
    {
      tag: [
        tags.function(tags.variableName),
        tags.function(tags.propertyName),
        tags.macroName,
      ],
      color: slot("function"),
    },
    {
      tag: [
        tags.function(tags.definition(tags.variableName)),
        tags.function(tags.definition(tags.propertyName)),
      ],
      color: slot("function"),
      fontWeight: "var(--font-weight-medium)",
    },
    {
      tag: [tags.standard(tags.variableName), tags.standard(tags.propertyName)],
      color: slot("builtin"),
    },
    {
      tag: [
        tags.typeName,
        tags.standard(tags.typeName),
        tags.className,
        tags.definition(tags.className),
        tags.namespace,
      ],
      color: slot("type"),
    },
    {
      tag: [
        tags.tagName,
        tags.standard(tags.tagName),
        tags.special(tags.tagName),
        tags.definition(tags.tagName),
      ],
      color: slot("tag"),
    },
    {
      tag: [
        tags.propertyName,
        tags.definition(tags.propertyName),
        tags.attributeName,
        tags.special(tags.variableName),
        tags.labelName,
      ],
      color: slot("property"),
    },
    { tag: [tags.annotation, tags.meta], color: slot("decorator") },
    { tag: tags.self, color: slot("self") },
    {
      tag: [tags.link, tags.url],
      color: slot("link"),
      textDecoration: "underline",
    },
    { tag: tags.invalid, color: slot("invalid") },
    { tag: tags.inserted, color: slot("inserted") },
    { tag: tags.deleted, color: slot("deleted") },
    { tag: tags.changed, color: slot("changed") },
    {
      tag: [tags.heading, tags.strong],
      fontWeight: "var(--font-weight-medium)",
    },
    {
      tag: [
        tags.operator,
        tags.bracket,
        tags.separator,
        tags.punctuation,
        tags.name,
        tags.variableName,
        tags.definition(tags.variableName),
        tags.local(tags.variableName),
      ],
      color: slot("foreground"),
    },
  ]),
);
