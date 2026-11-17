# Review of 017a — the tokens page's copy buttons say "Copied" once

- **Date:** 2026-11-17
- **Status:** dispositioned; lands
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the uncommitted diff in the worktree `lane-s-run8`, on `db8fb65`: `src/lib/site/foundations/copy-name.svelte`, `tests/e2e/keyboard.spec.ts`, and the untracked [017a](../specifications/017a-the-tokens-pages-copy-buttons-say-copied-once.md). Read with `AGENTS.md`, the constitution, [022v](../specifications/022v-code-blocks-copied-is-said-once.md) and [its review](022vw-the-copy-button-and-the-search-count-pr-2026-11-17.md), and `017` decision "Each token's name has a copy button" and criterion 4.
- **Re-ran:** each check on a fresh `bun run build`, served with `E2E_PREBUILT=1` and `E2E_PORT=4517`, Playwright's browsers from `/opt/pw-browsers`, on a 4-core machine shared with other worktrees' runs.
  - **Before any probe**, the SHA-256 of `git diff` plus the untracked file's bytes was `878602e8…`, and of `git status --porcelain` `de90d6d4…`. The three files were saved in a tar first.
  - **Seen failing:** `copy-name.svelte` put back to `db8fb65`, then a rebuild. The restated test failed in `chromium-light` and `webkit-light`, **2 of 2**, at `keyboard.spec.ts:1636`, `toHaveAccessibleName`: Expected "Copy --background", Received "Copied". It held "Copied" for all 5 s of retries (13 and 14 polls), so the paused clock works: the reset never ran.
  - **After the fix:** restored from the tar, rebuilt. **2 passed**, both projects.
  - **Under load:** the test, both projects, `--repeat-each=25`, 4 workers, with two `yes > /dev/null` loops beside it. The load average was 5.5 at the start and 12.4 at the end. **50 of 50 passed**, none flaky. The loops were killed after (`pgrep -x yes`: none).
  - **Probes**, from a scratch spec in `tests/e2e/`, deleted after: the status's and the label's every write, the icon's path, focus, the reset, and every button's name against what it copies. Then a mutation of the icon. See "The questions" and finding 1.
  - **The gate**, on the final build:
    - `bun run check` → 0 errors, 0 warnings (2,436 files).
    - `bun run lint` → clean.
    - `bun test ./tests/unit` → 1,977 passed, 0 failed.
    - `tokens.spec.ts` and the keyboard copy test, both projects → **88 passed**.
    - `axe.spec.ts`, "axe finds 0 violations on /foundations/tokens/", at 360, 768 and 1280, both projects → **6 passed**.
    - The page's other suites, both projects, under `bun --bun playwright test`: `tokens-files.spec.ts` (T16, T17) and `specimens.spec.ts:202` → **8 passed**. See finding 2.
  - **Scope:** `static/r` and `static/v0.13.0/r` unchanged by every build (`git status`). `bun scripts/site/thumbnails.ts --hash-only` → "rewritten for 83 items"; `manifest.json` is `dbcb144e…`, the same as `git show db8fb65:…`.
  - **After every probe**, all three files were restored from the tar, the probe deleted, and the site rebuilt. The two SHA-256s match the ones above (`878602e8…`, `de90d6d4…`).
  - Not run: Firefox (not installed), the dark projects, any reader.

## The questions, answered

**1. Does the test fail on the old component, and pass after?** Yes. EXECUTED, above: 2 of 2 failed at the name on `db8fb65`'s component, and 2 of 2 passed on the fix.

**2. Is it flaky?** Not seen. EXECUTED: 50 of 50 under two busy loops. The test installs the clock at a fixed time before the page opens, and pauses it 600,000 ms ahead before Enter. That is the pattern `022v`'s review proved (its finding 1), not the running-clock read that failed there. Nothing reads `Date.now()` in the page first, so `pauseAt` cannot land in the past.

**3. The behaviour.** EXECUTED by the probe, both projects, on a paused clock, unless marked READ.

