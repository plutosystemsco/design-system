# 020c — The guide's column test reads line fragments, in the page's fonts

- **Status:** built 2026-11-16; waits for its change review. Lane S (a test only).
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one test). Its check is seen failing first; a check written after its fix is proven by mutation. The built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `020b`.
- **Found by:** the `matrix` runs 1 to 4: `upgrade.spec.ts`, "020b … at 320, nothing in the column scrolls sideways, and every rename reads in it", fails in `chromium-*` (`research/2026-11-16-the-fourth-matrix-run.md`, §2).

## The defect

The test reports `code "pluto:field-set…": 290 wide, past the column` and the same for `pluto:field-label`. Three things were wrong in how it measures, and none in the page. EXECUTED in this session, Chromium 156 (the CI build):

1. **It measures before the fonts load.** It reads the layout right after `goto`, which may be the fallback font's. Other specs wait for `document.fonts.ready` (`doors.spec.ts`, `expressive.spec.ts`).
2. **It measures an inline element's union box.** `pluto:field-set` in a "What to do" sentence wraps after its hyphen, so its outer box spans both lines: 282 px in Chrome, 290 in the test. Each fragment fits.
3. **The headless shell paints a line's last run 2 px past where it broke it.** With the first two fixed, the fragment `pluto:field-` runs from 176 to 306 px in a column ending at 304 in Playwright's headless shell, and from 172 to 298 in full Chrome. The overhang lies in the page's 16 px gutter: the page does not scroll sideways, and the text reads whole, which is what the test is for.

## The fix

The test waits for `document.fonts.ready`, measures each `getClientRects()` fragment, and lets an inline element's fragment overhang the column by 2 px, the shell's measured overhang; a block box keeps the 1 px it had. The page does not change.

## The check

1. Seen failing first: the unchanged test fails at 320 in `chromium-light` and `chromium-dark`, 6 of 6 (Chromium 156). After the font wait and the fragments alone, it still failed, naming the 130 px fragment at [176, 306]; with the 2 px slack, `upgrade.spec.ts` passes 126 of 126 in `chromium-light`, `chromium-dark` and `webkit-light`, three repeats.
2. Proven by mutation: with the guide's inline code made `whitespace-nowrap` and three times as long, in a rebuilt site, the 320 test fails, naming the boxes past the column (528 px wide). Restored, it passes.
