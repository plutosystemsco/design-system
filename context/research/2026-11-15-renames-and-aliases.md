# Renames and aliases: how the references rename, and what one release of old names means here

- **Status:** final. A memo; it commits us to nothing. `020` stands on it. **§6 corrects** §3's "The CLI merges the theme" and §4's keyframes row, from `020`'s specification review (2026-11-15). Where they disagree, §6 holds.
- **Date:** 2026-11-15
- **Author:** the design lead
- **Question:** Kuiper's code names are renamed from `pluto` to `kuiper` in 0.13.0, and the owner ruled that the old names keep working for one release. How have the reference systems renamed packages, prefixes, tokens and pages? For each kind of name Kuiper has, what does an alias cost, and what breaks without one?
- **Blocks:** `020`, the Kuiper rename.

Labels: **EXECUTED** (run here, 2026-11-15), **READ** (a source says so, read 2026-11-15), **INFERRED** (our reasoning).

## 1. What the owner has already ruled

- **READ** (`decisions.md` at `beeb67e`, "The Kuiper Design System", 2026-11-15). The system is the Kuiper Design System from 0.12.0. Its code names are the registry `pluto`, `pluto-theme`, the `pluto:` context keys and `tokens/pluto.tokens.json`. They stay `pluto` in 0.12.0 and are renamed in 0.13.0 by their own specification, with a migration guide. Pluto Systems stays the company and its brand: the four-dot mark, the colours, the type. The address stays `pluto-systems-design.claygendron.workers.dev`.
- **READ** (same file, "The roadmap's questions"). "The old `pluto` names keep working for one release after `020`'s rename: `pluto-theme` and the old storage key work in 0.13.0 with a warning in the migration guide, and go in 0.14.0." The owner took the roadmap's recommended option for Q3. That option (`roadmap.md` §6, Q3.1) also said: "Context keys break, with the guide."
- **READ** (same file, "Kuiper is a public product"). A migration note goes with every interface change. From 1.0, nothing is removed without a deprecation in an earlier minor release.

## 2. How the references renamed

### Carbon (Apache-2.0, `carbon-design-system-carbon` at `fa75d78`)

- **READ** (`docs/migration/v11.md`, lines 1–40). One migration document per major release. It is split by package. Each section says what replaced what: "`carbon-components` is replaced by `@carbon/styles`". It names an end of support for the old package.
- **READ** (`v11.md`, lines 281–332). Renames are tables of old name and new name ("`$carbon--spacing` | Renamed to `$spacing`").
- **READ** (`v11.md`, lines 636–650). Files an app should not have used are listed under "Internal" and left out of the table. A reader who used one is told to ask for help.
- **READ** (`packages/styles/scss/_config.scss`, line 69). The class and variable prefix is a setting, `$prefix: 'cds' !default`. An app can keep another prefix by configuring it.
- **READ** (`packages/upgrade/src/upgrades.js`, lines 81–150). Codemods ship as a package, `@carbon/upgrade`. Its "v11: full update" rewrites imports from `carbon-components-react` to `@carbon/react`.
- **READ** (`carbon-website` at `5e9cd1d`, `gatsby-node.js`, lines 39–60). The docs site declares moved pages as permanent redirects (`createRedirect`, `isPermanent: true`).

### Primer (MIT, `primer-primitives` at `4773648`; `primer-design` at `87f799f`)

- **READ** (`src/tokens/removed.json`). Every removed token is listed. Its value is its replacement, or `null` when there is none.
- **READ** (`scripts/checkRemovedTokens.ts`, lines 1–30). A script compares the token names against a base commit and fails when a name disappears without an entry in `removed.json`.
- **READ** (`src/transformers/jsonDeprecated.ts`; `src/filters/isDeprecated.ts`). A renamed token stays for a while with `$deprecated` naming its replacement. The build writes the deprecated names into a file of their own. The prior-art memo already notes this (`2026-11-15-prior-art-primer.md`, line 98).
- **READ** (`primer-design`, `gatsby-node.esm.js`, lines 78–82 and 474–500; `src/layouts/redirect-layout.tsx`). Moved docs pages get redirects. Some are server redirects; some are pages that navigate in the browser.

### Spectrum (Apache-2.0, `adobe-spectrum-design-data` at `b236981`)

