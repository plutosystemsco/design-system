# Review of 003 — The first blocks (the built change)

Reviews [`specifications/003-the-first-blocks.md`](../specifications/003-the-first-blocks.md).

- **Status:** dispositioned; lands
- **Date:** 2026-10-28
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the uncommitted working tree against `7857ea4` (tag `v0.2.0`): 53 tracked files changed (`git diff 7857ea4 --stat`: 955 insertions, 88 deletions; the route moves staged by `git mv`) and the untracked code (2 items, 16 block files, 17 view routes, 7 item pages, 5 `+page.server.ts`, the `(site)` and `(view)` layouts, the root `+error.svelte`, `src/lib/preview/{blocks.ts,block-viewer.svelte,block-page.svelte,install-note.svelte}`, `src/lib/server/built-item.ts`, `tests/unit/blocks.test.ts`, `tests/e2e/{blocks,viewer}.spec.ts`, `tests/smoke/blocks-add.test.ts`). The `context/` changes were read, not reviewed. The builder's 6 recorded deviations from the specification were checked against the code, not trusted.
- **Re-ran:** under Bun 1.3.14, in the repository unless said otherwise. No `node` or `npx`. Scripts and screenshots in a scratch folder outside the repository.
  - `bun run check` → exit 0. `COMPLETED 1118 FILES 0 ERRORS 0 WARNINGS 0 FILES_WITH_PROBLEMS`.
  - `bun run lint` → exit 0, "All matched files use Prettier code style!". `bun scripts/lint-literals.ts` → exit 0, "0 literal(s) in registry item files".
  - `bun run build:tokens`, twice → "no changes" both times. SHA-256 `registry.json` `732521fe…`, `src/app.css` `c38ba62a…`, and their mtimes, identical before, between and after.
  - `bun run build` (after deleting `build/`, `static/r` and `static/v0.3.0`) → exit 0. 40 files in `static/r/styles/maia/`, 40 in `static/v0.3.0/…`, `diff -r` identical; 40 and 40 under `build/`; 57 prerendered pages (40 site, 17 views). This working copy's `build/` also holds `v0.1.0/` and `v0.2.0/`, copied from git-ignored `static/v0.1.0` and `static/v0.2.0`, as `002` decision 25 predicts.
  - `bun run test:unit` → exit 0. **384 pass, 0 fail**, 2,338 `expect()` calls, 9 files.
  - `bun run test:e2e` → exit 0. **698 passed** (1.0 m), 8 files × 2 projects, per project: axe 107, theme 57, keyboard 57, tokens 35, blocks 29, primitives 25, viewer 25, four-dot 14. No retries configured or reported.
  - `bun run test:smoke` → exit 0. **52 pass, 0 fail**, 1,733 `expect()` calls, 4 files, 49.4 s.
  - A clean copy (the 315 files `git ls-files -co --exclude-standard` lists, minus `context/`, in a scratch folder outside the repository) → `bun install --frozen-lockfile` installed 102 packages, exit 0; no `.nvmrc`. `bun run build` exit 0: 40 under `r/styles/maia/`, 40 under `v0.3.0/…`, **0 under `v0.1.0/` or `v0.2.0/`**, 57 pages. `bun run test`: unit 384 pass, browser 698 passed, then smoke stopped at `dev-loop.test.ts` with "fatal: not a git repository": `001`'s test lists files with git, and the copy had no `.git`. After `git init` in the copy, `bun run test:smoke` → 52 pass, 0 fail. The copy was deleted.
  - `bun run dev --port 5480 --strictPort` → `GET /r/styles/maia/index.json` 200, a JSON array of 39. Stopped afterwards; port 5480 free.
  - Screenshots (Playwright 1.64.1 under Bun, on the dev server): the 17 views at 360, 768 and 1280 in both themes (102, full page) and the 7 new item pages in both themes (14); read as images, as contact sheets of 6 per view and singly. The run collected `pageerror`, `console.error` and `console.warning`: 0 on 116 loads.
  - A walk of the 40 site pages in both themes on the dev server → 80 loads, 0 page errors, 0 console errors or warnings, every status 200. With the 116 above, criterion 27's 114 loads are covered (EXECUTED).
  - The raw prerendered HTML of `/view/sign-in/errors/`, `/view/settings/`, `/view/page-states/loading/`, `/view/sign-up/verify/` and `/view/sign-up/errors/`, loaded with JavaScript off (finding 1 and the accessibility checks below).
  - The code view: each of the 16 `<pre><code>` bodies in the prerendered block item pages, compared with the built JSON's `content` after decision 17's alias mapping → 16 of 16 byte-equal; 0 contain `#lib/registry`. 0 of 40 built files contain `#lib`.
  - Probes on the dev server: the 404 (below); the password toggle at 360 (name "Show password" then "Hide password", `aria-controls="sign-in-password"`, the input's `type` flips, 2 px solid outline); a click on the code-error summary's link focuses `#sign-up-code`; a pasted "123 456" leaves the code input's value `123456`; after confirming the delete, focus is on "Delete account".
  - `git status --porcelain` hashed before and after every run → identical (`3a106661…`). `git log` still ends at `7857ea4`. The runs wrote nothing tracked.

## Acceptance criteria against evidence

1. **Install** — met. EXECUTED: the frozen install on a clean copy (above); `deps.test.ts` passes unchanged in the 384.
2. **Checks** — met. EXECUTED: 1118 files, 0 errors, 0 warnings; lint exit 0.
3. **Tokens unchanged** — met. EXECUTED: two runs, same hashes and mtimes; `tokens`, `contrast`, `generated` tests pass.
4. **Registry source** — met. EXECUTED (`registry.test.ts`). READ: 39 items in decision 5's order; types 1, 3, 1, 29, 5; 7 of 7 new items with `meta` exactly `{since: "0.3.0", group}` and decision 5's titles; 24 dependency names.
5. **Registry build** — met. EXECUTED: 40 and 40, byte-identical; 0 `#lib`. READ in the built JSON: 6 page targets `<block>/+page.svelte` or `page-states/+error.svelte`, 10 component targets bare `<block>-…`, none rooted.
6. **Blocks, statically** — met as counted. EXECUTED (`blocks.test.ts`, all pass). My own greps agree: no `dark:`, no `muted` or `accent` class, no `target`, no `./$types` and no root-relative link other than `/` in the 16 block files.
7. **Site build** — met on a clean copy. EXECUTED: 40, 40, 0, 57.
8. **Dev server** — met. EXECUTED: 200 with 39.
9. **Preview pages** — met. EXECUTED: 39 of 39.
10. **The lint** — met. EXECUTED: 153 files, 0 violations; 64 of 64 bad, 0 of 42 good; the script exits 0.
11. **Named dependencies** — met. EXECUTED. READ in the built JSON: `error-summary` and `page-states` carry `devDependencies: ["phosphor-svelte@^3.1.1"]`; the other 5 carry none.
12. **The merge path** — met. EXECUTED: `utils.test.ts` unchanged and passing. READ: `button`'s new `compoundVariants` `px-0` reaches the DOM after `size`'s padding, and `cn` keeps the later class, so `px-0` wins.
13. **axe** — met as counted. EXECUTED: 107 per project, 214 in all, 0 violations. On the 5 block item pages the iframe is excluded (deviation 1); each view is scanned at its own URL at 3 widths.
14. **Themes** — met. EXECUTED: 57 per project, 114.
15. **The mark and tokens** — met. EXECUTED: four-dot 14 + 14, tokens 35 + 35, `002`'s counts.
16. **Keyboard** — met. EXECUTED: catalogue 41 stops with the ring; 17 fixtures, 39 stops; 17 views, 75 stops checked by role, name and ring, then out of the document; 5 toolbars, 41 stops; 11 behaviours. READ: each stop is compared by role and name, not only counted.
17. **Status and error summary** — met. EXECUTED: S1 to S3 and E1 to E2 in both projects. My raw read agrees: every status region is present, empty, `polite`, `aria-atomic="true"`; the 3 specimens carry no `role`.
18. **Form behaviours** — met as counted, with a gap. EXECUTED: checks 1 to 17 in both projects. Check 11 counts the consent links and their `href`s but not the sentence, which renders wrong (finding 1).
19. **Page states** — met. EXECUTED: checks 18 to 22. My dev-server probe agrees: `/no-such-page/`, `/no-such-page`, `/view/no-such-block/` and `/items/nope/` answer 404 with one `h1` (the not-found title); `/view/page-states/not-found/` answers 200.
20. **Hero** — met. EXECUTED: check 23 at 3 widths in both projects; the screenshots agree (28 px and one column at 360; 44 px and 2 and 3 columns).
21. **Motion, reflow, targets and rings** — met. EXECUTED: checks 24 to 27 (24 pages, 24 pages, 75 stops, 40 stops).
22. **Viewer** — met as counted. EXECUTED: 25 per project. Check 5 compares paths only; my own comparison found the 16 file bodies equal to the built JSON (finding 5).
23. **Smoke** — met. EXECUTED: 52 pass over 4 files; `blocks-add.test.ts` runs its 8 assertions in 2 apps with `SMOKE_BLOCKS` unset (finding 4).
24. **Test files** — met, with a caveat on what a clean clone is. EXECUTED: 9 unit, 8 browser in 2 projects and 4 smoke files, each suite exit 0 in the repository and in the clean copy. The chain in the copy exited 1 only because the copy was not a git repository; a clone is one.
25. **Release** — met. EXECUTED: `version` `0.3.0`; the `0.3.0` entry names 7 of 7 and the `button` change; `0.2.0` 27 of 27; `0.1.0` 6 of 6. READ: 7 of 7 new built items carry `meta.since` `"0.3.0"` and their group.
26. **The checkpoint** — not met yet. The Landing notes are empty. The evidence exists only in the builder's working notes, not kept (the checkpoint's log: 40 stops at 360, each "unclipped") (finding 7).
27. **The development walk** — met by my own walk (above); not yet in the Landing notes. The builder's walk log reads "loads: 114; with a problem: 0" (finding 7).
28. **Released** — tag `v0.3.0`.

