import { EditorView } from "@codemirror/view";

/**
 * The editor's chrome, from the tokens. Its colour comes from the
 * highlighter, through `codeHighlighting` (013 decision 16).
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
    color: "var(--code-text)",
    backgroundColor: "var(--code-background)",
    borderRadius: "var(--radius)",
  },
  // The global focus recipe, around the whole editor, gutter included. The
  // editor sits inside its root's hairline, so the offset adds the line
  // width: the indicator sits as far outside the hairline as a code block's.
  "&.cm-focused": {
    outline: "var(--focus-width) solid var(--ring)",
    outlineOffset: "calc(var(--focus-offset) + var(--line-width))",
  },
  ".cm-content": {
    caretColor: "var(--code-text)",
    padding: "calc(var(--spacing) * 3) 0",
  },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--text-sm--line-height)",
    // Code shows the characters that were typed: no ligatures.
    fontVariantLigatures: "none",
    borderRadius: "var(--radius)",
    // The track is the code ground.
    scrollbarColor: "var(--input) var(--code-background)",
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
  // The active line, one opaque step from the ground, not a tint.
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
