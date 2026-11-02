# Review of 008 — Product identity (the built change)

Reviews [`specifications/008-product-identity.md`](../specifications/008-product-identity.md).

- **Date:** 2026-11-01
- **Status:** dispositioned; every finding fixed
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the uncommitted working tree over `bfbd6b6` (tag `v0.7.1`): 38 tracked files changed (`git diff --shortstat`: 689 insertions, 154 deletions) and the untracked `008` paths (the products memo, the specification and its review, the two shell views `lockup/` and `endorsed/`, `tests/e2e/identity.spec.ts`, `static/v0.8.0/`). The three palette memos of 2026-11-01 are outside this review. Read against the specification as dispositioned, its review, the products memo and `decisions.md`, "One system, many products".
- **Re-ran:** under Bun 1.3.14, in the checkout. Probes in the session scratchpad, none in the repository. `git status --porcelain` (this file aside) hashed the same before and after every run below: the builds rewrote nothing.
  - `bun run check` → exit 0: `COMPLETED 1666 FILES 0 ERRORS 0 WARNINGS`.
  - `bun run lint` → exit 0, "All matched files use Prettier code style!". `bun scripts/lint-literals.ts` → exit 0, "0 literal(s) in registry item files". `lintFiles` over the 11 changed or new `.svelte` files → 0 violations.
  - `bun run test:unit` → exit 0: **640 pass, 0 fail**, 3,854 `expect()` calls, 10 files.
  - `bunx --bun playwright test` (it builds, then serves on 4173) → exit 0: **1,340 passed** (2.6 m), both projects; `identity.spec.ts` 10 × 2. The build wrote **94** prerendered pages.
  - `bun run test:smoke` → exit 0: **96 pass, 0 fail**, 5,025 `expect()` calls, 6 files, 101.9 s. `blocks-add` 6b, 9, 9b and 10 among them, in both scratch apps; `registry-add` 7 and `code-add` 8, the two second-add `app.css` comparisons.
  - Probe: the layout's comment snippet, `{#snippet logo(place)}<Logo class="h-8 w-auto" />{/snippet}` with `const LOGO = logo;`, in a scratch strict-TS project under the repository's `svelte-check` → **1 error**, "Parameter 'place' implicitly has an 'any' type". With `place: "header" | "footer"` → 0 errors (finding 2).
  - `md5` of `static/v0.7.1/r/styles/maia/{pluto-theme,app-shell,hero,index}.json` against `git show v0.7.1:static/r/…` and `git show HEAD:static/v0.7.1/…`: the tag and `HEAD` agree; the working tree differs on all four. `static/v0.4.0` to `v0.7.0` are unchanged (finding 1).

## Acceptance criteria against evidence

