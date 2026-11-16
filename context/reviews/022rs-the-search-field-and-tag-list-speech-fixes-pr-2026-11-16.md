# Review of 022r and 022s — the search field's repeated count, and the emptied tag list

- **Date:** 2026-11-16
- **Status:** dispositioned; both land
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the uncommitted diff in the worktree `lane-i-speech`, on `c5cdd65`: [022r](../specifications/022r-the-search-fields-repeated-count-is-a-change.md) and [022s](../specifications/022s-the-emptied-tag-list-has-a-line-nvda-can-speak.md), with [the first speech verdicts](../research/2026-11-16-the-first-speech-verdicts.md) §7 and §10 (search-field S2, tag T3), and `027`'s decision 4, decision 11 and criteria 29, 29a and 38.
- **Re-ran:** all on a fresh `bun run build` of the builder's change, served with `E2E_PREBUILT=1` on a port of its own.
  - `search-field.spec.ts` and `tag.spec.ts`, `chromium-light` and `webkit-light`, `--repeat-each=2` → **98 passed, 2 skipped** of 100. The skips are tag 40 in WebKit (forced colours not emulated), as before.
  - **Mutation, 022r:** `search-field.svelte` put back to `c5cdd65`, then a rebuild. 29b failed in both projects on "the status stays empty for the whole pause before the repeat" (Expected ≥ 750, Received 3). 29 and both 29a passed, as their narrowed form expects.
  - **Mutation, 022s:** `search-field.svelte` restored, `tag-group.svelte` put back to `c5cdd65`, then a rebuild. 38a failed in both projects on "the emptied list's generated text" (Expected `"Filters"`, Received `none`). The five runs of 38 passed.
  - Both files were then restored from copies and the site rebuilt. The SHA-256 of `git diff` (`b95add13…`) and of `git status --porcelain` (`dd344e37…`) match the ones taken before the first run.
  - The dry speech run, `SR_DRY=1`, `chromium` and `webkit`, `search-field.sr.ts` and `tag.sr.ts` → **14 of 14 passed**, S1 to S4 and T1 to T3 in each.
  - `bun run cost --only tag,search-field` → exit 0. 0 size-stale, so the report's sizes are this source's. The runtime phase was noisy (floor 240.3 ms against 128: other builds were loading the machine), so its figures are not held. `report.json` was restored byte for byte.
  - `bun run check` → 0 errors, 0 warnings. `bun run lint` → clean. `bun scripts/lint-literals.ts` → 0 literals, 1 allowance (`liquid-glass`). `bun test ./tests/unit` → 1,863 passed, 2 skipped, 0 failed. `10-tag-focus.patch` still applies (`git apply --check`).
  - Probes on the built site, from a scratch script (Chromium and WebKit): the emptied list's child nodes, `:empty`, its `::before` style and, in Chromium, the CDP accessibility tree, on `removable`, `fallback` and `mixed`. A whitespace text node appended to the emptied list, and a `:not(:has(> *))` rule beside it. Svelte 5's compiled templates for three ways an app may write a tag list. See finding 1.
  - Not run: Firefox (not installed), `webkit-dark`, any reader.

## Acceptance criteria against evidence

### 022r

1. "29b is seen failing on the unchanged item, in both engines" — met. EXECUTED: the mutation above.
2. "29b passes with the fix" — met. EXECUTED: 4 of 4 runs.
3. "The status is empty for at least the pause, 750 ms, before every count" — met. READ: `spoken` is reset only in `restart()`, and `restart()` sets `said = ""` and cancels `hush` before it starts the 750 ms timer. The effect writes a count only after `paused` and `!spoken`, so every count follows an empty write at least 750 ms earlier, or the 1 s clear earlier still. EXECUTED: 29b's interval in both engines.
4. "Left alone, a count stays 1,000 ms, then is emptied" — met. EXECUTED: 29b's last two assertions.
5. "Clear and Escape leave the status alone; the timer empties it" — met. READ: `clear()` touches neither `said` nor `hush`.
6. "No interface change" — met. READ: `SPEECH_MS` is module-private (in the instance script, not exported). No prop, string or class changes.
7. "29 and 29a are narrowed, and no assertion on a count is loosened" — met. READ: both now filter the empty writes out and keep every assertion about a count. See question 2c below.
8. Changelog: one sentence in the existing bullet — met. EXECUTED: `registry.test.ts` passes.

