# Review of 021 — Tokens for everyone

Reviews [`specifications/021-tokens-for-everyone.md`](../specifications/021-tokens-for-everyone.md).

- **Date:** 2026-11-15
- **Status:** in review; approve with changes (not fit to build yet: findings 1 to 7 stand)
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-15 (563 lines). I checked it against these:
  - the constitution, `AGENTS.md`, `roadmap.md` (rows `021`, `029`, `031`, `048`, `054`; §1 rows 5 and 12), and the scorecard's rubric for rows 5 and 12;
  - the memo `research/2026-11-15-dtcg-tokens.md`, and `research/2026-11-15-scoped-schemes-and-contrast.md` for what `029` and `031` need;
  - `specifications/020-the-kuiper-rename.md`, whose names this one is written against;
  - the tree on `release/0.12.0` at `beeb67e`, plus the uncommitted `019a` work: `tokens/pluto.tokens.json`, `scripts/tokens.ts`, `scripts/build-tokens.ts`, `scripts/build-registry.ts`, `scripts/registry-watch.ts`, `scripts/lint-literals.ts`, `scripts/bench/pluto.ts`, `src/app.css`, `src/lib/site/foundations/{words,tables}.ts`, the search source, the Foundations load, `src/lib/site/site.ts`, `.prettierignore`, `static/_headers`, every `static/v*/r/styles/maia/pluto-theme.json`, and every test that reads the token file;
  - the DTCG 2025.10 Format, Color and Resolver modules and their two JSON schemas, fetched 2026-11-15 (READ).