1. **Wordmark header** — met. EXECUTED (`identity.spec.ts` 1, both themes): one link to `/` in the banner, text "Sandbox", no `aria-label`, accessible name "Sandbox", `IBM Plex Sans` at 700, at least 48 × 24 px; 0 lockups and 0 marks in the banner.
2. **No entrance by default** — met. EXECUTED (`four-dot.spec.ts`, "the shipped shell runs 0 pluto-mark-dock animations").
3. **Wordmark footer** — met. EXECUTED (`identity.spec.ts` 3; `blocks.spec.ts` A3, A4): one `[data-shell="wordmark"]` reading "Sandbox", a `SPAN`, 0 links, 0 endorsements, no "Work runs on data.".
4. **Logo header and footer** — met. EXECUTED (`identity.spec.ts` 4): the home link's `aria-label` is "Pluto Systems" and it holds one lockup; the footer's `[data-shell="logo"]` has `role="img"`, the accessible name "Pluto Systems", one lockup and 0 `.mark-entrance`.
5. **The entrance, once** — met. EXECUTED (`four-dot.spec.ts` on `/view/app-shell/lockup/`): 4 `pluto-mark-dock` animations in the document, 495 ms, 135 to 405 ms, ending at 900 ms, the header's dots composed; under reduce, none, opacity 1 at load. "All in the banner" is not asserted by the test; it follows from the count of 4 and criterion 4's 0 `.mark-entrance` in the footer (INFERRED; finding 4).
6. **The endorsement at rest** — met. EXECUTED (`identity.spec.ts` 6): one line, "A Pluto Systems product", one mark with `aria-hidden="true"`, 4 dots at opacity 0.
7. **The reveal** — met. EXECUTED (`identity.spec.ts` 7 and 8): `0.11s` × 4, delays `0.03s`, `0.05s`, `0.07s`, `0.09s`; settled at `["1", "none"]` × 4; the line's width equal before and after.
8. **The leave** — met. EXECUTED (same test): after settling and a move to (0, 0), `["0.11s", "0s"]` × 4, then opacity 0 × 4.
9. **Reduced motion** — met. EXECUTED (`identity.spec.ts` 9): every delay `0s`, every duration at most `1e-05` s, then opacity 1 × 4.
10. **Touch** — met. EXECUTED (`identity.spec.ts` 10, `hasTouch` and `isMobile`): after a tap, opacity 0 × 4. The test can fail: the specification review saw a tap set `:hover` and show 4 of 4 dots without the media query (EXECUTED there).
11. **A long name** — met. EXECUTED (`identity.spec.ts` 11, 320 px): the row 64 px, no horizontal scroll, the link's text "Sandbox Analytics Workbench". The link's name comes from its content, so the whole text is the whole name (INFERRED).
12. **The preview site's footer** — met. EXECUTED (`identity.spec.ts` 12): one logo holding a lockup, the line once, one link, the design system's source.
13. **Accessibility** — met. EXECUTED: `axe.spec.ts` reaches both views through `BLOCK_VIEWS`, 0 violations in both projects; `VIEW_STOPS` walks both views, 8 stops each, none on the endorsement; 30 views hold 168 stops.
14. **The hero** — met. EXECUTED (`identity.spec.ts` 14): the `h1`, no "Pluto Systems", no "design system".
15. **No brand copy in the shipped shell** — met. EXECUTED (`blocks.test.ts`, 12 files: the 9 of `app-shell` and the 3 of `hero`, as `registry.json` lists them). The two exceptions are allowed in all 12 files, not only the footer and the layout (finding 5). READ: the built `app-shell.json` and `hero.json` under `static/v0.8.0/` name Pluto Systems only in `author`, the endorsement and the `docId` scheme.
16. **The utility** — met. EXECUTED (`generated.test.ts`, "008's mark-reveal"): the rest rule, 4 offsets equal to `mark-entrance`'s, the 5 hover rules by key in a top-level `@media (hover: hover)`, the durations and delays as written; the reduce block's 3 selectors unchanged ("006's additions"). It reads `registry.json`'s `css`, which `build-tokens` writes and the CLI copies; `static/r` and `static/v0.8.0` are identical (`diff -r`).
17. **Install** — met. EXECUTED (`blocks-add.test.ts`, both apps): the app builds; 6b finds `data-shell="wordmark"` reading "Sandbox", no source row and no brand line; 9b finds `@utility mark-reveal` once with 4 offsets and one top-level `@media (hover: hover)` holding the 5 rules; 9 keeps the reduce block at 3 selectors. The second add's byte-identical `app.css` is proven by `registry-add` 7 and `code-add` 8, not by `blocks-add` 10, which compares the block files only (finding 6).
18. **The gate** — met. EXECUTED: check, lint, unit (640), browser (1,340), smoke (96) and build (94 pages) all exit 0; the literal lint finds 0 violations in the 11 changed or new `.svelte` files.
19. **Released** — not yet, as expected: the 0.8.0 entry is in `CHANGELOG.md` (`registry.test.ts` checks its eight strings), `package.json` reads `0.8.0`, `static/v0.8.0/` is built; this review's findings and the tag remain, and the specification has no Landing notes yet.

## Findings, most severe first

