# Review of 024c — Two component page headers hold still (the built change)

Reviews [`specifications/024c-component-headers-hold-still.md`](../specifications/024c-component-headers-hold-still.md), a small change. This reviewer wrote neither the stub nor the code (constitution §5).

- **Date:** 2026-11-16
- **Status:** in review. **Land after fixes.** Findings 2 and 3 are small, and belong on the branch before the merge. Finding 1 is a follow-up specification to file. Findings 4 to 6 are notes and follow-ups.
- **Reviewer:** a reviewer; not the author.
- **Reviewed:** the worktree `.claude/worktrees/agent-a4af0bbd2fddf9d31`, branch `worktree-agent-a4af0bbd2fddf9d31`: `git show d1e17cd` on base `cc278db`. 7 files, +228 −79 (the manifest is 124 of those lines). `release/0.13.0` has since moved to `70336f4` (`024b` merged, and context commits).
- **Re-ran:** Bun 1.4.4, 2026-11-16, load average 15 to 55 on 10 cores. The worktree was not edited. `git status` was clean before and after.
  - `bun run check` → **0 errors, 0 warnings**, 2,359 files.
  - `bun test tests/unit/budgets.test.ts` → **60 pass, 0 fail**.
  - `E2E_PORT=5781 bun --bun playwright test --project=chromium-light tests/e2e/build-output.spec.ts tests/e2e/site.spec.ts` → **68 passed** (1.9 min, with the build). The 68 include the new `024c` test (checked with `--list`) and every Markdown-twin check.
  - `E2E_PORT=5782 bun --bun playwright test --project=perf --no-deps` → **28 passed** (6.5 min). `component`'s five probes, CLS 0 in every run. LCP runs: `sidebar` 1,108 / 1,124 / 1,116; `button` 1,012 / 1,000 / 1,004; `label` 892 / 888 / 904; `native-select` 948 / 940 / 936; `empty` 884 / 896 / 892 ms. Budget 1,270.
  - **A prototype of the alternative,** in scratch copies of the change's `build/`. Five variants, served and throttled as `perf.spec.ts` does, with a `layout-shift` observer and the font's resource timing (`scratchpad/024c/measure.mjs`, `mkvariants.py`, `results.json`). See "1. The trade-off".
  - Not run: chromium-dark, the other engines, axe, smoke, the release check. The builder ran them (1,000 passed). The change is one `<link>` in the head of component pages, moved.

## Verdict

**Land after fixes.** The diagnosis is right, and the fix is the right one for the site. I reproduced the "before" to the digit (label 0.0901, native-select 0.087, empty 0.0177, the font done at 2.87 to 2.99 s). The change takes all three to 0.0001.

I measured the alternative the brief named: a metric-matched fallback face. It is the better fix for LCP, by 50 to 130 ms. But it only works where the face it adjusts is installed. With the adjusted face missing, as it would be on the perf job's `ubuntu-24.04` runner and on Android, the shift comes back in full: label 0.0901, native-select 0.0869. The preload does not depend on the reader's fonts. It is the right small change. The fallback belongs in the theme, as its own specification, for the apps (finding 1).

Two small fixes first. The test and the hook spell the font's name twice (finding 2). And the CLS ruling's text names the wrong page (finding 3).

## The stub's checks against evidence

