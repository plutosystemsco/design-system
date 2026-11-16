# 022t build notes

- **Specification:** `022t`, the error summary speaks again on an unchanged submit (lane I).
- **Date:** 2026-11-16
- **Built by:** the lane-I builder, in the worktree `lane-i-attempt`, from `release/0.13.0` at `b01e754`. Nothing is committed.
- **Engines here:** `chromium-light` and `webkit-light`, browsers from `/opt/pw-browsers`. Firefox is not installed. Every e2e and dry run served the built site on port 4391 (`E2E_PORT`), with `E2E_PREBUILT=1` after its own `bun run build`.

These notes are the raw material for the specification's Landing notes. They are not the Landing notes.

## Seen failing first

Each check was written first and run on the base's item (`b01e754`). The keyboard example and the test view already passed `attempt`, which the base's item spread onto its root as an attribute.

| Check | Run on | Result |
| --- | --- | --- |
| Criterion 1, the keyboard example's second submit | base item | **Failed**, 2 of 2 engines: `[]` content-node swaps, wanted `[{ added: 1, removed: 1 }]` ("no content node added or removed") |
| Criterion 2, typing in the example (guard) | base item | Passed, 2 of 2 |
| Criterion 3, typing 5 letters in Notes (guard) | base item | Passed, 2 of 2: 0 records in A |
| Criterion 3, A's second submit | base item | **Failed**, 2 of 2: `[]` swaps, as criterion 1 |
| Criterion 4, the four client paths | base blocks | **Failed**, 4 of 4 paths × 2 engines: "one content node added (focus-root)", 0 added |
| Criterion 4, the three server paths | base blocks | Passed, 3 of 3 × 2 engines, as the spec expects |
| Criterion 6, `/view/sign-in/errors/` | base item | **Failed**, 2 of 2: "the old content node is connected" |
| Criterion 7, `019`'s 19 tests, with the new example | base item | Passed, 19 of 19 × 2 engines |
| Criterion 8, the dry fact "the old content node is disconnected" | base item, `SR_DRY=1` | **Failed** in `chromium` and `webkit`: that fact alone; the focus fact held. The other 2 tests passed. |
| Criterion 9, the new `registry.test.ts` checks | today's files | **Failed**, 4 of 4: the three "Your part" lines, and the header comment |
| Criterion 12, the new changelog checks | today's changelog | **Failed**, 2 of 2: 0 bullets |

## Mutations

| Mutation | Check | Result |
| --- | --- | --- |
| `{#key errors}` in place of `{#key attempt}` | Criterion 3, the typing | **Failed**, both engines: 10 records in A for 5 letters (the guard needs at least 5) |
| `attempt += 1` moved after `await tick()` in `failed()` of `sign-in-form`, `sign-up-form`, `sign-up-verify` and `settings-form`, and in `settings-delete`'s `catch` | Criterion 4, the seven paths | **Failed**, 7 of 7 × 2 engines. Client paths: `focus-root,add` (added after the focusin). Server paths: `add,focus-root,add` (two added) |

Each mutation was restored from a copy, and the restored files were checked by `grep` before the next build.

## The built change

- 60 of 60 passed in the first run after the build: `error-summary.spec.ts`'s `019` and `022t` describes and `blocks.spec.ts`'s `022t` describe, both engines.
- `{#key attempt}` wraps the content node alone. The root, the icon and `bind:ref` sit outside it.
- `bun run cost --sizes-only`: `error-summary` JS 11,816 → 11,872 B gzipped (brotli 10,507 → 10,672), CSS 891, unchanged. The budget is 12,900. `sign-in` 22,114 → 22,030 B, `sign-up` 29,636 → 29,726 B, `settings` 40,631 → 40,702 B; the catalogue was rewritten too. 4 items were size-stale; 16 runtime-stale figures were kept, as `--sizes-only` does.

## Patches 4 and 7b

Re-made by decision 11's procedure: `prettier --write`, `git add` of the built item, the one edit by hand inside the key block, `git diff` into the patch, `git checkout --`, then `git reset` to unstage. The index is left clean.

- The base's two patches fail on the built item: "patch failed: … error-summary.svelte:141", "patch does not apply".
- `git apply --check` passes for each of the 11 patches alone, and for each set together (`main`, `double-read`).
- `bun test tests/unit/mutations.test.ts`: 29 pass, 0 fail. Both `expected.json` are unchanged and still derived.

## Ledger files

Updated one at a time, in this order:

1. `bun run build`: `static/r/styles/maia/` and `static/v0.13.0/r/styles/maia/` changed for `error-summary`, `sign-in`, `sign-up` and `settings`, 8 files. `registry.json` did not change.
2. `bun run cost --sizes-only`: `scripts/cost/report.json`. `budgets.json` did not change.
3. `bun scripts/site/thumbnails.ts --hash-only`: "manifest rewritten for 83 items". Four source hashes moved: `error-summary`, `sign-in`, `sign-up` and `settings`. No picture changed. `bun test tests/unit/thumbnails.test.ts`: 10 pass, 0 fail.
4. `CHANGELOG.md`: decision 12's two bullets, after the 0.13.0 entry's last bullet.

