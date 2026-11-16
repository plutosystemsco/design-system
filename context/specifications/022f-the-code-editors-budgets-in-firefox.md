# 022f — The code editor's budgets in Firefox

- **Status:** Open, widened by the owner on 2026-11-16 to every engine (Landing notes, "The owner's ruling"). Was: the design lead ruled option 1 on 2026-11-15: find and fix the cost in Firefox; the budgets stay one for every engine. Ledgered in `tests/fault-ledger.ts`, now in all six projects. Lane I, queued behind `023`.
- **Date:** 2026-11-15
- **Author:** `022`'s builder, for the design lead to open
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one item). No research memo and no spec review. Its check is already seen failing; the built change is reviewed by someone who did not write it (constitution §5).
- **Found by:** `022`'s local engine runs, 2026-11-15: `code.spec.ts`, "the editor agrees with the block › E7. the budgets, timed in the page: Python's first colour, 200 keystrokes in 5,000 lines; Ruby and Markdown in 2,000", in `firefox-light` and `firefox-dark`.

## The defect

E7 holds `code-editor` to `013`'s budgets: Python's first colour within 250 ms of loading 5,000 lines, and 200 keystrokes at 12 ms p95 and 50 ms at most. They were measured in Chromium. In Firefox the editor missed them on every run here: in the triage run the keystroke p95 was 80 ms against 12; in the confirmation runs the first colour was over 250 ms in both Firefox projects. Chromium and WebKit met every E7 budget under the same conditions.

That evidence was taken at load average 50 to 90 on 10 cores, from other work on the machine. So the gap is probably Firefox's, but it is not yet measured at rest. If push B's Linux Firefox meets the budgets, the ledgered test passes and the run turns red; if it meets them in one of two attempts, it is flaky, and `failOnFlakyTests` turns the run red. Either is read as this known fault, and the ledger lines change with the measurement.

## The fix

1. **Measure first.** Run E7 in Firefox on a quiet machine (no other build, load average under 2), three times, or read push B's figures from its `firefox-*` shards' output (the `E7:` line). Record the first colour, the keystroke p95 and max, and Ruby's and Markdown's p95, beside Chromium's from the same machine.
2. **If Firefox misses the budgets at rest:** profile E7 in Firefox (the incremental tree-sitter session's per-keystroke work, and the WebAssembly calls under SpiderMonkey, first), find where the time goes, and remove it in `src/lib/registry/ui/code-editor/` or the highlighter's session, with no interface change. The budgets do not change.
3. **If Firefox meets them at rest:** the ledger lines go, and this change closes with the measurement as its record.

## The check

E7 in `firefox-light` and `firefox-dark`, failing today with `toBeLessThanOrEqual`. When the fix lands, its ledger lines (`change: "022f"`) are removed, or the run turns red.

## Landing notes

### The owner's ruling (2026-11-16): one fault, in every engine

The first `matrix` runs showed E7 missing its keystroke budget in Chromium and WebKit too, on CI's two-core runners: Python's p95 at 12.9 to 22.4 ms in Chromium and 23 to 53 ms in WebKit, against 12 (`research/2026-11-16-the-first-matrix-run.md`, group 2; `research/2026-11-16-the-third-matrix-run.md`, §2). Asked whether to fold E7 into this change, raise the budgets to CI's figures, or keep it red and profile, **the owner chose to fold it in:** one fault, whose budgets hold only on a quiet machine.

- E7's ledger line now covers all six projects, not Firefox's two. The finding reads: "On CI's two-core runners the editor's keystroke times miss 013's budgets in every engine; the budgets were set on a quiet machine."
- The budgets do not change. The measurement moves to the tag's quiet-machine run, beside `025`'s cost run (`handoff.md`, "Before the 0.13.0 tag"): E7 three times in every engine, at rest. If every engine meets the budgets there, the six lines go and this change closes on that record; if one misses, step 2 of "The fix" applies to that engine.
- **A risk the ruling accepts:** Chromium's misses are close to the line (12.9 ms in one attempt). A ledgered test that passes turns the run red (`022` decision 16), and one that passes on retry is flaky, which CI also fails. A red run on E7 alone in `chromium-*` reads as this fault meeting its budget on a faster runner, not as a new fault.
- Seen here, 2026-11-16: E7 in `chromium-light`, ledgered, failed as its line expects and counted as passed.

