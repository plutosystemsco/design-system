# Review of 022t — the error summary speaks again on an unchanged submit

- **Date:** 2026-11-16
- **Status:** dispositioned; lands
- **Reviewer:** a reviewer; not the author of the specification or the build
- **Reviewed:** the uncommitted diff in the worktree `lane-i-attempt`, on `release/0.13.0` at `b01e754`, with its untracked test view and the builder's evidence, `context/notes-022t-build.md`. Against [022t](../specifications/022t-the-error-summary-speaks-again-on-an-unchanged-submit.md) (fit to build, with the owner's three answers), its spec review and two re-checks, and [the memo](../research/2026-11-16-error-summary-re-announcement.md).
- **Re-ran:** each e2e and dry run on a fresh `bun run build`, served with `E2E_PREBUILT=1` on port 4471. Browsers from `/opt/pw-browsers`.
  - **Before the first probe,** the SHA-256 of `git diff` was `69997b35…` and of `git status --porcelain` `a91089b1…`. Every changed and untracked file was copied to a scratch archive.
  - **A fresh build** of the builder's tree left both hashes unchanged, so `static/r/` and `static/v0.13.0/r/` are this source's.
  - `error-summary.spec.ts` and `blocks.spec.ts`, whole, `chromium-light` and `webkit-light` → **162 passed**, 0 failed.
  - The dry speech run, `SR_DRY=1`: `error-summary`, `sign-in`, `sign-up` and `settings` `.sr.ts` → **15 of 15 passed** in `chromium`, and 15 of 15 in `webkit`.
  - **Three reverts,** one at a time, each rebuilt, each restored from the archive (see "Seen failing").
  - **Two order mutations,** each on one component alone (see "The order").
  - **Probes** on the built site, from scratch scripts (Chromium, and WebKit where stated):
    - the DOM of every summary on three pages, on the base item and the built one;
    - a temporary view, `/view/zz-rv-probe/`, holding a summary with `announce={false}` and `attempt`, beside one with neither. It was deleted, and the site rebuilt.
  - **Patches 4 and 7b,** each applied with `git apply`, built and probed, then reversed with `git apply -R`. After each reversal the item's blob is `b634cd4` again.
  - `bun run check` → 2,434 files, 0 errors, 0 warnings. `bun run lint` → clean. `bun scripts/lint-literals.ts` → 0 literals, 1 allowance (`liquid-glass`). `bun test ./tests/unit` → **1,913 passed**, 2 skipped, 0 failed, across 68 files. `highlight-session.test.ts` passed on the first run. `bun scripts/site/release-check.ts --before-ci` → exit 0, its four skips as `--before-ci` gives them.
  - `bun run cost --sizes-only` → "every figure is fresh", and `report.json` byte for byte the builder's.
  - `bun run cost --only error-summary`, twice. The first try was killed (exit 137) when the container restarted. Then two full runs, both noisy (floors 161.8 and 175.8 ms against 128 + 15 %), 0 figures over budget in either. In the second: hydrate 44.1 ms (spread 35 to 53.8) against 53; the click 40.3 ms (39.2 to 41.2) against 59. `report.json` was restored after each run.
  - `bun scripts/site/thumbnails.ts --hash-only` → the manifest byte for byte the builder's.
  - **The container restarted mid-review.** Afterwards, every changed and untracked path in the worktree was compared with the builder's saved commit, `d7400b4` on `origin/claude/elegant-brown-vrunf7` (`git show FETCH_HEAD:<path> | cmp - <path>`). All were the same. So were the spec, its review and the memo in the main checkout.
  - **After the last run,** both hashes are again `69997b35…` and `a91089b1…`.
  - **Not run:** Firefox (not installed); `webkit-dark` and the dark projects; any reader; the full e2e suite; `primitives`, `keyboard`, `axe`, `theme` and `viewer` specs (criteria 7 and 10 are READ from the build notes); the `{#key errors}` mutation of criterion 3 (READ from the notes).

## Seen failing

