# 022f — The code editor's budgets in Firefox

- **Status:** Open, **needs the design lead's ruling before it is built** (below). Ledgered in `tests/fault-ledger.ts`. Lane I, queued behind `023`.
- **Date:** 2026-11-15
- **Author:** `022`'s builder, for the design lead to open
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one item), if the ruling keeps one budget for every engine; otherwise a ruling recorded in `013`'s landing notes and a test edit.
- **Found by:** `022`'s local engine runs, 2026-11-15: `code.spec.ts`, "the editor agrees with the block › E7. the budgets, timed in the page: Python's first colour, 200 keystrokes in 5,000 lines; Ruby and Markdown in 2,000", in `firefox-light` and `firefox-dark`.

## The defect

E7 holds `code-editor` to `013`'s budgets: Python's first colour within 250 ms of loading 5,000 lines, and 200 keystrokes at 12 ms p95 and 50 ms at most. They were measured in Chromium. In Firefox the editor misses them on every run here: in the triage run the keystroke p95 was 80 ms against 12; in the confirmation runs the first colour was over 250 ms in both Firefox projects (the local machine was heavily loaded, load average 50 to 90 on 10 cores). Chromium and WebKit met every E7 budget under the same load. So the gap is Firefox's, not the machine's: in Firefox a user typing in a long file gets highlighting late and frames dropped.

## The ruling it needs

1. **Find and fix the cost in Firefox** (recommended first look: the incremental tree-sitter session's per-keystroke work and the WebAssembly calls under SpiderMonkey). The budgets stay one for every engine. This is the small change.
2. **Budgets per engine.** Firefox's measured on CI's Linux runner plus `013`'s margin, by a ruling with its measurement. A test edit, not an item change.

## The fix (option 1)

Profile E7 in Firefox, find where the keystroke and first-colour time go, and remove it in `src/lib/registry/ui/code-editor/` or the highlighter's session, with no interface change.

## The check

E7 in `firefox-light` and `firefox-dark`, failing today with `toBeLessThanOrEqual`. When the fix lands, its ledger lines (`change: "022f"`) are removed, or the run turns red.
