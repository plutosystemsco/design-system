# The older rules, audited against the ambition

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** a researcher, at the design lead's request
- **Question:** Which rules in the constitution, `AGENTS.md`, `README.md`, `handoff.md`, `decisions.md` and the specifications were written for a smaller system, and should be kept, amended or removed now that Kuiper aims to stand beside Carbon and Material?
- **What would answer it:** every rule, refusal and constraint in those documents, read in full or by its Decisions and Limits sections, judged against the ambition in `decisions.md` ("A roadmap toward the reference systems", 2026-11-15) and the memos `2026-11-15-component-inventory.md` and `2026-11-15-component-page-standard.md`.
- **What it blocks:** the owner's instruction in `decisions.md`, "Toasts, the page standard, and questioning the old rules" (2026-11-15). Removals that touch nothing protected can be recorded on that instruction. Six questions go to the owner first.

## How to read this memo

- **READ:** every quoted rule, from the file named in its row, read on 2026-11-15.
- **EXECUTED:** the counts in "Also found", taken with `grep` over `context/` on 2026-11-15.
- **INFERRED:** every verdict, and every proposed wording. Nothing here is decided.

Three verdicts:

- **KEEP:** the rule still serves the ambition.
- **AMEND:** the intent stays; the wording changes. The new wording is given below.
- **REMOVE:** the rule holds the system back. What replaces it is given below.

Three flags mark rules that need the owner before they change:

- **A11y:** it protects accessibility.
- **Source:** it touches the source-not-a-package model, or what an installed app can rely on.
- **Owner:** it is a call the owner made personally.

A flagged KEEP needs no question. A flagged AMEND or REMOVE is asked below.

## The finding in short

- **84 rules read. 45 KEEP, 32 AMEND, 7 REMOVE.**
- **One rule does most of the holding back:** constitution §4.2, "driven by need". It ties breadth to a named Pluto app. The inventory memo still obeys it (its header: "Each specification it leads to still names the application that needs it"). It is amended, not dropped: the roadmap becomes the test.
- **One posture does the most harm to the accessibility evidence:** Firefox, Safari and screen readers are "recorded as limits, not as pending work". Eight specifications repeat it. It is removed in favour of a test matrix, which goes to the owner.
- **Many limits came from the design book, and the owner already freed them.** On 2026-11-01 the owner ruled that the book's "five laws, its colour budget, its motion budget and its ban list become prior art to weigh, not limits". That ruling reached the identity work. It never reached the specifications, which cite the book's §03, §05, §06 and §09 as binding 25 times in `002` to `005` alone. The motion, type, size and data-colour amendments below follow from extending it.
- **The protective core holds.** Source, not a package; tokens as the one source; contrast; never by colour alone; 24 px targets; the owner's brand calls (I5, H1, J2, J4, the spacing ladder, R23 and R24). All KEEP.
- **The process stays.** It gains a small-change track, and some of its paperwork moves out of `decisions.md`.

## All the rules

C is the constitution. P is process. S is scope and refusals. V is visual and writing rules. T is testing.

