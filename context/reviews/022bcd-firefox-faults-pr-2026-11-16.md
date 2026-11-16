# Review of 022b, 022c and 022d — Firefox faults from 022's matrix (the built changes)

Reviews three small changes, each with its own specification:

- [`022b`](../specifications/022b-the-pressed-theme-segment-under-firefoxs-forced-colours.md), the pressed theme segment under Firefox's forced colours;
- [`022c`](../specifications/022c-the-viewer-keeps-the-frames-theme-in-firefox.md), the viewer keeps the frame's theme in Firefox;
- [`022d`](../specifications/022d-the-section-nav-is-not-a-tab-stop-in-firefox.md), the section nav is not a Tab stop in Firefox.

This reviewer wrote none of the stubs and none of the code (constitution §5).

- **Date:** 2026-11-16
- **Status:** in review. **`022b`: changes requested.** **`022c`: land.** **`022d`: land.** The three are one branch, so the branch lands once `022b`'s fix is on it.
- **Reviewer:** a reviewer; not the author.
- **Reviewed:** the worktree `.claude/worktrees/agent-a191005937c7c8f50`, branch `worktree-agent-a191005937c7c8f50`, on `70336f4`: `4a54e9b` (`022b`), `c1bf9e4` (`022c`), `243ebb2` (`022d`). Source touched: `theme-switch.svelte`, `block-viewer.svelte`, `side-nav.svelte`, `tests/fault-ledger.ts`, and the thumbnail manifest.
- **Re-ran:** Bun 1.4.4, macOS, load average 7 to 81. The worktree's source was not edited; `git status` was clean before and after. I rebuilt the site at `243ebb2` (`bun run build`, exit 0). A pre-change build of `70336f4` was made from `git archive` in the session scratchpad (`scratchpad/base/`), not as a worktree.
  - `bun run check` → **0 errors, 0 warnings**, 2,359 files. Prettier on the touched files: clean.
  - `bun test` on `fault-ledger`, `engine-only` and `macos-webkit` → **22 pass**; `thumbnails.test.ts` → **10 pass**.
  - `forced-colors.spec.ts` and `viewer.spec.ts`, `chromium-light`, `chromium-dark`, `firefox-light`, `firefox-dark` (`E2E_PREBUILT=1 E2E_PORT=5711`) → **174 passed, 18 skipped** (forced colours runs in the light projects only), 0 failed.
  - `viewer.spec.ts` test 4, all 8 blocks, `--repeat-each=5`, **all six projects** → **240 passed**, 0 failed (80 runs in Firefox).
  - `keyboard.spec.ts`, the Components landing's walk, `--repeat-each=3`, all six projects → **18 passed**.
  - `nav.spec.ts` and `navigation.spec.ts`, `chromium-light`, `firefox-light`, `firefox-dark` → **117 passed**.
  - The message-log keyboard tests in `webkit-light` and `webkit-dark`, `--repeat-each=3`: on `70336f4`, **11 of 12 failed**; on `243ebb2`, **10 of 12 failed** (Chromium and Firefox: 6 of 6 passed).
  - Probes of my own, served by `vite preview` on 5714 (the change) and 5715 (`70336f4`): `scratchpad/probe/` in the session scratchpad. Screenshots there: `big-{head,base}-{chromium,firefox,webkit}-{light,dark}.png`, `ring-*.png`, `fix-*.png`, `bp-chromium-{light,dark}.png`, `viewer-fc-*.png`.
  - `git merge-tree --write-tree release/0.13.0 worktree-agent-a191005937c7c8f50`, a dry-run merge. It moves no ref and touches no tree.

## Verdicts

| Change | Verdict | Why |
| --- | --- | --- |
| `022b` | **Changes requested** (blocking) | In Chromium the pressed label is now **invisible** under forced colours, in light and dark. Firefox is fixed; Chromium, the engine of Edge's contrast themes, regresses. axe cannot see it. One more class fixes it (finding 1). |
| `022c` | **Land** | No loop, no leak. It holds in 240 of 240 runs across all three engines. Two low findings, text only. |
| `022d` | **Land** | axe's `scrollable-region-focusable` finds 0 nodes on 6 pages × 3 sizes × 3 engines. The nav always holds links. Keyboard scrolling is kept, and slightly improved. |

## 022b — the pressed theme segment

### 1. High: Chromium paints the pressed label Canvas on its own Canvas backplate

