# 024c — Two component page headers hold still

- **Status:** built; change-reviewed (`reviews/024c-component-headers-hold-still-pr-2026-11-16.md`, land after fixes); the design lead's ruling and the review's fixes applied; `release/0.13.0` merged in (Landing notes). Awaiting the landing. Written to be built after `024` lands. Lands before `030`, with `024b`, `024d`, `024e` and one re-base sweep (`roadmap.md` §3, "`024` before `030`").
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one place). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `024` (budgets per template). Lane S: the component page's header, under `src/lib/site/page/`.
- **Found by:** `024`'s build sweep (Landing notes, ruling 5, "Findings for other lanes" 1) and its change review, finding 4 (`reviews/024-budgets-per-template-pr-2026-11-16.md`).

## The defect

Two component pages shift their layout while they load. Under `015` decision 23's profile (3 cold loads each, `024`'s sweep, EXECUTED):

- `/components/label/`: CLS **0.09** in every run.
- `/components/native-select/`: CLS **0.087** in every run.
- Every other component page: 0.018 or less (`empty` 0.018, then 0.005 and below).

Unthrottled, `native-select` shows one shift of 0.087 at about 312 ms (EXECUTED, a `layout-shift` observer with its `sources`): the page-tools row and the section below move up 25.6 px, and one header line moves from x = 307 to x = 640. A line of the page header wraps before hydration and not after, so everything under it moves. `label` shows no shift unthrottled, so its shift depends on timing.

The effects:

- **`component`'s CLS budget is 0.108,** from `label`'s 0.09 (`024` decision 4: the worst page × 1.2). That is above 0.1, Core Web Vitals' "good" line. On the other 66 component pages the guard is 0.108, not 0.02. `030` adds a status line and a cost figure near the top of every component page, the kind of change that shifts layout. Under 0.108 a shift of up to 0.1 would pass.
- **A reader sees the page jump** as it hydrates.

## The fix