| ID  | Rule, as written                                                                                                                                                              | Where                                                                                                                 | What it protected                       | Verdict             | Flag        |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------- | ----------- |
| C1  | "the tokens, styles and Svelte components every Pluto Systems application is built from"; "developed over time to meet the needs of Pluto Systems, PBC"                       | constitution §1, §2                                                                                                   | focus on the company's own apps         | AMEND               | Owner       |
| C2  | "The brand's tokens … drawn from the Pluto Systems design book … for light and dark themes"                                                                                   | constitution §2.1                                                                                                     | one brand source                        | AMEND               |             |
| C3  | "Every item in the registry has a page that shows it, in both themes."                                                                                                        | constitution §2.3                                                                                                     | every item is seen                      | AMEND               |             |
| C4  | A release is ready when the four conditions of §2 hold; none names accessibility evidence                                                                                     | constitution §2                                                                                                       | a checkable release                     | AMEND               | A11y        |
| C5  | "Not a package an app imports at run time. An app owns its copy."                                                                                                             | constitution §3                                                                                                       | the source model                        | KEEP                | Source      |
| C6  | "Not a marketing site. It hosts one public design site … nothing on it sells a product."                                                                                      | constitution §3                                                                                                       | a site about building, not selling      | KEEP                | Owner       |
| C7  | "Not a CLI. A branded CLI may wrap the registry later, by a recorded decision."                                                                                               | constitution §3                                                                                                       | scope                                   | KEEP                |             |
| C8  | "Source, not a package. Nothing an app installs from here reaches back to this repository at run time."                                                                       | constitution §4.1                                                                                                     | apps own their copy                     | KEEP                | Source      |
| C9  | "Driven by need. A component is added when a Pluto Systems application needs it, and the specification that adds it says what the need is."                                   | constitution §4.2                                                                                                     | no speculative parts                    | AMEND               | Owner       |
| C10 | "Tokens are the one source. A colour or size in a component comes from a token, never a literal."                                                                             | constitution §4.3                                                                                                     | one place to change the brand           | KEEP                |             |
| C11 | "Accessible by default. Contrast meets WCAG 2.2 AA in both themes; every interactive component works by keyboard."                                                            | constitution §4.4                                                                                                     | users                                   | AMEND               | A11y        |
| C12 | "Every input is pinned through `bun.lock`."                                                                                                                                   | constitution §4.5                                                                                                     | reproducible builds                     | KEEP                |             |
| C13 | "Dependencies are named and pinned."                                                                                                                                          | constitution §4.6                                                                                                     | apps know what they install             | KEEP                | Source      |
| C14 | "Research → spec → review → tests → code → review … Nothing lands unreviewed."                                                                                                | constitution §5                                                                                                       | quality                                 | AMEND               |             |
| C15 | Four roles; "a reviewer never reviews what they wrote"                                                                                                                        | constitution §5                                                                                                       | a fresh read                            | KEEP                |             |
| C16 | Never commit or push unasked; never copy prior art                                                                                                                            | constitution §6                                                                                                       | the owner's control; licences           | KEEP                | Owner       |
| C17 | "Break an installed app silently. A component's change that alters its interface says so in its changelog."                                                                   | constitution §6                                                                                                       | installed apps                          | AMEND               | Source      |
| C18 | The components are Svelte                                                                                                                                                     | constitution §1; `AGENTS.md`                                                                                          | one framework done well                 | KEEP, asked         | Owner       |
| P1  | "No code without a specification, and no specification without its research."                                                                                                 | `AGENTS.md`                                                                                                           | quality                                 | AMEND               |             |
| P2  | "There is no list of open questions."                                                                                                                                         | `README.md`                                                                                                           | every choice made in a spec             | AMEND               |             |
| P3  | "A memo is never edited after the fact; a newer memo supersedes it."                                                                                                          | `README.md`                                                                                                           | an honest record                        | KEEP                |             |
| P4  | Every claim labelled EXECUTED, READ or INFERRED                                                                                                                               | `README.md`                                                                                                           | evidence                                | KEEP                |             |
| P5  | "A build has a checkpoint … a decision made at a checkpoint is recorded in `decisions.md`."                                                                                   | `README.md`                                                                                                           | the design lead sees work early         | AMEND               |             |
| P6  | Specifications "small enough for one builder"                                                                                                                                 | `README.md`                                                                                                           | reviewable changes                      | KEEP                |             |
| P7  | "The checks for the acceptance criteria are written first and seen failing."                                                                                                  | `README.md`                                                                                                           | tests that test                         | AMEND               |             |
| P8  | A document names a role, never a person; no external pointer                                                                                                                  | `README.md`; `decisions.md`, 2026-11-01                                                                               | privacy in a public repository          | KEEP                | Owner       |
| P9  | "All project knowledge lives in this repository"                                                                                                                              | `AGENTS.md`                                                                                                           | one memory                              | KEEP                |             |
| P10 | Owner questions with options, recommended first                                                                                                                               | `AGENTS.md`                                                                                                           | the owner's time                        | KEEP                |             |
| P11 | "Short sentences, one idea each; a term of art is defined the first time it is used."                                                                                         | `README.md`; `AGENTS.md`                                                                                              | clarity                                 | KEEP                |             |
| P12 | "The design lead edits a third of the components' prose … The change reviewer reads all 75"                                                                                   | `015` decision 17; `017` decision 8                                                                                   | the voice                               | AMEND               |             |
| P13 | "every `p`, `li`, `td` and `figcaption` carries one of two attributes: `data-claim` …"                                                                                        | `017` decision 2                                                                                                      | settled claims only                     | AMEND               |             |
| P14 | One transfer budget per page; "A budget never loosens without the design lead's ruling, recorded in `decisions.md`"                                                           | `015` decision 23; `018` decision 14                                                                                  | page weight                             | AMEND               |             |
| P15 | "The local `v0.12.0` tag waits until the owner has run `scripts/a11y/voiceover-error-summary.ts`, or listened"                                                                | `decisions.md`, 2026-11-15                                                                                            | a real screen-reader result             | AMEND               | A11y, Owner |
| P16 | Lint allowlists by file name, extended only by a specification ("A later dot-made item joins the list by a specification")                                                    | `002` decision 21 (L11, L13); `011` decisions 8, 10 (L23, L24)                                                        | narrow exceptions                       | AMEND               |             |
| P17 | "The rule for block copy: avoid those words and any hyphenated word that begins with a utility name"                                                                          | `003` decision 19                                                                                                     | a lint that reads every word as a class | REMOVE              |             |
| P18 | "The scorecard is re-run after every specification lands. Each change review cites its movement."                                                                             | `decisions.md`, 2026-11-15                                                                                            | measured progress                       | KEEP                | Owner       |
| S1  | "No toast. `sonner` is not served."                                                                                                                                           | `005` decision 14; `decisions.md`, 2026-11-01                                                                         | timers, tab stops, small targets        | REMOVE (done)       | A11y, Owner |
| S2  | "No notices region of our own. … An outcome that lands off-screen has no message of its own."                                                                                 | `005` decision 21; `006` decision 20                                                                                  | the same                                | REMOVE              | A11y        |
| S3  | "`scroll-area` is not served."                                                                                                                                                | `004` decision 1                                                                                                      | 24 px targets; keyboard and touch users | KEEP                | A11y        |
| S4  | "No ANSI colour. No consuming app's output carries escape codes"                                                                                                              | `decisions.md`, 2026-10-31; `004` decision 21                                                                         | scope for one app                       | AMEND               |             |
| S5  | "No markdown renderer is served."                                                                                                                                             | `005` decision 21; `006` decision 20                                                                                  | scope; unsafe HTML                      | AMEND               |             |
| S6  | "No `groove-e`: a right-hand sidebar is out of scope"                                                                                                                         | `005` decision 21; `006` decision 20                                                                                  | scope                                   | REMOVE              |             |
| S7  | "No rail (16 px and mouse-only), no `floating` or `inset` variant"                                                                                                            | `005` decision 10                                                                                                     | targets; fewer variants                 | AMEND               | A11y        |
| S8  | "Sign in is one step: email and password. No social, passkey or email-link sign-in in the first set."                                                                         | `003` decision 11                                                                                                     | a small first set                       | KEEP                |             |
| S9  | "Deployment is out of scope: no release is deployed"; "this repository has none"                                                                                              | `001` Intent; `003` decision 25                                                                                       | no hosting                              | REMOVE (superseded) |             |
| S10 | "It is not a website."                                                                                                                                                        | `001` Intent                                                                                                          | scope                                   | REMOVE (superseded) |             |
| S11 | "redirects of any kind" are out ("nothing is published, no need to redirect")                                                                                                 | `015` Intent; `decisions.md`, 2026-11-14                                                                              | speed before launch                     | AMEND               |             |
| S12 | "Identity only … A product accent waits for its own specification, written when a product needs one"                                                                          | `decisions.md`, 2026-11-01                                                                                            | one shared palette                      | KEEP                | Owner       |
| S13 | "This system's apps use Bun (constitution §4.5)."                                                                                                                             | `013` decision 23                                                                                                     | one tested path                         | AMEND               | Source      |
| S14 | "The token file is plain JSON of our own shape"                                                                                                                               | `001` decision 6                                                                                                      | a simple build                          | AMEND               |             |
| S15 | Delivery is the shadcn-svelte registry, "a CLI later"                                                                                                                         | `decisions.md`, 2026-10-27; constitution §2.2                                                                         | the source model                        | KEEP                | Source      |
| V1  | "`muted` and `accent` … are used only inside components … They are never a page, section or sidebar ground."                                                                  | `decisions.md`, 2026-10-27; `001` decision 8                                                                          | the book's three grounds                | AMEND               |             |
| V2  | "No state tint on `muted`, in either theme"; "State badges carry no tint"                                                                                                     | `001` decision 8; `002` R7                                                                                            | contrast                                | KEEP                | A11y        |
| V3  | "State is never told by colour alone."                                                                                                                                        | `001` decision 8; `002` R19                                                                                           | users                                   | KEEP                | A11y        |
| V4  | "State colour is outside the one-accent budget"; "one accent per surface"                                                                                                     | `decisions.md`, 2026-10-28; `003`                                                                                     | calm screens                            | KEEP                |             |
| V5  | "In light, the brand yellow is never text."                                                                                                                                   | `016` decision 4                                                                                                      | contrast                                | KEEP                | A11y        |
| V6  | "data figures cycle the four, blue first"; `chart-5` "a neutral fifth series; the design book allows no new hue"; C2 "The four colours appear together only in owned moments" | `001` decision 8; `decisions.md`, 2026-11-06                                                                          | the brand's colour budget               | AMEND               | Owner, A11y |
| V7  | I5: "Every product screen is flat: hairlines and flat fields, no shadow, no glass."                                                                                           | `decisions.md`, 2026-11-06                                                                                            | the brand                               | KEEP                | Owner       |
| V8  | R25: fields and glass only in expressive items; glass text in three roles only                                                                                                | `002` R25; `011` decision 12                                                                                          | brand; contrast                         | KEEP                | Owner, A11y |
| V9  | R11: "No `backdrop-*`. The design book §09 bans blur panels."                                                                                                                 | `002` decision 9                                                                                                      | flat screens                            | AMEND               |             |
| V10 | H1: "One 8 px case radius; round only for dot shapes"; avatars square                                                                                                         | `decisions.md`, 2026-11-06, 2026-10-28                                                                                | the brand                               | KEEP                | Owner       |
| V11 | Type on five steps (`xs`, `sm`, `base`, `2xl`, `5xl`); "the type scale has no step between"                                                                                   | `001` decision 11; `002` R13, L8; `003`                                                                               | the book's §04 scale                    | AMEND               |             |
| V12 | "Control heights sit on the ladder: 32 px (`sm`) and 48 px (default); no `lg`" ("A third height is a third rhythm")                                                           | `002` decision 10                                                                                                     | one rhythm                              | AMEND               |             |
| V13 | L7: `h-`, `w-`, `size-` only on ladder multipliers                                                                                                                            | `002` decision 21                                                                                                     | sizes on the ladder                     | AMEND               |             |
| V14 | "a 4 px atom with an 8 px rhythm. The ladder is 4, 8, 12, 16, 24, 32, 48, 64, 96, with nothing off it."                                                                       | `decisions.md`, 2026-10-27                                                                                            | rhythm                                  | KEEP                | Owner       |
| V15 | R21: every pointer target at least 24 × 24 px, "stricter than AA"                                                                                                             | `002` decision 9                                                                                                      | users                                   | KEEP                | A11y        |
| V16 | R18 sentence case; R23 copy says what happens; R24 furniture carries information                                                                                              | `002` decision 9                                                                                                      | the voice                               | KEEP                | Owner       |
| V17 | "No apology, no humour, no codes in the words"; `example.com` and Ada Lovelace                                                                                                | `003` decision 15                                                                                                     | the voice                               | KEEP                |             |
| V18 | "No page cites a specification, a decision, a review, `context/`, or a person"                                                                                                | `015` decision 17                                                                                                     | a public site                           | KEEP                |             |
| V19 | Code at regular weight, upright, no ligatures                                                                                                                                 | `decisions.md`, 2026-11-14, 2026-10-31                                                                                | honest code                             | KEEP                | Owner       |
| V20 | R12, L2: "`dark:` only where a token does not already switch"                                                                                                                 | `002` decision 9                                                                                                      | tokens as the one source                | KEEP                |             |
| V21 | "No status mark on components"                                                                                                                                                | `decisions.md`, 2026-11-15                                                                                            | no grades                               | KEEP                | Owner       |
| V22 | "The skeleton is static"; "The code input's caret does not blink"; a spinner only on the busy control                                                                         | `002` decision 3; `003`                                                                                               | no ambient motion                       | KEEP                | A11y        |
| V23 | "one entrance of at most 900 ms … and micro-feedback of at most 200 ms"                                                                                                       | `001` decision 14                                                                                                     | the book's §06 budget                   | AMEND               | A11y        |
| V24 | "Opening is a fade in … No zoom, no slide"; "The sheet fades; it does not slide"; "One motion for every overlay, no new keyframes"                                            | `002` decision 3; `decisions.md`, 2026-11-01                                                                          | the motion budget                       | AMEND               | A11y        |
| V25 | "No chart motion"; an accordion has "no animation"                                                                                                                            | `decisions.md`, 2026-10-31                                                                                            | the motion budget                       | AMEND               | A11y        |
| V26 | "No `tw-animate-css`."                                                                                                                                                        | `decisions.md`, 2026-10-28                                                                                            | motion from tokens                      | KEEP                |             |
| V27 | J2 "Every other animation answers the visitor and nothing else"; J4 springs for the dots only (L23)                                                                           | `decisions.md`, 2026-11-06                                                                                            | the brand; calm                         | KEEP                | Owner       |
| V28 | One entrance per page                                                                                                                                                         | `006`; `015` decision 8                                                                                               | calm                                    | KEEP                |             |
| V29 | "A block is real source, previewed live, never a picture."                                                                                                                    | `decisions.md`, 2026-10-28                                                                                            | truthful previews                       | KEEP                |             |
| V30 | Fields appear only on the home page, the landings and Brand                                                                                                                   | `decisions.md`, 2026-11-15 (`017` checkpoint)                                                                         | quiet component pages                   | KEEP                |             |
| T1  | "Firefox, Safari, iOS Safari and screen readers are not checked by this release and are recorded as limits, not as pending work."                                             | `decisions.md`, 2026-11-01; `003` d25, `004` d21, `005` d21, `006` d20, `007` d14, `013` d23, `015` d22; `handoff.md` | an honest claim of what was tested      | REMOVE              | A11y        |
| T2  | Accessibility status "is evidence, not a grade … A component that fails a check fails the build"                                                                              | `decisions.md`, 2026-11-15                                                                                            | users                                   | KEEP                | A11y, Owner |
| T3  | "A don't may show a real accessibility fault, rendered live but `inert`"                                                                                                      | `decisions.md`, 2026-11-15                                                                                            | honest teaching                         | KEEP                | A11y, Owner |