- **Re-ran:** I changed nothing in the repository but this file. Every probe ran in the scratchpad (`…/scratchpad/021-review/`).
  - `curl` of `https://www.designtokens.org/schemas/2025.10/format.json` and `.../resolver.json`: both 200, `application/json` (EXECUTED).
  - `probe/roundtrip.ts` over today's token file: 61 colours (48 primitives, 13 glass literals); 0 fail the round trip to 4-decimal components and alpha and back to the exact hex. All 256 byte values survive it, so it cannot fail. 0 colours have an `FF` alpha, so "alpha only when translucent" loses nothing. 0 are lower case. 18 carry alpha (the memo's §2 says 15). Light and dark roles are 61 each, already in the same order. One glass literal, dark `shadow[0]` `#00000000`, equals the primitive `clear` (EXECUTED).
  - `probe/removed.ts` over the eight `static/v*/r/styles/maia/pluto-theme.json`: the shipped names absent from today's item number **24**, the 24 the spec lists, when only `cssVars.light` and `cssVars.dark` keys also count as `--color-<key>`. Read literally ("each `cssVars` key"), the rule gives **32**: eight phantom `--color-color-code-*` (EXECUTED; finding 10).
  - `probe/words.ts`: `ROLE_WORDS` has 61 entries and `CODE_WORDS` 16, one per role and slot, in the token file's order. All 77 match T5's `/^[A-Z].*\.$/`. Two code words hold backticks, not four. The excerpt's three descriptions equal `words.ts` verbatim (EXECUTED).
  - `ajv/validate.ts`, Ajv 8.17.1 in a scratch folder, against the two fetched schemas: the spec's resolver (lines 158–180), both token excerpts (lines 195–243, 249–268), and a sample holding a `number` with a `unit` extension, a group `$extensions`, a string `$deprecated`, a top-level `$extensions`, a numeric token name and an `alpha: 0` colour: all **valid**. A control token, `{ "value": 0.3, "unit": "em" }` as a `dimension`, is **rejected** (EXECUTED).
  - `ajv/mini/`, Terrazzo CLI 2.10.0 (`tz check`) on a coherent miniature of the resolver set: "No errors". A broken alias in the **default** context (light) is caught. A broken alias in the **dark** context passes. A `dimension` in `em` passes. Read as plain files (base + dark), the dark alias is caught (EXECUTED; finding 6).
  - `prettier --check` (the repository's own) on `JSON.stringify(x, null, 2)` output: **fails**; prettier folds short arrays onto one line (EXECUTED; finding 2).

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | Medium | `kuiper.css` puts `--shadow-elevation` on `:root` only. In a nested `.dark` subtree it keeps the light `--elevation-line` | decision 11; T9 |
| 2 | Medium | T7's byte-for-byte fixture cannot coexist with `bun run lint`: prettier rejects `JSON.stringify` output under `tests/` | Design, "Byte identity"; T7; criterion 19 |
| 3 | Medium | Decision 3 adds one field to `Tokens`; the lowering adds two (`expressiveDarkMarks`). T7 as written then fails | decision 3; Design step 6; T7 |
| 4 | Medium | The bench: `020` renames it `kuiper.ts`, and the rewrite must keep five other token counts and the `--rev` fallback, or row 5 (e) and `020`'s test 19 break | decision 14; criterion 17 |
| 5 | Medium | T16 fetches links that are absolute `SITE_ORIGIN` URLs. Nothing is deployed, so it cannot pass in the suite | decision 13; T16 |
| 6 | Medium | Q4's recommended second reader proves less than it says. Terrazzo checks only the default context, and accepts the forbidden `em`. `@terrazzo/parser` has no binary | Q4 |
| 7 | Medium | Q2's recommended vendor key rests on a domain the project stopped naming in 0.7.1. The key goes on every token and is costly to change | Q2; decision 4 |
| 8 | Low | `readTokens(file)` is called with a path by two scripts; the spec does not say what the argument means now. `lint-literals.ts` is out of scope | decision 14; Scope |
| 9 | Low | The merge wording: decision 2 says the spec does not say how a shared group merges, but `031`'s plan needs exactly that, and it is the token-level rule the spec does state. Root `$`-properties do collide | decisions 2, 7; Risks |
| 10 | Low | T13's rule, read literally, counts 32 names, not 24 | decision 10; T13 |
| 11 | Low | `em` and `vw` in `$extensions` break a SHOULD of the format. Say so | decision 5; Risks |
| 12 | Low | Write-ins: four small contradictions and miscounts | lines 6, 150, 186, 276, 343, 377, 486, 532 |
| 13 | Low | Q3: a score needs a cited source; say which tool reads the file | Q3; criterion 21 |

## Findings, most severe first

1. **`kuiper.css` hands a nested `.dark` subtree the light elevation hairline** (decision 11, lines 329–331; T9, line 459; `scripts/build-tokens.ts:191`; `src/app.css:326`, `:58`, `:240`).
   - In the theme, `--shadow-elevation` lives in `@theme inline`. Tailwind writes its formula into the utility, so `var(--elevation-line)` resolves on the element that uses it.
   - `kuiper.css` moves it to `:root` as a custom property. A `var()` inside a custom property is substituted where it is declared, then the computed value inherits. The build already works around this for `--code-*` and `--surface-*` by repeating them in `.dark` (`build-tokens.ts:107`, and the comment at lines 199–205).
   - A `.dark` subtree inside a light page is a supported pattern (`@custom-variant dark (&:is(.dark *))`, `app.css:8`; `class="dark surface-ink"`, `app.css:602`).
   - Failure: a page loads only `kuiper.css`; `<div class="dark"><div style="box-shadow: var(--shadow-elevation)">`. The hairline is `#857e70` (light `line-input`), not `#7a7366` (dark `paper-line-input`). T9 passes, because the value is the same string as `src/app.css`'s. The effect is one grey step, but it is a wrong value in a published file.
   - Fix: repeat `--shadow-elevation` in `kuiper.css`'s `.dark` block, as the build does for the surface copies; T9 then asserts it is there. Or leave it out, as a formula (decision 4 already calls it derived), and say so in the header. Either way, T17 gains the nested case.

2. **T7's fixture and the lint cannot both pass** (Design, "Byte identity", line 416; T7, line 457; criterion 19, line 493; `.prettierignore`; `package.json:27`).
   - The fixture is `JSON.stringify(readTokens(), null, 2)`, and T7 compares it "byte for byte".
   - `bun run lint` is `prettier --check .`. `.prettierignore` ignores `tests/fixtures/markdown/`, not `tests/fixtures/021-before/`. Prettier rewrites `JSON.stringify` output: `[4, 8, 12, …]` goes on one line (EXECUTED).
   - Failure: the builder writes the fixture as specified; criterion 19's lint fails. Formats it with prettier; T7 fails.
   - Fix: compare structure and key order, not bytes: `JSON.stringify(actual)` against `JSON.stringify(JSON.parse(fixture))`. `JSON.parse` keeps key order; the `Tokens` object has no integer-like keys, so nothing reorders. The mutation proofs still bite (a swapped role changes the order). Or name the folder in `.prettierignore`.

3. **The lowering adds a second field, and T7 does not allow it** (decision 3, line 82; Design step 6, line 407; T7, line 457).
   - Decision 3: "One field is added, `descriptions`." T7 compares `readTokens()` "less descriptions".
   - Design step 6 also builds `expressiveDarkMarks`, which today's object does not hold. The light `expressive-mark` four go nowhere.
   - Failure: built as designed, T7 fails on a key that is meant to be there.
   - Fix: say which shape carries the dark four (a top-level `expressiveDarkMarks`, or `expressive.darkMarks`), add it to decision 3, and have T7 drop both new fields before comparing.

4. **The bench rewrite is under-specified, and named by its old name** (decision 14, line 376; Scope, line 430; criterion 17, line 491; `scripts/bench/pluto.ts:50–61`, `:152–162`; `020` lines 307, 424, 474).
   - `020` renames the script `scripts/bench/kuiper.ts` (its criterion 16) and gives it a fallback for old commits (its test 19). This spec still says `pluto.ts` in three places.
   - Today the script also reports `primitives`, `themes`, `rolesPerTheme`, `groups` and `contrastPairs` from the one file. After the change, `tokens.primitives`, `tokens.themes` and `tokens.contrast` do not exist in `kuiper.tokens.json`. Each reads 0 or empty, silently.
   - Failure: the scorecard loop (criterion 21) runs the bench and sees 0 contrast pairs, which is row 5's (e). And `kuiper.ts --rev ea1f9bd` must still print the logged counts, which needs the old-shape path kept.
   - Fix: name `kuiper.ts`. State each of the bench's token fields on the new files (`primitive`, the light file's `role`, `kuiper.contrast.json`), keep the old-shape reading for commits without a resolver, and add "`020`'s test 19 still passes" to criterion 17.