### 022s

1. "38a is seen failing on the unchanged item" — met. EXECUTED: the mutation above. The CDP half is not reached on the unchanged item, because the `::before` assertion fails first. Its failing run is READ, from the landing notes.
2. "38a passes with the fix" — met. EXECUTED: 4 of 4 runs.
3. "While the list has no children, its `::before` holds its `aria-label`" — met for the site's examples, **not in general.** EXECUTED: see finding 1.
4. "Svelte's comment anchors do not count" — met. EXECUTED: on `removable` and `fallback` the emptied list holds three comment nodes, and `:empty` is true, in both engines. A single `{#each}` leaves no text. Two sibling blocks leave a space. See finding 1.
5. "Chromium puts the text in a generic node" — met. EXECUTED: `list "Filters"` (focused) → `generic ""` → `StaticText "Filters"`. The list's name comes from `aria-label`; its contents, "Filters", are listed as a superseded name source.
6. "No new element, string, script or prop" — met. READ: the diff.
7. "Every example and block names the list with `aria-label`" — met. READ: all seven `TagGroup`s in `src/lib/site/examples/tag/` use `aria-label`; no block uses `TagGroup`. But the prop's doc comment and the tag page's "Your part" offer `aria-labelledby`. See finding 2.
8. Changelog: one sentence in the existing bullet — met. EXECUTED: `registry.test.ts` passes.

### Ledger files

- `report.json` — consistent. EXECUTED: the cost run found 0 size-stale items, so the sizes are this source's. `tag` CSS is 1,174 of its 2,100 budget, JS 14,100 of 14,800; `search-field` CSS 1,700 of 2,700, JS 13,416 of 14,500. The report's sizes are gzipped (`sizesOf` in `scripts/cost/build.ts`). The two new rules are 311 B raw. EXECUTED on the cost harness's own `tag` build: removing them saves 64 B gzipped and 68 B brotli. The rest of the 81 B is the `@property --tw-content` rule and its fallback, which the floor app does not have and the `before:` variant brings. So the growth fits the class names.
- `static/r` and `static/v0.13.0/r` — consistent. EXECUTED: two rebuilds left `git diff` unchanged.
- The thumbnails manifest — plausible. READ: only `search-field` and `tag` change hash. EXECUTED: the `thumbnails` unit test passes.

## The questions, answered

**1. Does each new test fail on the reverted item and pass with the fix?** Yes, both. EXECUTED, above. One file was reverted at a time, with a rebuild each time, and the diff hashes match afterwards.

**2a. Can a reader skip a count?** No path found that writes a count without an empty status before it.
- The same count twice: the keystroke empties the status, and the count follows at least 750 ms later. EXECUTED: 29b.
- A 1 s clear racing a new count: it cannot. `restart()` cancels `hush` at the keystroke, before the next count can exist, and the effect cancels it again before arming a new one. Only one `hush` is ever live. READ.
- Clear, then typing within the second: `restart()` empties the status. READ.
- What is not settled is the reader's side. A reader that reads the region late may find it already empty, if it waits more than 1 s after the write (INFERRED; the toast has the same exposure). The next speech run's S1 and S2 show it.

**2b. Does the timer leak on unmount?** No. `onDestroy` clears `timer` and `hush`. READ. No test holds it. A late `hush` would only write a destroyed component's state, which renders nothing (INFERRED).

**2c. Does narrowing 29 and 29a weaken `027` criterion 29?** No. The criterion protects that Clear, Escape and a pending server answer speak nothing. An empty write speaks nothing, and the polite region's default `aria-relevant` does not announce removals (INFERRED). Every regression that writes a count, such as "3 results" again or "0 results" on Clear, is still caught, because only empty strings are filtered. 29 also gains an assertion it did not have: `["", "3 results"]` after "i", so the keystroke's empty write is now pinned. READ.

**2d. Is reusing the toast's 1,000 ms justified?** It is a consistency choice, not a measured one. See finding 3.