## What to amend, with the new wording

### The constitution

**C1, §1 and §2's opening (asked: Q1).** The text names one company's apps as the whole audience. A system that competes with Carbon is also judged by teams outside it.

- §1: "The Kuiper Design System, Pluto Systems' design system: the tokens, styles, Svelte components and guidance that Pluto Systems' applications are built from, and that any team may adopt. It is delivered the way shadcn delivers components. An app copies the source in and owns it."
- §2, first sentences: "This repository is developed over time toward a system that stands beside the reference systems in breadth, guidance, accessibility evidence and polish. Pluto Systems' needs set the order. It has no final state."

**C2, §2.1.** Since the identity rounds, the brand's values come from `decisions.md`, not the book.

- "The brand's tokens (colour, type, spacing, radius, motion), as settled in `decisions.md`, live here as one source, for every scheme the system serves. The Pluto Systems design book is their origin."

**C3, §2.3.** "Shows it, in both themes" is a bar the site already passed. The page standard is the new bar.

- "Every item in the registry has a page that meets the component page standard: live examples in every scheme, usage, API, keyboard, and an accessibility status generated from the tests."

**C4, §2, two more conditions.** The owner already ruled both (2026-11-15). The constitution should say so.

- "5. Every check the accessibility status reports passes for every item. Nothing is published with a failing status."
- "6. The benchmark scorecard is re-run, and its movement is recorded."

