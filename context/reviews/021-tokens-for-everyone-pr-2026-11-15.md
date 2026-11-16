# Review of 021 — Tokens for everyone (the built change)

Reviews [`specifications/021-tokens-for-everyone.md`](../specifications/021-tokens-for-everyone.md) as built, with its Landing notes as the builder wrote them on its branch. This reviewer wrote neither the specification nor the code (constitution §5).

- **Date:** 2026-11-15 (finished just after midnight, 2026-11-16)
- **Status:** **Land.** No finding blocks the merge. Findings 1 to 3 are small write-ins. They may ride the merge commit or a later small change. Finding 4 is a knock-on for `031`'s build, not a fix here. Finding 5 is the Penpot import (deviation 12). It stays with the design lead, and row 12 stays 0 until it is run.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** branch `worktree-agent-af17fa9f4072eb4ec` (worktree `.claude/worktrees/agent-af17fa9f4072eb4ec`): `b37dcf4` (the build) and `8916944` (the scorecard), on `421cea7`. The net change is `git diff 421cea7 8916944`: 53 files, +26,224 / −1,255. Most of the added lines are generated: the 16 published copies and the three fixtures.
- **Re-ran:** Bun 1.4.4, 2026-11-15 to 16, on a machine at load average 10 to 52. Nothing in the repository was written but this file. The worktree's `git status` was clean before and after.
  - Builds and browser runs used `git archive` exports of `421cea7` and `8916944` in the session scratchpad (`review-021/base`, `review-021/head`), each with a copy-on-write clone of the worktree's `node_modules`. Both trees are the same as the commits byte for byte, since `bun.lock` did not change.
  - `vite preview` served on **5741** (Playwright) and **5742** (screenshots). 5199 was not used.
  - A scratch Playwright config held the port, since `playwright.config.ts` fixes 4173.
  - The merge with `release/0.13.0` was simulated in a scratch clone (`review-021/merge`). Scripts, logs and screenshots are in `review-021/`.
  - The runs:
  - `bun run check`, **in the worktree** → 2,198 files, **0 errors, 0 warnings**.
  - `bun run lint`, in the worktree → clean. `scripts/lint-literals.ts` → 0 literals, 1 allowance (L24), unchanged.
  - **Token unit tests, in the worktree:** `tokens-dtcg`, `tokens-lifecycle`, `tokens-published`, `tokens-unchanged`, `tokens`, `registry`, `generated` and `brand-sources` → **340 pass, 0 fail**.
  - **Browser runs, Chromium, `light` and `dark`:** `tokens.spec.ts`, `tokens-files.spec.ts` (T16 and T17; T17 launches Firefox and WebKit itself), and `axe.spec.ts` on `/foundations/tokens/` at 360, 768 and 1280 → **160 passed, 4 skipped, 0 failed**. The four skips are `tokens.spec.ts`'s light-only flat-screen tests in the dark project, by design. T17 passed in all three engines in both projects. axe found **0 violations** on the tokens page at every width in both schemes. The same filter also ran 62 other axe pages, all passing.
  - **Byte identity, built independently.** Detail under "The byte-identical claim".
  - **DTCG conformance, re-run independently.** Ajv 8.17.1 and `@terrazzo/cli` 2.10.0, in `review-021/dtcg/`, outside `bun.lock`. Detail under "DTCG conformance".
  - **The bench:** `kuiper.ts --rev 8916944`, `--rev ea1f9bd`, `--rev 874c5da`, and `--rev 634ab09` (the root commit, with neither token shape).
  - **Criterion 12, built:** `bun run build` in both exports. Each Markdown twin and `search.json` was compared byte for byte.
  - **Two probes of my own,** on the scratch export, restored after: an extra resolver context naming a missing file, and `alpha: 1` on a primitive (findings 4 and 3).
  - **The merge:** `021` was merged onto `874c5da` in the scratch clone and its five conflicts were resolved. Then `build:tokens`, `thumbnails.ts --hash-only` and `build:registry` ran, and the full unit suite.
  - **Screenshots:** the "Use the tokens anywhere" section at 1440 and 390, light and dark (`review-021/shots/`).
  - **Not run by me:** the full e2e suite, the smoke suite (`dev-loop.test.ts`), `release-check.ts`, and the perf project. Their figures are the builder's.

## Acceptance criteria against evidence