5. **T16 asks the suite to fetch the live site** (decision 13, lines 360–362; T16, line 466; `src/lib/site/site.ts:21`).
   - The links are built from `SITE_REGISTRY`, which is the absolute `SITE_ORIGIN` address. `020` records that nothing is deployed, and `v0.13.0` will not be deployed while it is being built.
   - Failure: "each link returns 200" requests `https://pluto-systems-design….workers.dev/v0.13.0/r/tokens/kuiper.css`, which 404s, or reaches the network from a test.
   - Fix: T16 checks that each `href` starts with `SITE_REGISTRY`, then fetches its **path** from the test server and checks status and content type there.

6. **Q4's recommended reader does not prove conformance** (Q4, lines 546–550).
   - Terrazzo CLI 2.10.0 `tz check`, given a resolver, checked only the default context: a broken alias in the dark file passed. It accepted a `dimension` in `em`, which the format forbids. Given the base and dark files as plain inputs, it caught the alias (EXECUTED, `ajv/mini/`).
   - `@terrazzo/parser` has no binary, so "the parser, run with `bunx`" does nothing; the CLI is `@terrazzo/cli` (READ, its registry entry).
   - The published JSON schemas are the stricter reader. Ajv against them rejects the `em` dimension and accepts the spec's excerpts (EXECUTED, `ajv/validate.ts`). Carbon validates the same way (*DTCG* §4).
   - Fix: rewrite option 1. At the checkpoint, in a scratch folder outside the tree, at exact versions: (a) validate every token file against `format.json` and the resolver against `resolver.json` with Ajv; (b) run `tz check` once per flattened file, not on the resolver. Record both outputs in the landing notes. Nothing joins `bun.lock`. Keep option 1 recommended.