**C9, §4.2 (asked: Q1).** This is the rule that most holds the system back. Breadth waits on a named app, so the inventory's batches A to C would each need an app to claim them. Keep the part the owner added on 2026-11-01: done is proven here, never by adoption.

- "**Driven by the roadmap.** A component is added when `roadmap.md` ranks it, from a Pluto Systems application's need or from the reference systems' evidence. Its specification says which, and cites it. A component is done when its criteria are met here. An app's adoption is never a criterion."

**C11, §4.4 (asked: Q2).** AA contrast and keyboard are a floor, not evidence. Every reference system tests in more than one engine. Kuiper has never run Firefox or WebKit over its pages, or a screen reader over an item, except `019`'s pending listen.

- "**Accessible by default, and proven.** Every item meets WCAG 2.2 AA in every scheme and under forced colours. Every interactive item works by keyboard. Every page is tested in Chromium, Firefox and WebKit. An item with a live region, a focus move or an overlay is checked with a screen reader. The evidence is published from the test run. A failing check fails the build."

**C14, §5, and P1, `AGENTS.md`: a small-change track.** The pipeline stays for features. A one-line fix should not need a research memo, a spec review and a checkpoint.

- Add to §5: "**A small change** is a fix that changes no interface, adds no token and no dependency, and touches one item or one page. It needs no research memo and no separate spec review. It is a specification of kind _small change_: the defect, the fix and the check, on one page. Its check is seen failing first. A reviewer who did not write it reviews the built change."
- `AGENTS.md`: "No code without a specification, and no specification without its research, except a small change (constitution §5)."