- **READ** (`docs/site/public/schemas/token-types/token.json`, lines 31–43). A token carries `deprecated` (a boolean, or the version it was deprecated in), a `deprecated_comment`, and `renamed` (the new name) or `replaced_by` (the new token's UUID).
- **READ** (`tools/diff-generator/README.md`, lines 27–31). A diff tool reports renames between releases, from the UUIDs and the `renamed` field. So a rename is data, and the notes are generated from it.

### GOV.UK (MIT code, Crown copyright guidance; `alphagov-govuk-frontend` at `a11bd33`, `alphagov-govuk-design-system` at `5f31aa7`)

- **READ** (`CHANGELOG.md`, lines 1338–1350). A release note has a "Deprecated features" section. A rename is a table of old and new names. It ends: the old names still work, and they go in the next breaking release, which it names.
- **READ** (`CHANGELOG.md`, line 2354). The same pattern for a Sass mixin: renamed, the old name deprecated, still usable, removed in a named future release.
- **READ** (`packages/govuk-frontend/src/govuk/settings/_warnings.scss`, lines 1–30). A deprecated name prints a warning when the app compiles its Sass. Each warning has a key, and an app can silence it by listing the key in `$govuk-suppressed-warnings`.
- **READ** (`govuk-design-system`, `lib/redirects/index.js`). A moved page lists its old addresses in its own front matter. The build writes them into one `_redirects` file as 301s. Archived pages get 410. A test covers the plugin (`index.test.js`).
- Its written guidance is Crown copyright. It is studied here, not quoted.

### Radix Themes (MIT, `radix-ui-themes` at `1faff10`)

- **READ** (`packages/radix-ui-themes/CHANGELOG.md`, lines 960–1016, releases 0.0.17 to 0.0.24). Before 1.0, Radix renamed components, props and token prefixes in one release with no alias: "**[Breaking]** The component was renamed to `Theme`"; "`--fs-` tokens renamed to long-form `--font-size-`".

### Polaris (restricted licence)

Not used. Its licence allows use only in apps that integrate with Shopify (`prior_art/README.md`). Nothing here comes from it.

### What they share (INFERRED)

1. **The rename is data first.** Primer's `removed.json` and Spectrum's `renamed` field are a table. The notes, the checks and the codemods read it.
2. **One guide per release, split by thing renamed.** Each entry has the old name, the new name, what to do, and when the old name goes.
3. **The old name keeps working where an app's own code depends on it**, and goes at a named release. Radix, before 1.0, did not do this. The owner has ruled that Kuiper does.
4. **Moved pages redirect permanently.** GOV.UK and Carbon do it at the server, from a list.
5. **A check stops a name from vanishing unrecorded** (Primer).

## 3. What an installed app actually sees

### The CLI resolves names through the index

- **READ** (`node_modules/shadcn-svelte/dist/index.mjs`, CLI 1.7.1, the function that resolves `registryDependencies`). A dependency's name is looked up in the registry's `index.json`. A name that is missing there is an error: "Registry item '…' does not exist in the registry". So **an alias item must be a real entry in `registry.json`**, or `add pluto-theme` fails.
- **EXECUTED** (`head -c 400 static/r/styles/maia/index.json`). The built index is a bare array of items. The registry's own `name` (`"pluto"`) is not in it.
- **READ** (the CLI's `components.json` schema in `dist/schema-D_FgDxCv.mjs`). An app's `components.json` holds one `registry` URL. CLI 1.7.1 has no named registries. So **the registry's name reaches no installed app.**

### The CLI merges the theme; it never deletes

- **READ** (`index.mjs`, the CSS merge). For a `@keyframes` rule in an item's `css`, the CLI replaces a rule of the same name, else appends a new one. It never removes a rule. The changelog has said the same of variables since 0.12.0 ("The CLI never deletes a variable the new theme lacks").
- **INFERRED.** So after an upgrade, an app's `app.css` keeps `@keyframes pluto-enter` and the other three, and gains the `kuiper-` four. An app's own `animation: pluto-enter …` keeps working with no alias from us. The old rules are dead weight until the app deletes them.
- **INFERRED.** The theme's variables keep their names (`--background`, `--mark-1` and the rest). Only the item's name changes. So `add kuiper-theme` over an app that holds `pluto-theme`'s CSS rewrites the same lines in place.

### The CLI prints no item notes

- **EXECUTED** (`grep '\.docs'` over `dist/index.mjs`: no match). The schema has a `docs` field (`schema-D_FgDxCv.mjs`, field 132), but CLI 1.7.1 never reads it. **An alias cannot warn at install time.** The guide, the changelog and the alias item's description must carry the warning.

### Svelte context keys are strings shared across items

- **EXECUTED** (`grep setContext|getContext` over `src/lib/registry/`). Seven `pluto:` keys:
  - **Two cross items.** `pluto:field` is set by `field` and read by `input`, `textarea`, `checkbox`, `switch`, `native-select`, `input-otp` and `input-group`'s password input: seven items. `pluto:field-set` is set by `field` and read by `radio-group`.
  - **Five stay inside one item.** `pluto:field-label` (`field`), `pluto:tooltip` (`tooltip`), `pluto:item-group` (`item`), `pluto:popover` and `pluto:accordion-item` (one file each).
- **INFERRED.** An app updates one item at a time. If an app updates `input` but keeps a 0.12.0 `field`, a renamed `input` reads `kuiper:field`, finds nothing, and renders without the field's id, description or error. Nothing throws. The label is no longer tied to its input. That is a silent accessibility regression, which constitution §6 forbids ("Break an installed app silently").
- **INFERRED.** A key used inside one item cannot mismatch. `add` writes all of an item's files together. Only an app's own code that reads the key (an input of its own that joins a `Field`, as the comment in `input.svelte` invites) can break.

### The storage key is read before first paint

- **EXECUTED** (`src/lib/registry/ui/theme/theme.svelte.ts`, line 15; `theme-script.svelte`, line 13). The `theme` item stores the visitor's choice under `localStorage` key `pluto-theme`. Two places name it: the store and the head script. Without a fallback, every visitor who chose light or dark loses that choice on the first load after the upgrade. They see a flash to the system's theme.
- **INFERRED.** The head script is a constant string. Renaming the key changes its bytes, so an app whose Content Security Policy allows the script by hash must update the hash. An app that passes `nonce` is unaffected.

### Files and URLs

- **EXECUTED** (`git tag`). `v0.11.0` is tagged; `v0.12.0` is not yet. Raw GitHub URLs at a tag never change, so `…/v0.11.0/static/r/styles/maia/pluto-theme.json` and `…/v0.11.0/tokens/pluto.tokens.json` keep working forever. Only `main` and the new tags move.
- **EXECUTED** (`grep pluto.tokens`). No URL on the site serves the token file. It is read at build time, and linked as source on GitHub. Before `021` it is not a published interface.
- **READ** (Cloudflare docs, "Workers static assets: Redirects", 2026-11-15). Workers with static assets read a `_redirects` file from the assets folder: `[source] [destination] [code?]`, one per line, with splats. Redirects apply before headers. The site already ships `static/_headers` the same way.
- **EXECUTED** (`grep -n webServer playwright.config.ts`). The e2e suite runs on `vite preview`, which does not read `_redirects`. A redirect can be tested in the browser only if the preview applies the same file.

## 4. What one release of old names means, by kind

| Kind | Old name | Who depends on it | Without an alias | Alias cost | Verdict (INFERRED) |
|---|---|---|---|---|---|
| Registry item | `pluto-theme` | Scripts, READMEs and docs that run `add pluto-theme`; 74 items' `registryDependencies` at old tags | `add pluto-theme` fails against 0.13.0 | One stub item: no files, `registryDependencies: ["kuiper-theme"]`. It must be in the index (§3) | **Alias.** Ruled. |
| Storage key | `pluto-theme` | Every visitor of every app that installed `theme` | Each visitor's choice is lost once, with a flash | About six lines in the head script and the store: read the new key, else read the old one, copy it, delete it | **Alias.** Ruled. |
| Context keys, across items | `pluto:field`, `pluto:field-set` | A mixed app: an old `field` with a new control, or the reverse. An app's own control | The label, description and error come unwired, silently | `field` sets both names; the eight readers read the new name, else the old | **Alias, if the owner agrees.** The ruling said they break. §3 shows the break is silent. |
| Context keys, inside items | five keys | Only an app's own code that reads one | Breaks only that app code | One more `setContext` line each | **Alias by setting both,** in the same question. |
| Keyframes | `pluto-enter`, `pluto-exit`, `pluto-mark-dock`, `pluto-mark-fade` | An app's own CSS that names one | Nothing breaks on upgrade: the CLI keeps the old rules (§3) | None needed | **No alias.** The guide says the old rules may be deleted once the app's own uses are renamed. |
| Shiki theme name | `pluto-code` | Only code that passes the name to the highlighter's Shiki core | That call breaks | Registering two names | **No alias.** Internal to `lib/highlight`; one line in the guide. |
| Token file | `tokens/pluto.tokens.json` | Anyone reading the raw file at `main` | `main`'s raw URL 404s; tag URLs keep working | A second copy of the one source, which `021` reshapes in the same release | **No alias.** Not yet a published interface. A question to the owner. |
| Site page | `/components/pluto-theme/` and its Markdown twin, `/example/pluto-theme/*` | Links, bookmarks, search engines, `llms.txt` readers | 404 | Lines in `_redirects` | **Redirect, permanently.** Not an alias: it never goes. |
| Registry name | `"pluto"` | Nothing an app sees (§3) | Nothing | None | **No alias.** Internal. |
| Package name | `pluto-design-system` | Nothing; the package is private | Nothing | None | **No alias.** Internal. |

## 5. What this suggests for `020` (INFERRED)

1. **One rename table is the source.** A data module lists every renamed name: its kind, old name, new name, alias, and what an app does. The rename script, the guide page, the changelog bullets and the stray-name check all read it. Primer and Spectrum keep renames as data for the same reason.
2. **A check that no `pluto` slips back,** with a counted allowlist: brand words, the aliases, and the historical record. It is the local form of Primer's removed-token check.
3. **Aliases are code with an end date.** Each is marked `0.14.0` in the table, and 0.14.0's first change removes them all together.
4. **Redirects from a list,** written into `static/_redirects` as GOV.UK writes its file, and applied by the preview too, so the browser suite can test them.
5. **The guide warns, because the CLI cannot.** It says when each old name goes, as GOV.UK's notes do.
6. **Prove the rename moved nothing else.** Map every new name back to its old name in the new build, and diff it against the old build. Only the aliases, the guide, the redirects and the version may differ.

## 6. Correction: old keyframes leave the built CSS (2026-11-15)

§3 said an upgraded app's own `animation: pluto-enter …` keeps working, because the CLI keeps the old rules. §4's keyframes row said "Nothing breaks on upgrade" and "No alias". Both are wrong for the built CSS. The CLI half stands; the conclusion does not.

- **READ** (`020`'s specification review, `reviews/020-the-kuiper-rename-spec-2026-11-15.md`, finding 1; `node_modules/tailwindcss` 4.3.3, `dist/lib.js`). The theme's keyframes sit in `@theme inline`. Tailwind 4.3.3 keeps a theme keyframe only if it is named by the value of an `--animate-*` variable that is used, or by an `animation:` shorthand in the same compile.
- **EXECUTED (review)**, a Tailwind `compile()` probe over an `@theme inline` block holding `--animate-enter: kuiper-enter …` and both keyframes, built with the `animate-enter` candidate:

  | The app's own CSS in the same compile | `@keyframes pluto-enter` in the output |
  |---|---|
  | none | dropped |
  | `.x { animation: pluto-enter 1s }` | kept |
  | `.x { animation-name: pluto-enter }` | dropped |

- **INFERRED.** After the update, `--animate-enter` names `kuiper-enter`. So the old four leave the built CSS unless the app's `app.css` names them in an `animation:` shorthand. A use in a Svelte `<style>` block (a separate compile), an inline `style`, an `animation-name` declaration, or a Web Animations call stops silently. That is the silent break constitution §6 forbids.
- **What follows for §4's row.** The keyframes are an interface name that does break without an alias. An alias costs four rules emitted outside `@theme`, for example under `@layer base`, where Tailwind does not prune them. Whether the CLI places them there must be proven by a built app. Without an alias, the guide must say to rename the app's own uses *before* updating the theme. `020` puts the choice to the owner (its Q5).
