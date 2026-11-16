# Review of 020c and 022p — two test measures (the built changes)

Reviews two small changes: [`020c`](../specifications/020c-the-guides-measure-reads-line-fragments.md), the guide's column test, and [`022p`](../specifications/022p-the-keyboard-walk-waits-for-the-editors-focus.md), the keyboard walk's wait for the editor. Their research is [the fourth matrix run](../research/2026-11-16-the-fourth-matrix-run.md), §2. This reviewer wrote neither the specifications nor the code (constitution §5).

- **Date:** 2026-11-16
- **Status:** in review
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the uncommitted working tree of the worktree `lane-small`, on `c5cdd65`. Two files, +23 −10: `tests/e2e/upgrade.spec.ts` (020c) and `tests/e2e/keyboard.spec.ts` (022p). No file under `src/` changes. The two specifications are untracked.
- **Re-ran:** Linux, 4 cores, load average 1 to 5. Playwright 1.64.1, browsers from `/opt/pw-browsers` (Chromium 156 headless shell `156.0.8078.4`, full Chromium 156, WebKit). The worktree's `build/` as it stands; no rebuild, since no source was changed. One worker. Scratch copies of the two spec files, with absolute imports, ran from the scratchpad against a `vite preview` of the same build. "Before" means the file at `c5cdd65`.
  - `upgrade.spec.ts`, the real file, `chromium-light`, `chromium-dark`, `webkit-light` → **42 passed**, exit 0.
  - 020b's three width cases, before, same three projects → **2 failed, 7 passed**. Both failures are at 320, in `chromium-*`: `code "pluto:field-set…": 290 wide, past the column`, and the same for `pluto:field-label`.
  - The same cases before, with the page fix of finding 1 injected as CSS → **27 passed** (three repeats).
  - The same cases after, under two mutations (CSS injected after `goto`) → **6 failed** (M1) and **4 failed** (M2); see 020c claim 4.
  - Three probes of the guide's inline fragments: at 320 in the three browsers; with `box-decoration-break: slice`; and over widths 320 to 440, step 2, in the three browsers, with and without the page fix. Kept in the scratchpad, not here.
  - `keyboard.spec.ts`, code-editor and code-languages fixtures, `chromium-light` and `chromium-dark`: before, `--repeat-each=8` → **2 failed, 30 passed** (`outline-style` `none` where `solid`). After, `--repeat-each=16` → **64 passed**.
  - The same after, `webkit-light`, with the ring helper's own test, `--repeat-each=4` → **12 passed**.
  - The real `keyboard.spec.ts`, `-g "code-(editor|languages)|the ring helper"`, three projects → **9 passed**. In full, `chromium-light` → **149 passed**.
  - Two mutations of the editor's ring, injected into the page → **4 failed** each; see 022p claim 3.
  - `bun run check` → 0 errors, 0 warnings, 2,429 files. `bun --bun prettier --check` on the two test files and the two specifications → clean.
- **Not re-run:** Firefox (this container has no build), the other three projects, GitHub Actions. The specifications' own repeat counts (126 of 126 for 020c). No source mutation with a rebuild: the page fix and the 020c mutations were injected as CSS into the built page, which lays out the same as the class would.

## Acceptance criteria against evidence

A small change states its defect, fix and check, not counted criteria. Their claims are taken one at a time.

### 020c

1. **The unchanged test fails at 320 in `chromium-*`** — met. EXECUTED: 2 of 2 at 320 (one run each), with the specification's message. WebKit passes.
2. **Defect 1, the fonts: the test read the fallback font** — not shown. EXECUTED: by `goto`'s return all three faces are loaded (JetBrains Mono, Geist, IBM Plex Sans), and the unchanged test fails with the same 290 px it gives with the wait. The wait is harmless, and `doors.spec.ts` and `expressive.spec.ts` are its precedent. It fixes nothing here.
3. **Defect 2, the union box: "each fragment fits"** — not met. EXECUTED: in the shell the first fragment does not fit, [176, 306] in a [16, 304] column. INFERRED: a union box lies inside the column exactly when every fragment does. Reading fragments changes the message (130 px, not 290), never the verdict (finding 3).
4. **Defect 3, "the headless shell paints a line's last run 2 px past where it broke it"** — the numbers are met; the cause is not.
   - EXECUTED: the shell has `pluto:field-set` at [176, 306] and [16, 56]. Full Chromium has [172.44, 297.64] and [16, 54.81]. WebKit has [172.39, 297.59].
   - EXECUTED: with `box-decoration-break: slice`, the shell's fragment is [176, 301]. The 5 px past 301 is the inline code's cloned end padding and border (`px-1` and `border`, `src/app.css:840`). Line breaking does not count it. That is 020b's "Findings for later", in every engine.
   - EXECUTED: the shell's monospace advance is 10 px; full Chromium's and WebKit's is 9.6 px (`pluto-theme`: 120 against 115.61). So the shell lays out wider, and breaks elsewhere. It breaks and paints on the same advance.
   - EXECUTED: over widths 320 to 440, step 2, an inline fragment overhangs the column by more than 2 px at 25 widths in full Chromium (worst 4.73 px, at 338), 16 in WebKit (4.97 px, at 418) and 29 in the shell (5.00 px). The page never scrolls sideways at any of them. So readers see it too, at widths the test does not take (finding 1).