**C17, §6 (asked: Q4).** Apps own their copies, so an upgrade is a hand merge. The references publish a deprecation policy. Kuiper's first rename (0.13.0) already needs a migration guide.

- "Break an installed app silently. A change to an item's interface says so in the changelog, with a migration note an app can follow. From 1.0, nothing is removed without a deprecation in an earlier minor release."

### Process

**P2, `README.md`.** `roadmap.md` will be a list of open work. Say so, and keep the rule's real point.

- "There is no list of open questions. `roadmap.md` lists the planned work and its order. A question we cannot yet answer gets a placeholder memo …" (the rest unchanged). Also add `roadmap.md` to the map.

**P5, `README.md`.** About a third of `decisions.md`'s entries are checkpoint and review rulings (see "Also found"). The owner's decisions are hard to find among them.

- "A specification of kind _feature_ has a checkpoint: the design lead looks at the half-built change, in the browser, before the builder goes on. A ruling made at a checkpoint is recorded in the specification's landing notes. `decisions.md` holds the owner's decisions, and those rulings of the design lead that change a rule or a budget."

**P7, `README.md`.** Several builds already had checks written after their code, accepted case by case.

- "The checks are written first and seen failing. A check written after its code is proven by mutation: the code is broken on purpose and the check is seen to fail. The landing notes say which."

**P12, the voice review.** At 150 items, one reviewer reading every page by hand does not scale. Much of R23 and R24 can be counted.

- "The voice checks that can be counted run as tests: banned words, sentence case, arrows, all-caps, caption length. The reviewer reads every page the change touches."

**P13, claim tracing.** Per-element `data-claim` suits nine Brand pages. It will not suit guidance on 150 component pages, which now lives in typed modules (`decisions.md`, 2026-11-15).

- "Brand pages keep `data-claim`. Component guidance is traced at its source: each entry in `src/lib/site/guidance/<item>.ts` names the decision, specification or memo it states in a `source` field. A test requires it. The site never shows it."

**P14, budgets.** Button's budget moved 360 → 365 → 370 → 375 → 380 kB in one day, each time by a ruling. The page standard will add pairs, anatomy figures and keyboard tables to every page. A per-page budget will keep being re-ruled.

- "A budget is set per page template (component, block, landing, Brand), from the heaviest measured page of that template plus a stated margin. A change that adds weight to every page states its cost in its specification. LCP and CLS budgets stay per template. A budget rises only by a ruling recorded with its measurement."

**P15, the screen-reader gate (asked: Q2).** A tag that waits on one person's laptop does not scale to a screen-reader check per item.

- "A screen-reader check runs by script wherever a script can drive it. A human listen is needed only where a specification names one; its result goes in the landing notes. From 0.13.0, a tag waits on automated checks only."

**P16, lint allowlists.** Each new round or dot-made item needs a specification to join a file-name list. That will not scale either.

- "An exception to a lint rule is declared in the item's `meta`, for example `meta.lint.allow: ["rounded-full"]`, with its reason. Review checks the reason when the item lands. Which rules allow exceptions, and why, stays in the specification that made the rule."
- L23 keeps its meaning: springs are for dot-made items (J4). Only the mechanism changes.

### Scope

**S4, ANSI.** The reason given is one app's output. Developer tools are in the inventory's batch E, and Pluto's platform has a CLI.

- "No ANSI colour yet. It joins the roadmap with the console and log items. When a specification adds it, each colour is measured on the code ground as the syntax roles are."

**S5, markdown.** A chat product and a docs product both need one.

- "No markdown renderer yet. It is on the roadmap. Its specification must sanitise what it renders and map every element to an item."

**S7, the sidebar.** The rail stays out, since it fails R21. The variants were trimmed for scope only.

- "No rail: a 16 px, mouse-only target fails R21. Floating and inset variants may be added by a specification."

**S11, redirects.** True while nothing was published. False from the first public release.

- "Before the first public release, pages move without redirects. After it, a page that moves leaves a redirect in `_redirects`."

**S13, package managers.** Outside teams will install with npm or pnpm. `013` found pnpm 10 blocks the grammar packages' install scripts.

