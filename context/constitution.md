# Constitution

- **Status:** in force since 2026-10-27. Amended 2026-10-27 (§4.6 allows named dependencies) 2026-11-01 (§2 and §4.2: the goal names no single app, and "done" is proven in this repository) and 2026-11-14 (§3: the repository hosts one public design site) and 2026-11-15 (§1: the system is named the Kuiper Design System). Amended 2026-11-15 (`decisions.md`, "Kuiper is a public product, and the old limits go"): §1 and §2, Kuiper is a public product anyone can adopt, measured against the reference systems; §2, two more release conditions; §3, no design-tool kit; §4.2, breadth follows the roadmap; §4.4, accessibility is proven across three engines and screen readers; §4.5, apps may install with Bun, npm or pnpm; §5, a small-change track, checkpoint rulings in landing notes, and the scorecard; §6, migration notes and deprecation. Amended 2026-11-15 again: the owner retired `decisions.md` ("it isn't needed"); owner decisions now live in the specification, roadmap entry or rule they shape. Amended 2026-11-17 (the owner, from the visual-identity synthesis): §5, a change that moves pixels passes a visual review, and an identity change needs the owner's written yes.
- **Owner:** Pluto Systems, PBC
- **Scope:** every document, script and line of code in this repository, and everyone working on it. The other documents under `context/` obey this one. It changes only by the owner's decision, noted in its Status line.

## 1. Mission

The Kuiper Design System, Pluto Systems' design system, is a public product. It is the tokens, styles, Svelte components and guidance that Pluto Systems' applications are built from, and that any team may adopt. It is built for current and future needs.

It is delivered the way shadcn delivers components. An app copies the source in and owns it. The tokens and the theme are also published as plain CSS variables and as a W3C Design Tokens (DTCG) file, so any stack can take the brand.

## 2. The goal, stated so it can be checked

This repository is developed over time toward a system that stands beside the reference systems (Carbon, Material, Spectrum, Atlassian, Primer, Radix Themes, GOV.UK) in breadth, guidance, accessibility evidence and polish. Its docs, install path and governance are written for outside teams as well as Pluto Systems'. It has no final state. Each release is complete in itself, and a release is ready when all of these are true:

1. The brand's tokens (colour, type, spacing, radius, motion), as the owner has settled them, live here as one source, for every scheme the system serves. The Pluto Systems design book is their origin.
2. A shadcn-svelte-compatible registry is published. An app installs a component with shadcn-svelte's `add` command pointed at it and gets source files, with their dependencies resolved.
3. Every item in the registry has a page that meets the component page standard: live examples in every scheme, usage, API, keyboard, and an accessibility status generated from the tests.
4. Every specification the release carries is done: its acceptance criteria are met here, its built change is reviewed, and the release is tagged.
5. Every check the accessibility status reports passes for every item. Nothing is published with a failing status.
6. The benchmark scorecard is re-run, and its movement is recorded.

## 3. What this project is not

- Not a package an app imports at run time. An app owns its copy.
- Not a marketing site. It hosts one public design site: how to build with the system, and the Pluto Systems brand. The site's component pages show and test every item (§2.3); nothing on it sells a product.
- Not a CLI. A branded CLI may wrap the registry later, by a recorded decision.
- Not a design-tool kit. We design in code. The tokens are exported as design variables (§1); no component library is drawn in a design tool.

## 4. Hard constraints

1. **Source, not a package.** Nothing an app installs from here reaches back to this repository at run time.
2. **Driven by the roadmap.** A component is added when `roadmap.md` ranks it, from a current or future need and the reference systems' evidence. No named app is required. Its specification says why it is ranked, and cites the evidence. The component is done when its criteria are met here. An app's adoption is never a criterion.
3. **Tokens are the one source.** A colour or size in a component comes from a token, never a literal.
4. **Accessible by default, and proven.** Every item meets WCAG 2.2 AA in every scheme and under forced colours. Every interactive item works by keyboard. Every page is tested in Chromium, Firefox and WebKit. An item with a live region, a focus move or an overlay is checked with a screen reader, by script wherever a script can drive one. The evidence is published from the test run. A failing check fails the build. A specification that cannot meet this says so as a finding to fix, never as a limit to record.
5. **Every input is pinned** through `bun.lock`. This repository runs on Bun. An app that installs from it may use Bun, npm or pnpm, and the smoke test proves each.
6. **Dependencies are named and pinned.** A component that needs a library or a service says so in its registry item. Installing a component from shadcn-svelte's own registry is using a dependency as it is meant to be used (MIT), not copying prior art.

## 5. How we work

**Research → spec → review → tests → code → review** (`README.md`). Nothing lands unreviewed. Knowledge lives in this repository.

**A small change** is a fix that changes no interface, adds no token and no dependency, and touches one item or one page. It needs no research memo and no separate spec review. It is a specification of kind _small change_: the defect, the fix and the check, on one page. Its check is seen failing first. A reviewer who did not write it reviews the built change.

**A change that moves pixels** passes a visual review beside the change review. It attaches before-and-after screenshots. A reviewer who wrote neither the specification nor the change reads them against the written visual bar, and ranks each finding blocker, major, minor or polish. A blocker stops the landing. An identity change (faces, weights, palette, grid, art style, the signature device) also needs the owner's written yes, recorded in its landing notes.

A feature's build has a checkpoint. A ruling made there, and any owner's answer that shapes the work, is recorded in the specification's landing notes. A ruling that changes a rule goes into this constitution, `AGENTS.md` or `roadmap.md`. After each specification lands, the benchmark scorecard is re-run, and the change review cites its movement.

Four roles. One person may hold more than one, except that a reviewer never reviews what they wrote. The **owner** decides what the system is for and settles any question the other roles cannot. The **design lead** writes specifications and runs the pipeline. A **builder** implements one specification. A **reviewer** reads a specification or a built change fresh, having written neither.

## 6. Never

- Commit or push without the owner asking.
- Copy code from prior art.
- Break an installed app silently. A change to an item's interface says so in the changelog, with a migration note an app can follow. From 1.0, nothing is removed without a deprecation in an earlier minor release.
