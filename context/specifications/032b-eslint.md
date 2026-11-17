# 032b — ESLint

- **Status:** fit to build once the `v0.13.0` tag and `032a` have landed (the spec review's re-check, 2026-11-17). Two builder notes from the re-check: the item disable-comment test lists the five file-and-rule pairs, not a count; and its comparison config matches decision 4's Svelte block, `.svelte.js` files and `extraFileExtensions` included. The review ([`reviews/032b-eslint-spec-2026-11-17.md`](../reviews/032b-eslint-spec-2026-11-17.md)) said "not yet fit to build", with 2 Medium and 8 Low findings. Each is answered under "Review". Not built.
- **Date:** 2026-11-17
- **Author:** a spec author, for the design lead
- **Kind:** a specification in lane E. It adds a tool and four pinned development dependencies, so it is not a small change (constitution §5). It changes no item's interface, adds no token, and names no package in any item. Its fix commit touches eight items' source (lane I, and one comment in lane T's `theme` item) and seven site files (lane S), each by a line or two (decisions 14 and 15).
- **Lanes:** E: the new `eslint.config.ts`, `.github/workflows/matrix.yml`'s `checks` job, and `package.json`. I, S and T: the fix commit alone; `theme-script.svelte`'s one comment rides along in it (decision 15). In no lane: `tests/unit/` and `bun.lock`. This build holds them alone while it runs, as the one build that touches them; `bun.lock` lands like a ledger file (decision 15). Ledger files: `static/r/`, `scripts/cost/report.json`, `src/lib/site/thumbnails/manifest.json` and its pictures, `CHANGELOG.md`.
- **Depends on:** the `v0.13.0` tag, and `032a`, 0.14.0's first landing (decision 16). Nothing in this specification needs either; the order is the release's.
- **Ranked by:** the owner's answer to the structural review's T2, 2026-11-17: "(b) ESLint with `eslint-plugin-svelte`, a new pinned dependency, by a specification" ([the review](../research/2026-11-17-structural-review.md), "The owner's answers"). The roadmap gains its row in 0.14.0's table when this is ready to build. It moves no scorecard row (§"Predicted scorecard movement").
- **Research it stands on:** [ESLint for the Kuiper Design System](../research/2026-11-17-eslint.md), cited as *the memo*, by section; [the structural review](../research/2026-11-17-structural-review.md), cited as *the review*, by finding; [`025`](025-component-cost.md)'s QB (one Bun everywhere); [`022`](022-the-test-matrix.md) decision 19 and deviation 6; [`018`](018-site-polish.md) decision 13 (thumbnail hashes).

## Intent

Nothing checks this repository's code for dead names, stale suppressions or small slips. `bun run lint` is Prettier alone. The review's `tsc` probe found nine unused names, and could not read the 693 Svelte files at all. The owner chose ESLint with `eslint-plugin-svelte`. This specification adds it with the recommended rule sets, pinned, run by `bun run lint` and by CI, and fixes everything it finds today. It also sets the bar for item source: an item passes the lint shadcn-svelte holds its own items to, because an app that copies our items lints them with a set like it.

## Decisions

### 1. ESLint 10, not 9

ESLint 10 is the current major; 9 is in maintenance (*the memo* §2.1, READ). Both use only the flat config, `eslint.config.*`. shadcn-svelte and `sv`'s ESLint add-on are both on 10. So the brief's "ESLint 9 flat config" is ESLint 10's.

### 2. Four packages, pinned exactly

| Package | Version | Why |
|---|---|---|
| `eslint` | 10.14.0 | The linter. |
| `@eslint/js` | 10.0.1 | `js.configs.recommended`. ESLint 10 no longer ships it (*the memo* §2.1). |
| `typescript-eslint` | 8.72.1 | The TypeScript parser and its recommended set. Supports TypeScript `>=4.8.4 <6.1.0`; this repository pins 6.0.3. |
| `eslint-plugin-svelte` | 3.23.1 | Svelte 5 and SvelteKit rules, and the Svelte parser (`svelte-eslint-parser` 1.10.0, through it). |

- **Each is the latest released at least two weeks before 2026-11-17** (*the memo* §2.1, READ). `eslint-plugin-svelte` 3.24.0 missed the cut-off by hours.
- **The install is one command**, run once by the builder:

  ```
  bun add -d -E --ignore-scripts --minimum-release-age=1209600 \
    eslint eslint-plugin-svelte typescript-eslint @eslint/js
  ```

  `-E` writes exact versions. `--minimum-release-age` holds every transitive package to two weeks too (*the memo* §2.3, EXECUTED: 100 new packages, none already in `bun.lock` moved). If Bun picks any version other than the table's, the builder stops and asks the design lead: the registry has changed since this was written.
- **All four are devDependencies, exact.** That is `001`'s rule for tools, held by `tests/unit/deps.test.ts`.
- **Not added: `eslint-config-prettier` and `globals`** (*the memo* §2.4, EXECUTED). Of the 105 rules the recommended sets turn on, `eslint-config-prettier` turns off only `no-unexpected-multiline`, which finds nothing here and catches a real hazard. `globals` matters only to `no-undef`, which decision 4 turns off. Without either, the result is the same. `eslint-plugin-svelte`'s own `configs.prettier` stays, as a guard that costs no package.
- **Not added: `@eslint/compat`.** Its one use would be to read `.gitignore`. Decision 6 lists the ignores, and a test holds them to `.gitignore`.
- **Not added: `eslint-plugin-playwright`.** Q1's `forbidOnly` covers `test.only` at run time (*the memo* §8).

### 3. The config file: `eslint.config.ts`

- At the repository root, in TypeScript, like `vite.config.ts` and the Playwright configs. `tsconfig.json`'s `include` already holds `*.ts`, so `svelte-check` type-checks it (EXECUTED: 0 errors).
- ESLint loads a `.ts` config natively under Bun (*the memo* §2.3, READ). Every script runs it under `bun --bun`, as Prettier runs now.
- It uses `defineConfig` from `eslint/config`. `typescript-eslint`'s `ts.config()` is its older helper.
- Its full text is under "Design". Each rule change carries its reason in a comment.

### 4. The rule set

- **The three recommended sets**: `js.configs.recommended`, `ts.configs.recommended`, `svelte.configs.recommended`, then `svelte.configs.prettier`. These are what `sv add eslint` writes into an app (*the memo* §5.1, READ).
- **The TypeScript parser in Svelte files**: `parserOptions.parser: ts.parser`, with `.svelte` as an extra extension. No project service (decision 5).
- **Stale suppressions fail**: `linterOptions.reportUnusedDisableDirectives` and `reportUnusedInlineConfigs` are `"error"`.
- **Warnings fail**: `lint:code` passes `--max-warnings=0`. The plugin's recommended set has two warnings, `svelte/no-inspect` and `svelte/no-at-debug-tags`. A committed `$inspect` should fail (EXECUTED: it warns, and fails only with the flag).
- **Six changes**, each from *the memo* §3.3:

| Rule | Setting | Reason |
|---|---|---|
| `no-undef` | off | TypeScript checks names. `typescript-eslint` advises it off; shadcn-svelte and `sv` turn it off. |
| `@typescript-eslint/no-unused-vars` | `args: "all"`, `caughtErrors: "all"`, and `^_` for args, vars and destructured arrays. No `ignoreRestSiblings`, and no pattern for caught errors | `args: "all"` finds an unused first parameter: the review's two `page`s, which the default misses (*the memo* §3.2). `_` marks a name unused on purpose, as shadcn-svelte's own config does; a destructured array element is a variable there too. A rest sibling or a caught `_e` is not exempt: shadcn-svelte's set reports both, and nothing here needs them (the spec review's finding 1, EXECUTED: 0 findings without them). |
| `svelte/no-navigation-without-resolve` | off | 107 findings. An item's link comes from a prop; the route is the app's. The site sets no base path, so `resolve()` would change no URL. shadcn-svelte turns it off, and its own button fails it. The site's 88 links are safe only while that holds, so a unit test fails if a base path is ever set, and says to turn the rule back on outside `src/lib/registry/` (criterion 14). |
| `svelte/no-useless-mustaches` | off | 9 findings, none useless. `prettier-plugin-svelte` writes `{" "}`; `{"<Stage>"}` keeps a tag out of the markup; others carry escapes or quotes. The rule fights the formatter. |
| `no-empty-pattern` | `allowObjectPatternsAsParameters`, in Playwright code only: `tests/e2e/`, `tests/sr/` and `tests/ledger.ts` | Playwright reads a fixture's first parameter as a pattern, so `({}, info)` is required. The four findings sit in these three places; `tests/ledger.ts` is the fault ledger's Playwright fixture. Bun's suites under `tests/unit/` and `tests/smoke/` take no fixture, and keep the stock rule, as items do. |
| `@typescript-eslint/no-explicit-any` | off outside `src/lib/registry/` | `strict` forbids an implicit `any`; an explicit one is a written choice, and the review counts them as rare (T3). Items keep the rule: an app's lint runs it on them, and the stock chart's three directives name it. |

Nothing else is changed from the recommended sets.

### 5. No type-aware rules

`recommendedTypeChecked` with the project service took 292 s against 17 s, and added 1,662 findings, mostly `no-unsafe-*` where tests read `JSON.parse` (*the memo* §4, EXECUTED). It failed to parse 77 fixture files the tsconfig excludes. Three rules had value: `no-floating-promises` (14), `await-thenable` (5), `no-misused-promises` (3). None marks a known bug. `svelte-check` already type-checks every file. shadcn-svelte leaves the project service off for the same cost. A later specification may add `no-floating-promises` alone if a dropped promise ever causes a bug.

### 6. What is ignored

ESLint's flat config ignores only `node_modules/` and `.git/` by default. A file under `.claude/worktrees/` is linted unless listed (*the memo* §3.4, EXECUTED). The list:

- **`.gitignore`'s folders**: `.claude/` (the worktrees), `.svelte-kit/`, `.wrangler/`, `build/`, `dist/`, `test-results/`, `playwright-report/`, `blob-report/`, `matrix-report/`, `recordings/`. `node_modules/` is ESLint's default.
- **`context/`**: research probes are records. A memo is never edited after the fact. This also covers `context/prior_art/`.
- **`static/`**: the generated registry and the release snapshots, all JSON. ESLint would read none of it; the ignore saves the walk.
- **What `tsconfig.json` excludes**: `tests/smoke/fixtures/`, `scripts/cost/app/`, `scripts/cost/fixtures/`. They are scratch apps and fixtures that the smoke test and `bun run cost` copy into apps.
- **`tests/unit/fixtures/`**: inputs whose shape is the test, such as `api/snippet-boundary.svelte`.

Not ignored: `src/lib/site/listed-items.ts` and the other generated sources. They pass today. A generator that writes code the lint rejects is a defect in the generator.

A unit test holds the list to `.gitignore`: every folder `.gitignore` names (a line ending `/`, outside `context/`) is ignored (criterion 4). Each probe is a `.ts` file, such as `build/x.ts`, since ESLint calls any path no config's `files` matches ignored, a `.json` one included. The test also checks that `src/x.ts` is linted, so the probe can fail.

### 7. The bar for item source

- **An item passes, with no error, the lint shadcn-svelte holds its own items to** (*the memo* §5.2, READ at shadcn-svelte `c3b21a6`). That set is the three recommended sets, with `no-undef` off, `^_` names allowed, `no-navigation-without-resolve` off and `no-useless-mustaches` a warning. After this build, every item meets it with one warning (*the memo* §5.3, EXECUTED).
- **Our config is at least as strict as the stock sets on item files, but for three named rules**: `no-undef`, `svelte/no-navigation-without-resolve` and `svelte/no-useless-mustaches`. A unit test resolves the config for item files and compares it with the stock sets, by level and by options (criterion 5):
  - **Levels:** over the union of three item files, the rules weaker than the stock sets are exactly those three. Each file's own list is a subset. (`ts.configs.recommended` already turns `no-undef` off in `.ts` files.)
  - **Options:** every other rule's options equal the stock sets'. `@typescript-eslint/no-unused-vars` is checked by named fields against shadcn-svelte's set: `args` and `caughtErrors` are `"all"`; `ignoreRestSiblings` is off; `argsIgnorePattern`, `varsIgnorePattern` and `destructuredArrayIgnorePattern` are `^_`, as shadcn-svelte's allows; there is no `caughtErrorsIgnorePattern`; and no other field is set.
  - So passing our lint means passing shadcn-svelte's. A later edit cannot weaken an item rule through its options unseen.
- **The app set is not the bar.** `sv add eslint`'s set still reports 21 errors on our items after the fixes: 18 links from props, 2 `_` names, 1 Prettier-made space (*the memo* §5.3, EXECUTED). shadcn-svelte's own button and chart fail it the same way. An item cannot `resolve()` a link it is handed.
- **Items carry no `eslint-disable` comment but these five**, held by a unit test (criterion 6):
  - `ui/chart/chart-tooltip.svelte`, two, and `ui/chart/chart-utils.ts`, one: stock shadcn-svelte comments for `no-explicit-any`, kept as they are. shadcn-svelte's chart carries the same three.
  - `ui/theme/theme-script.svelte`: `svelte/no-at-html-tags`, with a reason (decision 13).
  - `components/settings-form.svelte`: `no-useless-assignment`, with a reason (decision 13).
- **Telling adopters the bar** is out of scope. A line on the install page is a lane S change for later (§"Scope").

### 8. Disable comments elsewhere

- Allowed only where the code is right and the rule cannot see why.
- Each gives its reason after ` -- `, on the comment, as ESLint allows. That includes an `eslint-enable`, which says where the exception ends. A unit test holds every directive comment under `src/`, `scripts/`, `tests/` and the root configs to a reason, but the three stock chart comments (criterion 6). It reads only comments that begin a line, so a test's string that holds a directive is not counted.
- Next to the line, never file-wide without a matching enable, and never in a separate allow-list file. The reason is read where the code is. A comment that stops silencing anything fails the lint.

### 9. The scripts

```json
"lint": "bun run lint:format && bun run lint:code",
"lint:format": "bun --bun prettier --check .",
"lint:code": "bun --bun eslint --max-warnings=0 --cache --cache-location node_modules/.cache/eslint/ ."
```

- `lint` keeps its name and meaning: every lint a builder runs before landing.
- `lint:format` is today's `lint`, renamed.
- `--cache` makes a second local run 1.3 s, and a config change invalidates it (*the memo* §3.6, EXECUTED). The cache lives under `node_modules/`, which git ignores and each worktree has its own.
- No `--concurrency`: it doubled the CPU and saved little (*the memo* §3.6, EXECUTED). No `--fix` script: a builder runs `bunx eslint --fix` by hand and reads the diff.
- The README's command list (line 24, "`bun run lint       # prettier`") says "prettier, then eslint".

### 10. The CI step

In `.github/workflows/matrix.yml`'s `checks` job, the one step `bun run lint` becomes two, in its place:

```yaml
      - run: bun run lint:format
      - run: bun run lint:code
```

Two steps name which lint failed and time each. `bun scripts/lint-literals.ts` stays where it is, after them. `tests/unit/workflow.test.ts` holds both steps (criterion 3). No other job changes.

### 11. The gate: CI's `checks` job and `bun run lint`

- **The gate for lint is CI's `checks` job**, which runs both lints (decision 10), **and `bun run lint`**, which a builder runs before landing (build order step 9). The handoff's landing gate, `release-check.ts --before-ci`, runs no lint, and this build does not make it one.
- **`scripts/site/release-check.ts` does not change.** Lint is CI's evidence, and the tag already needs a green `matrix` push run of HEAD (`022` decision 19).

### 12. `lint-literals.ts` stays separate

It is constitution §4.3's token lint: 21 numbered rules, counted allowances, and a library five unit test files import. It reads class strings and CSS, which an ESLint rule could not do without a custom rule per check, and not in CSS files at all. `050` plans its next form (*the memo* §6.3). The review's W1, adding it to `bun run lint`, stays its own small change; it adds `lint:literals` to decision 9's chain.

### 13. Today's findings: every one dealt with in this build

The proposed set reports 43 findings in 28 files at `b01e754` (*the memo* §3.5, EXECUTED). Each is dealt with in one of three ways (INFERRED, *the memo* §7):

- **A real slip is fixed.** 24 findings.
- **A plugin misreading is fixed by rewriting the code so the rule reads it right**, never by turning off a rule that also finds real faults. 13 findings, one comment.
- **Deliberate code keeps a disable comment with its reason** (decision 8). 6 findings.

| # | File and line at `b01e754` | Rule | What the build does |
|---|---|---|---|
| 1–4 | `tests/e2e/compositions.spec.ts:25`, `four-dot.spec.ts:4`, `site.spec.ts:21`, `tokens.spec.ts:10` | `no-unused-vars` | Remove the `ThemeName` import. |
| 5 | `tests/e2e/frames.spec.ts:32` | `no-unused-vars` | Drop `page` from `pick()`, and from its five calls. |
| 6 | `tests/e2e/toast.spec.ts:804` | `no-unused-vars` | Drop `page` from `under()`, and from its one call. |
| 7 | `tests/e2e/keyboard.spec.ts:5` | `no-unused-vars` | Remove the `activate` import. |
| 8 | `tests/unit/contrast.test.ts:21` | `no-unused-vars` | Remove the `validateTokens` import. |
| 9 | `src/lib/registry/lib/highlight/tree-sitter.ts:581` | `no-unused-vars` | Drop the callback's unused `text` parameter. |
| 10 | `src/lib/registry/ui/search-field/search-field.svelte:71` | `no-unused-vars` | Remove `pause`, never read, and its two increments (lines 86, 112). |
| 11 | `src/lib/site/brand/lockup-figure.svelte:14` | `no-unused-vars` | Remove the `rise` prop from the props and their type, and `rise={m.rise}` from `brand/mark/+page.svelte`. Measure F is drawn from `markY` and `side` (line 89), so the figure does not change. |
| 12–15 | `ui/input-group/input-group-addon.svelte:44`, `ui/pagination/pagination.svelte:269` (two codes), `ui/tag/tag-group.svelte:70` | `no-unused-svelte-ignore` | Remove each stale `svelte-ignore`. Svelte 5.57.3 emits no warning there without it (EXECUTED). |
| 16–28 | `ui/toast/toaster.svelte:522` | `no-unused-svelte-ignore` | Move the reason to its own comment just before: `<!-- Its keys and pointer pauses are delegated from the toasts inside it. -->`, then `<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->`. Svelte still applies the ignore (EXECUTED). |
| 29 | `src/lib/registry/lib/highlight/tree-sitter.ts:901` | `no-useless-assignment` | `let tree: Tree \| null;`, with no initial value. |
| 30 | `ui/toast/toaster.svelte:259` | `no-useless-assignment` | `let visible: boolean;`. |
| 31 | `tests/sr/sr.ts:65` | `no-useless-assignment` | `let hit: boolean;`. |
| 32 | `tests/unit/tokens-dtcg.test.ts:355` | `no-useless-assignment` | `let at: Json \| undefined;`. |
| 33 | `components/settings-form.svelte:75` | `no-useless-assignment` | Keep. `// eslint-disable-next-line no-useless-assignment -- the default is what a bound parent reads before the first edit.` |
| 34 | `ui/theme/theme-script.svelte:58` | `svelte/no-at-html-tags` | Keep. `<!-- eslint-disable-next-line svelte/no-at-html-tags -- the tag is a constant built in this file; no input reaches it. -->` |
| 35 | `src/lib/site/example-theme-script.svelte:8` | `svelte/no-at-html-tags` | Keep, with the same kind of reason. |
| 36–37 | `src/lib/site/examples/chart/two-series.svelte:74`, `variants.svelte:59` | `svelte/no-useless-children-snippet` | Unwrap: the chart's content goes in as its children, with no `{#snippet children()}`. |
| 38 | `scripts/site/thumbnails.ts:276` | `preserve-caught-error` | Pass `{ cause: e }` to the new `Error`. |
| 39 | `src/lib/site/examples/theme/script.svelte:15` | `no-useless-escape` | Keep. The escape sits inside a template literal, so a block pair: `/* eslint-disable no-useless-escape -- unescaped, the closing tag would end this script block. */` before the `const`, `/* eslint-enable no-useless-escape -- the template literal ends above. */` after. |
| 40 | `src/routes/(site)/foundations/colour/+page.svelte:48` | `svelte/prefer-svelte-reactivity` | Keep. `// eslint-disable-next-line svelte/prefer-svelte-reactivity -- a local set, dropped when the derived returns; nothing reads it reactively.` |
| 41 | `tests/ledger.ts:55` | `no-control-regex` | Keep. `// eslint-disable-next-line no-control-regex -- the escape character is what it strips.` |
| 42 | `tests/unit/toast-words.test.ts:135` | `prefer-const` | `const t = 0;`. The test's clock stands still on purpose. |
| 43 | `tests/unit/workflow.test.ts:193` | `no-regex-spaces` | Two spaces become ` {2}`. |

- **The nine names the review found are 1 to 9.** 10 and 11 are two more, in `.svelte` files the review's probe could not read.
- EXECUTED in the scratch clone: with these edits, `eslint .` exits 0, `bun run check` reports 0 errors, and Prettier passes after `--write` on the two files whose import lists collapse (*the memo* §3.5).
- **The build's base will not be `b01e754`.** Specifications land between now and the build. So the build's first step re-runs the lint on its base and records the count by rule. A finding not in this table is dealt with by the same three ways. A new disable comment in an item is not allowed without the design lead's ruling, recorded in the landing notes, and criterion 6's list grows with it.

### 14. What the fixes move

- **Eight items' source**: `highlighter`, `input-group`, `pagination`, `search-field`, `settings` (its `settings-form.svelte`), `tag`, `theme`, `toast`. None changes an interface: no prop, slot, export, class or rendered element. `toast` keeps its `svelte-ignore`; `search-field` loses a variable nothing read.
- **`static/r/`** is regenerated with `bun run build:registry`.
- **`scripts/cost/report.json`**: `bun run cost --sizes-only` for the eight items (`025`'s landing rulings).
- **The thumbnails**: all 82 pairs go stale (`018` decision 13; *the memo* §7, EXECUTED). `scripts/site/thumbnails.ts` (row 38) and `ui/theme/theme-script.svelte` (row 34) are inputs of every pair. `package.json` is an input of 65, through `src/lib/site/site.ts`'s import. The two chart examples' markup also changes. So `bun scripts/site/thumbnails.ts` recaptures all, not `--hash-only`: one run of about three minutes, which also proves the changed comments in `toaster` and `theme-script` change no picture. No picture should differ. The landing notes record how many do.
- **`tests/unit/deps.test.ts`** gains a block, `PACKAGES_032B`, appended as `017`, `019` and `022` did.
- **`CHANGELOG.md`**, in the release's section: one bullet, with the eight items in its head. The site's `updatedIn` reads the names before a bullet's first colon (`src/lib/site/changelog.ts:176`), so this marks each item updated in 0.14.0: "- `highlighter`, `input-group`, `pagination`, `search-field`, `settings`, `tag`, `theme`, `toast`: dead code or a stale `svelte-ignore` comment removed, found by the new ESLint check. No interface change."

### 15. Lanes

- **Lane E holds the build**: the lint config, CI and `package.json` (the design lead's ruling on the spec review's finding 7).
- **The fix commit also touches lanes I, S and T**, by one or two lines a file. Lane T holds the `theme` item (roadmap §2), so `theme-script.svelte`'s one comment (row 34) is T's; it rides along in the fix commit. The commit runs when no lane I, S or T build has those files open. The builder checks the open worktrees first (`git worktree list`) and names any overlap to the design lead.
- **`tests/unit/` and `bun.lock` are in no lane** (roadmap §2 names neither; the structural review's X4 proposes `tests/`, but it is not yet a rule). This build holds them alone while it runs, as the one build that touches them. If another build changes `bun.lock` first, this one takes the base's copy and re-runs decision 2's install command, as a ledger file is regenerated.
- **Ledger edits land one at a time**, in landing order (roadmap §2).

### 16. When it lands: 0.14.0

- After the `v0.13.0` tag, and after `032a`.
- 0.13.0 is gathering its tag's evidence: a green matrix run and an empty fault ledger. This build edits eight items and every thumbnail's hash. Landing it now would put that churn into the release's last runs (INFERRED).
- The design lead may move it into 0.13.0 if the tag waits long. That changes the changelog section alone. `registry.test.ts:2486`–`2507` asserts one 0.13.0 bullet each for `pagination`, `search-field` and `tag`, but it counts only bullets that begin with the item's name (READ), so decision 14's bullet, which begins with `highlighter`, does not break it. The builder runs that test after writing the bullet.

## Design

### `eslint.config.ts`

EXECUTED in the scratch clone, as revised after the spec review: this text passes Prettier, and with the fixes `eslint --max-warnings=0 .` exits 0.

```ts
/**
 * 032b: the code lint. `bun run lint:code` runs it, after Prettier.
 *
 * The three recommended sets, as an app's `sv add eslint` writes them, and
 * no type-aware rules (032b decision 5). On item files it is at least as
 * strict as the set shadcn-svelte holds its own items to (decision 7);
 * `tests/unit/eslint.test.ts` holds both.
 */
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import { defineConfig } from "eslint/config";
import ts from "typescript-eslint";

export default defineConfig(
  {
    // Decision 6: .gitignore's folders (.claude/ holds the worktrees), what
    // is built or generated as data, the probes of research memos, and what
    // tsconfig.json excludes. Fixtures are inputs whose shape is the test.
    ignores: [
      ".claude/",
      ".svelte-kit/",
      ".wrangler/",
      "build/",
      "dist/",
      "test-results/",
      "playwright-report/",
      "blob-report/",
      "matrix-report/",
      "recordings/",
      "context/",
      "static/",
      "tests/smoke/fixtures/",
      "tests/unit/fixtures/",
      "scripts/cost/app/",
      "scripts/cost/fixtures/",
    ],
  },
  {
    // A disable comment that silences nothing fails.
    linterOptions: {
      reportUnusedDisableDirectives: "error",
      reportUnusedInlineConfigs: "error",
    },
  },
  js.configs.recommended,
  ts.configs.recommended,
  svelte.configs.recommended,
  svelte.configs.prettier,
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: { extraFileExtensions: [".svelte"], parser: ts.parser },
    },
  },
  {
    rules: {
      // TypeScript checks names; typescript-eslint advises this off.
      "no-undef": "off",
      // Every parameter, so an unused first one is found (the review's T2:
      // `page` in frames.spec.ts and toast.spec.ts). `_` marks one on purpose,
      // as in shadcn-svelte's set; rest siblings and caught errors are not
      // exempt, so items stay at least as strict as that set (decision 7).
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      // An item's link comes from its props, and the site has no base path,
      // so resolve() would change no URL. shadcn-svelte turns it off too.
      // eslint.test.ts fails if a base path is ever set.
      "svelte/no-navigation-without-resolve": "off",
      // Prettier writes {" "}, and {"<Stage>"} keeps a tag out of the markup.
      "svelte/no-useless-mustaches": "off",
    },
  },
  {
    // Playwright reads a fixture's first parameter as a pattern: ({}, info).
    // Playwright code only; the Bun suites keep the stock rule.
    files: ["tests/e2e/**", "tests/sr/**", "tests/ledger.ts"],
    rules: {
      "no-empty-pattern": ["error", { allowObjectPatternsAsParameters: true }],
    },
  },
  {
    // `strict` forbids an implicit any; an explicit one is a choice. Items
    // keep the rule, since an app's lint runs it on them.
    ignores: ["src/lib/registry/**"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
);
```

### `tests/unit/eslint.test.ts`

A new unit test file. It drives ESLint's Node API (`new ESLint()`): `lintText` on planted snippets, `isPathIgnored`, and `calculateConfigForFile`. It never lints the whole tree, so it adds about a second to the unit suite.

EXECUTED, after the spec review: a prototype of every case below, against decision 3's revised config on the fixed scratch tree, gave 35 tests passing in 1.3 s. Each mutation of the config that a case guards made that case fail: `ignoreRestSiblings` or `caughtErrorsIgnorePattern` put back, `no-empty-pattern`'s exception widened to `tests/**`, `.claude/` dropped from the ignores, a `base` added to `vite.config.ts`'s `paths`, and the `eslint-enable` reason removed. The prototype is in the session scratchpad, `eslint032b/proto/eslint.test.ts`; it is not durable, and the builder writes the test afresh from this list.

- **Planted code** (`lintText` with a `filePath`). Each case asserts the full list of rule ids, so a stray finding fails it. Each planted function is exported, so only the name under test can be unused.
  - `const planted = 1;` and `export {};` in `src/lib/planted.ts`: exactly `[@typescript-eslint/no-unused-vars]`.
  - `const planted = 1;` inside `<script lang="ts">` in `src/lib/registry/ui/planted/planted.svelte`: exactly that one.
  - `export function f(page: number, b: number) { return b; }` in `tests/e2e/planted.ts`: exactly that one. With `_page`: none.
  - `// eslint-disable-next-line no-console` over `export const x = 1;`: one error with no rule id, an unused directive.
  - `$inspect(1);` in a Svelte script, at a path no other case uses: exactly one `svelte/no-inspect` warning. (The Svelte parser keeps a result per path within one `ESLint` instance, so a reused path gives the earlier case's answer: EXECUTED.)
  - `test("x", ({}, _info) => {});`, with `test` imported from `@playwright/test`, in `tests/e2e/planted.spec.ts` and in `tests/sr/planted.sr.ts`: none.
  - `export const f = ({}) => 1;` in `tests/unit/planted.test.ts` and in `src/lib/planted.ts`: exactly `[no-empty-pattern]`.
  - `export const a: any = 1;`: exactly `[@typescript-eslint/no-explicit-any]` in `src/lib/registry/lib/planted.ts`; none in `tests/e2e/planted.ts` or `src/lib/site/planted.ts`.
  - In `src/lib/registry/lib/planted.ts`, an exported function with `const { a, ...rest } = o; return rest;`, and another with `catch (_e) { return 0; }`: each exactly `[@typescript-eslint/no-unused-vars]`.
- **Ignores** (`isPathIgnored`), every probe a `.ts` file:
  - `src/x.ts` is linted, so the probes can fail.
  - `<folder>x.ts` is ignored for each folder `.gitignore` names (a line ending `/`, outside `context/`).
  - `context/research/x.ts`, `static/x.ts`, `static/r/x.ts`, and `x.ts` in each of decision 6's fixture folders are ignored.
  - `src/lib/site/listed-items.ts`, `eslint.config.ts`, `vite.config.ts`, `tests/e2e/pages.ts` and `scripts/build-registry.ts` are linted.
- **The item bar** (`calculateConfigForFile`): a second `ESLint` instance, built with `overrideConfigFile: true` from the three stock sets and the TypeScript parser in Svelte files. Three item files: `ui/button/button.svelte`, `ui/chart/chart-utils.ts`, `ui/toast/toast-queue.ts`.
  - **Levels:** for each file, every rule the stock instance has at warn or error that ours has lower is one of `no-undef`, `svelte/no-navigation-without-resolve` and `svelte/no-useless-mustaches`. The union over the three files is exactly those three.
  - **Options:** for each file, every other rule the stock instance turns on has the same options in ours, by deep equality, but `@typescript-eslint/no-unused-vars`. That one is checked by field, as decision 7 lists: `args` and `caughtErrors` `"all"`; `ignoreRestSiblings` unset or false; `argsIgnorePattern`, `varsIgnorePattern` and `destructuredArrayIgnorePattern` `^_`; no `caughtErrorsIgnorePattern`; no other field.
- **No base path**: `vite.config.ts`'s `paths` object holds no `base` key, and no `svelte.config.js` or `svelte.config.ts` exists. Its message says to turn `svelte/no-navigation-without-resolve` back on outside `src/lib/registry/` if a base path is ever added.
- **Directive comments**: a scan of every `.ts`, `.js` and `.svelte` file ESLint reads, for comments that begin a line with `eslint-disable`, `eslint-disable-next-line`, `eslint-disable-line` or `eslint-enable`.
  - Under `src/lib/registry/`: exactly decision 7's five directives, by file and rule.
  - Everywhere: each directive comment, `eslint-enable` included, has ` -- ` and a reason, but the three stock chart ones.
  - In each file, every block `eslint-disable` has a matching `eslint-enable`.
- **The scripts**: `package.json`'s `lint`, `lint:format` and `lint:code` equal decision 9's strings.

### `tests/unit/workflow.test.ts`

One new test: the `checks` job runs `bun run lint:format` and then `bun run lint:code`, both after `bun run check` and before `bun scripts/lint-literals.ts`, and no step runs `bun run lint` or `prettier` or `eslint` otherwise.

### `tests/unit/deps.test.ts`

A block appended after `PACKAGES_022`, in its form:

```ts
// 032b decision 2: the code lint's four packages, dev-only, exact.
const PACKAGES_032B: [name: string, version: string, specifier: string][] = [
  ["eslint", "10.14.0", "10.14.0"],
  ["@eslint/js", "10.0.1", "10.0.1"],
  ["typescript-eslint", "8.72.1", "8.72.1"],
  ["eslint-plugin-svelte", "3.23.1", "3.23.1"],
];
PACKAGES.push(...PACKAGES_032B);
```

and a `describe` that checks each, as `022`'s does. It also checks that `eslint-config-prettier`, `globals` and `@eslint/compat` are not in `package.json` (decision 2).

## Scope

**In:**

- The four packages in `package.json` and `bun.lock`.
- `eslint.config.ts`.
- `package.json`'s three lint scripts; the README's one command line.
- The `checks` job's two lint steps.
- `tests/unit/eslint.test.ts`; one test in `workflow.test.ts`; the block in `deps.test.ts`.
- Every finding of decision 13, in the files it names, and any new finding on the build's base by the same rules.
- The ledger work of decision 14.

**Out:**

- Type-aware rules (decision 5).
- `eslint-plugin-playwright`, and Q1's `forbidOnly`, which is its own small change.
- `lint-literals.ts`, and W1 (decision 12).
- `noUnusedLocals` and `noUnusedParameters` in `tsconfig.json`: the review's option (a), which the owner did not choose. ESLint covers both, and reads `.svelte` files.
- T3's non-null assertions and the `strict` set.
- Editor setup, a pre-commit hook, and Dependabot (W3).
- A line on the design site telling adopters the item bar (decision 7). A later lane S change.
- A `minimumReleaseAge` in `bunfig.toml` for every install. This build uses the flag once.

## Tests, written first

Each is written and seen failing before the code it checks. The landing notes record each failure.

1. `deps.test.ts`'s `PACKAGES_032B` block fails before the install: four packages missing, and the package-set test counts four fewer.
2. `eslint.test.ts` fails before the install (no `eslint` to import), and again after the install but before `eslint.config.ts` exists (ESLint finds no config). With a config of the three stock sets alone, its ignore, item-bar, scripts and directive-comment tests fail, each for its own reason. The no-base-path test cannot fail first on this tree; it is proved by mutation (a `base` added to `vite.config.ts`, then removed), and the landing notes say so.
3. `workflow.test.ts`'s new test fails on `b01e754`'s workflow, which runs `bun run lint` in one step.
4. `bun run lint` fails on the build's base with the config in place and before the fixes. Its count by rule is recorded, against decision 13's 43.

## Acceptance criteria

1. `package.json` names `eslint` 10.14.0, `@eslint/js` 10.0.1, `typescript-eslint` 8.72.1 and `eslint-plugin-svelte` 3.23.1, exact, in `devDependencies`, and `bun.lock` resolves each to that version. No package already in `bun.lock` at the build's base changes version. `deps.test.ts` holds this, and was seen failing first. (unit)
2. `eslint.config.ts` is decision 3's file, with decision 4's rules and decision 6's ignores. `bun run check` reports 0 errors with it. (check)
3. `package.json`'s `lint`, `lint:format` and `lint:code` are decision 9's strings. `matrix.yml`'s `checks` job runs `bun run lint:format` then `bun run lint:code`, in the place of `bun run lint`. `workflow.test.ts` holds the job's steps, and was seen failing first. (unit)
4. `eslint.test.ts`'s planted-code and ignore tests pass, each asserting its full list of rule ids: an unused name fails in `.ts` and `.svelte` files, an unused first parameter fails, `_` passes, a stale directive fails, `$inspect` warns, the Playwright pattern passes only in `tests/e2e/`, `tests/sr/` and `tests/ledger.ts`, `no-explicit-any` holds only under `src/lib/registry/`, a rest sibling and a caught `_e` fail in item code, and every `.gitignore` folder is ignored, probed with `.ts` files. Seen failing first. (unit)
5. `eslint.test.ts`'s item-bar test passes: on item files our config is at least as strict as the three stock sets, by level and by options, with exactly three exceptions over the union of the three files. Seen failing first against a config that turns `no-explicit-any` off everywhere, and against one that sets `ignoreRestSiblings`. (unit)
6. `eslint.test.ts`'s directive-comment test passes: exactly five directives under `src/lib/registry/`, each of decision 7's; every other directive comment, `eslint-enable` included, has a ` -- ` reason; no unmatched block disable. Seen failing first, before the two new item directives exist. (unit)
7. `bun run lint` exits 0 on the built tree, before landing (decision 11). Seen failing first on the base (test 4). (EXECUTED, landing notes)
8. With `const planted = 1;` added to `src/lib/utils.ts`, `bun run lint` exits 1 and names `@typescript-eslint/no-unused-vars`. The same with the line in `src/lib/registry/ui/button/button.svelte`'s script. Each is restored after. (EXECUTED, landing notes)
9. Each of decision 13's 43 findings is dealt with as its table says. The nine names the review found are gone, and `pause` and `rise`. (lint, review)
10. `bun run check` reports 0 errors. `bun run test:unit` passes. `bun run test:e2e` passes in Chromium, including the seven changed spec files. (check, unit, e2e)
11. `static/r/` is regenerated; `cost.test.ts` passes with the eight items' sizes current; `thumbnails.test.ts` passes after a full recapture, and the landing notes say how many pictures changed (expected: none). The changelog has decision 14's bullet. (unit, landing notes)
12. In the next `matrix` push run, the `checks` job's two lint steps pass, and the landing notes record each step's time. (CI)
13. The scorecard is re-run and its run log has a row. No row is expected to move. (scorecard)
14. `eslint.test.ts`'s no-base-path test passes, and fails with a `base` added to `vite.config.ts`'s `paths` (proved by mutation, landing notes). (unit)

## Build order

1. Re-run *the memo*'s probe on the build's base, with decision 3's config in a scratch copy. Record the count by rule. Compare with decision 13; deal with any new finding by its three ways.
2. Write tests 1 to 3. See them fail.
3. Install the four packages (decision 2's command). See test 1 pass.
4. Add `eslint.config.ts`. Run test 4: `bun run lint` fails, with the counts recorded.
5. Change the scripts, the README line and the CI step. See test 3 pass.
6. Make decision 13's fixes, one commit. `bun --bun prettier --write` the files whose imports collapse.
7. Run criteria 7 and 8.
8. Ledger: `bun run build:registry`; `bun run cost --sizes-only` for the eight items; `bun scripts/site/thumbnails.ts`; the changelog bullet.
9. `bun run lint`, `bun run check`, `bun run test:unit`, `bun run test:e2e`, `bun scripts/site/release-check.ts --before-ci`. `bun run lint` is this build's gate before landing; the release check does not lint (decision 11).
10. The change review, by someone who did not build it. Then the scorecard.

## Cost to CI time

- **The `checks` job: about 20 s more**, for `lint:code` (*the memo* §3.6, EXECUTED: 19.7 to 22.0 s of CPU on one core, 17 s wall at the lowest load measured). Prettier's step keeps its time. The job's 45-minute limit is far off.
- **Every job that installs: about 2 s more** for 100 more packages and 26 MB (EXECUTED: a cold install went from 3.3 s to 5.4 s). About 45 jobs install in a full run, in parallel, so about 90 s of runner time and almost no wall time. W3's Bun cache, if it lands, takes most of it back.
- **No new job, and no new runner.**
- **Local:** `bun run lint` is about 20 s longer cold, and about 1.3 s for ESLint on a second run.
- With type-aware rules it would have been about five minutes (decision 5).

## Predicted scorecard movement

None. No row reads the repository's lint. Row 15 (component cost) holds: the eight items lose a few bytes of dead code and comments, and gain two comment lines.

## Risks

- **TypeScript 7.** `typescript-eslint` 8.73.0 still stops below TypeScript 6.1, and TypeScript's latest is 7.0.2 (*the memo* §2.2, READ). Moving off 6.0 now needs `typescript-eslint`'s support as well as `svelte-check`'s. The pin makes the coupling visible; it does not add a new limit today.
- **Plugin misreadings.** One was found (decision 13, rows 16–28). A later Svelte may add forms the plugin misreads. The answer is the same: rewrite so it reads right, or a reasoned disable outside items.
- **The base moves.** Landings before this build may add findings. Build step 1 counts them first, and decision 13's three ways decide each.
- **ESLint runs under Bun, not Node.** ESLint's engines name Node only (READ). It ran clean under Bun 1.4.4 (EXECUTED). If a later Bun breaks it, `lint:code` drops `--bun` and runs under the runner's Node. In the probe, Node 22 loaded the TypeScript config and linted clean (EXECUTED), through `jiti`, which `bun.lock` already holds (READ). That is a small change.
- **The thumbnail recapture** is long (`022`'s landing: 164 s for 150 pictures) and needs Chromium. It is one run.
- **Pinned tools age.** Nothing proposes the next version (W3). An upgrade is a small change: the new pins, `deps.test.ts`'s block, and a lint run.

## Open questions for the owner

None. Every choice above is among options the owner's delegation leaves to the design lead ("Delegation", the review's owner's answers). The ones the owner may wish to reverse:

- **Decision 1**: ESLint 10, not 9.
- **Decision 2**: four packages; no `eslint-config-prettier` or `globals`.
- **Decision 5**: no type-aware rules.
- **Decision 7**: the item bar is shadcn-svelte's own set, not the set `sv add eslint` writes into an app.
- **Decision 16**: 0.14.0, not 0.13.0.

## Review

The spec review, 2026-11-17 ([`reviews/032b-eslint-spec-2026-11-17.md`](../reviews/032b-eslint-spec-2026-11-17.md)), said "not yet fit to build", with 2 Medium and 8 Low findings. It re-ran the versions, the install, the 43 findings, the fixes and decision 5, and each held. Each finding is answered below. Where the coordinator relayed the design lead's ruling, it is named. Every change to the config and the planted tests was re-run in the writer's scratch clone (EXECUTED: the fixed tree lints with 0 findings at `--max-warnings=0`; Prettier passes; the prototype test gives 35 passing, and each guarded mutation fails it).

1. **Medium, the item bar compared levels, not options.** `ignoreRestSiblings` and `caughtErrorsIgnorePattern` are gone from decision 4 and the config; the tree stays at 0 findings without them. `destructuredArrayIgnorePattern` stays, since shadcn-svelte's `varsIgnorePattern` already allows `_` elements. Decision 7 and the item-bar test now compare options as well as levels, with `no-unused-vars` checked by field, and the exception list is taken over the union of the three files, each file's a subset. Two planted cases prove the change in item code. Criterion 5 also fails first against `ignoreRestSiblings`.
2. **Medium, three planted cases could not pass.** Every planted function is exported, the fixture's parameter is `_info`, and each case asserts its full list of rule ids ("Design", `eslint.test.ts`). Re-run: each gives exactly the one finding it claims. One more was found and fixed in the re-run: the `$inspect` case needs a path of its own, since the Svelte parser answers a reused path from an earlier case.
3. **Low, the thumbnails' reason.** Decision 14 now gives the real cause: `scripts/site/thumbnails.ts` and `theme-script.svelte` stale all 82 pairs, and `package.json` stales 65 (re-checked, EXECUTED). The full recapture stands. *The memo* §7 says the same. The review's note on `package.json` reaching the hash through `site.ts` is left for a lane S small change.
4. **Low, the `eslint-enable` without a reason.** Row 39's `eslint-enable` now carries one (the design lead's ruling: give it a reason, rather than exempt enables). Decision 8 and the test require a reason on every directive comment. Re-run: dropping that reason fails the test.
5. **Low, ignore probes that pass regardless.** Every ignore probe is a `.ts` file, and `src/x.ts` is checked to be linted (decision 6, the test). Re-run: dropping `.claude/` fails it.
6. **Low, the changelog bullet.** `settings`, not `settings-form`, in decision 14's list, which the cost step uses. The eight items are the bullet's head, so `updatedIn` marks each as updated in 0.14.0. Decision 16 notes that `registry.test.ts`'s 0.13.0 check counts only bullets that begin with an item's name, so the bullet does not break it.
7. **Low, the lanes.** The design lead's ruling: lane E holds the lint config, CI and `package.json`; `theme-script.svelte`'s one comment rides along in the fix commit, which touches lanes I, S and T. `tests/unit/` and `bun.lock` are in no lane; this build holds them alone, as the one build that touches them, and `bun.lock` lands like a ledger file (the Lanes line, decision 15).
8. **Low, `no-empty-pattern`'s reach.** The design lead's ruling: `tests/e2e/` and `tests/sr/`. One addition, for the re-check to confirm: `tests/ledger.ts`, the fault ledger's Playwright fixture, which sits at `tests/`'s top and holds one of the four findings (`ledger.ts:183`, `{}: object`). Without it, that finding stays (EXECUTED). The review's own fix, ignoring `tests/unit/` and `tests/smoke/`, would also have covered it (decision 4). A planted case in `tests/unit/` gives `no-empty-pattern`. Re-run: widening the exception to `tests/**` fails it.
9. **Low, the base path nothing checked.** A unit test fails if `vite.config.ts`'s `paths` sets a `base` or a `svelte.config` appears, and says to turn the rule back on outside items (decision 4, criterion 14). Re-run: adding `base: "/kuiper"` fails it.
10. **Low, the landing gate.** Decision 11 now says the gate for lint is CI's `checks` job and `bun run lint`, not `release-check --before-ci`, which runs no lint. Build order step 9 and criterion 7 run `bun run lint` before landing. *The memo* §6.2 says the same.

## Landing notes

Empty until it lands.