- "This repository runs on Bun. An app that installs from it may use Bun, npm or pnpm. The smoke test installs into one scratch app per manager. An item whose dependencies need install scripts says so on its page."

**S14, the token file's shape.** Design tooling is a named gap in the roadmap decision. A standard export costs one script and keeps the source model, since nothing reaches back at run time.

- "The token file is plain JSON of our own shape. The build also writes it as a W3C Design Tokens (DTCG) file, so design tools can read it. That file is generated, never edited."

### Visual and writing rules

**V1, the muted ground.** The rule keeps `muted` honest, and that should stay. But it leaves no ground for a page header, a toolbar or a side panel, which data pages need (the inventory's batch C). Carbon solves this with named layers.

- "`muted` and `accent` are insets inside a component. A section ground (a page header, a toolbar, a side panel) is a named token of its own, added by its specification and measured for every text role it holds, in every scheme. No ground is borrowed for a job it was not named for."

**V6, data colour (asked: Q3).** Four hues and a grey cannot draw a dashboard with six series. The owner already ruled code colour "functional" and outside the colour budget (2026-11-01). Data colour is the same kind of thing.

- "Data colour is functional, as code colour is. Charts take a categorical palette of eight, led by the four brand hues, and sequential and diverging scales. Each is measured on every ground in every scheme. A series is never told by colour alone."

**V9, R11.** The rule is right. Its reason is out of date: glass now exists, by the owner's I9.

- "R11: No `backdrop-*` class in an item. Blur comes only from the `glass` utility, in expressive items (R25)."

**V11, type.** Five steps jump from 16 px to 28 px. Card titles, dialog titles and dense tables fall in the gap. The references use 12 to 15 type roles.

- "Type is a named scale in the token file. Today it holds five steps and the expressive display steps. A specification may add a step, such as 20 px for card and dialog titles, with its use and its line height. L8 reads the steps from the token file, as it does now."

**V12 and V13, control heights and sizes.** Two heights cover forms. Data tables and toolbars need a compact density. The 24 px floor stays.

- V12: "Control heights are size tokens: 32 px (`sm`) and 48 px (default) today. A specification may add a density, such as a compact 40 px control, with its use. No pointer target is under 24 px."
- V13: "Gaps stay on the owner's ladder. Sizes (`h-`, `w-`, `size-`) take a ladder multiplier, a keyword, a fraction or a size token. A new size is a token, never a literal."

**V23, V24 and V25, motion (asked: Q6).** The 200 ms budget and fade-only overlays come from the book's §06, which the owner made prior art on 2026-11-01. A sheet that slides from its edge tells a sighted reader where it came from and where it goes. Every reference slides its side sheets. J2 and J4 are the owner's and do not change.

- V23: "Motion durations are tokens, scaled to the size of the change: micro, at most 200 ms, for a control's response; surface, at most 300 ms, for an overlay, a sheet or a panel; and the one entrance, 900 ms. Under reduced motion every duration is 0."
- V24: "A sheet, a drawer and a toast move in from the edge they belong to, over the surface duration, and fade out. A dialog and a menu fade. Nothing zooms. Under reduced motion, everything appears in place."
- V25: "An accordion's panel may open by height over the micro duration. A chart may move its marks when its data changes, over the surface duration. Neither moves on its own. Under reduced motion, neither moves."

## What to remove, and what replaces it

**S1, no toast. Done.** The owner withdrew it (`decisions.md`, 2026-11-15). The toast specification replaces it. One stale echo is left: the inventory memo still recommends keeping the toast declined. Memos are not edited, so the roadmap should say the ruling superseded it.

**S2, no notices region.** It falls with S1. The toast specification's region replaces it, under the accessibility rules on timing (SC 2.2.1) and status messages (SC 4.1.3).

**S6, no right-hand sidebar.** A refusal for scope, not for users. It becomes a gap on the roadmap. `groove-e` comes with it.

**S9 and S10, "no deployment" and "not a website".** Both were superseded by the §3 amendment (2026-11-14) and `015`. Landed specifications are history and keep their text. `003` decision 25's "this repository has none" is now false, so no current document should repeat it.

**P17, copy that avoids utility words.** The lint reads every word of an item file as a class. So item copy must avoid "outline", "shadow" and "ring". `003` rejected a parser because it "costs more and helps less". With 150 items and guidance-heavy blocks, the balance has turned.

- Replace with: "The lint reads classes where classes are: `class` attributes, `class:` directives and the arguments of `cn`, `tv` and `clsx`, through Svelte's parser. Prose is never linted as classes." This needs its own specification, since the lint's counts change.

**T1, browsers and screen readers recorded as limits (asked: Q2).** This was honest when written. Repeated in eight specifications, it has become permission not to test. Carbon, Spectrum and GOV.UK test across engines and with screen readers.

- Replace with C11's matrix, and P15's automated screen-reader runs. A specification that cannot meet the matrix says so as a finding, not as a limit.

## Questions for the owner

Each question lists the rows it settles. The recommended option is first.

**Q1. Who is Kuiper for?** (C1, C9, S12)

1. **Recommended: Pluto Systems' apps first, built so any team can adopt it.** §1, §2 and §4.2 take the wording above. Breadth follows the ranked roadmap. Pluto's products keep one shared palette (your "identity only" ruling stands). An outside team themes Kuiper by editing the token copy it owns, and the site shows how.
2. **Pluto Systems' apps only, but breadth by the roadmap.** §4.2 changes; §1 stays.
3. **As written.** Every new component names the Pluto app that needs it.

**Q2. How much accessibility evidence?** (C11, T1, P15)

1. **Recommended: a full matrix from 0.13.0.** Every page in Chromium, Firefox and WebKit, in CI. Scripted screen-reader runs (VoiceOver on macOS, NVDA on Windows) for items with live regions, focus moves or overlays. One human listen per release, on the pilot set. A tag waits on automated checks only. The `v0.12.0` tag still waits on your `019` listen, as you ruled.
2. **Engines now, screen readers by hand.** Firefox and WebKit join CI. Screen readers stay a manual listen by you, per release.
3. **As written.** Chromium only; the rest recorded as limits.

**Q3. May charts use more than the four colours?** (V6)

1. **Recommended: data colour is functional, like code colour.** A categorical palette of eight, led by the four brand hues, plus sequential and diverging scales. Each is measured, and never the only signal.
2. **Four plus grey, with sequential scales of blue only.**
3. **As written.** Four hues and one grey.

**Q4. What do installed apps get when an item changes?** (C17)

1. **Recommended: a migration note always, and a deprecation window from 1.0.** Every interface change carries a note an app can follow, in the changelog and on the item's page. From 1.0, nothing is removed without a deprecation in an earlier minor release.
2. **Migration notes only.** No deprecation window, before or after 1.0.
3. **As written.** The changelog names the change.

**Q5. Svelte only?** (C18)

1. **Recommended: Svelte components, framework-free brand.** The components stay Svelte. The tokens and theme CSS are also published as plain CSS variables and a DTCG file (S14), so any stack can take the brand.
2. **Plan a React port after 1.0.**
3. **Svelte only, nothing else published.**

**Q6. May overlays move?** (V23, V24, V25)

1. **Recommended: motion scaled to the change.** Sheets, drawers and toasts slide in from their edge within 300 ms. Dialogs and menus fade. Accordions and chart data changes may move. Nothing zooms. Under reduced motion, nothing moves. J2 and J4 stand.
2. **Sheets and toasts slide; the 200 ms budget stays.**
3. **As written.** Every overlay fades within 200 ms.

## Also found

- **`handoff.md` is stale.** It is dated 2026-11-07 and names `v0.11.0` as the state. It says "Waiting on the owner: Nothing", while `019`'s VoiceOver listen waits on the owner (READ).
- **`decisions.md` mixes two kinds of entry.** Its first line calls it "The owner's answers and decisions". 25 of its 76 entry headings name a checkpoint, a review or the design lead's calls (EXECUTED, `grep '^### '`). P5 would move most of these to landing notes.
- **The design book's demotion never reached the specifications.** `002` to `005` cite its §03, §05, §06 or §09 as binding 25 times (EXECUTED, `grep`). The owner's 2026-11-01 ruling made those sections "prior art to weigh, not limits" for the identity. V6, V9, V11, V23, V24 and V25 extend that ruling to the components.
- **`roadmap.md` does not exist yet.** C9's new wording and P2 depend on it (EXECUTED, `ls`).

## Applied 2026-11-15

The owner answered the six questions (`../decisions.md`, "Kuiper is a public product, and the old limits go", 2026-11-15). The same entry applies the audit's other AMEND and REMOVE verdicts, on the owner's instruction to question the old rules. Two answers went further than this memo recommended:

- **Q1:** Kuiper is a public product anyone can adopt, built for current and future needs. No named app is required for a component.
- **Q6:** the motion budget is removed outright, not rescaled. Motion that is functional, or deliberately whimsical and welcoming, is allowed. Reduced motion is always honoured.

Q5 also settled design tooling: no Figma. We design in code, and the tokens are exported as design variables (DTCG).

Landed specifications and earlier memos keep their text as history. A rule below that came from one of them is changed by the decision entry. The next specification that touches its area carries the new wording.

| ID  | Outcome                                                                                                                                                            | Where it changed                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| C1  | Amended, past the recommendation: a public product any team may adopt, for current and future needs; tokens and theme also as CSS variables and DTCG               | `constitution.md` §1, §2                                          |
| C2  | Amended: tokens as settled in `decisions.md`, for every scheme; the book is their origin                                                                           | `constitution.md` §2.1                                            |
| C3  | Amended: every page meets the component page standard                                                                                                              | `constitution.md` §2.3                                            |
| C4  | Amended: two more release conditions (the accessibility status passes; the scorecard is re-run)                                                                    | `constitution.md` §2.5, §2.6                                      |
| C9  | Amended: driven by the roadmap, from current or future need and the references' evidence; no named app                                                             | `constitution.md` §4.2                                            |
| C11 | Amended: proven in Chromium, Firefox and WebKit, with scripted screen-reader checks; never recorded as a limit                                                     | `constitution.md` §4.4                                            |
| C14 | Amended: the small-change track; checkpoint rulings in landing notes; the scorecard after each landing                                                             | `constitution.md` §5; `AGENTS.md`; `README.md`                    |
| C17 | Amended: a migration note with every interface change; a deprecation window from 1.0                                                                               | `constitution.md` §6                                              |
| C18 | Kept, answered: components stay Svelte; the brand is published framework-free                                                                                      | `constitution.md` §1                                              |
| P1  | Amended: the small-change exception                                                                                                                                | `AGENTS.md`                                                       |
| P2  | Amended: `roadmap.md` is the list of planned work, not of open questions                                                                                           | `README.md`                                                       |
| P5  | Amended: checkpoint rulings go in landing notes; `decisions.md` keeps the owner's decisions and rule or budget changes                                             | `README.md`; `AGENTS.md`; `constitution.md` §5                    |
| P7  | Amended: a check written after its code is proven by mutation                                                                                                      | `README.md`, step 4                                               |
| P12 | Amended: countable voice checks become tests; the reviewer reads the pages a change touches                                                                        | `decisions.md` entry; next guidance specification                 |
| P13 | Amended: Brand keeps `data-claim`; guidance entries carry a `source` field                                                                                         | `decisions.md` entry; next guidance specification                 |
| P14 | Amended: budgets per page template                                                                                                                                 | `decisions.md` entry; next specification that sets a budget       |
| P15 | Amended, answered: from 0.13.0 a tag waits on automated checks only; `v0.12.0` still waits on the owner's `019` listen                                             | `decisions.md` entry; `constitution.md` §4.4; `handoff.md`        |
| P16 | Amended: lint exceptions declared in item `meta`                                                                                                                   | `decisions.md` entry; next lint specification                     |
| P17 | Removed: copy no longer avoids utility words once the lint reads classes through Svelte's parser                                                                   | `decisions.md` entry; a lint specification to build it            |
| S1  | Removed (already): a `toast` of Kuiper's own, on `status`                                                                                                          | `decisions.md`, 2026-11-15, both entries                          |
| S2  | Removed: the toast's region replaces it                                                                                                                            | `decisions.md` entry                                              |
| S4  | Amended: ANSI is a roadmap gap, not a refusal                                                                                                                      | `decisions.md` entry; `roadmap.md`                                |
| S5  | Amended: a markdown renderer is a roadmap gap, sanitised                                                                                                           | `decisions.md` entry; `roadmap.md`                                |
| S6  | Removed: a right-hand sidebar is a roadmap gap                                                                                                                     | `decisions.md` entry; `roadmap.md`                                |
| S7  | Amended: the rail stays out (R21); floating and inset variants by specification                                                                                    | `decisions.md` entry                                              |
| S9  | Removed (superseded): the site is deployed                                                                                                                         | already by the §3 amendment of 2026-11-14                         |
| S10 | Removed (superseded): "not a website"                                                                                                                              | already by the §3 amendment of 2026-11-14                         |
| S11 | Amended: after the first public release, a moved page leaves a redirect                                                                                            | `decisions.md` entry                                              |
| S13 | Amended: apps may install with Bun, npm or pnpm; the smoke test proves each                                                                                        | `constitution.md` §4.5                                            |
| S14 | Amended, answered: the token file becomes conformant DTCG, exported as design variables; no design-tool kit                                                        | `constitution.md` §1, §3; `decisions.md` entry                    |
| V1  | Amended: a section ground is a named, measured token of its own; `muted` stays an inset                                                                            | `decisions.md` entry                                              |
| V6  | Amended, answered: a functional data palette of eight categorical colours with sequential and diverging scales, measured for contrast and colour-blind distinction | `decisions.md` entry                                              |
| V9  | Amended: R11's reason is the `glass` utility and R25, not the book's §09                                                                                           | `decisions.md` entry; next specification that edits the checklist |
| V11 | Amended: type steps may be added by specification                                                                                                                  | `decisions.md` entry                                              |
| V12 | Amended: control heights are size tokens; a density may be added; 24 px floor kept                                                                                 | `decisions.md` entry                                              |
| V13 | Amended: sizes from the ladder or a size token; gaps stay on the owner's ladder                                                                                    | `decisions.md` entry                                              |
| V23 | Removed, past the recommendation: no motion budget; functional or deliberately whimsical and welcoming motion is allowed; reduced motion always honoured           | `decisions.md` entry                                              |
| V24 | Removed with V23: sheets and other overlays may slide; reduced motion means nothing moves                                                                          | `decisions.md` entry                                              |
| V25 | Removed with V23: accordions and charts may move; reduced motion means nothing moves                                                                               | `decisions.md` entry                                              |
| T1  | Removed, answered: the engine and screen-reader matrix replaces "recorded as limits"                                                                               | `constitution.md` §4.4; `decisions.md` entry; `handoff.md`        |

**Kept, unchanged:** C5, C6, C7, C8, C10, C12, C13, C15, C16; P3, P4, P6, P8, P9, P10, P11, P18 (P18 now also in `AGENTS.md` and `constitution.md` §5); S3, S8, S12, S15; V2, V3, V4, V5, V7, V8, V10, V14, V15, V16, V17, V18, V19, V20, V21, V22, V26, V27, V28, V29, V30; T2, T3. V22 and V27 stand beside the removed budget. Functional parts still run no ambient loops, and J4 still keeps springs for the dots. J2 now reads beside the owner's allowance for deliberately welcoming motion; the next motion specification states how the two meet.

**Also refreshed:** `handoff.md`, to today's state of 0.12.0; `README.md`'s map, which now lists `roadmap.md`.
