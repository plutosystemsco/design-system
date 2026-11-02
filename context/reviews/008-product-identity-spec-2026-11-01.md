# Review of 008 — Product identity

- **Date:** 2026-11-01
- **Status:** dispositioned; every finding fixed in the specification
- **Reviewer:** a reviewer; not the author
- **Reviewed:** [the specification as drafted](../specifications/008-product-identity.md), against [the products memo](../research/2026-11-01-one-system-many-products.md) and `../decisions.md`, "One system, many products", on `v0.7.1` (`bfbd6b6`) with the working tree's uncommitted 008 files.
- **Re-ran:** three scratch experiments, all in the session scratchpad, none in the repository.
  - Tailwind 4.3.3's `compile` from `@tailwindcss/node` on decision 5's `@utility mark-reveal` → exit 0. It printed `.mark-reveal > [data-slot="four-dot-dot"]` and `:hover > .mark-reveal > [data-slot="four-dot-dot"]` as written. A `@media (hover: hover)` nested in the utility also compiles. Tailwind's own `hover:opacity-100` compiles inside `@media (hover: hover)`.
  - The compiled utility, with `pluto-theme`'s `:root` values and reduce block, in Playwright's Chromium → rest: 4 dots at opacity 0, 0.2 s, 0 s delay. Hover: opacity 1, transform `none`, 0.495 s, delays 0.135 / 0.225 / 0.315 / 0.405 s. The line's width did not change (172.09 px both times). A leave mid-reveal: transitions of 188, 167, 119 and 16 ms. Under `reduce`: every duration `1e-05s`, every delay `0s`, both ways. With `hasTouch` and `isMobile`, `(hover: hover)` was false, and one tap set `:hover` and showed 4 of 4 dots.
  - `lintText` from `scripts/lint-literals.ts` with the repository's rules, on the 15 strings of decisions 4 and 7 and the 5 class lists of decisions 2, 4 and 6 → 0 violations.

## Acceptance criteria against evidence

1. Wordmark header — checkable. Its 48 px box is height only; see finding 11 (INFERRED).
2. No entrance by default — checkable. It needs `four-dot.spec.ts`'s entrance tests moved off `/view/app-shell/` (READ, `tests/e2e/four-dot.spec.ts:174`, `:219`).
3. Wordmark footer — checkable. It needs `blocks.spec.ts` A3 and A4 rewritten. They now assert a footer lockup and the tagline (READ, `tests/e2e/blocks.spec.ts:1005`, `:1021`).
4. Logo header and footer — checkable (INFERRED).
5. The entrance, moved — not met as designed. The one snippet renders the entrance twice (finding 1).
6. The endorsement at rest — checkable. The rest state was seen in Chromium (EXECUTED).
7. The reveal — met by the CSS as written (EXECUTED). The timing breaks the design book (finding 2). The "identity transform" reads `none`, not a matrix (finding 10).
8. The leave — met in computed style (EXECUTED). A running reversal is shorter than 200 ms (finding 10).
9. Reduced motion — met (EXECUTED: every delay 0 s, every duration 0.01 ms). The delay is a product of `--motion-entrance`, which the reduce block zeroes, so nothing new is needed there.
10. Accessibility — checkable. The axe loop picks the two views up from `BLOCK_VIEWS` (READ, `tests/e2e/axe.spec.ts:76`). The keyboard walk needs two new `VIEW_STOPS` entries (finding 4).
11. The hero — checkable. The copy itself breaks `003`'s hero rule (finding 5).
12. No brand copy in the shipped shell — checkable. It leaves other Pluto defaults uncaught (finding 14).
13. The utility — checkable (READ, `tests/unit/generated.test.ts:76`, `:392`).
14. Install — checkable. Its h1 table must change (READ, `tests/smoke/blocks-add.test.ts:166`).
15. The gate — fails as specified. `svelte-check` breaks on the site's own footer (finding 3).
16. Released — not a test; fine.

## Findings, most severe first