**3a. Is the `sr-only` `::before` text in the engine's tree?**
- Chromium: yes. EXECUTED (CDP), above.
- WebKit: its computed style holds `"Filters"`, `position: absolute`, `clip-path: inset(50%)`, 1 × 1 px. EXECUTED. That it is in WebKit's tree is INFERRED: WebKit exposes CSS generated content as static text, and `sr-only` is the pattern VoiceOver users meet everywhere. No WebKit tree can be read here. T3 passed under VoiceOver before this change.
- Firefox: INFERRED. Gecko exposes generated content as text leaves. `::before` with `attr()` is long supported. The next `matrix` run shows it.

**3b. Is the name read twice?** Likely in some form, and harmless for T3. See finding 4.

**3c. Does `:empty` hold with Svelte's anchors?** With comment anchors, yes. With a space between two blocks, no. See finding 1.

**3d. Is `aria-labelledby` a real gap?** No example or block uses it. It is a documented way to name the list, so the gap is real for apps. See finding 2.

**3e. Is the CSS growth consistent and in budget?** Yes, both. See "Ledger files".

**4. The gate.** All green: see "Re-ran".

## Findings, most severe first

1. **Medium (022s). A space between two blocks in the list stops the fix** (`src/lib/registry/ui/tag/tag-group.svelte:76`). `:empty` is false while the list holds any text node, a space included.
   - EXECUTED: Svelte 5.57 compiles an app's
     ```svelte
     <TagGroup aria-label="Filters">
       {#each tags as t (t)}<Tag label={t} />{/each}
       {#if more}<Tag label="More" />{/if}
     </TagGroup>
     ```
     to the template `<!> <!>`: a space text node between the two anchors. Two `{#if}` blocks compile the same way. The site's own `mixed` example holds two such spaces, in both engines.
   - EXECUTED: on the emptied `removable` list, one appended space turns `:empty` false and the `::before` content `none`, in Chromium and WebKit. That list is back to NVDA's "blank".
   - So the fix holds for a list of one `{#each}`, which is every example, and fails silently for an app that writes two blocks. The specification's fix 3 ("only when empty … Svelte's comment anchors do not count") is true, but it is not the whole condition.
   - **Fix:** select on element children, not on nodes. Use `not-has-[>*]:before:sr-only not-has-[>*]:before:content-[attr(aria-label)]`.
     - EXECUTED: Tailwind 4.3.3 compiles them to `:not(:has( > *))::before` with the same declarations.
     - EXECUTED: with that rule, the emptied list holding a space has content `"Filters"`, and `none` once an item is added, in both engines. Chromium's tree still reads `list "Filters"` → `generic` → `StaticText "Filters"`.
     - The registry already uses `:has()` (`table-head.svelte`, `table-cell.svelte`, `toaster.svelte`).
   - **Check, seen failing first:** in 38a, after the emptied list's assertions, append a space text node to the list (`list.evaluate((el) => el.append(" "))`) and assert the `::before` content is still `"Filters"`. It fails on this build in both engines. Restate fix 3 in the specification, and re-run `cost --sizes-only` (the selector grows by a few bytes).

2. **Low (022s). A list named by `aria-labelledby` still says "blank", while the page promises its name** (`src/routes/(site)/components/tag/+page.svelte:96-98` and `:109-111`; `tag-group.svelte:9`). The page says focus goes "then the list, whose name is spoken", and "Your part" offers `aria-label` or `aria-labelledby`. With `aria-labelledby`, `attr(aria-label)` is empty, and NVDA lands on a blank line as before. READ. The specification records it as a follow-up, which constitution §4.4 allows only as a finding to fix.
   - **Fix, recommended:** in this change, say it where an app reads it. In "Your part": "Without a `fallback`, name the group with `aria-label`: an emptied list says that name to NVDA." Put the same clause in the `aria-label` prop's doc comment, and in the changelog sentence ("renders its `aria-label`" already says which). Record the follow-up (copy the labelling element's text into a data attribute the rule reads) as an entry in `context/roadmap.md` or the handoff, so it is not only in this specification.
   - **Fix, alternative:** do the follow-up now. It adds script to the item, so it is past a small change.

