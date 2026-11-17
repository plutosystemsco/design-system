# 019e — The error summary's list returns

- **Status:** built 2026-11-17; waits for its change review. Lane I.
- **Date:** 2026-11-17
- **Author:** the lane-I builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one item). It reverts `019b` (`331dd9d`) and nothing else. `019b` changed the item's interface, but 0.13.0 is unreleased, so no released app has the box markup. Against 0.11.0, the last release, this change and `019b` together change nothing. No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `019` (the list markup and its tests), `022t` (its `{#key attempt}` block, kept), `020d` (the changelog's fold and split, kept).
- **Found by:** [the eighth matrix run](../research/2026-11-17-the-eighth-matrix-run.md), cited as *run 8's memo*, §2 and §11.
- **The design lead's ruling (2026-11-17),** under the owner's delegation, *run 8's memo* §11, option (a): `019b` is reverted to the list markup now. A research memo then finds markup that every reader reads once. The markup is not changed again by guess.

Terms. A _pair_ is one reader with one browser: N-chr (NVDA with Chrome), N-ff (NVDA with Firefox), VO chr (VoiceOver with Chrome), VO wk (VoiceOver with WebKit). The _box markup_ is `019b`'s: the links straight in a `div`, `data-slot="error-summary-links"`. The _list markup_ is `019`'s: a `ul`, each link in an `li`.

## The defect

