# 019d — A long error message wraps at 320 px

- **Status:** built; waits for its change review. Lane I.
- **Date:** 2026-11-17
- **Author:** a lane-I builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one item and its page). No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `019b` (the links box, criterion 4).
- **Found by:** `019b`'s change review, finding 2 ([`../reviews/019b-the-error-summarys-messages-are-read-once-pr-2026-11-17.md`](../reviews/019b-the-error-summarys-messages-are-read-once-pr-2026-11-17.md)).

## The defect

A message made of one long word does not wrap. The summary grows to fit it, and the page scrolls sideways at 320 px. That fails WCAG 1.4.10, Reflow. _Reflow_ means content fits a 320 px wide viewport with no sideways scroll.

- The review measured one 64-character token in a link: the summary 521 px wide in Chromium and 513 in WebKit; the page 545 and 537 against 320 (EXECUTED by the review). The item before `019b` does the same.
- A word with spaces or hyphens wraps. Only an unbroken one fails: a pasted token, an address, a long name.
- The title and the message come from the app too. They fail the same way (EXECUTED, below).

## The fix

1. **One class, on the content.** `error-summary-content` gains `wrap-anywhere` (`overflow-wrap: anywhere`). It is inherited, so the title, the message and every link may break inside a word, and only where the word would not fit otherwise.
2. **Why the content, not only the links.** The review proposed the links. With `wrap-anywhere` on the links alone, a long title still widens the page to 654 px (EXECUTED, below). One class on their shared parent covers all three.
3. **Why the look holds.** `anywhere` changes a box's smallest width, not its widest. A line that fits breaks where it did before. So a normal message lays out exactly as before in every block and example (108 screenshot pairs byte-identical; the change review), and each link is still as wide as its own text (`019b` criterion 4).
4. **No interface change.** No prop, slot, export or class an app passes changes. The item's markup comment says so, as its intent.
5. **The changelog.** One sentence joins `error-summary`'s `019b` bullet in the 0.13.0 entry's first part, before its pointer to "Also since 0.11.0" (`020d` decision 3).
6. **`019b`'s note 7.** Criterion 4's fallback to the old `ul` was to go with the next change to this item. This is it, so the fallback goes.

## The check

- **A new e2e test**, `error-summary.spec.ts`, "019d … 1": at 320 × 700, on the keyboard example after an empty submit, the first link and the title each get one 64-letter word. Then:
  - the page's `scrollWidth` is at most its `clientWidth`;
  - the summary's right edge is inside the viewport, and it does not overflow itself;
  - each text's `Range` lies inside the summary's border box, ± 0.5 px.
- **Guards, passing before and after:** `019b` criterion 4 (each link as wide as its text, ± 0.5 px); `019` criterion 12 (the look, ± 0.5 px); `019` criterion 9 and the axe spec's error-summary pages; and screenshots, base against change.

## Landing notes

Built 2026-11-17 by a lane-I builder, in the worktree `lane-i-run8`, at `db8fb65`. Not committed. Runs used `E2E_PREBUILT=1` on port 4581, a rebuild after each source change, and Playwright's browsers in `/opt/pw-browsers`. Built with `024i` in the same worktree; the gate ran once for both.

### Seen failing first (EXECUTED)

- **On the unchanged item:** the new test failed in `chromium-light` and `webkit-light`, 2 of 2. The page was 654 px wide in Chromium and 653 in WebKit, against 320. The summary's right edge was at 654 and 652.69.
- **With `wrap-anywhere` on the links alone** (a probe, not kept): still 2 of 2 failed, at 654 and 653. The link fit, but the title widened the box to 637 px of text.
- **After the fix:** 2 of 2 passed. The page is 320 px wide. The summary runs from 24 to 296. The long link ends at 277 (277.98 in WebKit) and the title at 274 (273.61).

### The look (EXECUTED)

- **96 screenshot pairs, base against change, byte-identical.** Chromium and WebKit; light and dark; 1440 × 900, 390 × 844 and 320 × 700. At each: the example view after an empty submit, the summary alone, each of its three links focused, and the component page's first three specimens. A scratch script, outside the repository.
- **Criterion 4's figures:** Chromium 128, 198 and 200 px at both sizes; WebKit 128.14, 197.09 and 198.11, each within 0.02 px of its `Range`. The boxes are 322 and 280 px. These are `019b`'s base figures.

### The ledgers (EXECUTED)

- `bun run build`: of `static/`, `error-summary.json` alone changed, in `static/r/` and `static/v0.13.0/r/`.
- **The mutation patches** `main/4-error-summary.patch` and `double-read/7b-error-summary.patch` no longer applied: their context line is the content's class. Both were regenerated against the changed item, with the same edits. `mutations.test.ts` and "022 test 6: the patches apply" pass.
- `bun run cost --sizes-only`: `error-summary` JS 11,875 → 11,882 B, CSS 906 → 926 (brotli 10,655 → 10,688 and 801 → 826). Its importers: `sign-in` 22,024 → 22,032, `sign-up` 29,720 → 29,730, `settings` 40,686 → 40,694. The catalogue moved too; its figures drift between runs on one source (`022v`'s notes), so they are not claimed. Runtime figures kept.
- `bun scripts/site/thumbnails.ts --hash-only`: four hashes moved, `error-summary`, `sign-in`, `sign-up` and `settings`, as for `019b`. No picture changed (above).
- **The scorecard** is not re-run for this change alone. It follows the batch's re-run when these land.

### The gate, with `024i` (EXECUTED)

- `bun run check`: 0 errors, 0 warnings. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals, 1 allowance.
- `bun test ./tests/unit`: 1,989 pass, 1 fail, across 70 files. The failure is the highlighter's streaming p95, at a load average near 13 on 4 cores. Alone, after the load fell, it passed 3 of 3: 4.29, 3.83 and 4.47 ms. This change does not touch the highlighter. The last full run, after the specifications were written, at a load average near 3: 1,990 pass, 0 fail.
- `bun scripts/site/release-check.ts --before-ci`: exit 0.
- `error-summary.spec.ts` and `blocks.spec.ts`, `chromium-light` and `webkit-light`: 170 passed, 1 skipped (`019b` criterion 3 in WebKit), 1 failed: `blocks.spec.ts` 24 in WebKit, at its 30 s timeout under the same load. Alone, 2 of 2 passed.
- The axe spec, its error-summary and app-shell tests, both projects: 56 passed.
- The dry speech run (`SR_DRY=1`), `error-summary.sr.ts` and `app-shell.sr.ts`: 8 of 8 in Chromium, 8 of 8 in WebKit. Dry mode drives the steps and does not judge speech.

### The change review (2026-11-17, written in by the design lead)

`reviews/019d-024i-the-long-message-and-the-digit-hash-pr-2026-11-17.md`: lands. Finding 1: `wrap-anywhere` lowers the summary's smallest width, so an app that squeezes it into a narrow flex column beside a wide sibling sees ordinary words break letter by letter (at 1440 the review saw it narrow from 125 to 76 px). The design lead keeps the fix: page reflow at 320 px is the WCAG 1.4.10 requirement, and no block or example lays the summary out that way. The page's "Your part" gains a line: give the summary its own row. Finding 2: the roadmap row now says the class is on the content. Note 5: the message paragraph wraps too (the review's probe); the test covers the title and the first link.