7. **Q2's vendor key assumes a domain nobody has confirmed** (Q2, lines 534–538; decision 4, line 129; *DTCG* §7; commit `bfbd6b6`; `src/lib/preview/code-samples.ts:303`).
   - `https://plutosystems.co` was the items' author until 0.7.0 (EXECUTED, `static/v0.7.0/r/styles/maia/chat.json`). Commit `bfbd6b6` (0.7.1, "registry author point at this repository") replaced it with the GitHub URL. Nothing in the tree today names the domain. The only reverse-domain use is sample content, `package co.plutosystems.sandbox;`, which `020` classes as sample content.
   - The format recommends a reverse domain the vendor controls (READ, Format §5.2.3). The key sits in every token's `$extensions`. Changing it after 0.13.0 changes every published file, and the record has no kind for it.
   - Fix: ask the owner the fact first: "Does Pluto Systems control `plutosystems.co`?" Then offer: (1) `co.plutosystems.kuiper`, if yes; (2) `io.github.plutosystemsco.kuiper`, a namespace the organisation verifiably holds (the `io.github.<org>` form that package registries accept for GitHub-verified owners), recommended if not; (3) another domain the owner names. State that the key, once shipped, is permanent.

8. **What `readTokens`'s argument means** (decision 14, line 370; Scope, lines 426–432; `scripts/tokens.ts:671`; `scripts/build-tokens.ts:839`; `scripts/lint-literals.ts:310`).
   - Today `readTokens(file = TOKENS_PATH)` reads one file. `build-tokens.ts` and `lint-literals.ts` pass `path.join(root, TOKENS_PATH)`, so the dev loop and the smoke copy read their own tree.
   - The new `readTokens` reads five files. The spec does not say whether the argument becomes a root, the resolver's path, or the base file's path with its siblings found beside it. `lint-literals.ts` is not in Scope.
   - Fix: give the signature (for example `readTokens(root = process.cwd())`, reading `tokens/kuiper.resolver.json` and the files it names, relative to the resolver), and add `scripts/lint-literals.ts` to decision 14 and Scope.

9. **The merge wording is half right** (decision 2, line 75; decision 7, lines 185–186; Risks, line 516; Resolver §4.1.4, §4.1.5.1, §6.2).
   - The Resolver module merges by token: "if a token is declared multiple times, the last occurrence in the array will be the final value". Its own Example 3 layers a high-contrast file over a scheme file, which must share groups. What it leaves unsaid is whether a later token replaces the earlier one whole or merges its properties.
   - So "flattening never depends on how the spec merges a group that two files share, which it does not say" overstates the gap. And `031`'s override file, as decision 7 plans it, shares the `role` group with the scheme file. That is fine under the stated rule; the spec should say it relies on it.
   - The base and scheme files do share root properties: `$schema`, `$description`, and (scheme files) `$extensions`. The flattened file's root is the scheme's. Say so.
   - Decision 7's "a modifier cannot read another" is true, but a second `contrast` modifier still works, because aliases resolve after flattening: its override file can alias per-scheme tokens. That is `031`'s choice. Decision 7 should not rule it out.
   - Decision 7's "a context name is the `data-scheme` value" and T1's "contexts equal `THEMES`" stop being true when `031` adds high-contrast contexts to the same modifier, since the scoped-schemes memo keeps contrast on the root, not on `data-scheme`. Word both as "each scheme context" and leave the rest to `031`. With that, nothing here needs reshaping for `029` or `031`.

