# 024i — An all-digit commit hash is still a commit

- **Status:** built and reviewed (lands); re-applied alone 2026-11-17, without `019d` ("Re-applied alone", under Landing notes). Lanes S (`vite.config.ts`) and I (the app-shell page).
- **Date:** 2026-11-17
- **Author:** a lane-I builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency). It changes no shipped item. It touches the site's `vite.config.ts` and the lines the app-shell page tells an app to copy, which are one fix in two copies. No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `006` (decision 8, the guarded `vite.config.ts` lines; decision 16, the site takes the same form).
- **Found by:** `019b`'s change review, finding 1, option (a) ([`../reviews/019b-the-error-summarys-messages-are-read-once-pr-2026-11-17.md`](../reviews/019b-the-error-summarys-messages-are-read-once-pr-2026-11-17.md)).

## The defect

The footer's commit is SvelteKit's version name. Without one, SvelteKit names the build with a timestamp, all digits. So five readers take an all-digit name as "no commit" and show no commit row: the app-shell and product-home blocks, the site's footer, the app-shell preview and the marketing-footer composition (READ, `/^\d+$/.test(version)`).

The name is made from `git rev-parse --short HEAD`, or the host's `WORKERS_CI_COMMIT_SHA` cut to 7. A short hash can be all digits: `6482736`, `020d`'s commit, is one. The odds are (10/16)^7, 3.7 % of commits. The review counted 11 of 234 in this repository. Such a build hides its commit, and app-shell's A3 fails on it (EXECUTED by the review).

The app-shell page tells apps to copy the same lines. So an app's footer hides about one commit in 27 too.

## The fix

