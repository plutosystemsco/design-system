/**
 * 020 decision 12: the "Upgrade to 0.13.0" guide's data. The page at
 * `/changelog/0.13.0/upgrade/` renders it. A ledger file (`roadmap.md` §2):
 * each later 0.13.0 specification with an interface change appends its
 * section to `SECTIONS`, in the same shape: what changed, who sees it, what
 * to do, until when. Text is the changelog's small Markdown: `code` and
 * **bold**.
 */
import { addCommand, SITE_REGISTRY } from "../site.ts";
import { RENAMES, type Rename } from "./renames.ts";

export const VERSION = "0.13.0";
export const GUIDE_PATH = `/changelog/${VERSION}/upgrade/`;

export type UpgradeStep = {
  /** What to do, in one or two sentences. */
  text: string;
  /** A command to run, shown as code with a copy button. */
  command?: string;
  /** The command's language, for the highlighter. */
  language?: "bash";
};

export type UpgradeSection = {
  /** The specification that made the change. */
  spec: string;
  /** The section's anchor. */
  id: string;
  title: string;
  /** What changed, in one paragraph. */
  summary: string;
  /** The rename table's rows the section covers. */
  renames: readonly Rename[];
  /** In order. */
  steps: readonly UpgradeStep[];
};

/** 1. Who this is for. */
export const WHO = [
  "An app that installed from this registry before 0.13.0.",
  // 020d decision 8: the only earlier release an app can be on is 0.11.0.
  "Coming from 0.11.0, as every app is: 0.12.0 was never released. This page is the whole path from 0.11.0, and the changelog's [0.13.0 entry](/changelog/#v0-13-0) lists every change.",
];

/**
 * 2. Before you start. The registry's address only: no command here adds
 * anything, since nothing may be updated before step 1 (020 review,
 * finding 1).
 */
export const BEFORE: UpgradeStep = {
  text: "Commit your app, so every change below can be read and undone. The commands in step 2 install from this release, `v0.13.0`, at this address:",
  command: SITE_REGISTRY,
  language: "bash",
};