The builder finds what re-wraps (the header's title row, its facts line or its page tools) and makes the server's markup and the hydrated markup take the same width. The likely cause is content or a class that only the client renders. The fix is in the component page's header in `src/lib/site/page/`. No item, token or page text changes.

## The check

1. **Seen failing first:** in `tests/e2e/budgets.ts`, `component`'s CLS figure is set to the worst page that is not one of the two (`/components/empty/`, 0.018 × 1.2, so 0.022), and `native-select` joins `component`'s probes beside `label`. `024 paint: component: /components/label/` and `/components/native-select/` fail on CLS. The output goes in the Landing notes.
2. After the fix, both pass, under the same figure.
3. The new figure lands at the re-base sweep that follows `024b`, `024c`, `024d` and `024e` (`024` decision 4: every re-base takes every fall; a fall needs no ruling). Its `ruling` names that re-base's landing note.

The perf project, `bun run check` and the `light` and `dark` browser projects stay green.

## Landing notes

Built by a builder on `release/0.13.0` at `cc278db`, 2026-11-16. The machine's load average was 18 to 67 on 10 cores throughout.

### The cause: the text face arrives late, not hydration

The shift is a **font swap**. Nothing re-renders on hydration.

- **What moves.** Under the profile (EXECUTED, a `layout-shift` observer with its `sources`, one throttled load each):
  - `native-select`, one shift of 0.087 at about 3.06 s. The facts line's last entry, "Based on shadcn-svelte's native-select", sits on a second row at (307, 261), 285 px wide, and moves up to the end of the first row at (640, 235), 281 px wide. The page tools and the Examples section move up 26 px with it.
  - `label`, one shift of 0.09 at about 2.93 s. In the first example frame's header ("Variants"), the theme switch sits on a second row at (328, 443) and moves up to the right of the intro at (792, 380). The stage and the code block below move up 46 px. The facts line's "shadcn-svelte's label" narrows from 154 to 150 px at the same moment.
- **What arrives then.** Geist's latin file (`geist-latin-wght-normal.woff2`, 29 kB) finished at 2.89 s on `label` and 2.97 s on `native-select`, within 50 ms of each shift. The first paint is at about 0.9 s. Until 2.9 s the text shows in the fallback (`font-display: swap`; the stack is `"Geist Variable", system-ui, sans-serif`). The fallback is a little wider than Geist. Where a line fits in Geist and not in the fallback, it wraps until Geist arrives, then un-wraps.
- **Proof.** With the Geist file blocked (`page.route(…).abort()`), both pages read **CLS 0.0001** under the profile: the text never swaps. The 0.0001 left is the heading face (IBM Plex Sans) arriving at 1.5 s, a 3 px move of the title.
- **Why the font came so late, although `018` preloads it.** The preload was in `component.svelte`'s `<svelte:head>`. SvelteKit writes a page's `<svelte:head>` after its own link tags, and a component page has **70 module preloads** ahead of it. Over HTTP/1.1 (six connections a host) the font request waited for a free connection: queued at 186 ms, **sent at 2,620 ms**, done at 2,942 ms (EXECUTED, the resource timing on `native-select`). The other two faces, found later in the CSS at 750 ms, were sent at once and done by 1.5 s. `fetchpriority="high"` on the preload changed nothing (EXECUTED: 0.0871 and 0.0901, the font still at 2.97 and 2.93 s).
- **Why the stub's reading was "after hydration".** The shift falls near the load event (3.0 s), where hydration also ends. Unthrottled, the font comes before the first paint, so `label` showed no shift. `native-select`'s 312 ms shift in `024`'s notes is likely the same swap on a loaded machine (INFERRED; unthrottled, this build shows none on either page).
- **The other pages.** The facts line and the frame header are the same on every component page. Only these two have a line within a few pixels of wrapping, so only these two moved by much (INFERRED). `empty`'s 0.018 was the same swap: it reads 0 after the fix (below).

### The fix: SvelteKit's own font preload, ahead of the scripts

**Precedent.** `018` found this very shift on `/components/code-block/` (CLS 0.089, the facts line wrapping in the fallback) and fixed it two ways: a narrower gap, and the Geist preload "so the header does not reflow when it arrives" (`018` landing notes). The preload was the right fix, placed where it could not work. This change keeps it and moves it.

- **`src/lib/site/page/text-face.ts`, new.** `preloadFor(routeId)` is SvelteKit's default preload (scripts and styles) plus, on a component page's route (`/(site)/components/<name>`), the font whose source is Geist's latin file. It matches on SvelteKit's `filename`, the source path, never the hashed one.
- **`src/hooks.server.ts`, new, one line.** `handle` passes `preloadFor(event.route.id)` to `resolve`. SvelteKit writes font preloads before its module preloads (READ, `render.js`: the font loop runs first and both go to the same link list), so the font is the first request after the HTML. The site is prerendered, so this runs at build time only.
- **`component.svelte`.** The `<svelte:head>` preload and its `?url` import go, so the file is requested once. A comment says where the preload now comes from.
- **What a reader sees.** The face is in before the first paint, so the header paints once, in Geist. Now the font is requested at 171 ms and done by 661 to 770 ms (EXECUTED), before the first paint.
- **Out of lane, and why.** The stub put the fix in `src/lib/site/page/`. The logic is there (`text-face.ts`). The hook file is outside it, because only `resolve` can place a link ahead of the module preloads. `hooks.server.ts` did not exist, and no other build touches it. It changes only component pages. `sitemap.ts`, `items.ts`, `listed-items.ts`, `build-registry`, item source and the `027b` items are untouched.
- **The thumbnails' manifest.** `component.svelte` is an input of each example thumbnail's hash (`018` change review), so 62 hashes went stale. `bun scripts/site/thumbnails.ts --no-build label native-select button` re-took six pictures **byte for byte the same** (`git status` showed only the manifest), so the pictures stand. `bun scripts/site/thumbnails.ts --hash-only` rewrote the manifest: 62 lines.
- **Not chosen: a metric-matched fallback face alone.** A fallback face on a local face, with `size-adjust` and the ascent, descent and line-gap overrides, takes Geist's room, so the swap moves nothing. The change review measured it (`reviews/024c-component-headers-hold-still-pr-2026-11-16.md` §1, EXECUTED: five variants of this build, 3 interleaved cold loads each under the profile, and Arial tuned to 103%, the best case). Where its face exists it fixes the shift at a lower LCP: `label` 0.0001 at 816 ms, `native-select` 0.0001 at 844 ms, with no preload. **Where its local face is missing, it does nothing:** `label` 0.0901, `native-select` 0.0869, the full shift. `local("Arial")` matches on macOS and Windows, not on stock Linux or Android (INFERRED). The perf job runs on `ubuntu-24.04`, and CLS gates on every machine (`024` decision 8). The preload does not depend on the reader's fonts. The fallback would also change `--font-sans`, a token, and the `kuiper-theme` CSS every app installs, so it is not a small change. With the preload, adding the fallback too gains the site nothing, since the fallback never shows.
- **Not chosen, either.** `font-display: optional` would leave a slow reader in the fallback for the whole visit. Re-flowing the facts line or the frame header would hide the two cases and leave the swap on every page.
- **The harness serves HTTP/1.1.** `perf.spec.ts` serves through `Bun.serve`: plain HTTP/1.1, six connections a host. The 2.6 s queue is that protocol's queue. The host serves HTTP/2 and HTTP/3, which do not queue on connections (INFERRED), so a real reader's swap under `018`'s placement was likely earlier and smaller, and so is this change's benefit. The LCP cost is bandwidth, so it stays. SvelteKit's order is right on every protocol. Read the 2.6 s as the harness's figure, not production's. `text-face.ts` says so too.

### The change review, and the design lead's ruling (2026-11-16)

The change review (`reviews/024c-component-headers-hold-still-pr-2026-11-16.md`): **land after fixes**. It re-ran check, the budgets unit test, build-output and site in `chromium-light` (68 passed) and the perf project (28 passed, CLS 0 on all five `component` probes).

**The design lead's ruling: keep the preload.** 024c lands as built, with the fixes below. The fallback face is not this change.

Applied on the branch, in "024c: the review's fixes":

- **Finding 2.** The build-output test imports `TEXT_FACE` and builds its regex from the file's base name, so the name has one source. A new test, "the text face's source file is on disk", fails with "the text face's source file is gone" if fontsource renames it.
- **Finding 3.** The CLS ruling text reads "component's CLS fall at 024c". The figure's page is `empty`. Its 0.018 was the same swap and reads 0 after this change. It stands, and the budget stays 0.022, until the re-base. At the re-base the budget falls to the floor, `empty` leaves the probes, and `label` and `native-select` stay as canary probes. The comments in `budgets.ts` say so.
- **Finding 4.** `PreloadInput` is `Parameters<NonNullable<ResolveOptions["preload"]>>[0]`, from `@sveltejs/kit/hooks` (where kit 3 declares it), so a change in the kit's type shows in `bun run check`. The hook's comment says that a second `handle` composes with this one through `sequence`.
- **Finding 6.** The HTTP/1.1 note above.

Findings 1 (metric-matched fallback faces in the theme, a specification in lane T) and 5 (the Plex preload on the home page and the four landings, a small change in lane S) are the design lead's to file.

### The check, seen failing first

`tests/e2e/budgets.ts`: `component`'s CLS figure is `/components/empty/`, 0.018, so the budget is **0.022** (0.018 × 1.2, rounded up). `native-select` joins the probes beside `label`. `empty` joins them too: `budgets.test.ts` requires a template's CLS page to be probed when it sets the budget above the 0.02 floor (`024` deviation 3). `empty`'s 0.018 is a pre-fix figure, the same swap (it reads 0 after the fix). The ruling, "component's CLS fall at 024c", names this note. Five probes in `component` now: `sidebar`, `button`, `label`, `native-select`, `empty`.

`tests/e2e/build-output.spec.ts`, new: **"024c: component headers hold still › every component page preloads Geist's latin file once, before its first script; no other page preloads it"**. It reads every built page in `SITEMAP`.

On `cc278db`'s source with only the test changes, `E2E_PORT=5763 bun --bun playwright test --project=perf --project=chromium-light --no-deps --grep "024c|024 paint: component:"`: **3 failed, 3 passed** (1.9 min).

- `024 paint: component: /components/label/`: "CLS: Expected: <= 0.022, Received: 0.09". Runs 0.09, 0.09, 0.09.
- `024 paint: component: /components/native-select/`: "CLS: Expected: <= 0.022, Received: 0.087". Runs 0.087, 0.087, 0.087.
- The build-output test: 79 pages "after a script", the 79 component pages.
- `sidebar`, `button` and `empty` (0.018, 0.018, 0.018) passed.

After the fix, the same command: **6 passed** (2.0 min).

### Before and after (the profile, 3 cold loads, medians)

| Page | CLS before | CLS after | LCP before, ms | LCP after, ms | Transfer, kB |
|---|---|---|---|---|---|
| `label` | **0.09** | **0** | 872 | 916 | 334.7 → 334.6 |
| `native-select` | **0.087** | **0** | 884 | 972 | 342.6 → 342.5 |
| `empty` | 0.018 | 0 | 884 | 932 | 331.0 → 330.9 |
| `button` | 0 | 0 | 912 | 1,008 | 375.3 → 375.1 |
| `sidebar` | 0 | 0 | 1,088 | 1,144 | 405.1 → 405.0 |

**The probe sweep of every component page,** one throttled load each, 79 pages, before and after (EXECUTED, a scratch script that serves `build/` as `perf.spec.ts` does, with the `layout-shift` observer; not committed):

- **Before:** `label` 0.0901, `native-select` 0.0871, `empty` 0.0177; every other page 0.0052 or less.
- **After:** the worst is `font-heading-ibm-plex-sans`, **0.0052** (its specimens are set in the heading face, which still swaps at 1.5 s; under the floor). Then `read-token` 0.0016, `input-otp` 0.0003; every other page 0.0001 or 0. `label`, `native-select` and `empty` read 0.0001.

No other page was found.

**The cost: LCP rises 44 to 96 ms on the component probes.** The font's 29 kB now loads before the first paint, beside the stylesheets, where before it loaded after. Every probe stays under `component`'s 1,270 ms (the slowest, `sidebar`, at 1,144). Button reads about 1,008 ms, inside row 8's ≤ 1.5 s band. Transfer is the same to 0.2 kB (the link left the HTML). This is the trade `018` chose when it preloaded the face. No budget changes for it.

### What the component figure becomes

At the re-base sweep after `024b`, `024c`, `024d` and `024e`: `component`'s worst CLS would be about **0.005** (`font-heading-ibm-plex-sans`), so its budget falls to **the floor, 0.02**, as `024` ruling 5 said. Then no CLS page needs a probe. `empty` leaves the probes. `label` and `native-select` stay, as canaries for this defect: they are the two pages with a line within a few pixels of wrapping (the change review, finding 3). Until then the figure is `empty`'s pre-fix 0.018 and the budget 0.022, from the sweep of 2026-11-16, under Core Web Vitals' 0.1.

### The gate

- `bun run check`: **0 errors, 0 warnings**, 2,359 files. `bun run lint`: clean.
- `bun test ./tests/unit --timeout 120000`: **1,668 pass, 2 skip, 3 fail** before the manifest was rewritten; the thumbnails test then passed alone (10 of 10). The other two fails are timing budgets of the highlighter, `highlight-session.test.ts` ("4 ms or less per chunk": 21 ms, then 38 ms at load 67) and `highlight.test.ts` ("1.5 s or less first pass": 3.9 s, then 9.2 s). Neither reads a file this change touches. They are the machine's load.
- `E2E_PORT=5764 bun --bun playwright test --project=chromium-light --project=chromium-dark tests/e2e/site.spec.ts tests/e2e/axe.spec.ts tests/e2e/build-output.spec.ts tests/e2e/frames.spec.ts`: **1,000 passed** (12.8 min, 4 workers). That covers every component page, axe in both themes, and the build-output test.
- `E2E_PORT=5765 bun --bun playwright test --project=perf --no-deps`: **28 passed** (7.3 min with the build): the server check, 9 transfer tests and 18 paint probes. The five `component` probes read CLS 0 in every run; LCP medians `sidebar` 1,148, `button` 1,024, `label` 892, `native-select` 960, `empty` 916 ms (budget 1,270).
- `bun scripts/site/release-check.ts --before-ci`: **exit 0**, with its four named skips (the ledger, the matrix run, the runner's LCP figures, the cost run).
- A third try of the two highlighter timing tests at load 36: 10 ms per chunk and 1.95 s, still over. They fall with the load each time (21 → 10 ms; 9.2 → 1.95 s).
- Not run: Firefox and WebKit, smoke, the screen-reader suite. The change is one `<link>` in the head of component pages, in a different place.
- **The scorecard** was not re-run by the builder: no item, no count and no page's text changed, and row 8 reads Button, whose LCP (about 1,010 to 1,025 ms) stays in band 4 (≤ 1.5 s). The landing re-runs it (AGENTS.md).

### The merge of `release/0.13.0` at `5971a1a` (`024b`, `023`, and context)

The coordinator named `1a116a4`. The release had moved one context commit on, to `5971a1a` (this change's review and two roadmap lines), and the merge took the tip. The change review's merge notes, followed:

- **`src/lib/site/thumbnails/manifest.json`** conflicted. I took the release's copy, then ran `bun scripts/site/thumbnails.ts --hash-only`: 62 hashes, the component pages' example thumbnails. `bun scripts/site/thumbnails.ts label native-select`, with a fresh build, re-took four pictures **byte for byte the same** (`git status` showed nothing new), and left the manifest as `--hash-only` wrote it.
- **`tests/e2e/build-output.spec.ts`** conflicted, where both sides had appended a block after `020a`'s. I kept both: `024b`'s block, then `024c`'s.
- `bun install --frozen-lockfile`: no changes.

The checks on the merged tree:

- `bun run check`: **0 errors, 0 warnings**, 2,379 files.
- `bun test tests/unit/budgets.test.ts tests/unit/thumbnails.test.ts --timeout 120000`: **70 pass, 0 fail**.
- `E2E_PORT=5766 bun --bun playwright test --project=chromium-light tests/e2e/build-output.spec.ts tests/e2e/site.spec.ts`: **70 passed** (1.2 min). That includes both `024c` tests.
- `E2E_PORT=5767 bun --bun playwright test --project=perf --no-deps`: **28 passed** (6.4 min with the build). The five `component` probes read **CLS 0 in every run**. LCP medians: `sidebar` 1,148, `button` 984, `label` 896, `native-select` 940, `empty` 896 ms (budget 1,270). Transfer after `024b`: `sidebar` 395.2, `button` 364.6, `label` 323.4, `native-select` 331.7, `empty` 319.8 kB.