## Findings, most severe first

There is no High. No item breaks an app that installs it: both smoke apps take all five blocks in one `add`, build every route prerendered and crawled, and type-check with 0 errors; no built file holds `#lib`; every `$UI$` import a block makes is in its own dependencies, and every `$COMPONENTS$` import names its own file.

1. **Medium — The consent sentence renders "terms of serviceand the privacy notice"** (`src/lib/registry/components/sign-up-form.svelte:207-208`).
   - What is wrong: the space before "and the" sits at the start of an `{#if privacyHref}` block, where Svelte drops leading whitespace. EXECUTED: the raw prerendered `/view/sign-up/errors/` has the consent `textContent` "By creating an account, you agree to the terms of serviceand the privacy notice." The screenshots show it at all three widths in both themes.
   - Why it matters: this is shipped copy, in every app that passes both links. Decision 12 gives the sentence word for word; a screen reader reads "serviceand". `blocks.spec.ts` check 11 counts the links and reads their `href`s, so the suite stays green.
   - Fix: keep the space outside the block, for example `…terms of service</a>{#if privacyHref}{" "}and the <a …>privacy notice</a>{/if}.`. In check 11, compare the consent sentence's normalised text with decision 12's two sentences (with both links on `/view/sign-up/errors/`; with the terms only, on a fixture or the item page). See it fail before the fix.