- **The name stays.** "Copy --background" after Enter, at 1,000 ms, at 1,999 ms and after the reset. A `MutationObserver` on `aria-label` saw **0** writes.
- **The status says "Copied" once.** The observer on the status saw exactly `["Copied", ""]`: "Copied" at the press, "" at 2,000 ms. On the whole page, 1 status holds "Copied" and 0 buttons are named "Copied". The `Status` is rendered empty from the first render (READ), so the region is there before its text changes.
- **The check icon still shows.** The icon's path changes from Phosphor's Copy (`M216,32H88…`) to its Check (`M229.66,77.66l-128,128…`), and back at 2,000 ms. The `svg` is visible and `aria-hidden="true"`. But the test's own icon assertion does not prove this. See finding 1.
- **The clipboard is right.** `--background` for the first role, by keyboard. By mouse, a role's and a primitive's button each put on the clipboard what their names say: the last of the 109 buttons is "Copy #16140F", and the clipboard holds `#16140F`. Every one of the 109 names starts "Copy ", and none is "Copied".
- **A sighted keyboard user still gets feedback.** Focus stays on the button after Enter; it matches `:focus-visible`, with a 2 px solid outline. The icon turns into the check for two seconds, in view. Only the label changed, and the label is not drawn: the button shows the icon alone, before and after (READ). So nothing a sighted person saw is lost.
- **Other users of `copy-name.svelte`:** none. READ, by search: only `src/routes/(site)/foundations/tokens/+page.svelte` imports it, at lines 60 and 79 (the roles and the primitives tables). No registry item imports anything under `src/lib/site/foundations/`. The site's other copy control, `page-tools.svelte`'s "Copy page", already keeps its name and lets its status speak (READ), so the site now has no copy button whose name becomes "Copied" (READ, by search for "Copied" under `src/routes` and `src/lib/site`).
- **The reading of `017` criterion 4 holds.** Criterion 4's second bullet, "Enter on the first sets its name to "Copied"", is the one sentence in `017` that says the name changes (READ). 017a reads it as "sets the status beside it to "Copied", and the button keeps its name", and leaves the landed `017` unedited. That is how `022v` superseded `004`'s three sentences, which its review accepted. The decision "It copies `--<name>` and then says "Copied"" still holds through the status, with one imprecision. See finding 3.

**4. Scope.** A site page only. EXECUTED: `static/r` and `static/v0.13.0/r` are unchanged, and so is the thumbnails manifest. No example's hash walks the tokens page: the page is a Foundations leaf, not `component.svelte` (READ). No changelog line is due: no app installs the part (constitution §6 concerns installed items).

**5. The gate.** Green. See "Re-ran".

## Findings, most severe first

1. **Low (test). The test's icon assertion passes when no check shows** (`tests/e2e/keyboard.spec.ts:1627` and `:1637`). The test compares the `svg`'s `innerHTML` before and after Enter. That markup holds Svelte's hydration comments: before, `<!--[-1--><!--]-->…<!--[4-->`; after the client re-renders the `{#if}` branch, `<!---->`. So any re-render makes the two strings differ, whichever icon is drawn.
   - EXECUTED, a mutation: the `{#if copied}` branch drawing `Copy` instead of `Check`, then a rebuild. The test **passed**, 2 of 2. Its comment says "The check icon still shows", and the specification's check says "the button's icon has changed (the check shows)". Neither is what the assertion proves.
   - The behaviour is right (question 3). The check is weaker than its words.
   - **Fix:** compare the icon's path, not its markup:
     ```ts
     const icon = () => first.locator("svg path").getAttribute("d");
     ```
     EXECUTED, in the probe: this fails on the mutant, 2 of 2 (at `expect(after).not.toBe(before)`), and passes on the fix, 2 of 2.
   - **Optional, as `022v`'s C4 does:** pin the reset while the clock is paused. `await page.clock.runFor(1999)`, then the status still "Copied"; `runFor(1)`, then the status "" and the path back to `before`, with the name still "Copy --background". EXECUTED, in the probe: true in both projects. It would also prove the name is kept for the whole two seconds, not only at the press.
   - **Check:** the restated assertion seen failing on the mutant above, then passing on the fix; and `--repeat-each=25` under load again, since the test changes.