1. **The format** — met. EXECUTED: T1 to T6 pass. Each token file's first key is the 2025.10 format `$schema`. The resolver's is the resolver schema, with `version: "2025.10"`, one modifier `scheme`, contexts `light` and `dark`, and default `light`. Decision 7's resolver is in the tree verbatim.
2. **Every colour** — met. EXECUTED (my count): 224 `color` tokens, which is 48 + 61 × 2 + 16 + 8 × 2 + 7 × 2 + 4 × 2. Every role and code slot is an alias. T2 holds the figure.
3. **No forbidden unit** — met. EXECUTED (my count): 36 `dimension` tokens. 34 are literals, all `px`, and 2 are aliases (`elevation.y` and `elevation.blur`). No `rem`, no `em`. Exactly 18 tokens carry a `unit` extension, 13 `em` and 5 `vw`, the ones criterion 3 lists. Each says its unit in its words (T6).
4. **The schemes** — met. EXECUTED: T4. The validator also enforces this at build (deviation 2).
5. **Descriptions** — met. EXECUTED: T5 and T6. `words.ts` is gone.
6. **The lowering** — met. EXECUTED: criterion 6's tests in `tokens-unchanged.test.ts`. READ: the search source imports the five files and calls `lowerTokens`. It runs only in the prerendered `search.json` endpoint. No client chunk under `build/_app/` holds the vendor key or the validator's words (EXECUTED, grep).
7. **Today's object** — met. EXECUTED: T7.
8. **Byte-identical CSS** — met, and reproduced independently (below).
9. **`kuiper.css`** — met. EXECUTED: T9 passes. Separately, I checked three things. All 28 `var()` references in it resolve to a property the file declares, so it is self-contained. Every one of its 169 custom-property declarations has a value that `src/app.css` declares for the same name. Its top level is exactly the comment, `:root`, `.dark` and one `@media`.
10. **The published files** — met. EXECUTED: `static/r/tokens/` and `static/v0.13.0/r/tokens/` are identical. The four source copies and the record equal `tokens/` byte for byte. They are the only new files under `static/`.
11. **CSS names** — met. EXECUTED: T11.
12. **The site reads the same** — met. EXECUTED: built from both exports, each Markdown twin under `/foundations/` is identical except the tokens page. `/foundations/code/` and `/foundations/colour/` are among the identical ones. `search.json` is identical. The tokens page's twin differs only in its first paragraph and the new section. T16 passes.
13. **The record** — met. EXECUTED: T12 to T14. The record holds 24 entries. `RENAMES` holds 0 custom-property rows (the builder's figure, READ).
14. **The validator** — met. EXECUTED: T15 (in `tokens.test.ts`).
15. **Any stack** — met. EXECUTED: T17 in Chromium, Firefox and WebKit. The nested `.dark` hairline reads `rgb(122, 115, 102)`.
16. **The smoke loop** — the builder's figure (139 pass). READ: the test edits `motion.micro.$value.value`.
17. **The bench** — met. EXECUTED:
    - `--rev 8916944` prints 48 primitives, light and dark, 61 roles, 61 described, 15 groups, 317 `$value`, 317 `$type`, 286 descriptions and 129 contrast pairs.
    - `--rev ea1f9bd` prints the old shape's counts, with `groups` 13 (deviation 11).
    - At the root commit it exits 1 and names the commit.
18. **The changelog** — met. EXECUTED: the two `registry.test.ts` checks. Finding 2 is wording only.
19. **The suites** — `check`, lint, the literal lint and the token units EXECUTED. The browser files I ran pass. The full unit suite was run on the merged tree (under "Merge notes"). The rest are the builder's figures.
20. **Tests first** — credible. The Landing notes give red and green counts by file, and three mutation proofs. I did not replay the red run.
21. **The scorecard** — row 5 met, 1 → 4. Row 12 held at 0, as the criterion says it must be without the Penpot evidence (finding 5).

## DTCG conformance

- **Format and version.** Every token file declares `https://www.designtokens.org/schemas/2025.10/format.json` as its first key. The resolver declares `.../resolver.json` and `version: "2025.10"`. No draft feature is used. No `$ref` sits in a token file. Aliases are curly braces only.
- **Ajv 8.17.1, re-run by me** (`strict: false`, the two schemas fetched 2026-11-15, both 200 `application/json`):
  - The three token files, both flattened files and the resolver are **valid**. I validated the published copies under `static/v0.13.0/r/tokens/`.
  - **Controls:**
    - a `dimension` in `em` is rejected;
    - an 8-digit hex is rejected;
    - the real base file with one component set to 2 is rejected;
    - a `number` with a vendor `unit` is accepted;
    - a group-level `$type` is accepted (Kuiper's own validator forbids it, decision 4).
- **`tz check` (`@terrazzo/cli` 2.10.0), re-run by me:** "No errors" on `kuiper.flat-light.tokens.json`, `kuiper.flat-dark.tokens.json` and the resolver. A control copy of the flat dark file with `{primitive.blu-lifted}` fails: "Could not resolve alias", exit 1.
- **Run once, not as tests.** Confirmed. Neither Ajv nor Terrazzo is in `package.json`, `bun.lock`, `tests/` or `scripts/` (grep). That matches decision 12 ("No schema validator joins the suite") and decision 16, the owner's Q4 answer. Kuiper's own validator holds the same rules on every run, for the types it uses, and it is stricter on several:
  - upper-case 6-digit hex;
  - components that equal the hex at 4 decimals;
  - no group `$type`;
  - only the vendor key in `$extensions`.
  - Finding 3 is the one gap I found.
- **The vendor key.** `co.plutosystems.kuiper` is the only extension key in any file (EXECUTED; T2). It reverses a domain the owner says the company controls, as Format §5.2.3 recommends. The validator checks the shape of `since`, `cssVariable` and `unit`. It lets other fields through, so `029`'s `composite` field needs no validator change to be accepted.
- **Units.** Sizes are `px` only. Decision 5's 18 numbers carry `em` or `vw` in the extension. This knowingly breaks the format's SHOULD, as decision 5 records. The words say each unit. Durations are `ms`. Easings are four numbers. Weights are numbers.
- **Aliases.** 166 aliases across the three files. Roles alias primitives, code slots alias roles, `elevation.*` alias ladder steps, and the display family aliases `font.family.heading`. The fields and the expressive mark alias primitives. The glass is a literal or a primitive. Each resolves in both contexts, to its own type, with no cycle (T3, and the validator at build). The base file alone does not resolve `code.*`. That is by design (decision 6), and the flattened files do resolve it.
- **`since`.** Every one of the 317 tokens carries it.
  - 71 read `0.13.0`: the 48 primitives, the 9 ladder steps, `elevation.y` and `blur`, the four display weights and the four light `expressive-mark` tokens. Each has no CSS variable of its own. T12 holds the rest against the shipped theme items.
  - The 8 `expressive-mark` tokens are 71's last 4 plus 4 dark ones. The dark four are dated by the rule they feed.

## The byte-identical claim

Built independently, from `git archive` exports of `421cea7` and `8916944`:

- `bun run build:tokens` twice, then `bun run build:registry`, in each tree: `build:tokens` reports "no changes" both times in both trees. `build:registry` leaves `git status` clean in both. Each tree reproduces its own committed outputs.
- I then deleted `src/app.css`, `static/r/tokens/` and `static/v0.13.0/r/tokens/` in the head export and ran `build:tokens` once. It rewrote those 17 files and nothing else, and `git status` was clean after. So every published copy is what the build makes.
- **Base against head:**
  - `src/app.css` is identical: SHA-256 `e72d4222…bc487e76` in both.
  - `registry.json` is identical, so the `kuiper-theme` item and the three font items are too.
  - `diff -rq` of the two `static/` trees finds only two differences: `static/r/tokens/` and `static/v0.13.0/r/tokens/`, new in head. `static/r/styles/` is identical, so `kuiper-theme.json` and its `v0.13.0` copy are too.
- **On the merged tree** (`021` onto `874c5da`), `build:tokens` reports no changes, and `build:registry` leaves the 16 token copies in place. The registry's swap touches `r/styles/maia/` only, as decision 13 says.
- **`kuiper.css`** is correct and self-contained (criterion 9 above).
  - Its header names what it is, the version, the source, that it is generated, the `kuiper-theme` route, the dark class, and that it loads no font.
  - It holds `:root` (the theme's `:root`, then the 24 `@theme` values, then `color-scheme: light`), then `.dark` (the theme's `.dark`, then `--shadow-elevation` again, then `color-scheme: dark`), then the reduced-motion block.
  - It holds no `@import`, `@theme`, `@layer` or Tailwind variable (T9).

## The deviations

1. **`lowerTokens(files)` keyed by file name** — sound. It lets `031`'s files join with no new signature.
2. **The stricter validator** — sound. Each extra rule guards something the lowering relies on:
   - every group and file is described (T6);
   - sizes are `px`, since the CSS divides by 16;
   - primitives and ladder steps are literals;
   - the display family aliases a `font.family` token;
   - role words are equal in both files.

   None of them blocks `029` or `031a`. Each adds tokens to existing groups, and every new token already carries its `$description`, as those specifications say. The one cost: a later specification that adds a **group** must describe it, or the build stops. That is the intent. It does let one value through (finding 3).
3. **T17 launches Firefox and WebKit itself** — sound until `022`'s projects land. It passed in both projects (EXECUTED).
4. **T12 counts a font item's `font.variable`** — sound. `--font-sans`, `--font-heading` and `--font-mono` never sat in a theme item.
5. **Two scans narrowed.** Neither hides a real problem today.
   - `registry.test.ts`'s 016 "amber" scan skips every `kuiper.removed.json`: the source and both published copies. Today the file's only hits are lines 23, 31 and 36 (`--syntax-amber`, `--color-syntax-amber`, and a note naming it). Those are exactly the names the record must carry. But the skip is whole-file. A future amber hex or name written into the record's notes would pass unseen. Finding 2 narrows it.
   - `generated.test.ts`'s 012 class-token scan skips `static/r/tokens/*.json`. That is right. Those files are data, not class sources: `glass.rim` and the scrim's "veil" are a token name and words. The sibling text scan ("no removed variable prefix or selector appears as text") still reads them. `kuiper.css` stays in both scans. Nothing to change.
6. **The allowlist's counts** — correct at the branch.
   - `rename.test.ts` passes at `8916944` with the vendor key at 1,152 and `plutosystemsco` at 250.
   - Two costs, both accepted by `020`'s design.
     - The exact vendor-key count moves with every token a later specification adds: `029` (+4 primitives, +2 roles a scheme), `031a`, `031b` and `031`. Each must re-pin it. Their specifications should say so; `029` says nothing of it today.
     - The `plutosystemsco` count has already moved under `027a` (249 → 259). It conflicts at merge and becomes **260** (Merge notes).
7. **The changelog gives the folder once** — sound, and better than eight absolute workers.dev URLs. The bullet's wording is clumsy (finding 2). `registry.test.ts`'s criterion-18 checks pass.
8. **`lint-literals.ts`: two lines** — trivial and right.
9. **The thumbnail manifest's four hashes** — right. They conflict with `027a`'s full rehash at merge. Regenerate them (Merge notes).
10. **`static/v0.13.0/.../kuiper-theme.json` in the hash fixture** — right. Decision 3 names it.
11. **`groups` 13, not 14, at `ea1f9bd`** — confirmed (EXECUTED). It is a fact about the old file, not a fault.
12. **Penpot not run** — finding 5.

## Readiness for `029`, `031a` and `031`

The token **shape** takes all three without another restructure. The **lowering** needs additions in each, not a redesign. READ, with the two probes EXECUTED:

- **`light-dark()` pairs (`029` decision 1).** The lowering already returns both schemes' role maps (`tokens.themes.light` and `.dark`) and `expressiveDarkMarks`. A pair is built from them in `build-tokens.ts`, with no change to the files. The single-value rule ("a role whose two primitives' hexes are equal") reads `tokens.primitives`.
- **A hex fallback (`029` decision 6).** The same two maps give it. Nothing new is needed from the files.
- **`029`'s composite primitives.** `vendorOf` lets an unknown vendor field through, so `"composite": { … }` validates as it is. `029` adds its own composite rule. Its retirement of the contrast file's `tints` and `forbidden` rows needs one edit: `checkContrast` requires those two keys today (`scripts/tokens.ts`, the `for (const part of [...])` list).
- **`kuiper.css` (`029` decision 14).** It is one function, `kuiperCss()`. `029` rewrites its blocks and T9. Nothing else depends on its shape.
- **A public role with restricted pairs (`031a`).** `sunken` is one more role in each scheme file, and two primitives. Both are additions, and need no record entries. The contrast file's `restricted` block is an unknown top-level key. `checkContrast` lets it through today and returns it inside `contrast`. `031a` adds its type and its validation. The count tests (T2's 224 and 61, T5's fixture) and the bench move, as `031a` says.
- **The `more` section, and `031`'s two contexts.** `031` chose decision 7's first way: `light-more` and `dark-more` contexts on `scheme`, each listing the scheme file and an override file. The file shape takes this. The code has three places `031` must extend:
  - **Extra contexts are ignored today.** `contextFiles()` and `readTokenFiles()` read only the `THEMES` contexts. A `light-more` context naming a **missing** file passes `readTokens()` (EXECUTED, probe). Until `031` extends them, a broken high-contrast file would build green. That is finding 4.
  - **`publishedFiles()` flattens `THEMES` only**, so no `flat-light-more` file appears until `031` adds one.
  - **The scheme-file rules locate each file by position.** The base file is `contexts.light[0]`, and each scheme file is `contexts[t].at(-1)`. That is right for the two standard contexts. A `-more` context's last file is its override, which holds no `field`, `glass` or `expressive-mark` group. So `031` must not pass its contexts through the same check.
  - The `more` section of the contrast file passes as an unknown key, like `restricted`.
- **One spec sentence is now wrong.** Decision 7's "no test here needs changing for either" holds for the first way, the one `031` took. It does not hold for the second: T1 pins `Object.keys(modifiers)` to `["scheme"]` and `resolutionOrder` to exactly two steps, as its own row says. The lowering also rejects an empty context list (`refs()`). A `contrast` modifier would trip all three. The point is moot unless the second way is revived. It is in finding 4 so nobody revives it unaware.

## The page, seen

`/foundations/tokens/`, "Use the tokens anywhere", at 1440 and 390, light and dark (`review-021/shots/tokens-anywhere-{1440,390}-{light,dark}.png`):

- **Fine in all four.**
  - No sideways scroll at 390 (`scrollWidth` 390), nor at 1440.
  - Five links: `kuiper.css`, the resolver, the two flattened files, and the record. Each links to `${SITE_REGISTRY}/tokens/<file>`, with code-styled labels, readable in both schemes.
  - axe reports 0 violations at three widths in both schemes (EXECUTED).
  - In the 390 shots, the bar over the heading is the site's fixed bar, captured by the full-page clip. It is not a fault of the page.
- **Findings, all small** (finding 1):
  - **The three addresses are full URLs in running prose,** each `wrap-anywhere`. At 1440, in the 608 px column, the first breaks over four lines, and the file name splits as `kuiper` / `.css`. At 390, each takes three or four lines, and the paragraph is the hardest thing on the page to read.
  - `:root` and `.dark` in `kuiper.css`'s line are plain text. Every other name on the page is code.
  - **The resolver's line does not say it needs three more files.** It names `kuiper.tokens.json`, `kuiper.light.tokens.json` and `kuiper.dark.tokens.json`, which are published in the same folder but not linked or named in the section. A reader who copies the resolver alone has a file that resolves nothing.

## Findings, most severe first

1. **Low. The new section's addresses and names** (`src/routes/(site)/foundations/tokens/+page.svelte`, the `anywhere` section).
   - **Evidence:** the screenshots above.
   - **Fix:**
     - Give the three addresses as a three-row list, each address in code on its own line. Or keep the prose, and show one pattern, `${SITE_REGISTRY}/tokens/<file>`, with the latest and GitHub forms as two short lines.
     - Wrap `:root` and `.dark` in `<code>`.
     - Add one clause to the resolver's words: "with the three files it names, in the same folder: `kuiper.tokens.json`, `kuiper.light.tokens.json`, `kuiper.dark.tokens.json`".
   - T16 is unaffected. Criterion 12 allows this section to differ. A small change in lane S, or a write-in at merge.
2. **Low. Two narrow write-ins.**
   - (a) **The amber scan's skip is whole-file** (`tests/unit/registry.test.ts`, the 016 test). Narrow it to the names the record must keep. For example, drop from `kuiper.removed.json`'s text the lines holding `"--syntax-amber"` or `"--color-syntax-amber"` before matching, or match those two names exactly and still scan the rest. Then an amber hex written into a note still fails.
   - (b) **The changelog bullet reads "at `/v0.13.0/r/tokens/` and its name".** Write "at `/v0.13.0/r/tokens/<name>`" (and "`/r/tokens/<name>` for the latest release"). `registry.test.ts`'s checks still pass: `/r/tokens/` is a substring.
3. **Low. The validator accepts `alpha: 1`, and the lowering then writes an `FF` suffix** (`scripts/tokens.ts`, `colourFault` and `hexOf`).
   - **Evidence:** EXECUTED. With `alpha: 1` on `primitive.ink`, `lowerTokens` returns `#0B0F17FF`. That would change `registry.json` and `src/app.css` with no change of colour.
   - Decision 5 says `alpha` is written "only when the colour is translucent". No file does it today, and T8's hashes would catch it until `029` retires the fixtures. After that, nothing would.
   - **Fix:** one more line in `colourFault`, "its alpha must be below 1; leave it out for an opaque colour", and a T15 case. Small, and in lane T, so it can ride `029`.
4. **Low, for `031`. The lowering reads only the `THEMES` contexts, so an added context is not validated** (`contextFiles`, `readTokenFiles`, `publishedFiles` in `scripts/tokens.ts` and `build-tokens.ts`).
   - **Evidence:** EXECUTED. A `light-more` context naming a missing file passes `readTokens()`.
   - **Now or later.** Today there is no such context, so nothing is wrong now. `031` adds two.
   - **Fix (in `031`, recorded in its Knock-ons):**
     - read and validate every context of `scheme`;
     - flatten each, and run the alias check on each;
     - apply the scheme-file group rules only to the `THEMES` files;
     - publish the flattened `-more` pair if `031` wants it.
   - Optionally, now: make `contextFiles` throw on a `scheme` context it does not read, so the gap fails loudly until `031` closes it. That would break nothing today.
   - Also note in `021`'s Landing notes, or `031`'s: decision 7's "no test here needs changing for either" holds only for the contexts way. T1 and `refs()` would need changing for a `contrast` modifier.
5. **Not a defect. The Penpot import (deviation 12, decision 16 (c)) was not run, so row 12 stays 0.** My recommendation: **row 12 waits for the design lead.** It does not block landing. Criterion 21 already says row 12 holds at 0 without the evidence, and the change review says so.
   - **Can it be run headless?** Not as a test. Penpot has no command-line or library importer. Its token import is in its web front end, behind the Tokens panel's Import button, so the whole self-hosted stack is needed (front end, back end, exporter, PostgreSQL, Valkey).
   - **It is possible locally, but not reliably in 30 minutes on this machine.** Docker 29.7.2 is installed and running. The steps:
     1. `curl -LO https://raw.githubusercontent.com/penpot/penpot/main/docker/images/docker-compose.yaml`, in a scratch folder.
     2. `docker compose -p penpot -f docker-compose.yaml up -d`. This pulls about 1.5–2 GB of images; that is my estimate, and it is the slow part under today's load.
     3. Open `http://localhost:9001`. Register: the compose file's default flags turn off e-mail verification. Create a draft.
     4. Tokens panel → Import → `static/v0.13.0/r/tokens/kuiper.flat-light.tokens.json`. Record what imported and what was refused.
     5. `docker compose -p penpot down -v`.
   - **Why I did not run it.**
     - Decision 16 (c) names the design lead.
     - It starts five containers and opens a port on the owner's machine while the owner is asleep.
     - The UI flow is clicks Playwright could drive, but against selectors nobody here has read. So a scripted run might not finish in 30 minutes.
   - **What to expect (READ, not EXECUTED).**
     - Penpot's guide shows colour tokens as hex strings ([Penpot help, Design Tokens](https://help.penpot.app/user-guide/design-tokens/)).
     - A Penpot community thread of May 2026 says its export is Tokens Studio's format, not DTCG 2025.10, and contrasts that with 2025.10's colour object ([community.penpot.app](https://community.penpot.app/t/token-export-is-tokens-studio-format-not-dtcg-2025-10/10544)).
     - Neither confirms or denies that the importer accepts `colorSpace` with `components`, or `{ value, unit }` dimensions.
     - So a refusal of the colour objects is plausible. If that happens, row 12 stays 0, and no older-format file is published, as decision 16 (c) says.

## The scorecard's movement

The builder's run-log row at `b37dcf4` has row 5 at 1 → 4 and row 12 held at 0. The total goes 32 → 35, and every other row holds. I re-ran `kuiper.ts --rev 8916944` and got the same token counts. Row 5's four new criteria are each evidenced above:

- (c) the words in the source (T5);
- (d) DTCG, valid against the published schemas and read by Terrazzo (re-run);
- (f) the lifecycle: `since` on every token and the record, held by T12 to T14;
- (g) two targets: `kuiper.css` and the DTCG files.

That is 7 of 7, which scores 4, tying Primer. I agree with the movement. After the merge, the "In short" sentence should name `027a` and `021` together (Merge notes). The roadmap's re-rank is the design lead's: row 5 drops out of the gap list.

## Constitution checks

- §1: met in its own words. The tokens and theme are published as plain CSS variables and as a DTCG file.
- §3: no design-tool file in the tree. The Penpot check is outside it.
- §4.1: the site and the files say to copy, never link.
- §4.3: no literal added. `EXPRESSIVE_DARK_MARKS` left the script for the token files.
- §4.5: nothing joins `bun.lock`. Ajv and Terrazzo ran outside it.
- §5: research, spec, review, tests first, code. This is the change review.
- §6: the changelog says "not an interface change" for the CSS, and names the DTCG paths as an interface from 0.13.0, with the record.

## Merge notes (after `027a`, at `874c5da`, and after `026`)

Simulated in a scratch clone. `021` merged onto `874c5da` gives five conflicts, all in shared ledgers or fixtures. `021` touches no file of `026`'s and no item source. `026` (`8a5c906`) touches nothing in lane T. The files both change are the same five.

1. **`CHANGELOG.md`.** Keep every side, in landing order, under 0.13.0: `027a`'s three bullets, then `026`'s, then `021`'s two.
2. **`tests/unit/registry.test.ts`.** Both sides append a `describe` block at the end. Keep both, and expect `026` to add a third.
   - **Careful:** git's conflict hunk ends inside `027a`'s last block (`027a test 2`). Its closing lines sit after the markers, as common text. Keeping "both sides" between the markers leaves `027a test 2` unclosed, and `021`'s block lands inside it. The file then fails to parse ("Unexpected end of file"), and every test in it goes unrun. That happened in my first simulated resolution.
   - Resolve it by keeping `027a`'s file whole, then appending `021`'s `describe("021 criterion 18 …")` block after it.
   - Keep `021`'s auto-merged hunk in the 016 amber test (the `kuiper.removed.json` skip), or that test fails.
   - So resolved, `registry.test.ts` and `rename.test.ts` give 108 pass, 0 fail (EXECUTED).
3. **`tests/fixtures/pluto-allowed.json`.**
   - `plutosystemsco` is 259 after `027a`, and 260 with `021`'s `kuiper.css` source line. Add whatever `026` adds.
   - Keep `021`'s two new entries: the vendor key at 1,152, and `tokens-lifecycle.test.ts`'s `pluto-theme.json`.
   - Then run `bun test tests/unit/rename.test.ts` on the resolved tree, after `git add`. It reads `git ls-files --cached`, so unmerged index entries count a file three times. Resolve and stage before trusting its counts.
4. **`src/lib/site/thumbnails/manifest.json`.** Take the release's side, then `bun scripts/site/thumbnails.ts --hash-only`. On the simulated merge it rewrote exactly four hashes: `kuiper-theme` and the three font items. The pictures do not change.
5. **`context/research/benchmark-scorecard.md`.**
   - Keep both run-log rows (`027a`'s two, then `021`'s), and `026`'s when it lands.
   - Write the "In short" line to name `020`, `027a` and `021` (and `026`).
   - Row 5 is 4, and the total 35 plus whatever `026` moves.
6. **Then, on the merged tree:**
   - `bun run build:tokens` should report "no changes". It did on the simulated merge: `src/app.css` and the four items are untouched, and `static/r/tokens/` and `static/v0.13.0/r/tokens/` are as committed.
   - `bun run build:registry` keeps `static/r/tokens/`.
   - T8's hashes still hold, since neither `027a` nor `026` changes the theme item.
7. **The full unit suite on the simulated merge (`027a` + `021`, resolved and staged):**
   - 1,242 pass, 2 skip, 7 fail, at load average 42.
   - One failure was my own resolution of `registry.test.ts` (note 2). Once that was fixed, the file passes.
   - The other six are timing failures, under load average 24 to 52:
     - four `thumbnails.test.ts` hash tests at the 5 s timeout, which pass alone at 60 s (10 of 10);
     - `highlight.test.ts`'s and `highlight-session.test.ts`'s millisecond budgets.
   - `021` touches none of these. The builder saw the same on `421cea7` under load.
   - Re-run them on a quiet machine before the tag.
8. **The worktree.** Once merged, remove the worktree and its branch (`AGENTS.md`).