2. **Low — A callback that rejects is unhandled, and a failed resend says nothing** (`sign-up-verify.svelte:105-121`; `sign-in-form.svelte:108-112`, `sign-up-form.svelte:135-139`, `settings-form.svelte:155-159`, `settings-delete.svelte:23-27`).
   - `resend` catches a rejected `onresend` and sets the status to `""`. A reader hears "Sending a new code…" and then nothing; nothing on screen says the code was not sent. The patterns memo asks for a polite announcement of an async error (§6.1).
   - The four `onsubmit`/`onsave` wrappers clear `busy` in `finally` and let a rejection escape: an unhandled rejection, no summary, no status. `settings-delete` writes nothing if `ondelete` rejects.
   - The specification does not say what a rejection means, so this is a gap in it as much as in the build. Fix (the design lead's call, recommended first): state in decision 6 that a callback resolves and never rejects, mapping a server failure to `formError`, and say so in each component's prop comment; and make a rejected `onresend` say a message in the status, such as "The code was not sent. Try again.", linted and added to decision 12's table. Or catch every rejection and show a house `formError`.

3. **Low — Additions the deviation list does not record.** Each is additive and harmless, but the Landing notes should name them:
   - `SettingsDelete` takes a `requested` prop, the line shown after the delete, default "Account deletion requested." (`settings-delete.svelte:10`, `:16`). Decision 14 lists `ondelete`, `level` and `class` only. It is the right answer to the decision's "replace the line with the app's own", but the page's stub comment says to "replace the line it shows" without naming the prop (`blocks/settings/+page.svelte:33-34`).
   - `settings-form.svelte` exports `MESSAGES` and `TIME_ZONES`; `page-states-error.svelte` exports `errorTitle`, which `+error.svelte` uses for the `<title>`.
   - `src/lib/preview/block-page.svelte` and `install-note.svelte`, two preview components decision 17 does not name.
   Fix: list them in the Landing notes; name `requested` in the stub comment.

4. **Low — `SMOKE_BLOCKS` reaches `bun run test` from the shell** (`tests/smoke/blocks-add.test.ts:33-36`). Deviation 6 says `bun run test` never sets it. True, but it never unsets it either. A shell or CI that exports `SMOKE_BLOCKS=sign-in` runs the narrowed install, skips the 102-file and 86-file counts, and the suite stays green with test names that say a smaller number. Fix: `"test:smoke": "SMOKE_BLOCKS= bun test ./tests/smoke --timeout 300000"` (an empty value means all five), and keep the variable for direct `bun test` runs only; or fail test 2 when it is set and `CI` is set.

5. **Low — Three checks that cannot fail the way their claim says.**
   - `viewer.spec.ts` check 5 reads each `summary`'s path, not the file body. Decision 17 promises "the exact text `add` writes". My comparison found 16 of 16 bodies equal to the built JSON, so this is a missing guard, not a defect. Fix: compare each `<pre>` text with `appText` of the built file's `content`.
   - `viewer.spec.ts` check 4 "at load" passes without the copy: the frame's head script reads the same system preference and storage as the parent. Only the toggle steps exercise the `MutationObserver`. The mount path (decision 17's "if `readyState` is already `complete`", review finding 13) is untested. Fix: set `pluto-preview-theme` to the opposite of the system before load with storage blocked in the frame, or toggle the parent class before hydration, and expect the frame to follow.
   - `blocks-add.test.ts` test 2 builds its 102 paths from `registry.json` and checks each exists. Two blocks that wrote the same path would still pass; decision 20's "a collision … would show as a short file count" does not hold. The unit naming rule (0 repeated base names) is the real guard. Fix: count the files the `add` wrote (walk `src/routes/<block>/` and `src/lib/components/`) and expect 16 block files, or reword decision 20.

