# Review of 020a — The site's CSS reads only code (the built change)

Reviews [`specifications/020a-the-sites-css-reads-only-code.md`](../specifications/020a-the-sites-css-reads-only-code.md), as the builder rewrote it on its branch. This reviewer wrote neither the specification nor the code (constitution §5).

- **Date:** 2026-11-15
- **Status:** in review. Land after fixes: finding 1 must be fixed before the merge. It is a change to the test alone. Findings 2 and 3 are write-ins. Findings 4 and 5 go to other entries.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** commit `081f9a6` on `worktree-agent-a97f5eb148f446972`, over `44cec73` (release/0.13.0). Its worktree is `.claude/worktrees/agent-a97f5eb148f446972`. The diff is 8 files: `src/routes/layout.css` (new), `src/routes/+layout.svelte` (one import), `tests/unit/css-sources.test.ts` and its two fixtures (new), `scripts/site/thumbnail-hash.ts` (one input), the thumbnail manifest, and the specification.
- **Re-ran:** Bun, 2026-11-15, with the machine's load average between 18 and 45. Nothing was written but this file. The worktree's `git status` was clean after every run, so `build:tokens` and `build:registry` are idempotent there. Scratch work is in the session scratchpad, `review-020a/`.
  - **The base build.** `git archive 44cec73` into the scratchpad, with `git init` (so `.gitignore` is honoured) and an APFS clone of `node_modules` (not a symlink; see 020's review). `bun run build` → main CSS `0.D4rl2DyZ.css`, 171,819 B: the builder's file, byte for byte in name.
  - **The change's build.** `bun run build` in the worktree → `0.D8jUYFqE.css`, 111,694 B: the builder's. gzip -6: 32,462 → **23,772 B**. Every other CSS chunk (`4.*.css` and LayerChart's nine) has the same name in both builds. `build/r/` is identical.
  - `bun test tests/unit/css-sources.test.ts` → **6 pass, 0 fail**, 2.1 s.
  - `bun test tests/unit/thumbnails.test.ts` → 6 pass, 4 fail at bun's 5 s timeout (load). With `--timeout 60000` → **10 pass, 0 fail**, so the manifest is fresh.
  - `bun test tests/unit/literals.test.ts` → 206 pass, 0 fail.
  - `bun run check` → 2,190 files, **0 errors, 0 warnings**.
  - `prettier --check` on the 8 changed files → clean.
  - **e2e, sampled,** through a scratch Playwright config that serves the worktree's `build/` with `vite preview` on **5631** (5199 untouched), light and dark projects:
    - `bar-glass.spec.ts` → **62 passed** (1.7 min). The case that timed out in the builder's full run, `:364` at 1440, took 21 s.
    - `axe.spec.ts`, `frames.spec.ts` and `theme.spec.ts`, filtered to `/components/button/` and `/components/chart/` → **22 passed**.
  - **Not run by me:** the full e2e suite, smoke and perf. Their figures are the builder's.
  - **Benchmark:** `bun scripts/bench/kuiper.ts --rev 081f9a6`, against the worktree's fresh build, and the same at `44cec73` against the base build. Every count is equal. Only the timestamps and `rev` differ. **No scorecard row moves.** 020a changes nothing the rubric scores; the CSS weight it removes is below row 7's anchors (Button 381 → 373 kB, the builder's perf figure).

## The check against evidence

1. **The scanner and the build** — met. EXECUTED, the test's own source resolution, run as a script: `compile(layout.css)` returns `{ base: "<worktree>/src/routes", pattern: "../../context", negated: true }` and the same for `../../tests`. The scanner then reads 1,526 files, 0 under either folder. The builder's figures hold.
2. **No class only from `context/` or `tests/`** — met after the fix, and seen failing before it. EXECUTED on the base tree, with the test and fixtures copied in and the root layout unchanged: **2 pass, 4 fail**. The `context/` case names 512 classes and the `tests/` case 66, among them `bg-fuchsia-950`, `row-8`, `row-15`, `inset-shadow-red-500` and `text-shadow-black`. The builder recorded 510 and 64. My base is `44cec73` itself, so a difference of 2 is noise. With the fix copied in: 6 pass. The attribution between the two cases is imprecise (finding 2).
3. **Equal to the CSS from code alone** — met as written, but it cannot fail in the way its name says (finding 1).
4. **The two `@source not` lines** — met. EXECUTED: delete either line and this case fails, along with three others.
5. **`app.css` untouched** — met. READ: `git diff 44cec73 081f9a6 -- src/app.css` is empty. EXECUTED: the byte-equality case passes. The `build:tokens` run in the build left the file unchanged.

### What the brief asked me to verify

- **The paths resolve.** `layout.css` sits in `src/routes/`, so `../../context` and `../../tests` are the repository's folders. EXECUTED, above.
- **Every route goes through the root layout.** READ:
  - `src/routes/+layout.svelte` is the only file in `src/` that imports `app.css` or `layout.css`. A grep for `app.css` finds only prose, the generator, the bench and the thumbnail hash.
  - The four groups, `(example)`, `(shell)`, `(site)` and `(view)`, have layouts that import no stylesheet of Tailwind's. `(site)` adds `site.css`, which has no Tailwind directive.
  - The root `+error.svelte` renders inside the root layout.
  - No route uses an `@` layout reset. There is no `src/error.html`.
  - No `.svelte` file uses `@reference` or `@apply`. So the site has one Tailwind root, and it carries the exclusions. The `/view/` frames that the thumbnails photograph are covered too.
- **No used class is lost.** EXECUTED: I diffed the class selectors of the two builds' main CSS. Before: 1,677 classes. After: 1,152. Removed: 525. **Added: 0.** I searched every removed class, as a whole token, through `src/`, `static/r/`, `scripts/`, `tokens/`, `registry.json` and the root Markdown. Six hits, none of them a use:
  - `antialiased` and `grayscale` are values of `font-smoothing` in `site.css`, not classes.
  - `rounded-l` and `rounded-r` are inside a regular expression in `scripts/bench/kuiper.ts`. `text-input` is inside one in `scripts/bench/targets.ts`.
  - `top-16` is in a comment in `app-shell-sidebar.svelte`. The class it uses, `md:top-16`, is still in the CSS. The scanner, run on that file, yields `md:top-16` alone.
  - No class in `src/` is built dynamically: a grep for `-${` in class positions finds ids and file names only.
  - The one route that imports from `tests/` (`(view)/view/code-agreement/+page.svelte`, the highlighter specimens) renders them as code text, never as class attributes.
- **Nothing on the page moves.** EXECUTED: a Playwright probe served both builds (5632 and 5633). It read 15 computed properties of every element on 8 pages (home, the components index, Button, Chart with the chart hovered, Sidebar, Brand colour, `/view/app-shell/`, Start), in light and dark. Apart from footers, which my base build stamps without a commit, there was one difference on every page: `:root`'s `--color-primary` (finding 4). The rest were spinner phases. Chart's marks, with the chart hovered, are identical.
- **Theme variables.** EXECUTED: the after CSS drops 118 custom-property declarations. Most are theme variables (`--color-*`, `--radius-*`, `--text-*`) that Tailwind emits only when a scanned file names them. I searched each one through `src/`, `static/r/` and every built JS and CSS file. Only LayerChart's CSS and one LayerChart chunk read any of them: `--color-primary` and `--color-surface-100`, each with a fallback (finding 4). `readToken` reads runtime variables (`motion-*`, `ease-*`, `mark-*`). None of them was removed.
- **The installed app's outputs are unchanged.** READ: `git diff 44cec73 081f9a6` touches nothing under `static/`, nor `registry.json`, `tokens/`, `src/lib/registry/` or `src/app.css`. EXECUTED: `build/r/` is identical between the builds. The worktree is clean after `build:tokens` and `build:registry`. `kuiper-theme` and the theme's CSS therefore ship as before.
- **The test's model is the build.** EXECUTED: I ran the test's own compile-and-scan as a script and diffed its class set against the real built CSS. It finds 1,137 classes. The build has 15 more selector-like tokens, all of them font-file hash fragments from `url()`s, and 2 more variables, LightningCSS's `light-dark()` fallbacks. So the model matches Vite at 4.3.3. That is today's match, not a guarantee (finding 1, second part).

## Findings, most severe first

1. **Medium. The check cannot see a scan that is too narrow, and case 3's name says it can.** (`tests/unit/css-sources.test.ts:117–125`)
   - **The defect.** "The site's CSS equals the CSS built from code alone" builds "code alone" from the stylesheet's own sources plus the two negations. After the fix, that is the same scan as the site's, so the case reduces to case 2: removing `context/` and `tests/` changes nothing. Nothing asserts that the site still reads all its code.
   - **EXECUTED.** In a scratch copy of the fixed tree I added `@source not "../routes";` to `layout.css`. The model's CSS lost 69 classes. **The test passed, 6 of 6.** `@import "../app.css" source(none); @source "../lib";` (605 files read) also passed.
   - **Why it matters.** The builder's own "Findings for later" proposes naming the folders the site reads instead of the ones it must not. That edit is exactly where a scan becomes too narrow, and the guard written for it would stay green.
   - **Second part.** The test copies `@tailwindcss/vite` 4.3.3's source resolution by hand (`compiled()`, the `compiler.root === null` branch). A Tailwind bump that changes it would leave the test checking a model that no longer matches the build. 020's change review asked for an assertion on the built CSS. The rewrite dropped it.
   - **Required change:**
     - Add a case like the one below. In the scratch copy it passes on the fixed tree. It fails, naming 71 classes, with `../routes` excluded.
       ```ts
       test("every class src/ yields that makes a rule is in the site's CSS", () => {
         const read = scan(site.sources);
         const wanted = [...scan(all("src"))].filter((c) => !read.has(c)).sort();
         const css = site.design.candidatesToCss(wanted);
         expect(wanted.filter((_, i) => css[i] !== null)).toEqual([]);
       });
       ```
     - Rename case 3 to say what it proves ("excluding `context/` and `tests/` changes nothing in the site's CSS"), or drop it as a duplicate of case 2.
     - Write-in, not required: one assertion in `build-output.spec.ts`, which already reads `build/`. The main CSS holds none of `.bg-fuchsia-950`, `.row-8`, `.row-15`, `.inset-shadow-red-500` or `.text-shadow-black`. EXECUTED: the base build holds 1, 1, 1, 2 and 2 of them, and the fixed build 0 of each. They live only in `context/` and `tests/`, so they make good canaries. This ties the check to the real build across a Tailwind bump.
2. **Low. A failure names the wrong folder.** (`css-sources.test.ts:73–82`)
   - **EXECUTED.** Delete only `@source not "../../context"`. The `tests/` case also fails and names 54 classes as "found only under tests/", though `tests/` is still excluded. Delete only the `tests` line, and the `context/` case names 54 classes the same way.
   - **Cause.** `onlyIn` compares with a scan that excludes both folders. So a class that appears in both is charged to whichever folder is asked about.
   - **Fix.** Give `onlyIn` an `excluded` parameter that defaults to `[dir]`, and pass `EXCLUDED` from the fixtures case, which reads through the unexcluded `app.css`. EXECUTED in the scratch copy: each deleted line now fails its own folder's case and leaves the other green, and the fixtures case still passes.
3. **Low. No test names the new thumbnail input.** (`tests/unit/thumbnails.test.ts:99–109`)
   - **The deviation is right.** A thumbnail is a picture of a page whose CSS `layout.css` now decides. Without it among the inputs, an edit to `layout.css` would leave stale pictures marked fresh. The builder remade all 150, and 0 changed in bytes. Only the manifest moved, and the stale-check passes (EXECUTED, with a longer timeout).
   - **The gap.** The input-list case names `src/app.css` and not `src/routes/layout.css`. Today the manifest's hashes guard the line. A regenerated manifest would not.
   - **Fix.** Add `"src/routes/layout.css"` to that list. Optional: `src/routes/+layout.svelte`, which chooses the stylesheet, is not an input either. That gap predates 020a.
4. **Low, for `029a` (not 020a's to fix). LayerChart's `var(--color-primary, currentColor)` no longer finds a value on the site.**
   - **EXECUTED.** Before, the theme layer declared `--color-primary: var(--primary)`, because research memos in `context/` name `--color-primary`. After, `:root`'s `--color-primary` computes empty in both schemes on every page probed. LayerChart reads it with a `currentColor` fallback for `.lc-highlight-bar`, `.lc-highlight-point` and BarChart's default fill (`chart.*.css`).
   - **No visible change today.** The site's chart examples give every mark an explicit class, and the probe with the chart hovered found the same fills and strokes.
   - **This is the change working.** An installed app never had the variable, unless its own source named it. The site now behaves like the app, and that also makes `029a`'s "fails today" checks honest. The chart item should set the variables LayerChart reads. `029a` covers `--color-surface-100` and `--color-surface-content`. It should add `--color-primary`.
5. **Low, for the roadmap (the builder's finding, confirmed and measured). Other non-code folders still feed the CSS.**
   - **EXECUTED.** The fixed scan reads 595 files under `static/v*/r/`, 77 under `static/r/`, 22 under `scripts/`, 15 root files (the Markdown among them) and `tokens/`.
   - **19 classes that make a rule come only from those,** for example `bg-red-500`, `text-white`, `duration-300`, `p-[13px]`, `border-x` and `data-open:hover:bg-sidebar-accent`.
   - **Fix.** A later small change could scan only `src/` (and `static/r/` if wanted), with `source()` and `@source`. It needs finding 1's guard first.
6. **Note. The test's imports are acceptable.**
   - `@tailwindcss/node` and `@tailwindcss/oxide` are transitive, both 4.3.3, both pinned by `bun.lock` through `@tailwindcss/vite`.
   - `__unstable__loadDesignSystem` only filters candidates down to those that make a rule, so a failure can name classes. If a Tailwind bump renames it, the import fails loudly. It never passes silently. The same export is what Tailwind's Prettier plugin and IntelliSense use.
   - So the cost of a bump is one red test and a one-line fix. Recording this in the test's header is enough.
7. **Nit. "Every file git tracks."** The specification's defect and the test's header say Tailwind scans every file git tracks. It scans every file `.gitignore` does not exclude, tracked or not. A drafted, uncommitted memo feeds the CSS too. One word in each place.

## Deviations

1. **`thumbnail-hash.ts` gained an input** — accepted. See finding 3.
2. **Two transitive imports and the unstable API** — accepted. See finding 6.
3. **Two fixtures** — accepted. Each is a short, cited copy. Each is under `tests/`, so the site never reads it. The fixtures case proves that the check reads the right sources (EXECUTED: it passes on both trees).

## Constitution checks

- **§4.1 Source, not a package:** holds. Nothing an app installs changed (above).
- **§4.3 Tokens are the one source:** holds. No colour or size was added. `layout.css` holds only an import and two source rules. The literal lint passes.
- **§4.5 and §4.6, pinned and named dependencies:** hold. `package.json` and `bun.lock` are unchanged. The two packages the test imports are locked (finding 6).
- **§5, a small change:** holds. One new file and one import line, plus the test and one hash input (deviation 1). There is no interface change and no new token. The check was seen failing first, and I reproduced it.
- **§5, the scorecard:** run, above. No row moves.
- **§6, never break an installed app silently:** holds. `app.css`, `static/r/` and `registry.json` are untouched, and the test pins `app.css` to its generator.
- **§6, never commit without the owner:** the commit is on the build branch, as briefed. Nothing is merged or pushed.

## Verdict

Land after fixes. The change is correct:

- The site's one Tailwind root now excludes `context/` and `tests/`.
- Every route loads it.
- No class or variable that code uses was lost.
- The pages compute the same styles.
- What an app installs is untouched.

Finding 1 must be fixed before the merge: add the "every class from `src/`" case and rename or drop case 3. Finding 2 is best done at the same time, since it touches the same function. A reviewer can re-check both by running the mutation above. Finding 3 is a one-line write-in. Finding 4 goes to `029a`'s specification, and finding 5 to the roadmap as a later small change.
