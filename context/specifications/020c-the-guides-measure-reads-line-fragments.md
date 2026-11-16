# 020c — The guide's inline code stays in its column

- **Status:** rebuilt 2026-11-16 after its change review (`reviews/020c-022p-two-test-measures-pr-2026-11-16.md`, findings 1 to 3); the re-check: lands, with findings 5 and 6 written in (below). Lane S (one page and its test).
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one page). Its check is seen failing first. The built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `020b`.
- **Found by:** the `matrix` runs 1 to 4: `upgrade.spec.ts`, "020b … at 320, nothing in the column scrolls sideways, and every rename reads in it", fails in `chromium-*` (`research/2026-11-16-the-fourth-matrix-run.md`, §2).

## The defect

Inline code in the guide's sentences runs past the text column. EXECUTED (the change review, and this session, Chromium 156 and WebKit):

- Inline code has its padding and border repeated on each line piece (`box-decoration-clone`, `px-1` and `border`, `src/app.css:840`). Line breaking does not count those 5 px. So when `pluto:field-set` in a "What to do" sentence breaks after its hyphen, its first piece ends up to 5 px past the column's edge.
- At 320 in Playwright's headless shell, the piece `pluto:field-` runs from 176 to 306 in a column ending at 304. Full Chromium and WebKit show the same overhang, up to 4.7 and 5.0 px, at other widths from 320 to 440 that the test does not take. The page never scrolls sideways; the overhang lies in its gutter.
- This is the defect `020b`'s "Findings for later" logged. It is a page defect, not the test's.

The first version of this change let the test allow 2 px of overhang. The change review showed that hid the page defect, with no margin (one more pixel of padding failed it again), and that the cause was not a headless-shell quirk. That version is withdrawn.

## The fix

- **The page.** In `+page.svelte`'s `inline` snippet, inline code takes `-my-(--line-width) inline-block max-w-full wrap-anywhere`: `020b` ruling 3's recipe for the same page's rename names. A code run then breaks inside its own box, which holds its padding and border, and the box never passes the column. An inline-block's border counts toward its line's height, so the negative block margin of one hairline (`--line-width`) keeps each line at 24 px (the re-check's finding 5). The hidden twin table renders its code plain, as `020b`'s review finding 1 keeps it (finding 6). The rendered text does not change.
- **The test** keeps the 1 px it had, with no extra allowance. It waits for `document.fonts.ready`, as other specs do (`doors.spec.ts`, `expressive.spec.ts`); in these runs the fonts had loaded by `goto`'s return, and the wait makes that certain. It measures each `getClientRects()` piece: an element's outer box is past the column exactly when a piece is, so the verdict is the same, but the message names the 130 px piece rather than a 290 px box.

## The check

1. Seen failing first (EXECUTED): with the page as it was at `c5cdd65`, the new test fails at 320 in `chromium-light` and `chromium-dark`, naming `pluto:field-set` and `pluto:field-label` at 130 px past the column. With the page fix, `upgrade.spec.ts` passes 84 of 84 in `chromium-light`, `chromium-dark` and `webkit-light`, two repeats.
2. The change review, with the fix's CSS injected: from 320 to 440, step 2, the worst overhang is 0.02 px in the shell, full Chromium and WebKit.
3. Firefox runs in CI's matrix.
4. The re-check's write-ins (EXECUTED): with the chips' block margin set back to 0, 0 of 35 paragraphs holding code are whole lines of 24 px at 1440 (heights of 50, 52, 76 px), in Chromium and WebKit; with the fix, 35 of 35. A new test holds it, and another that no code in `table[hidden]` has a class. The built CSS emits `margin-block: calc(var(--line-width) * -1)`. The Markdown twin is byte-identical to the one built before this change. `upgrade.spec.ts` passes 96 of 96 in `chromium-light`, `chromium-dark` and `webkit-light`, two repeats; `bun run check`, lint and the literal lint are clean.