6. **Low — Design calls for the design lead, seen in the screenshots.**
   - *The "Technical details" summary shows no open or closed state.* `inline-flex` on a `<summary>` drops its disclosure marker in Chromium and WebKit, so it reads as an underlined link (`page-states-message.svelte:77-79`; the error view at every width). The class is the specification's (decision 13). Options: put the flex box on an inner `span` and keep the `summary` a `list-item` with `min-h-6`; or add a `CaretRight` that turns by `group-open:` with no transition.
   - *Heading ranks look equal.* On the empty view the page's `h1` "Projects" and the tile's `h2` "No projects yet" are both `text-2xl`. On the settings views below `sm` the `h1` "Settings" and each section's `h2` are both 28 px. The structure is right; the look gives no rank. Decide whether an `h2` inside a tile or a legend steps down to `text-base`, or the `h1` steps up.
   - *Two accents on the settings page.* The page shows the blue "Save changes" and the solid red "Delete account" on one ground. Decision 14 asks for `variant="destructive"`, and the split decision puts state colour outside the budget; but `002` decision 17 says "a surface with a destructive action spends red, not blue". Confirm the groove makes the delete section its own surface, or make the trigger `secondary` and keep the solid red for the dialog's confirm.
   - *The viewer's pressed button.* `aria-pressed:border-foreground` is also every secondary button's hover border, so a hovered button looks pressed; in dark the pressed one differs mostly by the `accent` ground (item-page screenshots). The State and Width groups have no visible label. Preview code only.