Each revert put one part back to `b01e754` and rebuilt. Then it ran the `022t` describes of both e2e files, in `chromium-light` and `webkit-light`.

| Reverted | Failed, in both engines | Passed, in both engines |
| --- | --- | --- |
| The item | 1 ("one callback, removing one content node and adding one"); 3, at A's second submit (the typing part passed); 4, the four client paths ("one content node added (focus-root)"); 6 ("the old content node is connected", Received `true`). Dry run: the second-submit test, on the fact "the old content node is disconnected" alone. | 2; 4, the three server paths. Dry run: the insertion and the links. |
| The five components | 4, the four client paths; 6 | 1, 2, 3; 4, the three server paths |
| The keyboard example | 1. Dry run: the same one fact. | 2, 3, 6 |

This is what the build notes record. Criterion 6 fails with the components reverted as well as with the item, since `sign-in-form` raises the counter there. The notes list it only under the item. EXECUTED.

## Acceptance criteria against evidence

1. **The second submit inserts a new content node** — met. EXECUTED: passes on the build, fails on the reverted item and the reverted example. READ: the test checks (a) to (f), counting only content nodes in `childList` records. The probe saw the root's records arrive added, then removed, in both engines (EXECUTED).
2. **Typing re-renders nothing, in the example** — met, a guard. EXECUTED: passes on every revert, as a guard should.
3. **Re-derived errors re-render nothing; a new attempt does** — met. EXECUTED: passes on the build; A's second submit fails on the reverted item. READ: the view builds `{ name, notes }` inside `$derived`, so typing in Notes re-derives. The `{#key errors}` mutation's 10 records are READ from the notes. On B, see finding 2.
4. **Each block's failure is one insertion, before focus** — met. EXECUTED: 7 of 7 paths pass in both engines. The client paths fail on the reverted components; the server paths pass there, as the specification expects. READ: the observer is on the block's scope with `subtree`, and the `focusin` filter matches the root.
5. Merged into 4.
6. **A summary present at load is announced on the first client failure** — met. EXECUTED: passes on the build; fails on the reverted item and on the reverted components.
7. **Nothing else about the item moves** — met in the two files run. EXECUTED: `019`'s 19 tests pass in both engines. `primitives.spec.ts` and `keyboard.spec.ts` are READ from the notes (408 passed).
8. **The dry speech run** — met. EXECUTED: 15 of 15 in each engine; the fact is seen failing on the reverted item and the reverted example.
9. **The registry and the docs** — met. EXECUTED: the unit suite passes, `registry.test.ts`'s new checks and `mutations.test.ts` among them. The built page's API table reads "attempt · number · The count of failed submits. …". The view guard names the test view (READ).
10. **axe on the test view** — READ from the notes: in `TEST_VIEWS`, and its axe and theme checks passed. Not re-run here.
11. **Cost** — met. EXECUTED: sizes fresh; JS 11,872 B against 12,900; `--only error-summary` 0 over budget, its runs noisy, so the runtime figures are not held.
12. **The changelog** — met. READ: both bullets are decision 12's words exactly, after the entry's last bullet. EXECUTED: the changelog tests pass. See finding 1.
13. **The gates** — met. EXECUTED, above.
14. **The next CI speech run** — open, as the specification says. It needs CI after landing.
15. **The scorecard** — open; it runs after landing.

## The questions, answered

**1. Do the tests fail on the old code?** Yes, as the notes say. See "Seen failing". EXECUTED.

**2. The order.** In all seven paths, `attempt` is raised before `await tick()` and the focus move. READ:
- The four forms set `errors` and `formError`, then call `failed()` with no `await` between. `failed()` sets `announce` and `attempt`, then awaits `tick()`, then focuses. That holds on all three paths of each form: the client check, the throwing callback and the refusal.
- `settings-delete` sets `message`, raises `attempt`, sets `text`, then awaits `tick()`.
- The example raises it after its `links.length` check, before `tick()`. The test view raises it before `tick()`.

