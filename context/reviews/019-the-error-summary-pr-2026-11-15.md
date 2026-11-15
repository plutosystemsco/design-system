# Review of 019 — The error summary: the alert inside, the label in view (the built change)

Reviews [`specifications/019-the-error-summary-alert-inside-and-the-label-in-view.md`](../specifications/019-the-error-summary-alert-inside-and-the-label-in-view.md). This reviewer wrote neither the specification nor the code, and did not review the specification ([`019-the-error-summary-spec-2026-11-15.md`](./019-the-error-summary-spec-2026-11-15.md) is another reviewer's).

- **Date:** 2026-11-15
- **Status:** in review; lands, with one Medium to settle before the commit and six Low write-ins.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the working tree on `ea1f9bd` (`018`), uncommitted.
  - The tracked diff: 33 files, +541 −169.
    - **Three registry items:** `error-summary.svelte`; `app-shell-header.svelte` and the shell layout's comment; and `scripts/build-tokens.ts`, with what it writes (`src/app.css`, `registry.json`'s `pluto-theme`). Their `static/r` and `static/v0.12.0/r` JSON are regenerated.
    - **Site files:** the example, the two component pages, `site.css` and the token page.
    - **Thumbnails:** the manifest and four images.
    - **Docs and deps:** `CHANGELOG.md`, `decisions.md`, `package.json` and `bun.lock` (guidepup).
    - **Tests:** seven changed test and fixture files.
  - The untracked files: `tests/e2e/error-summary.spec.ts`, `scripts/a11y/voiceover-error-summary.ts`, and the specification and its review.
  - Not 019's: the research memos and `scripts/bench/` that other agents wrote into the tree while this review ran.
- **Re-ran:** Bun 1.4.4, 2026-11-15. Nothing in the repository was written but this file. Scratch work is in `…/scratchpad/review-019/`. Playwright's `webServer` used its configured 4173; the owner's 5199 was not touched.
  - **The machine was heavily loaded throughout.** `uptime` read load averages of 35.9, 53.8 and 54.3, from other agents' work. This matters for every timing below.
  - `bun test tests/unit` → **1,206 pass, 0 fail**, 11,455 `expect()` calls, 35 files.
  - `bun run check` → `COMPLETED 2156 FILES 0 ERRORS 0 WARNINGS`. `bun run lint` → clean. Literal lint → 0, 1 allowance.
  - `bun run test:e2e`, full, → 2,727 passed, 11 skipped, **6 failed**, 5 did not run, in 22.5 m (under that load).
    - **The failures:** five of `015`'s disc-size checks (`doors.spec.ts:116`, at 390, 768 and 1023), measured mid-entrance (finding 5), and one axe scan of `/components/pluto-theme/` that timed out at 47 s.
    - None of them is in 019's files. The `perf` project did not run because those failed.
    - **Re-run** (`--project light --project dark --project perf --no-deps`, the six failures and the five budgets): **27 passed, 0 failed**.
    - `error-summary.spec.ts` ran 38 tests (19 per project), all passing.
  - `bun run test:smoke` → exit 0, 132 pass, 0 fail.
  - **Idempotence:** the SHA-1 of every file under `static/r`, `static/v0.12.0` and `static/v0.11.0` was the same before and after the build and smoke. `bun run build:tokens` run again changed no tracked file.
  - Neither `scripts/a11y/voiceover-error-summary.ts` nor guidepup's setup was run, as decision 12 requires.

## Acceptance criteria against evidence

1. **The roles** — met. EXECUTED: `error-summary.spec.ts` 1, both projects. READ:
   - `Alert` takes `role={null}`. The new `div[data-slot="error-summary-content"]` carries `role={announce ? "alert" : null}`, and holds the heading and the body.
   - The icon is outside it, `aria-hidden`.
   - `restProps` still spreads last, so a passed `role` lands on the root, as decision 1 says. The page says not to pass one.
2. **A field already in view** — met. READ: `focusField` follows decision 4's seven steps in order:
   - no target, or no control: return, and let the fragment work;
   - `preventDefault`;
   - question and control both clear: `focus({ preventScroll })` and stop;
   - otherwise `question.scrollIntoView({ block: "start", behavior: "instant" })`, then `focus({ preventScroll })`;
   - then centre the control if it is still not clear.
