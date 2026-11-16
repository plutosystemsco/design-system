# 022b — The pressed theme segment under Firefox's forced colours

- **Status:** Built on its branch, awaiting the change review. Its ledger line is removed. Lane S.
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

## Landing notes

Built on its branch from `release/0.13.0` at `70336f4`, with `022c` and `022d` after it, one commit each (2026-11-16).

### Seen failing first

On `70336f4`, with the site built and the ledger in place, the test ran in `firefox-light`. It failed as its ledger line says, so the ledger marked it `expected`:

```
- Array []
+ Array [
+   "/components/button/: color-contrast",
+ ]
  > 167 |     expect(r.violations.map((v) => `${p}: ${v.id}`)).toEqual([]);
```

### The fix

In `src/lib/site/page/theme-switch.svelte`, the pressed segment's forced-colours pair is now `forced-colors:aria-pressed:bg-[CanvasText] forced-colors:aria-pressed:text-[Canvas]`, in place of `SelectedItem` and `SelectedItemText`. The class keeps `aria-pressed`, as `028`'s specificity rule asks. Nothing else in the switch changes. The comment above the group says why.

Computed under `forcedColors: "active"`, light, on `/components/button/` (a probe, after the colour transition):

| Engine | Pressed (ground / text) | Unpressed | `Canvas` / `CanvasText` |
| --- | --- | --- | --- |
| Chromium | `rgb(0, 0, 0)` / `rgb(255, 255, 255)` | transparent / `rgb(0, 0, 0)` | white / black |
| Firefox | `rgb(0, 0, 0)` / `rgb(255, 255, 255)` | transparent / `rgb(0, 0, 0)` | white / black |
| WebKit | the theme's `bg-foreground` / `text-background` | the theme's | (no forced colours) |

So the pressed segment reads 21:1 in both engines that force colours, and is still unlike the unpressed one.

### Rulings during the build

1. **`CanvasText` on `Canvas`, not `028`'s `Highlight`.** `028` decision 4 gives selected and pressed a `Highlight` fill with `HighlightText`, and its line 270 names this switch's move to `Highlight` as a lane-S follow-up. But Firefox resolves `Highlight` to the same `rgb(51, 153, 255)` as `SelectedItem`, and `HighlightText` to white (`028`'s review; a probe here, 2026-11-16: `Highlight` and `SelectedItem` `rgb(51, 153, 255)`, `HighlightText` and `SelectedItemText` `rgb(255, 255, 255)`), so `Highlight` with white text is the same 2.94:1 and axe would still fail. The stub's pair is used. Both keywords are in `028` decision 2's list, so the site keeps to the roles an item may name.

### Checks

- **`forced-colors.spec.ts`**, all six projects (it runs in the three light ones; `onlyProjects`): **27 passed, 27 skipped, 0 failed.** The Button page's axe scan passes in `firefox-light`, and in `chromium-light` and `webkit-light` as before.
- **`fault-ledger.test.ts`** and **`engine-only.test.ts`**: 20 passed.
- **Thumbnails.** Every example item's hash reads the switch, through `component.svelte`'s imports, so 62 of 80 hashes moved. The switch changes only under forced colours, which the pictures are not taken in, so the manifest was rewritten with `thumbnails.ts --hash-only`, as `024b` and `027` did. The pictures are checked in `022d`'s notes.
- The gate for all three changes is in `022d`'s notes.

### Findings for later

- **For `028`:** decision 4's pair, a `Highlight` fill under `HighlightText`, is `rgb(51, 153, 255)` under white in Firefox: 2.94:1, below 4.5:1 for a toggle's text. axe in forced colours will flag it there, as it flagged this switch. `028`'s checks assert drawing and difference, not ratios, so they will not catch it. The design lead may want `028` to say how a pressed item's text stays readable in Firefox.
