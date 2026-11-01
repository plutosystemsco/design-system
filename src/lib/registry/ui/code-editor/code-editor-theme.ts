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

/**
 * The highlight: the same twelve code slots Shiki reads in `code-block`, so
 * the editor and the block colour the same Python the same way. Operators,
 * brackets, separators, names and `meta` take the editor's own colour.
 */
export const codeHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: [tags.keyword, tags.modifier], color: "var(--code-keyword)" },
    {
      tag: [tags.string, tags.special(tags.string), tags.escape],
      color: "var(--code-string)",
    },
    {
      tag: [tags.number, tags.bool, tags.null, tags.atom],
      color: "var(--code-constant)",
    },
    {
      // A defined or called name is told by weight, not colour.
      tag: [
        tags.function(tags.variableName),
        tags.function(tags.propertyName),
        tags.function(tags.definition(tags.variableName)),
        tags.definition(tags.className),
      ],
      color: "var(--code-function)",
      fontWeight: "var(--font-weight-medium)",
    },
    { tag: tags.comment, color: "var(--code-comment)" },
    {
      tag: [tags.link, tags.url],
      color: "var(--code-link)",
      textDecoration: "underline",
    },
    { tag: tags.invalid, color: "var(--destructive)" },
  ]),
);