1. **High — The released `v0.7.1` snapshot is overwritten with a draft of `0.8.0`** (`static/v0.7.1/r/styles/maia/`: `app-shell.json`, `hero.json`, `index.json`, `pluto-theme.json`).
   `build-registry` writes `static/v<version>/`, and a build ran while `package.json` still read `0.7.1`. The four files no longer match the tag: `md5` of each differs from `git show v0.7.1:static/r/styles/maia/<file>`, which `HEAD` still matches. They hold `008`'s shell and hero, and a `pluto-theme` whose hover rules sit in an `@media (hover: hover)` nested inside `@utility mark-reveal`. Decision 5 records that shape as the one the CLI flattens: the first install loses the media query, and a second is not byte-identical. `static/v0.4.0` to `v0.7.0` are unchanged.
   Failure: committed as it stands, `main/static/v0.7.1/r` serves a "0.7.1" whose `app-shell` has a new required prop and a header without the lockup, and whose theme installs the broken hover rules. No changelog line says so (constitution §6). No test sees it: `registry.test.ts` builds into a temporary folder.
   Fix: `git checkout HEAD -- static/v0.7.1`. Add a unit test that every `static/v<x>/` whose `<x>` is not `package.json`'s version equals `git show v<x>:static/r/styles/maia/` file by file (or, more simply, that `git diff --quiet HEAD -- static/v<x>` holds for each).

2. **Low — The layout's snippet example fails `svelte-check`** (`src/lib/registry/blocks/app-shell/+layout.svelte:23`).
   The comment shows `{#snippet logo(place)}<Logo class="h-8 w-auto" />{/snippet}`. In a strict TypeScript app, which both scratch fixtures are, `place` is an implicit `any`.
   Failure: EXECUTED in a scratch project with the repository's `svelte-check`: 1 error, "Parameter 'place' implicitly has an 'any' type". Typed, 0 errors.
   Fix: the comment reads `{#snippet logo(place: "header" | "footer")}<Logo class="h-8 w-auto" />{/snippet}`. The item page's and the changelog's restore lines show only the snippet's body, so they need no change.

3. **Low — The logo's home link does not shrink, and decision 2 says it does** (`app-shell-header.svelte:81`).
   Decision 2 gives the link's box as `inline-flex min-h-12 min-w-6 shrink items-center`. The wordmark's link has it. The logo's link has `shrink-0`. A logo cannot truncate, so `shrink-0` is a fair call, but it is not recorded, and nothing bounds a logo's width.
   Failure: a 36 px tall logo wider than about 176 px, at 320 px beside the 32 px menu button and the 32 px toggle, widens the row past the viewport (INFERRED: a 272 px content box less 64 px of controls and two 16 px gaps; not tested, since the only logo view uses the lockup).
   Fix: record `shrink-0` and its reason in the Landing notes, and add one line to the item page's identity bullet: "and at most 176 px wide, so it fits beside the controls at 320 px; a wider logo passes a narrow form below `sm`". A logo view at 320 px with a 176 px logo would prove it.

4. **Low — Criterion 5's "all in the banner" is not asserted** (`tests/e2e/four-dot.spec.ts:161`).
   `ANIMATIONS` filters by name over the whole document. Four in the footer and none in the header would also count 4.
   Failure: none today; criterion 4's 0 `.mark-entrance` in the footer closes the gap indirectly.
   Fix: in the lockup-view test, add `expect(await page.evaluate(() => document.getAnimations().filter((a) => a.animationName === "pluto-mark-dock" && a.effect.target.closest("header")).length)).toBe(4)`, or map each animation's target to `closest("header") !== null`.

5. **Low — Criterion 15's exceptions are allowed everywhere** (`tests/unit/blocks.test.ts`, "008: no brand copy").
   The criterion allows the endorsement's words and the `docId` scheme "in `app-shell-footer.svelte` and the layout". The test strips both strings from all 12 files.
   Failure: "A Pluto Systems product" added to the header or the hero would pass.
   Fix: strip `ALLOWED` only when the file is `app-shell-footer.svelte` or `+layout.svelte`.

6. **Low — The blocks smoke test's "byte-identical" second add does not read `app.css`** (`tests/smoke/blocks-add.test.ts:452`).
   Test 10 compares the 30 block files. Decision 5's failure was in `app.css`. The proof that a second add leaves `app.css` byte-identical with the new top-level `@media (hover: hover)` lives in `registry-add.test.ts` 7 (an `add four-dot`, which pulls `pluto-theme`) and `code-add.test.ts` 8, not here.
   Failure: none while those two run; criterion 17, read as written, points at the wrong test.
   Fix: add `src/app.css` to test 10's `before` snapshot, or name the two tests in the Landing notes as criterion 17's evidence.

