# Handoff

- **Status:** replaced at each session's end.
- **Date:** 2026-10-27

## State

Specification `001`, the tokens and the registry, is **built** and uncommitted. The working tree holds the whole scaffold, the token file, the six registry items, the preview app, 15 test files and the two smoke fixtures, all green under Bun 1.3.14 (`specifications/001-tokens-and-the-registry.md`, Landing notes). The repository is still local only; `plutosystemsco/design-system` does not exist on GitHub. Nothing has been committed since `634ab09`. **The owner has not asked for a commit.** When asked, the commit should take the `context/` changes and the code together, as one landing of `001`.

## Done this session

- Specification `001` written, reviewed (`reviews/001-…-spec-2026-10-27.md`, 19 findings, all dispositioned), amended, built, reviewed again (`reviews/001-…-pr-2026-10-27.md`, 11 findings, all fixed), and re-verified by the orchestrating session.
- Two research memos: `research/2026-10-27-the-foundation-run-kit-3-fonts-and-the-theme-item.md` (SvelteKit 3 and `#lib`, font items, what a theme item can carry, the contrast arithmetic) and `research/2026-10-27-the-toolchain-under-bun.md` (every tool runs under Bun with `--bun`).
- Three owner decisions recorded in `decisions.md`: Bun is the runtime; a fourth ground for `muted`, insets only (delegated to the session as design lead); and, from before, the design book's open calls.
- The registry serves six items: `pluto-theme`, three font items, `utils`, `four-dot`. In development it is at `http://localhost:5173/r/styles/maia/` after `bun run dev`. An app installs with `REGISTRY_URL=http://localhost:5173/r bunx --bun shadcn-svelte@1.7.1 add four-dot -y -o`.

## Waiting on the owner

- **A commit**, if wanted. Suggested message: "001: the tokens and the registry, built".
- **Deployment** to `ui.plutosystems.co` (constitution §2.2 asks for a published registry). `wrangler.jsonc` is ready as an assets-only Worker; the deploy command, domain and route are a deployment specification's work, and the owner runs the deploy.
- **Two design-book calls still open**, to be asked when a specification needs them: the doc-ID scheme (`003`, the footer) and coloured dots on ink for the icon (whichever specification ships the icon files). The in-page mark already goes all paper in dark, per v2's written rule.

## Known risks

- An intermittent hang in the smoke harness's dev-server poll was seen 3 times early in verification and not since (13 clean runs after hardening). Root cause unknown. Any recurrence now prints the server log (`001` Landing notes, item 1).
- The Playwright browser cache in `~/Library/Caches/ms-playwright/` changed during this session (Chromium 1248 replaced 1234). Another project on an older Playwright will re-download its build.
- SvelteKit 3.1.0 is three weeks old and the registry feature is labelled experimental upstream. Both are pinned.

## Next

1. **`002`, the primitives:** button, badge, card, input, tabs, table, scroll-area, accordion, separator, code-block, skeleton, spinner. Research first: which stock maia items `wasi-python-dev`'s home page needs, their classes against the token rules in `001` decision 29 (`ring-ring/50`, `bg-input/30`, off-ladder spacing, translucent menus), and `bits-ui`'s current version. Then the spec, reviewed before build. The lint and the contrast test hold each restyled item to the tokens.
2. **`wasi-python-dev`'s home-page specification** installs `pluto-theme` and `four-dot` from localhost. Its commit closes `001` criterion 24 and makes `001` done.
3. **A deployment specification** when the owner wants the registry public: Cloudflare assets-only Worker, the versioned path, retaining older versions.