10. **T13's rule, as worded, counts phantom names** (decision 10, line 321; T13, line 463).
    - "Each `cssVars` key ships as `--<key>` and `--color-<key>`." Applied to `cssVars.theme` too, it produces `--color-color-code-*` for the eight removed `color-code-*` theme keys: 32 names, not 24 (EXECUTED, `probe/removed.ts`).
    - Fix: "Each `cssVars.light` and `cssVars.dark` key ships as `--<key>` and `--color-<key>`; each `cssVars.theme` key, and each `--` key in `css`, as itself." Also say the versions are ordered as versions, not as strings (`v0.11.0` sorts before `v0.4.0` as text).

11. **The `em` and `vw` workaround breaks a SHOULD; say so** (decision 5, line 139; Risks, line 518; Format §5.2.3).
    - The format: tools and teams "SHOULD restrict their usage of extension data to optional meta-data that is not crucial to understanding that token's value". A unit is crucial to the value.
    - The workaround is still the best choice. No 2025.10 type carries `em` or `vw`, and a `dimension` in `rem` would be a different value. Fix: name the SHOULD in decision 5's *why*, and record the 18 tokens in the record's sense of "kind", so a later release that adds the units can migrate them as a type change.

12. **Write-ins.**
    - Line 6, Kind: "It adds no token." It adds eight DTCG tokens, `expressive-mark.mark-1` to `mark-4` in each scheme, and makes 48 primitive paths public. Fix: "It adds no CSS token. The script constant becomes four tokens per scheme (decision 6), and the primitives become DTCG paths (Q5)."
    - Line 150: the light `expressive-mark` four feed no output. Fix: add to decision 12's Kuiper rules: "light `expressive-mark.mark-n` aliases the same primitive as light `role.mark-n`", so the dead copy cannot drift; say it in their `$description`.
    - Line 276: "The backticks in four code words stay." Two code words hold backticks, `keyword` and `constant` (`words.ts:75`, `:80`). Fix: "in two code words".
    - Line 486, criterion 12: "equal their text before the change, but for the new section". Decision 14 (line 378) also rewrites the tokens page's first paragraph. Fix: "but for the first paragraph and the new section".
    - Line 377, decision 14: the brand pages' comments move to the new files, but `tests/unit/brand-sources.test.ts:23–24`'s `SOURCE` pattern names the base file only. No comment breaks today, because each also names a decision, but the pattern should accept `tokens/kuiper(\.[a-z]+)?\.tokens\.json`. Add the test to decision 14.
    - Line 343, decision 12, and T15: the lowering rebuilds the upper-case string, but the validator does not reject lower-case `hex`. A lower-case hex changes `registry.json`'s `cssVars`. Fix: the validator requires `^#[0-9A-F]{6}$`, and T15 gains "an 8-digit hex" (the old habit) and "a lower-case hex".
    - Line 532 and decision 10: `020`'s `RENAMES` already records renamed interface names (item, storage key, keyframes). Say that `kuiper.removed.json` covers custom properties and token paths only, and that `RENAMES` covers the rest, so `048` can join them.
    - Decision 15: the new-files bullet should say that from 0.13.0 the DTCG paths, primitives included, are an interface covered by the record (constitution §6).

13. **Q3 needs a source, whichever option** (Q3, lines 540–544; criterion 21, line 495; scorecard rubric row 12).
    - Option 1 has the constitution behind it: §3 calls the export "design variables". But the scorecard scores evidence. "Design tools that read DTCG import the file" names no tool, and no source.
    - Fix: keep option 1 recommended, with one READ citation of a named design tool's documentation that it imports DTCG 2025.10 files (a flattened file suffices). Without that, option 2. The Q4 checkpoint run can share the scratch folder.

