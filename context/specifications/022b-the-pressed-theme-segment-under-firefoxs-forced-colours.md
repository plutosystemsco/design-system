# 022b — The pressed theme segment under Firefox's forced colours

- **Status:** Open. Ledgered in `tests/fault-ledger.ts`. Lane S.
- **Date:** 2026-11-15
- **Author:** `022`'s builder, for the design lead to open
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one page's chrome). No research memo and no spec review. Its check is already seen failing; the built change is reviewed by someone who did not write it (constitution §5).
- **Found by:** `022`'s local engine run, 2026-11-15: `tests/e2e/forced-colors.spec.ts`, "axe finds 0 violations on Button, Colour and the changelog", in `firefox-light`.

## The defect

Under forced colours, a frame's theme switch (`src/lib/site/page/theme-switch.svelte`) paints its pressed segment `SelectedItem` with `SelectedItemText`. Firefox's forced palette gives that pair `#3399FF` and `#FFFFFF`: 2.94:1. axe reports `color-contrast` on the pressed "Light" segment of every frame on the Button page (four nodes). Chromium's palette passes.

The pair is the system's, so Kuiper did not choose the colours; it chose a pair whose contrast the system does not promise for text.

## The fix

Under `forced-colors`, paint the pressed segment with the page's own pair inverted: `forced-colors:aria-pressed:bg-[CanvasText] forced-colors:aria-pressed:text-[Canvas]`. Canvas and CanvasText are the pair every forced palette keeps readable, so the pressed state stays visible and its text keeps the palette's own contrast. No other segment changes.

## The check

`forced-colors.spec.ts`'s axe test in `firefox-light`, failing today with `/components/button/: color-contrast`. When the fix lands, its ledger line (`change: "022b"`) is removed, or the run turns red. `028`'s forced-colours check, when it lands, also covers the switch.