**What happens.** Under forced colours, Chromium paints a **readability backplate** behind every run of text. The backplate is the `Canvas` colour. It normally matches the forced ground, so nobody sees it. `022b` sets the pressed segment's text to `Canvas`. So in Chromium the label is `Canvas` text on a `Canvas` backplate, inside a `CanvasText` fill. The reader sees a black pill with a blank white box where "Light" should be (`big-head-chromium-light.png`). In dark it is a white pill with a blank black box (`big-head-chromium-dark.png`).

**Evidence** (EXECUTED, `/components/button/`, the first frame's switch, `forcedColors: "active"`):

| Build | Engine, scheme | Computed (fill / text) | What is painted in the label's text box |
| --- | --- | --- | --- |
| `243ebb2` | Chromium light | `rgb(0,0,0)` / `rgb(255,255,255)` | **100 % one colour**: the label is gone |
| `243ebb2` | Chromium dark | `rgb(255,255,255)` / `rgb(0,0,0)` | **100 % one colour**: the label is gone |
| `243ebb2` | Firefox light, dark | `rgb(0,0,0)` / `rgb(255,255,255)` | fill 58 %, glyphs 13 %: readable |
| `70336f4` | Chromium light | `SelectedItem` / `SelectedItemText` | black glyphs on a white backplate inside the blue: readable |
| `70336f4` | Chromium dark | `rgb(153,200,255)` / `rgb(59,59,59)` | grey glyphs on a black backplate: barely readable |
| `70336f4` | Firefox light | `rgb(51,153,255)` / `rgb(255,255,255)` | 2.94:1, the fault `022b` was opened for |

The computed colours say 21:1 in every row for `243ebb2`. The landing notes' table reports exactly that, and it is true of the computed values. But it is not what Chromium paints. axe reads computed colours too, so `forced-colors.spec.ts` passes in `chromium-light` with the label invisible.

**A minimal reproduction** (`bp-chromium-light.png`, `bp-chromium-dark.png`, a plain page): in Chromium, any text whose colour equals `Canvas` vanishes on a system-coloured fill. That includes `CanvasText`/`Canvas` (this change), `Highlight`/`HighlightText` (`028` decision 4; see below) and `ButtonText`/`ButtonFace`. Adding `forced-color-adjust: none` to the element removes the backplate, and every pair then paints as written. Firefox draws no backplate. WebKit does not repaint.

On Windows, Edge uses this same Chromium paint path, so contrast-theme users would meet the blank pill. That is INFERRED from the shared code, not run on Windows. `028`'s owner-accepted manual Edge run (its Q4) should confirm it.

**Is the pressed state still distinct?** In Firefox, yes: a solid `CanvasText` pill with `Canvas` text, beside a `Canvas` segment with `CanvasText` text, inside the group's `CanvasText` border. The cue is the fill, not hue. That holds in any palette, because it is the palette's own main pair (WCAG 1.4.11 is met, and 1.3.1 by `aria-pressed`). In Chromium the state is distinct, but the label is lost, which fails 1.4.3 (the text has no visible contrast) and 1.3.1 for sighted users. WebKit draws the theme's own `bg-foreground`/`text-background`, unchanged.

**Fix (on the branch, before landing).** Two classes on the button, stacked on the state variant as `028`'s specificity rule asks:

```
forced-colors:aria-pressed:forced-color-adjust-none
forced-colors:aria-pressed:focus-visible:outline-[CanvasText]
```

The first removes the backplate from the pressed segment only. The second is needed because, once the element is no longer forced, its focus ring would take the theme's `--ring` token. It also fixes a fault older than this change (finding 2). I verified this by injecting the equivalent CSS into the built page, in Chromium and Firefox, light and dark (`fix-*.png`). The label is drawn in all four (fill 58 to 61 %, glyphs 13 % of the label box). The ring is drawn, `CanvasText`, outside the pill, and axe finds 0 violations in both light projects. In `chromium-dark` axe reports 9 `color-contrast` nodes on the Button page's own example buttons, the same 9 on `70336f4`. That is not this switch, and is out of the matrix (light only). It is `028`'s to look at.

**Check to add (write it first, see it fail on `243ebb2` in `chromium-light`).** In `forced-colors.spec.ts`: "the pressed theme segment's label is drawn". Screenshot the pressed button's text box (a `Range` over its contents). Fail if the most common colour covers more than 95 % of the box. Measured: `243ebb2` Chromium gives 100 % (fail); with the fix, Chromium and Firefox give about 60 % (pass); `70336f4` Chromium light passes too, which is right, because its label was readable. axe cannot be the check here.

**Landing notes to correct.** The table's Chromium row ("21:1 in both engines that force colours") is computed, not painted. It should say so, and record the backplate.

### 2. Medium, older than this change: Firefox's focus ring on the pressed segment is invisible

Firefox forces `outline-color` to the element's forced `color`. The pressed segment's text is `Canvas` (and on `70336f4` was `SelectedItemText`, also white). So its focus ring is `rgb(255,255,255)` on a white `Canvas` (EXECUTED, both builds; `ring-head-firefox-true.png`, against `ring-head-firefox-false.png`, where the unpressed segment's ring is black and clear). A keyboard user in Firefox's forced colours cannot see focus on the pressed segment (WCAG 2.4.7). The second class in finding 1 fixes it (`fix-firefox-light.png`). Chromium draws the ring in `Highlight`, visible on both builds.

### 3. The departure from `028` decision 4, and what `028` should say

**The departure is right for this switch**, once finding 1 is fixed. The reason is the one the builder gives: Firefox resolves `Highlight` to `rgb(51,153,255)` and `HighlightText` to white, so a `Highlight` fill with `HighlightText` text is 2.94:1, and axe flags it. `028` names this switch's move to `Highlight` as a lane-S follow-up (its §21, line 270); that follow-up would have failed the same check `022b` fixes.

**`028` itself has the same two faults, and they block its build as written:**

1. **The backplate (High).** Decision 4 puts `HighlightText` text on a `Highlight` fill for `toggle`, `toggle-group` and `tabs`, whose labels are text. In Chromium, `HighlightText` is the same colour as `Canvas` in both emulated palettes, so those labels vanish (EXECUTED, `bp-chromium-*.png`, the "highlight" row). `028`'s check would not catch it. Assertion G reads computed colours, and the pixel count of "changed pixels" counts the fill. Marks drawn as boxes or SVG (the checkbox fill, the switch's track and thumb, the radio's dot, the current edge) carry no text and are not affected.
2. **The ratio (Medium).** Firefox's `Highlight`/`HighlightText` is 2.94:1 for text. `028`'s research records this ("the emulated palettes are not contrast themes") and asserts drawing, not ratios. But `forced-colors.spec.ts` runs axe in `firefox-light` and fails a page on it. Once a pressed toggle or active tab is on a scanned page, the ledger will hold a line no small change can close while decision 4 stands.

**Recommendation for `028`, for the design lead to rule:**

- **A, recommended.** Decision 4 splits by what the fill carries:
  - A state fill **with text** (toggle, toggle-group's items, tabs' trigger) takes the page pair inverted, `CanvasText` fill and `Canvas` text, plus `forced-color-adjust-none`. Each class is stacked on the state's variant. Because adjusting is off, the element's focus outline and any border on it are named from decision 2's system colours too. This is `022b` with finding 1's fix: one pattern for the site and the items, with full contrast in every palette.
  - A state mark **without text** keeps `Highlight` as written.
  - Assertion G's roles change to match. A new assertion H, "a state fill's label is drawn", uses the pixel rule from finding 1.
- **B.** Keep `Highlight`/`HighlightText` for text-bearing fills and add `forced-color-adjust-none`. That fixes the backplate. But it leaves Firefox's 2.94:1 standing, and axe flagging it, with every such line ledgered until `028` is revisited. It does keep the user's selection hue, which Windows themes tune for contrast.

Either way, `028` §21 should drop the switch's follow-up (line 270) and its "the theme switch's `SelectedItem`" (line 269). `022b` replaces both. For non-text marks, Firefox's `Highlight` against its white `Canvas` is 2.94:1, under 1.4.11's 3:1. That is the same "not a contrast theme" position `028` already took; the design lead may want to say so explicitly.

### 4. Low, for later: the viewer's state and width buttons show no pressed state under forced colours

`block-viewer.svelte` marks its pressed state and width buttons with `aria-pressed:bg-foreground aria-pressed:text-background` and no forced-colours rule. Under forced colours, pressed and unpressed compute identically: Chromium `rgb(255,255,255)`/`rgb(0,0,0)`, Firefox `rgb(233,233,237)`/`rgb(0,0,0)` (EXECUTED, `/components/sign-up/`, `viewer-fc-*.png`). This is older than these changes and outside `022b`'s scope. It is a sibling of this fault, on another page's chrome. I suggest a lane-S small change with the same pattern (inverted pair, `forced-color-adjust-none`, ring) and the same pixel check.

## 022c — the viewer keeps the frame's theme

**Verdict: land.**

1. **No loop.** READ: `copyTheme()` calls `classList.toggle("dark", force)`. When the class already agrees, the DOM runs no attribute change and queues no mutation record. The frame's theme store (`theme.svelte.ts`) writes the class only from an effect on its own `resolved` value. It never observes the class. So a viewer write cannot wake the store, and the observer's own write produces nothing to observe. EXECUTED (a counter on every write to the frame's `<html>` class, `/components/app-shell/`): 0 writes in the 4.5 s after load in Chromium and WebKit. Pressing the frame's own toggle gives exactly 3 writes, and then nothing.
2. **No leak.** READ: each `load` disconnects the previous frame's observer before observing the new document. Unmounting disconnects both observers. A frame that navigates cross-origin makes `contentDocument` null, and the function returns after disconnecting. EXECUTED: after switching the state view twice (`/view/sign-up/` → `errors/` → `verify/`, each a new document) and toggling the page's theme twice, the frame followed every time, in Chromium and Firefox, with the frame's own reading inverted and its storage blocked.
3. **The frame's own toggle (ruling 2): intended, with one gap to record.**
   - With storage, the outcome is right in all three engines. The frame's store goes dark, the viewer puts it back, and the `storage` event takes the page dark, which copies dark in. Page, frame and the frame's toggle all agree (EXECUTED). The middle write can show the old theme for a frame.
   - **With storage blocked**, the frame's toggle is inert. It also contradicts itself: after a press, it is `aria-pressed="true"` ("Dark theme" pressed, Moon icon) while the frame and page are light (EXECUTED, Chromium, Firefox, WebKit). A screen-reader user would hear a state the frame does not show. It only arises with storage blocked, inside the site's own demo viewer, and the page's choice governing the frame is the stated contract. So **I accept it**, and ask that the landing notes say so in one sentence, rather than "the stored choice then reaches the page".
4. **The race.** Test 4 passed 240 of 240 (8 blocks × 6 projects × 5). That covers 80 Firefox runs, where `70336f4` failed 13 of 16 first time. The builder's probe of the write order explains why the observer, not a second hook, is the fix. Ruling 1 (no separate copy at view-ready) holds: the observer sees the hydration write whenever it comes.
5. **Low, text: a stale comment.** `tests/e2e/viewer.spec.ts:229` still says "so 022c's ledger line names them". The line is gone. The message is still worth keeping for any future line, so reword it to "so a ledger line can name them". It can wait for the next change to that file.

## 022d — the section nav

**Verdict: land.**

1. **Keyboard scrolling is kept.** `022e`'s ruling gives up a scroll box's Tab stop only when the box holds a focusable element. The section nav always does. EXECUTED: 6 to 81 focusable elements (links, and the filter's input on component pages) on every page measured. The filter hides `<li>`s, never the input, so even a filter that matches nothing leaves a focusable element in the box. Tabbing through all 80 links on the Components landing at 1280 × 500 scrolls the nav from 0 to its end (`scrollTop` 2,694) in all three engines.
2. **axe `scrollable-region-focusable`: 0 nodes.** EXECUTED: on `/start/`, `/components/`, `/components/button/`, `/components/hero/`, `/foundations/colour/` and `/changelog/`, at 1280 × 900, 1280 × 500 (the nav overflows on the component pages) and 768 × 600 (the nav hidden), in Chromium, Firefox and WebKit. That is 54 scans with 0 nodes. A full axe scan scoped to the nav also found 0 violations in each.
3. **A small gain.** A click on the nav's empty space now focuses the nav (no ring: `:focus-visible` does not match a pointer focus). ArrowDown and PageDown then scroll it, in all three engines.
4. **Ruling 1 (the attribute on the component, not the layout) is right.** The box is `SideNav`'s root, and the sheet's copy is unaffected for Tab.
5. **The comment** should cite the condition, so the next editor keeps it: "…all it holds is links and the filter (`022e`'s ruling: only a box that holds a focusable element gives up its stop)". Optional.
6. **Older than this change, for later.** In Firefox at 1280 × 500, the first link of 8 groups (Avatar, Empty, Checkbox, Highlighter, Dropdown menu, Stage card, Marketing footer, Chat) is scrolled to 12 to 13 px past the nav's bottom edge when tabbed to. That is 12 of 34 px clipped. It is the same on `70336f4`; Chromium and WebKit show every link whole. The 900 px walk passes, so it shows only on short viewports. I suggest a `scroll-margin` on the nav's links, as a small change if the design lead wants one.

## The ledger

**Consistent.** `tests/fault-ledger.ts` holds 8 lines: `022a` 4 (screen readers), `022f` 2 and `022e` 2 (Firefox). The 19 removed lines are exactly `022b`'s 1, `022c`'s 16 (8 blocks × 2 Firefox projects) and `022d`'s 2. Each removed line's test passes in its projects (above). The `BLOCKS` constant went with `022c`'s lines and nothing else used it. `ledgerCheck(LEDGER)` prints "holds 8 open faults" and names all 8 (EXECUTED). The only other `022b` in `tests/` is example data in `fault-ledger.test.ts`'s matcher tests, which is harmless. `context/handoff.md` speaks of "the small changes `022a` to `022f`" and stays true.

## The macOS WebKit message-log failures

**Older than these changes: confirmed.** On `70336f4`, `webkit-light` and `webkit-dark`, 3 repeats: 11 of 12 failed. On `243ebb2`: 10 of 12. Chromium and Firefox passed 6 of 6.

**The cause is the platform, not Kuiper.** macOS WebKit drops a scroll key pressed right after a script's `focus()`. On a plain page (a focusable `overflow: auto` box, no Kuiper code), `focus()` then ArrowUp scrolled **0 of 10** times in WebKit, and 10 of 10 in Chromium and Firefox. With a 400 ms pause after `focus()`, WebKit scrolled **10 of 10**. Focus by Tab with no pause: 4 of 10. On the message log itself, the first ArrowUp after `focus()` did nothing, and the second scrolled. With a 400 ms pause, it scrolled 4 of 4.

I also tried adding the pause to the tests, in the scratch copy only. The "End scrolls the log's region…" test then passed 10 of 10 in WebKit. The "Enter on the log's button…" test still failed 6 of 10 under load. So a fixed pause is not a reliable test fix.

**Recommendation: they join `tests/e2e/macos-webkit.ts`**, both titles, with a third cause beside `tab-to-links` and `click-focus`:

- `key-after-focus`: "a scroll key pressed just after a script's `focus()` does not scroll; seen on a plain box".

`tests/unit/macos-webkit.test.ts` keeps the titles in step. The file's own rule then decides: if Linux WebKit in push B also fails them, they are a fault, with a ledger line and a small change. That small change would most likely make the tests press until the box moves (`expect(...).toPass()`), not add a pause. This is lane E's, separate from these three changes.

## Merge notes for 0.13.0

- **`release/0.13.0` is at `b881eb6`**, past `70336f4`. It already holds `023` (`667b1cf`), `024c` and `027b`. So "`023` lands soon" has happened, and its hash rewrite is already on the release branch.
- **A dry-run merge conflicts in one file:** `src/lib/site/thumbnails/manifest.json`. Nothing else overlaps: the release branch has not touched `theme-switch.svelte`, `block-viewer.svelte`, `side-nav.svelte`, `+layout.svelte`, `tests/fault-ledger.ts` or the three specs since `70336f4`.
- **Resolve the manifest by regenerating it, never by hand**, as `024b` and `027` did. Take the release's side, build, then run `bun scripts/site/thumbnails.ts --hash-only`, then `bun test tests/unit/thumbnails.test.ts`. The pictures do not change: `022b` is forced-colours-only, `022c` draws nothing, and `022d` adds an attribute. `022b`'s fix (finding 1) moves the same 62 hashes again, so regenerate after the fix commit, not before.
- **Order:**
  1. `022b`'s fix and its new check, on the branch: see it fail on `243ebb2` in `chromium-light`, then pass.
  2. Merge `release/0.13.0` into the branch and regenerate the manifest.
  3. The gate on the merged tree: `bun run check`; the unit suite; `forced-colors.spec.ts`, `viewer.spec.ts` and `keyboard.spec.ts` in all six projects; `release-check --before-ci`.
  4. Land. `tests/fault-ledger.ts` is touched by `022e` (lane I, queued behind `023`) as well. Whichever lands second takes the other's removals: no line comes back.
- **The scorecard:** these change no registry item. I expect no movement. The design lead re-runs it at landing, per AGENTS.md.
- **For the design lead, outside this branch:**
  - `028` decision 4 and §21 (finding 3, recommendation A).
  - The viewer's pressed buttons under forced colours (finding 4).
  - The macOS WebKit list (above).
  - Optionally, the Firefox nav clip (`022d`, item 6).