2. **Low (specification). The check names the wrong suite as the page's.** The check says "`tokens.spec.ts` asserts nothing about the copy buttons' names (READ), so it is unchanged and is run as the page's suite." READ: `tokens.spec.ts` tests the `kuiper-theme` item's page (`const PAGE = componentPath("kuiper-theme")`, line 15), and never opens `/foundations/tokens/` (0 matches for "foundations"). The suites that open the tokens page are `axe.spec.ts` (at three widths), `tokens-files.spec.ts` (T16, T17), `specimens.spec.ts:202` (the chips), `error-summary.spec.ts`'s anchor test, `build-output.spec.ts` criteria 3 and 10, and the keyboard test.
   - The landing notes' "88 passed (86 and 2)" is then evidence for the wrong page. EXECUTED: the right suites pass (axe 6 of 6, `tokens-files` and `specimens` 8 of 8), so nothing is hidden; the record is wrong, not the page.
   - `tokens-files.spec.ts` loads only under `bun --bun playwright test`. Under `bunx playwright test` (Node), `src/lib/site/site.ts` imports `package.json` with no import attribute, and the file yields no tests (EXECUTED). This is known (`019a`'s review); it is why a run should name its runner.
   - **Fix:** in "The check", replace the `tokens.spec.ts` bullet with the page's suites by name: `axe.spec.ts` for `/foundations/tokens/`, `tokens-files.spec.ts` and `specimens.spec.ts`'s chips, run with `bun --bun playwright test`. Add their counts to the landing notes beside the existing line, which can stay as the brief's gate.

3. **Note (specification). "It copies `--<name>`" is true of roles only** (fix 5). A primitive's button copies its value: `017`'s own landing notes say so ("A primitive's copy button copies its value … A role's copies `--<name>`"), and EXECUTED: "Copy #16140F" copies `#16140F`. 017a's fix 1 already says "Copy <what it copies>", which is right for both.
   - **Fix, a write-in:** fix 5's last sentence becomes "Its decision "It copies `--<name>` and then says "Copied"" still holds: the status says it. (A primitive's button copies its value, as `017`'s landing notes say.)"

4. **Note (out of scope). A failed copy says nothing** (`copy-name.svelte`, `write()`). With no `navigator.clipboard`, the function returns; on a rejected write, `copied` stays false. Neither the status nor the icon changes. The code block says "Could not copy" (`022v`, criterion 2). This predates 017a and is not asked of it (READ, `db8fb65`). If wanted, a roadmap row for a lane-S small change: the status says "Could not copy", as on the code block.

5. **Note. "Not settled" is accurate.** No reader has heard the fix; that NVDA now says "Copied" once here is INFERRED, as the specification says. A second copy within two seconds is silent, as on the code block and as before (READ). Both agree with `022v`'s review (its question 2c and note 9).

## Constitution checks

- §4.1 source, not a package: met. A site part; nothing an app installs changes. EXECUTED: `static/r` unchanged.
- §4.3 tokens are the one source: met. No colour or size changes (READ).
- §4.4 accessible and proven: partly, as for `022v`. Chromium and Linux WebKit ran; Firefox and the dark projects did not. No reader ran. axe finds 0 violations on the page at three widths in both engines.
- §4.5 and §4.6: met. No dependency is added (READ).
- §5 the small-change track: met. One page, no interface change, no token, no dependency. The check was seen failing first (EXECUTED), and this reviewer wrote neither the change nor its test. The scorecard is deferred to the batch's re-run, as `022v` and `022w` did.
- §6 never: nothing was committed or pushed, and no prior art was copied. No installed app can break: no app installs the part.

## Verdict

**Lands after finding 1.** The fix is right and proven: the name stays, the status says "Copied" once, the check shows, the clipboard is right, focus and the check still tell a sighted keyboard user, and the test is not flaky under load. But its icon assertion does not check what its comment and the specification claim. The fix is one line in the test, already seen failing on the mutant. Finding 2 should go in with it. Finding 3 is a write-in. Findings 4 and 5 are notes.

## Disposition

By the design lead, 2026-11-17. Finding 1: the icon check now reads the first path's `d`, as the review gave. Finding 2 and note 3: written into the spec. Note 4 (a failed copy says nothing here) is queued as a roadmap row. **Closing verdict: lands.**