/** 3 on: one section per specification with an interface change. */
export const SECTIONS: readonly UpgradeSection[] = [
  {
    spec: "020",
    id: "020",
    title: "020: Pluto is now Kuiper in code",
    summary:
      "The system is the Kuiper Design System, and its code names now say so. The company, its mark and the site's address keep the Pluto name. Most old names keep working until 0.14.0; the four keyframe names do not.",
    renames: RENAMES,
    steps: [
      {
        text: "**Before you update anything, rename your own uses of the four keyframes:** `pluto-enter` to `kuiper-enter`, `pluto-exit` to `kuiper-exit`, `pluto-mark-dock` to `kuiper-mark-dock` and `pluto-mark-fade` to `kuiper-mark-fade`. Look in `app.css`, in components' `<style>` blocks, in inline `style` attributes, in `animation-name` declarations and in scripts. The old names leave your built CSS the moment the theme updates, and nothing warns you. This finds them. Matches inside the theme's block in `app.css` (its four `@keyframes pluto-…` rules, `--animate-enter`, `--animate-exit` and the lockup's `animation`) are the theme's own: the update in step 2 rewrites them, and step 4 deletes what is left. If you have a class of your own named `scrollbar-code`, rename it too: the theme now defines one, and its rule would apply to your elements. The command finds it as well.",
        command:
          "grep -rn -e pluto-enter -e pluto-exit -e pluto-mark- -e scrollbar-code src",
        language: "bash",
      },
      {
        text: "Update the theme with `add kuiper-theme`. Then, on the second line, update only the parts your app has: `theme` if it has it, and `field` with the field controls it uses (`input`, `textarea`, `checkbox`, `switch`, `native-select`, `input-otp`, `input-group`, `radio-group`). If your app has any of the code items, `highlighter`, `use-highlighted-code`, `code-block`, `code-editor` and `code-languages`, or `kbd` or `error-summary`, name those on the same line too: the theme updated alone paints code half in the old palette and half in the new. Name only what you have, since an `add` installs an item your app lacks. `ls src/lib/components/ui` lists the parts you have. The second line is an example for an app with `field` and `input`; name yours instead. `-o` lets the theme update `app.css` without asking; left off the second line, the command asks before it overwrites each file you have, since an update replaces your own edits to them. Update `field` before your own control that imports `FIELD_CONTEXT_KEY` or `FIELD_SET_CONTEXT_KEY`.",
        command: `${addCommand("kuiper-theme")} -o\n${addCommand("field input")}`,
        language: "bash",
      },
      {
        text: "Find the other old names in your own code. They keep working until 0.14.0; replace each with its new name from the table. This finds them:",
        command: "grep -rn -e pluto-theme -e pluto: -e pluto-code src",
        language: "bash",
      },
      {
        text: "Delete the four dead `@keyframes pluto-…` rules from `app.css`. The command adds the new rules and never deletes the old ones, and nothing uses them now.",
      },
      {
        text: "If your app allows the theme's head script by a Content Security Policy hash, update the hash: `THEME_SCRIPT` changed. An app that passes `nonce` to `ThemeScript` has nothing to do.",
      },
      {
        text: "If a tool reads the token file from `main`, read `tokens/kuiper.tokens.json`. A URL at a release tag keeps the old path.",
      },
    ],
  },
  // 020d decision 8: the interface changes an app on 0.11.0 has not seen, from
  // 013, 014, 016, 019 and 019a. Its steps follow the update in 020's step
  // 2, each in the changelog's words, and each deletion follows its grep.
  {
    spec: "013",
    id: "from-0-11-0",
    title: "From 0.11.0: code, the yellow and the sticky bar",
    summary:
      "Since 0.11.0, code is highlighted by tree-sitter and coloured in the Tombaugh palette, on a white ground in light mode; twelve code variables are removed, and the code items' exports change. The brand's yellow is yellower. Every letter spacing is the font's default. The sticky bar's scroll padding is a default your own value wins over. `kbd` sits on the code ground, and `error-summary`'s alert moves inside it. Who sees it: every app coming from 0.11.0. Nothing is renamed with an alias. The update itself is step 2 above; these steps follow it.",
    renames: [],
    steps: [
      {
        text: "Install the highlighter's packages: `highlighter` now depends on `web-tree-sitter` and 19 grammar packages.",
        command: "bun install",
        language: "bash",
      },
      {
        text: "**Before step 3 deletes them, find and replace your own uses of the twelve removed names:** `--code-foreground`, `--code-escape`, `--code-builtin`, `--code-tag`, `--code-property`, `--code-decorator`, `--code-self`, `--code-invalid`, `--syntax-amber`, `--syntax-purple`, `--syntax-teal` and `--syntax-cyan`. That covers their `text-code-*`, `--color-` and `syntax-*` forms, and a `var()` of any of them. Until step 3 they still compile, in their old colours; once their lines are gone, a use not replaced leaves your built CSS, and nothing warns you. This finds them. Matches inside the theme's own block in `app.css` are the lines step 3 deletes. Replace `--code-foreground` with `--code-text`. Give each other use one of the roles that are left: the changelog's code-map `kuiper-theme` bullet lists them.",
        command:
          "grep -rn -e code-foreground -e code-escape -e code-builtin -e code-tag -e code-property -e code-decorator -e code-self -e code-invalid -e syntax-amber -e syntax-purple -e syntax-teal -e syntax-cyan src",
        language: "bash",
      },
      {
        text: "Delete the stale lines from `app.css`: the twelve variables in `:root` and in `.dark`, the `--color-` form of each in `@theme inline`, and the CLI's derived `--code-…: var(--code-…)` line for each removed `--code-*` name. The CLI never deletes a variable the new theme lacks.",
      },
      {
        text: "Delete the old unlayered `html:has([data-sticky-bar]) { scroll-padding-top: var(--size-bar); }` rule from your stylesheet: the CLI does not remove it, and while it stays it overrides your own value. With a sticky header of your own, set `scroll-padding-top` on `html` to its height.",
      },
      {
        text: 'Replace the removed and renamed exports. From `code-editor`: in place of `codeHighlight`, add `codeHighlighting(language)` for the editor\'s language; in place of `pythonLanguageConfigured`, use `pythonLanguage` from `@codemirror/lang-python` with `codeHighlighting("python")`; drop `pythonRoles`. From `highlighter`: `codeTheme` is now `shikiTheme`, and `tokenClasses` is now `roleClasses`.',
      },
      {
        text: '`error-summary`: `role="alert"` moved from the root to a new inner element. Code or tests that found the alert on the root, or expected `getByRole("alert")` to be the focused element, look for `[data-slot="error-summary-content"]`. A class on the root that targeted its children targets that element.',
      },
      {
        text: '`kbd`: a key now sits on the code ground, and its text can be selected. Pass `class="bg-muted"` to keep the old ground, and `class="select-none"` to keep a key unselectable.',
      },
      {
        text: "If your app sets a strict Content Security Policy, add `'wasm-unsafe-eval'` to its `script-src`: the highlighter runs tree-sitter as WebAssembly.",
      },
    ],
  },
  // 026 decision 26: the toast. Nothing is renamed or deprecated; the
  // section is for apps that use `app-shell`, which mounts the toaster
  // (026 D1), and apps that installed shadcn-svelte's `sonner`.
  {
    spec: "026",
    id: "026",
    title: "026: a toast of Kuiper's own",
    summary:
      "Kuiper has a `toast` of its own, on `status`, and `app-shell` now mounts it. Who sees it: an app that uses `app-shell`, and an app that installed shadcn-svelte's `sonner`. Nothing is deprecated.",
    renames: [],
    steps: [
      {
        text: "With `app-shell`: `add app-shell`. If you moved the layout into your routes, add the two imports, the two navigation lines and `<Toaster />` after `<AppShellSkipLink />` by hand, as the layout's comment shows.",
        command: addCommand("app-shell"),
        language: "bash",
      },
      {
        text: "Coming from `sonner`: add the toast. Mount `<Toaster />` where `sonner`'s toaster was, in your root layout (`app-shell` mounts it already), and remove that one, so two corners do not compete.",
        command: addCommand("toast"),
        language: "bash",
      },
      {
        text: "Map the calls. `toast.warning` becomes `toast.caution`. `duration: Infinity` keeps the toast, as in `sonner`. A finite `duration` below 6000 is raised to 6000, and is ignored on errors, cautions, loading and action toasts. `toast.promise` takes the same three messages. Two `sonner` toasts with the same text and an action stay two toasts. `toast.custom`, rich colours, `position`, `expand` and swipe have no equivalent.",
      },
      {
        text: 'To meet WCAG 2.2.1, bind the toaster\'s `timers` to a setting the person can reach before the first toast, `<Toaster timers={keep ? "off" : "on"} />`, or keep every timed message on the page too. Call `toast.navigating()` in `beforeNavigate` and `toast.navigated()` in `afterNavigate`, in your root layout, if you do not use `app-shell`.',
      },
      {
        text: "Once nothing imports them, remove `svelte-sonner`, and `mode-watcher` if nothing else uses it.",
        command: "bun remove svelte-sonner",
        language: "bash",
      },
    ],
  },
];

/** 4. What keeps working until 0.14.0, and what does not. */
export const UNTIL = {
  release: "0.14.0",
  keeps: [
    "`add pluto-theme`, which installs `kuiper-theme`.",
    "A visitor's stored choice under `pluto-theme`, carried over on their first visit.",
    "The old context keys, set beside the new ones, and read by the eight field controls.",
  ],
  stops: "The four old keyframe names stop now: rename them first (step 1).",
};

/** 5. What did not change. */
export const UNCHANGED = {
  names:
    "Every CSS variable, class, utility, prop, slot and export name the sections above do not name. The brand: Pluto Systems, its mark and the lockup. The site's address.",
  /** 020 decision 18: the exported constants that keep their names and change their values. */
  values: [
    ["THEME_KEY", "`kuiper-theme`"],
    ["THEME_SCRIPT", "the head script, which carries the old key over"],
    ["FIELD_CONTEXT_KEY", "`kuiper:field`"],
    ["FIELD_SET_CONTEXT_KEY", "`kuiper:field-set`"],
    [
      "shikiTheme.name",
      '`kuiper-code`. In 0.11.0 the export was `codeTheme`; "From 0.11.0", step 5, renames it.',
    ],
  ] as const,
};