1. **High — One logo snippet plays the entrance twice** (decisions 6 and 8; criterion 5).
   The layout passes the same `LOGO` to the header and the footer. The lockup view's logo is `<Lockup entrance class="text-2xl" />`, so the footer's copy carries `mark-entrance` too.
   Failure: `/view/app-shell/lockup/` runs 8 `pluto-mark-dock` animations. The entrance test counts every animation in the document (READ, `tests/e2e/four-dot.spec.ts:160`) and expects 4, so criterion 5 fails. The page also shows two entrances. `006` decision 5 forbids that ("no page shows two entrances"), and `006` decision 8 gave the footer's lockup "no `entrance`". A product that follows decision 2's advice ("passes `<Lockup entrance />` inside its snippet") gets the same result.
   Fix: give the snippet the place it renders in: `logo?: Snippet<[place: "header" | "footer"]>`. The header renders `logo("header")` and the footer `logo("footer")`. The comment example, the lockup view and the item page use `<Lockup entrance={place === "header"} />`. Criterion 5 adds: "the contentinfo holds 0 elements with `mark-entrance`, and the document runs exactly 4 `pluto-mark-dock` animations".

2. **High — A 900 ms dock on hover breaks the design book's motion rule** (decision 5; criteria 7 and 8).
   The design book §06 allows one entrance per page, at most 900 ms. "Everything else is response… each ≤ 200 ms" (READ, `../research/2026-10-28-the-blocks-patterns-and-accessibility.md` line 68, citing §06 lines 562–565). §09 adds "No second entrance animation… One hello per page" (READ, `../research/2026-11-01-the-orbit-assemble-entrance-and-the-footers-furniture.md` line 55). Decision 5 says the reveal is not an entrance, because it answers a reader's action. Then it is a response, and a response gets 200 ms. The reveal runs 900 ms. The owner's ruling says only that the dots "appear".
   Failure: hovering the endorsement plays the brand's 900 ms orbit-assemble, the second time on a page whose logo is the lockup.
   Fix (recommended): keep the shape and scale it to the micro budget. Duration `calc(var(--motion-micro) * var(--motion-entrance-dot))` (110 ms). Delays `calc(var(--motion-micro) * (var(--motion-entrance-start) + i * var(--motion-entrance-stagger)))` (30, 50, 70, 90 ms). The last dot lands at 200 ms. There is still no new token, and reduce still zeroes it. Criterion 7 becomes 110 ms and 30 to 90 ms. The alternative is a 900 ms dock on hover, and only the owner can grant that, since it overrides §06. It would be asked as a question and recorded in `decisions.md`.

3. **Medium — The preview site's own footer breaks, and the spec does not change it** (decision 1; criterion 15).
   `src/routes/(site)/+layout.svelte:39` renders `<AppShellFooter {commit} {builtAt} sourceHref=… />`. It passes no `appName` and no tagline (READ). Decision 1 says the site "keep[s] Pluto's lockup", but no decision lists this file.
   Failure: `appName` becomes required, so `bun run check` fails. Without it, every site page's footer would show an empty wordmark, no lockup and no "Work runs on data.".
   Fix: add the file to scope. It passes `appName="Pluto Systems"`, a logo snippet rendering `<Lockup class="text-2xl" />` (no entrance), and `tagline="Work runs on data."`. One test reads the site footer: one `[data-shell="logo"]` holding a lockup, the tagline once, and the source link as its only link. A4's tagline check moves there.

