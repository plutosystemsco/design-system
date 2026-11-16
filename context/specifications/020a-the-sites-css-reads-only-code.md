# 020a — The site's CSS reads only code

- **Status:** Ready to build after `020`, before `021`.
- **Date:** 2026-11-15
- **Author:** the design lead
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one file). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Found by:** `020`'s build (Landing notes, deviation 4) and its change review (`reviews/020-the-kuiper-rename-pr-2026-11-15.md`, finding 8).

## The defect

`src/app.css` imports Tailwind with no `@source` rule, so Tailwind's automatic detection scans every file git tracks. That includes `context/`. Class names written in prose and research exhibits (specs, memos, the lockup and index-card exhibit pages) become rules in the site's built CSS. The change review found `.bg-fuchsia-950`, `.row-8` and `.row-15` in the built CSS, and in no file under `src/`.

The effects:

- **Page weight.** Every page carries rules that nothing uses. Each new spec or exhibit can add more, against `024`'s budgets.
- **Builds that depend on prose.** Editing a spec changes the site's CSS. `020`'s check 20 had to build its "before" side from `f9e1c1a` rather than from the tag for this reason, and `021`'s byte-identical CSS check would fail on any `context/` edit.
- **Installed apps are not affected.** The registry's theme item is generated from the tokens, not from the site's CSS.

## The fix

Add one line to `src/app.css`, directly after `@import "tailwindcss";`:

```css
@source not "../context";
```

(`@source not` is supported in Tailwind 4.1 and later; the repo pins 4.3.3. The builder confirms the path resolves from `src/app.css` to the repository's `context/`.)

The built site CSS loses the rules that came only from `context/`. Nothing in `src/` changes. Thumbnails do not change, because no item or example uses those classes. The builder records the before and after gzipped size of the site CSS in the Landing notes.

## The check

A unit test, `tests/unit/css-sources.test.ts`:

1. It runs Tailwind's own scanner (`@tailwindcss/oxide`'s `Scanner`, as `023`'s probe does) over the sources that `src/app.css` declares, then `compile(css).build(candidates)`.
2. It asserts that no class in the result is found **only** in files under `context/`. A fixture, a copy of a short `context/` file holding `bg-fuchsia-950`, proves the assertion reads the right sources.
3. It also asserts that `src/app.css` contains the `@source not "../context"` line, so the rule cannot be removed without the test saying why.

**Seen failing first:** on `020`'s tree, assertion 2 fails and names at least `bg-fuchsia-950`, `row-8` and `row-15`. The output goes in the Landing notes. After the fix, it passes.

The full e2e suite, the perf budgets and `bun run check` must stay green. Since the site's CSS only shrinks, no budget rises.

## Landing notes

Not yet landed.