3. **From under the bar** — met (EXECUTED).
4. **The radio link** — met. READ: `controlOf` takes the group's `[tabindex="0"]` descendant, whatever the group's own `tabindex`. The test saw "Only me" focused; the builder recorded it failing on the old code.
5. **An undeclared bar** — met. The builder recorded this guard failing 12 of 12 against the first draft's order (R4). I did not re-run that scratch change.
6. **Smooth scrolling** — met.
7. **The app shell, and the default** — met. EXECUTED: the four injected app values win (64, 64, 64 and 96 px).
8. **The blocks** — met (`blocks.spec.ts`, 102 tests).
9. **axe** — met.
10. **The keyboard** — met. `STOP_COUNT` is 73 → 74, and the example's stops are input, input, `radio:Only me`, button.
11. **No hash** — met.
12. **The look** — met. It pins 98.78, 107.59 and 109.19 px, and the offsets, ± 0.5 px.
13. **The site's padding** — met. READ: `site.css` `html:has([data-slot="site-bar"]) { scroll-padding-top: var(--site-bar-room) }` inside `@layer components`. The token rows lose `scroll-mt-(--site-bar-room)`.
14. **The changelog** — met. The three lines are read under "The points asked".
14a. **The emission** — met. READ: `registry.json`'s `pluto-theme.css` loses the top-level `html:has([data-sticky-bar])` and gains `:where(html:has([data-sticky-bar]))` inside `"@layer base"`. `src/app.css` agrees. `build:tokens` is idempotent (above).
15. **The registry** — met.
    - `registry.json` changes only in that rule.
    - `static/r` equals `static/v0.12.0/r` (`diff -rq`).
    - `static/v0.11.0` has 0 differences from its tag and 0 untracked files.
    - The amendments fixture gains 12 entries (6 for `error-summary`, 4 for `app-shell`, 2 for `pluto-theme`), and `registry-comments.test.ts` requires each to be used.
