# WebKit on Linux: why the WebKit-only tests fail in CI

- **Status:** complete
- **Date:** 2026-11-16
- **Author:** a researcher
- **Question:** CI's `matrix` runs WebKit on Linux (`ubuntu-24.04`). Seven groups of tests fail there, in `webkit-light`, `webkit-dark` or both, and nowhere else. What causes each one? Is each a fault in Kuiper's source, in the test, or in WebKit itself?
- **Stands on:** [the first matrix run](2026-11-16-the-first-matrix-run.md) (groups 3, 5, 6 and 9) and [the third matrix run](2026-11-16-the-third-matrix-run.md) (§1, §2).
- **What it blocks:** the small changes that clear the WebKit rows of the release check (`022` decision 19). It also blocks one ledger line: the search field's cancel glyph (§2.3).

## How to read this memo

Every claim carries a label.

- **EXECUTED:** run in this session's Linux container. The tests ran at `0933f1b` on `release/0.13.0`, the commit run 3 tested. They used Playwright 1.64.1 with its WebKit build 2370 and Chromium 153. The site was the built `build/` and `.svelte-kit/output`. Probes are small scripts that drive the same browsers outside the test runner. They were kept in the session's scratchpad, not in the repository.
- **READ:** a source says so. Sources are the CI job logs of run 2 ([43894126297](https://github.com/plutosystemsco/design-system/actions/runs/43894126297)) and run 3 ([43908608319](https://github.com/plutosystemsco/design-system/actions/runs/43908608319)), read 2026-11-16 through the GitHub connector. Another is WebKit's source on `main` at `2053428` ([github.com/WebKit/WebKit](https://github.com/WebKit/WebKit)), read 2026-11-16. That is today's `main`, not the exact revision of Playwright's build. The probes are the evidence of what the build does; the source explains it. The last two sources are CodeMirror's `@codemirror/view` 6.43.15 and Playwright 1.64.1's type documentation, both in `node_modules`.
- **INFERRED:** our reasoning.

Some terms:

- A **kind** says where the fix goes. **Item:** a fault in Kuiper's source that an app would ship. **Test:** the test assumes macOS, or a timing that CI's runner does not give. **Engine:** a WebKit-on-Linux behaviour that no Kuiper change can fix.
- **Linux WebKit** means WebKit's GTK and WPE ports, which Playwright runs on Linux. GNOME Web (Epiphany) is the everyday browser built on them. **macOS WebKit** means the Mac port, which Safari uses.
- The **sequential focus navigation starting point** is the place Tab and Shift+Tab search from when focus moves. A click sets it.
- **DSF** is the device scale factor: device pixels per CSS pixel.

## 1. Toast 64a, 64c and 64d: Shift+Tab after a click goes nowhere

The tests click a button to raise a toast, then call `save.focus()`, then press Shift+Tab. They expect focus on an element inserted just before the button. Focus stays on the button.

- **Reproduces:** 3 of 3 here (EXECUTED), in both WebKit projects in runs 1 to 3 (READ).
- **EXECUTED, the trigger is the click.** On a page with three plain buttons, A, B and C, and no Kuiper code:
  - `focus()` on C, then Shift+Tab: focus moves to B.
  - A click on C, then Shift+Tab: focus stays on C. Further presses also leave it on C, even after a 500 ms pause.
  - A click on C, then Tab: focus moves to D. Only the backward direction is stuck.
  - A click on C, then `blur()`, then `focus()` on C, then Shift+Tab: focus moves to B.
  - Chromium moves to B in every case.
- **EXECUTED, the hit node decides it.** A click on a button's text or child span leaves Shift+Tab stuck. A click on its padding, or on an empty button, does not.
- **EXECUTED, on the toast page.** Without the click, `focus()` then Shift+Tab reaches the inserted button 3 of 3. With the click, it never does. The Shift+Tab keydown is not prevented, and no `focusout` fires.
- **READ, the mechanism in WebKit's source.** On a mouse press, WebKit first focuses the button. Then `EventHandler::handleMousePressEvent` sets the starting point to the hit node, which is the text node inside the button. `Document::focusNavigationStartingNode` uses that node while it lies inside the focused element. Searching backward from inside the button finds the button itself. Focusing an element that already has focus changes nothing, so the starting point never moves.
- **INFERRED, why macOS passes.** On macOS a click does not focus a button. So `save.focus()` really moves focus there, which resets the starting point to the button. On Linux the click has already focused the button, so `save.focus()` does nothing, and the starting point stays inside.
- **INFERRED, the first memo's guess was wrong.** Group 5 suggested `key-after-focus`, a key dropped just after a script's `focus()`. A pause does not help, and the key is not dropped. The fault is the starting point the click leaves.
- **READ (search result only):** WebKit bug 316027 describes the same symptom in Epiphany. The page could not be opened from this session, because `bugs.webkit.org` is outside its network.

**Kind: test, on an engine bug.** A Linux WebKit user who clicks a button and presses Shift+Tab is stuck too, but no Kuiper change can fix that. The tests assume macOS's `click-focus` default without naming it: the `save.click()` then `save.focus()` pair only resets the starting point where a click does not focus. **Fix:** raise the toast by keyboard (`focus()` then Enter, as 64g already does), so no click sets the starting point.

## 2. Pagination 15a and 18, and search field 28: tests and an item written for macOS

### 2.1 Pagination 15a (by click) and 18

- **Reproduces:** 1 of 1 each here (EXECUTED), with CI's errors exactly: 15a "after 5" got "Page 5" where "Page 1" was expected; 18 got "Page 12" where `body` was expected.
- **EXECUTED:** Linux WebKit focuses a button on click. In the buttons example, after a click on pages 5, 12, 1, 4 and 3, focus is on the pressed page each time: 5 of 5 runs, the same as Chromium. Test 18's path (blur, then a click on Next onto the last page) leaves focus on Page 12 in 5 of 5 runs, again as Chromium.
- **READ, the assumption.** 15a calls `adaptsIn("webkit", "focus on click: WebKit does not focus a button on click, so the item moves no focus")`. 18 calls `onlyIn("webkit", "focus on click: only WebKit leaves focus where it was when a button is clicked")`. Both have entries in `ENGINE_ONLY` (`tests/e2e/engine-only.ts`). Both helpers (`tests/e2e/engines.ts`) branch on the engine only. The behaviour is macOS's, the `click-focus` cause in `tests/e2e/macos-webkit.ts`.
- **INFERRED:** the item is right. Its non-WebKit branch, the one Chromium and Firefox run, would pass in Linux WebKit.

**Kind: test.** **Fix:** branch on the platform, not the engine: macOS WebKit gets today's WebKit branch, Linux WebKit the Chromium one. The helpers cannot say "WebKit on macOS" today. `tests/test.ts` already branches on `process.platform === "darwin"` for Tab to links, so there is precedent.

### 2.2 Search field 28: the test's assertion is right

- **Reproduces:** 1 of 1 here (EXECUTED): "the bare input's cancel button shows" is false, because removing the item's classes changes no pixel.
- **EXECUTED, on the example.** With the item's classes in place, the end of the focused, filled field shows WebKit's cancel glyph. It is drawn beside Kuiper's own Clear button, so the field has two clear controls. Chromium hides the glyph with the same classes.
- **EXECUTED, on a bare search input, focused.** In Linux WebKit, `appearance: none` on `::-webkit-search-cancel-button` leaves the glyph, and so does `-webkit-appearance: none`. `display: none` hides it. So does `appearance: none` with the background and mask cleared. In Chromium every one of those rules hides it.
- **READ, the mechanism.** Linux WebKit loads `css/themeAdwaita.css` as a user-agent sheet: `PlatformGTK.cmake` and `PlatformWPE.cmake` include `platform/Adwaita.cmake`, which adds it. That sheet already sets `appearance: none` on the cancel button. It then draws the glyph as a `mask-image` over a `background-color: currentColor`. So `appearance: none` cannot remove it. On macOS the glyph is the native appearance, which `appearance: none` does remove.
- **READ:** the item's input carries `[&::-webkit-search-cancel-button]:appearance-none` (`src/lib/registry/ui/search-field/search-field.svelte:165`).

**Kind: item.** An app that ships the search field shows two clear buttons in GNOME Web and other Linux WebKit browsers. The test caught it. Its third assertion, though, takes `-webkit-appearance: none` as the reference, which encodes the same macOS assumption. **Fix:** hide the pseudo-element with `display: none`, which works in both WebKit ports and in Chromium, and make the test's reference rule the same.

## 3. Chat L1: the wheel scroll is still moving when the test reads it

- **Reproduces:** 3 of 8 here (EXECUTED; 4 runs in each WebKit project). Before the stream button's click, `before` read 411, 412 and 497. Afterwards the log stood at 410 each time. CI read 413, 411, 583 and 421 against 410 (READ, run 3).
- **EXECUTED, on the Kuiper log and on a plain `overflow: auto` box.** A wheel of −300 in Linux WebKit scrolls over about 200 ms, in 13 steps that ease out: 331, 315, 270 … 33, 31. In Chromium it is one step, in one frame. The plain box behaves the same, so Kuiper's code plays no part.
- **READ:** the test polls only until the log is 8 px or more from its end. It checks the button's place and colours, then reads `before` (`tests/e2e/chat.spec.ts:155`). The ease-out tail lands after the read.
- **INFERRED:** the item holds the released log still; the 3 px is the wheel's own animation finishing. The value it settles at, 410, is the same every time.

**Kind: test.** **Fix:** wait until `scrollTop` holds still across two frames before reading `before`.

## 4. Code E6 in WebKit: one Enter makes two lines

- **Reproduces:** 1 of 1 here (EXECUTED): "python after the edits", an editor line 51 the block lacks, as in CI.
- **EXECUTED, the Enter.** With the caret at the end of the text, the cursor wait passed, then one Enter:
  - on the agreement page's full-height editor (`CodeEditor` with `lineNumbers`, `history`, `closeBrackets` and `bracketMatching`, and no `defaultKeymap`): 2 lines added, 3 of 3;
  - on a bare CodeMirror `EditorView` with no extensions at all: 2 lines added, 3 of 3;
  - in Chromium, on both: 1 line, 3 of 3.
- **EXECUTED, the text after E6's own typing** (`"\nvalue = 1"`). WebKit leaves `…print(f(1))\nvalue = 1\n`; Chromium leaves `…print(f(1))\nvalue = 1`. The trailing newline is the extra editor line. The block drops a trailing newline by design (`022k`), so the two disagree.
- **EXECUTED, the DOM.** Both engines write the same thing for the Enter: two `\n` characters at the line's end, inside the content's pre-wrap text. A lone trailing newline would not render, so the browser writes two.
- **READ, why the engines differ.** CodeMirror's DOM change reader (`@codemirror/view` 6.43.15, `dist/index.js` near line 4313) says "Chrome inserts two newlines when pressing shift-enter at the end of a line. DomChange drops one of those." The correction runs only under `browser.chrome`. WebKit writes the same two newlines, and CodeMirror keeps both.
- **EXECUTED, the shipped setups.** The code editor's example (`pythonSetup()`, which includes `defaultKeymap`) adds 1 line on Enter and 1 on Shift+Enter in Linux WebKit, 3 of 3. There, the key handler inserts the line and the browser writes nothing. Every site example passes `defaultKeymap`: the three code editor examples through `pythonSetup()`, and the code languages example through its own base setup.
- **READ:** the item's default is `extensions = []` (`src/lib/registry/ui/code-editor/code-editor.svelte`). Its own keymap binds only `Mod-Enter` and `Ctrl-Enter`. So an editor rendered with no setup, or with a setup that lacks an Enter binding, leaves Enter to the browser.

**Kind: item.** The fault sits in CodeMirror's handling of WebKit, but Kuiper's item exposes it. An app that renders `CodeEditor` without a setup that binds Enter adds two lines per Enter at a line's end in Linux WebKit browsers. The agreement fixture is such a setup, so it shows the fault; it does not cause it. `pythonSetup()` users are not exposed. **Fix:** the item binds Enter (CodeMirror's `insertNewline`) at the lowest precedence, so every editor handles the key itself and a setup's own binding still wins.

## 5. Bar glass, `bar-glass.spec.ts:140`: a time-out, not a contrast failure

- **READ, the failure is a time-out.** In run 3, shard `webkit 1`, both `/components/button/` and `/components/` at 1440 failed with "Test timeout of 30000ms exceeded", on the first try and the retry. The readings they printed were lowest 12.93 and 16.66, far above 4.5. The third memo's row read it as a contrast failure.
- **Reproduces:** not here. 16 of 16 passed (EXECUTED; both WebKit projects, the 4 dense pages at 1440, twice). The readings matched CI's to the hundredth. One test took 22.6 to 24.3 s in WebKit, against 7.0 s in Chromium.
- **EXECUTED, where the time goes.** Per page of the test, the four scratch-page decodes, each returning the pixel array through `evaluate`, took 22.9 s in WebKit at DSF 2 and 6.1 s at DSF 1. In Chromium they took 21.6 s at DSF 2 and 5.5 s at DSF 1. Opening, scrolling and the screenshots took about 4 s in both. So the cost is the pixel count, not the engine.
- **EXECUTED:** Playwright's "Desktop Safari" device, which the WebKit projects use, has DSF 2. "Desktop Chrome" and "Desktop Firefox" have DSF 1.
- **INFERRED:** CI's two-core runner, with two workers, adds the last seconds and crosses 30 s.
- **INFERRED, a second fault.** The test measures each text's box in CSS pixels and indexes the screenshot with it. At DSF 2 the screenshot is in device pixels, twice as large each way. So in WebKit each box samples the glass at half its coordinates, not behind the text. The check passes, but it reads the wrong pixels.
- **READ:** Playwright's screenshot option `scale: "css"` gives "a single pixel per each css pixel on the page" (`playwright-core/types/types.d.ts`).

**Kind: test.** **Fix:** take the panel's screenshot with `scale: "css"`. That cuts the pixels to a quarter and puts the boxes on the right pixels.

## 6. Compositions 604, the keyboard walk: WebKit reveals focus a task later

- **READ, the failures.** Run 3: "back to stop 13: hidden under the bar: −825.8125 ≤ 72" (`webkit-light`, flaky). Run 2: "back to stop 16: hidden under the bar: 54.375 ≤ 72" (`webkit-dark`, flaky).
- **Reproduces:** not here: 0 of 20 (EXECUTED; 5 runs each at 1440 and 320, in both WebKit projects, two workers).
- **EXECUTED, the geometry.** Walking back at 1440, the step from the "Find renewals" tab to stop 13, the hero's code block, scrolls the page from 1384 to 66. Once scrolled, the block's bottom is at 492. Unscrolled, it would be at 492 + 66 − 1384 = −826. So CI read the box before any scroll had happened.
- **EXECUTED, when the scroll happens.** On a plain page and on the product home, a Shift+Tab to an element far above leaves `scrollY` unchanged at `focusin`, in a microtask and in a zero-delay task queued from `focusin`. It has changed by the next animation frame. In Chromium the page has scrolled before `focusin` fires.
- **READ, the mechanism.** `Element::updateFocusAppearance` calls `LocalFrameView::scheduleScrollToFocusedElement`, which starts a zero-delay one-shot timer. The scroll runs when the timer fires, not inside the focus change.
- **INFERRED:** `focusProblem()` reads the box in an `evaluate` right after `keyboard.press` resolves. Usually the timer has fired by then. On a loaded runner, the `evaluate` can run first. Run 2's 54.4, a box partly under the 72 px bar, fits the same race on a shorter scroll.
- **READ:** the walk is listed in `macos-webkit.ts` under `tab-to-links`, so it never ran in WebKit before CI.

**Kind: test.** WebKit's deferred reveal is lawful: no specification requires the scroll to finish inside the focus change. **Fix:** after each press, wait two frames before reading the focus's geometry, as `toast.spec.ts`'s `frames()` does.

## 7. Primitives 426, the looping-animation sweep: a time-out too

- **READ, the failure.** Run 2, shard `webkit 7`, `webkit-dark`: "Test timeout of 30000ms exceeded", on the retry while waiting in `open()` for a page's toggle (`pages.ts:714`). It found no looping animation; it ran out of time.
- **Reproduces:** not here: 3 of 3 passed in `webkit-dark` (EXECUTED).
- **EXECUTED:** the test opens 50 pages in one test (26, 10, 11, 2 and 1 from `ITEMS_002` to `ITEMS_007`). It took 19.3 to 19.6 s in WebKit and 9.2 to 11.6 s in Chromium, one worker on four cores.
- **INFERRED:** WebKit takes about 0.4 s a page here. CI's two cores, shared by two workers, take it past 30 s now and then.

**Kind: test.** **Fix:** give the sweep a time-out that grows with its page count, or one test per item list.

## 8. What this changes in the earlier memos

- **INFERRED:** group 5's cause is the click's starting point (§1), not `key-after-focus`.
- **INFERRED:** group 6 holds one item fault: the search field's cancel glyph (§2.2). The two pagination tests are faults in the tests.
- **INFERRED:** the third memo's "new" `bar-glass` row is a time-out (§5), and run 2's `primitives` row is one too (§7). Neither found a contrast fault or a looping animation.
- **INFERRED:** E6 in WebKit is an item fault (§4). It needs a ledger line until the item binds Enter.

## 9. What this memo did not settle

- **Whether macOS Safari doubles the Enter.** The Mac port was not run here. `macos-webkit.ts` does not list E6, so E6 passed in macOS WebKit when it was written (INFERRED). This suggests the double newline is Linux WebKit's alone, but that was not measured.
- **The WebKit bug's state.** Bug 316027 (§1) was found by a search and could not be opened.
- **The exact WebKit revision.** The source read is `main`, not the revision of Playwright's build 2370. Each mechanism matched what that build did in the probes.
- **The CI rates of §5, §6 and §7.** They fail only on CI's loaded runner, so no rate could be measured here.

## 10. Summary

| Failure | Reproduces here | Kind | Fix |
| --- | --- | --- | --- |
| toast 64a, 64c, 64d | yes, 3 of 3 | test, on an engine bug | Raise the toast by keyboard, so no click leaves the starting point inside the button. |
| pagination 15a (click), 18 | yes, 1 of 1 each | test | Branch on platform: the WebKit branch is macOS's; Linux WebKit takes the Chromium one. |
| search field 28 | yes, 1 of 1 | item | Hide `::-webkit-search-cancel-button` with `display: none`, and make the test's reference the same. |
| chat L1 | yes, 3 of 8 | test | Wait for `scrollTop` to hold still before reading `before`. |
| code E6, full height | yes, 1 of 1; Enter doubles 3 of 3 | item | The code editor binds Enter (`insertNewline`) at the lowest precedence. |
| bar-glass 140 at 1440 | no, 0 of 16; CI times out | test | Screenshot with `scale: "css"`: a quarter of the pixels, and the boxes on the right ones. |
| compositions 604, the walk | no, 0 of 20; CI flaky | test | Wait two frames after each press before reading the focus's box. |
| primitives 426 | no, 0 of 3; CI timed out once | test | A time-out that grows with the 50 pages, or one test per list. |