3. **Low (022r). The evidence for the times is stated more firmly than it is** (the specification, "The defect" and fix 1).
   - The specification says the toast clears its announcer after 1 s "and NVDA hears its repeat". Toast S4 raises "Save" twice, 3 s apart (READ, `026`'s S4 row). So its repeat followed about 2 s of empty status, not 1 s, and not 750 ms.
   - In the fast-typing case that S2 drives, the empty gap is set by the 750 ms pause, not by `SPEECH_MS`. `SPEECH_MS` only decides how long a lone count stays.
   - `026` calls its 1,000 ms a first guess for a run to tune (READ, `026` "Not settled").
   - So reusing 1,000 ms is reasonable for one rule across the two announcers, but no reader has heard a repeat after 750 ms of empty status.
   - **Fix:** in "The defect", say S4's repeat came after about 2 s of empty status. In "Not settled", say the 750 ms gap is untested by any reader, and that if S2 still fails, the gap (not `SPEECH_MS`) is what to tune, by a ruling in the landing notes, as `026` and `027` tune theirs.

4. **Low (022s). Readers may say the name twice, and VoiceOver may count an item** (INFERRED). Chromium's tree now gives the focused list a child holding "Filters" beside its name "Filters" (EXECUTED).
   - NVDA's browse mode may say "Filters, list, Filters" where `027`'s table expects "Filters, list".
   - VoiceOver may say "Filters, list, 1 item" or "Filters, list, 0 items, Filters" where the table says "Filters, list, 0 items". The specification names the second; the item count is not named.
   - T3's rule is F1 "Filters", so each still passes. A person hears one extra word.
   - **Fix:** none in the item now. Add the item-count case to "Not settled", and have the next speech run attach the readers' item text for T3, so `027`'s table can be corrected to what is heard.

5. **Low (022s). The changelog states an outcome no reader has heard** (`CHANGELOG.md`, the `tag` bullet: "so NVDA speaks its name instead of "blank""). It is INFERRED (the specification's own "Not settled"). `027` criterion 16 needs T3 green before the release anyway, so nothing ships unproven.
   - **Fix:** say what the item does, not what NVDA does: "…as visually hidden text, not an item, so a screen reader in browse mode has its name to speak when it takes focus." Or keep it, and confirm it at the next speech run.

6. **Low (022r). `027`'s text still describes the old item, and 022r does not say which sentences it replaces.** `027` decision 4 says "set to `""`, then, one frame later, to `results`" and "Clearing the field cancels the timer, and nothing is written". Criterion 29's third bullet says "Clear: the status is not written", and the landing notes' mutation list says "no empty frame before the count". READ. The specification says it narrows criterion 29, but a reader of `027` is not sent here.
   - **Fix:** in 022r's "The fix", name the four `027` sentences it supersedes, with their new form. If the design lead's practice is to annotate a landed specification, add one line under `027` decision 4 pointing at 022r.

7. **Note (022s). An empty list now holds its name in reading order, whatever took focus.** EXECUTED: on `fallback`, after the last removal focus is on the input, and the list's `::before` reads "Labels". A list that starts empty holds its name from the first render. A browse-mode reader walking the page now meets "Labels" inside an empty list, where before it met nothing. This is arguably better. Inside an ancestor named from its content (a `label`, a cell), the name would join that ancestor's name while the list is empty (INFERRED). No change asked; one sentence on the tag page would make it known.

## Constitution checks

- §4.1 source, not a package: met. READ.
- §4.3 tokens are the one source: met. No colour or size is added; `sr-only`'s 1 px is Tailwind's utility. EXECUTED: `lint-literals`.
- §4.4 accessible and proven in three engines: partly. Chromium and Linux WebKit were run; Firefox and `webkit-dark` were not, and both specifications defer them to the next `matrix` run. No reader has run either change; both name the next speech run. Finding 1 leaves 022s's fix unproven for a common way of writing the list; finding 2 is a documented path still failing.
- §4.5 and §4.6: met. No new dependency. READ.
- §5 the small-change track: both checks were seen failing first (EXECUTED, by the mutations), and the reviewer wrote neither change. Both stay small changes. Finding 1's fix keeps 022s one; finding 2's recommended fix touches the item's own page, which the track allows. The scorecard is not re-run per change; both defer it to the batch's re-run when these land.
- §6 never: nothing was committed or pushed, and no prior art was copied. No installed app breaks: the item is new in 0.13.0.

## Verdict

- **022r:** Lands. Findings 3 and 6 are write-ins to the specification.
- **022s:** Does not land yet: finding 1 (Medium: a space between two blocks stops the fix). Findings 2 and 5 should go in with it. Findings 4 and 7 are notes for the next speech run and the page.

## Disposition

By the reviewer, 2026-11-16, on the builder's fixes. The builder fixed findings 1 to 6; the reviewer re-checked each, and wrote none of them.

1. **Fixed.** The classes are `not-has-[>*]:before:sr-only not-has-[>*]:before:content-[attr(aria-label)]`. EXECUTED: the built CSS holds `:not(:has(>*)):before` with the same declarations as before. 38a gained the space case. With the `:empty` classes put back and the site rebuilt, 38a failed in `chromium-light` and `webkit-light` on "an emptied list holding a space" (Expected `"Filters"`, Received `none`). Restored and rebuilt, it passes.
   - **The selector does not match a list with a tag in it**, as the coordinator asked. EXECUTED, in Chromium and WebKit, by a scratch probe:
     - three tags, with their comment anchors: `none`;
     - one tag left, with its comment anchors: `none`;
     - the emptied list, comment anchors only: `"Filters"`, `position: absolute`;
     - the emptied list plus a new comment anchor and one `li`: `none`, and `"Filters"` again once both are removed;
     - `mixed` with only its static tag left, among comment anchors and two spaces: `none`.
   - The tag-group doc comment and the specification's fix 3 now say the rule reads element children, and that a space does not count. READ.
2. **Fixed.** The `aria-label` prop's doc comment, the tag page's "Your part" and the changelog's `tag` bullet now say to use `aria-label` when there is no `fallback`. The page also says a list named by `aria-labelledby` is still blank to NVDA when it empties. READ. The follow-up is fix 4 of the specification, and is the roadmap row `022u` in the main checkout's `context/roadmap.md` (READ; not in this worktree, so it lands with the context, not with this diff).
3. **Fixed.** 022r's "The defect" says toast S4's repeat followed about 2 s of empty status, and that 1,000 ms is `026`'s first guess. Fix 2 says the 750 ms pause sets the gap when typing is quick. "Not settled" says the gap is what to tune if S2 still fails. READ.
4. **Fixed.** 022s's "Not settled" names both: NVDA's possible repeated name, and VoiceOver's possible "1 item". READ.
5. **Fixed.** The changelog says the list "has its name to speak when it takes focus", what the item does, not what NVDA says. READ.
6. **Fixed.** 022r's fix 4 quotes `027`'s four superseded sentences (decision 4 twice, criterion 29's third bullet, the landing notes' mutation) with their new form, and leaves `027` unedited. READ.
7. No change was asked.

EXECUTED by the reviewer after the fixes, on a fresh build:

- `search-field.spec.ts` and `tag.spec.ts`, `chromium-light` and `webkit-light`, `--repeat-each=2` → 98 passed, 2 skipped (tag 40 in WebKit, as before).
- The dry speech run, `SR_DRY=1`, `chromium` and `webkit`, both items → 14 of 14 passed.
- `bun run check` 0 errors, 0 warnings; `bun run lint` clean; `lint-literals` 0 literals, 1 allowance; `bun test ./tests/unit` 1,863 passed, 2 skipped, 0 failed.
- `bun run cost --only tag --sizes-only` → "every figure is fresh". The report's `tag` sizes are this source's: CSS 1,186 of 2,100, JS 14,107 of 14,800. `report.json` was restored byte for byte after the run.
- `tag-group.svelte` and `report.json` were restored from copies. The SHA-256 of `git diff` and of `git status --porcelain` match the ones taken before the re-check.

Not run, as before: Firefox, `webkit-dark` and any reader. The next `matrix` run and the next speech run (S2, T3) settle them, as both specifications say.

Closing verdict: both land.
