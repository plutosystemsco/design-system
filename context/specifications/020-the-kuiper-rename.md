# 020 — The Kuiper rename

- **Status:** **Ready to build: owner answers recorded, review approved with changes, all applied** (2026-11-15). Revised after review: every finding of [`../reviews/020-the-kuiper-rename-spec-2026-11-15.md`](../reviews/020-the-kuiper-rename-spec-2026-11-15.md), and the re-review's R1 to R3, are answered under "Review". The owner's answers to Q1 to Q5 are decision 19 and the Landing notes.
- **Date:** 2026-11-15
- **Author:** the design lead
- **Kind:** a rename across the whole tree. Every lane (`roadmap.md` §2, "Lanes"). **Interface changes:** the theme item's name; the `theme` item's storage key; the context keys; the four keyframes in `kuiper-theme`; and the values of five exported constants: `THEME_KEY`, `THEME_SCRIPT`, `FIELD_CONTEXT_KEY`, `FIELD_SET_CONTEXT_KEY` and `shikiTheme.name` (decision 18). Each has a changelog bullet and a section in the new upgrade guide (decision 12). One registry entry is added, the `pluto-theme` alias (decision 3), and one file joins the `theme` item (decision 5). No token, no dependency, no prop, no class, no CSS variable and no export *name* changes.
- **Depends on:** the `v0.12.0` tag, which is not yet made (EXECUTED, `git tag`, 2026-11-15). Before the tag, `019a` must land; its builder is editing tokens, the site chrome and tests in the working tree now. `020` starts on a clean tree cut from that tag (`roadmap.md` §3, "The rename goes first, alone").
- **Ships with:** 0.13.0, as its first landing. Every other 0.13.0 build waits for it.
- **Blocks:** `021` to `031b`. Each writes the new names from birth.
- **Design call.** This specification is the record of the owner's rulings it carries. `decisions.md` was retired on 2026-11-15; its last version, at `beeb67e`, holds the original wording (`context/README.md`).
  - **The owner, 2026-11-15:** the system is the Kuiper Design System. Its code names stay `pluto` in 0.12.0 and change in 0.13.0, by their own specification, with a migration guide for installed apps. Pluto Systems remains the company and its brand: the four-dot mark, the colours and the type. The address stays `pluto-systems-design.claygendron.workers.dev`.
  - **The owner, 2026-11-15:** the old `pluto` names keep working for one release after the rename: "`pluto-theme` and the old storage key work in 0.13.0 with a warning in the migration guide, and go in 0.14.0."
  - **The owner, 2026-11-15:** a migration note goes with every interface change; from 1.0, nothing is removed without a deprecation in an earlier minor release.
  - **Applied here (Q1, decided):** code names change in 0.13.0, and old names work for one release. So the context keys keep working until 0.14.0 as well (decision 4).
  - **The owner's answers to Q2 to Q5, 2026-11-15** (decision 19): system prose says Kuiper, the Brand pages and "Pluto Systems" keep Pluto; no alias for the token file's path; the guide lives at `/changelog/0.13.0/upgrade/`; the four old keyframe names are removed now, and the guide tells apps to rename their own uses before updating the theme.
- **Research it stands on:**
  - [`../research/2026-11-15-renames-and-aliases.md`](../research/2026-11-15-renames-and-aliases.md): how Carbon, Primer, Spectrum, GOV.UK and Radix rename; what the shadcn-svelte CLI 1.7.1 does with a renamed item; what an alias costs for each kind of name. Cited below as *renames* §n. Its §6 corrects §3 and §4 on keyframes, from the review's probe.
  - [`../research/benchmark-scorecard.md`](../research/benchmark-scorecard.md), rows 11 and 14 and §8.
  - [`../roadmap.md`](../roadmap.md) §2 row `020` and §3.
  - The specification review, whose measurements are cited as **EXECUTED (review)**.
- **Measurements made for this specification** are labelled **EXECUTED (020)**. They are `grep`, `jq` and `git` runs over the working tree on 2026-11-15, read-only, while `019a` was uncommitted. Exact counts are pinned again by the builder in build step 1, on the tagged tree.

## Intent

The system is called Kuiper. Its code still says `pluto`. An app that installs from the registry runs `add pluto-theme`. Its visitors' theme choice is stored under `pluto-theme`. Its fields talk to their inputs under `pluto:field`.

This specification renames those code names to `kuiper`. It does it once, early, so no later 0.13.0 work is written twice. It keeps the old names working for one release, so an installed app can update one item at a time and nothing breaks silently. The one exception is the four keyframe names: by the owner's answer they go now, and the guide has apps rename their own uses before they update. It writes the first page of the "Upgrade to 0.13.0" guide, which later specifications add to. And it proves the rename moved nothing else.

The company keeps its name. Pluto Systems, its four-dot mark, its lockup word "pluto", its colours, its products (Pluto Docs, Pluto Sheets), its GitHub organisation and the site's address all stay.

**Terms of art.**

- A **code name** is a name a program reads: an item name, a key, a file path, a CSS identifier. Prose is not a code name.
- An **interface name** is a code name an installed app or its visitors depend on. Changing one is an interface change (constitution §6).
- An **alias** is an old name that still works for one release, with an end release named. Here every alias ends in 0.14.0.
- A **redirect** sends an old address to its new one with HTTP 301 ("moved permanently"). A redirect is not an alias. It never ends.
- The **rename table** is the one list of every renamed name (decision 1).
- A **cross-item context key** is a Svelte context key that one item sets and another item reads.
- A **listed item** is a registry entry without `meta.deprecated`. The site, the thumbnails and the lint read only listed items (decision 3).

## What the inventory found

