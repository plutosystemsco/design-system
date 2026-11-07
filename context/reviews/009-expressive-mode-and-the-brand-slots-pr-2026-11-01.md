# Review of 009 — Expressive mode and the brand slots (the built change)

Reviews [`specifications/009-expressive-mode-and-the-brand-slots.md`](../specifications/009-expressive-mode-and-the-brand-slots.md).

- **Date:** 2026-11-01
- **Status:** in review
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the uncommitted working tree over `6fbdf99` (tag `v0.8.0`), limited to `009`'s paths: `package.json` (version), `tokens/pluto.tokens.json`, `scripts/{tokens,build-tokens,contrast,lint-literals}.ts`, `registry.json`, the generated `src/app.css`, `button.svelte`, the new `src/lib/registry/lib/read-token.ts`, the `pluto-theme` and `read-token` item pages, `CHANGELOG.md`, the unit and browser tests named in the brief, the regenerated `static/r/` and the new `static/v0.9.0/`. Read against the specification as dispositioned, its review, and `decisions.md`, "After the `009` build's checkpoint" and "The identity is commissioned, with options". The identity exhibit (`src/lib/identity/`, `src/routes/(identity)/`) and its six font packages are outside this review.
- **Concurrent work.** During this review, `010`'s build started in the same working tree. `package.json` has read `0.10.0` since 22:12. `tests/e2e/{pages,keyboard,blocks}.spec.ts`, `tests/unit/{registry,literals,blocks}.test.ts` and `src/lib/preview/blocks.ts` changed from 22:21. Every run below except the full browser suite finished before 22:21, on `009`'s state of the tests. The `009` source files (`scripts/`, `tokens/`, `src/app.css`, `registry.json`, `read-token.ts`, the two pages) did not change during the review. One side effect: the browser run at 22:18 built the registry while `package.json` read `0.10.0`, so `static/v0.10.0/` now exists (equal to `static/r/`). The `010` checkpoint ruling expects that folder.
- **Re-ran:** under Bun 1.3.14. Probes ran in the session scratchpad, none in the repository.
  - `bun test ./tests/unit` → exit 0: **797 pass, 0 fail**, 4,199 `expect()` calls, 11 files.
  - `bun scripts/lint-literals.ts` → exit 0, "0 literal(s) in registry item files".
  - `bun run check` → exit 0: `COMPLETED 1725 FILES 0 ERRORS 0 WARNINGS`. `bun run lint` → exit 0.
  - `bunx --bun playwright test tests/e2e/expressive.spec.ts` (builds, serves on 4173) → exit 0: **160 passed**, both projects.
  - `bunx --bun playwright test tests/e2e/axe.spec.ts -g "pluto-theme|read-token"` → exit 0: **12 passed**.
  - `bun test ./tests/smoke/registry-add.test.ts` → exit 0: **20 pass**. These are tests 4, 7 and 8 in both apps: the 47 new `:root` variables arrive, a second add leaves `app.css` byte-identical, and the reduce block keeps its three children.
  - The full browser suite (22:23) did not load. `viewer.spec.ts:238` threw on `APP_PATHS[block]`, from `010`'s half-edited `pages.ts`. No full-suite count exists for `009`; see "Concurrent work".
  - `diff -r static/r static/v0.9.0/r` → identical. `static/v0.4.0` to `v0.8.0` are untouched (`git status`).
  - Probe: `topLevelMap` over `git show 6fbdf99:src/app.css`. The custom properties come to 89, 74 and 110, equal to `tests/unit/fixtures/v0.8.0-custom-properties.json`, block by block.
  - Probe: `stageTable` from the token file, 21 rows, all pass. I also checked one figure by hand: `stage-muted` on the veil over white is `#9AA0AD` on `#2A2B2D`, 5.40.
  - Probe: Tailwind 4.3.3's `compile` (from `@tailwindcss/node`) on `rounded-action` beside other radius classes, with and without the theme's `@utility rounded-action` (findings 1 and 2). `cn` on the same pairs.
  - Probe: a scratch copy of the `kit3` smoke fixture, then `shadcn-svelte add button -y -o` against the dev server on 5287, then `vite build`. Built twice: as installed, and with the `@utility rounded-action` block removed from `app.css` (finding 1).
  - Probe: `lintText` on 12 L22 inputs (finding 3). `tween` and `readDuration` with stub `requestAnimationFrame` and `getComputedStyle` (finding 4).