The builder applied the five order mutations in one build. Two of them, each on its own, show that this was equivalent. EXECUTED:
- `sign-in-form` alone: exactly sign-in's two paths fail, in both engines. The empty path logs `focus-root,add`; the refused path logs `add,focus-root,add`. The other five pass.
- `settings-delete` alone: only the delete path fails (`add,focus-root,add`), in both engines.

So each path reads only its own component.

**3. Undefined `attempt`.** No change for an app that never passes it.
- EXECUTED: the variants example, which passes no `attempt`, renders identical DOM on the base item and the built one, comments aside.
- EXECUTED: on the probe view, a summary with no `attempt` kept its content node when its errors were re-derived (0 records) and when its message changed (one `characterData` record, as today).
- READ: `{#key undefined}` never changes, and the prop is taken out of `restProps`, so it no longer reaches the root.

**4. `announce={false}`.** The content renders anew with no role. EXECUTED, in Chromium and WebKit, on the probe view: one raise swapped the content node. The old node was disconnected. The only `role` left in the summary was the icon's `img`, outside the content. The root's attributes were `data-slot`, `data-variant`, `class` and `tabindex`. This is decision 3's rule and the page's "renders the content again in silence".

**5. Patches 4 and 7b.**
- **They apply.** EXECUTED: each of the 11 alone, and each set together. The base's patch 4 now fails ("patch failed: … :141"). The patches name the built item's blob, `b634cd4`.
- **Each still breaks what its entry expects.** EXECUTED, on a build of each, on the keyboard example:
  - Patch 4: no `role="alert"` anywhere, on the first submit or the second. So "the insertion" and "the second submit, unchanged" are both silent under it: L1.
  - Patch 7b: `role="alert"` is on the root, and the content has none. On the second submit the content node is replaced inside an alert root that stays, and focus lands on that root.
  - So 7b's second-submit L3 entries depend on how readers treat a subtree inserted into a live alert. That is decision 11's INFERRED case, for the next `double-read` dispatch.
- **`mutations.test.ts`:** 29 pass, 0 fail. `bun tests/sr/mutations/write-expected.ts` leaves both `expected.json` unchanged. EXECUTED.

**6. The doc comment, the page, the changelog.**
- The doc comment is decision 1's text, 37 words, opening with the noun phrase "The count of failed submits". READ, counted.
- The page splits "What Kuiper provides" and "Your part", in the same markup as `search-field`'s. Decision 9's three new sentences are there word for word, and so is the "dos" line. `019`'s sentences are all kept, sorted between the two. "Heard with VoiceOver on macOS. NVDA and JAWS are not tested." is unchanged. READ.
- The changelog bullets are exact. READ.

**7. The ledgers.** All fresh. EXECUTED:
- `static/r/` and `static/v0.13.0/r/` match a fresh build, eight files for the four items, and `registry.json` is unchanged.
- `cost --sizes-only` reports every figure fresh.
- The thumbnails manifest is rewritten byte for byte. Four hashes moved: `error-summary`, `sign-in`, `sign-up` and `settings`. No picture changed.
- `error-summary` JS is 11,872 B against its 12,900 B budget.

**8. Scope.** Nothing outside Scope "In" is touched. READ, the file list:
- the item;
- the five components;
- the example and the page;
- the test view, `pages.ts` and `blocks.test.ts`;
- the three test files and the two patches;
- `registry.test.ts`;
- the ledger files.

The one other file is the builder's evidence, `context/notes-022t-build.md`. It is raw material for the Landing notes, and should not land as its own file (see "Before landing").

**9. The gate.** All green. See "Re-ran".

## Findings, most severe first