`/pluto/i` was searched in every text file, outside `node_modules`, `.svelte-kit`, `build`, `test-results` and `context/prior_art` (EXECUTED (020); the review's re-run agrees).

| Where | Occurrences | Files | Class |
|---|---|---|---|
| Source: `src/`, `scripts/`, `tests/`, `registry.json`, the root files | 833, of which `CHANGELOG.md`'s entries before 0.13.0 hold 38 | 191 | mixed; split below |
| `static/r/`, built by `build:registry` | 541 | 76 | generated; never edited, rebuilt |
| `static/v0.4.0/` to `static/v0.12.0/` | 3,433 | 518 | historical; frozen, never rewritten |
| `context/` (outside `prior_art`) | 1,722 | 112 | historical, except the living documents in decision 14 |

The source's 833, by kind:

| Kind | Old name | Occurrences / files | Class |
|---|---|---|---|
| Theme item | `pluto-theme` in `registry.json` (its entry and 70 items' `registryDependencies`), install commands, the site page, its examples folder, its thumbnails, tests | 259 / 52 (the storage key shares the string) | **interface** |
| Storage key | `pluto-theme` in `theme.svelte.ts` and `theme-script.svelte` | 2 in the item; 2 site lines; 2 tests | **interface** |
| Context keys across items | `pluto:field` (set by `field`; read by `input`, `textarea`, `checkbox`, `switch`, `native-select`, `input-otp`, `input-group`'s password input), `pluto:field-set` (read by `radio-group`) | 18 / 9 | **interface** |
| Context keys inside one item | `pluto:field-label`, `pluto:tooltip`, `pluto:item-group`, `pluto:popover`, `pluto:accordion-item` | 7 / 7 | **interface** (only to an app's own code) |
| Keyframes | `pluto-enter`, `pluto-exit`, `pluto-mark-dock`, `pluto-mark-fade` | 62 / 8 | **interface** (an app's CSS, markup or script may name them) |
| Shiki theme name | `pluto-code` in `lib/highlight/shiki.ts`, exported as `shikiTheme.name` | 2 / 2 | **interface**, barely |
| Token file | `tokens/pluto.tokens.json` and its 14 readers | 25 / 14 | internal (not served; *renames* §3) |
| Registry name | `"name": "pluto"` | 1 / 1 | internal (no app sees it; *renames* §3) |
| Package name | `pluto-design-system` in `package.json`, `bun.lock` | 2 / 2 | internal (private) |
| Bench | `scripts/bench/pluto.ts`, `PLUTO`, `plutoBuild`, target id `pluto` | 10 / 5, and one file name | internal |
| Scratch names | temp-dir prefixes (`pluto-smoke-…`, `pluto-registry-…`), the Vite plugin `pluto-registry-watch`, the smoke fixtures' package names | 24 / 23 | internal |
| System prose in shipped files | "Captures are Pluto code roles", "written for the Pluto design system" in the 24 query files, and tests that read them; the theme's title "Pluto theme"; `meter.svelte`'s comment | 47 / 26, and 2 | internal prose; becomes Kuiper (decision 11) |
| System prose on the site | "a first Pluto screen" (2), "a first Pluto button" (1) | 3 / 3 | internal prose; becomes Kuiper (decision 11) |
| Frozen records in `tests/` | the 0.12.0 changelog guard in `registry-comments.test.ts`; the v0.8.0 fixture `tests/unit/fixtures/v0.8.0-custom-properties.json`; `theme.spec.ts`'s `pluto-preview-theme` guard | about 6 | **history: never rewritten** (decision 2) |
| The company | "Pluto Systems", `plutosystemsco`, `pluto-systems-design` | 141 / 34, 96 / 16, 8 / 4 | **brand: never changes** |
| The brand's assets | the lockup word `pluto` (`lockup.svelte`, the bar's label, `lockup-width.ts`, `downloads.ts`), the downloads `pluto-mark-*.svg` and `pluto-lockup-*.svg` | about 15 | **brand: never changes** |
| Sample content | `pluto-sandbox`, `co.plutosystems.sandbox`, `systems.pluto.mission`, `Pluto.Ground`, "pluto workspace", "Pluto Docs", the sidebar's "Pluto" | 20 / 15, and about 10 | **brand: never changes** |
| Brand prose | the Brand door ("How Pluto looks", "Pluto writes warmly", "Pluto shows four kinds of picture") | about 15 | **brand: never changes** |

Five findings shaped the decisions.

1. **The registry's name reaches no app.** The built `index.json` is a bare array of items, and CLI 1.7.1 has no named registries (*renames* §3). Renaming it is free.
2. **An alias item must be a real item.** The CLI resolves a dependency through the index and fails on a name that is not there (*renames* §3).
3. **Old keyframes survive in the source, not in the build.** The CLI keeps the four `pluto-` rules in an upgraded app's `app.css`: it replaces a `@keyframes` rule of the same name, appends a new one, and never deletes (*renames* §3). But the rules sit in `@theme inline`, and Tailwind 4.3.3 drops a theme keyframe that no used `--animate-*` value and no `animation:` shorthand in the same compile names (READ (review), `tailwindcss/dist/lib.js`; EXECUTED (review), a `compile()` probe). After the update, `--animate-enter` names `kuiper-enter`. So `pluto-enter` leaves the built CSS unless the app's `app.css` names it in an `animation:` shorthand. A use in a Svelte `<style>` block, an inline `style`, an `animation-name` declaration or a Web Animations call stops silently (*renames* §6). The owner ruled that the four old names go now, and that the guide warns before the update, not after (decision 6).
4. **A broken cross-item key fails silently.** A new `input` under an old `field` would render with no id, description or error, and no error is thrown (*renames* §3). Constitution §6 forbids that, and the owner's ruling keeps old names working for one release. So the keys keep working (decision 4).
5. **The rename touches frozen records in `tests/`.** Two tests compare today's tree against a past release: the 0.12.0 changelog paragraph, and v0.8.0's custom properties. A blind rewrite would falsify them (decisions 2 and 9).

`scripts/bench/` is tracked since `45a5f5c`, as `roadmap.md` §4 says. The working tree holds a one-line uncommitted edit to `pluto.ts`. `020`'s landing commits the instrument renamed, with that edit (decision 13).

## Decisions

### 1. One rename table, read by everything

`src/lib/site/upgrade/renames.ts` exports `RENAMES`: one row per renamed name. A row holds its `kind`, `old`, `new`, `alias` (`"0.14.0"` or `"none"`), `seenBy` (who depends on it), and `todo` (what an app does, one sentence).

Five things read it: the rename script (decision 9), the guide page (decision 12), the changelog test (test 16), the stray-name test (test 1) and the "nothing else moved" check (check 20). So the guide cannot list a rename the code did not make. Primer's `removed.json` and Spectrum's `renamed` field keep renames as data for the same reason (*renames* §2).

The rows:

| Kind | Old | New | Alias until |
|---|---|---|---|
| theme item | `pluto-theme` | `kuiper-theme` | 0.14.0 (decision 3) |
| storage key | `pluto-theme` | `kuiper-theme` | 0.14.0 (decision 5) |
| context key, across items | `pluto:field`, `pluto:field-set` | `kuiper:field`, `kuiper:field-set` | 0.14.0 (decision 4) |
| context key, inside an item | `pluto:field-label`, `pluto:tooltip`, `pluto:item-group`, `pluto:popover`, `pluto:accordion-item` | `kuiper:…` | 0.14.0 (decision 4) |
| keyframes | `pluto-enter`, `pluto-exit`, `pluto-mark-dock`, `pluto-mark-fade` | `kuiper-…` | none; removed now, by the owner's answer (decision 6) |
| Shiki theme | `pluto-code` | `kuiper-code` | none (decision 7) |
| site page | `/components/pluto-theme/`, `/example/pluto-theme/…` | `/components/kuiper-theme/`, `/example/kuiper-theme/…` | redirect, permanent (decision 10) |
| token file | `tokens/pluto.tokens.json` | `tokens/kuiper.tokens.json` | none, by the owner's answer (decision 8) |
| registry name | `pluto` | `kuiper` | none; no app sees it |
| package name | `pluto-design-system` | `kuiper-design-system` | none; private |

Internal names (bench, scratch prefixes, fixture package names, the plugin name, the examples folder, thumbnail file names) are rules in the script, not rows in the table. No app sees them.

### 2. What never changes

**The brand.** "Pluto Systems"; `plutosystemsco`; `pluto-systems-design` (the worker's name, and the address, by ruling); the lockup word `pluto` and the bar's label "pluto, Kuiper Design System", until the owner approves a Kuiper lockup (`018`'s ruling); the brand downloads `pluto-mark-*.svg` and `pluto-lockup-*.svg`; product names; sample content; the Brand door's prose; the `author` field "Pluto Systems <…>".

**The historical record.** `static/v0.4.0/` to `static/v0.12.0/`; the changelog's entries before 0.13.0; every landed specification, review and memo. And three guards in `tests/` that read history:

- `registry-comments.test.ts`'s "018: the Kuiper Design System" test, which expects the 0.12.0 paragraph to hold `` `pluto-theme` `` and `` `pluto:` ``. Its strings stay.
- `tests/unit/fixtures/v0.8.0-custom-properties.json`, v0.8.0's recorded properties, among them `--animate-enter: pluto-enter …`. The fixture stays. `generated.test.ts` gains `MOVED_020_INLINE`, beside `MOVED_019A_INLINE`: `--animate-enter` and `--animate-exit` read their 0.13.0 values, naming `kuiper-enter` and `kuiper-exit`.
- `theme.spec.ts`'s check that `app.html` holds no `pluto-preview-theme`.

### 3. The theme item: `kuiper-theme`, with a `pluto-theme` alias item

The theme item is renamed `kuiper-theme`, titled "Kuiper theme" (decision 11). Its CSS variables, classes and utilities keep their names; only the four keyframes change (decision 6). All 70 items that name it in `registryDependencies` name `kuiper-theme`.

A second registry entry keeps the old name working:

```json
{
  "name": "pluto-theme",
  "type": "registry:theme",
  "title": "Pluto theme (renamed)",
  "description": "Renamed kuiper-theme in 0.13.0. Installs kuiper-theme. This alias is removed in 0.14.0.",
  "registryDependencies": ["kuiper-theme"],
  "files": [],
  "meta": {
    "since": "0.1.0",
    "group": "foundation",
    "deprecated": { "replacement": "kuiper-theme", "removedIn": "0.14.0" }
  }
}
```

It has no `cssVars`, no `css` and no files. So `add pluto-theme` installs exactly what `add kuiper-theme` installs. It must be in `registry.json`, so the build puts it in `index.json`, or the CLI cannot resolve it (finding 2). `files: []` is how the font items already ship (READ (review)).

`meta.deprecated` is the shape `048` will use for deprecations. `048` may extend it; it may not rename it without migrating this entry.

**The alias is not listed.** One helper, `listedItems()` in `src/lib/site/items.ts`, returns `registry.json`'s items without `meta.deprecated`. Every reader that enumerates items for people uses it, so the alias has no page, thumbnail, sitemap or search entry, example, door entry or lint profile. The readers (READ (review), `grep`):

- `src/lib/site/sitemap.ts`, `component-data.server.ts`, `files.ts`, `doors.ts`, `start/install.ts`, `search/sources/pages.ts`;
- `src/routes/(site)/components/+layout.server.ts`, `src/routes/(site)/+page.server.ts`, and the `(example)` route's loader;
- `scripts/site/thumbnails.ts`, `scripts/site/thumbnail-hash.ts`, `scripts/lint-literals.ts`.

The builder greps for further readers of `registry.json`'s `items` in build step 1 and adds each to this list in the Landing notes. `scripts/build-registry.ts` and `scripts/build-tokens.ts` read every entry, the alias included, since the CLI must build it.

The CLI prints no notes (*renames* §3), so the alias cannot warn when it is installed. The description says it, and the guide and changelog say it.

### 4. Context keys: set under both names, read new then old

Decided by the owner's ruling (Q1, design call). Every key becomes `kuiper:…`. Each old key is a named constant beside the new one, not exported, with a comment citing this decision, so 0.14.0 can remove it.

- **Every setter sets both names.** `field` sets `kuiper:field` and `pluto:field`, and the same for `field-set` and `field-label`. `tooltip`, `item-group`, `popover-content` and `accordion-item` do the same with theirs. An old control under a new `field` then still finds its field, and so does an app's own code that reads an old key.
- **The two cross-item keys are read new, then old.** The eight readers (`input`, `textarea`, `checkbox`, `switch`, `native-select`, `input-otp`, `input-group-password`, `radio-group`) read `getContext("kuiper:field") ?? getContext("pluto:field")`, and likewise for `field-set`. A new control under an old `field` then finds its field. `Field` and `FieldSet` ship in one item, so an old and a new setter never nest, and `??` cannot pick the wrong one (READ (review)).
- **The five inside-item keys are read under the new name only.** An item's files are written together, so they cannot disagree.

The cost is 7 extra `setContext` calls and 8 fallbacks. They go in 0.14.0.

**Exported values that change.** `FIELD_CONTEXT_KEY` and `FIELD_SET_CONTEXT_KEY` (exported from `field-context.svelte.ts`) read `kuiper:field` and `kuiper:field-set`. An app's own control that imports them works under a 0.13.0 `field`. Under a 0.12.0 `field` it finds nothing, so the guide tells that app to update `field` first.

### 5. The storage key: carried over once, before first paint

The `theme` item's key becomes `kuiper-theme`. The old key is read on the first load after the update, then removed.

The head script and the store follow one algorithm:

1. Read `kuiper-theme`. If it is `light` or `dark`, that is the choice.
2. Else, if `pluto-theme` is `light` or `dark`, write it to `kuiper-theme`. That is the choice.
3. Then, in every case, remove `pluto-theme` if it is present.
4. With no choice, follow the system.

Every storage call stays inside a `try`; with no storage, the system is followed, as today.

Both places now validate the value. Today the head script treats any stored value but `dark` as light, while the store follows the system (READ (review), `theme-script.svelte:14`, `theme.svelte.ts:24`). After this, a stored `blue` means the system in both. That is a behaviour change, named in the changelog bullet.

The store's half is a plain function, `readStoredTheme(storage)`, in a new file of the `theme` item, `src/lib/registry/ui/theme/stored.ts`. It imports nothing, so a unit test can call it (test 10). `theme.svelte.ts` calls it. The head script is a string and repeats the same steps; test 9 holds it to them. The `storage` listener reacts to `kuiper-theme` only.

**Exported values that change.** `THEME_KEY` reads `kuiper-theme`. `THEME_SCRIPT` changes bytes, so an app that allows it by a CSP hash must update the hash. An app that passes `nonce` is unaffected. The old name is `OLD_THEME_KEY` in `stored.ts`, not exported from the item's `index.ts`.

**A rollback loses the choice.** An app that updates to 0.13.0, then rolls back to 0.12.0, finds `pluto-theme` gone, and its visitors' choices reset once. Keeping both keys until 0.14.0 would avoid that, at the cost of writing two keys on every choice and keeping them in step. Rollback is rare and the cost is one reset, so the old key is removed. Risks names it.

### 6. Keyframes: renamed now, the old names removed, the app warned first

`build-tokens.ts` emits `@keyframes kuiper-enter`, `kuiper-exit`, `kuiper-mark-dock` and `kuiper-mark-fade` in `@theme inline`, where the four live today. `--animate-enter` and `--animate-exit` name them, and so does the lockup rule; the CLI rewrites that rule's `animation` in place on update (READ (review)). The `animate-enter` and `animate-exit` classes do not change.

**The old four are removed now, with no copy anywhere** (the owner, 2026-11-15, Q5: "no"). The theme emits no `pluto-` keyframe, under `@layer base` or elsewhere. This is the one name kind with no alias in 0.13.0 that an app's own code can depend on.

What that means for an upgraded app (finding 3):

- The CLI leaves the four old rules in the app's `@theme inline`, and Tailwind drops them from the build, since nothing used names them any more. They are dead source.
- An app's own use of an old name stops when the theme is updated, unless that use is an `animation:` shorthand in `app.css`.

So the warning comes before the update, not after:

- **The guide** puts "rename your own uses" first, before any `add` (decision 12, step 1). It names the four old names, the four new ones, and the places a use can hide: `app.css`, a component's `<style>`, an inline `style`, an `animation-name` declaration and a script.
- **The changelog bullet** says the same, in the same order: rename first, then update.
- **After the update,** the guide tells the app to delete the four dead `@keyframes pluto-…` rules from `app.css`.

Test 11 proves the instruction: an app that follows it keeps its animation in the built CSS, and an app that skips it loses it.

### 7. The Shiki theme name: renamed, no alias

`lib/highlight/shiki.ts` registers `kuiper-code`. The name is used inside that module's `codeToTokens` calls, and it is the exported `shikiTheme.name`. The guide has one line for code that passed `pluto-code` to Shiki itself, or read `shikiTheme.name`.

### 8. Internal names follow, where they are cheap

- `tokens/pluto.tokens.json` becomes `tokens/kuiper.tokens.json`; `TOKENS_PATH`, its 14 readers and the generated file headers follow. **No alias, by the owner's answer** (Q3): only the new path exists, with no copy at the old one. Raw GitHub URLs at `v0.11.0` and `v0.12.0` keep the old path forever; `main`'s old raw URL stops working, and the guide gives the new path.
- `registry.json`'s `name` becomes `kuiper`. `package.json`'s `name` becomes `kuiper-design-system`, and its `description` "The Kuiper Design System, Pluto Systems' design system: tokens, styles and Svelte components, served as a shadcn-svelte registry." `bun.lock`'s root name follows, by `bun install` (no other lockfile line may change; criterion 17).
- The examples folder `src/lib/site/examples/pluto-theme/` and the route `src/routes/(site)/components/pluto-theme/` move to `kuiper-theme/`. The thumbnails `pluto-theme-light.webp` and `pluto-theme-dark.webp`, their manifest key and `text-sizes.json` keys follow.
- Temp-dir prefixes become `kuiper-…`. The Vite plugin is `kuiper-registry-watch`. The smoke fixtures' package names become `kuiper-smoke-kit2`, `kuiper-smoke-kit3` and `kuiper-smoke-kit3-node`, with their lockfiles' root names; the smoke test's `--frozen-lockfile` install proves them.
- `registry-comments.test.ts` compares `static/r/` with a past base. It applies the rename table to the base (item names, dependencies, file content) before its amendments. `tests/fixtures/static-r-amendments.json`'s `item` keys read the new names.
- **The bench** (decision 13).

### 9. The rename is a script, run once, then hand edits and aliases

`scripts/rename-kuiper.ts` makes the mechanical change. It is committed with the landing and removed in 0.14.0 with the aliases.

- **Its rules** are the rename table's rows plus the internal rules of decision 8. Each rule is an exact string or a bounded pattern (for example `"pluto:field"` with its quote, `pluto-theme` not followed by a letter). No rule matches bare `pluto` or `Pluto`. So "Pluto Systems", the lockup word and sample content cannot be touched by accident.
- **Its moves** are the file and folder moves of decision 8.
- **What it never reads:** `static/v0.*/`, `context/`, `node_modules/`, `build/`, binary files, all of `CHANGELOG.md` (the 0.13.0 entry is written by hand, in build step 7), and `tests/unit/fixtures/` (frozen fixtures of past releases).
- **What it never changes:** a guard list of (path, exact line) pairs, starting with decision 2's: the two strings in `registry-comments.test.ts`'s "018: the Kuiper Design System" test, and `theme.spec.ts`'s `pluto-preview-theme` line. A guard that no longer matches its line fails the script.
- **Dry by default.** It prints every rule's count per file. `--write` applies them. A second `--write` changes 0 files.
- **`--verify <old> <new>`** runs check 20.

**Hand edits after the script.** Forms that the exact rules cannot see, which the builder edits by hand and lists in the Landing notes:

- regex and escaped forms: `brand-sources.test.ts:24` (`tokens\/pluto\.tokens\.json`); `search.spec.ts:336` (`(pluto-)?theme`, which must become `(kuiper-)?theme`, or the "theme" query misses `/components/kuiper-theme/`);
- `generated.test.ts`'s `MOVED_020_INLINE` (decision 2);
- any further match of `pluto\\`, `pluto\)`, `pluto)?` or `pluto\.` that the builder's grep finds after the script. Test 1 catches what is left.

**The aliases and records, written by hand** after the script runs: the `pluto-theme` entry (decision 3), the old context keys (decision 4), the old storage key (decision 5), the search alias and the redirects (decision 10), the guide (decision 12) and the changelog entry (decision 16). Test 1 holds each to its place.

`static/r/` is never edited. `bun run build:registry` rebuilds it, and `build:tokens` rebuilds `src/app.css` and the theme's CSS.

### 10. Redirects, from a list, applied by the host and the preview

`src/lib/site/redirects.ts` exports `REDIRECTS`. `static/_redirects`, beside `static/_headers`, holds the same rules in Cloudflare's format (*renames* §3). Exact rules come before the splats, so the empty-splat address that most bookmarks hold does not depend on how a host matches `/*`:

```
/components/pluto-theme /components/kuiper-theme/ 301
/components/pluto-theme/ /components/kuiper-theme/ 301
/components/pluto-theme/* /components/kuiper-theme/:splat 301
/example/pluto-theme /components/kuiper-theme/ 301
/example/pluto-theme/ /components/kuiper-theme/ 301
/example/pluto-theme/* /example/kuiper-theme/:splat 301
```

`/example/<item>/` is not a page today; only `/example/<item>/<example>/` is. So the two bare example addresses go to the item's page. The splat carries the Markdown twin (`/components/pluto-theme/index.md`). A fragment such as `#fields` is kept by the browser across a 301. Nothing is built at an old address.

The mechanism holds on this host. `wrangler.jsonc` is assets-only, with no Worker code; `adapter-static` copies `static/` into `build/`; Cloudflare parses `_redirects` from the assets folder and follows its rules whether or not an asset matches, before `_headers` (READ (review), Cloudflare docs, 2026-11-15).

The registry's JSON is not redirected. `static/r/styles/maia/pluto-theme.json` is the alias entry itself (decision 3).

The e2e suite runs on `vite preview`, which ignores `_redirects`. So a small Vite plugin in `vite.config.ts` reads `static/_redirects` and answers its rules with the same 301s, in `vite dev` and `vite preview`. It registers its middleware directly in `configureServer` and `configurePreviewServer`, so it runs before SvelteKit's, which is added in a post hook (READ (review), `@sveltejs/kit/src/exports/vite/preview/index.js:69`). It parses three shapes: an exact source, a source ending `/*` with `:splat`, and a status. It rejects any other shape. One file then drives the host and the tests. The plugin is site tooling and ships nothing.

**The host is checked once after a deploy.** Nothing is deployed today (README). The first deploy of 0.13.0 runs `curl -sI` on the site's address for four forms: `/components/pluto-theme`, `/components/pluto-theme/`, `/components/pluto-theme/index.md` and `/example/pluto-theme/<first example>/`. Each must answer 301 with the `Location` of its rule. The result goes into the Landing notes when the deploy happens.

Redirects never end. GOV.UK and Carbon keep theirs (*renames* §2). Each later rename appends to the list.

Search gains one alias: `{ alias: "pluto-theme", path: "/components/kuiper-theme/" }`. `aliases.ts`'s rule says an alias never names another item. It gains a clause: or the old name of a renamed item. The search alias goes in 0.14.0 with the other aliases; the redirect stays.

### 11. System prose says Kuiper; brand prose says Pluto

The owner's answer (Q2, 2026-11-15): yes. Where "Pluto" in shipped prose means the system, it becomes "Kuiper". The Brand pages and the company name "Pluto Systems" keep Pluto. The lines:

- the 24 query files' header comments: "Captures are Kuiper code roles", "written for the Kuiper Design System", and the 2 tests that read them;
- the theme's title, "Kuiper theme";
- `meter.svelte`'s comment, "through kuiper-theme's …";
- the Start door: "From an empty SvelteKit app to a first Kuiper screen" (`doors.ts`, `start/+page.svelte`); "Five steps take an empty app to a first Kuiper button" (`start/install`);
- the bench's comments.

Where "Pluto" means the company or its brand, it stays (decision 2). The rule for a later sentence: if it is about the product teams adopt, say Kuiper; if it is about Pluto Systems, its brand or its products, say Pluto.

### 12. The "Upgrade to 0.13.0" guide

One page, at **`/changelog/0.13.0/upgrade/`** (the owner's answer, Q4, 2026-11-15), titled "Upgrade to 0.13.0". Its route is `src/routes/(site)/changelog/0.13.0/upgrade/+page.svelte`. It sits under the changelog in the sitemap and the navigation, has a Markdown twin, and is linked from the 0.13.0 changelog entry and from `/start/install/`. A later release's guide is its sibling, `/changelog/<version>/upgrade/`. `/changelog/0.13.0/` is not a page.

It is a ledger file (`roadmap.md` §2). **Each later 0.13.0 specification with an interface change appends its section to this page,** at `/changelog/0.13.0/upgrade/`. Its data is `src/lib/site/upgrade/0.13.0.ts`: an ordered list of sections, each with its spec number, title, steps and the rename table rows it covers. The page renders that list.

The page, as `020` leaves it:

1. **Who this is for.** An app that installed from Kuiper before 0.13.0. Coming from 0.11.0, as most apps are, first apply 0.12.0's notes in the changelog, then this page. The 0.11.0 path is the 0.12.0 path for every name here: `field-context.svelte.ts` and `theme-script.svelte` are unchanged since `v0.11.0`, and v0.11.0's theme already has the four keyframes (EXECUTED (review)).
2. **Before you start.** Commit your app. Point the CLI at `v0.13.0` (the install commands, with the registry URL).
3. **`020`: Pluto is now Kuiper in code.** The rename table, rendered: old name, new name, who sees it, what to do, and the release the old name goes. Then the steps, in this order:
   1. **Before you update anything, rename your own uses of the four keyframes.** `pluto-enter` → `kuiper-enter`, `pluto-exit` → `kuiper-exit`, `pluto-mark-dock` → `kuiper-mark-dock`, `pluto-mark-fade` → `kuiper-mark-fade`. Look in `app.css`, in components' `<style>` blocks, in inline `style` attributes, in `animation-name` declarations and in scripts. The old names leave your built CSS the moment the theme updates, and nothing warns you (decision 6). One `grep` command for `pluto-enter`, `pluto-exit` and `pluto-mark-`.
   2. Update the theme: `add kuiper-theme`. Then `add theme` if the app has it. Then `field` with the controls the app uses. Update `field` before an app's own control that imports `FIELD_CONTEXT_KEY`.
   3. Find the other old names in the app's own code, which keep working until 0.14.0. One `grep` command, for `pluto-theme`, `pluto:` and `pluto-code`. Replace each with its new name.
   4. Delete the four dead `@keyframes pluto-…` rules from `app.css`.
   5. If the app allows the theme's head script by a CSP hash, update the hash.
   6. If a tool reads the token file from `main`, read `tokens/kuiper.tokens.json`.
4. **What keeps working until 0.14.0.** `add pluto-theme`; a visitor's stored choice (carried over on their first visit); the old context keys. Each goes in 0.14.0. This is the warning the owner ruled. **What does not keep working:** the four old keyframe names (step 1).
5. **What did not change.** Every CSS variable, class, utility, prop, slot and export name. The values of five exported constants did change; the page names them (decision 18). The brand, and the site's address.

Later sections follow the same shape: what changed, who sees it, what to do, until when.

### 13. The bench is renamed and still scores old commits

`scripts/bench/pluto.ts` becomes `kuiper.ts`. In `targets.ts`, `PLUTO = "pluto:"` becomes `KUIPER = "kuiper:"`, the target id `kuiper`, its name "Kuiper 0.13". `plutoBuild` becomes `kuiperBuild` in `site.ts` and `depth.ts`. `--only kuiper` selects it.

`kuiper.ts --rev` reads `tokens/kuiper.tokens.json`, and falls back to `tokens/pluto.tokens.json` when the commit has no new file. So a run at `ea1f9bd` gives the same numbers as the run the scorecard logged (test 19). The scorecard's §8 commands are updated in place; its run log is history and keeps `pluto.ts`.

`scripts/bench/` (tracked since `45a5f5c`) is committed with this landing, renamed and with the working tree's edit.

### 14. The living documents say the new names

At landing: `README.md` (the token path, the install commands at `v0.13.0`, `kuiper-theme`); `AGENTS.md` and `context/README.md`, whose "code names stay `pluto` until 0.13.0" lines become a statement of the rename and of the aliases' end in 0.14.0; and `roadmap.md`, which gains a 0.14.0 row for the alias removal (decision 15). The handoff is replaced at the release. Landed specifications are not edited.

### 15. The aliases go in 0.14.0, together

0.14.0's first landing is a small change that removes: the `pluto-theme` entry; the old context keys; `OLD_THEME_KEY` and its carry-over; the search alias; the `/view/field-keys/` test view and its line in `blocks.test.ts`'s view guard; and `scripts/rename-kuiper.ts`. The redirects stay. The 0.14.0 guide, at `/changelog/0.14.0/upgrade/`, lists the removals. `020`'s landing adds that row to the roadmap.

### 16. Interface changes in the changelog

The 0.13.0 entry opens with one sentence and the guide's link. Then one bullet each, marked **interface change**:

- `kuiper-theme`: renamed from `pluto-theme`; the alias until 0.14.0. The four keyframes are renamed and the old names are removed now, with no alias: **rename your own uses of `pluto-enter`, `pluto-exit`, `pluto-mark-dock` and `pluto-mark-fade` before you update the theme**, or they leave your built CSS silently. After the update, delete the four dead `@keyframes pluto-…` rules from `app.css`. The token file is now `tokens/kuiper.tokens.json`, with no copy at the old path.
- `theme`: the key; the carry-over; a stored value other than `light` or `dark` now means the system in the head script too; `THEME_KEY` and `THEME_SCRIPT` change value; the CSP hash.
- `field` and its eight readers: the keys; the fallback until 0.14.0; `FIELD_CONTEXT_KEY` and `FIELD_SET_CONTEXT_KEY` change value.
- `tooltip`, `item`, `popover`, `accordion`: their keys, set under both names until 0.14.0.
- `highlighter`: the Shiki name, and `shikiTheme.name`.

Every bullet names its 0.14.0 end where it has one. Each bullet's names come from the rename table.

### 17. No new token, no dependency

The rename adds no token and no package. The preview plugin uses only Vite's own API.

### 18. Exported values that change

Five exported constants keep their names and change their values: `THEME_KEY`, `THEME_SCRIPT` (decision 5), `FIELD_CONTEXT_KEY`, `FIELD_SET_CONTEXT_KEY` (decision 4) and `shikiTheme.name` (decision 7). The old-name constants of decisions 4 and 5 are not exported. The changelog bullets and the guide name all five.

### 19. The owner's answers

The owner answered every question on 2026-11-15. Each is applied above, and recorded in the Landing notes.

1. **Q1, context keys:** decided by the ruling that code names change in 0.13.0 and old names work for one release. All seven keys keep working until 0.14.0 (decision 4).
2. **Q2, prose:** yes. Where "Pluto" in shipped prose means the system, it becomes "Kuiper". The Brand pages and the company name "Pluto Systems" keep Pluto (decision 11).
3. **Q3, the token file:** no alias for its path. Only `tokens/kuiper.tokens.json` exists; old tags keep their URLs (decision 8).
4. **Q4, the guide:** it lives at `/changelog/0.13.0/upgrade/`, not under Start as the design lead recommended. Later 0.13.0 specifications append their sections there (decision 12).
5. **Q5, the keyframes:** no. The four old names are removed now, with no `@layer base` copies. The guide tells apps to rename their own uses before updating the theme (decision 6).

## Design

### Order of work in the tree

1. The script runs (decision 9). Every interface and internal name moves.
2. The hand edits, then the aliases and records (decision 9).
3. `build:tokens` and `build:registry` regenerate `src/app.css`, the theme's CSS and `static/r/`.
4. The guide, the changelog bullets, the redirects and the search alias are written.
5. Every item's thumbnails are regenerated. `src/app.css` changes (the keyframe names), and the manifest hashes it for every item (`019`'s finding). The images should be pixel-identical. The builder records how many changed bytes.

### What an app goes through

- **An app at 0.11.0 or 0.12.0 that updates everything:** `add kuiper-theme theme field input …` rewrites the same variables in place, adds the `kuiper-` keyframes, and moves the key. Visitors keep their theme. Its own uses of the old keyframe names must be renamed first, by the guide's step 1, or they stop.
- **An app that updates one control:** `add input` brings `kuiper-theme` and a new `input`. The old `field` still sets `pluto:field`; the new `input` falls back to it (decision 4).
- **A script that runs `add pluto-theme`:** installs `kuiper-theme` through the alias, with the same result.
- **A bookmark to `/components/pluto-theme/#fields`:** lands on `/components/kuiper-theme/#fields`.

## Scope

**In:**

- Every source file the script's rules match (decision 9); the moves of decision 8; the hand edits of decision 9.
- `registry.json`: the rename and the alias entry. `static/r/` and `static/v0.13.0/r/` as built.
- `src/lib/site/items.ts` (`listedItems()`), and every reader of decision 3's list.
- `scripts/build-tokens.ts`'s keyframe names; `src/app.css` as built; `site.css`'s two keyframe uses.
- `theme.svelte.ts`, `theme-script.svelte` and the new `stored.ts`, added to the `theme` item's files (decision 5); `field-context.svelte.ts`, the eight readers and the four other setters (decision 4).
- `src/lib/site/upgrade/renames.ts`, `src/lib/site/upgrade/0.13.0.ts`, the guide route `src/routes/(site)/changelog/0.13.0/upgrade/`, its sitemap and navigation entry under the changelog, and its links from the changelog page and `/start/install/`.
- `src/lib/site/redirects.ts`, `static/_redirects`, the Vite plugin, the search alias and its rule's comment.
- The test view `/view/field-keys/`, its fixtures under `src/lib/site/test-views/field-keys/`, and its entry in `TEST_VIEWS` (tests 7 and 8). Two existing guards meet it:
  - `blocks.test.ts`'s view guard (line 252, "0 other +page.svelte files under src/routes/(view)/view/ … but 013's test view") fails on any view page but the blocks' views and `code-agreement`. Its expected set adds `src/routes/(view)/view/field-keys/+page.svelte`, with a comment citing this specification.
  - `axe.spec.ts` (line 133) runs axe on every `TEST_VIEWS` path, in both themes. So the fixtures render what their ids point to: a visible `label` for each control, and a description and an error element for each id that `aria-describedby` names. The view must pass axe with 0 violations, like any page.
- `CHANGELOG.md`'s 0.13.0 entry.
- `scripts/bench/`, renamed (decision 13); the scorecard's §8 commands.
- `scripts/rename-kuiper.ts`.
- `registry-comments.test.ts`'s base mapping and `tests/fixtures/static-r-amendments.json` (decision 8); `generated.test.ts`'s `MOVED_020_INLINE` (decision 2).
- The tests of "Tests written first", and every existing test the script's rules update. The tests that count items: `registry.test.ts` (line 434), `component-data.test.ts` (line 20), `previews.test.ts` (line 10) and `registry-comments.test.ts` (line 63); criterion 22 says which read 76 and which 75.
- Every item's thumbnails, and the manifest.
- The living documents of decision 14.

**Out:**

- The brand, the address, the worker's name and the lockup (decision 2). A Kuiper lockup waits for the owner's approval of the mock-ups.
- `static/v0.4.0/` to `static/v0.12.0/`, the changelog before 0.13.0, `tests/unit/fixtures/`, and landed `context/` documents.
- The token file's shape (`021`), its publication and any record of token renames in the file (`021`).
- An app-side codemod. The guide's `grep` is the tool. A CLI needs a recorded decision (constitution §3).
- Any change of look, behaviour or size beyond the names, and the stored-value check of decision 5.

## Tests written first

Each is written first and seen failing on the tagged tree, except where it says otherwise. The failure counts go into the Landing notes.

1. **`tests/unit/rename.test.ts`, "no stray pluto".** Lists the tree with `git ls-files --cached --others --exclude-standard`. Skips binary files, `static/v0.*/`, `context/`, and the allowlist file itself, `tests/fixtures/pluto-allowed.json`, by path (it names every pattern). Every `/pluto/i` match, and every path containing `pluto`, must match one entry of that file. Each entry has a file glob, a pattern, a pinned count, a reason, and one of four classes:
   - `brand`: the company, its assets, sample content, brand prose (decision 2);
   - `history`: a frozen record of a past release (decision 2's list, the changelog before 0.13.0);
   - `alias`: keeps an old name working; its reason names "0.14.0". The alias entry, the old keys and their constants, the search alias, the field-keys view, the rename script, and the tests of aliases (4, 7 to 10, 12, 13);
   - `record`: names an old name in order to rename, redirect or document it; permanent. `renames.ts`'s `old` column, `0.13.0.ts` and the guide's page, the 0.13.0 changelog entry, `redirects.ts` and `static/_redirects`, and the tests that read them (2, 14 to 18) and this test.

   Every entry must be used, at exactly its count. So a new `pluto` anywhere fails, and so does a lost alias. JS bundles in `build/` are not read; this test reads their source.
2. **`rename.test.ts`, "the rename table".** Every row has a kind from the fixed list, `old` ≠ `new`, `alias` of `"0.14.0"` or `"none"`, and a non-empty `todo`. No `new` contains `pluto`. Every row is rendered on the guide page's prerendered HTML: its old and new names, each in `code`.
3. **`registry.test.ts`, "kuiper-theme is the theme".** `registry.json`'s `name` is `kuiper`. An item `kuiper-theme` of type `registry:theme` exists, titled "Kuiper theme", with the theme's `cssVars` and `css`. The 70 items that named the theme name `kuiper-theme`, and none names `pluto-theme`.
4. **`registry.test.ts`, "the pluto-theme alias".** Exactly one entry `pluto-theme`: type `registry:theme`, `registryDependencies` exactly `["kuiper-theme"]`, `files` empty, no `cssVars`, no `css`, `meta.deprecated` equal to `{ "replacement": "kuiper-theme", "removedIn": "0.14.0" }`. After `build:registry`, `static/r/styles/maia/index.json` lists it and `pluto-theme.json` exists. No other entry has `meta.deprecated`.
5. **`registry.test.ts`, "a deprecated item is not listed".** `listedItems()` returns 75 items, without `pluto-theme`. The sitemap, the search index, the thumbnails manifest, `example-order.ts`, the doors, the components index and the literal lint's item list hold no `pluto-theme`.
6. **`generated.test.ts`, "the keyframes are Kuiper's".** The theme's `@theme inline` and `src/app.css`'s hold exactly the four `@keyframes kuiper-…` rules and no `pluto-` keyframe appears anywhere in the theme or `src/app.css`, in `@theme`, `@layer base` or at the top level. `--animate-enter` and `--animate-exit` name `kuiper-enter` and `kuiper-exit`. The header names `tokens/kuiper.tokens.json`. `build:tokens` run twice changes 0 files the second time. The v0.8.0 comparison passes with `MOVED_020_INLINE`.
7. **`tests/e2e/field-keys.spec.ts`, "an old field still wires a new control"** (a guard; see criterion 23). The test view `/view/field-keys/`, prerendered like `/view/code-agreement/`, holds a fixture parent that sets only `pluto:field` (a 0.12.0 `field`), with a known id, description id and `invalid`, around each of the seven field readers; and a fixture parent that sets only `pluto:field-set`, around a `radio-group`. In the prerendered HTML, each control carries the context's id, and the `aria-describedby` and `aria-invalid` the context gives. The radio group carries what its `field-set` context gives.
8. **`field-keys.spec.ts`, "a new setter still serves an old reader"** (a guard). On the same view, a fixture child that reads only an old key (as a 0.12.0 reader, or an app's own code, would) writes what it found into a `data-` attribute. In the prerendered HTML:
   - inside the new `Field`, the child reading `pluto:field` finds the `Field`'s control id; the child reading `pluto:field-label` finds the label target's id;
   - inside the new `FieldSet`, the child reading `pluto:field-set` finds its context;
   - inside the new `Tooltip` root, the child reading `pluto:tooltip` finds its context; `tooltip.svelte` sets the key in the root wrapper, whose children render on the server (READ (review));
   - inside the new `Item.Group`, the child reading `pluto:item-group` finds `true`;
   - inside the new `Accordion.Item`, the child reading `pluto:accordion-item` finds its context.

   Only `popover-content`'s key is checked at the source, since its context is set inside a portal that the server render skips: a unit test reads `popover-content.svelte` and finds one `setContext` under the new constant and one under the old.
9. **`theme.spec.ts`, "the head script carries an old choice over".** On `/`, in both theme projects. `page.route("**/_app/**", r => r.abort())` stops every module, so only the inline head script runs. Each case sets storage on a first load, then reloads, then reads `<html>`'s `dark` class and the storage:
   - `pluto-theme` = `dark`, no `kuiper-theme`: dark; `kuiper-theme` is `dark`; `pluto-theme` is gone.
   - `pluto-theme` = `light`, under a dark system preference: light; `kuiper-theme` is `light`; `pluto-theme` is gone.
   - `pluto-theme` = `blue`: the system's; `kuiper-theme` unset; `pluto-theme` is gone.
   - `kuiper-theme` = `light` and `pluto-theme` = `dark`: light; `kuiper-theme` is still `light`; `pluto-theme` is gone.
   - `kuiper-theme` = `blue`, no `pluto-theme`: the system's.
   - `kuiper-theme` = `blue` and `pluto-theme` = `dark`: dark; `kuiper-theme` is `dark`; `pluto-theme` is gone.
   - Neither: the system's; nothing written.

   With modules allowed, the theme switch, after a carry-over, writes `kuiper-theme` only. The prerendered head holds exactly one inline script that reads `kuiper-theme`, and its only `pluto` is the old key, `pluto-theme`, which it reads and removes.
10. **`tests/unit/theme-stored.test.ts`.** `readStoredTheme` from `stored.ts`, over a stub `Storage`, follows the same seven cases and leaves the same storage. With a `Storage` whose every call throws, it returns no choice and throws nothing.
11. **`tests/smoke/upgrade.test.ts`, "the upgrade from v0.11.0, as the guide says".** It proves the guide's instruction (decision 6), not the old names' survival. Two scratch apps each install `pluto-theme theme field input button four-dot` from `/v0.11.0/r`, and add one component whose Svelte `<style>` block sets `animation-name: pluto-enter`. Both build, and both built CSS files hold `@keyframes pluto-enter`.
    - **The app that follows the guide** renames its use to `kuiper-enter` (step 1), then installs `kuiper-theme theme field input button four-dot` from `/r` (step 2), then deletes the four `@keyframes pluto-…` rules (step 4). The `add` exits 0. `svelte-check` reports 0 errors and the app builds. Its built CSS holds `@keyframes kuiper-enter` and `kuiper-mark-dock`, its component's rule names `kuiper-enter`, and it holds no `pluto-` keyframe. `app.css` holds each `@keyframes kuiper-…` once; `--animate-enter` names `kuiper-enter`; every `:root` and `.dark` variable name it held before is still there.
    - **The app that skips step 1** installs from `/r` directly. The `add` exits 0 and the app builds. Its `app.css` still holds the four old rules in `@theme inline`, but its built CSS holds no `@keyframes pluto-enter`, while its component still names `pluto-enter`. That is the silent loss the guide warns of, shown, so the warning stays true.
    - The guide page's step 1 names the four old names and comes before any `add` (test 17).
12. **`upgrade.test.ts`, "one control at a time"** (a guard). From the same 0.11.0 app, only `add input` from `/r`. The app builds. Its prerendered page with a `Field.Label` and an `Input` has the label's `for` equal to the input's `id`.
13. **`upgrade.test.ts`, "the alias installs the theme".** In a fresh app, `add pluto-theme` from `/r` exits 0, and `app.css` is byte-identical to a fresh app's after `add kuiper-theme`.
14. **`tests/unit/redirects.test.ts`.** `static/_redirects` parses into exactly `REDIRECTS`, in decision 10's order, each with code 301, and each of one of the plugin's three shapes. Each destination's page is in `SITEMAP` (a splat's destination folder holds pages). No source path is in `SITEMAP`, and after the build no file exists under `build/components/pluto-theme/` or `build/example/pluto-theme/`.
15. **`tests/e2e/redirects.spec.ts`.** On the preview, each of these answers 301 with its rule's `Location`: `/components/pluto-theme`, `/components/pluto-theme/`, `/components/pluto-theme/index.md`, `/example/pluto-theme`, `/example/pluto-theme/`, and `/example/pluto-theme/<first example>/`. A browser opening `/components/pluto-theme/#fields` ends on `/components/kuiper-theme/#fields`, and the section is in view.
16. **`registry.test.ts`, "the 0.13.0 changelog".** The entry links to `/changelog/0.13.0/upgrade/`. Its `kuiper-theme` bullet says to rename the four keyframe uses before updating. It holds decision 16's bullets, each marked `**interface change.**`. Each bullet names every old and new name of its rows in the rename table, "0.14.0" where its rows have an alias, and the exported constants of decision 18 that it covers.
17. **`tests/e2e/upgrade.spec.ts`, "the guide".** `/changelog/0.13.0/upgrade/` has the title "Upgrade to 0.13.0", the five parts of decision 12 in order, and the five constants of decision 18. In part 3, step 1 (rename the four keyframe uses) comes before the first `add`, and its `grep` names `pluto-enter`, `pluto-exit` and `pluto-mark-`; step 3's `grep` names `pluto-theme`, `pluto:` and `pluto-code`. It opens with and without the trailing slash on the preview. It is in `SITEMAP` under the changelog, and linked from the changelog page's 0.13.0 entry and from `/start/install/`. Its Markdown twin exists. axe reports 0 violations in both themes at 1440 and 390 (the page suites cover it once it is in `SITEMAP`; this test asserts that it is).
18. **`search.test.ts`, "the old name finds the new page".** The query `pluto-theme` returns the Kuiper theme page first, marked "Also called pluto-theme". The alias fixture holds the new entry.
19. **The bench at an old commit** (seen passing; it guards the fallback). `bun scripts/bench/kuiper.ts --rev ea1f9bd --json <out>` prints the same token and change-communication counts as the scorecard's run log row for `ea1f9bd`.
20. **"Nothing else moved"** (a landing check, not in the suite). `bun scripts/rename-kuiper.ts --verify <build at v0.12.0> <build at landing>` compares two builds, each with its `static/r/`.
    - **Normalised first, on both sides, before mapping back:**
      - **Hashed names.** Every `/_app/immutable/<dir>/<file>` reference, and every such file name, loses its 8-character hash segment, whether dotted (`0.DWCHKBCc.css` → `0.css`, `accordion-dark.DKGOaGMX.webp` → `accordion-dark.webp`) or bare (`chunks/lcSWd0bi.js` → `chunks/_.js`). The same for content-hashed names outside `_app/immutable/`. The extensions covered are `js`, `css`, `webp`, `png`, `svg`, `woff2`, `json` and `wasm`.
      - **The build's version.** `_app/version.json` is dropped. In every page's bootstrap script, `__sveltekit_[a-z0-9]+` and `version: "…"` become placeholders. The footer's build stamp (the commit and the date) becomes a placeholder.
      - **Route-node indices.** `020` adds two routes (the guide and `/view/field-keys/`), so the indices after them shift. The bootstrap's `node_ids: [ … ]` and every `nodes/<n>.` index become placeholders.

      Then compare as below.
    - **Then mapped back:** in the new side, every table row's new name becomes its old name.
    - **Compared:** the prerendered HTML, the Markdown twins, `static/r/`, `llms.txt`, `sitemap.xml`, `search.json` and the CSS files' text.
    - **Not compared:** the JS chunks under `_app/immutable/`. Minified code puts the aliases inside lines that cannot be allowed one by one. Test 1 covers their source, and the suites cover their behaviour.
    - **Allowed differences**, listed in the script: the alias entry; `_redirects`; the guide, its twin and its sitemap, search and `llms.txt` entries; the changelog page; the search alias; the version strings; the head script's carry-over; the `/view/field-keys/` view; decision 11's prose; the theme's title. Any other difference fails.
    - `src/app.css`, mapped back, equals the tagged one byte for byte.

## Acceptance criteria

1. **No stray name.** Test 1 passes. Its allowlist holds only the four classes, every `alias` reason names "0.14.0", and every `record` reason names what it records. (unit)
2. **The table.** Test 2 passes. `RENAMES` holds the rows of decision 1, no more and no fewer. (unit)
3. **The theme item.** Test 3 passes. (unit)
4. **The alias entry.** Tests 4 and 5 pass. (unit)
5. **The keyframes.** Test 6 passes. `site.css` names `kuiper-mark-dock` and `kuiper-mark-fade`. (unit)
6. **The Shiki name.** `shiki.ts` registers `kuiper-code`, and `shikiTheme.name` is `kuiper-code`; `highlight-session.test.ts` reads it. The highlight suites pass unchanged in every other expectation. (unit)
7. **Cross-item keys.** Test 7 passes. (e2e)
8. **Old keys set.** Test 8 passes. (e2e, unit)
9. **The storage key.** Tests 9 and 10 pass. `THEME_KEY` is `kuiper-theme`. (e2e, unit)
10. **The upgrade.** Tests 11, 12 and 13 pass, under Bun. (smoke)
11. **Redirects.** Tests 14 and 15 pass. (unit, e2e)
12. **The guide.** Test 17 passes. (e2e)
13. **Search.** Test 18 passes. (unit)
14. **The changelog.** Test 16 passes. (unit)
15. **Prose.** Decision 11's lines read Kuiper. The Brand pages and "Pluto Systems" read Pluto, in the allowlist as `brand`. `queries.test.ts` and `code.spec.ts` read the new comments. (unit, e2e)
16. **Internal names.** `tokens/kuiper.tokens.json` exists and `tokens/pluto.tokens.json` does not. `package.json` reads `kuiper-design-system`. `scripts/bench/kuiper.ts` exists and `pluto.ts` does not. (unit, in test 1)
17. **The lockfiles.** `bun.lock` differs from the tag only in its root package name. Each smoke fixture's lockfile differs only in its root name. `bun install --frozen-lockfile` succeeds in the repository and in each fixture. (smoke)
18. **The bench.** Test 19 passes. (script)
19. **The script.** `bun scripts/rename-kuiper.ts` (dry) after landing reports 0 changes, and every guard still matches. Its first `--write` counts per rule, and the hand edits, are in the Landing notes. (script)
20. **Nothing else moved.** Check 20 passes. Its output is in the Landing notes. (script)
21. **The thumbnails.** `thumbnails.test.ts` passes with the regenerated manifest. `kuiper-theme-light.webp` and `kuiper-theme-dark.webp` exist; the `pluto-theme` images do not. The Landing notes say how many images differ in bytes from the tag's. (unit)
22. **The suites.** `bun run test:unit`, `bun run test:e2e` and `bun run test:smoke` pass; `bun run check` 0 errors; `bun run lint` clean; the literal lint as at the tag (0 violations, 1 allowance, L24).
    - **These counts read 76:** `registry.json`'s entries, `index.json`'s entries, `static/r/styles/maia/`'s item files, and `registry-comments.test.ts`'s count of entries with a `files` key.
    - **These read 75:** `listedItems()`, and through it `registry.test.ts`'s item count, `component-data.test.ts`, `previews.test.ts`, the components index, the sitemap's component pages and the thumbnails' items.
    - **Two guards change, by name:** `blocks.test.ts`'s view guard (line 252) adds `field-keys`; `axe.spec.ts`'s `TEST_VIEWS` scan (line 133) covers `/view/field-keys/` and reports 0 violations in both themes.
    - Existing expectations change only by the script's rules, the hand edits, these counts, the two guards and the tests named above. (all)
23. **Tests first.**
    - Tests 1 to 6, 9 to 11 and 13 to 18 are seen failing on the tagged tree before any change.
    - Tests 7, 8 and 12 pass on the tagged tree, since every key is still `pluto:`. They are guards. Each is seen **failing after build step 3** (the script has renamed the keys) and **before step 4** (the aliases), and passing after step 4. Both runs go into the Landing notes.
    - Test 19 is seen passing at `ea1f9bd` with `pluto.ts`, then with `kuiper.ts`.

    The counts go into the Landing notes. (record)
24. **The checkpoint.** The design lead opens, in both themes at 1440 and 390: the Kuiper theme page; `/components/pluto-theme/#fields` (it lands on the new page's section); the guide; the search for `pluto-theme`; a page reloaded with `pluto-theme = dark` in storage (no flash); and the CLI's picker once (`add` with no names), to see the alias's title. Rulings go into the Landing notes. (checkpoint)
25. **The scorecard.** Re-run after landing: `kuiper.ts --rev <landing>`, and `site.ts --only kuiper`, since pages changed. The predictions:
    - **Row 11,** change communication, 2 → 3: criterion (d), a migration page. `migrationPages`, a count of route files whose path matches `upgrade`, goes from 0 to at least 1.
    - **Row 14,** governance, 2 → 3: criterion (c), a deprecation path that names the replacement, is met by `meta.deprecated.replacement` and the guide. `deprecatedItems` goes from 0 to 1. `048` then holds row 14 at 3 with a written rule, rather than raising it; the roadmap is re-ranked from that.
    - The other rows hold. Rows 1–14 total 30 → 32.

    The change review cites the run log row. If a row moves otherwise, the review says why. (measure)
26. **The host** (after the first deploy). Decision 10's four `curl -sI` checks answer 301 with their `Location`. The result is in the Landing notes. (deploy)

## Build order

1. On a branch from the `v0.12.0` tag, re-run the inventory. Grep for every reader of `registry.json`'s items (decision 3). Pin the target counts in `tests/fixtures/pluto-allowed.json`.
2. **Tests first.** Write tests 1 to 19, and the field-keys view with its fixtures. Run them. Record what fails, and that tests 7, 8 and 12 pass (criterion 23).
3. Write `renames.ts` and `scripts/rename-kuiper.ts`, with its guard list. Run it dry. Read every count against the inventory. Then `--write`. Make the hand edits. **Run tests 7, 8 and 12: they must fail.**
4. The aliases, by hand: the `pluto-theme` entry and `listedItems()`; the context keys; `stored.ts` and the storage key. Run tests 7, 8 and 12 again: they pass.
5. `build:tokens`, `build:registry`.
6. Redirects, the preview plugin, the search alias.
7. The guide at `/changelog/0.13.0/upgrade/`, the changelog entry, the link from `/start/install/`.
8. **Checkpoint** (criterion 24).
9. The thumbnails. Every suite, the lints, `check`. The bench at `ea1f9bd`.
10. Check 20 against a build of the tag.
11. The living documents (decision 14), the scorecard's §8 commands.
12. The change review. Then the scorecard re-run (criterion 25), and the roadmap re-ranked.
13. One commit, when the owner asks, holding the rename, `scripts/bench/` and the tests.
14. After the first deploy of 0.13.0: the host check (criterion 26).

## Risks

- **The rename touches every lane.** Nothing else may build until it lands. The roadmap plans for that; a slow review delays all of 0.13.0.
- **A shipped `pluto` slips through as prose.** The 24 query files ship into apps. Test 1 reads the source of everything that builds `static/r/`, and check 20 reads `static/r/` itself.
- **An app that updates the theme before renaming its own keyframe uses loses those animations silently** (decision 6, the owner's answer to Q5). The guide's first step, the changelog bullet's first sentence and test 11's second app all say so. Nothing in the registry can detect it.
- **The alias shows in the CLI's picker.** `add` with no names lists every entry, `pluto-theme` among them. Its title says "(renamed)". The checkpoint looks once.
- **An app with its own CSP hash** loses the head script until it updates the hash. The guide's step 5 says so; nothing can detect it from here.
- **A rollback to 0.12.0 resets visitors' choices once,** since the old key is removed (decision 5).
- **`0.13.0` is a dotted path segment** in `/changelog/0.13.0/upgrade/`. It is not the last segment, so it is unlikely to be read as an extension; still, Cloudflare's `auto-trailing-slash` and `vite preview` are checked. Test 17 opens the page with and without the slash on the preview; criterion 26 checks the host's redirects once deployed. The `v0.13.0/r` folders are served the same way today.
- **The redirect plugin is only as faithful as its parser.** It reads three shapes and rejects the rest (test 14). The exact rules before the splats keep the common addresses from depending on splat matching.
- **Three versions in one app.** Decision 4 covers an old and a new version side by side. A 0.11.0 `field` with a 0.14.0 control will not match, since 0.14.0 drops the old key. The 0.14.0 guide must say to update `field` and its controls together.

## Open findings

**F1. Tests 9, 15 and 17 run in Chromium only until `022` lands** (constitution §4.4). `020` lands first, by the roadmap's order, so on landing these checks have not run in Firefox or WebKit. This is a fault to fix, not a limit. **Owner: `022`.** Its matrix must take tests 9, 15 and 17 into its Firefox and WebKit projects, and the Landing notes of `022` record their first runs there. If `022` finds an engine fault in the head script, the redirects or the guide, it becomes a small change in this specification's files.

## Open questions for the owner

None. Q1 to Q5 are answered (decision 19).

## Review

From [`../reviews/020-the-kuiper-rename-spec-2026-11-15.md`](../reviews/020-the-kuiper-rename-spec-2026-11-15.md). The design lead accepted all 13 findings. This revision applies them.

1. **Accepted (High).** Finding 3 now says what survives: the source rules, not the built ones. Decision 6 put two answers to the owner as Q5; the owner chose to remove the old names now, with the guide warning first (decision 19). Test 11 builds two apps from a `<style>`-block use and shows the guide's order working and the skipped step failing. The memo's §6 corrects its §3 and §4.
2. **Accepted (Medium).** Decision 5 has one algorithm: step 1 validates, and step 3 removes the old key in every case. The store's half is `readStoredTheme` in a new `stored.ts`, unit-tested (test 10). Test 9 aborts `/_app/**`, so only the head script runs, and gains the `kuiper-theme` = `blue` cases. The rollback cost is stated, and the key is still removed.
3. **Accepted (Medium).** Tests 7 and 8 render through SvelteKit on a test view, `/view/field-keys/`, added to `TEST_VIEWS`, and assert on its prerendered HTML. The five inside-item setters are checked at the source, since the server render does not reach their contexts.
4. **Accepted (Medium).** Tests 7, 8 and 12 are guards. Criterion 23 and build steps 3 and 4 have them seen failing after the script and before the aliases, and passing after.
5. **Accepted (Medium).** Test 1 has a fourth class, `record`, for permanent records of the rename. Its tests and the alias tests are classed. The allowlist file is exempt by path.
6. **Accepted (Medium).** Decision 2 names the three guards in `tests/`, and `generated.test.ts` gains `MOVED_020_INLINE`. Decision 9: the script skips all of `CHANGELOG.md` and `tests/unit/fixtures/`, never changes a guard list of lines, and lists the hand edits, including `brand-sources.test.ts:24` and `search.spec.ts:336`.
7. **Accepted (Medium).** Check 20 normalises hashes, drops `version.json` and the build stamp, compares HTML, twins, `static/r/`, `llms.txt`, the sitemap, the search index and CSS, and leaves JS chunks to test 1 and the suites.
8. **Accepted (Medium).** Decision 3 adds `listedItems()` and lists the twelve readers; build step 1 greps for more. Scope lists the counting tests. Criterion 22 says which counts read 76 and which 75.
9. **Accepted (Low).** Decision 10 has exact rules before the splats, and rules for both bare example forms. The host is checked with `curl -sI` after the first deploy (criterion 26, build step 14).
10. **Accepted (Low).** Decision 18 names the five exported constants whose values change. The old-name constants are not exported. Decisions 4, 5, 7 and 16 and the guide name them.
11. **Accepted (Low).** Criterion 25 predicts row 14, 2 → 3, and `deprecatedItems` 0 → 1. "Every other row holds" now excludes rows 11 and 14.
12. **Accepted (Low).** The roadmap correction is deleted: §4 already says `scripts/bench/` is tracked. The design call now records the ruling in this specification, since `decisions.md` is retired. The inventory's source row says it includes the changelog's 38.
13. **Accepted (Low).** The Chromium-only runs are open finding F1, owned by `022`, with tests 9, 15 and 17 named for its matrix.

### The re-review (2026-11-15)

The re-review approved with changes. The design lead accepted all three.

- **R1, accepted (Medium).** Check 20's normaliser now strips bare-hash chunk names (`chunks/lcSWd0bi.js`) as well as dotted ones, covers `.wasm`, replaces the bootstrap's `__sveltekit_<id>` and `version: "<commit>"`, and replaces `node_ids` and `nodes/<n>.` indices, which the two new routes shift.
- **R2, accepted (Low).** Scope and criterion 22 name `blocks.test.ts`'s view guard (line 252), which adds `field-keys`, and `axe.spec.ts`'s `TEST_VIEWS` scan (line 133), which the fixtures must pass with labels and the elements `aria-describedby` names.
- **R3, accepted (Low).** Test 8 checks `pluto:tooltip`, `pluto:item-group`, `pluto:accordion-item` and `pluto:field-label` through the view. Only `popover-content` keeps the source check.

## Landing notes

### The owner's answers (2026-11-15)

Recorded before the build, as the rules require. They shape decisions 4, 6, 8, 11 and 12.

- **Q1, context keys.** Decided by the ruling "code names change in 0.13.0, old names work one release" (the owner, 2026-11-15). The seven keys keep working until 0.14.0.
- **Q2, prose.** The owner: yes. Where "Pluto" in shipped prose means the system, it becomes "Kuiper". The Brand pages and "Pluto Systems" keep Pluto.
- **Q3, the token file.** The owner: no alias for the path. Only the new path exists; old tags keep their URLs.
- **Q4, the guide.** The owner: `/changelog/0.13.0/upgrade/`. Not the recommended option (`/start/upgrade/0.13.0/`); every reference is updated.
- **Q5, the keyframes.** The owner: no. The four old names are removed now, with no `@layer base` copies. The guide tells apps to rename their own uses before updating the theme.

### The build

Not yet built.
