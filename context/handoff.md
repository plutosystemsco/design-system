# Handoff

- **Status:** the state of the work, replaced at each release.
- **Date:** 2026-11-15

## State

`v0.11.0` (2026-11-07) is the last tag. `0.12.0` is built on the `release/0.12.0` branch and not yet tagged. `package.json` reads 0.12.0, `static/v0.12.0/` is built, and the changelog has one 0.12.0 entry. Nothing is pushed.

The system is now the **Kuiper Design System**, a public product any team may adopt (the owner, 2026-11-15). Code names stay `pluto` until 0.13.0.

Committed on `release/0.12.0`, one commit per specification:

1. **`014`, the white light-mode code ground**, with inline code on the code ground.
2. **`013`, code highlighted by tree-sitter** in Meridian's roles, with the Tombaugh palette.
3. **`016`, the brand yellow**: `#E2B000` light, `#F8D874` dark.
4. **`015`, the design site**: the four doors, 75 component pages, search, Markdown twins and `llms.txt`.
5. **`017`, Start, Brand and Foundations**: 21 pages and the six downloads.
6. **The follow-up**: dark `type` `#A8C0D8`, `kbd` on the code ground, the site's address.
7. **`018`, site polish**: the left navigation, the component-first page, thumbnails, search aliases, and the Kuiper name (`ea1f9bd`).

**`019`, the error summary**, is built and change-reviewed, uncommitted. The review reads "Lands, once finding 1 is settled" (`reviews/019-the-error-summary-pr-2026-11-15.md`). Its findings are being fixed. The alert moves inside the summary, and a link brings the field's label into view.

The tree holds 75 items. The last runs, on `019`'s build: unit 1206 pass; e2e 2738 passed, 11 skipped; smoke 132 pass; `check` 0 errors; lint clean; literal lint 0 violations and 1 allowance (L24); the release check exits 0. One timing test (`highlight-session.test.ts`, 4 ms p95) is flaky under load.

**The rules changed today.** The constitution, `AGENTS.md` and `README.md` were amended from the older-rules audit (`research/2026-11-15-older-rules-audit.md`, "Applied 2026-11-15"). In short: breadth follows the roadmap, accessibility is proven across three engines and screen readers from 0.13.0, the motion budget is gone, and small fixes have a lighter track.

## Waiting on the owner

- **`019`'s VoiceOver listen, before the tag.** The owner runs `scripts/a11y/voiceover-error-summary.ts` (after enabling VoiceOver's AppleScript control), or listens for one minute. The pass rule is in `019` decision 12. If it fails, the owner chooses between keeping the inner alert and dropping the live role (`019`, Risks).

The order to the tag: `019`'s fixes, its commit, the owner's listen, then the local `v0.12.0` tag.

## What this work checks, and what it does not

- Every page is checked in Chromium, in both themes, by the browser suites, axe and the keyboard walk.
- Firefox and WebKit are not yet run, and no screen reader has been run but `019`'s pending listen. From 0.13.0 these are no longer limits: constitution §4.4 requires all three engines and scripted screen-reader checks.
- The glass's Firefox mask order is written to the standard, but it is not run in Firefox.

## Next

The plan is `roadmap.md` (being written now from the inventory, the page standard, the toast memo and the scorecard). Already ruled for 0.13.0 and after (the owner, 2026-11-15):

- the rename of code names to Kuiper, with a migration guide for installed apps;
- lockup mock-ups for the Kuiper name, for the owner's approval;
- the accessibility status from the test report, with the high-contrast scheme, a forced-colours pass, and the full engine and screen-reader matrix;
- light and dark scoped to any subtree with `light-dark()` (`research/2026-11-15-scoped-schemes-and-contrast.md`), its questions to the owner first;
- prop doc comments on every item, so the API tables fill in;
- the component page standard, piloted on `button`, `dialog`, `field`, `dropdown-menu` and `error-summary`;
- a `toast` of Kuiper's own, on `status` (`research/2026-11-15-toasts.md`);
- the token file as conformant DTCG, exported as design variables;
- a functional data palette: eight categorical colours with sequential and diverging scales.

Still open from before: the product icons (G5), whose tile is ruled but not drawn, and a signature device, set aside by the owner.