1. **Seen failing first.** Met. READ: the landing notes give 3 failures. These are label's and native-select's CLS against 0.022, and 79 pages "after a script". EXECUTED (my prototype's "before" variant, with the `018` placement restored): label 0.0901 and native-select 0.087 in all three runs. These are the failing values.
2. **After the fix, both pass.** Met. EXECUTED: my perf run, CLS 0 on all five probes; the prototype, 0.0001.
3. **The figure lands at the re-base.** Met as the stub wrote it. See finding 3.

"The perf project, `bun run check` and the browser projects stay green." Met for what I ran.

## 1. The trade-off: the preload against a metric-matched fallback

**The alternative.** Next.js's `next/font`, Nuxt's `fontaine` and Chrome's guidance all do the same thing. They declare a fallback `@font-face` on a local face, with `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override`. Those make the fallback take Geist's space, so the swap moves nothing. The font is not on the critical path.

**Calibration** (EXECUTED, `widths2.mjs`). I rendered 25,899 characters of the five component pages' text at 14 px in each face:

| Face | Width, % of Geist |
|---|---|
| `system-ui` (today's fallback, SF on this Mac) | 101.48 |
| Arial, `size-adjust` 105.49% (the letter-frequency method Next.js uses; Geist's `avg` 0.4632 against Arial's 0.4391) | 102.33 |
| Arial, 103% | **99.98** |

The frequency method makes Arial *wider* than today's fallback on this text. So I used the tuned figure, 103%, the best case for the alternative. The face: `src: local("Arial"), local("ArialMT"); size-adjust: 103%; ascent-override: 97.57%; descent-override: 28.64%; line-gap-override: 0%` (Geist: typo ascent 1.005, descent −0.295, gap 0). It sits second in every Geist stack in the CSS.

**The variants.** Each is a scratch copy of the build. Only the probe pages' `<head>` and the root stylesheet change.

- **before:** the preload where `018`'s `<svelte:head>` put it, after the 69 module preloads.
- **024c:** as built.
- **fallback, late preload:** "before" plus the fallback face.
- **fallback, no preload:** the fallback face, and no font preload at all.
- **both:** 024c plus the fallback face.
- **fallback, face missing:** "fallback, no preload" with `local()` naming a face that does not exist. This stands for a system without Arial, and also for "just delete the preload".

**The results.** These are medians of 3 cold loads under `015` decision 23's profile, interleaved round-robin so the machine's load fell on every variant alike. LCP equals FCP in every run.

| Page | before | **024c** | fallback, late preload | fallback, no preload | both | fallback, face missing |
|---|---|---|---|---|---|---|
| `label` CLS | 0.0901 | **0.0001** | 0.0001 | 0.0001 | 0.0001 | **0.0901** |
| `label` LCP, ms | 880 | **892** | 852 | 816 | 904 | 808 |
| `native-select` CLS | 0.087 | **0.0001** | 0.0001 | 0.0001 | 0.0001 | **0.0869** |
| `native-select` LCP | 900 | **976** | 860 | 844 | 960 | 848 |
| `button` CLS | 0.0001 | **0.0001** | 0.0001 | 0.0001 | 0.0001 | not run |
| `button` LCP | 892 | **1,016** | 884 | 884 | 1,036 | not run |
| `empty` CLS | 0.0177 | **0.0001** | 0.004 | 0.004 | 0.0001 | not run |
| `empty` LCP | 880 | **944** | 856 | 812 | 912 | not run |
| Geist done, ms (label) | 2,916 | 769 | 2,931 | 1,312 | 781 | 1,341 |

(`fallback, face missing` ran in a second batch beside `024c`, whose LCP there read label 880 and native-select 956.)

**What it shows.**

- **The cost is real, and about what the builder said.** The preload adds 12 to 124 ms of LCP over "before" (builder: 44 to 96). It adds 76 to 132 ms over "fallback, no preload". The font's 29 kB now shares the first-paint bandwidth with the stylesheets: 29 kB at 1.6 Mbps is about 145 ms of wire time.
- **The fallback fixes the shift without the cost, where its face exists.** Label, native-select and button read 0.0001, with the best LCP of any variant. It is not perfect: `empty` keeps 0.004, because one calibration fits the average line, not every line.
- **Where its face does not exist, the fallback does nothing.** Label and native-select read the full 0.09 and 0.087. `local("Arial")` matches on macOS and Windows. It does not match on a stock Linux or on Android (INFERRED: neither ships Arial, and `local()` matches by face name). The perf job runs on `ubuntu-24.04` (READ, `.github/workflows/matrix.yml` l. 136), and CLS gates on every machine (`024` decision 8). So on the fallback alone, the CI gate would read whatever that runner's fonts give. The preload's 0.0001 does not depend on installed fonts.
- **Both together add nothing to the site.** With the preload, Geist beats the first paint, so the fallback never shows. "Both" matches 024c within noise.

**Recommendation: keep the preload (024c as built).** It is the `018` fix in the place where it works. It is a small change by AGENTS.md's terms. The fallback is not a small change. It adds a family to `--font-sans`, so it changes a token's value (`tokens/kuiper.tokens.json` l. 527) and the `kuiper-theme` CSS every app installs. The cost, about 0.1 s of LCP on a 1.6 Mbps profile, stays well inside `component`'s 1,270 ms and row 8's band.

**Finding 1 (Medium, a follow-up specification, lane T).** File "metric-matched fallback faces in the theme". An app that installs `kuiper-theme` gets Geist with `font-display: swap` and no preload. So every adopting app has this swap, and this change does not help them. The specification should cover Geist, IBM Plex Sans and JetBrains Mono, each against a named local face per platform (Arial or Helvetica; Roboto on Android). The figures should be calibrated on real text, not on letter frequency, which this review found makes Arial 2.3% too wide. Its check is this review's "face missing" row, run on Linux. The site keeps 024c's preload either way.

**For the landing notes.** The "Not chosen" paragraph says the fallback's "numbers depend on each system's fallback". That is now measured. Add the table above, or point to this review.

## 2. Is the hook safe?

**Yes.**

- **Scope.** `COMPONENT_ROUTE` is `^/\(site\)/components/[^/]+$`. No route nests under a component (EXECUTED: no directory at depth 2 under `src/routes/(site)/components/`). The index, `/(site)/components`, does not match. Nor do `/example/…` and `/view/…`. The test proves the scope on the built output: every component page has exactly one preload, and no other `SITEMAP` page has one.
- **The default is kept.** `preloadFor` returns `js || css` for every route, as SvelteKit's `default_preload` does (READ, `respond.js` l. 58), and adds the one font. `filename` is SvelteKit's documented field for this (READ, `types/index.d.ts` l. 1406–1408). Its `filter_fonts` normalizes the path to `node_modules/…` even under an isolated install (READ, `build/utils.js` l. 148–166).
- **Prerendering.** Every page is prerendered (`src/routes/+layout.ts`). The hook runs at build time only, once per page. The build, every route and the twins' handling (`handleHttpError` for `index.md`) passed in my run.
- **The Markdown twins.** `scripts/site/markdown.ts` writes them from the built HTML after `vite build`. The hook only changes a `<link>` in `<head>`. `build-output.spec.ts` checks every twin, and it passed.
- **Endpoints.** `llms.txt`, `search.json`, `sitemap.xml` and `robots.txt` are `+server.ts` routes. `resolve`'s `preload` applies only to page rendering. They are unchanged.
- **Routes with their own preload.** The home page and the landings (`landing.svelte`) preload IBM Plex from `<svelte:head>`. Their routes do not match, and the hook leaves them alone (EXECUTED: still present in the build). But they have the same placement defect (finding 5).
- **Is `src/hooks.server.ts` the right home?** Yes. Only `resolve` can put a link ahead of SvelteKit's module preloads. `handle` is the documented place to pass `resolve` options. With adapter-static and every page prerendered, nothing runs on Cloudflare: the worker serves files. In `vite dev` it runs per request, which is harmless. One note for later: a second `handle` must compose with this one through `sequence` (from `@sveltejs/kit/hooks`). Say so in the file's comment.

**Finding 4 (Low, on the branch if convenient).** `text-face.ts` hand-copies SvelteKit's input type as `PreloadInput`. Take it from the source instead: `Parameters<NonNullable<ResolveOptions["preload"]>>[0]`, with `ResolveOptions` from `@sveltejs/kit`. Then a change in the kit's type shows up in `bun run check`.

## 3. The checks

**The build-output test is robust to a renamed file: it fails loudly, and does not pass by accident.** If fontsource renames the file, `TEXT_FACE` stops matching the font's `filename`. Then no component page has the preload, and the test reports "0 preloads" on 79 pages. If only the content hash changes, `\.[\w-]+\.woff2` still matches. One weakness is that the name is written twice, in `text-face.ts` and in the test's regex. A rename then needs both edits, and the test's message does not say which one is stale. Also, the old `?url` import broke the build if the file vanished, and `TEXT_FACE` is a bare string that cannot do that.

**Finding 2 (Low, before the merge).** Give the name one source. The test imports `TEXT_FACE` and builds its regex from `path.basename(TEXT_FACE, ".woff2")`. Add one assertion that `TEXT_FACE` exists on disk. Then a fontsource rename fails with "the text face's source file is gone", in one place.

**The CLS budget.** `024`'s rule is max(worst × 1.2, 0.02) (READ, `budgets.ts` l. 187). The stub's check 1 sets the figure to `empty`'s 0.018, so 0.022, and lands the real figure at the re-base after `024b` to `024e`. The builder did exactly that. Is 0.022 right?

- **As the stub's check, yes.** It is what made label and native-select fail first. The test requires the CLS page to be a probe while the budget is above the floor (`budgets.test.ts` l. 241), which is why `empty` joined the probes. That is correct.
- **As a figure, it is already out of date.** `empty`'s 0.018 was the same swap, and this change takes it to 0 (the builder's run, mine, and the perf run). After the fix, the worst component page the builder found is `font-heading-ibm-plex-sans` at 0.0052, from one load. Under the rule, that gives the floor, 0.02. That meets the design lead's "0.02 or less".
- **Recommendation: keep 0.022 until the re-base, as the stub says.** The gap is 0.002. The re-base is already scheduled, and a fall needs no ruling (`024` decision 4). Setting 0.02 now would need a 3-load sweep figure, and the builder's sweep was one load a page. If the design lead wants 0.02 before the re-base, run `PERF_SWEEP=1` for `component` alone (about 79 × 3 loads, 25 minutes on this machine) and take its worst median.

**Finding 3 (Low, before the merge).** The ruling text reads `${SWEEP}; label's CLS fall at 024c (024c landing notes)`, but the figure's page is `empty`. Make it "component's CLS fall at 024c". Add one line to the comment above it: "`empty`'s 0.018 is pre-fix (the same swap; it reads 0 after `024c`); it stands until the re-base."

**The probes.** `native-select` and `empty` joined. `native-select` is right: it is the second page that shifted, and probing it keeps the stub's promise that a header that moves again fails on the next run. `empty` is required by the rule while 0.018 is the figure. At the re-base, the budget falls to the floor, so no CLS page needs a probe. Keep `label` and `native-select` anyway. They are the two pages with a line within a few pixels of wrapping, so they are the canaries for this defect, and each costs about 12 s a run. `empty` may leave then.

## 4. The heading face swap

`font-heading-ibm-plex-sans` reads 0.0052. Its specimens are set in IBM Plex, which arrives from the CSS at about 1.5 s. Every other page reads 0.0016 or less.

**Not a follow-up on its own.** It is a quarter of the floor, on one page, and it is the item's own specimen. A Plex preload there would add the LCP cost to one page to save 0.005. Fold it into finding 1: a metric-matched Plex fallback fixes it for that page and for every app's headings.

**Finding 5 (Low, a separate small change, lane S).** The same misplaced preload exists on five other pages. The home page and the four landings (`/start/`, `/foundations/`, `/components/`, `/brand/`) preload IBM Plex from `<svelte:head>` (EXECUTED: those five built pages, and no others). It lands at link 54 or 55, after 51 or 52 module preloads (EXECUTED, the built `index.html`, `start/index.html` and `brand/index.html`). Under HTTP/1.1 it is as late as Geist's was. Their CLS is 0 to 0.005 today, so nothing fails. Either extend `preloadFor` to put Plex first on those routes (rename it to fit), or remove those two links as inert. The stub was one page, so this does not belong in 024c.

## 5. A note on the harness

**Finding 6 (Info, for the landing notes).** `perf.spec.ts` serves with `Bun.serve`, which is plain HTTP/1.1 at six connections a host. The 2.6 s queue the builder measured is that protocol's queue. The host, Cloudflare, serves HTTP/2 and HTTP/3, which do not queue on connections (INFERRED). So for real readers, the `018` placement was probably less late than 2.9 s, the shift smaller, and 024c's benefit smaller. The LCP cost is about bandwidth, so it stays. The change is still right: SvelteKit's own ordering is correct on every protocol. Add one sentence to the landing notes, so the 2.6 s is not read as a production figure.

## 6. Constitution checks

- **§4.1, source, not a package:** unchanged. No item changed.
- **§4.3, tokens:** no token changed. That is why the fallback is a separate specification (finding 1).
- **§4.4:** the builder ran axe in both themes. No visual change: the six re-taken thumbnails were identical to the byte.
- **§5, small change:** one page template, no interface, no token, no dependency. The hook file is outside the stub's folder, and the landing notes say why. The check was seen failing first.
- **§6:** no prior art copied. The fallback technique was studied, and only prototyped here, in scratch.

## The scorecard

READ: the builder did not re-run it. EXECUTED: my perf run reads Button at 375.1 kB with an LCP median of 1,004 ms. Row 8's band is ≤ 1.5 s, so row 8 holds at 4. **No row moves.** The landing re-runs `site.ts --only kuiper` (AGENTS.md).

## Merge notes for `70336f4`

- **`src/lib/site/thumbnails/manifest.json` conflicts.** Both sides rewrote almost every hash: this branch through `component.svelte`, `024b` through `sitemap.ts` and `items.ts`, which `component.svelte` imports. Do not hand-merge it. Take `release/0.13.0`'s copy, then run `bun scripts/site/thumbnails.ts --hash-only`. Then re-take two pictures (`bun scripts/site/thumbnails.ts --no-build label native-select`) and confirm `git status` shows only the manifest, as the builder did. Then run `bun test tests/unit/thumbnails.test.ts`.
- **`tests/e2e/build-output.spec.ts` conflicts textually.** Both sides append a `describe` block after `020a`'s. Keep both: `024b`'s block, then `024c`'s. `024c`'s test reads `SITEMAP`, which `024b` now builds from `listedItems()`, not `registry.json`. The paths are the same, so the "more than 70 component pages" floor holds. Re-run the file after the merge.
- **No other overlap.** `024b` did not touch `budgets.ts`, `component.svelte`, `text-face.ts` or `hooks.server.ts` (READ, `git diff --stat cc278db 70336f4`). `listed-items.ts` is a ledger file. This branch does not touch it.
- **`023` lands soon.** It rewrites the thumbnails' manifest too (its review's merge note 2), and item sources (prop comments). Whichever of `023` and `024c` lands second takes the release's manifest and runs `--hash-only` again. `023` does not touch the head, the hook or the budgets. Its transfer changes do not touch `component`'s CLS figure.
- **After the merge:** `bun run check`; `bun test tests/unit/budgets.test.ts tests/unit/thumbnails.test.ts`; `build-output.spec.ts` and `site.spec.ts` in `chromium-light`; the perf project once (`E2E_PORT=57xx bun --bun playwright test --project=perf --no-deps`). `024b` cut Button to about 364 kB, so the probes' LCP should read a little under this review's figures. CLS should read 0 on all five `component` probes.
- **Order:** findings 2 and 3 on the branch (4 if convenient), then the merge of `70336f4`, then the checks, then the landing. `024c` is one of the four small changes before the re-base (`roadmap.md` §3).

## Disposition

**Land after fixes 2 and 3.** File finding 1 as a specification in lane T, finding 5 as a small change in lane S. Add finding 6's sentence and section 1's table (or a link to this review) to the landing notes. At the re-base, take `component`'s CLS to the floor. Keep `label` and `native-select` as probes.