## Acceptance criteria against evidence

1. **The group validates; the 47 variables are in `:root` only** — met. EXECUTED (`generated.test.ts`, "009's variables": 47 names in `css[":root"]` and in `src/app.css`'s `:root`; none in `cssVars` or in `.dark` or `@theme inline`; each value as the tables give it. `tokens.test.ts`, "the expressive group": it validates and rejects five malformed variants).
2. **`v0.8.0`'s custom properties keep their values** — met. EXECUTED: the fixture matches the tag (my probe). `generated.test.ts` compares all 273 entries.
3. **Productive faces and button radius unchanged** — met, in the preview. EXECUTED (`expressive.spec.ts`, 64 item pages × 2 themes). The test skips any button that carries its own `rounded-*` (finding 6). An installed app whose stylesheet is not updated gets square buttons (finding 1).
4. **Every contrast row in `contrast.ts`, passing** — met. EXECUTED: 21 rows (13 from decision 3, 2 energized, 6 composites), all pass. Four figures differ from the specification's text (finding 8).
5. **L22 fails each token and the attribute; the registry lints at 0 with 0 exceptions** — met as written. EXECUTED (`literals.test.ts`: 10 samples fail under `["productive"]` and under both modes, and pass under `["expressive"]`; the lint finds 0; L22 has no allowlist). The rule can be got around in four ordinary ways (finding 3).
6. **Every item declares `meta.modes`** — met. EXECUTED (`registry.test.ts`): 10 mode-agnostic items plus `button` declare both modes, 53 declare productive, none is expressive-only.
7. **`rounded-action` 8 / 9999 / 8 px** — met. EXECUTED (`expressive.spec.ts`, criterion 7, both on planted probes and on the page's three figures).
8. **Inside `surface-stage`** — met. EXECUTED: ground `rgb(5, 6, 8)`, muted `rgb(154, 160, 173)`, wash `rgb(21, 23, 27)`, button `rgb(20, 22, 28)` on `rgb(122, 155, 255)`.
9. **Reduced motion** — met. EXECUTED: seven durations at 0, `--press-scale` at `1`.
10. **Fluid display steps** — met. EXECUTED: 86.4 / 56 / 86.4 px at 1440 and 48 / 36 / 56 px at 390; weight 600; `tabular-nums` on `type-proof`.
11. **Bloom, energized, press** — met. EXECUTED: `::before` opacity goes from 0.6 to 1; the busy box-shadow is the ring plus the glow; the press transition is 160 ms on `transform`. Beyond the criterion, the test also checks the rim's 14 px and its line, and the veil's ground and blur.
12. **`read-token`** — met. EXECUTED in the browser: light blue on the page and lifted blue on the stage; the canvas repaints when the theme changes. EXECUTED in the unit test: `""` on the server. The "0 ms calls `onFrame` once" clause is proven only on a path that also has no `requestAnimationFrame` (finding 5).
13. **The display slot** — met. EXECUTED: setting `--font-face-display: serif` on a wrapper changes the line inside it.
14. **axe on both pages** — met. EXECUTED: 12 of 12. `pluto-theme` is checked at 1280 (plain, with the popover open, with the dialog open) and `read-token` at 360, 768 and 1280, each in both themes.
15. **The gate** — partly evidenced. EXECUTED: unit 797, check 0 errors, lint clean, literal lint 0, `expressive.spec.ts` 160, the axe subset 12, smoke `registry-add` 20. NOT RUN cleanly: the full browser suite and the other five smoke files, for the reason under "Concurrent work". The design lead re-runs both after `010`'s edits are set aside or settled.

## Findings, most severe first

1. **High — The radius fallback never reaches the app it was written for, and the changelog promises it does** (`src/lib/registry/ui/button/button.svelte:10`; `CHANGELOG.md`, 0.9.0, the `button` line; `scripts/build-tokens.ts`, `"@utility rounded-action"`).
   Decision 8 and the changelog say that "an app that re-installs `button` without updating its stylesheet keeps 8 px corners". The fallback `var(--radius-action, var(--radius))` lives inside `@utility rounded-action`, and that utility is defined by `pluto-theme`'s `css`, in the same stylesheet update. An app that keeps its 0.8.0 `app.css` has no rule for `rounded-action` at all. Tailwind emits nothing for an unknown class, so the button's corner is 0.
   Failure (EXECUTED): in a scratch `kit3` app after `add button`, the built CSS holds `.rounded-action{border-radius:var(--radius-action,var(--radius))}`. With the utility block removed from `app.css`, the same build holds no `rounded-action` rule, so every button is square. That is what a user gets by declining the CLI's stylesheet prompt, or by copying `button.svelte` over by hand ("an app owns what it installs"). The changelog says the opposite (constitution §6).
   Fix (recommended): put the fallback in the component, not the theme. `button`'s base class becomes `rounded-[var(--radius-action,var(--radius))]`. EXECUTED: Tailwind compiles it from the component alone, to `border-radius: var(--radius-action,var(--radius))`. The literal lint finds 0 violations in it. `cn` reads it as a radius, so it also closes finding 2. `@utility rounded-action` can stay in the theme for compositions. Decision 8 and the changelog then hold as written. Add a unit case that compiles `button`'s class list with Tailwind and no theme, and finds a `border-radius` rule. The alternative is to keep `rounded-action` and change the changelog to "`button` now needs `pluto-theme` 0.9.0: re-install it with the theme, or the button is square". Either way decision 8 needs a line from the design lead.

2. **Medium — An app's own arbitrary or variable radius on `button` now loses to `rounded-action`** (`button.svelte:10`; `CHANGELOG.md`, the `button` line).
   `cn` no longer merges an app's `rounded-*` with the base class, so both classes stay and CSS order decides. Spec review finding 18 said the app's class "still wins, because `.rounded-action` sorts first". That holds only for some classes.
   Failure (EXECUTED, Tailwind 4.3.3): `.rounded`, `.rounded-\(--x\)`, `.rounded-2xl` and `.rounded-\[4px\]` print before `.rounded-action`. `.rounded-full`, `-lg`, `-md`, `-none` and `-sm` print after it. `cn("rounded-action", "rounded-[4px]")` returns both. So `<Button class="rounded-[2px]">` or `class="rounded-(--chip-radius)"` turned 8 px with no warning. (`rounded-2xl` to `-4xl` also lose, but this theme maps them to `var(--radius)`, 8 px, so nothing visible changes.) The changelog says only "to be sure your own radius wins, override with `!rounded-none`", and does not say which classes lose. No registry item passes a radius to `button` today (READ: `grep` over `src/lib/registry`).
   Fix: finding 1's arbitrary class closes this, because `cn` then drops the base radius (EXECUTED: `cn("rounded-[var(--radius-action,var(--radius))]", "rounded-[4px]")` → `rounded-[4px]`). If `rounded-action` stays, the changelog says: "`rounded-none` and `rounded-full` still win; an arbitrary `rounded-[…]` or a variable `rounded-(…)` loses unless marked `!`". Add a unit case that pins the order.

3. **Medium — L22 can be got around in four ordinary ways** (`scripts/lint-literals.ts`, `EXPRESSIVE_ATTRIBUTE` and the token loop).
   The Risks section names L22 as the guard against expressive styles leaking into productive screens. EXECUTED with `lintText(…, ["productive"])`, each input below gives **0** violations:
   - `class={{ bloom: lit, rim: true, veil: open, energized: busy }}`. This is Svelte 5's object class form. The tokeniser yields `bloom:`, which `splitClass` reads as a variant with an empty utility. Four of the nine names are single words, so they need no quotes and slip through.
   - `data-mode=expressive` (an unquoted attribute; it turns every productive button below it into a pill).
   - `{...{ "data-mode": "expressive" }}`, `el.setAttribute("data-mode", "expressive")` and `el.dataset.mode = "expressive"`.
   Caught as expected: `class:bloom={x}`, `cn('type-display', x)`, `[&>p]:type-display`, `group-hover:rim`, `@apply bloom`.
   Fix: before the `EXPRESSIVE_CLASSES` lookup, strip one trailing `:` from the token, so object keys are read. Widen the attribute rule to `/data-mode\s*=\s*\{?\s*["'`]?expressive\b/`. Also flag any quoted string literal `"expressive"`, `'expressive'` or `` `expressive` `` in a file whose profile is not expressive-only. That one rule catches the spread, `setAttribute` and `dataset` forms. No current item file holds that string (the lint is at 0). Add each input above as a unit case.

4. **Low — `tween` cannot be cancelled from inside `onFrame`, and a malformed duration gives `NaN`** (`src/lib/registry/lib/read-token.ts`, `tween` and `readDuration`).
   `step` calls `onFrame`, then schedules the next frame. A cancel that runs inside `onFrame` clears the old frame id, and `step` then requests a new one. `readDuration` accepts `[\d.]+`, so `"..ms"` parses to `NaN`.
   Failure (EXECUTED with stubs): with `cancel()` called from `onFrame` at frame 2, the tween ran on through frame 10, where the probe stopped. `--motion-odd: ..ms` → `readDuration` returns `NaN` → `tween` calls `onFrame(NaN)` once. Separately, the `read-token` page's count-up never cancels on unmount.
   Fix: in `tween`, keep `let cancelled = false`; set it in the returned function, and skip the next `requestAnimationFrame` when it is set. In `readDuration`, return 0 unless `Number.isFinite(value)`. On the page, add `onMount(() => () => cancel?.())`. Add a unit case for each.

5. **Low — Two `read-token` unit tests cannot fail for the reason they name** (`tests/unit/read-token.test.ts`).
   "tween with a 0ms duration…" runs where both `document` and `requestAnimationFrame` are undefined. `tween` jumps to the end when either is missing, so breaking the `duration <= 0` check still passes. In the cancel test, the stub `cancelAnimationFrame` empties the whole queue whatever id it gets, so a cancel with the wrong id also passes.
   Fix: add a case with a stub document holding `--motion-fill: 0ms` and a `requestAnimationFrame` that throws; expect `frames` to equal `[to]`. Make the stub `cancelAnimationFrame(id)` delete only that id.

6. **Low — Criterion 3 skips exactly the buttons finding 2 is about** (`tests/e2e/expressive.spec.ts`, `productiveFaces`).
   The filter drops every `group/button` element that carries a `rounded-*` other than `rounded-action`. Today nothing is dropped (READ), but a preview that passed `rounded-[…]` to `Button` would hide a changed radius.
   Fix: measure those buttons too, each against the radius its own class gives, or fail when the filter drops anything.

7. **Low — Three effects of the plain rules are not written down** (`scripts/build-tokens.ts`, `.surface-stage` and `.veil`; the `pluto-theme` page).
   - `class="surface-stage"` without `dark` keeps the light fills' foregrounds. A default button is then white on lifted blue, about 2.6:1 (INFERRED from `raised` on `#7A9BFF`). The specification says `class="dark surface-stage"`, but nothing checks that the two appear together. Every item is held to L22 today, so no item can hit this yet; `010`'s can.
   - `.surface-stage` and `.veil` are unlayered, so a utility for `background-color`, `color` or `backdrop-filter` on the same element loses to them. For example, `class="dark surface-stage bg-card"` keeps the stage ground. This follows `surface-ink`'s precedent, but no document says so.
   - `.veil` is a global class name. An app with its own `.veil` gets the theme's ground and blur when it updates the theme.
   Fix: add a lint rule, in every profile, that a class string holding `surface-stage` also holds `dark`. Add a line on the `pluto-theme` page under "The stage": "set the stage's ground through `--background`, not a `bg-*` class on the same element". Name the `.veil` class in the changelog's `pluto-theme` line.

8. **Low — The deviations and the corrected figures are not yet recorded** (specification, Landing notes; decision 4's figures).
   The builder's deviations are each sound on reading and in the tests:
   - one `.surface-stage` rule, not two (the stage is the same in both themes, and `dark` sits on the same element);
   - `:root` holds `--radius-action` and `[data-mode="productive"]` gets its own rule (the same cascade, and `:root`'s value has to be in `css[":root"]` for the CLI to merge it);
   - `--press-scale: 1` sits in the existing `html:root` block, which keeps smoke test 8's three children;
   - `expressive.display.family: "heading"`;
   - `contrast.stage` is `{ pairs, composites }`, with `overTheme` validated;
   - criterion 3 measures every `buttonVariants` element, not one button;
   - `read-token` accepts `s` units, warns in development, falls back to linear, and jumps to the end when there is no `requestAnimationFrame`;
   - an installed app's files take the productive profile.
   The figures that `contrast.ts` computes differ from decision 4's text. `energized-line` measures 4.19 on the stage and **4.11** on the raised card, where the text says 4.15 and 3.90. On the veil over white, `stage-muted` is 5.40, `stage-primary` 5.37 and paper 13.20, where the text says 5.38, 5.35 and 13.16. The 5.40 checks by hand. All still pass. The "over white" rows are the light theme's `card`, which is `raised`, `#FFFFFF`.
   Fix: the Landing notes list each deviation with its reason and cite `contrast.ts`'s figures in place of the specification's text.

9. **Low — A doc comment was cut away from its type** (`scripts/tokens.ts:43`).
   `/** An elevated surface's edge against a ground under the scrim (002 decision 7). */` now sits above `StagePair`'s comment, so `ScrimRow` has no doc and `StagePair` has two.
   Fix: move that line back to just above `export type ScrimRow`.

## Constitution checks

- §4.1 source, not a package: kept. `read-token` is copied source that reads the page's own variables; the slots are runtime variables on the app's `:root`.
- §4.2 driven by need: the need is the owner's commission and the product-site memo; "done" is proven here.
- §4.3 tokens are the one source: kept. Every colour, duration, size and the 9999 px pill comes from `expressive` (EXECUTED: values from `tokens/pluto.tokens.json` in `generated.test.ts`). The geometry inside the light utilities is written by decision 4, not by a token: `inset: -25%`, the 40 px and 60 px glow spreads, and the 0.6 rest opacity. That is the "one sanctioned shape" the decision chose, and it is outside the item-file lint.
- §4.4 accessible by default: 21 stage rows pass, the lowest text pair at 4.79. axe finds 0 on both pages in both themes. The new controls are native buttons, and the toggles carry `aria-pressed`. The global `:focus-visible` ring reads `--ring`, which is the stage primary on a stage (7.68). Under reduced motion every new duration reads 0 and the press does not scale. The bar text under the veil demos is obscured on purpose and stays readable by a screen reader, which is harmless.
- §4.5 and §4.6: `009` adds no package. The six exhibit fonts are pinned exactly, and `deps.test.ts` names them.
- §6 never break an installed app silently: findings 1 and 2. The changelog is otherwise complete: 47 variables, the mode, the stage, the veil, the utilities, the `cn` note, `read-token`, `meta.modes` and L22.

## Verdict

Does not land yet: finding 1 (High) stands, with findings 2 and 3 (Medium), and the full browser and smoke suites are still to be re-run on `009`'s state.

## Disposition

_Filled in after the author answers._