5. **The mutation still catches a real overflow** — met, with a caveat.
   - READ: the specification's mutation (`whitespace-nowrap`, three times as long) is a gross overflow. It does not probe the slack's edge.
   - EXECUTED, M1: `main dd code { white-space: nowrap; padding-right: 200px }` → 6 failed (390 and 320, three projects); 1440 passes, its column being wide enough.
   - EXECUTED, M2: one more pixel of the chip's padding, `padding-inline: 5px` → 4 failed (390 and 320, `chromium-*`). The slack has no margin: one pixel of theme or one edit of the text breaks the test again (finding 2).
   - INFERRED: the slack cannot hide a cut word or a sideways scroll. A clipping ancestor is still checked by `scrollWidth`, with 1 px, and `sideways` keeps no slack.
6. **`upgrade.spec.ts` passes after** — met. EXECUTED: 42 of 42 in three projects.
7. **The page does not change** — met. EXECUTED: `git status --short src` is empty. But the research's next step was a page fix ("inline code in the guide may break anywhere", memo §2). The specification departs from it and does not say why (finding 1).

### 022p

1. **The unchanged helper is flaky at the editor's textbox stop** — met. EXECUTED: 2 of 32, `outline-style` `none` where `solid`.
2. **CodeMirror sets the mark "on a later measure frame"** — the lag is met; the mechanism is not. READ, `@codemirror/view` 6.43.15, `dist/index.js`:
   - `observers.focus` (l. 5297) calls `updateForFocusChange` (l. 5285). It waits on `setTimeout(…, 10)`, then dispatches a focus transaction or calls `view.update([])`.
   - `update` calls `updateAttrs()` synchronously (l. 8087). `updateAttrs` writes `cm-focused` from `hasFocus` (l. 8335–8337). A measure is requested only after that (l. 8097).
   - `hasFocus` needs `document.hasFocus()` and `activeElement == contentDOM` (l. 8690–8697).
   - INFERRED: the mark follows a 10 ms timer after the focus event, or an earlier update from a selection change. A timer can land after two animation frames. So the wait is right, and its comment names the wrong clock (finding 4).
3. **An editor never marked focused still fails the ring** — met. EXECUTED, two mutations of the page, code-editor and code-languages, `chromium-*`:
   - The mark stripped as soon as it is set (a `MutationObserver`) → 4 failed, `none` where `solid`, after the 60 frames.
   - The mark set, and `.cm-editor.cm-focused { outline: none !important }` → 4 failed.
   - READ: the ring is drawn only by `&.cm-focused` (`src/lib/registry/ui/code-editor/code-editor-theme.ts:24`). The outline is read at once after the mark, so a transition on it would still be caught.
4. **After: 32 of 32** — met, and more. EXECUTED: 64 of 64 in `chromium-*`; 12 of 12 in `webkit-light`; 149 of 149 for the whole spec in `chromium-light`.
5. **The helper changes nothing else** — met. READ: the loop runs only for `.cm-editor`. `expectRingUnclipped` runs after it, so it reads the marked editor too.

### Both

- **Scorecard: no row moves** — met, INFERRED. Tests only; no item, page, token or rendered text changes. With finding 1's page fix, the guide's rendered text is still unchanged. A run-log row for each is due at landing.

## Findings, most severe first