7. **Low — Criteria 26 and 27 live in the builder's working notes, not the Landing notes.** The checkpoint's log and the walk's log hold the evidence (40 of 40 rings unclipped at step 3; 114 loads, 0 problems). Fix: copy both into the Landing notes when `003` lands, with what the checkpoint changed (deviations 1, 2 and 4).

## The builder's deviations, checked

1. **axe excludes the iframe on a block's item page** — holds. READ: `axe.spec.ts` waits for the frame's `main[data-view-ready]`, then excludes `[data-testid="viewer"] iframe`; each view is scanned at its own URL at 360, 768 and 1280 (51 per project). Two `main` landmarks across a frame boundary are an artifact of embedding a page.
2. **An interim root error page** — superseded as built. `src/routes/+error.svelte` now renders the block's `+error.svelte` inside a `<main>`. EXECUTED: unknown paths answer 404 with the not-found design on the dev server; check 19 on the preview server.
3. **`data-slot` on each form** — holds. READ: `sign-in-form`, `sign-up-form`, `sign-up-verify`, `settings-form` on the `<form>`, `settings-delete` on its `<section>`. The card keeps `data-slot="card"`.
4. **`button`'s `link` variant drops its side padding** — holds. READ: `compoundVariants: [{ variant: "link", class: "px-0" }]`; height unchanged; no prop changed. No `002` page or test depends on the old padding: `link` is used on the button page's specimens and fixture, the sign-in footer link, the viewer's "Open alone" and the hero's secondary; `002`'s height and target checks pass (EXECUTED). The changelog marks it a change and not an interface change. An app that already holds `button` and adds a block without `-o` is asked before the file is replaced; if it declines, its link-styled buttons keep 12 or 16 px of padding, a cosmetic difference.
5. **The consent links are `inline-block`** — holds for the target: check 26 measures both at 24 px or more at 360 (EXECUTED). It is not the cause of finding 1; the missing space is absent from the DOM text.
6. **`SMOKE_BLOCKS`** — the reason holds for the checkpoint; the claim that `bun run test` cannot run with it does not (finding 4).

## Accessibility, against the specification's contracts