Run 8 ([44078599146](https://github.com/plutosystemsco/design-system/actions/runs/44078599146), a `matrix` push of `db8fb65`) is the first run with the box markup (READ, *run 8's memo* §2).

- **NVDA, both browsers, the five summary tests, 3 of 3 attempts each:** the title, "There is a problem", is never spoken. Each message is said three times: twice in the alert's text, once as its link. The insertion's phrase: "section. alert, Enter a project name Enter a project name Enter the owner's email address Enter the owner's email address …. Enter a project name, link, same page. …" (§2.2).
- **N-chr passed all five tests in run 7,** on the list markup. It fails all five now. NVDA spoke the title in both browsers in run 7 (§2.2, §11).
- **VO chr doubles each message either way.** Its run-8 phrase is word for word its run-7 phrase on the list (§2.3). So the list was not the cause there.
- **VO wk passed** on both markups (§2.4).

So the box markup is worse than the list in two pairs, and no better in the other two. `019b`'s bullet and page sentence, "so each message is read once", are refuted for NVDA (§2.2).

## The fix

1. **`git revert 331dd9d`,** resolved against today's tree. The item, its page, the changelog and the tests return to their content at `6482736`, the commit before `019b`. Nothing that landed after `019b` touched these files, so nothing after it is lost. `022t`'s `{#key attempt}` block stays: it is older than `019b`.
   - **The item,** `error-summary.svelte`: the `<ul class="grid gap-1">`, each link in an `<li>`, inside `{#key attempt}`. The header comment loses "The links are not in a list, so a reader reads each message once."
   - **The page:** the link bullet loses "The links are not in a list, so each message is read once. A reader does not say how many there are."
   - **`CHANGELOG.md`:** `019b`'s interface-change bullet goes. 0.13.0 is unreleased, so no bullet replaces it. `020d`'s fold, split and "See also" pointers are untouched. No other bullet named the box.
   - **`tests/e2e/error-summary.spec.ts`:** `019` criterion 1's snapshot pins the list again. `019b`'s describe (criteria 1, 3 and 4) goes, with its `onlyIn` import.
   - **`tests/e2e/engine-only.ts`:** `019b` criterion 3's `ENGINE_ONLY` entry goes. `onlyIn` calls return from 3 to 2.
   - **`tests/unit/registry.test.ts`:** `019b`'s three tests (the bullet, the page sentence, the header comment) go.
2. **The ledgers are regenerated,** not reverted by hand: `bun run build`, `bun run cost --sizes-only`, `bun scripts/site/thumbnails.ts --hash-only`.
3. **`019b`'s specification and its two reviews stay,** as the record. Its landing notes gain "Reverted, 2026-11-17".
4. **What stays open.** NVDA with Firefox's double on the list, and VO chr's double on either markup, return to where run 7 left them. The research memo the ruling names takes both (*run 8's memo* §10's first two rows).

## The check

Seen failing on the box markup, then passing on the list. Run with `E2E_PREBUILT=1`, `E2E_PORT=4391`, after `bun run build` on each.

- **Kept: `019` criterion 1's snapshot,** "1. the root is focused with no role or name; the alert is its content, holding the heading and the 3 links", restored by the revert. It pins `alert > heading, list > listitem > link`.
- **Scratch: Chromium's tree.** A probe, deleted after the runs, reads `Accessibility.getFullAXTree` over CDP and asserts that each of the keyboard example's three links has `listitem` as its nearest ancestor that is not ignored. It is `019b` criterion 3's test, with `alert` turned to `listitem`. It is not kept: the snapshot already pins the list, and the next markup is the research's to choose.

## Landing notes

Built 2026-11-17 by the lane-I builder, in `.claude/worktrees/integrate` (branch `integrate-run8`), at `9f31084`: `release/0.13.0` (`db8fb65`) with `017a` and `022ad` cherry-picked.

### Seen failing first (EXECUTED)

| Check | Box markup (the item at `9f31084`, tests reverted) | List markup (the revert) |
|---|---|---|
| `019` criterion 1's snapshot, `chromium-light` | fails: received `- link "Enter a project name"` straight under `alert`, no `list` or `listitem` | passes |
| the same, `webkit-light` | fails: the same | passes |
| the CDP probe, `chromium-light` | fails: nearest kept ancestor `alert`, `alert`, `alert` | passes: `listitem`, `listitem`, `listitem` |

The `webkit-light` run of the probe also failed on the box markup, but only because WebKit has no CDP; it is a Chromium check, as `019b` criterion 3 was.

### Ledgers

- `bun run build`: only `static/r/styles/maia/error-summary.json` and `static/v0.13.0/r/styles/maia/error-summary.json` change. Both are byte for byte their `6482736` content.
- `bun run cost --sizes-only`: 4 entries size-stale (`error-summary`, `sign-in`, `sign-up`, `settings`), and `_catalogue` rebuilt with them; runtime figures kept. `error-summary`: JS 11,875 → 11,872 B, CSS 906 → 891 B, their pre-`019b` figures. The catalogue reads JS 379,373 B and CSS 16,839 B, against 379,356 and 16,838 at `6482736`: `017a` and `022ad` landed since.
- `bun scripts/site/thumbnails.ts --hash-only`: rewritten for 83 items; exactly 4 hashes move (`error-summary`, `sign-in`, `sign-up`, `settings`), each back to its `6482736` value.

### The gate (on this change alone)

- `bun run check`: 0 errors, 0 warnings. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals in item files.
- `bun test ./tests/unit`: 1,987 pass, 0 fail. It holds `020d`'s guard and test 16, and `engine-only.test.ts`.
- `mutations.test.ts`: 29 pass. Patches 4 (`main/4-error-summary.patch`) and 7b (`double-read/7b-error-summary.patch`), `022t`'s list-era versions, each pass `git apply --check` on the reverted item. Neither touches the list's lines.
- `bun scripts/site/release-check.ts --before-ci`: exits 0.
- e2e, `chromium-light` and `webkit-light`: `error-summary.spec.ts` and `blocks.spec.ts`, 162 pass, app-shell A3 among them; axe and keyboard, the error-summary tests, 12 pass.
- The dry runs (`SR_DRY=1`), `chromium` and `webkit`: `error-summary`, `sign-in`, `sign-up`, `settings` and `app-shell`, 40 pass.
- Not run here: the full e2e suite, the Firefox projects and the readers. CI runs them.

### Waiting on others

- **The change review,** by someone who did not write this.
- **The first `matrix` push run carrying this change:** N-chr passes the five summary tests, as in run 7, and NVDA speaks the title in both browsers. N-ff and VO chr fail L3 on the list's double, as in run 7. Record its run id and each pair's result here, and in `022t`'s landing notes for its criterion 14.
- **The research memo** the ruling names: markup that every reader reads once. `019d` (a long message wraps at 320 px) is rebuilt on the list markup.
- **The scorecard** is re-run after this lands.