16. **The thumbnails** — met.
    - All 75 hashes moved (my comparison with `HEAD`'s manifest: 75 of 75).
    - Four images differ in bytes: `pluto-theme` and `sidebar`, light and dark. Pixel-diffed against `HEAD`, they differ in 8,500 to 11,900 pixels each, by at most 19 to 24 of 255 per channel, inside the content. That is text antialiasing, invisible at the tile's size.
    - The other 146 are byte-identical, as they should be: no item's look changed. The cause of the four is not explained (recorded below).
17. **The suites** — met on the re-run, apart from 015's timing flakes (findings 5 and 6).
18. **Tests first** — met as recorded: 3 unit and 34 e2e failures on `ea1f9bd`, and criterion 5's 12 against the first draft. Each of criteria 1 to 4, 6, 7, 10, 13 and 14a is a check that the old code fails.
19. **The screen-reader check** — not yet. That is by design, but see finding 1.

## The points asked

- **Do the changelog lines tell an installed app what to do?** Yes, with one gap (finding 3).
  - **`error-summary`:**
    - the role moved, to which element, and what that breaks: classes on the root's children, `getByRole("alert")` expected on the focused element;
    - not to pass `role`;
    - when a link moves the page;
    - to declare a sticky header;
    - that a radio group's id now works;
    - `add error-summary`, and which blocks install it.
  - **`app-shell`:** when it carries `data-sticky-bar`, the 72 px it now gets, that the old `4rem` line is no longer needed and wins once the old theme rule is gone, and `add app-shell`.
  - **`pluto-theme`:** the new `@layer base` / `:where()` default, that an app's own value now wins in any layer or as `scroll-pt-*`, and, explicitly, to delete the old unlayered `html:has([data-sticky-bar]) { scroll-padding-top: var(--size-bar); }`, because the CLI does not.
  - The entry's existing line ("Any `add` from `v0.12.0` updates `pluto-theme`") covers the order.
- **`static/r` and `static/v0.12.0` against `registry.json`; the fixture; `static/v0.11.0`:** as criterion 15.
- **Every criterion's test can fail:** yes for 019's own. The builder's tests-first record names each one, and the radio, roles, padding and emission checks read things the old code does not have. The flakes I hit are `015`'s and `013`'s tests, not 019's (findings 5 and 6).
- **The 019↔018 thumbnails:** as criterion 16. The hash behaved as my `018` review predicted: `src/app.css` stales all 75.
- **Keyboard stops, 73 → 74:** confirmed in `keyboard.spec.ts`, with the comment naming 019 decision 10.
- **Decision 12:** `@guidepup/guidepup` is exactly `0.40.0` in `package.json`, and `bun.lock` resolves `@guidepup/guidepup@0.40.0` with its integrity hash.
  - `scripts/a11y/voiceover-error-summary.ts` is written. It is named in no `package.json` script and no test.
  - It calls `voiceOver.start()`/`stop()` only, never guidepup's setup, so it changes no settings itself. Its header says the owner sets the two macOS settings and starts it.
  - Its pass rule matches decision 12: title spoken, each error spoken whole, the title not twice in a row, for the insertion and the second submit.
  - It was not run, by me or (as recorded) by the builder.
- **(1) The perf figures:** the landing notes give the budgets, not the measurements (finding 2). The real medians, 3 runs each, re-measured under the load above:

  | Page | Transfer | Budget | LCP | Budget | CLS |
  |---|---|---|---|---|---|
  | `/` | 307 kB | 355 | 884 ms | 1,027 | 0.005 |
  | `/components/` | 355 kB | 395 | 2,756 ms | 2,988 | 0 |
  | `/components/button/` | **380 kB** | 380 | 1,032 ms | 1,157 | 0 |
  | `/components/code-block/` | 354 kB | 360 | 1,104 ms | 1,186 | 0.003 |
  | `/brand/colour/` | 302 kB | 347 | 872 ms | 984 | 0.001 |

  0 `.wasm` on each. Transfer is the same as `018`'s to the kilobyte (Button 380, `/components/` 354 → 355). The LCPs are 40 to 60 ms slower than `018`'s run, which fits the load. Button is still at its budget exactly.
- **(2) The streaming p95 flake:** not 019's. It is the test's design, exposed by load and by test order.
  - 019 changes no file it imports. `git diff HEAD -- src/lib/registry/lib src/lib/registry/hooks` is empty.
  - EXECUTED, the whole file `highlight-session.test.ts`, 4 runs: p95 3.04, 3.90, **6.53** (fail) and 2.98 ms. Its own test run in isolation (`-t "streaming budget"`), 8 runs: 6.91 to 21.83 ms, every one failing. During the e2e run, 6 runs: 103 to 287 ms. In my 015 review, on a quieter machine, it read 2.55 ms.
  - So it times wall-clock milliseconds with no warm-up: the earlier tests in its file are its warm-up, which is why it fails alone. It takes the 48th of 50 samples, with a budget less than 1 ms above the warm figure.

  Fix (finding 6): warm the session with one untimed stream first. Then take the best of 3 timed streams' p95 against 4 ms, or keep the 4 ms bar for the median and let p95 run to 8 ms. Or move this and `013`'s E7 into the serial `perf` project, where nothing shares the CPU.

## Findings, most severe first

1. **Medium. The page says VoiceOver was heard, but no one has listened** (`src/routes/(site)/components/error-summary/+page.svelte`, the Accessibility list: "Heard with VoiceOver on macOS. NVDA and JAWS are not tested.").
   - Criterion 19 is open. The script is written and not run, and nothing is recorded in `decisions.md`.
   - Committed as it stands, the public page would make a claim the record does not support. On this item, the one claim is the reason for the change: the timing differs from GOV.UK's (decision 1), and decision 12 is the only evidence for what Pluto's summary sounds like.

   Fix: commit only after the owner's run or listen, recorded as decision 12 asks. Or word the line, until then, as "Not yet heard with a screen reader. NVDA and JAWS are not tested.", and restore "Heard with VoiceOver on macOS" with the record.
2. **Low. The landing notes give the budgets as the measured figures** (`019-…md`, Landing notes, "Suites"). "`/` 355 kB and LCP 1027 ms; `/components/` 395 kB and 2988 ms; …" are exactly `perf.spec.ts`'s budgets, not the logged medians. The real figures are in the table above.
   Fix: replace that line with the logged medians (`perf <path>: [...]` in the run's output).
3. **Low. The `error-summary` bullet's sticky-header advice misses the old rule** (`CHANGELOG.md`, the `error-summary` bullet: "If your page has a sticky header, set `scroll-padding-top` on `html` to its height, as a bar marked `data-sticky-bar` does").
   - For an updating app whose bar is marked `data-sticky-bar`, a value it sets is still overridden until the old unlayered rule is deleted. The `pluto-theme` and `app-shell` bullets say so; this one does not.
   - An app that updates `error-summary` alone, reading only its bullet, can follow the advice and see nothing change.

   Fix: add "(after deleting the old theme rule; see `pluto-theme`)", or point the sentence at the `pluto-theme` bullet.
4. **Low. Button is still at its budget with nothing to spare** (`tests/e2e/perf.spec.ts`; 380 of 380 kB, all three runs). This carries over from `018`'s review; 019 adds nothing to the page. Any change before the tag that adds a byte to every component page fails it.
   Fix: as in `018`'s finding 4: record the zero margin, or win 2 kB back before the tag.
5. **Low. `015`'s disc checks measure the discs mid-entrance** (`tests/e2e/doors.spec.ts:116–133`). `getBoundingClientRect` includes the entrance's spring transform. Under load, `open()` returned while the spring still overshot: 158.5 px against 156.5 at 390, and 166.2 against 160.5 at 768 and 1023, in both projects. Re-run idle, they pass. My `018` review saw the same overshoot (178 to 198 px at load, all 190.5 px at rest).
   Fix: read `offsetWidth` (layout size, untransformed), or wait for `document.getAnimations()` on the discs to finish before measuring.
6. **Low. `013`'s streaming budget is a wall-clock test with no warm-up** (`tests/unit/highlight-session.test.ts:294–327`). Evidence and fix are under "The points asked", (2). It is not 019-related. It is the second timing test, after `013`'s E6 in my `018` review, to stop a full `bun run test` on a loaded machine.
7. **Low. Four thumbnails changed bytes for no recorded reason** (`pluto-theme` and `sidebar`, both schemes). They are invisible changes, and the builder reproduced them twice. But nothing in 019 changes those two items' look.
   - The likely cause is the site's new 88 px scroll padding moving where the script's scroll leaves a sticky element (the sidebar's) inside the stage, or a sub-pixel offset. The hash does not say.
   - Under `018`'s staleness rule this is harmless: they were regenerated. It does show that a run can change pictures that no input "should" change.

   Fix: none needed for 019. One sentence in the landing notes naming the likely cause.

Recorded, not findings:
- `isClear` samples one point, and skips covers drawn with `pointer-events: none`. Both are named under Risks, as R3 asked.
- `controlOf` takes the first `[tabindex="0"]` descendant before any native input. For a target that wraps a focusable scroll region ahead of its input, the region would win. No item in this system has that shape, and the decision says the same.
- The script's header suggests serving on port 4173, the e2e suite's port. That is harmless for the owner's own run.

## Constitution checks

- **§4.1 and §6, never break an installed app silently:** met.
  - Two items are marked **interface change**, with what moved and what to do.
  - The theme's rule change joins its bullet, with the instruction to delete the old rule the CLI leaves.
  - Finding 3 is one sentence.
- **§4.3:** met. No literal enters an item. The literal lint passes.
- **§4.4, accessible by default:** met on what is checked.
  - The focused element no longer holds the live role.
  - A radio question's link now works.
  - A link never leaves its control under a bar, declared or not (criterion 5).
  - The screen-reader evidence is still to come (finding 1). NVDA and JAWS are recorded as untested.
- **§4.5 and §4.6:** met. One named dev package, MIT, exact, pinned by `bun.lock`, and in no item. `deps.test.ts` holds it in a `PACKAGES_019` block.

## Regressions looked for

- **`error-summary`'s users:** `sign-in`, `sign-up`, `settings` and their views pass `blocks.spec.ts`, axe and the keyboard walks. Their thumbnails are byte-identical, so the box looks the same.
- **`/view/product-home/` and the marketing bar:** still 72 px (criterion 13).
- **The site's anchors:** the token rows land below the bar (criterion 13). The rest of `015`'s, `017`'s and `018`'s suites pass, apart from the timing flakes above.
- **`static/v0.11.0`:** untouched.

## Verdict

Lands, once finding 1 is settled.

The item, the shell and the theme change are built exactly as decisions 1 to 8 specify, and every 019 check was seen failing on the old code. The changelog tells an installed app what to do, down to deleting the rule the CLI leaves behind. `static/r` matches `registry.json`, and the thumbnails were regenerated as the hash requires.

The one thing to settle before the commit is the page's claim to have been heard with VoiceOver: run the owner's check first, or word the line until then. Findings 2 to 7 are Low write-ins. Findings 5 and 6 are older tests' timing faults, and are worth fixing before the tag's final `bun run test`.

## Disposition

<to be filled in after the builder and the author answer>