- **Landmarks and headings** (raw HTML, EXECUTED): each of the 5 views read has 1 `main` and exactly 1 `h1`; the summary's title is an `h2` under it; settings has `h2` "Profile", "Email notifications", "Theme" and "Delete your account".
- **Error summary:** raw, no `role`, `tabindex="-1"`, 2 links `#sign-in-email` and `#sign-in-password`, each naming an element present. After a failed submit, `role="alert"` on insertion and focus on it (checks 1, 5, 8, 15). Links move focus by Enter (tests) and by click (my probe), the code link to the real input. `document.title` "Error: Sign in" raw on the errors views.
- **Wiring:** every control's `aria-describedby` names ids present in the raw HTML; invalid inputs carry `aria-invalid="true"`; labels' `for` name their controls; each settings `<fieldset>` is described by its line; the radio group is `aria-labelledby` its legend.
- **`autocomplete`:** `username` and `current-password` (sign-in); `email` and `new-password` (sign-up); `name` and `email` (settings). `spellcheck="false"` and `autocapitalize="off"` on email and password. No `maxlength` on the new password.
- **Code input:** `id="sign-up-code"`, `autocomplete="one-time-code"`, `inputmode="numeric"`, `maxlength="6"`, `pattern="^\d+$"`, described by "You can paste the whole code."; a paste with a space is cleaned. Resend texts: 4 in order, each different (check 9).
- **Status regions:** present and empty at mount on every view read, `aria-live="polite"`, `aria-atomic="true"`; hidden ones `sr-only`, settings' two visible.
- **Loading:** raw `aria-busy="true"`, 3 rows `aria-hidden="true"`, the status empty; "Loading projects" after hydration (check 18). The mount precondition is in the component's comment and on the item page.
- **Reflow, targets, rings:** 24 of 24 pages at 320; 75 of 75 stops at 24 px or more at 360, the 32 px cells among them; 40 of 40 rings unclipped at 360 with the frameless card (EXECUTED by the suite; the 360 screenshots agree).
- **`beforeunload`**, **Discard** focus to Name, and the **delete dialog** starting on "Keep my account" and returning focus: checks 14, 16 and 17, and my probe after confirming.
- **The viewer:** the iframe `title` "<Title> preview"; presets and states `aria-pressed`; the frame in a `region` named "Preview frame" with `tabindex="0"`; "Open alone" follows the state. The iframe's `<html>` gets its class before paint from `app.html`'s head script (the stored choice, else the system's), the same source as the parent's; the viewer then copies the parent's class on mount, on `load` and on every change.
- **The 404:** the preview and dev servers answer 404 with the not-found design for any unmatched path. `build/` holds no `404.html` (no `fallback`), so a static host serves its own page. Decision 13 says this is deployment's; the claim is honest.

## Constitution checks

- **§4.1 source, not a package:** holds. READ: built items carry `$UI$`, `$UTILS$` and `$COMPONENTS$`; no `#lib`, no `#lib/registry/blocks`, no relative import in a block; `src/lib/preview/` and `src/lib/server/` are imported by routes only. EXECUTED: both smoke apps build and check.
- **§4.2 driven by need:** criterion 28 is the release, tag `v0.3.0`.
- **§4.3 tokens are the one source:** holds. EXECUTED: the lint, 0 in 153 files. READ: no `dark:`, no `style`, no hex in the new files; `muted` reaches the blocks only through `skeleton` and the empty state's icon tile (insets); no state tint sits in an inset (the error summary sits on the card or the page). The stub's 800 ms is a fake network delay, named in decision 6.
- **§4.4 accessible by default:** holds, apart from finding 1's mis-read sentence and finding 2's silent resend failure. EXECUTED: axe 0 in 214; the keyboard and behaviour checks above.
- **§4.5 pinned:** holds. `package.json` adds no package; `bun.lock` unchanged.
- **§4.6 named dependencies:** holds. READ: every new item names `utils` and `pluto-theme`; `phosphor-svelte@^3.1.1` on the 2 items that import it.
- **§6 never:** no commit (`git log` ends at `7857ea4`); no prior art copied (the 7 items are ours); no silent break: the one `002` file changed, `button`, is named in the changelog as a change that keeps its interface (deviation 4).
- **Bun everywhere:** holds. READ: the new scripts and spawns use `process.execPath` or `bun --bun`.

## Verdict

Does not land yet: finding 1 stands. The sign-up consent sentence ships with a missing space ("terms of serviceand"), and the check that should catch it counts links only. Every countable criterion from 1 to 25 reproduces at the specification's numbers, no block breaks an installing app, and findings 2 to 7 are Low.

## Disposition

By the builder, 2026-10-28. Findings 2 and 6 were decided by the design lead in `decisions.md` ("The design calls for `003`", "After the change review") and applied as binding. After the fixes, under Bun 1.3.14 (EXECUTED): `bun run check` 1120 files, 0 errors, 0 warnings; `bun run lint` and `bun scripts/lint-literals.ts` exit 0; `bun run build` exit 0, 58 prerendered pages; `bun run test` exit 0 (unit 384 pass, browser 716 passed, smoke 52 pass, as the Landing notes record); the dev-mode walk of the 58 pages in both themes, 116 loads, 0 page errors, console errors or warnings.

| # | Severity | Finding | Disposition |
|---|---|---|---|
| 1 | Medium | Consent sentence renders "serviceand"; check 11 does not read it | **Fixed.** The space is `{" "}` inside the `{#if privacyHref}` (`sign-up-form.svelte`). Check 11 now compares the consent sentence's normalised text with "By creating an account, you agree to the terms of service and the privacy notice."; seen failing first ("…terms of serviceand the privacy notice."), then passing. The terms-only sentence has no fixture; accepted, since its markup is the same line without the block. |
| 2 | Low | Rejected callbacks unhandled; a failed resend is silent | **Fixed, by the design lead's call.** All six handlers catch a throw or rejection: what was typed is kept, the summary is inserted with `role="alert"` and focused, and the status says the same line, which names what failed: "We could not sign you in. Try again.", "We could not create your account. Try again.", "We could not save your changes. Try again.", "We could not delete your account. Try again."; a failed resend says "We could not send a new code. Try again." The code step's submit, which the call does not name, says "We could not check the code. Try again." Each form's `MESSAGES.failed` holds its line; `SettingsDelete` gains a summary under its heading. The voice check's banned list is unchanged ("something went wrong" stays banned, the design book §07). New view `/view/settings/failed/` ("Callback failed") renders the state, with rejecting stubs. `blocks.spec.ts` checks 28 to 31 (`onsubmit`, `onresend`, `onsave`, `ondelete`), seen failing first, then failing again on the old wording before the final lines. Counts that change: 18 views, 58 pages, axe 220, theme 116, view stops 83, toolbar stops 42, state switches 17, checks 24 to 26 on 25, 25 and 83. |
| 3 | Low | Unrecorded additions (`requested`, exports, two preview components) | **Recorded** in the Landing notes (note 4, item 7): `SettingsDelete`'s `requested`; `settings-form`'s `MESSAGES` and `TIME_ZONES`, `page-states-error`'s `errorTitle`; `block-page.svelte` and `install-note.svelte`. The settings page's stub comment now names `requested`. |
| 4 | Low | `SMOKE_BLOCKS` inherited by `bun run test` | **Fixed** by the first option: `test:smoke` is `SMOKE_BLOCKS= bun test ./tests/smoke --timeout 300000`, and the test treats an empty value as unset. Probed: with `SMOKE_BLOCKS=sign-in` exported, a `bun run` script that clears it passes `""` to its child. A direct `bun test` may still narrow. |
| 5 | Low | Viewer checks 4 and 5 and smoke test 2 under-check | **Fixed.** Viewer check 4 blocks storage and inverts the system preference inside the frame only, so the frame picks the other theme and only the viewer's copy can match them; with the copy disabled the check failed (EXECUTED). Viewer check 5 compares each `<pre>` body with `appText` of the built JSON: 16 of 16. Smoke test 2 lists the files `add` wrote under `src/routes/<block>/` and `src/lib/components/` and expects exactly the 16 block files. |
| 6 | Low | Design calls: summary marker, heading ranks, two accents, viewer pressed state | **Fixed, by the design lead's calls.** "Technical details" shows an `aria-hidden` `CaretRight` when closed and `CaretDown` when open, from the details' `open` state. The page-states `h1`s and the settings `h1` are `text-2xl`, `text-5xl` from `sm`; tile headings stay `text-2xl`; settings legends and the delete section's heading are `font-heading text-base font-bold`. The delete trigger is `secondary`; only the dialog's confirm is `destructive`. The viewer's pressed preset is `bg-foreground text-background`; hover stays the darker border. The keyboard and axe checks pass unchanged in shape; screenshots retaken. The State and Width groups each have a visible mono label, "state" and "width", lowercase, and each `role="group"` is named by it through `aria-labelledby`; labels are not stops, so the toolbar stays at 42 stops, and viewer check 1 asserts each group's name and visible label. |
| 7 | Low | Criteria 26 and 27 not in the Landing notes | **Recorded in the Landing notes.** The checkpoint is note 1 (40 of 40 rings unclipped at 360); the development walk is note 3 (0 of 116 loads with a problem). |

After the disposition: lands.