7. **Low — Stale words and unlisted count changes.**
   - `context/handoff.md`, State: "Eight specifications are built and reviewed" while the same paragraph says `008`'s change review is still to come. Fix: "Seven specifications are released (`v0.1.0` to `v0.7.1`); `008`, product identity, is built and in its change review, prepared as `v0.8.0`."
   - `tests/e2e/blocks.spec.ts:571`: "28 views (the shell's 4 and the chat's 6 among them) and 003's 7 item pages: 35." Fix: "30 views (the shell's 6 and the chat's 6 among them) and 003's 7 item pages: 37."
   - Decision 8's table says the toolbar's shell entry "11 becomes 13". The shell's entry is the sixth, 9, and the test correctly makes it 11 (`[5, 9, 9, 10, 9, 11, 11]`). Fix: say so in the Landing notes.
   - Counts changed beyond decision 8's table, each checked and justified: `blocks.spec.ts` 24 (35 → 37 pages), 26 (153 → 168 stops: the shipped shell's source link out, 8 + 8 in), C9 (70 → 85); `keyboard.spec.ts` (153 → 168 view stops); `viewer.spec.ts` (27 → 29 state switches); `generated.test.ts` (4 → 12 `:nth-child`, the reveal's 4 offsets and 4 delays); `literals.test.ts` (49 → 50 good samples). Decision 8 asks the builder to list such tests in the change review; this is that list.

## Constitution checks

- §4.1 source, not a package: kept. The logo is the app's own snippet; the endorsement is text and a mark; nothing reaches back.
- §4.2 driven by need: the need is every product's identity, stated in the specification and `decisions.md`; "done" is proven here.
- §4.3 tokens are the one source: kept. The utility reads `--mark-orbit`, `--motion-micro`, the entrance's shares and `--ease-entrance`; 0 literals in the item files and the 11 changed `.svelte` files (EXECUTED).
- §4.4 accessible by default: kept. axe 0 in both themes on both views; label in name holds for the wordmark (its text) and for a logo (named by `appName`, which the item page says must contain the logo's words); the truncated name keeps its accessible name; 168 stops at 24 × 24 or more; the endorsement takes no focus, its mark is `aria-hidden`, and it shows nothing on touch.
- §4.5 and §4.6: no new package; `bun.lock` unchanged.
- §6 never break an installed app silently: the footer's interface change and the header's visible change are named in `CHANGELOG.md` with the restore. The rewritten `v0.7.1` snapshot is not (finding 1). Nothing is committed.

## Verdict

Does not land yet: finding 1 (High) stands.

## Disposition

By the design lead, 2026-11-01. All seven fixed; the gate re-run after the fixes (EXECUTED): `bun run check` 1666 files, 0 errors; `bun run lint` clean; the literal lint 0; unit 646; browser `four-dot.spec.ts` and `identity.spec.ts` 56 of 56; smoke 96 of 96; `static/v0.7.1` matches its tag.

| # | Disposition |
| - | ----------- |
| 1 | **Fixed.** `static/v0.7.1` is restored from its tag. A new unit test, "released snapshots", checks that every tag's `static/<tag>/` matches the tag, tracked and untracked, so a build under a stale version fails the gate. |
| 2 | **Fixed.** The layout's comment types the snippet: `{#snippet logo(place: "header" | "footer")}`; decision 6 quotes it the same way. |
| 3 | **Fixed, by recording the call.** A logo does not shrink, since a drawing squeezed by flex is distorted or clipped; decision 2 now says so and bounds a logo at 176 px wide, which fits at 320 px. The header's prop doc, the layout's comment and the item page state the bound. |
| 4 | **Fixed.** The entrance test asserts that every `pluto-mark-dock` animation's target is inside the `header`. |
| 5 | **Fixed.** The brand-copy test allows each exception only in the file that owns it: the footer and the layout. |
| 6 | **Fixed.** The blocks smoke test's second add now compares `src/app.css` with the block files. |
| 7 | **Fixed.** The handoff counts seven released and the eighth built; the comment in `blocks.spec.ts` reads 30 views and 37; decision 8's table reads "the shell's entry 9 becomes 11". |