## Gates

| Gate | Result |
| --- | --- |
| `bun run check` | 2,434 files, 0 errors, 0 warnings |
| `bun run lint` | All matched files use Prettier code style (re-run after these notes were written) |
| `bun scripts/lint-literals.ts` | 0 literals in registry item files; 1 allowance (`liquid-glass`, unchanged) |
| `bun test ./tests/unit` | 1,913 pass, 2 skip, 0 fail, across 68 files. `highlight-session.test.ts` passed on the first run. |
| `error-summary.spec.ts` and `blocks.spec.ts`, whole, `chromium-light` and `webkit-light`, `--repeat-each=2` | 324 passed, 0 failed |
| The item's and the blocks' tests in `keyboard`, `primitives`, `axe`, `theme` and `viewer` specs (the test view's axe and theme checks among them), both engines, `--repeat-each=2` | 408 passed, 0 failed |
| Dry speech run, `chromium`: `error-summary`, `sign-in`, `sign-up`, `settings` `.sr.ts` | 15 passed (error-summary 3 of 3) |
| Dry speech run, `webkit`: the same four | 15 passed (error-summary 3 of 3) |
| `bun run cost --only error-summary`, first run | Noisy (floor 201.7 ms against 128 + 15 %). `hydrateMs` 54.8 against 53: reported "over budget, not held". |
| `bun run cost --only error-summary`, second run | Noisy (floor 194.9 ms). 0 over budget: hydrate 35.7 ms (spread 30.8 to 55.2) against 53; the click interaction 38.8 ms (37.1 to 41.1) against 59. Sizes as above. |
| `bun scripts/site/release-check.ts --before-ci` | Exit 0; four checks skipped as `--before-ci` skips them |
| `bun test tests/unit/cost.test.ts`, after the sizes-only report was restored | 40 pass, 0 fail |

The runtime figures are not held. After each `--only` run, `scripts/cost/report.json` was put back to the `--sizes-only` copy, so the ledger holds sizes from this build and the base's runtime figures.

## Decision 11's lane-E small change

Not built, as briefed. Its condition is not met. It is raised only if a `double-read` dispatch shows 7b's "the second submit, unchanged" entries not faulting L3. No such dispatch has run: it needs CI, after landing.

## Choices the specification did not state

1. **The test view.**
   - Field ids are `attempt-name` and `attempt-notes`. Notes is a `Textarea`.
   - The messages: "Enter a name" while Name is empty, and "Check your notes before you send them", always there.
   - The derivation reads every field by building `{ name, notes }` inside `$derived`; `validate` returns a new array each call. The `{#key errors}` mutation's 10 records show the view is not blind.
   - The summaries are told apart by `data-testid="summary-a"` and `"summary-b"`, and by their titles, "There is a problem (A)" and "There is a problem (B)", so the page has no two identical headings. No inline field errors are rendered.
2. **Criterion 3's summary B.** B first appears on the first submit. The check takes B's content node after that submit and shows that the same node stays through the typing and the second submit.
3. **Criteria 1, 3 and 6's watch.** A `MutationObserver` on the root with `childList`, `subtree`, `attributes` and `characterData`. A `focusin` listener counts only events whose target is the root. Records still queued when the watch stops are taken with `takeRecords()` and counted.
4. **Criterion 4's mutation, applied in one build.** The spec says "for each of the four forms in turn". The five mutations were applied together, in one build. Each path exercises one component only, so each path's result is what that component's mutation alone gives.
5. **Criterion 12's check.** A new `registry.test.ts` describe holds the two bullets: one each, the blocks bullet right after the item's, the item's bullet not marked an interface change, and each `add` command named.
6. **Criterion 9's header-comment check** reads the first HTML comment after the item's last `</script>`.
7. **The page.**
   - "Heard with VoiceOver on macOS. NVDA and JAWS are not tested." is kept unchanged, as the last line of "What Kuiper provides".
   - The duty reads "On each failed submit, raise `attempt` by one, …", lower case, so it holds criterion 9's "raise `attempt`".
   - `019`'s sentences that named the app's duties moved into "Your part": focus after every failed submit, `role`, the sticky header, the checkbox question, `titleFor`. "Pass `announce={false}` for a summary in the page at load" was added there, from decision 9's list.
8. **The doc comment** is decision 1's 37 words, in a multi-line `/** … */`.
9. **`settings-delete`.** `attempt += 1` sits right after `message = FAILED`, before `text = FAILED` and `await tick()`.
10. **Comments.** Each of the five components and the example says why it keeps the counter, in one comment beside `let attempt = $state(0)`.
11. **The speech test.** The two facts are recorded after the second submit's `sr.after`, before `judge`. The file's header comment says what a dry run now checks.

## Left for the landing

- The specification's Status line ("built; awaits the speech run") and its Landing notes. The specification is untracked in the main checkout, outside this worktree, so this build did not edit it.
- Criterion 14, the next CI `matrix` push run, and the next `mutate` dispatch of each set.
- Criterion 15, the scorecard re-run.
