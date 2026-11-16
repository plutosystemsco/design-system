# 022c — The viewer keeps the frame's theme in Firefox

- **Status:** Open. Ledgered in `tests/fault-ledger.ts`. Lane S.
- **Date:** 2026-11-15
- **Author:** `022`'s builder, for the design lead to open
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one site component). No research memo and no spec review. Its check is already seen failing; the built change is reviewed by someone who did not write it (constitution §5).
- **Found by:** `022`'s local engine run, 2026-11-15: `tests/e2e/viewer.spec.ts`, "4. the frame's <html> is dark exactly when the page's is: at load, after the toggle, and back", for all 8 blocks, in `firefox-light`.

## The defect

A block page's viewer (`src/lib/preview/block-viewer.svelte`) copies the page's `dark` class onto its frame's `<html>` on the frame's `load` event, and again whenever the page's class changes. The test makes the frame's own head script choose the other theme (its storage blocked, its system preference inverted), so only the copy can make the two agree.

In Chromium the copy wins. In Firefox the frame keeps its own choice: with the page light, the frame is dark (a probe on `/components/hero/`, 2026-11-15: `frameDark: true`, parent light). The frame's own theme code runs after the viewer's copy there, and nothing copies again. A visitor sees a block in the other theme from the page whenever the frame's own reading differs.

## The fix

The viewer also copies when the frame's view is ready (`body[data-view-ready]`, set by the frame's layout on mount), and observes the frame's `<html>` `class` once it loads, copying back whenever the frame's own code changes it. The page's choice is the only one the frame shows. No prop changes.

## The check

`viewer.spec.ts` test 4, for every block, in `firefox-light` (and the dark projects, once run): failing today on its first poll. When the fix lands, its ledger lines (`change: "022c"`) are removed, or the run turns red.
