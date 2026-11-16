# 029a — The chart's surfaces from roles

- **Status:** draft. Not built. A small change: no specification review (constitution §5). Its built change is reviewed by someone who did not write it.
- **Date:** 2026-11-15
- **Author:** the spec author for `029`, for the design lead
- **Kind:** small change. It touches one item, `chart`. It changes no prop, no export, no class an app passes, no token and no dependency. Lane I.
- **Queued:** 0.13.0, before the tag, after `023`'s lane-I work. It may land before or after `029`. It must land before the tag, because `029` decision 8 turns this gap into a regression. If it slips, the 0.13.0 changelog names the gap.
- **Found by:** `029`'s author, confirmed by its re-review, R3 ([`../reviews/029-scoped-schemes-spec-2026-11-15.md`](../reviews/029-scoped-schemes-spec-2026-11-15.md), "Re-review, 2026-11-15"; [`029-scoped-schemes.md`](029-scoped-schemes.md) decision 8).

## The defect

LayerChart paints its halos and its neutral lines from its own variables, `--color-surface-100` and `--color-surface-content`. Kuiper's `chart` sets neither (EXECUTED (029), grep over `src/`). So each one falls back to LayerChart's own default (READ, `node_modules/layerchart/dist/components/`):

- `var(--color-surface-100, light-dark(white, black))`, for the marker strokes (`Marker.svelte`), the label halos (`Labels.base.svelte`) and the axis-label halo;
- `var(--color-surface-content, currentColor)`, in 76 places: legends, labels, the highlight band, grid and brush tints;
- one literal, `--stroke-color: white`, on `.lc-highlight-point` (`Highlight.base.svelte:215`).

Two things follow:

1. **A colour that is not a token reaches the page** (constitution §4.3). White and black, not `card`.
   - In the dark scheme a halo is black on a `#221f19` card.
   - A highlight point is ringed in white in both schemes.
2. **After `029`, a regression in Safari 16.4 to 17.4.** `029` decision 8 stops Vite from lowering `light-dark()`. Today Vite lowers these fallbacks, so they work in those browsers. Afterwards they stay native, and an engine without `light-dark()` drops the declaration, so the halos lose their fill there (INFERRED, from substitution; `029` decision 8).

## The fix

`chart-container.svelte`'s figure sets LayerChart's variables to Kuiper roles, with arbitrary-property classes in the token form. These hold no literal, so the literal lint allows them:

| LayerChart variable | Set to | Why |
|---|---|---|
| `--color-surface-100` | `var(--card)` | A chart's ground. The site's examples sit on cards, and LayerChart's own shadcn mapping uses the card (READ, `layerchart/dist/styles/shadcn-svelte.css`) |
| `--color-surface-200` | `var(--muted)` | The step above it, should a component read it |
| `--color-surface-content` | `var(--card-foreground)` | The ink on that ground |

A `.lc-highlight-point` rule in the same class list sets `--stroke-color: var(--card)`, so the one literal goes too.

- Every value is a role, so it is a pair under `029` and follows a scope. In an engine without `light-dark()`, it takes the theme's own hex fallback.
- A chart placed straight on the page, not on a card, can set `[--color-surface-100:var(--background)]` on the figure. The item's doc comment says so.
- The change is visible in two places. In the dark scheme a halo becomes the dark `card`, where it was black. A highlight point's ring becomes the card, where it was white in both schemes. In light, a halo on a card stays white (`card` is `#ffffff`).
- The changelog bullet says "not an interface change". It names the halo and ring colours.

## The check

**`tests/e2e/chart.spec.ts`, "the chart's surfaces are roles".** It is seen failing first. It runs on the production preview in all three engines (`022`'s projects, or the launchers, as `029` T10 says), with the system light and dark:

1. On the chart page's examples, each `[data-slot="chart"]` computes `--color-surface-100` to the `card` role's resolved colour, and `--color-surface-content` to `card-foreground`'s. *Fails today:* both are empty.
2. The two-series example, hovered so its highlight points render: each `.lc-highlight-point` has `stroke` equal to the `card` role. Each `.lc-marker` and `.lc-labels-text` present has its stroke equal to the `card` role too. *Fails today:* `rgb(255, 255, 255)`, or `rgb(0, 0, 0)` in dark.
3. **The same, with `light-dark(` renamed in the served CSS**, as `029` T12 does. The strokes still equal the `card` role's fallback hex. *Fails today, once `029` has landed:* the strokes are empty.

The change review reads the diff and this test's failing run. Once `029` has landed, the scorecard loop records no movement: this closes a gap rather than earning a criterion.