1. **Low. "Each brings the new `error-summary`" holds only if the app accepts the overwrite** (`CHANGELOG.md`, the blocks bullet).
   - The blocks list `error-summary` as a registry dependency (READ, `static/r/styles/maia/sign-in.json`). But the CLI asks before it overwrites a file that exists, and `/start/install/` says to update with `-o` (READ).
   - An app that updates `sign-in` and keeps its own `error-summary` (because it said no, or edited the item) gets an attribute, not the fix. The old item spreads `attempt` onto the root. EXECUTED: the base item under the new blocks renders `attempt="0"` on the root of `/view/sign-in/errors/`. Nothing errors, and nothing is announced again.
   - **Fix:** in the blocks bullet, end with "…; each brings the new `error-summary`, which must be overwritten too." Or keep decision 12's words, and have the design lead record in the Landing notes why not. `registry.test.ts`'s check reads only the bullet's opening and its `add` commands, so either passes.
2. **Low. Criterion 3's text about summary B cannot be checked as written** (the specification, criterion 3: "In summary B … both submits keep the same content node").
   - B first appears on the first submit, so there is no node to keep before it. The test takes B's node after the first submit, and shows it stays through the typing and the second submit. READ; the builder's choice 2 says so.
   - **Fix:** the Landing notes restate criterion 3's last sentence as "B's content node, from the first submit, is the same after the typing and the second submit". No code change.
3. **Low. The product text says a reader announces it again, before any reader has heard it.**
   - Three places say so: the keyboard example's intro ("Submit it again unchanged, and the summary is announced again"), the doc comment and the item bullet.
   - Criterion 14 is the first time it is heard. Risks 1 and 2 are stated in advance, and the owner chose to keep `022t` landed if it fails (open question 3).
   - The words are the specification's own, so this is not a build fault. Constitution §2.5 holds the release anyway.
   - **Fix:** in the Landing notes, add one line to criterion 14's failure branch: if it fails, the example's intro, the doc comment and the changelog say what the item does ("renders the content anew"), not what a reader does, until the probe settles it.
4. **Note. Patch 7b's second submit is a new subtree in a live alert, as decision 11 predicts.** EXECUTED, the DOM above. No action now. The next `double-read` dispatch decides whether the lane-E small change is raised.
5. **Note. The builder's notes list criterion 6's failure only under the reverted item.** It also fails with the components reverted, since `sign-in-form` raises the counter. EXECUTED. Record both in the Landing notes.

## Constitution checks

- **§4.1, source, not a package:** met. READ.
- **§4.3, tokens are the one source:** met. No class or size is added. EXECUTED: `lint-literals`.
- **§4.4, accessible and proven:** partly, as the specification plans.
  - Chromium and Linux WebKit were run.
  - Firefox and the dark projects were not; CI runs them.
  - The speech outcome waits on criterion 14 (finding 3).
- **§4.5 and §4.6:** met. No dependency changes. READ.
- **§5:**
  - The specification had research, a spec review and two re-checks before the build.
  - Each new check was seen failing on the base (EXECUTED).
  - The reviewer wrote neither the specification nor the build.
  - The scorecard re-run is criterion 15, after landing.
- **§6:**
  - Nothing was committed or pushed.
  - No prior art was copied.
  - The prop is additive. An app that never passes it sees no change (question 3, EXECUTED).

## Before landing

- The specification's Status reads "built; awaits the speech run". Its Landing notes take the build notes' tables, this review's runs, findings 1 to 3 dispositioned, and the owner's three answers.
- `context/notes-022t-build.md` is folded into those Landing notes, not landed as its own file.

## Verdict

**Lands.** No finding blocks it. Findings 1 to 3 are a word in the changelog and two write-ins to the Landing notes. Findings 4 and 5 are for the dispatch and the notes.

## Disposition

By the design lead, 2026-11-16.

1. Fixed: the blocks' changelog bullet, and decision 12's copy of it, say the new `error-summary` must be overwritten too. `registry.test.ts` passes, 116.
2. Recorded: criterion 3's restatement is in the spec's Landing notes.
3. Recorded: the three sentences' fate on a failed criterion 14 is in the Landing notes.
4. Noted: the next `double-read` dispatch decides decision 11's lane-E small change.
5. Recorded: criterion 6's second failing revert is in the Landing notes.

The builder's notes are folded into the spec's Landing notes, and the Status reads "built; awaits the speech run".

**Closing verdict: lands.**