1. **Where the name is made.** A helper, `commitName(sha)`, takes a full hash's first 7 characters, or more until one is a letter. The full hash at worst, which is all digits in fewer than one commit in 10^8. With no hash it gives nothing, as before, so SvelteKit's default and "no commit" still follow.
2. **Both copies.** The site's `vite.config.ts` and the app-shell page's snippet hold the same helper and call it on `WORKERS_CI_COMMIT_SHA ?? git("rev-parse HEAD")`. The host's variable still wins over git. The page's text adds one sentence: `6482736` is named `648273658d`, not hidden.
3. **Why here, not in the readers.** This is the least change.
   - The readers' contract stays: all digits means SvelteKit's default. No shipped block changes, so no app must re-install one, and `static/r/` does not move for it.
   - Changing the readers (the review's option (b)) edits two shipped blocks and three site readers. And a reader cannot tell a 13-digit timestamp from a 13-character all-digit hash, so it only moves the edge.
   - "Always use 12" changes every commit's name, and 12 digits still happen (0.4 %).
4. **What changes for a normal commit.** Nothing in this repository: `--short` gave 7 characters here, and a hash with a letter in its first 7 keeps 7 (`db8fb65` builds as `db8fb65`). In a repository big enough for git to choose 8 or more, the name is now 7 plus what a letter needs. The footer shows a name, not a unique key.
5. **What an app must do.** An app that copied the old lines keeps the defect until it copies the new ones. So `app-shell`'s bullet in the 0.13.0 entry's first part gains one sentence saying so, before its pointer to "Also since 0.11.0" (`020d` decision 3). No item's interface changes.

## The check

- **A new unit test,** `tests/unit/commit-name.test.ts`. It runs each source's own lines, the config's and the page snippet's, with the host's variable and git stubbed (`rev-parse HEAD` the full hash, `rev-parse --short HEAD` its first 7). Then the blocks' own reader line, read from both shipped blocks, reads the name. It checks:
  - `648273658dc0…`, from git or from the host, gives a name that starts `6482736`, which both blocks show;
  - the name is `648273658d`;
  - `db8fb65…` keeps 7;
  - the host's variable wins over git;
  - 40 digits give the full hash;
  - no git and no variable, or an empty one, give no name, and both blocks read SvelteKit's timestamp as no commit.
- **The e2e evidence,** run, not committed: a build with `WORKERS_CI_COMMIT_SHA` set to `6482736`'s full hash, then `blocks.spec.ts` A3. Workers CI names its build through that variable; the GitHub `matrix` build uses git (the change review, note 4).

## Landing notes

Built 2026-11-17 by a lane-I builder, in the worktree `lane-i-run8`, at `db8fb65`. Not committed. Built after `019d` in the same worktree; the gate ran once for both (see `019d`'s landing notes, "The gate", as reviewed in commit `c51b65b`). `vite.config.ts` is lane S's file; `lane-s-run8` had not touched it (READ, its `git status`).

### Seen failing first (EXECUTED)

- **The unit test, on the old lines:** 8 of 13 failed, the same four in each copy. The name was `6482736`, which both blocks read as no commit; "takes characters until one is a letter" and "the host's variable wins" got `6482736`; "the full hash" got `1234567`. The five that passed are the cases the fix must keep: the readers found, `db8fb65` keeps 7, and no name without git.
- **A3, on a build named `6482736`:** `build/_app/version.json` read `"6482736"`. A3 failed in `chromium-light` and `webkit-light`, 2 of 2: "`dd code` Expected: 1, Received: 0".

### After the fix (EXECUTED)

- The unit test: 13 of 13.
- **A3, on a build with the same variable:** `version.json` reads `"648273658d"`. 2 of 2 passed.
- **A normal build** (no variable): `version.json` reads `"db8fb65"`, as before. A3 passed in both projects in the gate's run.

### The ledgers (EXECUTED)

- `bun run build`: nothing in `static/` changed for this change. No shipped item changed.
- `bun run cost --sizes-only` and `bun scripts/site/thumbnails.ts --hash-only`, run once with `019d`: no figure or hash moved for this change. The app-shell page's text is not in its thumbnail's hash.
- **The scorecard** is not re-run for this change alone. It follows the batch's re-run when these land.

### Not settled

- **Apps on the old lines.** Nothing reaches an installed app (constitution §4.1). The changelog sentence is how one learns of it.

### The change review (2026-11-17, written in by the design lead)

`reviews/019d-024i-the-long-message-and-the-digit-hash-pr-2026-11-17.md`: lands. Finding 3, ruled: a small change, though it touches `vite.config.ts` and the app-shell page. One helper in two copies, byte-identical, with no item, prop or registry file changed; the rule's "one item or one page" is read as one behaviour in one place an app copies from, and lane S's build that ran at the same time touched neither file. Notes 6 and 7 stand as facts: a name of 30-odd leading digits overflows the footer at 320 (about one commit in 1.3 million), and an empty `WORKERS_CI_COMMIT_SHA` still gives no name. The page's missing space before `version` is fixed (note 8): in `c51b65b` it was not, since Prettier joins "reads" to the `<code>`; the re-application puts `<code>version</code>` on the next line, so the space is a line break.

### Re-applied alone, 2026-11-17

- **Why.** `c51b65b` landed `019d` and `024i` together. `019d` styled `019b`'s links box, and `019e` reverts `019b` to the list markup (the design lead's ruling, [the eighth matrix run](../research/2026-11-17-the-eighth-matrix-run.md) §11, option (a)). **`019d` is held back, to be rebuilt on the list markup.** `024i` touches no error-summary file, so it is re-applied alone.
- **What was taken from `c51b65b`:** `vite.config.ts`'s `commitName`; the app-shell page's snippet and sentence; `tests/unit/commit-name.test.ts`; this specification; the shared change review; the sentence in `app-shell`'s changelog bullet, before its pointer. The code, the test and the sentence are `c51b65b`'s, byte for byte, but the page's space (note 8, above).
- **What was left out, all `019d`'s:** the item's `wrap-anywhere`, its e2e test, its specification, its changelog sentence, the regenerated patches 4 and 7b, the error-summary page's "own row" line, and the ledgers' moves. The roadmap's two rows are the design lead's to update.
- **Built** by the lane-I builder in `.claude/worktrees/integrate` (branch `integrate-run8`), on `019e`. "Built after `019d` in the same worktree", above, describes the first build; its gate is now this one.
- **Seen failing first, again (EXECUTED):** `commit-name.test.ts` on the old lines of both copies: 8 of 13 fail, the same four per copy, as before. On the new lines: 13 of 13.
- **A3 on an all-digit hash (EXECUTED):** a build with `WORKERS_CI_COMMIT_SHA` set to `6482736`'s full hash: `version.json` reads `"648273658d"`, and A3 passes in `chromium-light` and `webkit-light`, 2 of 2. A normal build reads `"258e5c7"`, `019e`'s commit.
- **The ledgers:** `bun run build` changes nothing in `static/`; `bun run cost --sizes-only` says "every figure is fresh"; `thumbnails.ts --hash-only` rewrites the manifest with no change.
- **The gate, on `019e` and this together (EXECUTED):**
  - `bun run check`: 0 errors, 0 warnings, 2,437 files. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals, 1 allowance.
  - `bun test ./tests/unit`: 2,000 pass, 0 fail, 70 files. The highlighter's streaming test, alone: 10 pass, best p95 4.05 ms.
  - `mutations.test.ts`: 29 pass; patches 4 and 7b apply to the list-era item. `release-check.ts --before-ci`: exit 0.
  - `chromium-light` and `webkit-light`: `error-summary.spec.ts` and `blocks.spec.ts`, 162 pass, A3 among them; axe and keyboard, the error-summary tests, 12 pass.
  - The dry runs (`SR_DRY=1`), `chromium` and `webkit`: error-summary, sign-in, sign-up, settings and app-shell, 40 pass.
