# 024c — Two component page headers hold still

- **Status:** written; ready to build after `024` lands. Lands before `030`, with `024b`, `024d`, `024e` and one re-base sweep (`roadmap.md` §3, "`024` before `030`").
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

None yet.