1. **High. 020c names the wrong cause, and loosens the test over a page defect that a page fix removes** (`tests/e2e/upgrade.spec.ts:221–234`; the specification's defect 3).
   The overhang is the inline code's cloned end padding and border, which line breaking does not count. It is not a headless-shell paint quirk. It shows in full Chromium and WebKit too, up to 5 px, at many widths between 320 and 440 (020c claim 4). The test's comment and the specification record a false cause. The 2 px is the one overhang seen at 320 in the shell, not a property of any browser. This is the defect 020b's review logged for later.
   Failure: at 338 in Chrome or 418 in Safari, a code chip's border runs 4.7 to 5 px into the gutter. Had the test taken those widths, the new slack would fail there. At 320 it passes because the shell's overhang there happens to be 2 px.
   Fix (recommended): fix the page, not the test. In `src/routes/(site)/changelog/0.13.0/upgrade/+page.svelte:58`, the `inline` snippet's code becomes `<code class="inline-block max-w-full wrap-anywhere">`. That is 020b ruling 3's recipe for the same page's `<dt>` names, in existing utilities. A chip then moves whole to the next line, and only a chip longer than the line breaks, inside its own box. EXECUTED with the same CSS injected: the worst overhang of any element, 320 to 440, is 0.02 px in Chromium and 0 in the shell and WebKit. The test as it was at `c5cdd65` passes 27 of 27 in three projects. `wrap-anywhere` alone does nothing (EXECUTED: the shell's fragment stays at [176, 306]), since the line breaker believes the text fits. Then drop the slack (keep 1 px for every box), keep the font wait, and keep the fragment loop for its clearer message. Rewrite the specification's defect and fix to match, and say it follows the memo's next step. It stays a small change: one page, no interface, token or dependency.
   Other option, for the owner, if a chip's edge in the gutter is acceptable: keep the page, and make the slack the element's own inline-end padding and border, read from `getComputedStyle`, for a fragment that is not the element's last. Name the cause as the cloned decoration. This keeps a known defect, and it affects every page with inline code (`src/app.css:840`).
2. **Medium. The 2 px slack has no margin** (`tests/e2e/upgrade.spec.ts:227`).
   The claim "a real overflow is still caught" holds. But any change of one pixel, in the theme's chip or in where a guide sentence breaks, fails the test again in the same way.
   Failure: M2, one more pixel of `padding-inline` on inline code → 4 failed, at 390 and 320, `chromium-*` (EXECUTED). A copy edit to a rename's "What to do" can do the same.
   Fix: closed by finding 1's recommended fix. Under the other option, the slack read from the computed style is exact, and the check is proven by M2-style mutation of 1 px past it.
3. **Low. Defect 2 is not a defect** (the specification's defect 2 and its check 1).
   "Each fragment fits" is false in the shell. A union box is past the column only when one of its fragments is. So the fragment loop changes the message, not the verdict, as the specification's own check 1 shows ("after the font wait and the fragments alone, it still failed").
   Fix, the specification's defect 2: "It measures an inline element's union box. That box is past the column exactly when a fragment is, so the verdict stands, but the message names a 290 px box where the fault is one 130 px fragment. The test now names the fragment." And defect 1: "It does not wait for the fonts, as other specs do. In this run they had loaded by `goto`'s return; the wait makes that certain."
4. **Low. 022p's comment and specification name the wrong clock** (`tests/e2e/keyboard.spec.ts:62–64`; the specification's defect).
   CodeMirror sets `cm-focused` from a 10 ms timer after the focus event, not on a measure frame (022p claim 2). The 60-frame bound stands for about a second, which is ample.
   Fix, the comment:
   ```ts
   // CodeMirror marks the editor focused from a 10 ms timer after the focus
   // event (@codemirror/view, updateForFocusChange), which can land after
   // two frames (022p): wait for the mark, up to 60 frames. An editor never
   // marked focused still fails the ring.
   ```
   And the specification's defect: "CodeMirror sets the mark from a 10 ms timer after the focus event, or sooner on a selection update."

## Constitution checks

- §4.1 source, not a package: unaffected. No registry item or `static/r/` file changes. Finding 1's fix touches a site page only.
- §4.3 tokens are the one source: unaffected. No colour or size is added. Finding 1's fix uses existing utilities.
- §4.4 accessible, and proven in three engines: 022p keeps the ring check whole; a missing ring still fails (EXECUTED). 020c keeps the sideways and clipping checks whole, but records a page defect as a browser artefact, against "a specification that cannot meet this says so as a finding to fix, never as a limit to record" (finding 1). Firefox was not run here.
- §4.5 and §4.6 pinned inputs, named dependencies: no dependency added; `bun.lock` unchanged.
- §5 small change: each is one test, one lane, no interface change, no token, no dependency. Each check was seen failing first, and re-seen here. 020c's departure from its research's next step is not recorded (finding 1).
- §6 never: nothing committed or pushed. No prior art copied.

## Verdict

- **020c:** Does not land yet: finding 1 (the cause is the cloned decoration, in every engine, and a page fix removes it) and finding 2 (the slack has no margin) stand.
- **022p:** Lands; finding 4 is a write-in to its comment and specification.

## Disposition