## The open questions, judged

- **Q1, a resolver set.** Agree with option 1. It is the spec's own theme pattern (Resolver Example 3), Carbon's, and it validates (EXECUTED). Finding 9's wording fixes apart, it leaves room for `029` (it reads the two contexts) and `031` (new contexts or a second modifier).
- **Q2, the vendor key.** Do not recommend option 1 until the domain is confirmed (finding 7).
- **Q3, row 12 (b).** Option 1 with a cited source, else option 2 (finding 13).
- **Q4, a second reader.** Option 1, rewritten as finding 6 says: schema validation plus Terrazzo per flattened file.
- **Q5, public primitives.** Agree with option 1. The palette's structure is what a designer reads. The cost, record entries for primitive renames, is the lifecycle row 5 (f) asks for.

## Acceptance criteria, as written: can each be checked?

1. The format — yes (READ; the excerpts validate, EXECUTED).
2. Every colour — yes; the counts hold: 48, 61 × 2, 16, 8 × 2, 7 × 2, 4 × 2 (EXECUTED over today's file).
3. No forbidden unit — yes; 13 `em` and 5 `vw` confirmed (READ, the token file).
4. The schemes — yes; today's two maps are already in the same order (EXECUTED).
5. Descriptions — yes; 77 words, all matching T5 (EXECUTED).
6. The lowering — yes, once finding 8 gives the signature. "The four raw readers" counts six places in decision 14; name them.
7. Today's object — not as written (findings 2 and 3).
8. Byte-identical CSS — yes. The emission reads only the `Tokens` object, so an identical object gives identical bytes; `EXPRESSIVE_DARK_MARKS` is read through `tokens.primitives` (`build-tokens.ts:474`) either way (READ).
9. `kuiper.css` — checkable, but it passes with finding 1's wrong value.
10. The published files — yes. The registry swap replaces `r/styles/maia/` only (`build-registry.ts:51–63`, READ), and `static/r/` and `static/v*/` are prettier-ignored.
11. CSS names — yes.
12. The site reads the same — not as written (finding 12, line 486).
13. The record — yes, with finding 10's wording (EXECUTED: 24).
14. The validator — yes; add finding 12's two hex cases.
15. Any stack — yes; add finding 1's nested case.
16. The smoke loop — yes; the watcher watches the whole `tokens/` folder (`registry-watch.ts:16–21`, READ).
17. The bench — not as written (finding 4).
18. The changelog — yes.
19. The suites — not with finding 2 unfixed.
20. Tests first — yes.
21. The scorecard — yes for row 5 once finding 4 is fixed; row 12 per finding 13.

## Constitution checks

- §1, "published as plain CSS variables and as a DTCG file": met by design.
- §3, no design-tool kit: met. No design-tool file is kept; Q3 option 2 imports once, outside the tree.
- §4.1, source, not a package: met. Decision 13 says an app copies the file.
- §4.3, tokens are the one source: improved. The script constant moves into the files. The literal sizes left in `build-tokens.ts` are recorded as a finding to rank, not as a limit: right.
- §4.4, accessible and proven: T17 runs in three engines. Nothing here changes a pair.
- §4.5 and §4.6, pinned inputs, named dependencies: met. Nothing joins `bun.lock` under Q4 option 1.
- §6, no silent break: met for the CSS, which is unchanged. The DTCG paths become an interface at landing; finding 12's last item asks the changelog to say so.

## Verdict

Does not land yet: approve with changes. Findings 1 to 7 stand: the nested-dark elevation value in `kuiper.css`, the T7 fixture against the lint, the second `Tokens` field, the bench, T16's live fetch, the Q4 reader and the Q2 domain. Each is fixed in the text, with no redesign. The format, the resolver layout, the 24-name record and the byte-identity plan hold against the primary sources and the tree.

## Disposition

Not yet answered.