4. **Medium — Existing tests that break are not named** (decisions 6 to 8; criterion 15).
   `APP_NAME` becomes "Sandbox", the footer loses the lockup and tagline, the hero's links are renamed, and two views are added. All of these tests assert the old state (READ):
   - `tests/e2e/pages.ts:210` (`"a:Pluto app"`) and `:230` (the hero's two stops);
   - `blocks.spec.ts` A3 (`:1005`, a footer lockup), A4 (`:1021`, the tagline), A5 (`:1043`, the dialog "Pluto app"), and the hero's CTA name (`:553`);
   - `keyboard.spec.ts:1211` (the sheet "Pluto app") and `:1315` (62 toolbar stops, `[5, 9, 9, 10, 9, 9, 11]`; it becomes 64 and 11 for the shell);
   - `axe.spec.ts:167` (the dialog "Pluto app");
   - `blocks.spec.ts:1249` C9 ("the 10 views of 006"; it becomes 12);
   - `tests/unit/blocks.test.ts:201` (28 views; it becomes 30);
   - `four-dot.spec.ts:174` and `:219` (the entrance on `/view/app-shell/`);
   - `tests/smoke/blocks-add.test.ts:166` (the hero's h1).
   Failure: criterion 15 says "all pass". It does not say which checks are rewritten, which move and which stay as regressions. That leaves the builder to decide when a test may change.
   Fix: add a short "Tests that change" list to decision 8 or the criteria, with each test's new expectation. Name the two new views' `BLOCK_VIEWS` labels (for instance "Lockup as logo" and "Endorsed") and their `VIEW_STOPS` entries (`"a:Pluto Systems"` first on the lockup view).

5. **Medium — The hero's new copy breaks `003`'s hero rule** (decision 7; criterion 11).
   `003` fixed the hero's copy this way: "every claim is true where it is shown, and none claims more than a test proves" (READ, `../specifications/003-the-first-blocks.md` line 270). The `003` spec review's finding 7 (Medium) struck strings that "an app that installs a block and keeps its defaults ships … as its own claims". "Every run is kept" and "Each run keeps its code, its output and its time" are retention promises. "Nothing to install" and "press Run" describe a product that does not exist. The products memo §5 says "The copy makes no claim a product would have to keep", and that is not so. Separately, "Start a run" links to `/`, which opens the catalogue in the preview and the home page in an app. A link must name its result (`003` decision 15).
   Failure: an app that installs `hero` and keeps the defaults ships policy claims; the preview shows a link that does not do what it says.
   Fix: either (a, recommended) write copy that is true of any app built from this system and shown in the preview, with the action named for `/` (for instance "Go to the home page"); or (b) record a call that block sample copy is exempt from `003`'s hero rule, mark it with a source comment ("Sample copy: replace it with your product's"), and drop the retention lines anyway.

6. **Medium — The endorsement sets a lockup-shaped mark under the brand's minimum** (decision 4).
   Decision 4 sets the words and the lifted mark "as in the lockup", at `text-sm`. In this theme that is 13.5 px (READ, `tests/e2e/blocks.spec.ts:1030`). The brand's usage rule is "Below 20 px of lockup height, use the mark alone" (READ, `001` decision 16; `src/routes/(site)/items/four-dot/+page.svelte:71`). `006` decision 8 refused 16 px for the footer's lockup because "16 px is under the minimum". At 13.5 px the mark is 9.2 px tall (0.68 em), with a 2.2 px gap to the words, and clearspace is one dot-pair height (INFERRED from the tokens).
   Failure: the brand rule that `006` measured against is neither met nor argued away. The decision gives no reason the rule does not apply.
   Fix: state the call and its reason. Either the endorsement is not the lockup (the words are not the "pluto" wordmark), so the minimum does not bind, and clearspace is waived in the same breath. Or set the line at a size where the rule holds. A call that reads the design book's usage rules is the owner's to confirm, so ask it with options and record the answer.

7. **Medium — The constitution amendment has no owner's decision behind it** (decision 9).
   The constitution "changes only by a decision recorded in `decisions.md` and noted in its Status line" (READ, `constitution.md`, Scope). The new entry, "One system, many products", records three rulings and does not mention the constitution. Its last paragraph is the design lead's addition, sitting in a record that holds "the owner's answers and decisions" (READ, `decisions.md` line 3).
   Failure: decision 9 amends §1 on the design lead's word.
   Fix: ask the owner, recommended option first. (a) No amendment: §1 already says "every Pluto Systems application", which covers every product. (b) Amend §1 with the sentence, recorded in the entry. Move the design lead's paragraph about the system's own names into this specification's Decisions.

8. **Medium — A long product name has no layout** (decision 2; criteria 1 and 3).
   The old lockup always showed the short word "pluto". The wordmark shows any `appName` at 28 px bold, in a 64 px row that at 360 px also holds a 32 px toggle and a 32 px menu button (READ, `app-shell-header.svelte:71`, `:79`, `:87`). The criteria test only "Sandbox".
   Failure: a name such as "Pluto Systems Analytics" at 320 px either overflows the row (horizontal scroll, SC 1.4.10) or wraps past the 64 px row that A2 asserts (INFERRED).
   Fix: decide the behaviour. For instance, the link takes `min-w-0`, and the wordmark wraps with `leading-none` inside `min-h-12`, or drops to `text-base` below `sm`. Add a criterion: at 320 px with a long name, the header row stays 64 px and the page has no horizontal scroll.

9. **Low — `:hover` fires on a tap, so "on a phone the dots never show" is wrong** (decision 4; decision 5).
   EXECUTED: in Chromium with touch emulation, `(hover: hover)` was false and one tap showed 4 of 4 dots. Tailwind 4.3.3's own `hover:` variant sits inside `@media (hover: hover)` (EXECUTED), so every other hover in the system stays off on touch.
   Fix: nest the two hover rules in `@media (hover: hover)` inside the utility. It compiles (EXECUTED). Then the sentence holds. Add one assertion under `hasTouch`: after a tap, the dots stay at opacity 0.

10. **Low — Criteria 7 and 8 need their reading rule** (criteria 7 and 8).
    EXECUTED: after the reveal, a dot's computed `transform` is `none`. The entrance test expects `matrix(1, 0, 0, 1, 0, 0)` (`four-dot.spec.ts:193`), which a copied assertion would get wrong. A pointer that leaves mid-reveal starts reversed transitions shortened by the reversing factor (188, 167, 119 and 16 ms seen), so `getAnimations()` would not read 200 ms.
    Fix: criterion 7 reads "transform `none`". Criterion 8 reads "the computed `transition-duration` is 0.2 s and `transition-delay` 0 s, read from `getComputedStyle` after the reveal has settled".

11. **Low — The size and target advice contradicts the one logo shipped** (decision 2).
    The item page is to say a logo is "at most 32 px tall (`h-8`)". The lockup at `text-2xl` is 34.6 px tall (READ, `006` decision 7), and the lockup view uses it. `min-h-12` sets height only: a one-letter name or a square icon logo can be under 24 px wide (SC 2.5.8, INFERRED).
    Fix: say "at most 36 px; the lockup at `text-2xl` is 34.6 px", or another bound the lockup meets. Add `min-w-6` to the link, or rely on 2.5.8's spacing exception and say so.

12. **Low — R14 and L10 do not name `mark-reveal`** (decision 5).
    `006` added `mark-entrance` to `002`'s R14 list, to L10's comment (`scripts/lint-literals.ts:363`) and as a passing sample (`tests/unit/literals.test.ts:219`). Decision 5 cites L10 but changes none of them.
    Fix: one line in decision 5. R14 gains `mark-reveal`, L10's comment names it, and `literals.test.ts` gains `{ cls: "mark-reveal", file: "app-shell-footer.svelte" }`.

13. **Low — Stale words about the lockup stay in shipped files** (decisions 1 to 3).
    `registry.json:2773`, the `app-shell` description, still reads "a header with the lockup's one entrance". The header's prop doc (`app-shell-header.svelte:28`, "the lockup's accessible name") and its comment (`:51`–`:60`) are stale. So are the footer's prop doc and comment (`app-shell-footer.svelte:26`, `:44`–`:50`) and the sidebar's `heading` doc (`app-shell-sidebar.svelte:36`).
    Fix: list them in scope. A possible description: "The frame every page sits in: a skip link, a header with the product's logo or name and a theme toggle, an optional sidebar, the main area, and a footer that states the build."

14. **Low — Other Pluto defaults stay in the shipped shell** (decision 6; criterion 12).
    By default every product's footer shows the link "github.com/plutosystemsco/design-system" (`+layout.svelte:38`). The layout's comment calls `PS-<series>-<NNNN>` "Your doc ID" (`:35`), and the footer's prop doc repeats it (`app-shell-footer.svelte:20`). The example page links "Open the catalogue" (`blocks/app-shell/+page.svelte:11`), which is this registry's catalogue. Criterion 12 catches none of these.
    Fix: either keep them, and say in decision 6 why each is a sample an app replaces, or reword them: "Your doc ID, in your scheme"; "Go to the home page".

15. **Low — Three scope lines are missing** (Intent, "Not here").
    Sign-in and sign-up show no product identity, page titles carry no product name, and the hero item page's copy notes are not mentioned.
    Fix: one line each in "Not here", with the reason, so a later reader knows they were seen.

16. **Low — The header's change is silent to an installed app** (decisions 2 and 3; decision 9).
    Decision 3 marks the footer as an interface change because `svelte-check` names the missing prop. The header keeps its props and changes what it draws: the lockup and the entrance disappear, and no check says so.
    Fix: decision 2 calls this a visible change too. The changelog's 0.8.0 entry gives the one-line restore: pass a `logo` snippet holding `<Lockup entrance={place === "header"} />`.

## Constitution checks

- §4.1 source, not a package: kept. The snippet is the app's markup; nothing reaches back.
- §4.2 driven by need: the need is stated (every product), and "done" is proven here.
- §4.3 tokens are the one source: kept. The utility reads `--mark-orbit`, the entrance's shares and `--motion-micro`. No new token, no literal (EXECUTED lint, 0 violations).
- §4.4 accessible by default: label-in-name is fixed for the wordmark, and the endorsement adds no stop. Reflow for a long name is unproven (finding 8).
- §4.5 and §4.6: no new package.
- §6 never break an installed app silently: the footer's break is named; the header's is not (finding 16). The constitution amendment needs the owner (finding 7).

## Verdict

Does not land yet: findings 1 and 2 (High) and 3 to 8 (Medium) stand.

## Disposition

By the design lead, 2026-11-01. Three findings went to the owner, whose answers are in `decisions.md`, "One system, many products".

| # | Disposition |
| - | ----------- |
| 1 | **Fixed.** The logo snippet takes its place, `"header"` or `"footer"`; only the header's lockup plays the entrance. Criterion 4 checks the footer has no `mark-entrance`; criterion 5 counts exactly four animations, all in the banner (decisions 2 and 3). |
| 2 | **Fixed, by the owner's ruling.** The reveal is a response: 110 ms per dot, delays 30 to 90 ms, the last at 200 ms, from `--motion-micro` (decision 5; criteria 7 and 8). |
| 3 | **Fixed.** The preview site's own footer is in scope, passes Pluto's identity, and has its own criterion (decision 8; criterion 12). |
| 4 | **Fixed.** Decision 8 lists every test that changes and its new expectation, the two views' labels and their stops. |
| 5 | **Fixed, option (a).** The hero's copy describes the page itself, and its action is "Go to the home page" (decision 7). |
| 6 | **Fixed, by the owner's ruling.** The endorsement is not the lockup; the 20 px minimum and the clearspace do not bind (decision 4). |
| 7 | **Fixed, by the owner's ruling.** No amendment; the design lead's note on the system's names moved into "Not here" (decision 9). |
| 8 | **Fixed.** The home link shrinks and its wordmark truncates; the footer's wraps. The endorsed view uses a long name, and criterion 11 checks 320 px. |
| 9 | **Fixed.** The hover rules sit inside `@media (hover: hover)`; criterion 10 checks a tap. |
| 10 | **Fixed.** Criteria 7 and 8 read `transform` `none` and computed durations after the reveal settles. |
| 11 | **Fixed.** The advice reads "at most 36 px", which the lockup meets; the link gains `min-w-6`. |
| 12 | **Fixed.** R14, L10's comment and the literal test's samples name `mark-reveal` (decision 5). |
| 13 | **Fixed.** Decision 8 lists the stale words and gives the registry description. |
| 14 | **Fixed.** `sourceHref` ships empty, the `docId` comment names the scheme as Pluto Systems' own, and the example page's link reads "Go to the home page" (decision 6). |
| 15 | **Fixed.** "Not here" names sign-in and sign-up, page titles, and the system's own names; decision 7 names the hero item page. |
| 16 | **Fixed.** Decision 2 calls the header's change visible, and the changelog's entry gives the restore (decision 9). |

