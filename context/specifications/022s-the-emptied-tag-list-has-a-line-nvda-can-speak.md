# 022s — The emptied tag list has a target NVDA can speak

- **Status:** built 2026-11-16; change-reviewed ([`../reviews/022rs-the-search-field-and-tag-list-speech-fixes-pr-2026-11-16.md`](../reviews/022rs-the-search-field-and-tag-list-speech-fixes-pr-2026-11-16.md): does not land yet, 1 Medium, 4 Low, 1 note); findings 1, 2, 4 and 5 fixed; waits for the review's re-check. Lane I.
- **Date:** 2026-11-16
- **Author:** a lane-I builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one item). No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`; `027` (batch A, whose `027b` is the tag); `022r`, built before it in lane I.
- **Found by:** the first speech run, T3, explained by [the first speech verdicts](../research/2026-11-16-the-first-speech-verdicts.md), §7 (Family F). The memo was untracked in the main checkout when this was written.

## The defect

When every tag is removed and there is no `fallback`, focus goes to the list. `027` chose that target (decision 6; `TagGroup`'s doc comment: "the list itself takes focus, and its name is spoken"). Its table expects "Filters, list" from NVDA. NVDA said "blank" in both NVDA pairs; both VoiceOver pairs passed (READ, the memo).

The dry run confirms focus is on the list named "Filters" (EXECUTED by the memo). NVDA's browse-mode buffer renders nothing for an empty list, so its caret lands on a blank line (INFERRED, the memo). Test 38a below shows the engine's side (EXECUTED, Chromium's own tree): the focused, emptied list has no text in it.

## The fix

1. **Where focus goes is kept.** `027`'s order stays: the next control, the previous, `fallback`, then the list. A new target would break the doc comment's promise and `027`'s table. The list has no neighbour of its own to move to.
2. **The emptied list renders its name.** The list gets two classes: `not-has-[>*]:before:sr-only not-has-[>*]:before:content-[attr(aria-label)]`, which Tailwind compiles to `:not(:has(> *))::before`. While the list holds no element, its `::before` holds its `aria-label` as text, visually hidden. Browsers expose generated text in the accessibility tree; Chromium puts it in a generic node holding the text "Filters" (EXECUTED, test 38a). So a browse buffer has a line to put the caret on, and the line says the list's name.
3. **Why this and not an element.** It is the least change:
   - **No new element.** An `<li>` would make "0 items" read "1 item" in VoiceOver, and the list would hold an item that is not a tag.
   - **No new string.** The words are the name the app already gave.
   - **No script, and no new prop.** No prop, slot, string or context changes.
   - **Only while it holds no element.** The rule reads element children, not nodes. Svelte's comment anchors do not count. Neither does a space: an app that writes two blocks in the list (`{#each}` then `{#if}`) compiles to a space between their anchors (EXECUTED by the review, Svelte 5.57). `:empty`, this change's first form, failed there: one space turned it false (EXECUTED by the review; and by 38a, below). The registry already uses `:has()` (`table-head`, `table-cell`, `toaster`).
4. **What it does not cover: `aria-labelledby`.** A list named by `aria-labelledby` has no `aria-label` to show, so it renders nothing, and NVDA still says "blank". Every example names the list with `aria-label`; no block uses `TagGroup`. This change says so where an app reads it: the `aria-label` prop's doc comment and the tag page's "Your part" say to use `aria-label` when there is no `fallback`. **Follow-up, a finding to fix** (constitution §4.4): copy the labelling element's text into a data attribute the rule reads. That adds script to the item, so it is past a small change; it needs its own specification.
5. **The changelog.** `tag` is new in 0.13.0, so this is a sentence in its existing bullet. It says what the item does, not what a reader says: emptied, the list renders its `aria-label` as visually hidden text, not an item, so a screen reader in browse mode has its name to speak when it takes focus; without a `fallback`, name it with `aria-label`.

## The check

New test 38a in `tests/e2e/tag.spec.ts`, on `removable`. It removes all three tags, then checks:

- focus is on the list, and its accessible name is "Filters";
- it is still a list of no items: `toMatchAriaSnapshot('- list "Filters"')`;
- in every engine, the list's `::before` content is `"Filters"`, and it is neither `display: none` nor `visibility: hidden`;
- with a space appended to the emptied list, the content is still `"Filters"` (the review's finding 1);
- in Chromium, the engine's own tree (CDP `Accessibility.getFullAXTree`) has the list as the focused node, and its descendants' text reads "Filters".

The snapshot cannot carry the text. Playwright drops a lone text child that repeats its node's name (READ, `playwright-core` 1.64.1, `coreBundle.js`: `if (node.children.length === 1 && node.children[0] === node.name) node.children = []`). The `::before` content and the engine's tree carry it instead.

## Landing notes

Built 2026-11-16 by a lane-I builder, in the worktree `lane-i-speech`, after `022r`, at `c5cdd65`. Not committed. Runs used `E2E_PREBUILT=1`, one worker, a rebuild after each source change.

### Seen failing first (EXECUTED)

- **38a's first form, on the unchanged item:** it failed in `chromium-light` and `webkit-light` on `toMatchAriaSnapshot('- list "Filters": Filters')` (Received `- list "Filters"`). With the snapshot made soft for one run (not kept), in `chromium-light`, the engine's tree also failed: the list's text was "", not "Filters".
- **The snapshot could not pass.** With the fix, the snapshot still read `- list "Filters"`, though the `::before` content was `"Filters"`: Playwright's dedupe, above. So 38a was rewritten to its final form, with the `::before` check and a recursive walk of the engine's tree. Chromium nests the text under a generic node.
- **The final 38a, proven against the unfixed item** (the item reverted and rebuilt, the `::before` assertion soft for one run): failed in both engines on "the emptied list's generated text" (Received `none`), and in Chromium on "the focused list's own text" (Received ""). The fix restored, it passes.

### After the fix (EXECUTED)

- `tag.spec.ts`: 25 of 25 in `chromium-light` and `webkit-light`, 38a and the five runs of 38 among them.
- **The joint run** with `022r`, the three touched specs: 87 passed, 1 skipped of 88 (tag 40 in WebKit, forced colours not emulated, as before).
- **The dry screen-reader run** (`SR_DRY=1`, Chromium), with `tag.sr.ts`: 10 of 10 passed, T1 to T3 among them.
- **The cost:** `bun run cost --sizes-only` (one run for both changes) rewrote `tag`: JS 14,076 → 14,100 B (brotli 12,405 → 12,435), CSS 1,093 → 1,174 (brotli 962 → 1,028). The catalogue's totals are in `022r`. `tag` is interactive, so its change review runs `bun run cost --only tag`.
- `static/r/` and `static/v0.13.0/r/` were regenerated by the build (`tag.json`). The thumbnails' manifest was rewritten with `--hash-only`; no picture changed (the thumbnails show a full list).
- `bun run check`, `bun run lint`, `bun scripts/lint-literals.ts` and the unit tests: as in `022r`. The classes are utilities, not literals.
- **The ledger:** no line names test 38 or 38a (READ, `tests/fault-ledger.ts` at `c5cdd65`).
- **The scorecard** is not re-run for this change alone.

### After the change review (EXECUTED)

- **Finding 1, failing first.** 38a gained the space case. On the build with `:empty`, it failed in `chromium-light` and `webkit-light` on "an emptied list holding a space" (Expected `"Filters"`, Received `none`). With `not-has-[>*]`, rebuilt, it passes in both.
- **Findings 2 and 5:** the doc comment, the tag page's "Your part" and the changelog sentence, as in fixes 4 and 5. The doc comment reaches `static/r/` and `static/v0.13.0/r/` through the build.
- **The cost**, re-run with `--sizes-only` from the reviewed `report.json`: `tag` JS 14,100 → 14,107 B (brotli 12,435 → 12,489), CSS 1,174 → 1,186 (brotli 1,028 → 1,053). The catalogue: JS 379,379 → 379,382, CSS 16,873 → 16,841. 1 size-stale before the run, 12 runtime-stale (kept). The thumbnails' hashes rewritten with `--hash-only`.
- The runs after these fixes are listed in `022r`'s "After the change review".

### Not settled

- **No reader ran here.** That NVDA renders the generated text, and says "Filters" or "Filters, list" for it, is INFERRED. The next speech run's T3, in both NVDA pairs, shows it.
- **Readers may say the name twice, or count an item** (the review's finding 4; INFERRED, not heard). Chromium's tree gives the focused list a child holding "Filters" beside its name "Filters" (EXECUTED).
  - NVDA's browse mode may say "Filters, list, Filters", where `027`'s table expects "Filters, list".
  - VoiceOver may say "Filters, list, 0 items, Filters", or count the generated text and say "Filters, list, 1 item", where the table says "Filters, list, 0 items".
  - T3's rule is F1 "Filters", so each still passes. The next speech run attaches each reader's words for T3, so `027`'s table can be corrected to what is heard.
- **An empty list holds its name wherever focus is** (the review's note 7). On `fallback`, focus goes to the input, and the emptied list still holds "Labels"; a list that starts empty holds its name from the first render. A browse-mode reader walking the page meets the name inside the empty list. Inside an ancestor named from its content, the name would join that ancestor's name while the list is empty (INFERRED).
- `aria-labelledby`: the follow-up in fix 4.
- `webkit-dark` and Firefox were not run here. 38a's `::before` check runs in every engine; the next `matrix` run shows them.
