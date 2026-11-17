# 017a — The tokens page's copy buttons say "Copied" once

- **Status:** built 2026-11-17; its change review (`reviews/017a-the-tokens-pages-copy-buttons-say-copied-once-pr-2026-11-17.md`): lands; finding 1 (the icon check reads the path's geometry) and finding 2 and note 3 written in by the design lead. Lane S.
- **Date:** 2026-11-17
- **Author:** a lane-S builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one page). No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `017` (decision on the copy buttons, and criterion 4); `022v`, the same fix on the code block, which this follows.
- **Found by:** `022v`'s change review ([`../reviews/022vw-the-copy-button-and-the-search-count-pr-2026-11-17.md`](../reviews/022vw-the-copy-button-and-the-search-count-pr-2026-11-17.md), finding 3), queued as the roadmap's `017a` row.

## The defect

The tokens page, `/foundations/tokens/`, puts a copy button beside each token's name. After a copy, two things say "Copied" at once (READ, `src/lib/site/foundations/copy-name.svelte` before this change):

- the focused button's `aria-label` becomes "Copied" for two seconds (line 45);
- the status region beside it says "Copied" (line 52).

NVDA speaks the focused button's new name, then the status. A person hears "Copied" twice (INFERRED, from `022v`'s matrix evidence on the code block, which had the same two parts). `keyboard.spec.ts`'s 017 criterion 4 test pinned the double: it asserted `aria-label` "Copied".

## The fix

1. **The status speaks; the name stays.** The button's `aria-label` is always "Copy <what it copies>", for example "Copy --background". The status beside it still says "Copied" for two seconds. The check icon still shows for two seconds.
2. **Why the status, not the name.** As in `022v` (its fix 2): a status region present from the first render is the place the system announces an outcome, and a reader need not speak a name change.
3. **No interface change.** This is a site page, not a registry item. No app installs it, so the changelog does not change. The visible button is the same.
4. **The markup comment** says what the part does: its name says what it copies and keeps saying so; after a copy it shows a check, and the status says "Copied", the one place it is said.
5. **The text it supersedes.** `017` is a landed record and is not edited. Read criterion 4's second bullet, "Enter on the first sets its name to "Copied"", as: "Enter on the first sets the status beside it to "Copied", and the button keeps its name". Its decision "It copies `--<name>` and then says "Copied"" still holds for a role's button, the status saying it; a primitive's button copies its value, e.g. `#16140F`, as its name says (the change review, note 3).

## The check

- **`keyboard.spec.ts`, 017 criterion 4, restated** on the page's clock, as `022v`'s tests are. The clock is installed at a fixed time before the page opens, and paused 10 minutes ahead before Enter, so the name is read while time stands still. After Enter:
  - the status beside the first button says "Copied";
  - the button's accessible name is "Copy --background";
  - the button's icon has changed (the check shows);
  - the clipboard holds `--background`.
- **Why the clock.** Without it, the name assertion retries until the 2 s reset gives the old name back, and passes on the unchanged page (`022v`'s first draft). Pausing a running clock after Enter was flaky under load (`022v`'s review, finding 1).
- `tokens.spec.ts` tests the `kuiper-theme` page, not `/foundations/tokens/`. The tokens page's own suites are `axe.spec.ts`, `tokens-files.spec.ts` (which loads only under `bun --bun playwright test`) and `specimens.spec.ts`'s chip test; all pass (the change review, finding 2).

## Landing notes

Built 2026-11-17 by a lane-S builder, in the worktree `lane-s-run8`, at `db8fb65` (`release/0.13.0`). Not committed. Runs used `E2E_PREBUILT=1`, `E2E_PORT=4391`, a rebuild after each source change, and Playwright's browsers in `/opt/pw-browsers`.

### Seen failing first (EXECUTED)

- The restated test, on the unchanged component, after `bun run build`: failed in `chromium-light` and `webkit-light`, **2 of 2**, each at "toHaveAccessibleName: Expected "Copy --background", Received "Copied"".

### After the fix (EXECUTED)

- The same test, after a rebuild: **2 passed**, both projects.
- **Under load:** the test, both projects, `--repeat-each=25`, 4 workers, with two `yes > /dev/null` loops running on a 4-core machine (load average 3.0 at the start, 13.5 at the end; the loops were killed after): **50 of 50 passed**, none flaky.
- `tokens.spec.ts` and the keyboard test, `chromium-light` and `webkit-light`: **88 passed** (86 and 2), 0 failed.
- `bun run check`: 0 errors, 0 warnings. `bun run lint`: clean. `bun test ./tests/unit`: 1,977 passed, 0 failed.
- `static/r/` and `static/v0.13.0/r/`: unchanged by the build (`git status`). No registry item imports the page's part.
- **The thumbnails' manifest**, `bun scripts/site/thumbnails.ts --hash-only` after the build: rewritten for 83 items, with no change on disk. No example's hash walks the tokens page or `copy-name.svelte`.
- **The ledger:** no line names the token copy buttons (READ, `tests/fault-ledger.ts`). Not touched.
- **The scorecard** is not re-run for this change alone. It follows the batch's re-run when this lands.

### Not settled

- **No reader has heard the fix.** That NVDA now says "Copied" once here is INFERRED. No speech test covers the tokens page; the code block's `code-block.sr.ts` is the matrix's witness for this pattern.
- **A second copy within two seconds is silent,** as on the code block (`022v`'s review, note 9): the status keeps "Copied". It was silent before too. Not asked of this change.
