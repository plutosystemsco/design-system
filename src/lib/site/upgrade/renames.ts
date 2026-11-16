/**
 * 020 decision 1: the rename table. One row per name the Kuiper rename
 * changed. The rename script, the upgrade guide, the changelog test, the
 * stray-name test and check 20 all read it, so the guide cannot list a
 * rename the code did not make.
 *
 * Internal names an app never sees (the bench, scratch prefixes, fixture
 * package names, the plugin, the examples folder, thumbnail files) are rules
 * in `scripts/rename-kuiper.ts`, not rows here.
 */
export type RenameKind =
  | "theme item"
  | "storage key"
  | "context key, across items"
  | "context key, inside an item"
  | "keyframes"
  | "Shiki theme"
  | "site page"
  | "token file"
  | "registry name"
  | "package name";

export type Rename = {
  kind: RenameKind;
  old: string;
  new: string;
  /** The release the old name stops working in, or "none": it stopped now. */
  alias: "0.14.0" | "none";
  /** Who depends on the old name. */
  seenBy: string;
  /** What an app does, in one sentence. */
  todo: string;
};

const key = (
  kind: "context key, across items" | "context key, inside an item",
  name: string,
  seenBy: string,
): Rename => ({
  kind,
  old: `pluto:${name}`,
  new: `kuiper:${name}`,
  alias: "0.14.0",
  seenBy,
  todo: `Replace \`pluto:${name}\` with \`kuiper:${name}\` in your own code that reads it.`,
});

const frame = (name: string): Rename => ({
  kind: "keyframes",
  old: `pluto-${name}`,
  new: `kuiper-${name}`,
  alias: "none",
  seenBy:
    "An app's own CSS, markup or script that names the keyframes: `app.css`, a component's `<style>`, an inline `style`, an `animation-name`, a Web Animations call.",
  todo: `Rename your own uses of \`pluto-${name}\` to \`kuiper-${name}\` before you update the theme.`,
});

export const RENAMES: readonly Rename[] = [
  {
    kind: "theme item",
    old: "pluto-theme",
    new: "kuiper-theme",
    alias: "0.14.0",
    seenBy:
      "Scripts and docs that install the theme by its old name; every item that names the theme.",
    todo: "Install the theme by its new name in step 2; the old name installs it until 0.14.0.",
  },
  {
    kind: "storage key",
    old: "pluto-theme",
    new: "kuiper-theme",
    alias: "0.14.0",
    seenBy:
      "Every visitor's stored light or dark choice, and the `theme` item.",
    todo: "Update `theme`; a visitor's old choice is carried over on their first visit.",
  },
  key(
    "context key, across items",
    "field",
    "A mixed app: an old `field` with a new control, or the reverse; an app's own control.",
  ),
  key(
    "context key, across items",
    "field-set",
    "A mixed app: an old `field` with a new `radio-group`, or the reverse.",
  ),
  key(
    "context key, inside an item",
    "field-label",
    "Only an app's own code that reads the key.",
  ),
  key(
    "context key, inside an item",
    "tooltip",
    "Only an app's own code that reads the key.",
  ),
  key(
    "context key, inside an item",
    "item-group",
    "Only an app's own code that reads the key.",
  ),
  key(
    "context key, inside an item",
    "popover",
    "Only an app's own code that reads the key.",
  ),
  key(
    "context key, inside an item",
    "accordion-item",
    "Only an app's own code that reads the key.",
  ),
  frame("enter"),
  frame("exit"),
  frame("mark-dock"),
  frame("mark-fade"),
  {
    kind: "Shiki theme",
    old: "pluto-code",
    new: "kuiper-code",
    alias: "none",
    seenBy:
      "Only code that passes the name to the highlighter's Shiki core, or reads `shikiTheme.name`.",
    todo: "Pass `kuiper-code` instead.",
  },
  {
    kind: "site page",
    old: "/components/pluto-theme/",
    new: "/components/kuiper-theme/",
    alias: "none",
    seenBy: "Links and bookmarks to the theme's page, and its Markdown twin.",
    todo: "Nothing: the old address redirects, permanently.",
  },
  {
    kind: "site page",
    old: "/example/pluto-theme/",
    new: "/example/kuiper-theme/",
    alias: "none",
    seenBy: "Links to one of the theme's examples.",
    todo: "Nothing: the old addresses redirect, permanently.",
  },
  {
    kind: "token file",
    old: "tokens/pluto.tokens.json",
    new: "tokens/kuiper.tokens.json",
    alias: "none",
    seenBy:
      "A tool that reads the raw token file from `main`; tagged URLs keep the old path.",
    todo: "Read `tokens/kuiper.tokens.json`.",
  },
  {
    kind: "registry name",
    old: "pluto",
    new: "kuiper",
    alias: "none",
    seenBy: "Nothing an app sees: the built index does not carry it.",
    todo: "Nothing.",
  },
  {
    kind: "package name",
    old: "pluto-design-system",
    new: "kuiper-design-system",
    alias: "none",
    seenBy: "Nothing an app sees: the package is private.",
    todo: "Nothing.",
  },
];
